import { useState, useMemo, useRef, useEffect, Fragment, memo } from "react";
import {
  table,
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
  Grid,
} from "@mui/material";
import { useRouter } from "next/router";
import ArrowDropDownCircleOutlinedIcon from "@mui/icons-material/ArrowDropDownCircleOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import "./activity-style.css";
import Image from "next/image";

function IndeterminateCheckbox({ indeterminate, className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <Checkbox
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
      style={{
        margin: "0px 10px",
        borderRadius: "15px",
        color: "#022149",
      }}
    />
  );
}

const ActivityTable = memo(
  ({
    activityData,
    onTableUpdate,
    user,
    pageNumber,
    pageSize,
    totalRows,
    onPageNumberChange,
    onPageSizeChange,
    errDoctData,
  }) => {
    const router = useRouter();
    const [rowSelection, setRowSelection] = useState({});
    const [clickedRowInfo, setClickedRowInfo] = useState([]);
    const [clickedRowId, setClickedRowId] = useState(null);
    const [hoveredRowId, setHoveredRowId] = useState(null);

    const handleShowAdditionInfo = (rowData) => {
      // If the clicked row is the same as the currently clicked row, close it
      if (clickedRowId === rowData?.id) {
        setClickedRowId(null);
      } else {
        // Open the clicked row and close the previously opened row
        setClickedRowInfo(rowData?.original);
        setClickedRowId(rowData?.id);
      }
    };

    const handleShowGeneratedContent = async (rowData) => {
      let isSelected = "product";
      const { filename, action, operation } = rowData?.original;
      let query = {};

      if (operation === "Blog Generation Succeeded") {
        query["getBlogFileName"] = encodeURIComponent(filename);
      } else if (operation === "Finished processing") {
        query["getFileName"] = encodeURIComponent(filename);
      }
      if (action === "AI_GENERATION_COMPLETED_IMAGE") {
        isSelected = "image";
      }
      router.push({
        pathname: "/dashboard/result",
        query: {
          ...query,
          isSelected: isSelected,
          eyeClick: true,
          userId: rowData?.original?.user_id,
        },
      });
    };

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

    const columns = useMemo(() => [
      // {
      //   id: "select",
      //   header: ({ table }) => (
      //     <IndeterminateCheckbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler(),
      //         onClick: () =>
      //           onRowCheck("table", "", table.getIsAllRowsSelected()),
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Box>
      //       <IndeterminateCheckbox
      //         {...{
      //           checked: row.getIsSelected(),
      //           disabled: !row.getCanSelect(),
      //           indeterminate: row.getIsSomeSelected(),
      //           onChange: row.getToggleSelectedHandler(),
      //           onClick: () => onRowCheck("row", row, row.getIsSelected()),
      //         }}
      //       />
      //     </Box>
      //   ),
      // },
      {
        id: "info",
        header: "",
        cell: (props) => {
          const operation = props?.row?.original?.operation;
          const isClickable =
            operation === "Generating contents" ||
            operation === "Finished processing" ||
            operation === "Terminated due to error";
          return (
            <Box
              sx={{
                marginLeft: "10px",
                cursor: isClickable ? "pointer" : null,
                marginTop: "10px",
                color: "#808080",
                ":hover": {
                  color: isClickable ? "#262626" : null,
                },
              }}
            >
              <ArrowDropDownCircleOutlinedIcon
                style={{
                  transform:
                    clickedRowId === props?.row?.id ? null : "rotate(-90deg)",
                }}
                fontSize="medium"
                onClick={
                  isClickable ? () => handleShowAdditionInfo(props?.row) : null
                }
              />
            </Box>
          );
        },
      },
      {
        id: "eye",
        header: "",
        cell: (props) => {
          const operation = props?.row?.original?.operation;
          const rowId = props.row.id;
          const isHovered = hoveredRowId === rowId;
          const isClickable =
            operation === "Finished processing" ||
            operation === "Blog Generation Succeeded";
          // const isClickable = operation === "Finished processing";
          return (
            <>
              <Box
                sx={{
                  marginLeft: "10px",
                  cursor: isClickable ? "pointer" : null,
                  marginTop: "10px",
                  color: isClickable ? "#262626" : "#EBEBE4",
                }}
              >
                <RemoveRedEyeIcon
                  fontSize="medium"
                  onClick={
                    isClickable
                      ? () => handleShowGeneratedContent(props?.row)
                      : null
                  }
                />
              </Box>
              {/* :<></> */}
              {/* } */}
            </>
          );
        },
      },
      {
        header: "Jobs",
        accessorKey: "event",
        cell: (props) => {
          const operation = props?.row?.original?.operation;
          return (
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: "Medium",
              }}
            >
              {<>{props.getValue()}</>}
            </Box>
          );
        },
      },
      {
        header: "User",
        accessorKey: "user",
        cell: (props) => (
          <Box
            sx={{
              display: "inline-block",
              alignItems: "center",
              maxWidth: "350px",
              // color: "#919191",
              // fontWeight: "bold",
              // paddingRight: "10px",
              // paddingLeft: "15px",
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
        header: "Status",
        accessorKey: "status",
        cell: (props) => {
          const statusInfo = props?.row?.original?.status;
          const statusColors = {
            "Error!": "#EA0018",
            error: "#EA0018",
            failed: "#EA0018",
            "save failed": "#EA0018",
            "removal failed": "#EA0018",
          };

          const color = statusColors[statusInfo] || "#000000";
          return (
            <Box
              sx={{
                color: color,
                minWidth: "100px",
                textTransform: "capitalize",
              }}
            >
              {props.getValue()}
            </Box>
          );
        },
      },
      {
        header: "Date/Time",
        accessorKey: "dateTime",
        cell: (props) => (
          <Box
            sx={
              {
                // color: "#919191",
                // fontWeight: "bold",
                //  minWidth: "200px"
              }
            }
          >
            {formatDate(props.getValue())}
          </Box>
        ),
      },
    ]);

    const table = useReactTable({
      data: activityData,
      columns,
      getCoreRowModel: getCoreRowModel(),

      manualPagination: true,
      pageCount: Math.ceil(totalRows / pageSize),
      state: {
        rowSelection,
        pagination: {
          pageIndex: pageNumber - 1,
          pageSize: pageSize,
        },
      },

      onPaginationChange: (updater) => {
        const newPagination = updater((old) => old);
        onPageNumberChange(newPagination.pageIndex + 1);
      },

      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      // getFilteredRowModel: getFilteredRowModel(),
      // getPaginationRowModel: getPaginationRowModel(),
      debugTable: true,
    });

    const handlePageChange = (newPageNumber) => {
      if (newPageNumber >= 1 && newPageNumber <= table.getPageCount()) {
        onPageNumberChange(newPageNumber);
      }
    };

    return (
      <>
        <Box className="activity-container">
          <table className="act-table">
            <thead className="act-thead">
              {table.getHeaderGroups()?.map((headerGroup) => (
                <tr className="act-thead-tr" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <td
                        className="act-thead-tr-td"
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

            <tbody className="act-tbody">
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
                  const isClickedRow = clickedRowId === row.id;
                  return (
                    <Fragment key={row.id}>
                      <tr
                        className="act-tbody-tr"
                        style={{
                          backgroundColor: isRowSelected ? "#fff8f5" : "",
                        }}
                        onMouseEnter={() => setHoveredRowId(row.id)}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td className="act-tbody-tr-td" key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                      {/* addition row info */}
                      {isClickedRow && (
                        <tr>
                          <td colSpan={columns.length}>
                            <Box className="row-addition-info">
                              {/* <CloseIcon
                                className="status-close"
                                onClick={() => setClickedRowId(null)}
                              /> */}
                              <Grid className="status-container" container>
                                <Grid className="status-time" item xs={12}>
                                  <Image
                                    width="30"
                                    height="30"
                                    src="/dashboard/uploaded.svg"
                                    alt="Logo"
                                    priority
                                  />
                                  <Typography>
                                    <span className="status-text">
                                      Uploaded -{" "}
                                    </span>
                                    {formatDate(clickedRowInfo?.startingTime)}
                                  </Typography>
                                </Grid>
                                <Box className="vertical-line"></Box>
                                <Grid className="status-time" item xs={12}>
                                  <Image
                                    width="30"
                                    height="30"
                                    src="/dashboard/generating.svg"
                                    alt="Logo"
                                    priority
                                  />
                                  <Typography>
                                    <span className="status-text">
                                      Generating -{" "}
                                    </span>
                                    {formatDate(clickedRowInfo?.startingTime)}
                                  </Typography>
                                </Grid>
                                {clickedRowInfo?.status ===
                                "processing..." ? null : (
                                  <>
                                    <Box className="vertical-line"></Box>
                                    <Grid className="status-time" item xs={12}>
                                      <Image
                                        width="30"
                                        height="30"
                                        src={
                                          clickedRowInfo?.status === "Error!"
                                            ? "/dashboard/Error.svg"
                                            : "/dashboard/completed.svg"
                                        }
                                        alt="Logo"
                                        priority
                                      />
                                      <Typography textTransform="capitalize">
                                        <span className="status-text">
                                          {clickedRowInfo?.status} -{" "}
                                        </span>
                                        {formatDate(clickedRowInfo?.endingTime)}
                                      </Typography>
                                    </Grid>
                                  </>
                                )}
                              </Grid>
                            </Box>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </Box>

        {/* Pagination controls */}
        {activityData?.length > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
              }}
            >
              <Typography minWidth="45px" fontWeight="bold">
                {activityData?.length > 0
                  ? `Page ${pageNumber} of ${table.getPageCount()}`
                  : "0 of 0"}
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
                  onClick={() => handlePageChange(pageNumber - 1)}
                  disabled={!table.getCanPreviousPage()}
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
                  onClick={() => handlePageChange(pageNumber + 1)}
                  disabled={!table.getCanNextPage()}
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
              <Typography minWidth="45px">Count : {totalRows}</Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", marginLeft: "15px" }}
            >
              <Typography variant="text">Row per Page:</Typography>
              <Select
                className=""
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
        )}
      </>
    );
  }
);

export default ActivityTable;
