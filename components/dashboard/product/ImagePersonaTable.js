import { useState, useEffect, useMemo, useRef } from "react";
import React from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./product.css";

// custom checkbox component
function IndeterminateCheckbox({
  indeterminate,
  isResultPage,
  className = "",
  ...rest
}) {
  if (!isResultPage) {
    const ref = useRef(null);
    useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate]);

    return isResultPage ? (
      <></>
    ) : (
      <Checkbox
        type="checkbox"
        ref={ref}
        className={className + " cursor-pointer"}
        {...rest}
        style={{
          textAlign: "center",
          margin: "0px 10px",
          borderRadius: "10px",
        }}
        sx={{
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
  } else {
    return <></>;
  }
}

const ImagePersonaTable = ({
  tableData,
  setSelectedProduct,
  selectedProduct,
  handleRowClick,
  isResultPage,
  setIsValidProduct,
}) => {
  const [currentTableData, setCurrentTableData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const onRowCheck = (flag, row, isSelected) => {
    if (flag !== "table") {
      row.getToggleSelectedHandler();
      row.getIsSelected();
      if (selectedProduct.length > 0) {
        if (
          selectedProduct.some((item) => {
            return item?.id === row?.original?.id;
          })
        ) {
          const newArray = selectedProduct.filter((value) => {
            if (row.original.id) {
              return value.id !== row.original.id;
            } else {
              return value.product_id !== row.original.product_id;
            }
          });
          setSelectedProduct(newArray);
        } else {
          setSelectedProduct([...selectedProduct, row.original]);
        }
      } else {
        setSelectedProduct([row.original]);
      }
    } else {
      if (!isSelected) {
        setSelectedProduct(tableData);
      } else {
        setSelectedProduct([]);
      }
    }
  };

  //To check every product has product id, product name and brand
  const hasValues = selectedProduct.every((item) => item.image_url);
  if (!isResultPage) {
    setIsValidProduct(!hasValues);
  }

  const resultColumns = useMemo(() => {
    const isColumnEmpty = (key) =>
      tableData?.every((row) => !row[key] || row[key].toString().trim() === "");
    const columns = [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              isResultPage: isResultPage,
              onChange: table.getToggleAllRowsSelectedHandler(),
              onClick: () =>
                onRowCheck("table", "", table.getIsAllRowsSelected()),
            }}
          />
        ),
        cell: ({ row }) => {
          return (
            <IndeterminateCheckbox
              {...{
                checked: selectedProduct.some((item) => {
                  return (
                    item?.product_id === row?.original?.product_id &&
                    item?.product_name === row?.original?.product_name
                  );
                }),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                isResultPage: isResultPage,
                onChange: row.getToggleSelectedHandler(),
                onClick: () => onRowCheck("row", row, row.getIsSelected()),
              }}
            />
          );
        },
      },
      {
        header: <span className="column-header">ID</span>,
        accessorKey: "image_id",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Channel Name</span>,
        accessorKey: "channel",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Persona</span>,
        accessorKey: "persona",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Item</span>,
        accessorKey: "item",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Optional Keywords</span>,
        accessorKey: "optional_keywords",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Image Url</span>,
        accessorKey: "image_url",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Labels</span>,
        accessorKey: "labels",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Alt Text</span>,
        accessorKey: "alt-text",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Product Description</span>,
        accessorKey: "Item Description",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature bullet 1</span>,
        accessorKey: "Feature_Bullet1",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature Bullet 2</span>,
        accessorKey: "Feature_Bullet2",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature Bullet 3</span>,
        accessorKey: "Feature_Bullet3",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature Bullet 4</span>,
        accessorKey: "Feature_Bullet4",
        cell: (props) => props.getValue(),
      },
      {
        header: <span className="column-header">Feature Bullet 5</span>,
        accessorKey: "Feature_Bullet5",
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
    ].filter(Boolean);

    return columns;
  }, [tableData]);

  const table = useReactTable({
    data:
      tableData.length > currentTableData.length ? tableData : currentTableData,
    columns: resultColumns,
    initialState: {
      grouping: ["image_id"],
    },
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    setRowSelection: setRowSelection,
    enableRowSelection: true,
    debugTable: true,
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
          <tbody className="tbody">
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
                              cell.column.id === "image_id" &&
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
                            {cell.column.id === "image_id"
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
                    fontSize: "18px",
                  }}
                >
                  File Not Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
      {/* product table pagination  */}
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

export default ImagePersonaTable;
