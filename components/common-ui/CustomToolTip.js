import { Box, Tooltip } from "@mui/material";
import React from "react";

const CustomToolTip = ({ title, placement = "bottom", children,disableHoverListener = false  }) => {
  return (
    <Tooltip title={title} placement={placement} arrow disableHoverListener={disableHoverListener}>
      <Box component={"span"} sx={{ cursor: "pointer" }}>
        {children}
      </Box>
    </Tooltip>
  );
};

export default CustomToolTip;
