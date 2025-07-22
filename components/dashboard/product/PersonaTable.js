import { useState, useMemo } from "react";
import React from "react";
import { useSelector } from "react-redux";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  Modal,
  Tooltip,
} from "@mui/material";
import "./product.css";
import { Circle, TipsAndUpdates } from "@mui/icons-material";

const PersonaTable = ({
  tableData,
  handleRowClick,
  isResultPage,
  isSEO,
  isTaxonomy,
}) => {
  const userState = useSelector((state) => state?.user);
  const uploadState = useSelector((state) => state.uploadpage);
  const complianceDataState = useSelector((state) => state.compliance);
  const [currentTableData, setCurrentTableData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const url = new URL(window.location.href); 
  const params = new URLSearchParams(url.search);
  const isBlogFile = params.has("getBlogFileName");

  let isFreeBasicFlag =
    userState?.userPlan?.startsWith("chgpt-basic") ||
    userState?.userPlan?.startsWith("chgpt-free");

  const requiredFields = {
    product_id: "product_id",
    product_name: "product_name",
    brand: "brand",
  };

  // Flag to determine whether to display the 'persona match' column based on the presence of persona suggestions in the data
  const showPersonaSuggestion = tableData?.some(
    (data) => data?.persona_match !== ""
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [concern, setConcern] = useState("");

  const handleOpenModal = (productId) => {
    const ncwarning = complianceDataState?.data || [];
    const item = ncwarning?.find((data) => data?.product_id === productId);
    // If a matching item is found, set the concern and open the modal
    if (item) {
      setConcern(item?.concern);
      setModalOpen(true);
    }
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const resultColumns = useMemo(() => {
    const isColumnEmpty = (key) =>
      tableData?.every((row) => !row[key] || row[key].toString().trim() === "");

    const columns = [
      {
        header: () => (
          <span className="column-header" style={{ marginRight: "30px" }}>
            Product ID
          </span>
        ),
        accessorKey: "product_id",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Channel Name</span>,
        accessorKey: "channel",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Persona Name</span>,
        accessorKey: "persona",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Product Name</span>,
        accessorKey: "product_name",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Product Description</span>,
        accessorKey: "product_description",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature bullet 1</span>,
        accessorKey: "feature_bullet1",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature Bullet 2</span>,
        accessorKey: "feature_bullet2",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature Bullet 3</span>,
        accessorKey: "feature_bullet3",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature Bullet 4</span>,
        accessorKey: "feature_bullet4",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature Bullet 5</span>,
        accessorKey: "feature_bullet5",
        cell: (props) => props.getValue(),
      },
      !isColumnEmpty("seo_meta_title") && {
        header: <span className="column-header">SEO Meta Title</span>,
        accessorKey: "seo_meta_title",
        cell: (props) => (
          <Tooltip title="">
            <span style={{ color: "initial", userSelect: "auto" }}>
              {props.getValue()}
            </span>
          </Tooltip>
        ),
      },
      !isColumnEmpty("seo_meta_description") && {
        header: <span className="column-header">SEO Meta Description</span>,
        accessorKey: "seo_meta_description",
        cell: (props) => (
          <Tooltip title="">
            <span style={{ color: "initial", userSelect: "auto" }}>
              {props.getValue()}
            </span>
          </Tooltip>
        ),
      },
      {
        header: <span className="column-header">Taxonomy</span>,
        accessorKey: "Taxonomy",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Status</span>,
        accessorKey: "status",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Input Brand</span>,
        accessorKey: "brand",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Input Keywords</span>,
        accessorKey: "input_keywords",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">SEO Keywords</span>,
        accessorKey: "seo_keywords",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Excluded Keywords</span>,
        accessorKey: "exclude_keywords",
        cell: (props) => props.getValue(),
      },
      {
        header: (
          <span className="column-header">Input Product Description</span>
        ),
        accessorKey: "input_product_description",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Persona Match</span>,
        accessorKey: "persona_mismatch",
        cell: (props) => {
          const isDefaultPersona = props?.row?.original?.persona === "Default";
          const isMatch = props?.row?.original?.persona_match;
          return (
            <Box>
              <Tooltip
                title={
                  isMatch === "No"
                    ? props?.row?.original?.persona_suggestion
                    : ""
                }
              >
                {isDefaultPersona ? (
                  <TipsAndUpdates sx={{ color: "orange" }} />
                ) : (
                  <Circle sx={{ color: isMatch === "No" ? "red" : "green" }} />
                )}
              </Tooltip>
            </Box>
          );
        },
      },
    ].filter(Boolean);

    return columns;
  }, [tableData]);

  const table = useReactTable({
    data:
      tableData?.length > currentTableData?.length
        ? tableData
        : currentTableData,
    columns: resultColumns,
    initialState: {
      grouping: ["product_id"],
    },
    state: {
      rowSelection,
      columnVisibility: {
        product_description: !isResultPage ? uploadState.seo : true,
        seo_meta_title: uploadState.seo,
        seo_meta_description: uploadState.seo,
        Taxonomy: isResultPage
          ? uploadState.premium
            ? isTaxonomy
            : false
          : false,
        status: isResultPage,
        input_product_description: isResultPage && uploadState.seo,
        feature_bullet1: !isResultPage ? uploadState.seo : true,
        feature_bullet2: !isResultPage ? uploadState.seo : true,
        feature_bullet3: !isResultPage ? uploadState.seo : true,
        feature_bullet4: !isResultPage ? uploadState.seo : true,
        feature_bullet5: !isResultPage ? uploadState.seo : true,
        persona_mismatch: isResultPage && showPersonaSuggestion,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    debugTable: true,
    autoResetPageIndex: false,
  });

  const allSubRows = table.getRowModel().rows.flatMap((parentRow) =>
    parentRow.subRows.map((subRow) => ({
      parentId: parentRow.id,
      parentRow,
      subRow,
    }))
  );

  // const pageSize = table.getState().pagination.pageSize;
  const pageIndex = table.getState().pagination.pageIndex;
  const [pageSize, setPageSize] = useState(10);

  const paginatedSubRows = allSubRows.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  );

  const groupedSubRowsByParent = paginatedSubRows.reduce(
    (acc, { parentId, parentRow, subRow }) => {
      if (!acc[parentId]) {
        acc[parentId] = {
          parentRow,
          subRows: [],
        };
      }
      acc[parentId].subRows.push(subRow);
      return acc;
    },
    {}
  );

  const totalSubRowPages = Math.ceil(allSubRows.length / pageSize);

  const headerGroups = table.getHeaderGroups();

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "#FFF",
            border: "2px solid #000",
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
            padding: "20px",
            width: "50%", // Adjust the width as needed
          }}
        >
          <h2>Concern</h2>
          <p>{concern}</p>
        </div>
      </Modal>
      <Box className="product-table-container">
        <table className="product-table">
          <thead className="thead">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} className="thead-tr-persona">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="thead-tr-th-persona"
                    title={header.id}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="tbody-persona">
            {Object.keys(groupedSubRowsByParent).length > 0 ? (
              Object.entries(groupedSubRowsByParent).map(
                ([parentId, group]) => (
                  <React.Fragment key={parentId}>
                    {group.subRows.map((subRow, subRowIndex) => (
                      <tr key={subRow.id} className="tbody-tr-persona">
                        {subRow.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            colSpan={cell.colSpan}
                            className={`tbody-tr-td-persona ${
                              cell.column.id === "product_id" &&
                              subRowIndex === group.subRows.length - 1
                                ? "last-row-first-column"
                                : ""
                            }`}
                            onClick={() => {
                              if (cell.column.id !== "select") {
                                handleRowClick(subRow, subRow.index);
                              }
                            }}
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "400px",
                            }}
                          >
                            {cell.column.id === "product_id"
                              ? subRowIndex === 0
                                ? flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )
                                : null
                              : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan={headerGroups[0]?.headers.length}
                  className="no-subrows"
                  style={{
                    textAlign: "center",
                    padding: "10px",
                    paddingRight: "30%",
                    fontSize: "18px",
                  }}
                >
                  {isBlogFile?"Not applicable for blog-only generation":"File Not Found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Typography>Page</Typography>
          <Typography minWidth="45px">
            <b>
              {allSubRows.length > 0
                ? `${pageIndex + 1} of ${totalSubRowPages}`
                : "0 of 0"}
            </b>
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
              onClick={() => table.setPageIndex(pageIndex - 1)}
              disabled={pageIndex <= 0}
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
              onClick={() => table.setPageIndex(pageIndex + 1)}
              disabled={pageIndex + 1 >= totalSubRowPages}
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

        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "15px" }}>
          <Typography variant="text">Row per Page:</Typography>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              table.setPageIndex(0); // reset to page 1
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
            {[10, 20, 30, 40, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </>
  );
};

export default PersonaTable;
