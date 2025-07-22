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

const DeleteAcknowledgment = ({ onDeleteConfirmed, onCancel }) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(true);

  const handleCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
    onCancel && onCancel();
  };

  const handleDeleteConfirmed = () => {
    onDeleteConfirmed && onDeleteConfirmed();
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
        sx={{
          background: "#2D131640",
        }}
        // sx={{
        //   '& .MuiBackdrop-root"': {
        //     background: "#2D1316",
        //     opacity: "0.25",
        //   },
        // }}
      >
        <DialogTitle
          sx={{
            color: "#C00011",
          }}
          id="alert-dialog-title"
        >
          Delete Document ?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            Are you sure you want to delete this Document? All associated
            product generations will also be deleted. This action cannot be
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
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAcknowledgment;
