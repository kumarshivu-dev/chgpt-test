import { useState, useMemo, useRef, useEffect, Fragment, memo } from "react";
import {
  table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import "./hypertarget-style.css";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteAcknowledgmentPersona from "./DeleteAcknowledgment";
import EditPersonaModal from "./editPersonaModal";
import { useSelector, useDispatch } from "react-redux";
// import { setSelectedPersona } from "../../../store/dashboard/hypertargetTableSlice";
import { setSelectedPersona } from "../../../store/dashboard/documentTableSlice";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";

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

const HypertargetTable = memo(
  ({ personaData, user, errorPersonaData, onTableUpdate }) => {
    const dispatch = useDispatch();
    const [rowSelection, setRowSelection] = useState({});
    const [clickedRowId, setClickedRowId] = useState(null);
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showEditConfirmation, setShowEditConfirmation] = useState(false);
    const [modalRowData, setModalRowData] = useState([]);
    const [chekedPersona, setCheckedPersona] = useState([]);
    const personaState = useSelector((state) => state?.hyperTargetTable);
    const [isMobileView, setIsMobileView] = useState(false);
    const [sorting, setSorting] = useState([]);

    const processedPersonaData = useMemo(() => {
      if (!personaData) return [];

      const defaultRows = personaData.filter(
        (item) => String(item.persona).toLowerCase() === "default"
      );
      let otherRows = personaData.filter(
        (item) => String(item.persona).toLowerCase() !== "default"
      );

      if (sorting.length > 0) {
        // User applied sorting
        const { id, desc } = sorting[0];
        otherRows.sort((a, b) => {
          const aVal = a[id]?.toLowerCase?.() ?? "";
          const bVal = b[id]?.toLowerCase?.() ?? "";
          if (aVal < bVal) return desc ? 1 : -1;
          if (aVal > bVal) return desc ? -1 : 1;
          return 0;
        });
      } else {
        // First load: reverse order
        otherRows.reverse();
      }

      return [...defaultRows, ...otherRows];
    }, [personaData, sorting]);

    useEffect(() => {
      setRowSelection([]);
      setCheckedPersona([]);
      dispatch(setSelectedPersona([]));
    }, [personaData, dispatch]);

    const [snackbarState, setSnackbarState] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    useEffect(()=>{
      setRowSelection([]);
      setCheckedPersona([]);
      dispatch(setSelectedPersona([]));
    },[personaData,dispatch]);
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

    const activateSnackbar = (message, severity = "success") => {
      setSnackbarState({
        open: true,
        message: message,
        severity: severity,
      });
    };
    const handleDeleteClick = (rowData) => {
      setClickedRowId(rowData.id);
      setModalRowData(rowData?.original);

      setShowDeleteConfirmation(true);
    };
    const handleEditClick = (rowData) => {
      setClickedRowId(rowData.id);
      setModalRowData(rowData?.original);
      setShowEditConfirmation(true);
    };
    const handleDeleteConfirmed = async () => {
      try {
        const ids = [modalRowData?.id];
        const personaNames = [modalRowData?.persona];
        const DemographicDeleteRequest = {
          ids: ids,
          personaNames: personaNames,
        };
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}/dashboard/hypertarget/delete/persona`,
          DemographicDeleteRequest,
          {
            headers: {
              Authorization: user.id_token,
            },
          }
        );

        if (response?.data?.status === true) {
          onTableUpdate();
          activateSnackbar("Persona deleted successfully.", "success");
        } else {
          activateSnackbar(
            response?.data?.errorMessage || "Failed to delete persona.",
            "error"
          );
        }
      } catch (error) {
        activateSnackbar(
          "Error while deleting persona. Please try again.",
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
    const handleEditCancel = () => {
      setShowEditConfirmation(false);
      setClickedRowId(null);
    };

    // const onRowCheck = (flag, row, isSelected) => {
    //   const updatedRow = { ...row.original, _id: row?.id };

    //   if (flag !== "table") {
    //     const updatedDocument = isSelected
    //       ? chekedPersona.filter((item) => String(item._id) !== String(row.id))
    //       : [...chekedPersona, updatedRow];

    //     setCheckedPersona(updatedDocument);
    //     dispatch(setSelectedPersona(updatedDocument));
    //   } else {
    //     if (isSelected) {
    //       setCheckedPersona([]);
    //       dispatch(setSelectedPersona(""));
    //     } else {
    //       const allRows = table.getRowModel().rows.map((row) => ({
    //         ...row.original,
    //         _id: row.id,
    //       }));

    //       // const chosenPersona = allRows.map(doc => doc.persona).join(';');
    //       setCheckedPersona(allRows);
    //       dispatch(setSelectedPersona(allRows));
    //     }
    //   }
    // };

    const onRowCheck = (flag, row, isSelected) => {
      if (flag !== "table") {
        const updatedRow = { ...row.original, _id: row?.id };

        const updatedDocument = isSelected
          ? chekedPersona.filter((item) => String(item._id) !== String(row.id))
          : [...chekedPersona, updatedRow];

        setCheckedPersona(updatedDocument);
        dispatch(setSelectedPersona(updatedDocument));
      } else {
        const currentPageRows = table.getRowModel().rows.map((row) => ({
          ...row.original,
          _id: row.id,
        }));

        let updatedDocument;

        if (isSelected) {
          // REMOVE current page rows from selectedPersona
          const currentPageIds = new Set(
            currentPageRows.map((r) => String(r._id))
          );
          updatedDocument = chekedPersona.filter(
            (item) => !currentPageIds.has(String(item._id))
          );
        } else {
          // ADD current page rows to selectedPersona (avoid duplicates)
          const existingIds = new Set(chekedPersona.map((r) => String(r._id)));
          const newRows = currentPageRows.filter(
            (r) => !existingIds.has(String(r._id))
          );
          updatedDocument = [...chekedPersona, ...newRows];
        }

        setCheckedPersona(updatedDocument);
        dispatch(setSelectedPersona(updatedDocument));
      }
    };
    const handleUncheckAll = () => {
      setCheckedPersona([]);
      setRowSelection({});
    };

    const columns = useMemo(() => [
      {
        id: "select",
        // header: ({ table }) => (
        //   <IndeterminateCheckbox
        //     {...{
        //       checked: table.getIsAllRowsSelected(),
        //       indeterminate: table.getIsSomeRowsSelected(),
        //       onChange: table.getToggleAllRowsSelectedHandler(),
        //       onClick: () =>
        //         onRowCheck("table", "", table.getIsAllRowsSelected()),
        //     }}
        //   />
        // ),

        header: ({ table }) => {
          const allPageRowsSelected = table
            .getRowModel()
            .rows.every((row) => row.getIsSelected());
          const somePageRowsSelected = table
            .getRowModel()
            .rows.some((row) => row.getIsSelected());

          const togglePageRows = () => {
            const shouldSelect = !allPageRowsSelected;
            table
              .getRowModel()
              .rows.forEach((row) => row.toggleSelected(shouldSelect));
          };

          return (
            <IndeterminateCheckbox
              checked={allPageRowsSelected}
              indeterminate={!allPageRowsSelected && somePageRowsSelected}
              onChange={togglePageRows}
              onClick={() => onRowCheck("table", "", allPageRowsSelected)}
            />
          );
        },
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
        header: ({ column, table }) => {
          const isSorted = column.getIsSorted();

          const handleSortClick = () => {
            // Toggle only between asc and desc (never undefined)
            const nextSort = isSorted === "asc" ? "desc" : "asc";
            table.setSorting([{ id: column.id, desc: nextSort === "desc" }]);
          };

          return (
            <Box
              onClick={handleSortClick}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <span>Persona Name</span>
              <Box
                ml={0.5}
                sx={{ display: "flex", flexDirection: "column", ml: 1 }}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: "10px",
                    lineHeight: "10px",
                    color: isSorted === "asc" ? "#000" : "#ccc",
                  }}
                >
                  ▲
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: "10px",
                    lineHeight: "10px",
                    color: isSorted === "desc" ? "#000" : "#ccc",
                  }}
                >
                  ▼
                </Box>
              </Box>
            </Box>
          );
        },
        accessorKey: "persona",
        cell: (props) => (
          <Box
            sx={{
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: "Medium",
              paddingRight: "10px",
              paddingLeft: "15px",
            }}
          >
            {props.getValue()}
          </Box>
        ),
      },
      {
        header: "Keywords",
        accessorKey: "keywords",
        cell: (props) => {
          const keywords = props.getValue();
          const displayKeywords = Array.isArray(keywords)
            ? keywords.join(", ")
            : keywords;
          return (
            <Box
              sx={{
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: "Medium",
                paddingRight: "10px",
                paddingLeft: "15px",
              }}
            >
              {displayKeywords || ""}
            </Box>
          );
        },
      },
      {
        header: "Description",
        accessorKey: "characteristics",
        cell: (props) => (
          <Box
            sx={{
              maxWidth: "500px",
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
        header: "MinLength",
        accessorKey: "minLength",
        cell: (props) => (
          <Box
            sx={{
              minWidth: "80px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: "Medium",
              margin: "0px 10px 0px 10px",
            }}
          >
            {props.getValue()}
          </Box>
        ),
      },
      {
        header: "MaxLength",
        accessorKey: "maxLength",
        cell: (props) => (
          <Box
            sx={{
              minWidth: "80px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontWeight: "Medium",
              marginRight: "10px",
            }}
          >
            {props.getValue()}
          </Box>
        ),
      },
      {
        id: "actions",
        cell: (props) => {
          const rowId = props.row.id;
          const isHovered = hoveredRowId === rowId;
          const isClicked = clickedRowId === rowId;
          const isDefault = props?.row?.original?.persona === "Default";
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
                  <EditRoundedIcon
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
                    onClick={() => handleEditClick(props.row)}
                  />
                  {!isDefault && (
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
                  )}
                </>
              )}
              {!isMobileView && ( // Render actions only on hover for non-mobile view
                <>
                  <Box
                    display={isHovered ? "block" : "none"}
                    position="absolute"
                    transform="translateY(-50%)"
                  >
                    <EditRoundedIcon
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
                      onClick={() => handleEditClick(props.row)}
                    />
                  </Box>
                  <Box
                    display={isHovered ? "block" : "none"}
                    position="absolute"
                    top="50%"
                    left="30px"
                    transform="translateY(-50%)"
                  >
                    {!isDefault && (
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
                        disabled={isDefault}
                      />
                    )}
                  </Box>
                </>
              )}
              {isClicked && showDeleteConfirmation && (
                <DeleteAcknowledgmentPersona
                  onDeleteConfirmed={handleDeleteConfirmed}
                  onCancel={handleDeleteCancel}
                />
              )}
              {clickedRowId === rowId && (
                <EditPersonaModal
                  user={user}
                  isOpen={showEditConfirmation}
                  editData={modalRowData}
                  onCancel={handleEditCancel}
                  onTableUpdate={onTableUpdate}
                  personaData={personaData}
                  currentRowIndex={clickedRowId}
                />
              )}
            </Box>
          );
        },
      },
    ]);

    const table = useReactTable({
      data: processedPersonaData,
      columns,
      state: {
        rowSelection,
        sorting,
      },
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    });

    // const table = useReactTable({
    //   data: personaData,
    //   columns,
    //   state: {
    //     rowSelection,
    //   },
    //   enableRowSelection: true,
    //   onRowSelectionChange: setRowSelection,
    //   getCoreRowModel: getCoreRowModel(),
    //   getFilteredRowModel: getFilteredRowModel(),
    //   getPaginationRowModel: getPaginationRowModel(),
    //   debugTable: true,
    // });
    return (
      <>
        <Box className="hyper-container">
          <table className="hyper-table">
            <thead className="hyper-thead">
              {table.getHeaderGroups()?.map((headerGroup) => (
                <tr className="hyper-thead-tr" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <td
                        className="hyper-thead-tr-td"
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

            <tbody className="hyper-tbody">
              {errorPersonaData ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {errorPersonaData}
                  </td>
                </tr>
              ) : (
                // Render rows when there are records
                table.getRowModel()?.rows?.map((row) => {
                  const isRowSelected = row.getIsSelected();
                  return (
                    <Fragment key={row.id}>
                      <tr
                        className="hyper-tbody-tr"
                        style={{
                          backgroundColor: isRowSelected ? "#F9F9FF" : null,
                        }}
                        onMouseEnter={() => setHoveredRowId(row.id)}
                        // onMouseLeave={() => setHoveredRowId(null)}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td className="hyper-tbody-tr-td" key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </Fragment>
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
              {personaData?.length > 0 ? (
                <b>
                  {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </b>
              ) : (
                <b>0 of 0</b>
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
                onClick={() => table.nextPage()}
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

export default HypertargetTable;
