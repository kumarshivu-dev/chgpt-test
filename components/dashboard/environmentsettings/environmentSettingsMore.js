import React, { use, useEffect, useState } from "react";
import {
  Container,
  FormControl,
  FormLabel,
  TextField,
  Tooltip,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { HelpOutline, Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import OpenSourceFields from "./OpenSourceFields";
import EnvAcknowledgment from "./EnvAcknowledgment";
import { ADD_LLM_KEY, GET_CLOUD_INFO, GET_USER_PROFILE } from "../../../utils/apiEndpoints";
import ClaudeAIFields from "./ClaudeAIFields";
import { useToast } from "../../../context/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { setUserChosenLLM, setUserInfo } from "../../../store/userSlice";

const EnvironmentSettingsMore = ({ user }) => {
  const userStore = useSelector((state) => state.user);
  const { userInfo } = userStore;

  const dispatch = useDispatch();

  const [openAiKey, setOpenAiKey] = useState("");
  const [apiResponseMessage, setApiResponseMessage] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [useDefaultKey, setUseDefaultKey] = useState(false);
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [saveEnabled, setSaveEnabled] = useState(false); // For Save button state
  const [DialogAction, setDialogAction] = useState(null);
  const [DisableSelection , setDisableSelection] = useState(false);
  const isEditor = user?.role === "Editor";
  const { showToast } = useToast();
  useEffect(() => {
    // Fetch the persisted 'useDefaultKey' state from localStorage
    const storedUseDefaultKey = localStorage.getItem("useDefaultKey");
    if (storedUseDefaultKey !== null) {
      setUseDefaultKey(JSON.parse(storedUseDefaultKey));
    }

    const fetchApiKey = async () => {
      try {
        const url =
          process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_USER_PROFILE;
        const response = await axios.get(url, {
          headers: {
            Authorization: user?.id_token,
          },
        });

        const userData = response?.data;

        if (!selectedOption) {
          // Only set if it's null (first load)
          setSelectedOption(
            userData?.chosen_llm === "openai"
              ? "open-ai"
              : userData?.chosen_llm === "claude"
              ? "claude-ai"
              : "open-source"
          );
        }

        if (userData?.chosen_llm !== "openai") {
          // If LLM is not OpenAI, remove the API key from state & localStorage

          setOpenAiKey("");
          setUseDefaultKey(false);
          setApiResponseMessage("");
          localStorage.removeItem("useDefaultKey");
          localStorage.removeItem("openAiKey");
        } else if (userData?.openApiKey) {
          // If LLM is OpenAI, store the API key
          setOpenAiKey(userData.openApiKey);
          localStorage.setItem("openAiKey", userData.openApiKey);
        } else {
        }
      } catch (error) {
        setApiResponseMessage("Failed to fetch API Key");
      }
    };

    fetchApiKey();
  }, [user, selectedOption]);

  const handleOptionChange = (event) => setSelectedOption(event.target.value);

  const handleDialogOpen = (isUsingDefault) => {
    setDialogAction(isUsingDefault ? "useDefault" : "save");
    // localStorage.setItem("useDefaultKey", JSON.stringify(useDefault)); // Persist 'useDefaultKey' in localStorage
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleSetOpenAIAfterAgree = () => {
    setSelectedOption("open-ai");
  };
  const toggleKeyVisibility = () => setIsKeyVisible((prev) => !prev);

  const handleSaveOpenAI = async () => {
    const isUsingDefault = DialogAction === "useDefault";
    const defaultKey = "********";
    setUseDefaultKey(isUsingDefault);
    localStorage.setItem("useDefaultKey", JSON.stringify(isUsingDefault));
    isUsingDefault && setOpenAiKey(defaultKey);

    // if (isUsingDefault) {
    //   setUseDefaultKey(true);
    //   localStorage.setItem("useDefaultKey", JSON.stringify(true));
    //   setOpenAiKey("**********");
    // } else {
    //   setUseDefaultKey(false);
    // }

    try {
      const data = isUsingDefault
        ? {
            apiKey: "*********",
            isValid: "false",
            llmModel: "openai",
          }
        : {
            apiKey: openAiKey,
            llmModel: "openai",
            isValid: "true",
          };

      const url = process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + ADD_LLM_KEY;

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
        dispatch(setUserInfo({ ...userInfo, chosen_llm: "openai" }));
        setApiResponseMessage("Verified and saved successfully!");
        showToast("Verified and Saved Successfully", "success");
        setSaveEnabled(false); // Disable Save after successful save
      }
    } catch (error) {
      setApiResponseMessage("Failed to save, Retry!");
    } finally {
      handleDialogClose();
    }
  };

  
  

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        pl: 0,
      }}
    >
      <FormControl>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FormLabel
            sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "black" }}
          >
            Choose Large Language Model
          </FormLabel>
          <Tooltip title="Select the type of Language Model you want to use: OpenAI for pre-trained, high-performance models. Open Source for customizable and flexible options.">
            <HelpOutline sx={{ ml: 1, fontSize: 18, color: "#032148" }} />
          </Tooltip>
        </Box>
        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
          <Tooltip
            title={DisableSelection ? "Please terminate the instance to enable model selection" : ""}
            arrow
            placement="bottom"
          >
            <span>
              <FormControlLabel
                value="open-ai"
                control={<Radio />}
                label="GPT-4o mini"
                disabled={DisableSelection}
              />
            </span>
          </Tooltip>
          <Tooltip
            title={DisableSelection ? "Please terminate the instance to enable model selection" : ""}
            arrow
            placement="bottom"
          >
            <span>
              <FormControlLabel
                value="claude-ai"
                control={<Radio />}
                label="Claude 3.5 Sonnet"
                disabled={DisableSelection}
              />
            </span>
          </Tooltip>
          <FormControlLabel
            value="open-source"
            control={<Radio />}
            label="Open Source"
          />
        </RadioGroup>
      </FormControl>

      {selectedOption === "claude-ai" && (
        <Box mt={2}>
          <ClaudeAIFields user={user} />
        </Box>
      )}

      {selectedOption === "open-ai" && (
        <Box mt={2}>
          <Box display="flex" alignItems="center">
            <h4 style={{ marginBottom: "3px" }}>
              OpenAI Key <span style={{ color: "red" }}>*</span>
            </h4>
            <Tooltip title="Enter your OpenAI API key to connect with OpenAI models">
              <HelpOutline
                sx={{ ml: 1, mt: 2, fontSize: 18, color: "#032148" }}
              />
            </Tooltip>
          </Box>
          <p style={{ marginBottom: "10px", color: "#616161" }}>
            Enter your own API key, or choose 'Use Default' to apply the default
            OpenAI key.
          </p>
          <TextField
            variant="outlined"
            value={useDefaultKey && !isTouched ? "**********" : openAiKey}
            onChange={(e) => {
              const newValue = e.target.value;
              setIsTouched(true);
              setUseDefaultKey(false);

              if (newValue.trim() !== openAiKey) {
                setSaveEnabled(true); // Enable Save if text changes
              } else {
                setSaveEnabled(false); // Disable Save if text reverts to original
              }
              setOpenAiKey(newValue);
            }}
            // onBlur={() => {
            //   if (!openAiKey.trim()) {
            //     setOpenAiKey("**********");
            //     setIsTouched(false);
            //     setSaveEnabled(false); // Disable Save if field is empty
            //   }
            // }}
            margin="normal"
            size="small"
            helperText={
              isTouched && !openAiKey.trim()
                ? "This field is required"
                : "Enter your API key or use the default."
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
            sx={{
              width: "400px",
            }}
          />
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!saveEnabled || !openAiKey.trim() || isEditor} // Disable Save if conditions are not met
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
            <p
              style={{
                color: apiResponseMessage.includes("successfully")
                  ? "green"
                  : "red",
                marginTop: "10px",
              }}
            >
              {apiResponseMessage}
            </p>
          )}
        </Box>
      )}

      {selectedOption === "open-source" && (
        <Box mt={2}>
          <OpenSourceFields 
           user={user} 
           onAgreeTerminate={handleSetOpenAIAfterAgree}
           setDisableSelection={setDisableSelection}
           disableSelection={DisableSelection}
          />
        </Box>
      )}

      {dialogOpen && (
        <EnvAcknowledgment
          useDefaultKey={DialogAction === "useDefault"}
          onEnableConfirmed={handleSaveOpenAI}
          onCancel={handleDialogClose}
        />
      )}
    </Container>
  );
};

export default EnvironmentSettingsMore;
