import {
  Alert,
  AlertTitle,
  Button,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { setApiClientId } from "../../../store/userSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

/**UI card to display the API integration enable or Register new public api client */
const ApiClientCard = ({ user, metadata }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [errorType, setErrorType] = useState("error"); // State for severity type
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const registerAPIClient = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + "/client/register",
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );
      
      //Dispatch the public client id to redux state
      dispatch(setApiClientId(response?.data?.clientId));

      //Navigate user to developer page
      handleExploreClick()
    } catch (err) {
      //console.log("Error during registering API client: ", err);

      // Determine severity based on status code
      const status = err.response?.status;

      if (status === 400 || status === 422) {
        setErrorType("warning");
      } else {
        setErrorType("error");
      }

      // Set error message and open snackbar
      setErrorMessage(err.response?.data?.error || "An unexpected error occurred");
      setOpenSnackbar(true);
    }
  };

  const handleExploreClick = () => {
    router.push("/dashboard/developer");
  };

  return (
    <>
      {/* TODO : snackbarNotifier can be used in future after AlertTitle inclusion. */}
      {/* Snackbar Component to display warning or error */}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={errorType} onClose={() => setOpenSnackbar(false)}>
          <AlertTitle>{errorType === "warning" ? "Warning" : "Error"}</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/**MUI : Stack to display the Integration */}
      <Stack
        spacing={3}
        height={300} /**Fix height*/
        justifyContent={"center"}
        alignItems={"center"}
        sx={{
          textAlign: "center",
          padding: "50px",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          borderRadius: "20px",
        }}
      >
        <div style={{
          "height": "40%"
        }}>
        <img
          src={"/api-logo.svg"}
          alt="logo"
          style={{ width: "100%", height: "80%", marginTop:"-22px" }}
        />
        </div>
        <Typography variant="h6" fontWeight={700} fontSize="20px">
          Access API
        </Typography>
        <Typography variant="subtitle2" color="#777777">
          Seamlessly integrate content generation process in your standalone
          applications.
        </Typography>

        {metadata?.clientId ? (
          <Button
            variant="outlined"
            onClick={handleExploreClick}
            sx={{ width: "fit-content" }}
          >
            Explore
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={() => registerAPIClient()}
            sx={{ width: "fit-content" }}
          >
            Register
          </Button>
        )}
      </Stack>
    </>
  );
};

export default ApiClientCard;