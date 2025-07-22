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

const DisabledAcknowledgment = ({ onDisableConfirmed, onCancel }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(true);

  const handleCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
    onCancel && onCancel();
  };

  const handleDeleteConfirmed = () => {
    onDisableConfirmed && onDisableConfirmed();
    handleCloseDeleteAlert();
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
          Disable User ?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            Disabling this user will immediately log them out of the system, prevent any future logins, and block access to all features
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
            Disable
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DisabledAcknowledgment;
