import { Box, Checkbox } from "@mui/material";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useMemo, useRef, useEffect, useState } from "react";
import "../document/document.css";

const ComplianceTable = ({
  complianceData,
  selectedFiles,
  setSelectedFiles,
  industryLevel,
}) => {
  //   const [selectedFiles, setSelectedFiles] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
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
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${monthNames[monthIndex]} ${day < 10 ? "0" : ""}${day}, ${year}`;

    // removing time for now
    // return `${monthNames[monthIndex]} ${day < 10 ? "0" : ""}${day}, ${year} ${
    //   hours < 10 ? "0" : ""
    // }${hours}:${minutes < 10 ? "0" : ""}${minutes} hrs`;
  };

  const handleUncheckAll = () => {
    setRowSelection({});
  };

  useEffect(() => {
    if (selectedFiles.length === 0) {
      handleUncheckAll();
    }
  }, [selectedFiles]);

  const onRowCheck = (flag, row, isSelected) => {
    const updatedRow = { ...row.original, id: row?.id };

    if (flag !== "table") {
      const updatedFile = isSelected
        ? selectedFiles.filter((item) => String(item.id) !== String(row.id))
        : [...selectedFiles, updatedRow];

      setSelectedFiles(updatedFile);
    } else {
      const modifiedFiles = complianceData.map((item, index) => ({
        ...item,
        id: index,
      }));
      setSelectedFiles(isSelected ? [] : modifiedFiles);
    }
  };

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

  const industryColumns = useMemo(() => [
    {
      header: "Industry Type",
      accessorKey: "filename",
      cell: (props) => {
        return <Box>{props.getValue()}</Box>;
      },
    },
  ]);

  const companyColumns = useMemo(() => [
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
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
              onClick: () => onRowCheck("row", row, row.getIsSelected()),
            }}
          />
        </Box>
      ),
    },
    {
      header: "File Name",
      accessorKey: "filename",
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
      header: "Status",
      accessorKey: "status",
      cell: (props) => {
        return <Box>{props.getValue()}</Box>;
      },
    },
    {
      header: "Uploaded",
      accessorKey: "upload_date",
      cell: (props) => {
        return <Box>{formatDate(props.getValue())}</Box>;
      },
    },
  ]);

  const table = useReactTable({
    data: complianceData,
    columns: industryLevel ? industryColumns : companyColumns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <Box className="document-container">
      <table className="doc-table">
        <thead className="thead-doc">
          {table.getHeaderGroups()?.map((headerGroup) => (
            <tr key={headerGroup.id} className="thead-tr-doc">
              {headerGroup.headers.map((header) => {
                return (
                  <td
                    key={header.id}
                    className="thead-tr-td"
                    colSpan={header.colSpan}
                    style={{ paddingLeft: industryLevel ? "60px" : "" }}
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
          {table.getRowModel()?.rows?.map((row) => {
            return (
              <tr key={row.id} className="tbody-tr-doc">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className="tbody-tr-td"
                      style={{ paddingLeft: industryLevel ? "60px" : "" }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Box>
  );
};

export default ComplianceTable;
