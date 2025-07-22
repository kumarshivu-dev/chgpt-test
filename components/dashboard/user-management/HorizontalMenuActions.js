import { useState, Fragment } from "react";
import { Box, Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import AddBrandModal from "./AddBrandModal";
import AddIcon from "@mui/icons-material/Add";

const HorizontalMenuActions = ({
  anchorPosition,
  onClose,
  rowData,
  onTableUpdate,
  user,
  brands,
}) => {
  const [addBrandModal, setAddBrandModal] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  console.log("row data: ", rowData);

  const handleOpenAddBrandModal = () => {
    console.log("Opening Add Brand Modal");
    setAddBrandModal(true);
  };

  const handleCloseAddBrandModal = () => {
    console.log("Closing Add Brand Modal");
    setAddBrandModal(false);
    onClose();
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      />
      <Menu
        id="account-menu"
        anchorReference="anchorPosition"
        anchorPosition={
          anchorPosition.x !== null && anchorPosition.y !== null
            ? { top: anchorPosition.y, left: anchorPosition.x }
            : undefined
        }
        open={Boolean(anchorPosition.x !== null && anchorPosition.y !== null)}
        onClose={onClose}
      >
        <MenuItem onClick={handleOpenAddBrandModal}>
          <ListItemIcon
            sx={{
              color: "#303030",
            }}
          >
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="">Update Brands</Typography>
        </MenuItem>
      </Menu>

      {/* Modal for Adding Brand */}
      <AddBrandModal
        user={user}
        isOpen={addBrandModal}
        onClose={handleCloseAddBrandModal}
        onTableUpdate={onTableUpdate}
        rowData={rowData}
        brands={brands}
        activateSnackbar={activateSnackbar}
      />

      {/* Snackbar Error handling section  */}
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Fragment>
  );
};

export default HorizontalMenuActions;
