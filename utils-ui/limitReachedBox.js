import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const LimitReachedBox = ({ limitReached, title, description }) => {
  const router = useRouter();

  if (!limitReached) return null;

  return (
    <Box className="limit-reached-box">
      <Typography variant="" fontWeight="bold">
        {title || "Limit Reached"}
      </Typography>
      <Typography>
        {description || "You have reached your monthly limit. Please visit the pricing page to upgrade your plan."}
      </Typography>
      <Button
        variant="contained"
        disableFocusRipple
        className="upgrade-btn"
        onClick={() => {
          router.push({
            pathname: "/dashboard/pricing",
          });
        }}
        sx={{
          marginTop: "10px",
          backgroundColor: "#ee071b",
          borderColor: "#ee071b",
          "&:hover": {
            backgroundColor: "#ee071b",
            borderColor: "#ee071b",
          },
        }}
      >
        Upgrade Plan
      </Button>
    </Box>
  );
};

export default LimitReachedBox;