"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

const graphSeries = [
  { imgPath: "/graph-1.png" },
  { imgPath: "/graph-2.png" },
  { imgPath: "/graph-3.png" },
];

const mobileGraphSeries = [
  { imgPath: "/mob-graph-1.png" },
  { imgPath: "/mob-graph-2.png" },
  { imgPath: "/mob-graph-3.png" },
];

const VisualStatsGraph = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const steps = isSmallScreen ? mobileGraphSeries : graphSeries;

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, 5000); // Change slide every 5 seconds (5000ms)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeStep === steps.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setActiveStep(0);
      }, 500); // Match the duration of the transition
    }
  }, [activeStep, steps.length]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        [theme.breakpoints.down("sm")]: {
          height: "500px",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          transition: isTransitioning ? "transform 0.5s ease" : "none",
          transform: `translateX(-${activeStep * 100}%)`,
        }}
      >
        {steps.concat(steps[0]).map((image, index) => (
          <Box
            key={index}
            sx={{
              flexShrink: 0,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <img
              src={image.imgPath}
              alt={`Slide ${index}`}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                display: "block",
                maxHeight: "100%",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default VisualStatsGraph;
