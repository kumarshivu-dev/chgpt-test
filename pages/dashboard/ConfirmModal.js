import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Box, Button, Modal, Typography, useMediaQuery } from "@mui/material";
import { borderRadius } from "@mui/system";
import React from "react";

const ConfirmModal = ({ open, handleClose, onConfirm }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "85%" : 400,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    borderRadius: "10px",
    boxShadow: 24,
    p: isMobile ? 2 : 4,
  };

  const handleConfirm = async () => {
    handleClose();
    onConfirm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <WarningAmberIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />{" "}
          <Typography id="modal-modal-description">
            The domain you entered in the email does not match the domain in the
            website URL. Do you wish to continue?
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Yes
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            No
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default ConfirmModal;
