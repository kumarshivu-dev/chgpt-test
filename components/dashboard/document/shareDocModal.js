import { useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Modal,
  Grid,
  Divider,
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../product/product.css";
import Spinner from "../../spinner/Spinner";
import { POST_SHARE_DOCUMENTS_V2 } from "../../../utils/apiEndpoints";

import DescriptionIcon from "@mui/icons-material/Description";
const ShareDocModal = ({
  user,
  isOpen,
  onClose,
  fileList,
  userIds,
  isAllUserSame,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [enteredEmails, setEnteredEmails] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const [snackbarmessage, setSnackbarmessage] = useState("");
  const [spinner, setSpinner] = useState(false);
  const isEmailValid = (email) => {
    // Simple email validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
  };

  const handleEnterPress = (event, source) => {
    if ((source === "enter" && event.key === "Enter") || source === "click") {
      if (emailInput.trim() !== "") {
        const trimmedEmail = emailInput.trim();
        if (isEmailValid(trimmedEmail)) {
          if (!enteredEmails.includes(trimmedEmail)) {
            setEnteredEmails((prevEmails) => [trimmedEmail, ...prevEmails]);
            setEmailInput("");
          } else {
            setSnackbarmessage("Duplicate email. Please use a different one.");
            setSnackbarErrorOpen(true);
          }
        } else {
          setSnackbarmessage("Invalid email address");
          setSnackbarErrorOpen(true);
          console.error("Invalid email address");
        }
      }
    }
  };

  const handleDeleteEmail = (index) => {
    setEnteredEmails((prevEmails) => prevEmails.filter((_, i) => i !== index));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarErrorOpen(false);
  };
  const handlesharefunc = async () => {
    if (!isAllUserSame && user?.role === "Editor") {
      setSnackbarmessage(
        "You can only share the document(s) owned by you.",
        "error"
      );
      setSnackbarErrorOpen(true);
      onClose();
      return;
    }

    if (enteredEmails.length == 0) {
      setSnackbarmessage("Enter at least one email to share");
      setSnackbarErrorOpen(true);
      return;
    }

    // if (!isAllUserSame && user?.role !== "Admin") {
    //   setSnackbarmessage(
    //     "You can only share the documnet(s) owned by you.",
    //     "error"
    //   );
    //   setSnackbarErrorOpen(true);
    //   onClose();
    //   return;
    // }
    setSpinner(true);
    const data = {
      receiver_mails: enteredEmails,
      filename_list: fileList,
      userIds: userIds,
    };

    // console.log("data which need to share: ", data);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_SHARE_DOCUMENTS_V2,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      // console.log("response after the sharing the file: ", response);
      if (response?.data?.status === true) {
        setSnackbarOpen(true);
        setSnackbarmessage(response.data.message);
        setEnteredEmails([]);
      } else {
        setSnackbarmessage(response.data.errorMessage);
        setSnackbarErrorOpen(true);
      }
    } catch (error) {
      console.log("catch error: ", error);
      setSnackbarmessage(error.message);
      setSnackbarErrorOpen(true);
    } finally {
      setSpinner(false);
      onClose();
    }
  };
  return (
    <>
      <Modal
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
        className="document-modal"
        keepMounted
        open={isOpen}
        onClose={onClose}
      >
        {/* Upload Container */}
        <Box className="upload-container-doc">
          <Grid container spacing={2}>
            <Grid container item xs={12} alignItems="center">
              <Grid item xs>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#000000",
                    textAlign: "left",
                  }}
                >
                  Share Documents
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  sx={{
                    fontSize: "16px",
                    textAlign: "right",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px", // Adds spacing between icon and text
                  }}
                >
                  <DescriptionIcon sx={{ color: "#022149", flexShrink: 0 }} />
                  <Box
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "block",
                      maxWidth: { xs: "150px", sm: "250px", md: "400px" },
                    }}
                    title={
                      fileList.length > 1
                        ? `${fileList.length} Documents`
                        : fileList
                    }
                  >
                    {fileList.length > 1
                      ? `${fileList.length} Documents`
                      : fileList}
                  </Box>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h7"
                  sx={{
                    color: "#000000",
                    textAlign: "left",
                  }}
                >
                  Share your documents to collaborate with your team.
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              {/* <IconButton
                onClick={() => {
                  setEnteredEmails([]);
                  onClose();
                }}
              ></IconButton> */}
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Enter email to share"
                variant="outlined"
                fullWidth
                value={emailInput}
                onChange={handleEmailInputChange}
                onKeyPress={(event) => handleEnterPress(event, "enter")}
                InputProps={{
                  endAdornment: (
                    <>
                      <Spinner show={spinner} />
                      <IconButton
                        onClick={() => handleEnterPress(null, "click")}
                        aria-label="Add Email"
                        edge="end"
                        sx={{ color: "#022149" }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              {enteredEmails.slice(0, 4).map((email, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  sx={{
                    border: "1px solid #E0E3E6",
                    borderRadius: "30px",
                    padding: "3px 6px 3px 6px",
                    marginRight: "8px",
                    marginBottom: "8px",
                    flex: 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    {email}
                  </Typography>
                  <IconButton onClick={() => handleDeleteEmail(index)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              ))}
              {enteredEmails.length > 4 && (
                <Typography variant="body1" sx={{ color: "#223B64" }}>
                  +{enteredEmails.length - 4} more
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid>
            <Divider sx={{ width: "100%" }} />
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #C5C5C5",
              padding: "16px 0",
              gap: "7.5px",
            }}
          >
            <Button
              className="cancelbtn"
              variant="outlined"
              sx={
                {
                  // border: "1px solid #E0E3E6",
                  // borderRadius: "8px",
                  // backgroundColor: "#FFFFFF",
                  // color: "black",
                  // padding: "10px 14px 10px 14px",
                  // "&:hover": {
                  //   backgroundColor: "#FFFFFF",
                  // },
                }
              }
              onClick={() => {
                setEnteredEmails([]);
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              className="sharebtn"
              variant="contained"
              onClick={() => handlesharefunc()}
              sx={
                {
                  // border: "1px solid #E0E3E6",
                  // borderRadius: "8px",
                  // backgroundColor: "#D77900",
                  // color: "white",
                  // padding: "10px 14px 10px 14px",
                  // "&:hover": {
                  //   backgroundColor: "#D77900",
                  // },
                }
              }
            >
              Share
            </Button>
          </Grid>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          {snackbarmessage}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarErrorOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {snackbarmessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShareDocModal;
