import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import "../../../app/dashboard/dashboard-style.css";
import { BIG_COMMERCE } from "../../../constants/globalvars";
import { CONFIRMATIONMSG } from "../../../constants/globalvars";

const integrationKeyMap = {
  Salsify: "organization_id",
  API: "client_id",
  [BIG_COMMERCE]: "storeHash",
  Shopify: "store-id"
};

const IntegrationAcknowledgment = ({
  integration_type,
  formData,
  onIntegrationConfirmed,
  setShowIntegrationConfirmation,
  isLoading,
}) => {
  const [openIntegrateAlert, setOpenIntegrateAlert] = useState(true);
  const idName = integrationKeyMap[integration_type];
  const idValue = formData[idName];
  

  const handleCloseIntegrateAlert = () => {
    setOpenIntegrateAlert(false);
    setShowIntegrationConfirmation && setShowIntegrationConfirmation(false);
  };

  const handleIntegrateConfirmed = () => {
    isLoading(true);
    onIntegrationConfirmed && onIntegrationConfirmed();
    handleCloseIntegrateAlert();
  };

  return (
    <>
      <Dialog
        className="delete-alert-box"
        open={openIntegrateAlert}
        onClose={handleCloseIntegrateAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          background: "#2D131640",
        }}
      >
        <DialogTitle
          sx={{
            color: "#C00011",
          }}
          id="alert-dialog-title"
        >
          Integrate {integration_type} ?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            {integration_type === "api"
              ? CONFIRMATIONMSG.confirmintegration(integration_type)
              : CONFIRMATIONMSG.confirmintegrationwithid(idName,idValue,integration_type)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              borderRadius: "3px",
              color: "#000000",
              border: "1px solid #ABABAB",
              "&:hover": {
                border: "1px solid #ABABAB",
              },
            }}
            variant="outlined"
            onClick={() => handleCloseIntegrateAlert()}
          >
            Cancel
          </Button>
          <Button
            sx={{
              borderRadius: "3px",
              border: "none",
              background: "#EE071B",
              ":hover": {
                background: "#ee071b",
                border: "none",
              },
            }}
            variant="contained"
            onClick={() => handleIntegrateConfirmed()}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IntegrationAcknowledgment;
