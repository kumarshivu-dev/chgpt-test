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

const EnableUserConfirmation = ({ onEnableConfirmed, onCancel }) => {
  const [openEnableAlert, setOpenEnableAlert] = useState(true);

  const handleCloseEnableAlert = () => {
    setOpenEnableAlert(false);
    onCancel && onCancel();
  };

  const handleEnableConfirmed = () => {
    onEnableConfirmed && onEnableConfirmed();
    handleCloseEnableAlert();
  };
  return (
    <>
      <Dialog
        className="delete-alert-box"
        open={openEnableAlert}
        onClose={handleCloseEnableAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          sx={{
            color: "#022149",
          }}
          id="alert-dialog-title"
        >
          Enable User ?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            Are you sure you want to enable this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => handleCloseEnableAlert()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleEnableConfirmed()}
            autoFocus
          >
            Enable
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnableUserConfirmation;
