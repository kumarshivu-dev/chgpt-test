import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useState } from "react";

const ComplianceModal = ({ open, onClose, checkCompliance }) => {
  // react state management
  const [complianceSettings, setComplianceSettings] = useState({
    complianceCheck: false,
    brandVoiceCheck: false,
  });

  // disable submit button if both compliance and brand voice unchecked
  const isDisabled =
    !complianceSettings?.complianceCheck &&
    !complianceSettings?.brandVoiceCheck;

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    checkCompliance(complianceSettings);
    setComplianceSettings({
      complianceCheck: false,
      brandVoiceCheck: false,
    });
    onClose();
  };

  const handleClose = () => {
    setComplianceSettings({
      complianceCheck: false,
      brandVoiceCheck: false,
    });
    onClose();
  };
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
          style: { width: "500px" },
        }}
      >
        <DialogTitle variant="h6" fontWeight={"bold"}>
          Please Choose to Proceed
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
            gap={2}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Switch
                checked={complianceSettings?.complianceCheck}
                onChange={() =>
                  setComplianceSettings({
                    ...complianceSettings,
                    complianceCheck: !complianceSettings.complianceCheck,
                  })
                }
              />
              <Typography>Compliance Files Check</Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Switch
                checked={complianceSettings?.brandVoiceCheck}
                onChange={() =>
                  setComplianceSettings({
                    ...complianceSettings,
                    brandVoiceCheck: !complianceSettings.brandVoiceCheck,
                  })
                }
              />
              <Typography>Brand Voice Check</Typography>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" disabled={isDisabled} type="submit">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ComplianceModal;
