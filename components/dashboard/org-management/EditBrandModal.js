import { useState } from "react";
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
import { POST_UPDATE_BRAND } from "../../../utils/apiEndpoints";
import { LANGUAGES } from "../../../constants/globalvars";
import { ValidWebsiteUrl, WeblinkValidationUrl } from "../../../utils/validations";
import { useToast } from "../../../context/ToastContext";


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

const EditBrandModal = ({
  open,
  onClose,
  user,
  brand,
  onBrandUpdate,
  activateSnackbar,
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: brand?.name || "",
    websiteUrl: brand?.website_url || "",
    languages: brand?.Languages || [],
  });

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguagesChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      languages: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleEditBrand = async (event) => {
    event.preventDefault();

    const { name, websiteUrl, languages } = formData;

    // Validation
    if (!name.trim()) {
      activateSnackbar("Brand name is required.", "error");
      return;
    }
    if (!websiteUrl.trim() || !WeblinkValidationUrl.test(websiteUrl)) {
      showToast("A valid website URL is required.", "error"); 
      return;
    }
    

    const data = {
      brand_id: brand?.brand_id, // Mapping to backend's `brand_id`
      name: name, // Mapping to backend's `name`
      website_url: websiteUrl, // Mapping to backend's `website_url`
      languages: languages, // Mapping to backend's `languages`
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_UPDATE_BRAND,
        // "http://localhost:8081/dashboard/profile/update/brand",
        data,
        {
          headers: {
            Authorization: user?.id_token, // Authorization header
          },
        }
      );

      if (response?.data?.status === true) {
        activateSnackbar("Brand updated successfully!", "success");
        onBrandUpdate();
        onClose();
      } else {
        activateSnackbar(
          response?.data?.errorMessage || "Failed to update brand.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating brand:", error);
      activateSnackbar("Error updating brand. Please try again.", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleEditBrand,
        style: { width: "500px" },
      }}
    >
      <DialogTitle>Update Brand</DialogTitle>
      <DialogContent>
        <Typography>Name</Typography>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          variant="standard"
        />
        <DialogContentText>Brand Web Link</DialogContentText>
        <TextField
          required
          margin="dense"
          id="websiteUrl"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleInputChange}
          fullWidth
          variant="standard"
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
          onClick={onClose}
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

export default EditBrandModal;
