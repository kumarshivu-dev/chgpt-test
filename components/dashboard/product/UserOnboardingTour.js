import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const onboardingSteps = [
  { label: "Step 1: Activate Sample Data", imgPath: "/dashboard/step-1.png" },
  { label: "Step 2: Select Items", imgPath: "/dashboard/step-2.png" },
  { label: "Step 3: Start Generation", imgPath: "/dashboard/step-3.png" },
  { label: "Step 4: Enhance with SEO", imgPath: "/dashboard/step-4.png" },
  { label: "Step 5: Edit Keywords", imgPath: "/dashboard/step-5.png" },
  { label: "Step 6: Customize Keywords", imgPath: "/dashboard/step-6.png" },
  {
    label: "Step 7: Start Product Generation",
    imgPath: "/dashboard/step-7.png",
  },
  {
    label: "Step 8: Generating Your Products, You can Relax",
    imgPath: "/dashboard/step-8.png",
  },
  { label: "Step 9: Product Ready", imgPath: "/dashboard/step-9.png" },
];

const mobileOnboardingSteps = [
  { label: "Step 1: Select Items", imgPath: "/dashboard/mobile-step-1.png" },
  {
    label: "Step 2: Activate Sample Data",
    imgPath: "/dashboard/mobile-step-2.png",
  },
  {
    label: "Step 3: Start Generation",
    imgPath: "/dashboard/mobile-step-3.png",
  },
  {
    label: "Step 4: Enhance with SEO",
    imgPath: "/dashboard/mobile-step-4.png",
  },
  { label: "Step 5: Edit Keywords", imgPath: "/dashboard/mobile-step-5.png" },
  {
    label: "Step 6: Customize Keywords",
    imgPath: "/dashboard/mobile-step-6.png",
  },
  {
    label: "Step 7: Start Product Generation",
    imgPath: "/dashboard/mobile-step-7.png",
  },
  {
    label: "Step 8: Generating Your Products, You can Relax",
    imgPath: "/dashboard/mobile-step-8.png",
  },
  { label: "Step 9: Product Ready", imgPath: "/dashboard/mobile-step-9.png" },
];

function UserOnboardingTour({ handleClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const steps = isSmallScreen ? mobileOnboardingSteps : onboardingSteps;
  const maxSteps = steps.length;

  const handleNext = () => {
    if (activeStep === maxSteps - 1) {
      handleClose();
    } else {
      setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    }
  };

  const handleBack = () => {
    setActiveStep(
      (prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        // maxWidth: 750,
        flexGrow: 1,
      }}
    >
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
        <Typography variant={isSmallScreen ? "h6" : "h3"}>
          {steps[activeStep].label}
        </Typography>
      </Paper>
      <Box>
        <img
          src={steps[activeStep].imgPath}
          alt={steps[activeStep].label}
          style={{
            maxWidth: "100%",
            maxHeight: isSmallScreen ? "350px" : "100%",
            width: isSmallScreen ? "350px" : "100%",
            objectFit: "contain",
          }}
        />
      </Box>
      <MobileStepper
        sx={{
          padding: "0",
        }}
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button variant="contained" size="small" onClick={handleNext}>
            {activeStep === maxSteps - 1 ? "Finish" : "Next"}
          </Button>
        }
        backButton={
          <Button
            variant={activeStep === 0 ? "outlined" : "contained"}
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
        }
      />
    </Box>
  );
}

export default UserOnboardingTour;
