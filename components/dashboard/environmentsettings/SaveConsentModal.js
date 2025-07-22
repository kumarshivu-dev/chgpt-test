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

const SaveConsentModal = ({ onEnableConfirmed, onCancel }) => {
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
          Confirm Your Action
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            By clicking 'Yes', you are giving consent to save your access key
            and secret key for future use. This action will securely store your
            credentials.
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
            Yes, I Consent
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SaveConsentModal;
