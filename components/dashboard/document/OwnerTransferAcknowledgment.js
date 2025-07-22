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

const OwnerTransferAcknowledgment = ({ onTransferConfirmed, onCancel }) => {
  const [openTransferAlert, setOpenTransferAlert] = useState(true);

  const handleCloseTransferAlert = () => {
    setOpenTransferAlert(false);
    onCancel && onCancel();
  };

  const handleDeleteConfirmed = () => {
    onTransferConfirmed && onTransferConfirmed();
    handleCloseTransferAlert();
  };

  return (
    <>
      <Dialog
        className="delete-alert-box"
        open={openTransferAlert}
        onClose={handleCloseTransferAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          background: "#2D131640",
        }}
      >
        <DialogTitle
          sx={{
            color: "#C00011",
          }}
          id="alert-dialog-title"
        >
          Transfer Ownership ?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            Are you sure you want to transfer ownership? This action cannot be
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
            onClick={() => onCancel()}
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
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OwnerTransferAcknowledgment;
