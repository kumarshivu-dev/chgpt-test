import { useState, useMemo, useRef, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import "../document/document.css";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useSelector, useDispatch } from "react-redux";
import {
  setDocTableData,
  setOnRowExportBool,
  setIsSelectedProduct,
} from "../../../store/dashboard/documentTableSlice";
import { saveFileToDB } from "../../../utils/excelUtils";
import { setSelectedFile } from "../../../store/uploadSlice";
import trackActivity from "../../helper/dashboard/trackActivity";
import axios from "axios";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import * as XLSX from "xlsx/xlsx";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";

const DocumentTableDataImporter = ({
  user,
  onCloseModal,
  flag,
  isSelected,
  activateSnackbarModal,
}) => {
  const dispatch = useDispatch();
  const [documentData, setDocumentData] = useState([]);
  const [operationData, setOperationData] = useState([]);
  const [clickedRow, setClickedRow] = useState(null);
  const [saveDocumentData, setSaveDocumentData] = useState([]);
  const [errDoctData, setErrDocData] = useState(null);
  const [docTableLoader, setDocTableLoader] = useState(true);
  const userState = useSelector((state) => state.user);
  const personaState = useSelector((state) => state.hyperTarget);
  const brandIds = userState?.brandIdList;
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState([]);

  //handle serach query update
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

    // Ensure the debounced function is called with the latest value
    debouncedHandleSearch(value);
  };

  // Adjust debounce to accept arguments
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  };

  // Adjust handleSearch to accept searchQuery as an argument
  const handleSearch = (query) => {
    if (query.trim() === "") {
      setDocumentData(operationData);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filtered = operationData.filter(
        (doc) =>
          doc.username?.toLowerCase().includes(lowercasedQuery) ||
          doc.filename?.toLowerCase().includes(lowercasedQuery)
      );
      setDocumentData(filtered);
    }
  };

  // Debounced handleSearch function
  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 1000),
    [operationData]
  );

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const handleRowClick = (row) => {
    const newClickedRow = clickedRow === row.id ? null : row.id;
    setClickedRow(newClickedRow);
    setSaveDocumentData(row.original);
  };

  // fucntion to create excel file
  const createExcel = async () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(saveDocumentData?.products);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mysheet");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const file = new File([blob], saveDocumentData?.filename);
    const fileData = {
      user_email: user?.email,
      file_name: file.name,
      mime_type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      product_data: saveDocumentData?.products, // Save the product data instead of base64
      last_modified: file.lastModified,
      chosen_persona: personaState?.chosenPersona,
      generation_type: isSelected,
    };
    await saveFileToDB(fileData);
    dispatch(setSelectedFile(file));
  };

  const handleSaveDocumentImport = () => {
    const productExists = saveDocumentData.products.some(
      (product) => "product_id" in product
    );

    const imageExists = saveDocumentData.products.some(
      (product) => "image_id" in product
    );

    if (isSelected === "image" && !imageExists) {
      activateSnackbarModal(
        `Missing or incorrect column name "image_id"`,
        "error"
      );
      onCloseModal();
      return;
    }

    if (isSelected === "product" && !productExists) {
      activateSnackbarModal(
        `Missing or incorrect column name "product_id"`,
        "error"
      );
      onCloseModal();
      return;
    }
    if (flag === "enhancePage") {
      createExcel();
      onCloseModal();
    }

    dispatch(setDocTableData(saveDocumentData));
    dispatch(setOnRowExportBool(true));
    dispatch(setIsSelectedProduct(productExists));
    trackActivity(
      "IMPORT", // action
      saveDocumentData?.filename, // filename
      user, // user
      "", // editor_email
      userState?.userInfo?.orgId, // orgId
      null, // changed_role (pass null if you don't need it)
      null, // number_of_products (pass null if not applicable)
      null, // changed_chunking_type (pass null if not applicable)
      brandIds // brandIds (pass null if not applicable)
    );
    onCloseModal();
  };

  const getDocumentList = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
          "/dashboard/get/documents/list/v2",
        {
          headers: {
            Authorization: user.id_token,
          },
          params: {
            isFavourite: false,
          },
        }
      );

      // console.log("response on click save doc button: ", response.data);
      // Check if response status is true
      if (response?.data?.status === true) {
        setDocumentData(response?.data?.documents_attrs);
        setOperationData(response?.data?.documents_attrs);
        setErrDocData(null);
      }
      if (response?.data?.status === false) {
        setErrDocData(response?.data?.errorMessage);
      }
      setDocTableLoader(false);
    } catch (error) {
      console.error("Error while retrieving document list", error);
    }
  };

  useEffect(() => {
    getDocumentList();
  }, []);

  const columns = useMemo(() => [
    {
      header: "Title",
      accessorKey: "filename",
      cell: (props) => (
        <Box
          sx={{
            fontWeight: "bold",
            color: "#001B3F",
            maxWidth: "250px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {props.getValue()}
        </Box>
      ),
    },
    {
      header: "User",
      accessorKey: "username",
      cell: (props) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {props.getValue()}
        </Box>
      ),
    },
    {
      header: "Product Count",
      accessorKey: "product_count",
      cell: (props) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <EqualizerIcon />
          {props.getValue()}
        </Box>
      ),
    },
  ]);

  const table = useReactTable({
    data: documentData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Box>
      <Box className="filter-search-panel">
        <Box
          sx={{
            maxWidth: "100%",
            padding: "0 5px 15px 0",
          }}
        >
          <TextField
            fullWidth
            label="Search by user and title..."
            id="search-by-name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>
      </Box>
      {docTableLoader ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingBottom: "40px",
          }}
        >
          <CircularProgress size="3rem" />
        </Box>
      ) : (
        <Box className="save-table-container">
          <table className="document-table">
            <thead className="thead">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="thead-tr" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        className="thead-tr-td"
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <Box
                            sx={{
                              display: "flex",
                            }}
                          >
                            <Tooltip title="Sort">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </Tooltip>
                            {{
                              asc: <ArrowUpwardIcon />,
                              desc: <ArrowDownwardIcon />,
                            }[header.column.getIsSorted()] ?? null}
                          </Box>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody className="tbody">
              {errDoctData ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {errDoctData}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isClickedRow = row.id === clickedRow;
                  return (
                    <tr
                      key={row.id}
                      className="tbody-tr-doc"
                      style={{
                        backgroundColor: isClickedRow ? "#F9F9FF" : "inherit",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRowClick(row)}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td className="tbody-tr-td-import" key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Box>
      )}
      {clickedRow && (
        <Box
          className="document-import"
          sx={{
            paddingTop: "5px",
            paddingBottom: "5px",
            paddingRight: "5px",
          }}
        >
          <Button variant="contained" onClick={handleSaveDocumentImport}>
            <FileDownloadOutlinedIcon />
            <Typography>Import</Typography>
          </Button>

          <SnackbarNotifier
            open={snackbarState.open}
            onClose={() => setSnackbarState({ ...snackbarState, open: false })}
            message={snackbarState.message}
            severity={snackbarState.severity}
          />
        </Box>
      )}
    </Box>
  );
};

export default DocumentTableDataImporter;
