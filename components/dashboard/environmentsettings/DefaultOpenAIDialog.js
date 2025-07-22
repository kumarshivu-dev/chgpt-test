
import { POST_ENV_SETTINGS_ADD_LLM_KEY } from "../../../utils/apiEndpoints";
import { useToast } from "../../../context/ToastContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

const DefaultOpenAIDialog = ({
  user,
  open,
  handleClose,
  onTerminateInstance,
}) => {
  // hooks management
  const { showToast } = useToast();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const handleAgree = async () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 5000);
    try {
      const data = {
        isValid: "false",
        llmModel: "openai",
      };
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
          POST_ENV_SETTINGS_ADD_LLM_KEY,
        data,
        {
          headers: {
            Authorization: user?.id_token,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response?.data;

      if (responseData?.status) {
        showToast(responseData?.message, "success");
      } else {
        showToast(responseData?.message || "Failed to add LLM key!", "error");
      }
    } catch (error) {
      showToast(error?.message || "Failed to add LLM key!", "error");
    } finally {
      onTerminateInstance({ agree: true });
      handleClose();
    }
  };

  const handleDisagree = () => {
    if (buttonDisabled) return;
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 5000);
    handleClose();
    onTerminateInstance({ agree: false });
  };
  const handleCancel = () => {
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Instance Termination</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Terminating the instance will default the Open AI key to be utilized
          for your account. Do you wish to proceed?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button variant="text" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="outlined" onClick={handleDisagree} disabled={buttonDisabled}>
          Disagree
        </Button>
        <Button type="submit" variant="contained" onClick={handleAgree} disabled={buttonDisabled}>
          Agree
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default DefaultOpenAIDialog;
