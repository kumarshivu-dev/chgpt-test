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

const DisabledBrandAcknowledgment = ({
  brandName,
  onDisableConfirmed,
  onCancel,
  title = "Disable Brand?", // Default title for disable action
  message, // Custom message prop
  confirmButtonText = "Disable", // Default button text for disable action
  confirmButtonColor = "#EE071B", // Default red color for disable
  isEnableAction = false, // Flag to determine if this is an enable action
}) => {
  const [openDeleteAlert, setOpenDeleteAlert] = useState(true);

  const handleCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
    onCancel && onCancel();
  };

  const handleDisableConfirmed = () => {
    onDisableConfirmed && onDisableConfirmed();
    handleCloseDeleteAlert();
  };

  // Dynamic message based on action type
  const getDefaultMessage = () => {
    if (message) return message;
    
    if (isEnableAction) {
      return `Are you sure you want to enable the brand ${brandName}? The brand's activities will start being tracked again.`;
    }
    
    return `Are you sure you want to disable the brand ${brandName}? The brand's activities will no longer be tracked.`;
  };

  // Dynamic colors based on action type
  const getButtonStyles = () => {
    if (isEnableAction) {
      return {
        borderRadius: "3px",
        border: "none",
      background: "#022149", // Green color for enable
        color: "#FFFFFF",
        ":hover": {
          background: "#022149",
          border: "none",
        },
      };
    }
    
    return {
      borderRadius: "3px",
      border: "none",
      background: confirmButtonColor,
      color: "#FFFFFF",
      ":hover": {
        background: confirmButtonColor,
        border: "none",
      },
    };
  };

  return (
    <Dialog
      className="delete-alert-box"
      open={openDeleteAlert}
      onClose={handleCloseDeleteAlert}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        sx={{
          color: isEnableAction ? "#022149" : "#C00011", // Green for enable, red for disable
        }}
        id="alert-dialog-title"
      >
        {title}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText
          sx={{
            color: "#000000",
          }}
          id="alert-dialog-description"
        >
          {getDefaultMessage()}
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
          onClick={handleCloseDeleteAlert}
        >
          Cancel
        </Button>
        <Button
          sx={getButtonStyles()}
          variant="contained"
          onClick={handleDisableConfirmed}
          autoFocus
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisabledBrandAcknowledgment;