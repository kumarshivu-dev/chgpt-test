import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Modal,
  Grid,
  Divider,
  IconButton,
  TextField,
  Button,
  Radio,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Spinner from "../../spinner/Spinner";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import "./user-mgmt-style.css";
import trackActivity from "../../helper/dashboard/trackActivity";
import { useSelector } from "react-redux";
import { POST_ADD_USERS } from "../../../utils/apiEndpoints";
// import InviteOptionsModal from "./InviteOptionsModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { useToast } from "../../../context/ToastContext";

//custom hook

const UserInviteModal = ({
  orgName,
  maxTeamSize,
  totalUsers,
  user,
  isOpen,
  onClose,
  onTableUpdate,
  brands,
  userBrandSpecific,
}) => {
  const [emailInput, setEmailInput] = useState("");
  const [enteredEmails, setEnteredEmails] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const userState = useSelector((state) => state.user);
  const brandIds = userState?.brandIdList;
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedEmail, setSelectedEmail] = useState(""); // State to store the selected email
  const [accessType, setAccessType] = useState("org");
  const [selectedRole, setSelectedRole] = useState("Editor");
  const [selectedBrands, setSelectedBrands] = useState([]);

  const [isInviteDisabled, setIsInviteDisabled] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    const shouldDisable =
      enteredEmails.length === 0 ||
      (accessType === "brand" &&
        enteredEmails.some((email) => !email.brandIds?.length));

    setIsInviteDisabled(shouldDisable);
  }, [enteredEmails, accessType]);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
  };

  const handleEnterPress = (event, source) => {
    if ((source === "enter" && event.key === "Enter") || source === "click") {
      if (accessType === "brand" && selectedBrands.length === 0) {
        showToast(
          "Please select at least one brand before adding an email.",
          "warning"
        );
        return;
      }
      if (emailInput.trim() !== "") {
        const trimmedEmail = emailInput.trim();
        if (isEmailValid(trimmedEmail)) {
          setSelectedEmail(trimmedEmail); // Store the selected email
          if (!enteredEmails.find((email) => email.email === trimmedEmail)) {
            setEnteredEmails((prevEmails) => [
              {
                email: trimmedEmail,
                role: selectedRole,
                brandSpecific: accessType === "brand",
                // brandIds: selectedBrands,
                brandIds: [...selectedBrands],
                oldDataImportAllowed: false,
              },
              ...prevEmails,
            ]);
            // setChildModalOpen(true);
            setEmailInput("");
          } else {
            showToast("Duplicate email. Please use a different one", "error");
          }
        } else {
          showToast("Invalid email address", "error");
        }
      }
    }
  };

  const handleDeleteEmail = (index) => {
    setEnteredEmails((prevEmails) => prevEmails.filter((_, i) => i !== index));
  };

  const handlesInviteNewUser = async () => {
    if (totalUsers >= maxTeamSize) {
      showToast(
        "Please check your existing team size allowed for subscribed plan",
        "error"
      );
      return;
    }
    if (enteredEmails.length === 0) {
      showToast("Enter at least one email to add user", "error");
      return;
    }

    setSpinner(true);
    const data = {
      users: enteredEmails,
    };

    const editor_email = enteredEmails.map((e) => e?.email).join(",");
    const brand_invited_user = enteredEmails.map((e) => e?.email);
    const brand_invited_to = enteredEmails.map((e) => e?.brandIds).flat();
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_ADD_USERS,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      if (response?.data?.status === true) {
        if (data?.users[0]?.brandIds?.length == 0) {
          trackActivity(
            "USER_INVITATION",
            "",
            user,
            editor_email,
            userState?.userInfo?.orgId,
            null,
            null,
            null,
            brandIds,
            brand_invited_to
          );
        } else {
          trackActivity(
            "USER_INVITATION_BRAND",
            "",
            user,
            editor_email,
            userState?.userInfo?.orgId,
            null,
            null,
            null,
            brandIds,
            brand_invited_to,
            brand_invited_user
          );
        }
        showToast(
          "The user has been invited to join the organization",
          "success"
        );
        setSpinner(false);
        setEnteredEmails([]);
        onTableUpdate();
        onClose();
      } else if (response?.data?.status === false) {
        showToast(response?.data?.message, "error");
        setSpinner(false);
        onClose();
      }
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSpinner(false);
    }
  };

  const handleAccessTypeChange = (event) => {
    const newAccessType = event.target.value;
    const activeBrands = brands.filter((brand) => brand.status === "active");
    if (newAccessType === "brand" && activeBrands.length === 0) {
      showToast("Your organization hasn't added any brands yet.", "error");
      return;
    }
    setAccessType(newAccessType);
    // Reset selectedBrands if accessType is changed to "org"
    if (newAccessType === "org") {
      setSelectedBrands([]);
    }
  };

  // Function to handle brand selection
  const handleBrandChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedBrands(typeof value === "string" ? value.split(",") : value);
  };

  const selectedBrandNames = useMemo(() => {
    if (selectedBrands.length === 0) return "Choose Brands";

    const selectedBrandList = brands
      .filter((brand) => selectedBrands.includes(brand.brand_id))
      .map((brand) => brand.name);

    return selectedBrandList.join(", ");
  }, [selectedBrands, brands]);

  return (
    <Box>
      <Modal
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
        className="document-modal"
        keepMounted
        open={isOpen}
        onClose={onClose}
      >
        <Box className="add-user-container">
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={11}>
              <Typography variant="h6" sx={{ color: "#000000" }}>
                Add New User
              </Typography>
              <Typography variant="body2" sx={{ color: "#000000" }}>
                Add a user within your team
              </Typography>
            </Grid>

            {/* IconButton Grid Item */}
            <Grid item xs={1} container justifyContent="flex-end">
              <IconButton
                onClick={() => {
                  setEnteredEmails([]);
                  onClose();
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={8}>
              <Typography fontWeight="bold">{orgName}</Typography>
            </Grid>
            <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
              <Typography>{totalUsers} Members</Typography>
              <GroupOutlinedIcon />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Enter email to add user"
                variant="outlined"
                fullWidth
                value={emailInput}
                onChange={handleEmailInputChange}
                onKeyPress={(event) => handleEnterPress(event, "enter")}
                InputProps={{
                  endAdornment: (
                    <>
                      <Spinner show={spinner} />
                      <IconButton
                        onClick={() => handleEnterPress(null, "click")}
                        aria-label="Add Email"
                        edge="end"
                        sx={{ color: "#022149" }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid
              item
              xs={12}
              className="added-email-container"
              sx={{ maxHeight: "25vh", overflowY: "auto" }}
            >
              {enteredEmails.map((email, index) => (
                <Grid container key={index} className="added-email-row">
                  <Grid item xs={12} sm={9} md={10} lg={8}>
                    <Typography>{email.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}lg={2}>
                    {/* Optionally include role display here */}
                    <Typography>{email.role}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}lg={2}>
                    <DeleteIcon
                      sx={{
                        paddingLeft: "12px",
                        cursor: "pointer",
                        color: "#808080",
                        transition: "color 0.3s",
                        zIndex: 1,
                        ":hover": {
                          color: "#FF0000",
                        },
                      }}
                      onClick={() => handleDeleteEmail(index)}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
            {/* Access level */}
            <Grid item xs={12}>
              <Typography fontWeight="bold">Access Level</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Radio
                      checked={accessType === "org"}
                      onChange={handleAccessTypeChange}
                      value="org"
                      disabled={userBrandSpecific}
                    />
                  }
                  label="Org Access"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={accessType === "brand"}
                      onChange={handleAccessTypeChange}
                      value="brand"
                    />
                  }
                  label="Brand Access"
                />
              </FormGroup>
            </Grid>

            {/* Role selection */}
            <Grid item xs={12}>
              <Typography fontWeight="bold">Role Selection</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Radio
                      checked={selectedRole === "Admin"}
                      onChange={() => setSelectedRole("Admin")}
                    />
                  }
                  label="Admin"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={selectedRole === "Editor"}
                      onChange={() => setSelectedRole("Editor")}
                    />
                  }
                  label="Editor"
                />
              </FormGroup>
            </Grid>

            {/* brands selection */}
            {accessType === "brand" && (
              <Grid item xs={12}>
                <Typography fontWeight="bold">Brands Selection</Typography>
                <Select
                  multiple
                  value={selectedBrands || ""}
                  onChange={handleBrandChange}
                  displayEmpty
                  fullWidth
                  renderValue={() => selectedBrandNames}
                >
                  {brands.length === 0 ? (
                    <MenuItem disabled>Brands not available</MenuItem>
                  ) : (
                    brands
                      .filter((brand) => brand?.status === "active")
                      .map((brand) => (
                        <MenuItem key={brand.brand_id} value={brand.brand_id}>
                          <Checkbox
                            checked={
                              selectedBrands.indexOf(brand.brand_id) > -1
                            }
                          />
                          <ListItemText primary={brand.name} />
                        </MenuItem>
                      ))
                  )}
                </Select>
              </Grid>
            )}

            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "end", marginTop: "20px" }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ marginLeft: "20px" }}
                onClick={handlesInviteNewUser}
                // disabled={accessType === "brand" && selectedBrands.length === 0}
              >
                Invite Users
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Child Modal for additional user settings */}
      {/* <InviteOptionsModal
        open={childModalOpen}
        onClose={() => setChildModalOpen(false)}
        onSubmit={handleInviteOptionsSubmit} // Pass the handler to the modal
        selectedEmail={selectedEmail}
      /> */}
      <SnackbarNotifier
        open={snackbarState.open}
        setOpen={setSnackbarState}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Box>
  );
};

export default UserInviteModal;
