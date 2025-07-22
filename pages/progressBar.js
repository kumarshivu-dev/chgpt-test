// import { Grid, Step, Stepper, StepLabel } from '@mui/material'
// import React from 'react'

// const Progress = ({active}) => {
// // const [activeStep, setActiveStep] = useState(0);
//     const steps = [
//         'Upload Page',
//         'Select Enhancement',
//         'Result',
//     ];

//     return (
//         <Grid container justifyContent="center">
//             <Grid item xs={12} sm={8}>
//                 <Stepper activeStep={active} alternativeLabel>
//                     {steps.map((label) => (
//                         <Step key={label}>
//                             <StepLabel>{label}</StepLabel>
//                         </Step>
//                     ))}
//                 </Stepper>
//             </Grid>
//         </Grid>
//     )
// }

// export default Progress;

import {
  Grid,
  Step,
  Stepper,
  StepLabel,
  Button,
  StepButton,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const Progress = ({ active }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [windowSize, setWindowSize] = useState(800);
  // To fetch window screen width
  useEffect(() => {
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    handleSize();
  });

  const router = useRouter();
  const steps = ["Upload Page", "Select Enhancement", "Result"];
  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex); // Update the active step when a step is clicked
    console.log("index", stepIndex);
    if (stepIndex == 0) {
      router.push({
        pathname: "/uploadpage",
      });
    } else if (stepIndex == 1) {
      router.push({
        pathname: "/enhancementPage",
      });
    }
  };
  const girdMobileStyling = {
    height: "62px",
    bgcolor: "#f1f1f1",
    pt: "14px",
  };
  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        ...(windowSize <= 768 && girdMobileStyling),
      }}
    >
      <Grid item xs={12} md={8}>
        <Stepper activeStep={active} alternativeLabel>
          {steps.map((label, index) => (
            <Step className="step_step" key={label}>
              <StepButton
                className="step_button"
                style={{ cursor: index === 2 ? "auto" : "pointer" }}
                onClick={() => handleStepClick(index)} //Handle step click
                // disabled={index !== activeStep} // Disable non-active steps
              >
                {/* <StepLabel>{label}</StepLabel> */}

                {windowSize > 768 && (
                  <StepLabel className="step_label">{label}</StepLabel>
                )}
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Grid>
  );
};

export default Progress;

<div>
  <button
    class="MuiButtonBase-root Mui-disabled MuiStepButton-root MuiStepButton-horizontal step_button css-mjpk2e-MuiButtonBase-root-MuiStepButton-root"
    tabindex="-1"
    type="button"
    disabled=""
  >
    <span class="MuiStepLabel-root MuiStepLabel-horizontal MuiStepLabel-alternativeLabel step_label css-ascpo7-MuiStepLabel-root">
      <span class="MuiStepLabel-iconContainer Mui-completed MuiStepLabel-alternativeLabel css-vnkopk-MuiStepLabel-iconContainer">
        <svg
          class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiStepIcon-root Mui-completed css-1som8g8-MuiSvgIcon-root-MuiStepIcon-root"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="CheckCircleIcon"
          style="color: #0bb10a"
        >
          <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"></path>
        </svg>
      </span>
      <span class="MuiStepLabel-labelContainer MuiStepLabel-alternativeLabel css-1vyamtt-MuiStepLabel-labelContainer">
        <span class="MuiStepLabel-label Mui-completed MuiStepLabel-alternativeLabel css-mlnqrc-MuiStepLabel-label">
          Select Enhancement
        </span>
      </span>
    </span>
  </button>

  <button
    class="MuiButtonBase-root MuiStepButton-root MuiStepButton-horizontal step_button css-mjpk2e-MuiButtonBase-root-MuiStepButton-root"
    tabindex="0"
    type="button"
  >
    <span class="MuiStepLabel-root MuiStepLabel-horizontal MuiStepLabel-alternativeLabel step_label css-ascpo7-MuiStepLabel-root">
      <span class="MuiStepLabel-iconContainer Mui-completed MuiStepLabel-alternativeLabel css-vnkopk-MuiStepLabel-iconContainer">
        <svg
          class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiStepIcon-root Mui-completed css-1som8g8-MuiSvgIcon-root-MuiStepIcon-root"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="CheckCircleIcon"
          style="color: #0bb10a"
        >
          <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm-2 17l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"></path>
        </svg>
      </span>
      <span class="MuiStepLabel-labelContainer MuiStepLabel-alternativeLabel css-1vyamtt-MuiStepLabel-labelContainer">
        <span class="MuiStepLabel-label Mui-completed MuiStepLabel-alternativeLabel css-mlnqrc-MuiStepLabel-label">
          Upload Page
        </span>
      </span>
    </span>
    <span class="MuiTouchRipple-root MuiStepButton-touchRipple css-8je8zh-MuiTouchRipple-root"></span>
  </button>
</div>;
