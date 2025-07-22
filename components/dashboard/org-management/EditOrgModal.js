import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { UPDATE_USER_PROFILE } from "../../../utils/apiEndpoints";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../../../store/userSlice";
import { LANGUAGES } from "../../../constants/globalvars";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
import trackActivity from "/components/helper/dashboard/trackActivity";
import { WeblinkValidationUrl } from "../../../utils/validations";

const EditOrgModal = ({
  open,
  onClose,
  user,
  orgDetails,
  activateSnackbar,
}) => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;
  // Memoized initial form data to prevent unnecessary re-renders
  const initialFormData = useMemo(
    () => ({
      companyName: orgDetails?.orgName || "",
      websiteUrl: orgDetails?.webUrl || "",
      languages: orgDetails?.orglang || [],
    }),
    [orgDetails]
  );

  // State for form data with initial values
  const [formData, setFormData] = useState(initialFormData);

  // Memoized input change handler to prevent recreation on every render
  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleLanguagesChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      languages: typeof value === "string" ? value.split(",") : value,
    }));
  };

  // Memoized form submission handler
  const handleEditOrganization = useCallback(
    async (event) => {
      event.preventDefault();

      const { companyName: name, websiteUrl, languages } = formData;

      // Improved validation with more descriptive error messages
      if (!name.trim()) {
        activateSnackbar("Organization name is required.", "error");
        return;
      }

      if (!websiteUrl.trim()) {
        activateSnackbar("Website URL is required.", "error");
        return;
      }

      // More robust URL validation
      const urlPattern = WeblinkValidationUrl;
      if (!urlPattern.test(websiteUrl)) {
        activateSnackbar("Invalid website URL format", "error");
        return;
      }

      const data = {
        company: name,
        websiteUrl: websiteUrl.startsWith("http")
          ? websiteUrl
          : `https://${websiteUrl}`,
        languages: languages,
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
        const brandIds = brandSpecification?.brandId
          ? [brandSpecification.brandId]
          : [];
        if (response?.data?.status === true) {
          const updatedUserInfo = {
            ...userState.userInfo, // Retain existing fields in userInfo
            percentCompleted: response?.data?.percentCompleted,
            websiteUrl: data.websiteUrl, // Update paraphrasing
            company: data.company, // Update brandSpecification
            allowedLanguage: languages,
          };
          trackActivity(
            "UPDATED_ORG_SETTINGS", // action
            "", // filenames (array of deleted files)
            user, // user
            "", // editor_email (optional or empty string)
            userState?.userInfo?.orgId, // orgId
            null, // changed_role (optional or null)
            null, // number_of_products (optional or null)
            null, // changed_chunking_type (optional or null)
            brandIds // brandIds (optional or null)
          );

          // Dispatch updated userInfo to Redux
          dispatch(setUserInfo(updatedUserInfo));
          activateSnackbar("Organization updated successfully!", "success");

          // Use requestAnimationFrame for more reliable timing
          requestAnimationFrame(() => onClose());
        } else {
          activateSnackbar(
            response?.data?.errorMessage || "Failed to update organization.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error updating organization:", error);
        activateSnackbar("Network error. Please try again.", "error");
      }
    },
    [formData, user, activateSnackbar, onClose]
  );

  // Reset form when modal closes
  const handleClose = useCallback(() => {
    setFormData(initialFormData);
    onClose();
  }, [initialFormData, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: handleEditOrganization,
        style: { width: "500px" },
      }}
    >
      <DialogTitle>Update Organization</DialogTitle>
      <DialogContent>
        <Typography>Name</Typography>
        <TextField
          autoFocus
          required
          margin="dense"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          fullWidth
          variant="standard"
          error={!formData.companyName.trim()}
          helperText={!formData.companyName.trim() ? "Name is required" : ""}
        />
        <DialogContentText>Org Web Link</DialogContentText>
        <TextField
          required
          margin="dense"
          id="websiteUrl"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleInputChange}
          fullWidth
          variant="standard"
          error={!formData.websiteUrl.trim()}
          helperText={
            !formData.websiteUrl.trim() ? "Website URL is required" : ""
          }
        />
        <DialogContentText>Languages</DialogContentText>
        <FormControl required fullWidth variant="standard" margin="dense">
          <Select
            multiple
            value={formData?.languages}
            onChange={handleLanguagesChange}
            input={<OutlinedInput notched={false} />}
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <span style={{ color: "#aaa" }}>Choose Languages</span>;
              }
              return selected.join(", ");
            }}
            MenuProps={MenuProps}
          >
            {LANGUAGES.map((language) => (
              <MenuItem key={language} value={language}>
                <Checkbox checked={formData.languages.includes(language)} />
                <ListItemText primary={language} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{ borderRadius: "3px" }}
          variant="outlined"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button sx={{ borderRadius: "3px" }} variant="contained" type="submit">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(EditOrgModal);
