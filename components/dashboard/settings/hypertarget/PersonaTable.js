import { memo, useCallback, useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  styled,
  Checkbox,
  Skeleton,
  Typography,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useGetPersonasListQuery } from "../../../../store/services/persona.services";
import { useSelector } from "react-redux";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[50],
  },
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.grey[10],
  },
}));

const StyledTableCell = styled(TableCell)(({theme}) => ({
  "& .MuiBox-root": {
    maxWidth: "300px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}))

const ChannelTable = ({ selectedPersonaIds, setSelectedPersonaIds }) => {
  const userState = useSelector((state) => state?.user);
  const brandSpecification = useSelector(
    (state) => state?.user?.userInfo?.brandSpecification
  );

  const {
    data: personaList,
    isLoading,
    error,
  } = useGetPersonasListQuery(
    {
      brandSpecific: brandSpecification?.brandSpecific,
      brandId: brandSpecification?.brandId,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handleRowSelection = useCallback((rowId, checked) => {
    setSelectedPersonaIds((prev) =>
      checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)
    );
  }, []);

  const handleSelectAll = (checked) => {
    const allRowIds = personaList?.map((persona) => persona?.id) || [];
    setSelectedPersonaIds(checked ? allRowIds : []);
  };

  const columns = useMemo(() => {
    return [
      {
        id: "select",

        cell: ({ row }) => {
          const rowId = row.original.id;
          const isSelected = selectedPersonaIds.includes(rowId);
          return (
            <Box>
              <Checkbox
                checked={isSelected}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
                onClick={(e) => handleRowSelection(rowId, e.target.checked)}
                disabled={rowId === "default"}
              />
            </Box>
          );
        },
      },
      {
        header: "Persona Name ",
        accessorKey: "persona",
        cell: (props) => <Box>{props.getValue()}</Box>,
      },

      {
        header: "Keywords",
        accessorKey: "keywords",
        cell: (props) => {
          const keywords = props.getValue();
          const displayKeywords = Array.isArray(keywords)
            ? keywords.join(", ")
            : keywords;
          return <Box>{displayKeywords}</Box>;
        },
      },
      {
        header: "Persona Description",
        accessorKey: "characteristics",
        cell: (props) => <Box>{props.getValue()}</Box>,
      },
      {
        header: "Min Length",
        accessorKey: "minLength",
        cell: (props) => <Box>{props.getValue()}</Box>,
      },
      {
        header: "Max Length",
        accessorKey: "maxLength",
        cell: (props) => <Box>{props.getValue()}</Box>,
      },
    ];
  });

  const table = useReactTable({
    data: personaList ?? [],
    columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    debugTable: true,
  });

  if (isLoading) {
    return (
      <TableContainer>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
        >
          <TableHead>
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{ fontWeight: "bold", background: "whitesmoke" }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {[...Array(10)].map((_, index) => (
              <StyledTableRow key={index}>
                {[...Array(columns.length)].map((_, idx) => (
                  <TableCell key={idx}>
                    <Skeleton variant="text" width="80%" height={24} />
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer>
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
        >
          <TableHead>
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: "bold",
                      background: "whitesmoke",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isLoading
              ? [...Array(10)].map((_, index) => (
                  <StyledTableRow key={index}>
                    {[...Array(columns.length)].map((_, idx) => (
                      <TableCell key={idx}>
                        <Skeleton variant="text" width="80%" height={24} />
                      </TableCell>
                    ))}
                  </StyledTableRow>
                ))
              : table?.getRowModel()?.rows?.map((row) => (
                  <StyledTableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <StyledTableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </StyledTableCell>
                    ))}
                  </StyledTableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
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
            {personaList?.length > 0 ? (
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

        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "15px" }}>
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
    </>
  );
};

export default memo(ChannelTable);
