import { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "./product.css";
import { requiredFields } from "../../helper/dashboard/productHelper";
import { useRouter } from "next/router";

// custom checkbox component
function IndeterminateCheckbox({
  indeterminate,
  isResultPage,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);
  if (isResultPage) {
    return null;
  }
  return (
    <Checkbox
      ref={ref}
      indeterminate={indeterminate}
      className={`${className} cursor-pointer`}
      {...rest}
      sx={{
        textAlign: "center",
        margin: "0px 10px",
        borderRadius: "10px",
        "&:hover": {
          borderColor: "red",
        },
        "&.Mui-checked": {
          color: "#022149",
          borderColor: "red",
        },
      }}
    />
  );
}

const ImageRecTable = ({
  tableData,
  setSelectedProduct,
  selectedProduct,
  editableRow,
  handleRowClick,
  isResultPage,
  setIsValidProduct,
  isSEO,
  isTaxonomy,
}) => {
  const router = useRouter();
  const uploadState = useSelector((state) => state.uploadpage);
  const [currentTableData, setCurrentTableData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const requiredFields = {
    product_id: "product_id",
    product_name: "product_name",
    brand: "brand",
  };

  useEffect(() => {
    setRowSelection({});
    setSelectedProduct([]);
  }, [tableData]);

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
  //table column
  const productColumns = useMemo(() => [
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
                return item?.id === row?.original?.id;
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
      header: () => (
        <span
          className="column-header"
          style={{
            marginRight: "30px",
          }}
        >
          ID
        </span>
      ),
      accessorKey: "image_id",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Item</span>,
      accessorKey: "item",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Keywords</span>,
      accessorKey: "optional_keywords",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">SEO Keywords</span>,
      accessorKey: "seo_keywords",
      cell: (props) => props.getValue(),
    },
    {
      header: <span className="column-header">Image URL</span>,
      accessorKey: "image_url",
      cell: (props) => props.getValue(),
    },
  ]);

  const resultColumns = useMemo(() => [
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
  ]);

  const table = useReactTable({
    data:
      tableData.length > currentTableData.length ? tableData : currentTableData,
    columns: isResultPage ? resultColumns : productColumns,
    initialState: {},
    state: {
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    setRowSelection: setRowSelection,
    enableRowSelection: true,
    debugTable: true,
  });

  const headerGroups = table.getHeaderGroups();

  return (
    <>
      <Box className="product-table-container">
        <table className="product-table">
          <thead className="thead">
            {headerGroups.map((headerGroup) => {
              return (
                <tr key={headerGroup.id} className="thead-tr">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={6}
                        className="thead-tr-th"
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
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody className="tbody">
            {tableData.length > 0 &&
              table.getRowModel().rows.map((row, index) => (
                <tr key={row.id} className="tbody-tr">
                  {row.getVisibleCells().map((cells, cellIndex) => {
                    return (
                      <td
                        className="tbody-tr-td"
                        key={cells.id}
                        colSpan={6}
                        onClick={() => {
                          if (cells.column.id !== "select") {
                            handleRowClick(row, row.index);
                          }
                        }}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px",
                        }}
                      >
                        {flexRender(
                          cells.column.columnDef.cell,
                          cells.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </Box>
      {/* product table pagination  */}
      <Box
        className="table-pagination-container"
        sx={{
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box className="pagination-tile">
            <Typography
              sx={{
                fontSize: {
                  xs: "12px !important",
                  sm: "16px !important",
                },
              }}
            >
              {tableData.length > 0 ? (
                <b>
                  Page &nbsp;{table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </b>
              ) : (
                <b>Page 0 of 0</b>
              )}
            </Typography>
          </Box>
          <Box
            className="pagination-nav-btns"
            sx={{
              ml: "10px",
              gap: {
                xs: "0px",
                sm: "6px",
              },
            }}
          >
            {/* <Button
                className="table-btnt io-btn pagination-btns"
                onClick={() => {
                  table.setPageIndex(0);
                }}
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
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button> */}
            <Button
              onClick={() => {
                table.previousPage();
              }}
              sx={{
                textTransform: "none",
                borderRadius: "10px !important",
                backgroundColor: "#FFFFFF",
                border: "1px solid #ccc",
                cursor: "pointer !important",
                color: "black !important",
                minWidth: "38px !important",
                mr: {
                  xs: "5px !important",
                  sm: "10px !important",
                },
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowBackIosNewIcon
                sx={{ color: "black !important", fontSize: "16px" }}
              />
            </Button>
            <Button
              onClick={() => {
                table.nextPage();
              }}
              sx={{
                textTransform: "none",
                borderRadius: "10px !important",
                backgroundColor: "#FFFFFF",
                border: "1px solid #ccc",
                cursor: "pointer !important",
                color: "black !important",
                minWidth: "38px !important",
                mr: {
                  xs: "5px !important",
                  sm: "10px !important",
                },
              }}
              disabled={!table.getCanNextPage()}
            >
              <ArrowForwardIosIcon
                sx={{ color: "black !important", fontSize: "16px" }}
              />
            </Button>
            {/* <Button
                className="table-btnt io-btn pagination-btns"
                onClick={() => {
                  table.setPageIndex(table.getPageCount() - 1);
                }}
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
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </Button> */}
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Typography
            sx={{
              width: {
                xs: "80px",
                sm: "130px",
              },
            }}
          >
            Row per page:{" "}
          </Typography>
          <Select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            sx={{
              borderRadius: "4px",
              ml: "10px",
              height: "30px",
              mr: {
                xs: "5px !important",
                sm: "10px !important",
              },
              fontSize: {
                xs: "12px !important",
                sm: "16px !important",
              },
            }}
          >
            {[10, 20, 30, 40].map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
      {/* {isResultPage && (
        <Button
          variant="contained"
          sx={{
            borderRadius: "5px",
            mt: "40px",
          }}
          onClick={() => {
            router.push({
              pathname: "/dashboard/products",
            });
          }}
        >
          Create New
        </Button>
      )} */}
    </>
  );
};

export default ImageRecTable;
