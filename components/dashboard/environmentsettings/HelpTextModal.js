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

const HelpTextModal = ({ onCancel, text }) => {
  const [openEnableAlert, setOpenEnableAlert] = useState(true);

  const handleCloseEnableAlert = () => {
    setOpenEnableAlert(false);
    onCancel && onCancel();
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
          Information
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => handleCloseEnableAlert()}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpTextModal;
