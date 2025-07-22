import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import { useToast } from "../../../context/ToastContext";
import "./subscriptionselection.css";

const SubscriptionSelection = ({ data, onConfirm, setIsSubscribedToBoth, updateIntegrations , isLoading}) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const subscriptions = [
    { ...data.chgptSubscriptionInfo, source: 'ContentHubGPT' },
    { ...data.platformSubscriptionInfo, source: data.platformName }
  ];

  const handleClose = () => {
    setOpen(false);
    setIsSubscribedToBoth && setIsSubscribedToBoth(false);
  };

  const handleConfirm = async(selectedPlan) => {
    isLoading(true);
    onConfirm && onConfirm(selectedPlan);
    handleClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="subscription-dialog-title"
      aria-describedby="subscription-dialog-description"
      classes={{ paper: "subscription-dialog" }}
    >
      <DialogTitle
        className="subscription-dialog-title"
        id="subscription-dialog-title"
      >
        Choose a Subscription Plan to Integrate
      </DialogTitle>
      <Divider />
      <DialogContent className="subscription-dialog-content">
        <DialogContentText className="subscription-dialog-content-text">
          Select the best plan that suits your needs:
        </DialogContentText>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          {subscriptions.map((plan, index) => (
            <Card
              key={index}
              variant="outlined"
              className={`subscription-card ${
                selectedPlan?.subscriptionId === plan.subscriptionId
                  ? "selected"
                  : ""
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <CardContent className="subscription-card-content">
                <Typography className="subscription-card-title">
                  {plan?.source} Plan
                </Typography>
                <Typography className="subscription-card-detail">
                  Plan Code: {plan?.planCode}
                </Typography>
                <Typography className="subscription-card-detail">
                  Monthly Limit: {plan?.monthlyLimit}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </DialogContent>
      <DialogActions className="subscription-dialog-actions">
        <Button
          className="subscription-cancel-button"
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => handleConfirm(selectedPlan)}
          disabled={!selectedPlan}
          className={`subscription-confirm-button ${
            selectedPlan ? "enabled" : "disabled"
          }`}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionSelection;
