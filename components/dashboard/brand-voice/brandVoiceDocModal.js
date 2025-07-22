import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import "../../../app/dashboard/dashboard-style.css";

const BrandVoiceDocModal = ({ onDeleteConfirmed, onCancel,setResetState }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(true);

  const handleCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
    onCancel && onCancel();
  };

  const handleDeleteConfirmed = () => {
    onDeleteConfirmed && onDeleteConfirmed();
    setResetState(false);
    // handleCloseDeleteAlert();
  };
  return (
    <>
      <Dialog
        className="delete-alert-box"
        open={openDeleteAlert}
        onClose={handleCloseDeleteAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          sx={{
            color: "#C00011",
          }}
          id="alert-dialog-title"
        >
          Reset Brand Voice ?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            Are you sure you want to Reset Brand Voice? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              borderRadius: "3px",
              color: "#000000",
              border: "1px solid #ABABAB",
              "&:hover": {
                border: "1px solid #ABABAB", // Same color as default state
              },
            }}
            variant="outlined"
            onClick={() => handleCloseDeleteAlert()}
          >
            Cancel
          </Button>
          <Button
            sx={{
              borderRadius: "3px",
              border: "none",
              background: "#EE071B",
              ":hover": {
                background: "#ee071b",
                border: "none",
              },
            }}
            variant="contained"
            onClick={() => handleDeleteConfirmed()}
            autoFocus
          >
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BrandVoiceDocModal;
