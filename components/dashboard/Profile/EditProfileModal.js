import { useEffect, useState } from "react";
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
  Stack,
  Box,
  Grid,
  InputAdornment,
  Tooltip,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import axios from "axios";
import { useSession } from "next-auth/react";
import { UPDATE_USER_PROFILE } from "../../../utils/apiEndpoints";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../../store/userSlice";
import trackActivity from "../../../components/helper/dashboard/trackActivity";
import { useToast } from "../../../context/ToastContext";
import countryList from "react-select-country-list";
import {
  isFreeEmailDomain,
  isValidEmail,
  isValidWebsiteUrl,
} from "../../../utils/validations";
import ConfirmModal from "../../../pages/dashboard/ConfirmModal";
import React, { useMemo } from "react";

import { useBrandDisplay } from "../../../hooks/data/useBrandDisplay";
import { COUNTRY_AMERICA } from "../../../constants/globalvars";
import { COUNTRY_NAME_FIXES } from "../../../constants/dashboard/profilePageConstants";

const EditProfileModal = ({
  open,
  loading,
  setLoading,
  onClose,
  user,
  editModalType,
  title,
  fields,
}) => {
  // hooks management
  const { showToast } = useToast();
  const { data: session, update } = useSession();
  // redux state management
  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.user);
  const { userInfo, brandIdList: brandIds, userBrands } = userStore;

  const {
    displayName,
    brandUrl,
    isSpecificBrand,
    brandSpecification,
    brandId,
    isActive,
    brandLanguages,
    defaultLanguage,
  } = useBrandDisplay();

  // react state management
  const [formData, setFormData] = useState({
    ...userInfo,
    email: user?.email,
    country: userInfo?.country || COUNTRY_AMERICA,
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [checked, setChecked] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCountryEdited, setIsCountryEdited] = useState(false);
  // const [countryName, setCountryName] = useState(
  //   userInfo?.country || COUNTRY_AMERICA
  // );
  const [resendTimer, setResendTimer] = useState(30);
  const [isResendClicked, setIsResendClicked] = useState(false);

  const options = useMemo(() => countryList().getData(), []);
  const countryOptions = useMemo(
    () =>
      countryList()
        .getLabels()
        .map((c) => COUNTRY_NAME_FIXES[c] || c)
        .sort((a, b) => a.localeCompare(b)),
    []
  );

  // otp api handler function
  const handleOtpAPI = async (companyEmail) => {
    setSpinner(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/email/otp`,
        { email: companyEmail.toLowerCase() }
      );

      const responseData = response?.data;

      if (responseData?.status === "success") {
        // setShowOtpForm(true);
        setIsOtpSent(true);
        setResendTimer(30);
        setIsResendClicked(false);
        showToast(`OTP sent successfully to ${companyEmail}`, "success");
      } else {
        showToast("Failed to send OTP", "error");
      }
    } catch (error) {
      showToast("Error during email verification", "error");
    } finally {
      setSpinner(false);
      sessionStorage.setItem("onConfirm", "");
    }
  };

  // verify email handler function
  const verifyEmail = async (website, companyEmail) => {
    if (!website || !website?.trim() === "") {
      showToast("Please enter the website URL of your organization", "warning");
      return;
    }
    if (!isValidWebsiteUrl(website)) {
      showToast("Invalid website URL format", "error");
      return;
    }
    if (!isValidEmail(companyEmail)) {
      showToast("Invalid email format", "error");
      return;
    }
    if (isFreeEmailDomain(companyEmail)) {
      showToast("Please enter the correct organization email id", "error");
      return;
    }

    await handleOtpAPI(companyEmail);
  };

  // input change handler function
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // if (name === "country") {
    //   setCountryName(value); // Allow user to edit manually
    // }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDefaultLanguageChange = (e) => {
    const { name, value } = e.target;

    if (brandSpecification?.brandSpecific && brandSpecification?.brandId) {
      setFormData((prev) => ({
        ...prev,
        brandLanguagePreferences: {
          ...prev.brandLanguagePreferences,
          [brandId]: value, // Correctly updating the nested object
        },
      }));
    } else if (userInfo?.brandSpecific) {
      const brand_id = userStore?.userBrands?.[0]?.brand_id;

      setFormData((prev) => ({
        ...prev,
        brandLanguagePreferences: {
          ...(prev.brandLanguagePreferences || {}), // Ensures it doesn't spread undefined
          [brand_id]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        orgDefaultLanguage: value,
      }));
    }
  };

  // phone number change handler function
  const handlePhoneChange = (value, country) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
      countryCode: country?.countryCode,
    }));

    if (country.countryCode) {
      const matchedCountry = options.find(
        (c) => c.value === country.countryCode.toUpperCase()
      );
      const countryLabel = matchedCountry ? matchedCountry.label : "";

      // Always autofill country field
      // setCountryName(countryLabel);
      // setFormData((prev) => ({ ...prev, country: countryLabel }));
    }
  };

  // otp change handler function
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // company email checkbox handler function
  const handleCompanyEmailCheckboxChange = (e) => {
    if (e.target.checked) {
      setChecked(true);
      setFormData((prev) => ({ ...prev, companyMail: userInfo?.email }));
    }
  };

  // company email change handler function
  const handleCompanyEmailChange = (e) => {
    if (!formData?.websiteUrl || !formData?.websiteUrl === "") {
      showToast("Please enter the website URL of your organization", "warning");
      return;
    }

    const email = e.target.value;
    if (email) setIsEmailChanged(true);
    if (email === "") {
      setIsEmailChanged(false);
      setChecked(false);
    }

    setFormData((prev) => ({
      ...prev,
      companyMail: email,
    }));
  };

  // check whether company email domain is same as website domain
  const isDomainMatches = () => {
    const websiteMatch = formData?.websiteUrl.match(
      /^(?:https?:\/\/)?(?:www\.)?([^\/?:#]+)/
    );
    if (!websiteMatch) {
      return false;
    }
    const websiteDomain = websiteMatch[1].split(".")[0];

    const companyEmailDomain = formData?.companyMail
      ?.split("@")[1]
      ?.split(".")[0];

    return websiteDomain === companyEmailDomain;
  };

  // otp submit handler function
  const handleOtpSubmit = async () => {
    setSpinner(true);
    const emailLowerCase = (formData?.companyMail).toLowerCase();

    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify/user_otp`,
        {
          email: emailLowerCase,
          otp: otp,
        }
      );

      setSpinner(false);

      if (result.data?.message === "OTP is correct") {
        setIsOtpSent(false);
        setIsOtpVerified(true);
        showToast("OTP verified successfully", "success");
      } else {
        showToast("Invalid OTP", "error");
      }
    } catch (error) {
      setSpinner(false);
      showToast("Failed to verify OTP. Please try again", "error");
    }
  };

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect empty fields dynamically
    let emptyFields = [];
    fields.forEach((field) => {
      if (field?.name === "phone") {
        // consider empty if it's only country code or very short
        const rawValue = formData[field?.name] ?? "";
        const digitsOnly = rawValue.replace(/^\+\d+\s*/, "").trim();
        // const digitsOnly = formData[field?.name]
        //   .replace(/^\+\d+\s*/, "")
        //   .trim();
        if (!digitsOnly.length) {
          emptyFields.push(field?.label || field?.name);
        }
      }
      if (
        field?.name !== "defaultLanguage" &&
        (!formData[field?.name] || formData[field?.name].trim() === "")
      ) {
        emptyFields.push(field?.label || field?.name);
      }
    });

    // If there are empty fields, display a snackbar with an error message
    if (emptyFields.length > 0) {
      const uniqueFields = [...new Set(emptyFields)]; // Remove duplicates
      const formattedErrorMessage =
        uniqueFields.join(", ") + " cannot be empty.";
      showToast(formattedErrorMessage, "error");
      return;
    }

    //Name should not contain numerical values
    const name = (formData?.name || "").trim();
    if (/\d/.test(name)) {
      showToast("Name should contain only alphabets", "error");
      return;
    }
    
    if (editModalType === "company") {
      if (!isValidWebsiteUrl(formData?.websiteUrl)) {
        showToast("Invalid website URL", "error");
        return;
      }

      if (!isValidEmail(formData?.companyMail)) {
        showToast("Invalid email format", "error");
        return;
      }

      if (isFreeEmailDomain(formData?.companyMail)) {
        showToast("Please use your organization email", "error");
        return;
      }

      if (isEmailChanged && !isOtpVerified) {
        showToast("Please verify your company email", "warning");
        return;
      }

      if (!isDomainMatches()) {
        setShowConfirmModal(true);
        return;
      }
    }
    handleSubmitProfile();
  };

  const handleSubmitProfile = async () => {
    setLoading(true);
    const updatedFormData = {
      ...formData,
      // country: countryName, // Add the countryName to formData
    };
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + UPDATE_USER_PROFILE,
        updatedFormData,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      const responseData = response?.data;

      if (responseData?.status === true) {
        trackActivity(
          "USER_EDITED_PROFILE",
          "",
          user,
          "",
          userInfo?.orgId,
          null,
          null,
          null,
          brandIds
        );
        const updatedUserInfo = {
          ...userInfo,
          ...formData,
          percentCompleted: responseData?.percentCompleted,
        };
        dispatch(setUserInfo(updatedUserInfo));

        await update({
          user: { ...session?.user, name: updatedUserInfo.name },
        });

        if (updatedUserInfo?.profileUpdated) {
          showToast(responseData?.message, "success");
        }
      } else {
        showToast(
          responseData?.errorMessage || "Uploaded Profile info",
          "error"
        );
      }
    } catch (error) {
      showToast(
        "Error while updating profile info. Please try again.",
        "error"
      );
    } finally {
      onClose();
      setLoading(false);
    }
  };

  const handleResendOTPClick = () => {
    setOtp("");
    setIsResendClicked(true);
    setResendTimer(30);
    handleOtpAPI(formData?.companyMail);
  };

  // Populate form data when the modal opens
  useEffect(() => {
    if (userInfo) {
      setFormData({
        ...userInfo,
        email: user?.email,
        country: userInfo?.country || COUNTRY_AMERICA,
      });
      // setCountryName(userInfo?.country || COUNTRY_AMERICA);
    }
  }, [userInfo]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          open={showConfirmModal}
          handleClose={() => setShowConfirmModal(false)}
          onConfirm={handleSubmitProfile}
        />
      )}
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
          style: { width: "500px" },
        }}
      >
        <DialogTitle variant="h6" fontWeight={"bold"}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Stack direction={"column"} spacing={2}>
            {fields.map((field) => (
              <Box key={field.name}>
                <Typography>
                  {field.label}
                  <Typography component={"span"} sx={{ color: "red" }}>
                    {" "}
                    {field.name !== "defaultLanguage" ? "*" : null}
                  </Typography>
                </Typography>
                {field.type === "select" && field.name === "defaultLanguage" ? (
                  <TextField
                    select
                    name={field.name}
                    fullWidth
                    variant="standard"
                    value={
                      formData?.brandLanguagePreferences?.[
                        formData?.brandSpecification?.brandId ||
                          (formData?.brandSpecific
                            ? userBrands?.[0]?.brand_id
                            : "")
                      ] ??
                      (!formData?.brandSpecific
                        ? formData?.orgDefaultLanguage
                        : "") ??
                      ""
                    }
                    onChange={handleDefaultLanguageChange}
                  >
                    {[...brandLanguages]?.sort()?.map((language) => (
                      <MenuItem key={language} value={language}>
                        {language}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : field.type === "select" && field.name === "country" ? (
                  <TextField
                    select
                    name={field.name}
                    fullWidth
                    variant="standard"
                    value={formData?.[field?.name] || COUNTRY_AMERICA}
                    onChange={handleInputChange}
                  >
                    {countryOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : field.type === "select" ? (
                  <TextField
                    select
                    name={field.name}
                    fullWidth
                    variant="standard"
                    value={formData?.[field?.name] || ""}
                    onChange={handleInputChange}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : field.type === "phone" ? (
                  <MuiTelInput
                    fullWidth
                    name={field.name}
                    value={formData?.phone || ""}
                    defaultCountry={userInfo?.countryCode || "US"}
                    forceCallingCode={true}
                    onChange={handlePhoneChange}
                    variant="standard"
                  />
                ) : field.type === "email" ? (
                  <>
                    <TextField
                      name={field.name}
                      type="text"
                      fullWidth
                      variant="standard"
                      value={formData?.[field?.name] || ""}
                      onChange={handleCompanyEmailChange}
                      disabled={field?.disabled || isOtpSent || isOtpVerified}
                      InputProps={{
                        endAdornment: (
                          <>
                            {!checked &&
                              !formData?.companyMail &&
                              !isOtpSent &&
                              !isOtpVerified && (
                                <InputAdornment position="end">
                                  <Tooltip title="Check if same as login email">
                                    <Checkbox
                                      size="small"
                                      onChange={(e) =>
                                        handleCompanyEmailCheckboxChange(e)
                                      }
                                    />
                                  </Tooltip>
                                </InputAdornment>
                              )}

                            {isEmailChanged && !isOtpSent && !isOtpVerified && (
                              <InputAdornment position="end">
                                <Button
                                  variant="text"
                                  disableRipple
                                  disableFocusRipple
                                  size="small"
                                  onClick={() =>
                                    verifyEmail(
                                      formData?.websiteUrl,
                                      formData?.companyMail
                                    )
                                  }
                                  disabled={!formData?.companyMail || spinner}
                                  sx={{
                                    textTransform: "none",
                                    marginLeft: "8px",
                                  }}
                                >
                                  {spinner ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    "Verify"
                                  )}
                                </Button>
                              </InputAdornment>
                            )}
                          </>
                        ),
                      }}
                    />
                    {isOtpSent && (
                      <>
                        <TextField
                          fullWidth
                          variant="standard"
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          inputProps={{ maxLength: 6 }}
                          sx={{ mt: 2 }}
                          InputProps={{
                            endAdornment: (
                              <Button
                                variant="text"
                                size="small"
                                onClick={handleOtpSubmit}
                                disabled={spinner || otp.length < 6}
                                disableRipple
                                sx={{
                                  width: {
                                    xs: "50%",
                                    sm: "50%",
                                    md: "25%",
                                    textTransform: "capitalize",
                                  },
                                }}
                              >
                                {spinner ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  "Submit OTP"
                                )}
                              </Button>
                            ),
                          }}
                        />
                        <Button
                          variant="text"
                          size="small"
                          onClick={handleResendOTPClick}
                          disabled={spinner || resendTimer > 0}
                          sx={{
                            textTransform: "capitalize",
                            "&:hover": {
                              backgroundColor: "transparent",
                              color: "#163058",
                            },
                          }}
                        >
                          {resendTimer > 0 && !isResendClicked
                            ? `Resend OTP in ${resendTimer}s`
                            : "Resend OTP"}
                        </Button>
                      </>
                    )}

                    {/* {!showOtpForm && !isOtpVerified && (
                      <>
                        <TextField
                          name={field.name}
                          type="text"
                          fullWidth
                          variant="standard"
                          value={formData?.[field?.name] || ""}
                          onChange={handleCompanyEmailChange}
                          disabled={field?.disabled}
                          InputProps={{
                            endAdornment: (
                              <>
                                {!checked && !formData?.companyMail && (
                                  <InputAdornment position="end">
                                    <Tooltip title="Check if same as login email">
                                      <Checkbox
                                        size="small"
                                        onChange={(e) =>
                                          handleCompanyEmailCheckboxChange(e)
                                        }
                                      />
                                    </Tooltip>
                                  </InputAdornment>
                                )}

                                {!checked &&
                                  isEmailChanged &&
                                  formData?.companyMail.length > 0 && (
                                    <InputAdornment position="end">
                                      <Button
                                        variant="text"
                                        disableRipple
                                        disableFocusRipple
                                        size="small"
                                        onClick={() =>
                                          verifyEmail(
                                            formData?.websiteUrl,
                                            formData?.companyMail
                                          )
                                        }
                                        disabled={
                                          !formData?.companyMail || spinner
                                        }
                                        sx={{
                                          textTransform: "none",
                                          marginLeft: "8px",
                                        }}
                                      >
                                        {spinner ? (
                                          <CircularProgress size={16} />
                                        ) : (
                                          "Verify"
                                        )}
                                      </Button>
                                    </InputAdornment>
                                  )}
                              </>
                            ),
                          }}
                        />
                      </>
                    )} */}
                    {/* {showOtpForm && isOtpSent && !isOtpVerified && (
                      <TextField
                        fullWidth
                        variant="standard"
                        value={otp}
                        onChange={handleOtpChange}
                        InputProps={{
                          endAdornment: (
                            <Button
                              variant="text"
                              size="small"
                              onClick={handleOtpSubmit}
                              disabled={spinner}
                              disableRipple
                              sx={{
                                width: {
                                  xs: "50%",
                                  sm: "50%",
                                  md: "25%",
                                  textTransform: "capitalize",
                                },
                              }}
                            >
                              {spinner ? (
                                <CircularProgress size={16} />
                              ) : (
                                "Submit OTP"
                              )}
                            </Button>
                          ),
                        }}
                      />
                    )} */}
                    {/* {isOtpVerified && (
                      <TextField
                        fullWidth
                        variant="standard"
                        value={formData?.companyMail}
                        // onChange={handleCompanyEmailChange}
                        disabled
                      />
                    )} */}
                  </>
                ) : (
                  <TextField
                    name={field.name}
                    type={field.type || "text"}
                    fullWidth
                    variant="standard"
                    value={formData?.[field?.name] || ""}
                    onChange={handleInputChange}
                    disabled={
                      ((userInfo?.planCode?.startsWith("chgpt-enterprise") && (field?.name === "company" || field?.name === "websiteUrl"))
                        ? userInfo?.[field?.name]
                          ? userInfo?.[field?.name] !== ""
                          : false
                        : false) || field?.disabled
                    }
                  />
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditProfileModal;