import { useState, useEffect, useMemo, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { tooltipClasses } from "@mui/material/Tooltip";
import "../product/product.css";
import axios from "axios";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import "../product/product.css";
import {
  setChosenPersona,
  setChosenTaxonomy,
} from "../../../store/dashboard/hypertargetSlice";
import Link from "next/link";
import {
  GET_PERSONA_LIST,
  GET_CHANNEL_LIST,
} from "../../../utils/apiEndpoints";
import {
  defaultRow,
  defaultRow2,
  defaultRow3,
  defaultChannel,
} from "../../helper/dashboard/productHelper";
import { useToast } from "../.../../../../context/ToastContext";
import UpgradeToast from "../../../utils-ui/UpgradeToast";

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

const ChooseChannelModal = ({
  isOpen,
  onClose,
  user,
  onTableUpdate,
  choosePersona,
}) => {
  const dispatch = useDispatch();
  const [personaData, setPersonaData] = useState([]);
  const [checkedPersona, setCheckedPersona] = useState([]);
  const [errorPersonaData, setErrorPersonaData] = useState(null);
  const [rowSelection, setRowSelection] = useState({});
  const isHyperTargetAllowed = user?.allowedFeatures?.includes("hypertarget");
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { showToast } = useToast();

  const userState = useSelector((state) => state?.user);

  const getPersonaList = async () => {
    // Get the latest values from userState
    const brandSpecification = userState?.userInfo?.brandSpecification;
    const IsFreeUser = ["chgpt-basic", "chgpt-free", "chgpt-premium"].some(
      (plan) => user?.planCode?.startsWith(plan)
    );

    // Skip showing errors during normal loading
    if (!userState?.userInfo || Object.keys(userState.userInfo).length === 0) {
      return;
    }

    // Now proceed with the check
    if (IsFreeUser || (brandSpecification && !IsFreeUser)) {
      const brandId = brandSpecification?.brandId;
      let url = process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_PERSONA_LIST;

      //channel list
      let channelUrl =
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_CHANNEL_LIST;
      if (brandSpecification?.brandSpecific) {
        channelUrl += `?brandId=${brandId}`;
      }

      try {
        const response = await axios.get(channelUrl, {
          headers: {
            Authorization: user?.id_token,
          },
        });
        if (response?.data?.status === true) {
          const defaultChannel = response?.data?.channelAttrsList.filter(
            (channel) => channel?.channelName === "Default"
          )[0];

          let updatedPersonaData = [...response?.data?.channelAttrsList];

          setPersonaData(updatedPersonaData);
          const row = {
            id: 0,
            original: defaultChannel,
          };

          onRowCheck("row", row, false);
          setRowSelection({ 0: true });
          setErrorPersonaData(null);
        } else {
          setErrorPersonaData(response?.data);
        }
      } catch (error) {
        activateSnackbar(
          "Error while retrieving persona list. Please try again later.",
          "error"
        );
      }
    } else if (!IsFreeUser && brandSpecification === undefined && user?.planCode != "chgpt-essentials") {
      // Show error message if IsFreeUser is false and brandSpecification is undefined
      showToast(<UpgradeToast />, "error");
    }
  };

  const onRowCheck = (flag, row, isSelected) => {
    if (flag !== "table") {
      const updatedRow = { ...row?.original, _id: row?.id };
      let updatedDocument;
      if (isSelected) {
        // Remove the persona if already selected
        updatedDocument = checkedPersona.filter(
          (item) => String(item._id) !== String(row.id)
        );
      } else {
        // Ensure uniqueness while adding
        updatedDocument = [...checkedPersona, updatedRow].filter(
          (v, i, a) => a.findIndex((t) => t._id === v._id) === i
        );
      }

      const chosenPersona = [...new Set(updatedDocument.map((doc) => doc.id))]; // Unique IDs
      const chosenTaxonomyFileName = [
        ...new Set(
          updatedDocument
            .map((doc) => doc?.taxonomyFileName)
            .filter((name) => name?.trim())
        ),
      ].join(", ");

      setCheckedPersona(updatedDocument);
      dispatch(setChosenPersona(chosenPersona));
      dispatch(setChosenTaxonomy(chosenTaxonomyFileName));

      if (chosenPersona.length === 0) {
        activateSnackbar(
          "Please select at least one Channel to move ahead",
          "error"
        );
      }
    } else {
      if (isSelected) {
        setCheckedPersona([]);
        dispatch(setChosenPersona(""));
        dispatch(setChosenTaxonomy(null));
      } else {
        if (isSelected) {
          setCheckedPersona([]);
          dispatch(setChosenPersona(""));
          dispatch(setChosenTaxonomy(null));
        } else {
          const ids = [...new Set(row.map((r) => r?.id))];
          const chosenTaxonomyFileName = [
            ...new Set(
              row.map((r) => r?.taxonomyFileName).filter((name) => name?.trim())
            ),
          ].join(", ");

          dispatch(setChosenPersona(ids));
          dispatch(setChosenTaxonomy(chosenTaxonomyFileName));

          setCheckedPersona(row);
        }
      }
    }
  };
  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  useEffect(() => {
    if (userState?.userInfo && Object.keys(userState.userInfo).length > 0) {
      getPersonaList();
    }
  }, [userState?.userInfo]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
              onClick: () => {
                const allRows = table
                  .getRowModel()
                  .rows.map((row) => ({ ...row.original, _id: row.id }));
                onRowCheck("table", allRows, table.getIsAllRowsSelected());
              },
            }}
          />
        ),
        cell: ({ row, table }) => {
          const rowIndex = table.getRowModel()?.rows.indexOf(row);
          return (
            <Box>
              <IndeterminateCheckbox
                {...{
                  checked: row.getIsSelected(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: row.getToggleSelectedHandler(),
                  onClick: () => onRowCheck("row", row, row.getIsSelected()),
                }}
              />
            </Box>
          );
        },
      },

      {
        header: "Channel Name",
        accessorKey: "channelName",
        cell: (props) => {
          return (
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
          );
        },
      },
      {
        header: "Description",
        accessorKey: "channelDescription",
        cell: (props) => {
          return (
            <Box
              sx={{
                minWidth: "100px",
              }}
            >
              {props.getValue()}
            </Box>
          );
        },
      },
    ],
    [onRowCheck]
  );

  const table = useReactTable({
    data: personaData,
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
  });
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="main-dialog"
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
          },
          sx: {
            width: { xs: "90%", sm: "700px", md: "700px" },
            height: { xs: "80%", sm: "auto" },
            borderRadius: "6px",
            overflowY: "unset",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: { xs: "14px", sm: "20px" },
            fontWeight: { xs: "500" },
          }}
        >
          Choose Channel for Targeted Descriptions
          <Box sx={{ fontSize: "12px", fontWeight: "400" }}>
            Enhance marketing strategies by leveraging channel specific content
            generation, ensuring that product descriptions resonate effectively
            with specific customer segments.
          </Box>
        </DialogTitle>
        <Box className="divide-header"></Box>
        <DialogContent className="dialog-content" sx={{ padding: "0px 24px" }}>
          <Box className="hyper-container">
            <table className="hyper-table product-table">
              <thead className="hyper-thead">
                {table.getHeaderGroups()?.map((headerGroup) => (
                  <tr
                    style={{ fontWeight: "600" }}
                    className="thead-tr"
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((header) => (
                      <td
                        // style={{ padding: '10px 30px' }}
                        className="thead-tr-td-persona thead-td-persona"
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
                    ))}
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
                        padding: "10px 0px",
                      }}
                    >
                      {errorPersonaData}
                    </td>
                  </tr>
                ) : (
                  <>
                    {table.getRowModel()?.rows?.map((row, index) => {
                      const isRowSelected = row.getIsSelected();

                      return (
                        <Fragment key={row.id}>
                          <Tooltip
                            className="custom-tooltip"
                            slotProps={{
                              popper: {
                                sx: {
                                  [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                    {
                                      marginTop: "-10px",
                                    },
                                  [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                                    {
                                      marginBottom: "0px",
                                    },
                                  [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                                    {
                                      marginLeft: "0px",
                                    },
                                  [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                                    {
                                      marginRight: "0px",
                                    },
                                },
                              },
                            }}
                          >
                            <tr
                              className={`tbody-tr `}
                              style={{
                                backgroundColor: isRowSelected
                                  ? "#F9F9FF"
                                  : null,
                                userSelect: "auto",
                                opacity: 1,
                                pointerEvents: "auto",
                              }}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <td
                                  className="tbody-tr-td tbody-td-persona"
                                  key={cell.id}
                                >
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                              ))}
                            </tr>
                          </Tooltip>
                        </Fragment>
                      );
                    })}
                  </>
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
              <Typography sx={{ fontSize: { xs: "12px", sm: "16px" } }}>
                Page
              </Typography>
              <Typography
                sx={{ fontSize: { xs: "12px", sm: "16px" } }}
                minWidth="45px"
              >
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
              <Typography
                sx={{ fontSize: { xs: "12px", sm: "16px" } }}
                variant="text"
              >
                Row per Page:
              </Typography>
              <Select
                className=""
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                sx={{
                  fontSize: { xs: "12px", sm: "16px" },
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
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "end",
            padding: "10px 24px",
          }}
        >
          <Button
            disabled={checkedPersona.length === 0}
            onClick={() => choosePersona()}
            variant="contained"
            type="submit"
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </>
  );
};

export default ChooseChannelModal;
