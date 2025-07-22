import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import {
  POST_INTEGRATION,
  PAID_INTEGRATION,
  DELETE_INTEGRATION,
} from "../../../utils/apiEndpoints";
import { GET_INTEGRATION } from "../../../utils/apiEndpoints";
import IntegrationAcknowledgment from "./IntegrationAcknowledgement";
import SubscriptionSelection from "./SubscriptionSelection";
import { BIG_COMMERCE } from "../../../constants/globalvars";
import { setApiClientId } from "../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useToast } from "../../../context/ToastContext";
import "../../../components/dashboard/integration/integration.css";
import DeleteIntegrationAcknowledgment from "./DeleteIntegrationAck";

const Integrations = {
  Salsify: ["organization_id"],
  Walmart: ["client_id", "client_secret"],
  [BIG_COMMERCE]: ["storeHash"],
  Shopify: ["store-id"],
  // api: ["clientId"],
};

const IntegrationCard = ({
  user,
  integration_type,
  integrations,
  setIntegrations,
  isLoading,
  isEnabled,
  metadata,
}) => {
  const userState = useSelector((state) => state.user);
  const [snackbarModalState, setSnackbarModalState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showIntegrationConfirmation, setShowIntegrationConfirmation] =
    useState(false); //Extra confirmation pop-up for user
  const [
    showDeleteIntegrationConfirmation,
    setShowDeleteIntegrationConfirmation,
  ] = useState(false);
  const [isSubscribedToBoth, setIsSubscribedToBoth] = useState(false);
  const [subscriptionsData, setSubscriptionData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // function to check is integrated or not
  const isIntegrated = integrations.some(
    (integration) => integration.integrationType === integration_type
  );

  // Handle form data change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const updateIntegrations = (response) => {
    try {
      // Parse the response data if it's a JSON string
      const responseData = JSON.parse(response.config.data);
      // Extract the integration type and meta data from the response
      const {
        integration_data: { integration_type, meta_data },
      } = responseData;
      // Create a new integrations array with the updated integration
      const existingIntegration = integrations.find(
        (integration) => integration.integrationType === integration_type
      );
      let updatedIntegrations;
      if (existingIntegration) {
        updatedIntegrations = integrations.map((integration) =>
          integration.integrationType === integration_type
            ? { ...integration, metaData: { ...meta_data } }
            : integration
        );
      } else {
        updatedIntegrations = [
          ...integrations,
          { integrationType: integration_type, metaData: { ...meta_data } },
        ];
      }
      setIntegrations(updatedIntegrations);
    } catch (error) {
      console.error("Error updating integrations ", error);
    }
  };

  // Handle input form submission
  const handleSubmit = async (e) => {
    setOpenModal(false);
    let emptyFields = [];
    integrations[integration_type]?.forEach((field) => {
      if (!formData[field]) {
        emptyFields.push(field);
      }
    });

    if (emptyFields.length > 0) {
      let formattedErrorMessage = emptyFields.join(", ") + " cannot be empty.";
      setErrorMessage(formattedErrorMessage);
      setOpenSnackbar(true);
      return;
    }

    setErrorMessage("");

    const data = {
      integration_data: {
        integration_type,
        meta_data: {
          ...formData,
        },
      },
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_INTEGRATION,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      if (response?.data?.status) {
        updateIntegrations(response);
        showToast(response?.data?.message, "success");
      } else if (!response?.data?.status) {
        if (response?.data?.errorCode === "E002") {
          showToast(response?.data?.errorMessage, "error");
        } else if (response?.data?.errorCode === "E003") {
          setIsSubscribedToBoth(true);
          setSubscriptionData(response?.data);
          showToast(
            response?.data?.operation || "Integration Failed",
            "warning"
          );
        } else {
          showToast(
            response?.data?.errorMessage || "Integration Failed",
            "warning"
          );
        }
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.error);
      console.error(error);
    }
    isLoading(false);
  };

  const handleConfirm = async (selectedPlan) => {
    if (!selectedPlan) {
      isLoading(false);
      showToast("Please select a plan to integrate", "error");
      return;
    }

    const data = {
      integration_data: {
        integration_type,
        meta_data: {
          ...formData,
        },
      },
      chosenSubscriptionInfo: {
        subscriptionId: selectedPlan?.subscriptionId,
      },
      chosenSubscriptionPlatform: selectedPlan?.source,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + PAID_INTEGRATION,
        data,
        {
          headers: { Authorization: user.id_token },
        }
      );
      if (response?.data?.status) {
        showToast(response.data.message, "success");
        updateIntegrations(response);
      } else {
        const errorMsg = response?.data?.errorMessage || "Integration Failed";
        if (response?.data?.errorCode === "E002") {
          showToast(errorMsg, "error");
        } else {
          showToast(errorMsg, "warning");
        }
      }
    } catch (error) {
      console.error("Integration Error:", error);
      showToast(
        error?.response?.data?.error ||
          "Something went wrong. Please try again.",
        "error"
      );
    }
    isLoading(false);
  };

  const handleAddIntegration = () => {
    if (
      formData["organization_id"]?.trim() ||
      formData["storeHash"]?.trim() ||
      formData["store-id"]?.trim
    ) {
      setShowIntegrationConfirmation(true);
    } else {
      showToast(
        "Organization ID or StoreHash or StoreID cannot be empty or just spaces.",
        "error"
      );
    }
  };

  const handleDeleteIntegrationConfirmed = async () => {
    try {
      isLoading(true);

      const payload = {
        integration_type: integration_type,
        meta_data: metadata, // this should contain fields like organization_id, storeHash etc.
      };

      const response = await axios.delete(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + DELETE_INTEGRATION,
        {
          headers: {
            Authorization: user?.id_token,
          },
          data: payload, // axios supports `data` in DELETE requests
        }
      );

      if (response?.data?.status) {
        setIntegrations(
          integrations.filter((i) => i.integrationType !== integration_type)
        );
        showToast(
          response?.data?.message || "Integration deleted successfully",
          "success"
        );
      } else {
        showToast(
          response?.data?.errorMessage || "Failed to delete integration",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting integration:", error);
      showToast(
        error?.response?.data?.error ||
          "An error occurred while deleting integration",
        "error"
      );
    } finally {
      setShowDeleteIntegrationConfirmation(false);
      isLoading(false);
    }
  };

  const handleDeleteIntegrationClick = () => {
    setShowDeleteIntegrationConfirmation(true);
  };

  const handleDeleteIntegrationCancel = () => {
    setShowDeleteIntegrationConfirmation(false);
  };

  const handleIntegrationConfirmed = async () => {
    if (integration_type === "api") {
      await registerAPIClient();
    } else {
      await handleSubmit();
    }
    setShowIntegrationConfirmation(false);
  };

  const registerAPIClient = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_INTEGRATION,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      //Dispatch the public client id to redux state
      dispatch(setApiClientId(response?.data?.clientId));

      updateIntegrations(response);
      showToast(
        response?.data?.message || "API client registered successfully.",
        "success"
      );
      //Navigate user to developer page
      handleExploreClick();
    } catch (err) {
      const status = err.response?.status;
      const severity = status === 400 || status === 422 ? "warning" : "error";

      showToast(
        err.response?.data?.error || "An unexpected error occurred.",
        severity
      );
      isLoading(false);
    }
  };

  const handleExploreClick = () => {
    router.push("/dashboard/developer");
  };

  return (
    <>
      <SnackbarNotifier
        open={snackbarModalState.open}
        onClose={() =>
          setSnackbarModalState({ ...snackbarModalState, open: false })
        }
        message={snackbarModalState.message}
        severity={snackbarModalState.severity}
      />
      <Stack className="cardcontainer">
        <div className="image">
          <img
            className="logo"
            src={
              integration_type === "Salsify"
                ? "/salsify_logo.png"
                : integration_type === "Big Commerce"
                ? "/big-commerce.png"
                : integration_type === "Shopify"
                ? "/Shopify-logo.png"
                : "/api-logo.svg"
            }
            alt={`${integration_type} logo`}
          />
        </div>
        <Typography variant="h6" fontWeight={700} fontSize="20px">
          Integration
        </Typography>
        <Typography variant="subtitle2" color="#777777">
          {integration_type === "api"
            ? "Seamlessly integrate content generation process in your standalone applications."
            : `Seamlessly integrate with ${integration_type} to enhance your content
          management process.`}
        </Typography>

        {userState?.userInfo?.role === "Admin" && (
          <Stack direction={"row"} spacing={2}>
            <Button
              variant="contained"
              onClick={() => {
                if (integration_type === "api") {
                  if (!metadata?.clientId) {
                    setShowIntegrationConfirmation(true); // Show confirmation if clientId is empty
                  } else {
                    handleExploreClick(); // Navigate if clientId exists
                  }
                } else {
                  setOpenModal(true); // Open modal for other integration types
                }
              }}
              // sx={{ width: "fit-content" }}
            >
              {integration_type === "api"
                ? metadata?.clientId
                  ? "Explore"
                  : "Register"
                : "Integrate"}
            </Button>

            {integration_type === "Salsify" && isIntegrated && (
              <Button
                variant="outlined"
                onClick={() => handleDeleteIntegrationClick()}
              >
                Remove
              </Button>
            )}
          </Stack>
        )}

        {showIntegrationConfirmation && (
          <IntegrationAcknowledgment
            integration_type={integration_type}
            formData={formData}
            onIntegrationConfirmed={handleIntegrationConfirmed}
            setShowIntegrationConfirmation={setShowIntegrationConfirmation}
            isLoading={isLoading}
          />
        )}

        {showDeleteIntegrationConfirmation && (
          <DeleteIntegrationAcknowledgment
            onDeleteConfirmed={handleDeleteIntegrationConfirmed}
            onCancel={handleDeleteIntegrationCancel}
          />
        )}

        {isSubscribedToBoth && (
          <SubscriptionSelection
            data={subscriptionsData}
            updateIntegrations={updateIntegrations}
            // integration_type={integration_type}
            // formData={formData}
            onConfirm={handleConfirm}
            setIsSubscribedToBoth={setIsSubscribedToBoth}
            isLoading={isLoading}
          />
        )}

        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle sx={{ width: 400 }}>
            <Typography variant="h6" fontWeight={700} fontSize="20px">
              {`Integrating with ${integration_type}`}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              {Integrations[integration_type]?.map((field) => (
                <TextField
                  key={field}
                  name={field}
                  label={field}
                  required
                  fullWidth
                  margin="normal"
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                />
              ))}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddIntegration} variant="contained">
              Add Integration
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
};

export default IntegrationCard;
