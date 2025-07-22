import { Box, Typography, IconButton, Link } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useWarning } from "../../context/WarningContext";

const WarningBox = () => {
  const { showWarning, setShowWarning } = useWarning();

  if (!showWarning) return null;

  return (
    <Box className="warning-box">
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
        onClick={() => setShowWarning(false)}
      >
        <CloseRoundedIcon />
      </IconButton>

      <Typography fontWeight="bold">
        Please <Link href="/dashboard/profile">update your profile</Link> to
        enjoy all the available features.
      </Typography>
    </Box>
  );
};

export default WarningBox;
