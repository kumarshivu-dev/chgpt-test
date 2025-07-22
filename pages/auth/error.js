import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { ERROR_MESSAGES } from "../../constants/oktaErrors";

const ErrorPage = () => {
  const router = useRouter();
  const { error } = router.query; // Extract error message from URL
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL; // Fetch email

  const [isQueryReady, setIsQueryReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setIsQueryReady(true); // Ensure the query has fully loaded

      if (!error) {
        router.replace("/login"); // Redirect if no error message
      }
    }
  }, [error, router]);

  if (!isQueryReady) return null; // Prevent rendering until query is ready

  // Get the correct error message (if it's a function, call it with supportEmail)
  const errorMessage =
    typeof ERROR_MESSAGES[error] === "function"
      ? ERROR_MESSAGES[error](supportEmail)
      : ERROR_MESSAGES[error] || ERROR_MESSAGES.default;

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
      <Typography variant="h4" sx={{ mt: 2 }}>
        Authentication Error
      </Typography>
      <Typography
        variant="body1"
        color="textSecondary"
        sx={{ mt: 1 }}
        dangerouslySetInnerHTML={{ __html: errorMessage }}
      />
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={() => router.push("/login")}>
          Return to Login
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
