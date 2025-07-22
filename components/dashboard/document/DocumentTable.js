import { useState, useMemo, useRef, useEffect, memo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Checkbox,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import "./document.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedDocuments } from "../../../store/dashboard/documentTableSlice";
import { excelExport } from "../../helper/dashboard/productHelper";
import DeleteAcknowledgment from "./DeleteAcknowledgment";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import VertMenuActions from "./VertMenuActions";
import {
  POST_DELETE_DOCUMENT,
  POST_STAR_DOCUMENT,
} from "../../../utils/apiEndpoints";

//custom check box
function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <Checkbox
      indeterminate={indeterminate}
      // classes="indeterminate-Checkbox"
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
      style={{
        borderRadius: "15px",
        "&:hover": {
          borderColor: "red",
        },
        "&:checked": {
          color: "#022149",
          borderColor: "red",
        },
      }}
    />
  );
}

const DocumentTable = memo(
  ({
    documentData,
    onTableUpdate,
    user,
    errDoctData,
    isAllSelected,
    isFavListEmpty,
  }) => {
    const dispatch = useDispatch();
    const [rowSelection, setRowSelection] = useState({});
    const [selectedDocument, setSelectedDocument] = useState([]);
    const [modalRowData, setModalRowData] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const documnetState = useSelector((state) => state.documentTable);
    const selectedDocuments = documnetState?.selectedDocuments;
    const [snackbarState, setSnackbarState] = useState({
      open: false,
      message: "",
      severity: "success",
    });
    const [anchorPosition, setAnchorPosition] = useState({ x: null, y: null });
    const [clickedRowId, setClickedRowId] = useState(null);
    const [hoveredRowId, setHoveredRowId] = useState(null);

    // Add a state to track the screen width
    const [isMobileView, setIsMobileView] = useState(false);

    // Function to check the screen width
    const checkScreenWidth = () => {
      setIsMobileView(window.innerWidth <= 768); // Change the threshold according to your requirement
    };

    // Add event listener to listen for window resize events
    useEffect(() => {
      checkScreenWidth(); // Check screen width on initial render
      window.addEventListener("resize", checkScreenWidth); // Add event listener for window resize
      return () => {
        window.removeEventListener("resize", checkScreenWidth); // Clean up event listener on component unmount
      };
    }, []);

    const handleVerticalMenu = (event, rowData) => {
      setClickedRowId(rowData.id);
      setAnchorPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    const handleClose = () => {
      setAnchorPosition({ x: null, y: null });
    };

    const onRowCheck = (flag, row, isSelected) => {
      const updatedRow = { ...row.original, id: row?.id };

      if (flag !== "table") {
        const updatedDocument = isSelected
          ? selectedDocument.filter(
              (item) => String(item.id) !== String(row.id)
            )
          : [...selectedDocument, updatedRow];

        setSelectedDocument(updatedDocument);
        dispatch(setSelectedDocuments(updatedDocument));
      } else {
        const modifiedDocumentData = documentData.map((item, index) => ({
          ...item,
          id: index,
        }));
        setSelectedDocument(isSelected ? [] : modifiedDocumentData);
        dispatch(setSelectedDocuments(isSelected ? [] : modifiedDocumentData));
      }
    };

    const handleUncheckAll = () => {
      setSelectedDocument([]);
      setRowSelection({});
    };

    const handleRowExport = (rowData) => {
      const productsToExport = rowData?.original?.products;
      const nameToExport = rowData?.original?.filename;
      excelExport(productsToExport, nameToExport);
    };

    const handleDeleteClick = (rowData) => {
      setClickedRowId(rowData.id);
      setModalRowData(rowData?.original);
      setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmed = async () => {
      try {
        const fileName = [modalRowData?.filename];
        const data = {
          filenames: fileName,
          orderedUserIds: [modalRowData?.userId],
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${POST_DELETE_DOCUMENT}`,
          data,
          {
            headers: {
              Authorization: user.id_token,
            },
          }
        );

        if (response?.data?.status === true) {
          onTableUpdate();
          activateSnackbar("Documents deleted successfully.", "success");
        } else {
          activateSnackbar(
            response?.data?.errorMessage || "Failed to delete documents.",
            "error"
          );
        }
      } catch (error) {
        // console.error("Error while Deleting Document", error);
        activateSnackbar(
          "Error while deleting documents. Please try again.",
          "error"
        );
      } finally {
        setShowDeleteConfirmation(false); // Close the DeleteAcknowledgment dialog
      }
    };

    const handleDeleteCancel = () => {
      setShowDeleteConfirmation(false);
      setClickedRowId(null);
    };

    const handleFavouriteClick = async (rowData) => {
      const isFavourite = rowData?.original?.isFavourite;
      const data = {
        favouriteDocumentAttrs: [
          {
            userId: rowData?.original?.userId,
            documentList: [rowData?.original?.filename],
            isFavourite: !isFavourite,
          },
        ],
      };

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${POST_STAR_DOCUMENT}`,
          data,
          {
            headers: {
              Authorization: user.id_token,
            },
          }
        );

        // console.log("response after making it Favorite: ", response);
        if (response?.data?.status === true) {
          const message = !isFavourite
            ? "Document is starred successfully."
            : "Document removed from starred successfully.";
          activateSnackbar(message);
          onTableUpdate();
        } else {
          activateSnackbar(
            response?.data?.errorMessage ||
              "Failed to mark document as favorite.",
            "error"
          );
        }
      } catch (error) {
        console.log("error while making it fav  ", error);
        activateSnackbar(
          "Error while marking document as favorite. Please try again later.",
          "error"
        );
      }
    };

    const activateSnackbar = (message, severity = "success") => {
      setSnackbarState({
        open: true,
        message: message,
        severity: severity,
      });
    };

    // const formatDate = (inputDate) => {
    //   const date = new Date(inputDate);
    //   const monthNames = [
    //     "Jan",
    //     "Feb",
    //     "Mar",
    //     "Apr",
    //     "May",
    //     "Jun",
    //     "Jul",
    //     "Aug",
    //     "Sep",
    //     "Oct",
    //     "Nov",
    //     "Dec",
    //   ];
    //   const day = date.getDate();
    //   const monthIndex = date.getMonth();
    //   const year = date.getFullYear();
    //   const hours = date.getUTCHours();
    //   const minutes = date.getUTCMinutes();
    //   return `${monthNames[monthIndex]} ${day < 10 ? "0" : ""}${day}, ${year} ${
    //     hours < 10 ? "0" : ""
    //   }${hours}:${minutes < 10 ? "0" : ""}${minutes} hrs`;
    // };

    const formatDate = (inputDate) => {
      // Parse the input date as UTC
      const date = new Date(inputDate);

      // Extract local date components
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      // Array of month names
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      // Format the date in the local time zone
      return `${monthNames[monthIndex]} ${day < 10 ? "0" : ""}${day}, ${year} ${
        hours < 10 ? "0" : ""
      }${hours}:${minutes < 10 ? "0" : ""}${minutes} hrs`;
    };

    useEffect(() => {
      if (selectedDocuments.length === 0) {
        handleUncheckAll();
      }
    }, [selectedDocuments]);

    const columns = useMemo(() => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
              onClick: () =>
                onRowCheck("table", "", table.getIsAllRowsSelected()),
            }}
          />
        ),
        cell: ({ row }) => (
          <Box>
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
                onClick: () => onRowCheck("row", row, row.getIsSelected()),
              }}
            />
          </Box>
        ),
      },
      {
        id: "fav",
        header: "",
        cell: (props) => {
          const isFavourite = props?.row?.original?.isFavourite;
          return (
            <Box>
              <StarRoundedIcon
                sx={{
                  cursor: "pointer",
                  color: isFavourite ? "#022149" : "#808080",
                  transition: "color 0.3s", // Add transition for smooth color change
                  ":hover": {
                    color: "#022149", // Change color on hover
                  },
                  paddingTop: "10px",
                }}
                onClick={() => handleFavouriteClick(props?.row)}
              />
            </Box>
          );
        },
      },
      {
        header: "Title",
        accessorKey: "filename",
        cell: (props) => (
          <Box
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: "Medium",
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
              maxWidth: 150,
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {props.getValue()}
          </Box>
        ),
      },
      {
        header: "Date Created",
        accessorKey: "date_created",
        cell: (props) => <>{formatDate(props.getValue())}</>,
      },
      {
        header: "Last Edited",
        accessorKey: "last_edited_on",
        cell: (props) => <>{formatDate(props.getValue())}</>,
      },
      {
        header: "Product Count",
        accessorKey: "product_count",
        cell: (props) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <EqualizerRoundedIcon />
              {props.getValue()}
            </Box>
          );
        },
      },
      {
        id: "actions",

        cell: (props) => {
          const rowId = props.row.id;
          const isHovered = hoveredRowId === rowId;
          const isClicked = clickedRowId === rowId;
          return (
            <Box
              sx={{
                position: "relative",
                width: "80px",
                bottom: "12px",
              }}
            >
              {isMobileView && ( // Render actions always on mobile view
                <>
                  <FileDownloadOutlinedIcon
                    fontSize="small"
                    sx={{
                      cursor: "pointer",
                      color: "#808080",
                      transition: "color 0.3s",
                      zIndex: 1,
                      ":hover": {
                        color: "#000",
                      },
                    }}
                    onClick={() => handleRowExport(props.row)}
                  />
                  <DeleteIcon
                    fontSize="small"
                    sx={{
                      cursor: "pointer",
                      color: "#808080",
                      transition: "color 0.3s",
                      zIndex: 1,
                      ":hover": {
                        color: "#000",
                      },
                    }}
                    onClick={() => handleDeleteClick(props.row)}
                  />
                  <MoreHorizIcon
                    fontSize="small"
                    sx={{
                      cursor: "pointer",
                      color: "#808080",
                      transition: "color 0.3s",
                      zIndex: 1,
                      ":hover": {
                        color: "#000",
                      },
                    }}
                    onClick={(event) => handleVerticalMenu(event, props.row)}
                  />
                </>
              )}
              {!isMobileView && ( // Render actions only on hover for non-mobile view
                <>
                  <Box
                    display={isHovered ? "block" : "none"}
                    position="absolute"
                    transform="translateY(-50%)"
                  >
                    <FileDownloadOutlinedIcon
                      fontSize="small"
                      sx={{
                        cursor: "pointer",
                        color: "#808080",
                        transition: "color 0.3s",
                        zIndex: 1,
                        ":hover": {
                          color: "#000",
                        },
                      }}
                      onClick={() => handleRowExport(props.row)}
                    />
                  </Box>
                  <Box
                    display={isHovered ? "block" : "none"}
                    position="absolute"
                    top="50%"
                    left="30px"
                    transform="translateY(-50%)"
                  >
                    <DeleteIcon
                      fontSize="small"
                      sx={{
                        cursor: "pointer",
                        color: "#808080",
                        transition: "color 0.3s",
                        zIndex: 1,
                        ":hover": {
                          color: "#000",
                        },
                      }}
                      onClick={() => handleDeleteClick(props.row)}
                    />
                  </Box>
                  <Box
                    display={isHovered ? "block" : "none"}
                    position="absolute"
                    top="50%"
                    left="60px"
                    transform="translateY(-50%)"
                  >
                    <MoreHorizIcon
                      fontSize="small"
                      sx={{
                        cursor: "pointer",
                        color: "#808080",
                        transition: "color 0.3s",
                        zIndex: 1,
                        ":hover": {
                          color: "#000",
                        },
                      }}
                      onClick={(event) => handleVerticalMenu(event, props.row)}
                    />
                  </Box>
                </>
              )}
              {isClicked && showDeleteConfirmation && (
                <DeleteAcknowledgment
                  onDeleteConfirmed={handleDeleteConfirmed}
                  onCancel={handleDeleteCancel}
                />
              )}
              {clickedRowId === rowId && (
                <VertMenuActions
                  anchorPosition={anchorPosition}
                  onClose={() => handleClose()}
                  rowData={props?.row?.original}
                  onTableUpdate={onTableUpdate}
                  user={user}
                />
              )}
            </Box>
          );
        },
      },
    ]);

    const table = useReactTable({
      data: documentData,
      columns,
      state: {
        rowSelection,
      },
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      debugTable: true,
      autoResetPageIndex: !isAllSelected,
    });

    return (
      <>
        <Box className="document-container">
          <table className="doc-table">
            <thead className="thead-doc">
              {table.getHeaderGroups()?.map((headerGroup) => (
                <tr className="thead-tr-doc" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <td
                        className="thead-tr-td"
                        key={header.id}
                        colSpan={header.colSpan}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </>
                        )}
                      </td>
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
                // Render rows when there are records
                table.getRowModel()?.rows?.map((row) => {
                  const isRowSelected = row.getIsSelected();
                  return (
                    <tr
                      key={row.id}
                      className="tbody-tr-doc"
                      style={{
                        backgroundColor: isRowSelected ? "#F9F9FF" : null,
                      }}
                      onMouseEnter={() => setHoveredRowId(row.id)}
                      // onMouseLeave={() => setHoveredRowId(null)}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <td className="tbody-tr-td" key={cell.id}>
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

        <Box
          // className="doc-table-pagination-container"
          sx={{
            display: "flex",
            alignItems: "center",
            // flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Typography>Page</Typography>
            <Typography minWidth="45px">
              {isFavListEmpty || documentData?.length === 0 ? (
                <b>0 of 0</b> // Show 0 of 0 when no data or fav list is empty
              ) : (
                <b>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </b>
              )}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage() || isFavListEmpty} // Disable if fav list is empty
                sx={{
                  minHeight: 0,
                  minWidth: 0,
                  padding: "0 12px",
                }}
              >
                {"<"}
              </Button>
              <Button
                variant="outlined"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage() || isFavListEmpty} // Disable if fav list is empty
                sx={{
                  minHeight: 0,
                  minWidth: 0,
                  padding: "0 12px",
                  marginLeft: "5px",
                }}
              >
                {">"}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{ display: "flex", alignItems: "center", marginLeft: "15px" }}
          >
            <Typography variant="text">Row per Page:</Typography>
            <Select
              className=""
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              sx={{
                boxShadow: "none",
                ".MuiOutlinedInput-notchedOutline": { border: 0 },
                "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    border: 0,
                  },
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <MenuItem key={pageSize} value={pageSize}>
                  {pageSize}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        <SnackbarNotifier
          open={snackbarState.open}
          onClose={() => setSnackbarState({ ...snackbarState, open: false })}
          message={snackbarState.message}
          severity={snackbarState.severity}
        />
      </>
    );
  }
);

export default DocumentTable;

{
  /* <Button
          className="table-btnt io-btn pagination-btns"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          sx={{
            textTransform: "none",
            borderRadius: "5px",
            backgroundColor: "#d77900",
            border: "1px solid #ccc",
            marginRight: "10px",
            "&:hover": {
              color: "white",
            },
          }}
        >
          {">>"}
        </Button> */
}

{
  /* <Box className="doc-pagination-nav-btn"></Box> */
}
{
  /* <Button
          className="table-btnt io-btn pagination-btns"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          sx={{
            textTransform: "none",
            borderRadius: "5px",
            backgroundColor: "#d77900",
            border: "1px solid #ccc",
            marginRight: "10px",
            "&:hover": {
              color: "white",
            },
          }}
        >
          {"<<"}
        </Button> */
}
