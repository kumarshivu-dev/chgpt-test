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
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Spinner from "../../spinner/Spinner";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import "./user-mgmt-style.css";
import { ConstructionOutlined } from "@mui/icons-material";
import trackActivity from "../../helper/dashboard/trackActivity";
import { useSelector } from "react-redux";
import { POST_ADD_USERS } from "../../../utils/apiEndpoints";

const AddUserModal = ({
  orgName,
  maxTeamSize,
  totalUsers,
  user,
  isOpen,
  onClose,
  onTableUpdate,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [enteredEmails, setEnteredEmails] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const userState = useSelector((state) => state.user);
  const brandIds = userState?.brandIdList;

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
          if (!enteredEmails.find((email) => email.email === trimmedEmail)) {
            setEnteredEmails((prevEmails) => [
              { email: trimmedEmail, role: "Editor" },
              ...prevEmails,
            ]);
            setEmailInput("");
          } else {
            activateSnackbar(
              "Duplicate email. Please use a different one",
              "error"
            );
          }
        } else {
          activateSnackbar("Invalid email address", "error");
        }
      }
    }
  };

  const handleDeleteEmail = (index) => {
    setEnteredEmails((prevEmails) => prevEmails.filter((_, i) => i !== index));
  };

  const handleRoleChange = (event, index) => {
    const newRole = event.target.value;
    setEnteredEmails((prevEmails) =>
      prevEmails.map((email, i) =>
        i === index ? { ...email, role: newRole } : email
      )
    );
  };

  const handlesInviteNewUser = async () => {
    if (totalUsers >= maxTeamSize) {
      activateSnackbar(
        "Please check your existing team size allowed for subscribed plan",
        "error"
      );
      return;
    }
    if (enteredEmails.length === 0) {
      activateSnackbar("Enter at least one email to add user", "error");
      return;
    }

    setSpinner(true);
    const data = {
      users: enteredEmails,
    };

    console.log("dataa: ", data);

    const editor_email = enteredEmails.map((e) => e.email).join(",");

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_ADD_USERS,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      // console.log("response after add user:", response);
      if (response?.data?.status === true) {
        trackActivity(
          "USER_INVITATION",
          "",
          user,
          editor_email,
          userState?.userInfo?.orgId,
          null,
          null,
          null,
          brandIds
        );

        activateSnackbar(response?.data?.message);
        setSpinner(false);
        setEnteredEmails([]);
        onTableUpdate();
        onClose();
      } else if (response?.data?.status === false) {
        activateSnackbar(response?.data?.message, "error");
        setSpinner(false);
        onClose();
      }
    } catch (error) {
      activateSnackbar(error.message, "error");
    } finally {
      setSpinner(false);
    }
  };

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  return (
    <Box>
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
        <Box className="add-user-container">
          <Grid container spacing={2}>
            <Grid item xs={11}>
              <Typography
                variant="h6"
                sx={{
                  color: "#000000",
                }}
              >
                Add New User
              </Typography>
              <Typography
                variant="h7"
                sx={{
                  color: "#000000",
                }}
              >
                Add a user within your team
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={() => {
                  setEnteredEmails([]);
                  onClose();
                }}
              ></IconButton>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={8}>
              <Typography fontWeight="bold">{orgName}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
              <Typography>{totalUsers} Members</Typography>
              <GroupOutlinedIcon />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Enter email to add user"
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
            <Grid item xs={12}>
              <Box
                className="displayed-email-box"
                // sx={{
                //   maxHeight: "250px", // Set the maximum height for scrolling
                //   overflowY: "auto", // Enable vertical scrolling
                // }}
              >
                {enteredEmails.map((email, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      className="input-email"
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
                        {email.email}
                      </Typography>
                      <IconButton onClick={() => handleDeleteEmail(index)}>
                        <CloseIcon />
                      </IconButton>
                    </Box>

                    <Box className="input-role">
                      <Select
                        value={email.role}
                        onChange={(event) => handleRoleChange(event, index)}
                        sx={{
                          padding: "8px",
                          height: "40px",
                          width: "120px",
                          margin: "0 8px",
                        }}
                      >
                        <MenuItem value="Editor">Editor</MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                ))}
              </Box>
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
              padding: "16px 24px 16px 24px",
              gap: "7.5px",
            }}
          >
            <Button
              className="cancelbtn"
              variant="outlined"
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
              onClick={() => handlesInviteNewUser()}
            >
              Invite
            </Button>
          </Grid>
        </Box>
      </Modal>

      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Box>
  );
};

export default AddUserModal;
