import { useState } from "react";
import {
  Grid,
  Step,
  Stepper,
  StepLabel,
  StepButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 17,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      color: "#FB9005",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      color: "#FB9005",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    borderTop: "dashed",
    color: "#ccc",
    // backgroundColor:
    //   theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#edeaea",
  zIndex: 1,
  width: 20,
  height: 20,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    color: "#FFFFFF",
    background: "#FB9005",
  }),
  ...(ownerState.completed && {
    color: "#FFFFFF",
    background: "#00C52B",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;
  const icons = {
    1: completed ? <Check fontSize="1px" /> : <Typography>1</Typography>,
    2: completed ? <Check fontSize="1px" /> : <Typography>2</Typography>,
    3: completed ? <Check fontSize="1px" /> : <Typography>3</Typography>,
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

const steps = ["Upload Page", "Select Enhancement", "Result"];
const ProgressTracker = ({ active }) => {
  const [activeStep, setActiveStep] = useState(0);
  const router = useRouter();

  const handleStepClick = (stepIndex) => {
    setActiveStep(stepIndex);
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

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Stepper
          sx={{
            marginTop: "10px",
          }}
          activeStep={active}
          alternativeLabel
          connector={<ColorlibConnector />}
        >
          {steps.map((label, index) => (
            <Step className="step_step" key={label}>
              <StepButton
                className="step_button"
                style={{ cursor: index === 2 ? 'auto' : 'pointer' }}
                onClick={() => handleStepClick(index)}
                // disabled={index !== activeStep}
              >
                <StepLabel
                  className="step_label"
                  StepIconComponent={ColorlibStepIcon}
                >
                  {/* {label} */}
                </StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Grid>
  );
};

export default ProgressTracker;
