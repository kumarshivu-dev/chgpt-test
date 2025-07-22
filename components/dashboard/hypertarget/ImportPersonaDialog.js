import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useToast } from "../../../context/ToastContext";
import {
  GET_PERSONA_LIST,
  POST_ADD_PERSONA,
} from "../../../utils/apiEndpoints";
import IndeterminateCheckbox from "../../../components/common-ui/IndeterminateCheckbox";
import axios from "axios";
import { useSelector } from "react-redux";

function ImportPersonaDialog({
  open,
  onClose,
  user,
  setHyperTableLoader,
  personaData: existingBrandPersonas,
  setPersonaData: setExistingBrandPersonas,
  getPersonaList,
}) {
  // hooks-management
  const { showToast } = useToast();

  // redux-state-management
  const userStore = useSelector((state) => state.user);
  const { userInfo } = userStore;
  const brandSpecification = userInfo?.brandSpecification;

  // react-state-management
  const [personaData, setPersonaData] = useState([]);
  const [checkedPersona, setCheckedPersona] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const onRowCheck = (flag, row, isSelected) => {
    if (flag === "table") {
      setCheckedPersona(
        isSelected
          ? []
          : row
              .filter((subRow) => subRow.getCanSelect())
              .map((subRow) => ({ ...subRow?.original, _id: subRow?.id }))
      );
    } else {
      const updatedRow = { ...row?.original, _id: row?.id };
      setCheckedPersona((prevChecked) =>
        isSelected
          ? prevChecked.filter((item) => String(item._id) !== String(row.id))
          : [...prevChecked, updatedRow]
      );
    }
  };

  const getOrgPersonas = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${GET_PERSONA_LIST}`,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );
      const responseData = response?.data?.personasAttrsList || [];
      const filteredData = responseData.filter(
        (orgPersona) =>orgPersona?.persona != "Default")
      // Filter out personas that already exist at the brand level
      // const filteredData = responseData.filter(
      //   (orgPersona) =>
      //     !existingBrandPersonas.some(
      //       (brandPersona) => brandPersona.persona === orgPersona.persona
      //     )
      // );

      filteredData.sort((a, b) => a.persona.localeCompare(b.persona));
      setPersonaData(filteredData);
    } catch (err) {
      showToast("Error fetching personas", "error");
    }
  };

  const addPersonaData = async (persona) => {
    setHyperTableLoader(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${POST_ADD_PERSONA}`,
        persona,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      if (response?.data?.status) {
        showToast("Persona added successfully", "success");
        await getPersonaList();
      } else {
        showToast("Failed to add persona", "error");
      }
    } catch (err) {
      showToast("Error adding persona", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      brandId: brandSpecification?.brandId,
      brandSpecific: brandSpecification?.brandSpecific,
      personas: checkedPersona,
    };
    onClose();
    await addPersonaData(formData);
    setHyperTableLoader(false);
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          // Get only selectable rows
          const allRows = table.getRowModel().rows;
          const selectableRows = allRows.filter(
            (row) => row.original?.promptExists === true
          );

          // Check selection state manually from rowSelection
          const allSelectableSelected =
            selectableRows.length > 0 &&
            selectableRows.every((row) => rowSelection[row.id]);

          const someSelectableSelected =
            selectableRows.some((row) => rowSelection[row.id]) &&
            !allSelectableSelected;

          return (
            <IndeterminateCheckbox
              checked={allSelectableSelected}
              indeterminate={someSelectableSelected}
              onChange={() => {
                const newSelection = {};

                if (allSelectableSelected) {
                  // Deselect all
                  allRows.forEach((row) => {
                    newSelection[row.id] = false;
                  });
                  setCheckedPersona([]);
                } else {
                  // Select only selectable rows
                  allRows.forEach((row) => {
                    if (row.original?.promptExists === true) {
                      newSelection[row.id] = true;
                    } else {
                      newSelection[row.id] = false;
                    }
                  });

                  setCheckedPersona(
                    selectableRows.map((row) => ({
                      ...row.original,
                      _id: row.id,
                    }))
                  );
                }

                setRowSelection(newSelection);
              }}
            />
          );
        },
        cell: ({ row }) => (
          <Box
            sx={{
              opacity: row.original?.promptExists === false ? 0.5 : 1,
              pointerEvents:
                row.original?.promptExists === false ? "none" : "auto",
            }}
          >
            <IndeterminateCheckbox
              checked={rowSelection[row.id] || false}
              disabled={row.original?.promptExists !== true}
              onChange={() => {
                if (row.original?.promptExists === true) {
                  const isCurrentlySelected = rowSelection[row.id];

                  setRowSelection((prev) => ({
                    ...prev,
                    [row.id]: !isCurrentlySelected,
                  }));

                  if (isCurrentlySelected) {
                    setCheckedPersona((prev) =>
                      prev.filter((item) => String(item._id) !== String(row.id))
                    );
                  } else {
                    setCheckedPersona((prev) => [
                      ...prev,
                      { ...row.original, _id: row.id },
                    ]);
                  }
                }
              }}
            />
          </Box>
        ),
      },
      {
        header: "Persona Name",
        accessorKey: "persona",
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
        header: "Description",
        accessorKey: "characteristics",
        cell: (props) => (
          <Box sx={{ minWidth: "100px" }}>
            {props.getValue()?.charAt(0).toUpperCase() +
              props.getValue().slice(1)}
          </Box>
        ),
      },
    ],
    [rowSelection, onRowCheck]
  );

  const table = useReactTable({
    data: personaData ?? [],
    columns,
    state: { rowSelection },
    enableRowSelection: false,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getRowCanSelect: (row) => row.original?.promptExists === true,
    getRowCanSelect: (row) => {
      const hasPrompt = row.original?.promptExists === true;
      return hasPrompt;
    },
  });

  useEffect(() => {
    if (open) getOrgPersonas();
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        sx: { maxWidth: "700px", width: "700px", borderRadius: "10px" },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Import Personas</DialogTitle>
      <DialogContent>
        <Box className="hyper-container">
          <table className="hyper-table product-table">
            <thead className="hyper-thead">
              {table.getHeaderGroups()?.map((headerGroup) => (
                <tr className="thead-tr" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <td
                      className="thead-tr-td-persona thead-td-persona"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="hyper-tbody">
              {personaData.length === 0 && (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: "center" }}>
                    No personas to import
                  </td>
                </tr>
              )}

              {table.getRowModel()?.rows?.map((row) => (
                <tr key={row.id} className="tbody-tr">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="tbody-tr-td tbody-td-persona"
                      style={{
                        opacity: row.original?.promptExists === false ? 0.5 : 1,
                        pointerEvents:
                          row.original?.promptExists === false
                            ? "none"
                            : "auto",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          disabled={checkedPersona?.length === 0}
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImportPersonaDialog;
