import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link";
import styled from "styled-components";

export default function Footer() {
  const [windowSize, setWindowSize] = useState(800);
  // To fetch window screen width
  useEffect(() => {
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    handleSize();
  });
  return (
    <Box
      className="footerwrap"
      sx={{
        position: "fixed",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
        }}
      >
        ContentHubGPT ©2025 GSPANN, All rights reserved
      </Typography>
      <Link
        target="_blank"
        href={`${process.env.NEXT_PUBLIC_MICRO_SITE_URL}/termandconditions`}
        style={{
          color: "#fb9005",
          textDecoration: "none",
          display: "inline-block",
          padding: "0px 10px",
          borderRight: "1px solid #ccc",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.9em",
          }}
        >
          Terms and Conditions
        </Typography>
      </Link>
      <Link
        target="_blank"
        href={`${process.env.NEXT_PUBLIC_GSPANN_URL}/privacy-policy-gspann/`}
        style={{
          color: "#fb9005",
          textDecoration: "none",
          display: "inline-block",
          margin: "10px",
        }}
      >
        <Typography sx={{ fontSize: "0.9em" }}>Privacy Policy</Typography>
      </Link>
    </Box>
  );
}
