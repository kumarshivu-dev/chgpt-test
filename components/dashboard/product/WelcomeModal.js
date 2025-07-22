import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const WelcomeModal = ({
  open,
  handleClose,
  handleStartTour,
  handleSkipTour,
}) => {
  return (
    <Box>
      <Modal
        className="welcome-modal"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style} className="welcome-modal">
          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              transform: "translate(45%, -45%)",
              zIndex: 1,
              backgroundColor: "#00000050",
              color: "#f0f1f0",
              "&:hover": {
                backgroundColor: "#00000080",
              },
            }}
            size="small"
            className="alert-close-icon"
            aria-label="close"
            onClick={() => handleSkipTour()}
          >
            <CloseRoundedIcon />
          </IconButton>
          <Box
            className="welcome-modal"
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              width="100"
              height="100"
              src="/dashboard/dashboard-logo.svg"
            ></Image>
            <Typography id="modal-title" variant="h6" component="h2">
              Welcome to ContentHubGPT!
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              We're excited to have you on board. Would you like to take a quick
              tour to discover all the amazing features?
            </Typography>
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleStartTour()}
                sx={{ mr: 2 }}
              >
                Take Tour
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleSkipTour()}
              >
                Skip
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "80%",
    sm: "60%",
  },
  height: {
    xs: "80%",
    sm: "80%",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default WelcomeModal;
