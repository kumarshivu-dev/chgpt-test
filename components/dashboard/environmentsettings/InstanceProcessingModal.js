import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import "../../../app/dashboard/dashboard-style.css";
import CircularWithValueLabel from "../../../pages/circularProgress";
import useInstanceTracker from "../../../hooks/tracker/useInstanceTracker";

const InstanceProcessingModal = ({
  user,
  isOpen,
  onClose,
  taskId,
  operation,
  onComplete,
}) => {
  let progress = 0;
  if (taskId !== undefined) {
    progress = useInstanceTracker(taskId, user,operation, onComplete);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", padding: "16px 24px" }}>
        <Typography variant="h3">
          {operation === "launch"
            ? "Launching Instance..."
            : `Instance ${operation}...`}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            border: "1px dashed grey",
            padding: "30px",
            borderRadius: "10px",
            margin: "16px 0px",
            backgroundColor: "#F9F9FB",
            color: "#7B89B2",
            position: "relative",
            textAlign: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <img src="/Ellipse.png" alt="Background-Image" />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <CircularWithValueLabel progress={progress} />
            </div>
          </div>
        </Box>
        <Typography
          sx={{
            color: "#5E5E5E",
            fontSize: "15px",
            margin: "20px 0px",
            textAlign: "center",
          }}
        >
          
          Once the instance is{" "}
          {operation === "launch"
            ? "launched"
            : operation === "terminate"
            ? "terminated"
            : operation}, you will be informed via email.

        </Typography>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", padding: "16px" }}
      ></DialogActions>
    </Dialog>
  );
};

export default InstanceProcessingModal;
