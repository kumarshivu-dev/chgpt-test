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
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { POST_ADD_BRAND } from "../../../utils/apiEndpoints";
import { LANGUAGES } from "../../../constants/globalvars";
import { WeblinkValidationUrl } from "../../../utils/validations";
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

const AddBrandModal = ({
  open,
  onClose,
  user,
  onBrandAddition,
  activateSnackbar,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    languages: [],
  });
  const [errors, setErrors] = useState({ name: "", website: "" });
  const { showToast } = useToast();

  // Validate URL format
  const isValidURL = (url) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-zA-Z0-9%_.~+]*)*" + // port and path
        "(\\?[;&a-zA-Z0-9%_.~+=-]*)?" + // query string
        "(\\#[-a-zA-Z0-9_]*)?$", // fragment locator
      "i"
    );
    return !!urlPattern.test(url);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user starts typing
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
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

  // Handle form submission
  const handleAddSubBrand = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const { name, website, languages } = formData;
    let formIsValid = true;
    const newErrors = { name: "", website: "", languages: [] };

    // Validate brand name
    if (!name) {
      formIsValid = false;
      newErrors.name = "Brand name is required";
    }

    if (website && !WeblinkValidationUrl.test(website)) {
      formIsValid = false;
      newErrors.website = "Invalid URL format";
      showToast("Invalid Website URL","error");
    }

    setErrors(newErrors);

    if (!formIsValid) return;

    // Prepare the request payload
    const data = {
      name: name, // Brand name
      websiteUrl: website, // Website URL (matches SubBrandRequest field)
      languages: languages,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_ADD_BRAND,
        // "http://localhost:8081/dashboard/profile/add/brand",
        data,
        {
          headers: {
            Authorization: user?.id_token, // Pass the Authorization token
          },
        }
      );

    

      if (response?.data?.status === true) {
        // Activate the snackbar
        activateSnackbar("Brand added successfully!", "success");
        onBrandAddition();
        onClose(); // Close the modal after snackbar message
      } else {
        activateSnackbar(
          response?.data?.message || "Failed to add sub-brand.",
          "error"
        );
      }
    } catch (error) {
      
      activateSnackbar("Error adding sub-brand. Please try again.", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleAddSubBrand,
        style: { width: "500px" },
      }}
    >
      <DialogTitle>Add Brand</DialogTitle>
      <DialogContent>
        <Typography>Brand Name</Typography>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          variant="standard"
        />
        <DialogContentText>Brand Web Link</DialogContentText>
        <TextField
          required
          margin="dense"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          error={!!errors.website}
          helperText={errors.website}
          fullWidth
          variant="standard"
        />
        <DialogContentText>Languages</DialogContentText>
        <FormControl required fullWidth variant="standard" margin="dense">
          <Select
            multiple
            value={formData.languages}
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

export default AddBrandModal;
