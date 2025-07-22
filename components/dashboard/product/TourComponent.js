import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Button,
  Fade,
  IconButton,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "../../../utils/cookies";
const TourComponent = ({ steps, handleClose, handleSkipTour }) => {
  if (getCookie("isImageRec") === "true") {
    steps = steps.imageRec;
  } else {
    steps = steps.product;
  }
  const [activeStep, setActiveStep] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const maxSteps = steps.length;
  const images = steps.length > 0 ? steps[activeStep].images : [];
  const title = steps.length > 0 ? steps[activeStep].title : "";

  const scale = window.devicePixelRatio;
  let height = isSmallScreen ? "89%" : "86%"; // Default height for 100% scaling

  if (scale >= 1.25 && scale < 1.5) {
    height = isSmallScreen ? "89%" : "85%"; // Height for 125% scaling
  }
  if (scale >= 1.5) {
    height = isSmallScreen ? "89%" : "80%"; // Height for 150% scaling
  }

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      setCookie("isTour", false);

      setCookie("isImageRec", false);

      handleSkipTour();

      handleClose();
    } else {
      setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    }
    setCurrentImageIndex(0);
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps
    );
    setCurrentImageIndex(0);
  };

  // Automatically change the image every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
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
              }}
            >
              <Box sx={{ flexGrow: 1, height: "100%" }}>
                <Paper
                  square
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    height: 50,
                    bgcolor: "background.default",
                  }}
                >
                  <Typography
                    variant={isSmallScreen ? "h3" : "h3"}
                    fontSize={isSmallScreen ? "20px !important" : "14px"}
                  >
                    {title}
                  </Typography>
                </Paper>

                <Box
                  sx={{
                    mt: isSmallScreen ? 1 : 2,
                    mb: 2,
                    position: "relative",
                    width: "100%",
                    height: `${height}`,
                  }}
                >
                  {images.map((image, index) => (
                    <Fade
                      in={currentImageIndex === index}
                      key={index}
                      timeout={1000}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {/* Display Image */}
                        <Box
                          component="img"
                          src={image}
                          alt={`Slide ${index + 1}`}
                          style={{
                            maxWidth: "100%",
                            paddingTop: isSmallScreen ? "15px" : "0px",
                          }}
                        />
                      </Box>
                    </Fade>
                  ))}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant={activeStep === 0 ? "outlined" : "contained"}
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                      display: activeStep < 1 ? "none" : "block",
                    }}
                  >
                    Previous
                  </Button>

                  <Box sx={{ display: "flex", alignItems: "center", mx: 2 }}>
                    {Array.from({ length: maxSteps }).map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor:
                            activeStep === index ? "primary.main" : "grey.400",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          lineHeight: "24px",
                          cursor: "pointer",
                        }}
                        onClick={() => setActiveStep(index)}
                      >
                        {index + 1}
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleNext}
                    // disabled={activeStep === maxSteps - 1}
                  >
                    {activeStep === maxSteps - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
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
    xs: "85%",
    sm: "80%",
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default TourComponent;
