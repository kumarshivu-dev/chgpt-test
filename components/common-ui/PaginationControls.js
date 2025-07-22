import { Box, Button, Select, MenuItem, Typography } from "@mui/material";

const PaginationControls = ({ table, data }) => {
  return (
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
          {data?.length > 0 ? (
            <Typography fontWeight={"bold"}>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </Typography>
          ) : (
            <Typography fontWeight={"bold"}>0 of 0</Typography>
          )}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            sx={{ minHeight: 0, minWidth: 0, padding: "0 12px" }}
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
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          sx={{
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
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
  );
};

export default PaginationControls;
