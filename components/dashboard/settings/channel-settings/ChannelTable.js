import { useMemo, useState, useEffect } from "react";
import {
  useDeleteChannelDataMutation,
  useGetChannelsListQuery,
} from "../../../../store/services/channel.services";
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
  IconButton,
  useTheme,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { setSelectedChannels } from "../../../../store/dashboard/documentTableSlice";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[50],
  },
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.grey[10],
  },
}));

const ChannelTable = ({ handleEdit }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const isMobileScreen = theme.breakpoints.down("md");

  const userState = useSelector((state) => state?.user);
  const documentState = useSelector((state) => state.documentTable);
  const selectedChannels = documentState?.selectedChannels;

  const brandSpecification = useSelector(
    (state) => state?.user?.userInfo?.brandSpecification
  );

  const {
    data: channelList,
    isLoading,
    error,
  } = useGetChannelsListQuery({
    isBrandSpecific: brandSpecification?.brandSpecific,
    brandId: brandSpecification?.brandId,
  });

  const [deleteChannelData] = useDeleteChannelDataMutation();

  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const [actionChannel, setActionChannel] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const onRowCheck = (flag, row, isSelected) => {
    const updatedRow = { ...row.original, id: row?.original?.id };
    if (flag !== "table") {
      setSelectedChannel((prevSelected) => {
        const updatedChannels = isSelected
          ? prevSelected?.filter(
              (item) => String(item?.id) !== String(row?.original?.id)
            )
          : [...prevSelected, updatedRow];
        dispatch(setSelectedChannels(updatedChannels));
        return updatedChannels;
      });
    } else {
      const modifiedDocumentData = table.getRowModel().rows?.map((item) => ({
        ...item?.original,
      }));
      setSelectedChannel(isSelected ? [] : modifiedDocumentData);
      dispatch(setSelectedChannels(isSelected ? [] : modifiedDocumentData));
    }
  };

  const handleDelete = (row) => {
    setIsDeleteConfirmOpen(true);
    setActionChannel([row]);
  };

  const handleConfirmDelete = () => {
    if (actionChannel && actionChannel.length > 0) {
      const payload = {
        ids: actionChannel.map((item) => item.id),
        channelNames: actionChannel.map((item) => item.channelName),
      };

      deleteChannelData(payload);
    }
    setIsDeleteConfirmOpen(false);
  };

  const handleViewChannel = (row) => {
    router.push({
      pathname: `/dashboard/settings/channel-settings/${row?.original?.id}`,
      query: {
        channelName: row?.original?.channelName,
        Taxonomy: row?.original?.taxonomyFileName,
      },
    });
  };
  const handleUncheckAll = () => {
    setSelectedChannel([]);
    setRowSelection({});
  };

  useEffect(() => {
    if (selectedChannels.length === 0) {
      handleUncheckAll();
    }
  }, [selectedChannels]);

  const columns = useMemo(() => {
    const cols = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table?.getIsAllRowsSelected()}
            indeterminate={table?.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            onClick={() => {
              onRowCheck("table", "", table.getIsAllRowsSelected());
            }}
          />
        ),
        cell: ({ row }) => (
          <Box>
            <Checkbox
              checked={row?.getIsSelected()}
              disabled={!row?.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              onClick={() => {
                onRowCheck("row", row, row.getIsSelected());
              }}
            />
          </Box>
        ),
      },
      {
        header: "Channel Name",
        accessorKey: "channelName",
        cell: (props) => <Box>{props?.getValue()}</Box>,
      },
      {
        header: "Channel Description",
        accessorKey: "channelDescription",
        cell: (props) => <Box>{props?.getValue()}</Box>,
      },
      {
        id: "link",
        cell: ({ row }) => {
          const isDefaultChannel = row?.original?.channelName === "Default";
          const isPaidUser = userState?.userInfo?.paidUser;

          if (isDefaultChannel) {
            return (
              isPaidUser && (
                <IconButton onClick={() => handleViewChannel(row)}>
                  <Visibility fontSize="small" />
                </IconButton>
              )
            );
          }

          return (
            <IconButton onClick={() => handleViewChannel(row)}>
              <Visibility fontSize="small" />
            </IconButton>
          );
        },
      },
    ];

    // Conditionally push the 'actions' column if user is Admin
    if (userState?.userInfo?.role === "Admin") {
      cols.push({
        id: "actions",
        cell: ({ row }) => {
          const isNotEditable =
            row?.original?.channelName === "Default" ||
            row?.original?.channelName === "Blog";
          const isPaidUser = userState?.userInfo?.paidUser;
          return (
            <Box sx={{ display: "flex" }}>
              {isNotEditable ? (
                isPaidUser &&
                "" // remove edit icon for default and paid one
              ) : (
                <IconButton
                  onClick={() => handleEdit(row?.original)}
                  size="small"
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}

              {!isNotEditable && (
                <IconButton
                  onClick={() => handleDelete(row?.original)}
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
            // )
          );
        },
      });
    }

    return cols;
  }, [userState?.userInfo?.role]);

  const table = useReactTable({
    data: channelList ?? [],
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  if (error) {
    return;
  }

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
                {headerGroup?.headers?.map((header) => (
                  <TableCell
                    key={header?.id}
                    sx={{ fontWeight: "bold", background: "whitesmoke" }}
                  >
                    {flexRender(
                      header?.column?.columnDef?.header,
                      header?.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {[...Array(10)].map((_, index) => (
              <StyledTableRow key={index}>
                {[...Array(columns.length)]?.map((_, idx) => (
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
                {headerGroup?.headers?.map((header) => (
                  <TableCell
                    key={header?.id}
                    sx={{ fontWeight: "bold", background: "whitesmoke" }}
                  >
                    {flexRender(
                      header?.column?.columnDef?.header,
                      header?.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table?.getRowModel()?.rows?.map((row) => (
              <StyledTableRow
                key={row?.id}
                onMouseEnter={() => setHoveredRowId(row?.id)}
                onMouseLeave={() => setHoveredRowId(null)}
              >
                {row?.getVisibleCells()?.map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell?.column?.columnDef?.cell,
                      cell?.getContext()
                    )}
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        component="div"
        count={channelList?.length}
        page={table?.getState()?.pagination?.pageIndex}
        rowsPerPageOptions={[10, 20, 30, 40, 50]}
        rowsPerPage={table?.getState()?.pagination?.pageSize}
        onPageChange={(_, newPage) => table?.setPageIndex(newPage)}
        onRowsPerPageChange={(event) => {
          table?.setPageSize(Number(event.target.value));
        }}
      /> */}
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
            {channelList?.length > 0 ? (
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

      {isDeleteConfirmOpen && (
        <Dialog
          open={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          PaperProps={{
            component: "form",

            sx: { maxWidth: "700px", width: "700px", borderRadius: "10px" },

            onSubmit: handleConfirmDelete,
          }}
        >
          <DialogTitle sx={{ fontWeight: "bold" }}>
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            Are you sure you want to delete the channel{" "}
            <Typography fontWeight={"bold"} component={"span"}>
              {actionChannel[0]?.channelName}
            </Typography>{" "}
            ?
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsDeleteConfirmOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ChannelTable;
