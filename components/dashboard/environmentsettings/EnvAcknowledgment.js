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

const EnvAcknowledgment = ({ useDefaultKey, onEnableConfirmed, onCancel }) => {
  const [openEnableAlert, setOpenEnableAlert] = useState(true);

  const handleCloseEnableAlert = () => {
    setOpenEnableAlert(false);
    onCancel && onCancel();
  };

  const handleEnableConfirmed = () => {
    onEnableConfirmed && onEnableConfirmed(useDefaultKey);
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
          Confirmation
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            {useDefaultKey
              ? "Default Key will be selected. Are you sure you want this?"
              : "To avoid discrepancies, please make sure to provide a valid key."}
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
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EnvAcknowledgment;
