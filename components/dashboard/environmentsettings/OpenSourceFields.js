import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  CircularProgress,
  Button,
  Tooltip,
  Link,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogActions,
  colors,
  DialogContent,
} from "@mui/material";
import {
  HelpOutline,
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
  Pause,
  Stop,
} from "@mui/icons-material";
import axios from "axios";
import SaveConsentModal from "./SaveConsentModal";
import HelpTextModal from "./HelpTextModal";
import InstanceProcessingModal from "./InstanceProcessingModal";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import DownloadIcon from "@mui/icons-material/Download";

import {
  GET_CLOUD_INFO,
  SAVE_CLOUD_DETAILS,
  OPERATE_CLOUD_INSTANCE,
  UPDATE_USER_PROFILE,
  CLOUDSERVICE_CLOUD_VERIFY_CREDENTIALS,
  GET_CLOUD_AWS_REGIONS,
  GET_MODELS_LIST,
} from "../../../utils/apiEndpoints";

import useInstanceTracker from "../../../hooks/tracker/useInstanceTracker";
import VcpuLimitExceededModal from "./VcpuLimitExceededModal";
import {
  AWS_SERVICE_TERMS_URL,
  CLOUD_TNC_AMAZON_SERVICES,
  LLM_TNC_LLM_SERVICES,
} from "../../../constants/texts";
import DownloadPemFile from "./downloadPemFile";
import { downloadCloudConfigurationPDF } from "./CloudConfigurationPdf";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import { useToast } from "../../../context/ToastContext";
import DefaultOpenAIDialog from "./DefaultOpenAIDialog";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../../store/userSlice";
import { useRouter } from "next/router";
import { blue } from "@mui/material/colors";
const OpenSourceFields = ({ user,onAgreeTerminate,setDisableSelection, disableSelection}) => {
  const userStore = useSelector((state) => state.user);
  const { userInfo } = userStore;

  const dispatch = useDispatch();
  const router = useRouter();

  // react-state-management
  const [defaultOpenAIDialogOpen, setDefaultOpenAIDialogOpen] = useState(false);
  const [launchConfirmDialog, setLaunchConfirmDialog] = useState(false);

  // Restore state from a single cookie
  // Restore state from localStorage
  const [persistentState, setPersistentState] = useState(() => {
    const savedState = localStorage.getItem("persistentState");
    return savedState
      ? JSON.parse(savedState)
      : {
          instanceState: "PENDING",
          taskId: null,
          isModalOpen: false,
          instanceOperation: "",
        };
  });
  const { instanceState, taskId, isModalOpen, instanceOperation } =
    persistentState;
  const { showToast } = useToast();

  const [isModalVisible, setModalVisible] = useState(
    persistentState.isModalOpen
  ); // Local visibility control

  const [cloudSetup, setCloudSetup] = useState("");
  const [secretKey, setSecretKey] = useState(null);
  const [accessKey, setAccessKey] = useState(null);
  const [instanceLLM, setInstanceLLM] = useState("");
  const [instanceTypes, setInstanceTypes] = useState([]);
  const [instanceType, setInstanceType] = useState("");
  const [instanceVolume, setInstanceVolume] = useState("");
  const [labelVolume, setLabelVolume] = useState(50);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [volumeError, setVolumeError] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [VcpuLimitDialog, setVcpuLimitDialog] = useState(false);
  const [VolumeChange, setVolumeChange] = useState(false);
  const [VcpuTextDialog, setVcpuTextDialog] = useState("");
  const [isFormSaved, setIsFormSaved] = useState(true);
  const [isLaunchedDisabled, setLaunchDisabled] = useState(false);
  const [llmlist, setLlmlist] = useState([]);
  const [llmTermsConditions, setllmTermsConditions] = useState(null);
  const[terminateDisabled , setTerminateDisabled] = useState(false);
  const [shouldSetToOpenAI, setShouldSetToOpenAI] = useState(false);
  // const [taskId, setTaskId] = useState("");

  // const [instanceOperation, setInstanceOperation] = useState(null);

  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isKeyVerified, setIsKeyVerified] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false); // Tracks user interaction

  const [llmTermsAccepted, setllmTermsAccepted] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const isEditor = user?.role === "Editor";

  const [lastProgress, setLastProgress] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTermsAcceptanceChange = (event) => {
    setIsTermsAccepted(event.target.checked);
  };
  const handlellmTerms = (event) => {
    setllmTermsAccepted(event.target.checked);
  };

  const handleUpdatellmOpenAI = async () => {
    const data = {
      chosen_llm: "openai", // Set chosen_llm explicitly to "openai"
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + UPDATE_USER_PROFILE,
        data,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      if (response?.status === 200) {
        showToast("LLM set to OpenAI successfully!", "success");
      }
    } catch (err) {
      showToast("Failed to update LLM to OpenAI!", "error");
    }
  };

  const handleInstanceOperation = async (operation, agree = false) => {
    const url = process.env.NEXT_PUBLIC_BASE_URL + OPERATE_CLOUD_INSTANCE;

    try {
      const payload = { operation };
      if (operation === "launch") {
        handleUpdateChoosellm();
      }
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: user?.id_token,
        },
      });

      const errorMessage = response?.data?.error?.message;
      if (
        errorMessage?.includes("VcpuLimitExceeded") ||
        errorMessage?.includes("vCPU")
      ) {
        setVcpuLimitDialog(true); // Open the SaveConsentModal
        return; // Stop further processing
      }

      if (response?.status === 202) {
        setPersistentState({
          ...persistentState,
          taskId: response?.data?.taskId,
          isModalOpen: true,
          instanceOperation: operation,
          instanceState: { ...instanceState, status: "PROCESSING" },
        });
        setModalVisible(true); // Show the modal visually
      }

      if (operation === "terminate") {
        setLaunchDisabled(true);
        setTimeout(() => setLaunchDisabled(false), 15 * 60 * 1000);
        if (agree) {
          handleUpdatellmOpenAI();
          setShouldSetToOpenAI(true);
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        `Some error occured during ${operation}`;

      showToast(`Error during ${operation}: ${errorMessage}`, "error");
    }
  };

  const handleSaveCloudDetails = async () => {
    //  Sends a POST request to save data
    try {
      // Gather terms and conditions details
      const cloud_tnc = CLOUD_TNC_AMAZON_SERVICES;
      const llm_tnc = LLM_TNC_LLM_SERVICES;
      const cloud_tnc_accept_date = isTermsAccepted
        ? new Date().toISOString()
        : null;
      const llm_tnc_accept_date = llmTermsAccepted
        ? new Date().toISOString()
        : null;

      const data = {
        access_key: accessKey,
        secret_key: secretKey,
        input_llm: instanceLLM.model_name,
        cloud_platform: cloudSetup,
        region: selectedRegion,
        instance_type: instanceType,
        volume: parseInt(instanceVolume, 10),
        cloud_tnc,
        cloud_tnc_accept_date,
        is_cloud_tnc_accepted: isTermsAccepted,
        llm_tnc,
        is_llm_tnc_accepted: llmTermsAccepted,
        llm_tnc_accept_date,
      };

      setVolumeChange(false);
      const handle_url = process.env.NEXT_PUBLIC_BASE_URL + SAVE_CLOUD_DETAILS;
      const response = await axios.post(handle_url, data, {
        headers: {
          Authorization: user?.id_token,
        },
      });

      if (response?.status == 200) {
        setIsFormSaved(true);
        dispatch(setUserInfo({ ...userInfo, chosen_llm: data?.input_llm }));
        showToast("Cloud details are saved or updated successfully", "success");

        handleUpdateChoosellm();
      }
    } catch (error) {
      showToast("Failed to update cloud details.Please try again");
    }
  };

  // FETCHING THE REGIONS LIST
  const fetchRegions = async () => {
    if (!accessKey || !secretKey) {
      showToast(
        "Please provide the Access and Secret key before fetching instance types.",
        "error"
      );
      return;
    }

    if (cloudSetup === "aws") {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const fetchRegionUrl =
          process.env.NEXT_PUBLIC_BASE_URL + GET_CLOUD_AWS_REGIONS;
        const data = {
          access_key: accessKey,
          secret_key: secretKey,
        };
        const response = await axios.post(fetchRegionUrl, data, {
          headers: {
            Authorization: user?.id_token,
            "Content-Type": "application/json", // Ensure JSON format
          },
        });

        const regionsList = (await response.data) || [];
        setRegions([...regionsList]); // Update the regions state with the fetched data
      } catch (error) {
        setRegions([]); // Clear regions in case of error
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    }
  };

  const fetchInstanceTypes = async () => {
    if (!selectedRegion || !cloudSetup || !instanceLLM) {
      showToast(
        "Please select a region, cloud setup, and LLM before fetching instance types.",
        "error"
      );
      return;
    }

    const inLLm = "llama3.1";

    setLoading(true);

    try {
      const fetchInstanceTypesUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cloudService/cloud/${cloudSetup}/regions/${selectedRegion}/llm/instances`;

      const response = await axios.post(
        fetchInstanceTypesUrl, // API endpoint
        {
          access_key: accessKey, // Request body
          secret_key: secretKey,
        },
        {
          headers: {
            Authorization: user?.id_token, // Headers
            "Content-Type": "application/json",
          },
        }
      );

      setInstanceTypes(response.data.instance_types || []);
    } catch (error) {
      setInstanceTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInstanceChange = (e) => {
    const selectedInstanceType = e.target.value;

    if (!instanceLLM?.supported_instance_type?.includes(selectedInstanceType)) {
      return showToast(
        "The selected instance type is not compatible with the model.",
        "error"
      );
    }

    setInstanceType((prev) => {
      if (prev !== selectedInstanceType) {
        setIsFormSaved(false);
        return selectedInstanceType;
      }
      return prev;
    });
  };

  const handleTerminateClick = () => {
    if (!terminateDisabled) {
      setTerminateDisabled(true);
      setDefaultOpenAIDialogOpen(true);
      setTimeout(() => setTerminateDisabled(false), 5000);
    }
  };
  

  const handleCloudSetupChange = (event) => {
    const selectedValue = event.target.value;
    setCloudSetup(selectedValue);

    let url = "";
    switch (selectedValue) {
      case "aws":
        url = "https://aws.amazon.com/console/";
        break;
      case "gcp":
        url = "https://cloud.google.com/cloud-console";
        break;
      case "azure":
        url = "https://signup.live.com/signup";
        break;
      default:
        return;
    }
    window.open(url, "_blank");
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value;
    setInstanceVolume(volume);
    setIsFormSaved(false);
    setVolumeChange(true);
    if (volume < labelVolume) {
      setVolumeError(true);
    } else {
      setVolumeError(false);
    }
  };

  const handleOpenDialog = (text) => {
    setDialogText(text);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleLimitDialogClose = () => {
    setVcpuLimitDialog(false);
  };

  const handleCloseProcessingModal = () => {
    setShowProcessingModal(false);
  };

  const handleOpenSaveDialog = () => {
    setShowSaveDialog(true);
  };

  const handleAccessKeyChange = (e) => {
    const value = e.target.value;
    setIsFormSaved(false);
    setAccessKey(value);
    setHasInteracted((prev) => ({ ...prev, accessKey: true }));
    if (value === "") {
      setIsKeyVerified(null); // Reset verification state when input is empty
    }
  };

  const handleSecretKeyChange = (e) => {
    const value = e.target.value;
    setSecretKey(value);
    setHasInteracted((prev) => ({ ...prev, secretKey: true }));
    if (value === "") {
      setIsKeyVerified(null); // Reset verification state when input is empty
    }
  };

  const handleCloseSaveDialog = () => {
    setShowSaveDialog(false);
  };

  const getCloudInformation = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + GET_CLOUD_INFO,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );
    const cloudInfo = response?.data;
    const instanceStatus = cloudInfo?.instance_state || "PENDING";
    if (instanceStatus === "LAUNCHED") {
      setDisableSelection(true);
      localStorage.setItem("DisableSelection", "true");
    } else {
      setDisableSelection(false);
      localStorage.setItem("DisableSelection", "false");
    }

      setAccessKey(response?.data?.access_key);
      setSecretKey(response?.data?.secret_key);
      setCloudSetup(response?.data?.cloud_platform);
      // setInstanceLLM(response?.data?.input_llm);

      const backendLLM = (response?.data?.input_llm || "").trim().toLowerCase();

      const llmMatch = llmlist.find(
        (llm) => llm.model_name.trim().toLowerCase() === backendLLM
      );

      if (llmMatch) {
        setInstanceLLM(llmMatch);
        setllmTermsConditions(llmMatch?.terms_and_conditions);
      } else {
        showToast("unable to fetch LLM type");
      }

      setSelectedRegion(response?.data?.region_name);
      setInstanceType(response?.data?.instance_type);
      setInstanceVolume(response?.data?.instance_volume);
      setllmTermsAccepted(response?.data.is_cloud_tnc_accepted);
      setIsTermsAccepted(response?.data?.is_llm_tnc_accepted);
      // setInstanceState(response?.data?.instance_state);

      // Update the instance state in persistentState

      setPersistentState((prevState) => ({
        ...prevState,
        instanceState: response?.data?.instance_state || "PENDING",
      }));

      // Automatically trigger verifi5cation if access and secret keys are available
      if (response?.data?.access_key && response?.data?.secret_key) {
        handleVerifyAccessSecretKey(
          response?.data?.access_key,
          response?.data?.secret_key
        );
        setHasInteracted(true);
      }
    } catch (error) {
      showToast(
        "Network connection failed. ok refresh the page to reload the content",
        "error"
      );
    }
  };

  const handleVerifyAccessSecretKey = async () => {
    try {
      const verify_url =
        process.env.NEXT_PUBLIC_BASE_URL +
        CLOUDSERVICE_CLOUD_VERIFY_CREDENTIALS;

      const data = {
        access_key: accessKey,
        secret_key: secretKey,
      };

      const verifyResponse = await axios.post(
        verify_url,
        data,

        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      if (verifyResponse.status === 200) {
        setIsKeyVerified(true);
      } else {
        setIsKeyVerified(false);
      }
    } catch (error) {
      setIsKeyVerified(false);
    }
  };

  const handleUpdateChoosellm = async () => {
    const data = {
      chosen_llm: instanceLLM?.model_name,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + UPDATE_USER_PROFILE,
        data,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );
      if (response?.status === 200) {
      }
    } catch (err) {}
  };

  const handleComplete = (status, errorData = null, fail_70 = false) => {
    let newState = { ...persistentState.instanceState }; // Default: retain previous state

    if (status === "FAILURE" && fail_70) {
      showToast(
        "The process of instance launch failed! Please try re-launching after 5 minutes.",
        "warning"
      );

      setPersistentState({
        ...persistentState,
        instanceState: newState, // Retain previous state
        fail_70: false, // Mark failure for retry
        isModalOpen: false,
        taskId: null,
        instanceOperation: "",
      });

      setModalVisible(false);
      getCloudInformation();
      localStorage.removeItem("persistentState");
      return; //  Exit early to prevent unintended state changes
    }

    if (status === "SUCCESS") {
      switch (instanceOperation) {
        case "launch":
          newState = { status: "LAUNCHED" };
          if (user && input_llm) {
            user.chosen_llm = input_llm;
          }
          showToast("Instance launched successfully!", "success");
          setDisableSelection(true);
          break;
        case "stop":
          newState = { status: "STOPPED" };
          showToast("Instance stopped successfully!", "success");
          break;
        case "terminate":
          newState = { status: "TERMINATED" };
          setDisableSelection(false);
          showToast("Instance terminated successfully!", "success");
          if (shouldSetToOpenAI && onAgreeTerminate) {
            onAgreeTerminate(); // update radio button to open-ai
            setShouldSetToOpenAI(false); 
          }
          
          break;
        case "start":
          newState = { status: "LAUNCHED" };
          showToast("Instance started successfully!", "success");
          break;
        default:
          showToast(`${instanceOperation} completed successfully!`, "success");
          break;
      }
    } else if (status === "TIMEOUT" && instanceOperation === "launch") {
      showToast(`Operation timed out. Instance terminated.`, "warning");
      handleInstanceOperation("terminate");
    } else if (status === "FAILURE" && errorData?.error?.message) {
      const errorMessage = errorData.error.message;

      // Special handling for VcpuLimitExceeded error
      if (errorMessage.includes("VcpuLimitExceeded")) {
        showToast(
          "You have requested more vCPU capacity than your current vCPU limit of 0 allows for the instance bucket that the specified instance type belongs to. Please visit <a href='http://aws.amazon.com/contact-us/ec2-request' target='_blank' style='color: #FF0000; text-decoration: underline;'>AWS Contact Us</a> to request an adjustment to this limit.",
          "error"
        );
      } else {
        showToast(`Operation failed: ${errorMessage}`, "error");
      }

      newState = { status: instanceState.status }; // Retain previous state on failure
    } else {
      showToast(`Failed to ${instanceOperation}!`, "error");
      newState = { status: instanceState.status }; // Retain previous state on failure
    }

    setPersistentState({
      ...persistentState,
      instanceState: newState,
      fail_70: false,
      isModalOpen: false,
      taskId: null,
      instanceOperation: "",
    });

    getCloudInformation();

    setModalVisible(false); // Close the modal visually

    // Optionally clear state from localStorage if necessary
    localStorage.removeItem("persistentState");
  };

  const getModelName = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + GET_MODELS_LIST,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );
      setLlmlist(response?.data);
    } catch (error) {
      showToast(
        "Network connection failed. ok refresh the page to reload the content",
        "error"
      );
    }
  };

  const handleInstance = (e) => {
    const LLM = e.target.value;
    const prevModel = instanceLLM?.model_name?.toLowerCase() || "";
    const newModel = LLM?.model_name?.toLowerCase() || "";
  
    const getllmProvider = (modelName) => {
      const name = modelName.toLowerCase();
      if (name.includes("llama")) return "llama";
      if (name.includes("deepseek")) return "deepseek";
      if (name.includes("mistral")) return "mistral";
      return "other";
    };
  
    const prevCategory = getllmProvider(prevModel);
    const newCategory = getllmProvider(newModel);
  
    setInstanceLLM(LLM);
    setLabelVolume(LLM?.min_volume);
    setIsFormSaved(false);
    setllmTermsConditions(LLM?.terms_and_conditions);
  
    // If model has changed
    if (newModel !== prevModel) {
      if (prevCategory === newCategory) {
        // Same provider: keep checkbox, just warn to save
        showToast("Please save the updated cloud details before launching", "warning");
      } else {
        // Different provider: reset terms checkbox
        setllmTermsAccepted(false);
        showToast("Please accept the terms and conditions", "warning");
      }
    }
  };
  
  
  

  useEffect(() => {
    const init = async () => {
      await getModelName(); // only this runs on mount
    };

    init();
  }, []);

  useEffect(() => {
    if (llmlist.length > 0) {
      getCloudInformation(); // runs only after llmlist updates
    }
  }, [llmlist]);

  // Auto-call handleVerifyAccessSecretKey when both inputs are filled
  useEffect(() => {
    if (secretKey && accessKey) {
      handleVerifyAccessSecretKey();
    }
  }, [secretKey, accessKey]);

  // Save all states in one effect using localStorage
  useEffect(() => {
    localStorage.setItem("persistentState", JSON.stringify(persistentState));
  }, [persistentState]);
  
  useEffect(() => {
    const storedDisable = localStorage.getItem("DisableSelection");
    if (storedDisable !== null) {
      setDisableSelection(storedDisable === "true");
    }
  }, []);
  
  return (
    <>
      {defaultOpenAIDialogOpen && (
        <DefaultOpenAIDialog
          user={user}
          // onTerminateInstance={() => handleInstanceOperation("terminate")}
          onTerminateInstance={({ agree }) =>
            handleInstanceOperation("terminate", agree)
          }
          open={defaultOpenAIDialogOpen}
          handleClose={() => setDefaultOpenAIDialogOpen(false)}
        />
      )}
      <Box sx={{ mt: 3, width: "100%" }}>
        <FormControl
          fullWidth
          sx={{
            mb: 3,
            width: {
              xs: "100%",
              sm: "90%",
              md: "800px",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormLabel
              sx={{ fontWeight: "bold", fontSize: "1.2rem", color: "black" }}
            >
              Cloud Setup
            </FormLabel>
            <Tooltip title="Choose a cloud provider (AWS, Azure, or GCP) for deploying your instance. You'll need an account with the selected provider to proceed.">
              <HelpOutline
                sx={{
                  ml: 1,
                  fontSize: 18,
                  color: "#032148",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleOpenDialog(
                    "Choose a cloud provider (AWS, Azure, or GCP) for deploying your instance. You'll need an account with the selected provider to proceed."
                  )
                }
              />
            </Tooltip>
          </Box>
          <Select
            value={cloudSetup}
            onChange={handleCloudSetupChange}
            size="small"
            sx={{ width: "50%" }}
            disabled={
              ["LAUNCHED", "STARTED", "STOPPED"].includes(
                persistentState.instanceState
              )
            }
          >
            <MenuItem value="aws">AWS</MenuItem>
          </Select>
        </FormControl>

        {cloudSetup === "aws" && (
          <Box sx={{ mt: 0, display: "flex", flexDirection: "column", gap: 1 }}>
            {/* "Please Download" section */}
            <Typography variant="body3">
              Download the AWS setup guide
              <Button
                variant="text"
                onClick={() => downloadCloudConfigurationPDF(cloudSetup)}
              >
                USER-GUIDE
              </Button>
            </Typography>

            <SnackbarNotifier
              open={snackbar.open}
              onClose={handleCloseSnackbar}
              message={snackbar.message}
              severity={snackbar.severity}
            />

            {/* "Please review and acknowledge" section */}
            <Typography variant="body3">
              Please review and acknowledge the AWS{" "}
              <Link href={AWS_SERVICE_TERMS_URL} target="_blank" rel="noopener">
                Terms and Conditions
              </Link>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isTermsAccepted}
                    onChange={handleTermsAcceptanceChange}
                    disabled={
                      ["LAUNCHED", "STARTED", "STOPPED"].includes(
                        persistentState.instanceState
                      )
                    }
                  />
                }
              />
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            filter: isLaunched ? "blur(5px)" : "none", // Apply blur when isLaunched is true
            transition: "filter 0.3s ease", // Smooth transition for blur effect
          }}
        ></Box>

        {isTermsAccepted && (
          <>
            <Box sx={{ width: "50%" }}>
              {/* Secret Key Section */}
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                Secret Key
                <Tooltip title="Your cloud provider's secret key ensures secure access to their resources. Find this key in your cloud provider's security settings.">
                  <HelpOutline sx={{ ml: 1, fontSize: 18, color: "#032148" }} />
                </Tooltip>
              </Typography>
              <TextField // label="Secret Key"
                type={showSecretKey ? "text" : "password"}
                value={secretKey}
                onChange={handleSecretKeyChange}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowSecretKey((prev) => !prev)}
                      edge="end"
                    >
                      {showSecretKey ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
                sx={{ mb: 1 }}
                disabled={
                  ["LAUNCHED", "STARTED", "STOPPED"].includes(
                    persistentState.instanceState
                  )
                }
              />
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  color: isKeyVerified ? "green" : "red",
                }}
              >
                {hasInteracted && secretKey && isKeyVerified !== null && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      color: isKeyVerified ? "green" : "red",
                    }}
                  >
                    {isKeyVerified ? (
                      <>
                        <CheckCircleOutline sx={{ fontSize: 16, mr: 1 }} />{" "}
                        Verified
                      </>
                    ) : (
                      <>
                        <CancelOutlined sx={{ fontSize: 16, mr: 1 }} /> Not
                        Verified
                      </>
                    )}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, mb: 2, color: "gray" }}>
                Your data will be stored and accessed.
              </Typography>

              {/* Access Key Section */}
              <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
                Access Key
                <Tooltip title="An access key is paired with your secret key to authenticate and manage cloud resources. Retrieve it from your cloud provider's account dashboard.">
                  <HelpOutline sx={{ ml: 1, fontSize: 18, color: "#032148" }} />
                </Tooltip>
              </Typography>
              <TextField
                // label="Access Key"
                type={showAccessKey ? "text" : "password"}
                value={accessKey}
                onChange={handleAccessKeyChange}
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowAccessKey((prev) => !prev)}
                      edge="end"
                    >
                      {showAccessKey ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  ),
                }}
                sx={{ mb: 1 }}
                disabled={
                  ["LAUNCHED", "STARTED", "STOPPED"].includes(
                    persistentState.instanceState
                  )
                }
                
              />
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  color: isKeyVerified ? "green" : "red",
                }}
              >
                {hasInteracted && secretKey && isKeyVerified !== null && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      color: isKeyVerified ? "green" : "red",
                    }}
                  >
                    {isKeyVerified ? (
                      <>
                        <CheckCircleOutline sx={{ fontSize: 16, mr: 1 }} />{" "}
                        Verified
                      </>
                    ) : (
                      <>
                        <CancelOutlined sx={{ fontSize: 16, mr: 1 }} /> Not
                        Verified
                      </>
                    )}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                Your data will be stored and accessed.
              </Typography>
            </Box>

            <Typography
              variant="h6"
              sx={{ mt: 3, color: "black", fontWeight: "bold" }}
            >
              Instance Configuration
              <Tooltip title="Select the type of instance that matches your workload: General Purpose for balanced performance. Compute Optimized for demanding computational tasks.">
                <HelpOutline
                  sx={{ ml: 1, fontSize: 18, color: "#032148" }}
                  onClick={() =>
                    handleOpenDialog(
                      "Select the type of instance that matches your workload: General Purpose for balanced performance. Compute Optimized for demanding computational tasks."
                    )
                  }
                />
              </Tooltip>
            </Typography>

            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <Select
                value={instanceLLM}
                onChange={handleInstance}
                displayEmpty
                size="small"
                sx={{ width: "50%" }}
                disabled={
                  ["LAUNCHED", "STARTED", "STOPPED"].includes(
                    persistentState.instanceState
                  )
                }
              >
                {/* <MenuItem value="" disabled>
                  Choose LLM
                </MenuItem> */}

                {llmlist?.map((llm) => (
                  <MenuItem key={llm} value={llm}>
                    {llm?.model_name}
                  </MenuItem>
                ))}

                {/* <MenuItem value="llama3.1">llama 3.1</MenuItem> */}
              </Select>
            </FormControl>
            <Box sx={{ mt: 0 }}>
              <Typography variant="body3" sx={{ mb: 1 }}>
                Please review and acknowledge the LLM{" "}
                <Link href={llmTermsConditions} target="_blank" rel="noopener">
                  Terms and Conditions
                </Link>
                .
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={llmTermsAccepted}
                    onChange={handlellmTerms}
                    disabled={
                      ["LAUNCHED", "STARTED", "STOPPED"].includes(
                        persistentState.instanceState
                      )
                    }
                  />
                }
              />
            </Box>

            {llmTermsAccepted && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      setIsFormSaved(false); // Mark as unsaved on region change
                    }}
                    displayEmpty
                    size="small"
                    onOpen={() => {
                      fetchRegions();
                    }} // Fetch regions before opening the dropdown
                    sx={{
                      width: "50%",
                      "& .MuiSelect-displayEmpty": {
                        color: "rgba(0, 0, 0, 0.54)",
                        position: "absolute",
                        zIndex: "999",
                      },
                    }}
                    renderValue={(selected) =>
                      selected ? selected : "Select a Region"
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 3.5 + 8,
                          width: "250px",
                        },
                      },
                    }}
                    disabled={
                      ["LAUNCHED", "STARTED", "STOPPED"].includes(
                        persistentState.instanceState
                      )
                    }
                  >
                    {loading ? (
                      <MenuItem disabled>
                        <CircularProgress size={24} sx={{ marginRight: 2 }} />{" "}
                        Loading...
                      </MenuItem>
                    ) : regions?.length === 0 ? (
                      <MenuItem disabled>No regions available</MenuItem>
                    ) : (
                      regions?.map((region, index) => (
                        <MenuItem key={index} value={region}>
                          {region}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    value={instanceType}
                    onChange={handleInstanceChange}
                    displayEmpty
                    size="small"
                    onFocus={() => {
                      fetchInstanceTypes();
                    }}
                    sx={{
                      width: "50%",
                      "& .MuiSelect-displayEmpty": {
                        color: "rgba(0, 0, 0, 0.54)",
                        position: "absolute",
                        zIndex: "999",
                      },
                    }}
                    renderValue={(selected) =>
                      selected ? selected : "Select an Instance"
                    }
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 3.5 + 8, // Limits the height to show 3 items (each item ~48px height)
                          width: "250px", // Optional: Adjust menu width
                        },
                      },
                    }}
                    disabled={
                      ["LAUNCHED", "STARTED", "STOPPED"].includes(
                        persistentState.instanceState
                      )
                    }
                  >
                    {loading ? (
                      <MenuItem disabled>
                        <CircularProgress size={24} sx={{ marginRight: 2 }} />{" "}
                        Loading...
                      </MenuItem>
                    ) : instanceTypes.length === 0 ? (
                      <MenuItem disabled>No instance types available</MenuItem>
                    ) : (
                      instanceTypes.map((type, index) => (
                        <MenuItem key={index} value={type}>
                          {type}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      marginBottom: "8px",
                    }}
                  >
                    Instance Volume
                    <Tooltip title="Define the storage capacity for your instance. Minimum volume is 50 GB. Ensure sufficient storage for your LLM and data.">
                      <HelpOutline
                        sx={{ ml: 1, fontSize: 18, color: "#032148" }}
                      />
                    </Tooltip>
                  </Typography>
                  <TextField
                    type="number"
                    value={instanceVolume}
                    onChange={handleVolumeChange}
                    // label="Min 50gb"
                    label={`min ${labelVolume} gb`}
                    variant="outlined"
                    inputProps={{
                      step: 1, // Ensures only integer increments are allowed
                    }}
                    size="small"
                    sx={{
                      width: "50%",
                      marginTop: "10px",
                    }}
                    
                    disabled={
                      ["LAUNCHED", "STARTED", "STOPPED"].includes(
                        persistentState.instanceState
                      )
                    }
                    
                  />
                  {volumeError && (
                    <FormHelperText error sx={{ ml: 2 }}>
                      Volume must be greater than {labelVolume} GB
                    </FormHelperText>
                  )}
                </Box>

                {persistentState.instanceState === "STARTED" ||
                persistentState.instanceState === "LAUNCHED" ? (
                  <Box
                    sx={{
                      mt: 3,
                      mb: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleInstanceOperation("stop")}
                      >
                        Stop
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        disabled={terminateDisabled}
                        onClick={handleTerminateClick}
                        // onClick={() => setDefaultOpenAIDialogOpen(true)}
                      >
                        Terminate
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          DownloadPemFile(user, (error) =>
                            showToast(error, "error")
                          );
                        }}
                      >
                        Download-KeyFile
                      </Button>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      A .pem file is a private key used to connect to remote AWS
                      EC2 instances. It is important to store the .pem file
                      securely for future use.
                    </Typography>
                  </Box>
                ) : persistentState.instanceState === "STOPPED" ? (
                  <Box
                    sx={{
                      mt: 3,
                      mb: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleInstanceOperation("start")}
                      >
                        Start
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        disabled={terminateDisabled}
                        onClick={handleTerminateClick}
                        // onClick={() => handleInstanceOperation("terminate")}
                        
                      >
                        Terminate
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          DownloadPemFile(user, (error) =>
                            showToast(error, "error")
                          );
                        }}
                      >
                        Download-KeyFile
                      </Button>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      A .pem file is a private key used to connect to remote AWS
                      EC2 instances. It is important to store the .pem file
                      securely for future use.
                    </Typography>
                  </Box>
                ) : persistentState.instanceState === "TERMINATED" ||
                  persistentState.instanceState === "PENDING" ? (
                  <Box sx={{ mt: 3, mb: 3, display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      // onClick={() => handleInstanceOperation("launch")}
                      onClick={()=>setLaunchConfirmDialog(true)}
                      disabled={!isFormSaved || isLaunchedDisabled}
                    >
                      Launch Instance
                    </Button>
                    <Button
                      variant={VolumeChange ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => setShowSaveDialog(true)}
                      disabled={!isKeyVerified}
                    >
                      Save
                    </Button>
                  </Box>
                ) : null}
              </>
            )}

            {launchConfirmDialog &&
              <Dialog open={launchConfirmDialog} onClose={()=>setLaunchConfirmDialog(false)}>
                <DialogTitle>Are you sure want to launch the instance ?</DialogTitle>
                <DialogContent>
                  The process cannot be interrupted once the launch begins.
                </DialogContent>
                <DialogActions>
                  <Button onClick={()=>setLaunchConfirmDialog(false)}
                    variant="outlined"
                    color="primary"
                  >
                    Cancel
                  </Button >
                  <Button 
                    variant="contained"
                     color="primary"
                    onClick={()=>{
                    setLaunchConfirmDialog(false);
                    handleInstanceOperation("launch");

                  }}>
                    Launch
                  </Button>
                </DialogActions>
              </Dialog>
            }

            {isModalVisible && (
              <InstanceProcessingModal
                user={user}
                isOpen={isModalVisible}
                onClose={() => setModalVisible(false)}
                taskId={taskId}
                operation={instanceOperation}
                // activateSnackbar={activateSnackbar}
                onComplete={handleComplete}
              />
            )}


            {dialogOpen && (
              <HelpTextModal onCancel={handleCloseDialog} text={dialogText} />
            )}



            {/* Save Confirmation Dialog */}
            {showSaveDialog && (
              <SaveConsentModal
                onEnableConfirmed={() => handleSaveCloudDetails()}
                onCancel={handleCloseSaveDialog}
              />
            )}
            {VcpuLimitDialog && (
              <VcpuLimitExceededModal onCancel={handleLimitDialogClose} />
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default OpenSourceFields;