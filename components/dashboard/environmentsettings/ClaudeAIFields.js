import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { HelpOutline } from "@mui/icons-material";
import EnvAcknowledgment from "./EnvAcknowledgment";
import {
  ADD_LLM_KEY,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
} from "../../../utils/apiEndpoints";
import { useToast } from "../../../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import trackActivity from "/components/helper/dashboard/trackActivity";
import { setUserInfo } from "../../../store/userSlice";

const ClaudeAIFields = ({ user }) => {
  const userStore = useSelector((state) => state.user);
  const { userInfo } = userStore;

  const dispatch = useDispatch();

  const [claudeAiKey, setClaudeAiKey] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [useDefaultKey, setUseDefaultKey] = useState(false);
  // const [pedningDefaultKey,setPendingDefaultKey] = useState(false);
  const [apiResponseMessage, setApiResponseMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); // state to control dialog visibility
  const [userProfile, setUserProfile] = useState(null); // state to store user profile data
  const userState = useSelector((state) => state.user);
  const [defaultKey, setDefaultKey] = useState(null);
  const [dialogAction, setDialogAction] = useState(null);
  const brandIds = userState?.brandIdList;
  const isEditor = user?.role === "Editor";

  const { showToast } = useToast();

  const storedClaudeAiKey = localStorage.getItem("claudeAiKey");

  const fetchUserProfile = async (idToken) => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_USER_PROFILE,
        {
          headers: { Authorization: idToken },
        }
      );
      if (response?.data?.status) {
        setUserProfile(response?.data); // Set the user profile data
      }
    } catch (err) {
      showToast("Unable to fetch User Data");
    }
  };

  // Fetch the user profile data when the component mounts
  useEffect(() => {
    if (user?.id_token) {
      fetchUserProfile(user.id_token);
    }

    if (storedClaudeAiKey) {
      setClaudeAiKey(storedClaudeAiKey);
    }
  }, [user?.id_token]);

  useEffect(() => {
    if (userProfile && userProfile.chosen_llm !== "claude") {
      setClaudeAiKey(""); // Empty Claude key
      localStorage.removeItem("claudeAiKey"); // Remove stored key
    }
  }, [userProfile]);

  const handleDialogOpen = (isUsingDefault) => {
    // setUseDefaultKey(isUsingDefault);
    setDialogAction(isUsingDefault ? "useDefault" : "save");

    setDialogOpen(true); // Open the confirmation dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false); // close the dialog
    setDialogAction(null);
  };

  const toggleKeyVisibility = () => setIsKeyVisible((prev) => !prev);

  const handleEnableConfirmed = async () => {
    // setSaveEnabled(true);
    // setDialogOpen(false);

    const isUsingDefault = dialogAction === "useDefault"; // Get value from the dialog
    const apiKeyToSend = isUsingDefault ? "**********" : claudeAiKey;

    // Save state
    setUseDefaultKey(isUsingDefault);
    setClaudeAiKey(apiKeyToSend);
    localStorage.setItem("useDefaultKey", JSON.stringify(isUsingDefault));
    localStorage.setItem("claudeAiKey", apiKeyToSend);

    const url = process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + ADD_LLM_KEY;

    try {
      if (userProfile) {
        const ClaudePayload = { chosen_llm: "claude" };
        await axios.post(
          `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${UPDATE_USER_PROFILE}`,
          ClaudePayload,
          { headers: { Authorization: user?.id_token } }
        );
      }

      const data = {
        llmModel: "claude",
        isValid: !isUsingDefault, // Valid only if user enters a key
        apiKey: apiKeyToSend,
      };

      const response = await axios.post(url, data, {
        headers: {
          Authorization: user?.id_token,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.status === false) {
        setApiResponseMessage(
          response?.data?.message || "API Key is not valid"
        );
      } else {
        dispatch(setUserInfo({ ...userInfo, chosen_llm: "claude" }));
        setApiResponseMessage("Verified and saved successfully!");
        showToast("Verified and Saved Successfully", "success");
        setSaveEnabled(false);
      }
    } catch (error) {
      setApiResponseMessage("Failed to save, Retry!");
    } finally {
      handleDialogClose();
    }
  };

  return (
    <Box mt={2}>
      <Box display="flex" alignItems="center">
        <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
          Anthropic Key{" "}
          <Typography component="span" sx={{ color: "red" }}>
            *
          </Typography>
        </Typography>
        <Tooltip title="Enter your Anthropic key to connect with Claude models">
          <HelpOutline sx={{ ml: 1, mt: 0, fontSize: 18, color: "#032148" }} />
        </Tooltip>
      </Box>
      <Typography
        variant="body2"
        sx={{ marginBottom: "10px", color: "#616161" }}
      >
        Enter your own Anthropic key, or choose 'Use Default' to apply the
        default Anthropic key.
      </Typography>
      <TextField
        variant="outlined"
        value={useDefaultKey ? "**********" : claudeAiKey}
        onChange={(e) => {
          setIsTouched(true);
          setUseDefaultKey(false);
          setClaudeAiKey(e.target.value);
          setSaveEnabled(true);
        }}
        helperText={
          isTouched && !claudeAiKey.trim() && !useDefaultKey
            ? "This field is required"
            : "Enter your Anthropic key or use the default."
        }
        disabled={isEditor}
        type={isKeyVisible ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleKeyVisibility}>
                {isKeyVisible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ width: "400px" }}
      />

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!saveEnabled || !claudeAiKey.trim() || isEditor}
          onClick={() => handleDialogOpen(false)}
        >
          Save
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={isEditor}
          onClick={() => handleDialogOpen(true)}
        >
          Use Default
        </Button>
      </Box>

      {apiResponseMessage && (
        <Typography
          variant="body2"
          sx={{
            color:
              apiResponseMessage === "API Key is not valid" ? "red" : "green",
            marginTop: "10px",
          }}
        >
          {apiResponseMessage}
        </Typography>
      )}

      {dialogOpen && (
        <EnvAcknowledgment
          useDefaultKey={dialogAction === "useDefault"} // Pass the current state
          onEnableConfirmed={handleEnableConfirmed}
          onCancel={handleDialogClose}
        />
      )}
    </Box>
  );
};

export default ClaudeAIFields;
