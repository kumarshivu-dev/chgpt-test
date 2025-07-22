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
  Tooltip,
} from "@mui/material";
import "./user-mgmt-style.css";
import FiberManualRecordRoundedIcon from "@mui/icons-material/FiberManualRecordRounded";
import PersonRemoveAlt1RoundedIcon from "@mui/icons-material/PersonRemoveAlt1Rounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import axios from "axios";
import trackActivity from "../../helper/dashboard/trackActivity";
import DisabledAcknowledgment from "./DisabledAcknowledgment";
import UserRoleModifier from "./UserRoleModifier";
import { useSelector } from "react-redux";
import { handleOpenAddUserModal } from "../../../pages/dashboard/settings/management";
import EnableUserConfirmation from "./EnableUserConfirmation";
import { POST_ADD_USERS, POST_DISABLE_USER } from "../../../utils/apiEndpoints";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import HorizontalMenuActions from "./HorizontalMenuActions";

//custom compoenent for the checkbox
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
      className={className + " cursor-poin  ter"}
      {...rest}
      style={{
        margin: "0px 10px",
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

const UserMgmtTable = memo(
  ({ userMgmtData, onTableUpdate, user, orgName, errDoctData, brands }) => {
    const [rowSelection, setRowSelection] = useState({});
    const [clickedRowId, setClickedRowId] = useState(null);
    const [roleClickedRowId, setRoleClickedRowId] = useState(null);
    const [hoveredRowId, setHoveredRowId] = useState(null);
    const [modalRowData, setModalRowData] = useState([]);
    const userState = useSelector((state) => state.user);
    const brandIds = userState?.brandIdList;
    const [snackbarState, setSnackbarState] = useState({
      open: false,
      message: "",
      severity: "success",
    });

    const [showDisableConfirmation, setShowDisableConfirmation] =
      useState(false);
    const [anchorPosition, setAnchorPosition] = useState({ x: null, y: null });
    const [moreHorizPosition, setMoreHorizPosition] = useState({
      x: null,
      y: null,
    });
    const [showEnableConfirmation, setShowEnableConfirmation] = useState(false);

    // Add a state to track the screen width
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
      setIsMobileView(window.innerWidth <= 768);
    }, [window.innerWidth]);

    const onRowCheck = (flag, row, isSelected) => {
      const updatedRow = { ...row.original, id: row?.id };

      //   if (flag !== "table") {
      //     const updatedDocument = isSelected
      //       ? selectedDocument.filter((item) => String(item.id) !== String(row.id))
      //       : [...selectedDocument, updatedRow];

      //     setSelectedDocument(updatedDocument);
      //     dispatch(setSelectedDocuments(updatedDocument));
      //   } else {
      //     const modifiedDocumentData = documentData.map((item, index) => ({
      //       ...item,
      //       id: index,
      //     }));
      //     setSelectedDocument(isSelected ? [] : modifiedDocumentData);
      //     dispatch(setSelectedDocuments(modifiedDocumentData));
      //   }
    };

    //function to change the role of user (admin <--> editor)
    const handleChangeUserRole = (event, rowData) => {
      setRoleClickedRowId(rowData.id);

      setAnchorPosition({
        x: event.clientX - 68,
        y: event.clientY + 20,
      });
    };

    //function to formate date
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

    const handleEnableClick = (rowData) => {
      setClickedRowId(rowData.id);
      setModalRowData(rowData?.original);
      setShowEnableConfirmation(true);
    };

    const handleDisableClick = (rowData) => {
      setClickedRowId(rowData.id);
      setModalRowData(rowData?.original);
      setShowDisableConfirmation(true);
    };

    //fucntion to enable the disabled user
    const handleEnableUser = async () => {
      const data = {
        users: [
          {
            email: modalRowData?.email,
            role: modalRowData?.role,
          },
        ],
      };

      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_ADD_USERS,
          data,
          {
            headers: {
              Authorization: user?.id_token,
            },
          }
        );
        if (response?.data?.status === true) {
          trackActivity(
            "USER_ENABLED",
            "",
            user,
            modalRowData?.email,
            userState?.userInfo?.orgId,
            null,
            null,
            null,
            brandIds
          );

          activateSnackbar("User enabled");
          onTableUpdate();
        } else if (response?.data?.status === false) {
          activateSnackbar(response?.data?.message, "error");
        }
      } catch (error) {
        activateSnackbar(error.message, "error");
      } finally {
        setShowEnableConfirmation(false);
      }
    };

    // function to disable user
    const handleDisableUser = async () => {
      const data = {};
      const action =
        modalRowData?.inviteStatus === "invited"
          ? "INVITATION_REMOVAL"
          : "USER_REMOVAL";
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${POST_DISABLE_USER}`,
          data,
          {
            headers: {
              Authorization: user.id_token,
            },
            params: {
              userId: modalRowData?.userId,
            },
          }
        );

        // console.log("response after disable user: ", response);
        if (response?.data?.status === true) {
          trackActivity(
            action,
            "",
            user,
            modalRowData?.email,
            userState?.userInfo?.orgId,
            null,
            null,
            null,
            brandIds
          );
          activateSnackbar(response?.data?.message);
          onTableUpdate();
        } else {
          activateSnackbar(
            response?.data?.errorMessage || "Failed to disabled  user.",
            "error"
          );
        }
      } catch (error) {
        // console.log("errror mgmt: ", error);
        activateSnackbar("Network Failed. Please try again later.", "error");
      } finally {
        setShowDisableConfirmation(false); // Close the DeleteAcknowledgment dialog
      }
    };

    const handleEnableCancel = () => {
      setShowEnableConfirmation(false);
      setClickedRowId(null);
    };

    const handleDisableCancel = () => {
      setShowDisableConfirmation(false);
      setClickedRowId(null);
    };

    const handleClose = () => {
      setMoreHorizPosition({ x: null, y: null });
      setAnchorPosition({ x: null, y: null });
    };

    const handleHorizontalMenu = (event, rowData) => {
      setClickedRowId(rowData?.id);
      setMoreHorizPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    //function to acitvate snackbar (Error handling )
    const activateSnackbar = (message, severity = "success") => {
      setSnackbarState({
        open: true,
        message: message,
        severity: severity,
      });
    };

    //columns of the user management table
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
        header: "Name",
        accessorKey: "name",
        cell: (props) => {
          const statusInfo = props?.row?.original?.status;
          return (
            <Box
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {props.getValue() || "N/A"}
            </Box>
          );
        },
      },
      {
        header: "Role",
        accessorKey: "role",
        cell: (props) => {
          const rowId = props.row.id;
          const isClicked = roleClickedRowId === rowId;
          const isRoleDisabled =
            props?.row?.original?.inviteStatus === "disabled";
          return (
            <Box
              className="userRole"
              sx={{
                display: "flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              {props?.getValue("role") || "Editor"}
              <Tooltip title={isRoleDisabled ? "This user is disabled." : ""}>
                <KeyboardArrowDownIcon
                  sx={{ cursor: isRoleDisabled ? "default" : "pointer" }}
                  onClick={(event) => {
                    if (!isRoleDisabled) {
                      handleChangeUserRole(event, props?.row);
                    }
                  }}
                />
              </Tooltip>
              {isClicked && (
                <UserRoleModifier
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
      {
        header: "Access Level",
        accessorKey: "accessLevel",
        cell: (props) => {
          const accessLevel = props.getValue() || "N/A";
          const brandsInfo = props?.row?.original?.brandsInfo;

          // Determine the tooltip content based on the value of props.getValue()
          const tooltipContent =
            accessLevel === "Org"
              ? orgName
              : brandsInfo
              ? brandsInfo.map((brand) => brand.brandName).join(", ")
              : "No Brands Available";

          return (
            <Tooltip title={tooltipContent}>
              <Box sx={{ cursor: "pointer" }}>{accessLevel}</Box>
            </Tooltip>
          );
        },
      },

      {
        header: "Status",
        accessorKey: "inviteStatus",
        cell: (props) => {
          const statusInfo = props?.row?.original?.inviteStatus;
          const bgColors = {
            active: "#DCF0DC",
            accepted: "#DCF0DC",
            disabled: "#DDDDDD",
            invited: "#FFF2D6",
          };
          const textColors = {
            active: "#2BA62C",
            accepted: "#2BA62C",
            disabled: "#8C8C8C",
            invited: "#FFB201",
          };

          const bgColor = bgColors[statusInfo] || "#DDDDDD";
          const txtColor = textColors[statusInfo] || "#8C8C8C";
          return (
            <Box
              sx={{
                background: bgColor,
                color: txtColor,
                padding: "0 7.5px",
                textTransform: "capitalize",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiberManualRecordRoundedIcon fontSize="12px" />
              <Box>{props.getValue() || "Disabled"}</Box>
            </Box>
          );
        },
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (props) => <Box>{props.getValue()}</Box>,
      },
      {
        header: "Last Login",
        accessorKey: "lastSignIn",
        cell: (props) => (
          <Box
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            {props.getValue() === null ? "N/A" : formatDate(props.getValue())}
          </Box>
        ),
      },
      {
        header: "User Since",
        accessorKey: "createdOn",
        cell: (props) => (
          <Box
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            {formatDate(props.getValue())}
          </Box>
        ),
      },
      {
        id: "actions",
        cell: (props) => {
          const rowId = props.row.id;
          const isHovered = hoveredRowId === rowId;
          const isClicked = clickedRowId === rowId;
          const inviteStatus = props?.row?.original?.inviteStatus;
          const access = props?.row?.original?.accessLevel === "Brand";
          return (
            <Box
              sx={{
                position: "relative",
                width: "30px",
                bottom: "12px",
              }}
            >
              {isMobileView && ( // Render actions always on mobile view
                <>
                  <Box position="absolute" transform="translateY(-50%)">
                    {inviteStatus === "disabled" ? (
                      <PersonAddAltRoundedIcon
                        fontSize="small"
                        sx={{
                          cursor: "pointer",
                          color: "#808080",
                          transition: "color 0.3s",
                          ":hover": {
                            color: "#000",
                          },
                        }}
                        onClick={() => handleEnableClick(props.row)}
                      />
                    ) : (
                      <PersonRemoveAlt1RoundedIcon
                        fontSize="small"
                        sx={{
                          cursor: "pointer",
                          color: "#808080",
                          transition: "color 0.3s",
                          ":hover": {
                            color: "#000",
                          },
                        }}
                        onClick={() => handleDisableClick(props.row)}
                      />
                    )}
                  </Box>
                  {access && inviteStatus !== "disabled" && (
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
                      onClick={(event) =>
                        handleHorizontalMenu(event, props.row)
                      }
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
                    {inviteStatus === "disabled" ? (
                      <PersonAddAltRoundedIcon
                        fontSize="small"
                        sx={{
                          cursor: "pointer",
                          color: "#808080",
                          transition: "color 0.3s",
                          ":hover": {
                            color: "#000",
                          },
                        }}
                        onClick={() => handleEnableClick(props.row)}
                      />
                    ) : (
                      <PersonRemoveAlt1RoundedIcon
                        fontSize="small"
                        sx={{
                          cursor: "pointer",
                          color: "#808080",
                          transition: "color 0.3s",
                          ":hover": {
                            color: "#000",
                          },
                        }}
                        onClick={() => handleDisableClick(props.row)}
                      />
                    )}
                  </Box>
                  <Box
                    display={isHovered ? "block" : "none"}
                    position="absolute"
                    top="50%"
                    left="25px"
                    transform="translateY(-50%)"
                  >
                    {access && inviteStatus !== "disabled" && (
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
                        onClick={(event) =>
                          handleHorizontalMenu(event, props.row)
                        }
                      />
                    )}
                  </Box>
                </>
              )}
              {isClicked && showDisableConfirmation && (
                <DisabledAcknowledgment
                  onDisableConfirmed={handleDisableUser}
                  onCancel={handleDisableCancel}
                />
              )}
              {isClicked && showEnableConfirmation && (
                <EnableUserConfirmation
                  onEnableConfirmed={handleEnableUser}
                  onCancel={handleEnableCancel}
                />
              )}
              {clickedRowId === rowId && (
                <HorizontalMenuActions
                  anchorPosition={moreHorizPosition}
                  onClose={() => handleClose()}
                  rowData={props?.row?.original}
                  onTableUpdate={onTableUpdate}
                  user={user}
                  brands={brands}
                />
              )}
            </Box>
          );
        },
      },
    ]);

    //creating the table for user mgmt
    const table = useReactTable({
      data: userMgmtData,
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
      autoResetPageIndex: true,
    });

    return (
      <>
        <Box className="mgmt-container">
          <table className="mgmt-table">
            <thead className="mgmt-thead">
              {table.getHeaderGroups()?.map((headerGroup) => (
                <tr className="mgmt-thead-tr" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <td
                        className="mgmt-thead-tr-td"
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

            <tbody className="mgmt-tbody">
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
                table.getRowModel()?.rows?.map((row) => {
                  const isRowSelected = row.getIsSelected();
                  const isClickedRow = clickedRowId === row.id;
                  return (
                    <Fragment key={row.id}>
                      <tr
                        className="mgmt-tbody-tr"
                        style={{
                          backgroundColor: isRowSelected ? "#F9F9FF" : "",
                        }}
                        onMouseEnter={() => setHoveredRowId(row.id)}
                        // onMouseLeave={() => setHoveredRowId(null)}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td className="mgmt-tbody-tr-td" key={cell.id}>
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
            <Typography>Page</Typography>
            <Typography minWidth="45px">
              {userMgmtData?.length > 0 ? (
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

export default UserMgmtTable;
