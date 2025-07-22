import { useState } from "react";
import { Grid, Step, Stepper, StepLabel, StepButton } from "@mui/material";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import LensIcon from "@mui/icons-material/Lens";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 17,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 136deg, rgba(59, 117, 191, 1) 0%, rgba(2, 33, 73, 1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 136deg, rgba(59, 117, 191, 1) 0%, rgba(2, 33, 73, 1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#FFFFFF",
  width: 32,
  height: 32,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient( 136deg, rgba(59, 117, 191, 1) 0%, rgba(2, 33, 73, 1) 0%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient( 136deg, rgba(59, 117, 191, 1) 0%, rgba(2, 33, 73, 1) 0%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  const icons = {
    1: completed ? <Check /> : <LensIcon sx={{ fontSize: "10px" }} />,
    2: completed ? <Check /> : <LensIcon sx={{ fontSize: "10px" }} />,
    3: completed ? <Check /> : <LensIcon sx={{ fontSize: "10px" }} />,
    4: completed ? <Check /> : <LensIcon sx={{ fontSize: "10px" }} />,
    5: completed ? <Check /> : <LensIcon sx={{ fontSize: "10px" }} />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = [
  "Select Products",
  "Select Enhancements",
  "Generate",
  "Results",
  "Sync",
];

const Progress = ({ active }) => {
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
    if (stepIndex == 0) {
      router.push({
        pathname: "/walmart/dashboard",
      });
    } else if (stepIndex == 1) {
      router.push({
        pathname: "/walmart/enhancements",
      });
    } else if (stepIndex == 2) {
      router.push({
        pathname: "/walmart/generate",
      });
    } else if (stepIndex == 3) {
      router.push({
        pathname: "/walmart/results",
      });
    } else if (stepIndex == 4) {
      router.push({
        pathname: "/walmart/sync",
      });
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Stepper
          activeStep={active}
          alternativeLabel
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step className="step_step" key={label}>
              <StepButton
                className="step_button"
                onClick={() => handleStepClick(index)}
                // disabled={index !== activeStep}
              >
                <StepLabel
                  className="step_label"
                  StepIconComponent={ColorlibStepIcon}
                >
                  {label}
                </StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Grid>
  );
};

export default Progress;
