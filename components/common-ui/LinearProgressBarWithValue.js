import { Box, LinearProgress, Typography } from "@mui/material";
import React from "react";

const LinearProgressBarWithValue = (props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", height: "10px", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{ height: "100%", borderRadius: 1 }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default LinearProgressBarWithValue;
