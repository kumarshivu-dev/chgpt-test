import { useState, Fragment } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import "./document.css";
import axios from "axios";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import { POST_UPDATE_DOCUMENT } from "../../../utils/apiEndpoints";
import TransferOwnerShipModal from "./TransferOwnerShipModal";

const VertMenuActions = ({
  anchorPosition,
  onClose,
  rowData,
  onTableUpdate,
  user,
}) => {
  const [openRenameDialog, setOpenRenameDialog] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
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

  const handleRowAction = async (action, updatedName) => {
    // if (user?.user_id !== rowData?.userId) {
    //   activateSnackbar(
    //     `You can only ${action} the documnet(s) owned by you.`,
    //     "error"
    //   );
    //   return;
    // }

    if (
      action === "rename" &&
      user?.user_id !== rowData?.userId &&
      user?.role === "Editor"
    ) {
      activateSnackbar(
        "You can only rename the document(s) owned by you.",
        "error"
      );
      handleCloseRenameDialog();
      return;
    }

    const newName = action === "rename" ? updatedName : null;
    const data = {
      action,
      filename: rowData?.filename,
      ...(newName && { newName }),
      userId: rowData?.userId,
      orgId: rowData?.orgId,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${POST_UPDATE_DOCUMENT}`,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      // console.log("response after rename & duplicate operation: ", response);
      if (response?.data?.status === true) {
        activateSnackbar(response?.data?.message, "success");
        onTableUpdate();
      } else {
        activateSnackbar(
          response?.data?.errorMessage || "Document operation Failed",
          "error"
        );
      }
    } catch (error) {
      console.error("Error while updating Document", error);
      activateSnackbar(
        "Error while updating documents. Please try again.",
        "error"
      );
    }

    handleCloseRenameDialog();
  };

  console.log("row data: ", rowData);

  // funtion & operation for transer ownership of doc
  const handleOpenTransferModal = () => {
    if (user?.user_id !== rowData?.userId) {
      activateSnackbar(
        "You can only transfer ownership of the document(s) owned by you.",
        "error"
      );
      return;
    }
    setOpenTransferModal(true);
  };
  const handleCloseTransferModal = () => setOpenTransferModal(false);

  const handleOpenRenameDialog = () => {
    setOpenRenameDialog(true);
  };

  const handleCloseRenameDialog = () => {
    setOpenRenameDialog(false);
    setTimeout(onClose, 1000);
  };
  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      ></Box>
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
        <MenuItem onClick={() => handleOpenRenameDialog()}>
          <ListItemIcon
            sx={{
              color: "#303030",
            }}
          >
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="">Rename</Typography>
        </MenuItem>

        <MenuItem onClick={() => handleRowAction("duplicate")}>
          <ListItemIcon
            sx={{
              color: "#303030",
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="">Duplicate</Typography>
        </MenuItem>

        <MenuItem onClick={() => handleOpenTransferModal()}>
          <ListItemIcon
            sx={{
              color: "#303030",
            }}
          >
            <FolderSharedIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="">Transfer Ownership</Typography>
        </MenuItem>
      </Menu>
      {/* dialog box rename document */}
      <Dialog
        open={openRenameDialog}
        onClose={handleCloseRenameDialog}
        className=""
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            handleRowAction("rename", formJson?.newFileName);
          },
          style: { width: "500px" },
        }}
      >
        <DialogTitle>Rename Document</DialogTitle>
        <DialogContent>
          <DialogContentText>Rename Document</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="newfileName"
            name="newFileName"
            type="text"
            defaultValue={rowData?.filename}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={{}}
            variant="outlined"
            onClick={() => handleCloseRenameDialog()}
          >
            Cancel
          </Button>
          <Button
            sx={{
              marginRight: "15px",
            }}
            variant="contained"
            type="submit"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* transfer ownership of documents modal */}
      <TransferOwnerShipModal
        user={user}
        rowData={rowData}
        isOpen={openTransferModal}
        onClose={handleCloseTransferModal}
        onTableUpdate={onTableUpdate}
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

export default VertMenuActions;
