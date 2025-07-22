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


const VcpuLimitExceededModal = ({ onCancel }) => {
  const [openEnableAlert, setOpenEnableAlert] = useState(true);

  const handleCloseEnableAlert = () => {
    setOpenEnableAlert(false);
    if (onCancel) {
      onCancel(); // Notify parent component to handle cancellation 
    }
  };

  return (
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
        vCPU Limit Exceeded
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText
          sx={{
            color: "#000000",
          }}
          id="alert-dialog-description"
        >
          You have requested more vCPU capacity than your current vCPU limit of 0
          allows for the instance bucket that the specified instance type belongs to.
          Please visit{" "}
          <a
            href="http://aws.amazon.com/contact-us/ec2-request"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://aws.amazon.com/contact-us/ec2-request
          </a>{" "}
          to request an adjustment to this limit.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleCloseEnableAlert}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VcpuLimitExceededModal;
