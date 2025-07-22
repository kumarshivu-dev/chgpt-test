import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Switch,
  Tooltip,
  Grid,
  FormGroup,
  Radio,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import HelpIcon from "@mui/icons-material/Help";
import { getSession } from "next-auth/react";
import "../../../components/dashboard/environmentsettings/environment-settings.css";
import { useSelector, useDispatch } from "react-redux";
import {
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
} from "../../../utils/apiEndpoints";
import EnvironmentSettingsMore from "../../../components/dashboard/environmentsettings/environmentSettingsMore";
import { setUserInfo } from "../../../store/userSlice";
import { useUserBrands } from "../../../hooks/data/useUserBrands";
import trackActivity from "/components/helper/dashboard/trackActivity";
import { useToast } from "../../../context/ToastContext";
import CustomToolTip from "../../../components/common-ui/CustomToolTip";
import { useRouter } from "next/router";

const environmentSettings = ({ user }) => {
  const router = useRouter();
  // hooks management
  const { showToast } = useToast();
  // ! Deprecated : remove as already call in sidebar
  // const { fetchUserBrands } = useUserBrands();

  // redux-state-management
  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.user);
  const { userInfo, userBrands: brands } = userStore;

  const {
    paraphrasing,
    personaSuggestion,
    company: orgName,
    brandSpecific,
    brandSpecification,
  } = userInfo;

  // react-state-management
  // ! Deprecated : removed as fetched from userSlice already
  // const [brands, setBrands] = useState([]);
  const [selectedTab, setSelectedTab] = useState("General Settings");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [envBtn, setEnvBtn] = useState(true);
  const [checked, setChecked] = useState(paraphrasing);
  const [initialChecked, setInitialChecked] = useState(false);
  const [initialPersonaSuggestion, setInitialPersonaSuggestion] = useState(false);
  const [initialAccessType, setInitialAccessType] = useState("");
const [initialSelectedBrandId, setInitialSelectedBrandId] = useState(null);


  const [isPersonaSuggestionChecked, setIsPersonaSuggestionChecked] =
    useState(personaSuggestion);
  const [accessType, setAccessType] = useState(() => {
    if (brandSpecification === undefined) {
      return ""; // Don't set anything if brandSpecification doesn't exist
    } else {
      return brandSpecification?.brandSpecific ? "brand" : "org";
    }
  });
  const [selectedBrandId, setSelectedBrandId] = useState(() => {
    if (brandSpecification === undefined) {
      return null;
    } else {
      return brandSpecification?.brandId;
    }
  });
  const isBrandAccess = accessType === "brand";
  // save settings handler function
  const handleSaveSettings = async () => {
    if (accessType === "brand" && !selectedBrandId) {
      showToast("Please select a brand to save", "error");
      return;
    }

    // Only include brandSpecification in the data if accessType is not empty
    const data = {
      paraphrasing: checked,
      personaSuggestion: isPersonaSuggestionChecked,
      ...(accessType && {
        brandSpecification: {
          brandSpecific: accessType === "brand",
          brandId: accessType === "brand" ? selectedBrandId : null,
        },
      }),
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
      if (response?.status === 200) {
        const updatedUserInfo = {
          ...userStore.userInfo,
          paraphrasing: data?.paraphrasing,
          personaSuggestion: data?.personaSuggestion,
          ...(data.brandSpecification && {
            brandSpecification: data.brandSpecification,
          }),
        };
        trackActivity(
          "ENVIRONMENT_SETTINGS_CHANGED", // action
          "", // filenames (array of deleted files)
          user, // user
          "", // editor_email (optional or empty string)
          userStore?.userInfo?.orgId, // orgId
          null, // changed_role (optional or null)
          null, // number_of_products (optional or null)
          null, // changed_chunking_type (optional or null)
          brandIds
        );
        dispatch(setUserInfo(updatedUserInfo));
        setInitialChecked(data.paraphrasing);
        setInitialPersonaSuggestion(data.personaSuggestion);
        setEnvBtn(true); 
        showToast(
          "Your environment settings have been saved successfully!",
          "success"
        );
      }
    } catch (err) {
      console.log("error while env saveing: ", err);
    }
  };
  // ! Deprecated : removed as fetched from sidebar
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     if (!user?.id_token) return;

  //     try {
  //       const response = await axios.get(
  //         process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_USER_PROFILE,
  //         {
  //           headers: {
  //             Authorization: user?.id_token,
  //           },
  //         }
  //       );

  //       if (response.status === 200) {
  //         const userData = response.data;
  //         setChecked(userData?.paraphrasing || false);
  //         setIsPersonaSuggestionChecked(userData?.personaSuggestion || false);
  //       }
  //     } catch (error) {
  //     } finally {
  //       setLoadingSettings(false);
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);

  // switch change handler function
  const handleSwitchChange = (event, type) => {
    const { checked: value } = event.target;
  
    if (type === "paraphrasing") {
      setChecked(value);
    } else if (type === "personaSuggestion") {
      setIsPersonaSuggestionChecked(value);
    }
  
    // Do comparison AFTER state updates
    setTimeout(() => {
      const hasChanges =
        (type === "paraphrasing" ? value : checked) !== initialChecked ||
        (type === "personaSuggestion" ? value : isPersonaSuggestionChecked) !== initialPersonaSuggestion;
      setEnvBtn(!hasChanges);
    }, 0);
  };
  

  // access type change handler function
  const handleAccessTypeChange = (event) => {
    const selectedType = event.target.value;
  
    const activeBrands = brands.filter((brand) => brand.status === "active");
  
    if (selectedType === "brand" && activeBrands.length === 0) {
      showToast(
        "No active brands available. Please add an active brand to your organization.",
        "error"
      );
      return;
    }
  
    const newBrandId = selectedType === "org" ? null : brandSpecification?.brandId;
  
    setAccessType(selectedType);
    setSelectedBrandId(newBrandId);
  
    setTimeout(() => {
      const hasChanges =
        checked !== initialChecked ||
        isPersonaSuggestionChecked !== initialPersonaSuggestion ||
        selectedType !== initialAccessType ||
        newBrandId !== initialSelectedBrandId;
  
      setEnvBtn(!hasChanges);
    }, 0);
  };
  

  const handleBrandSelection = (e) => {
    setSelectedBrandId(e.target.value);
    setEnvBtn(false);
  };

  const selectedBrandName = useMemo(() => {
    const selectedBrand = brands?.find(
      (brand) => brand.brand_id === selectedBrandId
    );
    return selectedBrand ? selectedBrand.name : "Choose a Brand";
  }, [selectedBrandId, brands]);

  // ! Deprecated : removed as fetched from userSlice already
  // useEffect(() => {
  //   const loadBrands = async () => {
  //     if (user?.id_token) {
  //       const fetchedBrands = await fetchUserBrands(user?.id_token);
  //       if (fetchedBrands) {
  //         setBrands(fetchedBrands);
  //       }
  //     }
  //   };
  //   loadBrands();
  // }, [fetchUserBrands]);

  // useEffect(() => {
  //   if (typeof paraphrasing === "boolean" && typeof personaSuggestion === "boolean") {
  //     setChecked(paraphrasing);
  //     setIsPersonaSuggestionChecked(personaSuggestion);
  //     setInitialChecked(paraphrasing);
  //     setInitialPersonaSuggestion(personaSuggestion);
  //     setLoadingSettings(false);
  //   }
  // }, [paraphrasing, personaSuggestion]);
  useEffect(() => {
    if (
      typeof paraphrasing === "boolean" &&
      typeof personaSuggestion === "boolean"
    ) {
      // Update switch states
      setChecked(paraphrasing);
      setIsPersonaSuggestionChecked(personaSuggestion);
      setInitialChecked(paraphrasing);
      setInitialPersonaSuggestion(personaSuggestion);
      setLoadingSettings(false);
  
      // Update access type and brand
      const accessTypeFromSpec = brandSpecification?.brandSpecific ? "brand" : "org";
      const brandIdFromSpec = brandSpecification?.brandId || null;
  
      setAccessType(accessTypeFromSpec);
      setSelectedBrandId(accessTypeFromSpec === "brand" ? brandIdFromSpec : null);
      setInitialAccessType(accessTypeFromSpec);
      setInitialSelectedBrandId(accessTypeFromSpec === "brand" ? brandIdFromSpec : null);
    }
  }, [paraphrasing, personaSuggestion, brandSpecification]);
  
  
  

  useEffect(() => {
    const tabFromUrl = router.query.tab;
    if (tabFromUrl === "more") {
      setSelectedTab("More Settings");
    } else {
      setSelectedTab("General Settings");
    }
  }, [router.query.tab]);

  useEffect(() => {
    if (brandSpecification !== undefined) {
      setAccessType(brandSpecification?.brandSpecific ? "brand" : "org");
      setSelectedBrandId(brandSpecification?.brandId);
    } else {
      setAccessType("");
      setSelectedBrandId(null);
    }
    setChecked(paraphrasing);
    setIsPersonaSuggestionChecked(personaSuggestion);
  }, [brandSpecification, paraphrasing, personaSuggestion]);

  return (
    <Box className="parent-container">
      <Box className="header-container">
        <Box className="title-box">
          <Typography variant="subtitle1" className="title">
            Environment Settings
          </Typography>
          <Typography>
            Customize your experience with features such as Paraphrasing, Brand
            and Organization-level access, and OpenAI key integration.
          </Typography>
        </Box>

        <Box className="tab-buttons">
          <Button
            className={`tab-button ${
              selectedTab === "General Settings" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("General Settings")}
          >
            General
          </Button>
          <CustomToolTip
            title={userInfo?.role !== "Admin" && "Admin access only"}
          >
            <Button
              disabled={userInfo?.role !== "Admin"}
              className={`tab-button ${
                selectedTab === "More Settings" ? "active" : ""
              }`}
              onClick={() => setSelectedTab("More Settings")}
            >
              More
            </Button>
          </CustomToolTip>
        </Box>
      </Box>

      {selectedTab === "General Settings" ? (
        <Box className="settings-container">
          <Box className="setting-row">
            <Box className="setting-label">
              <Typography variant="subtitle1" className="label-text">
                Paraphrasing
              </Typography>
              <CustomToolTip title="Rephrases text to preserve its meaning while enhancing clarity or style. This will result in 1 extra product call consumption.">
                <HelpIcon sx={{ fontSize: "14px" }} />
              </CustomToolTip>
            </Box>
            <Box
              sx={{ marginLeft: "25px", display: "flex", alignItems: "center" }}
            >
              {loadingSettings ? (
                <CircularProgress size={24} />
              ) : (
                <FormControlLabel
                  control={
                    <Switch
                      checked={checked}
                      onChange={(event) =>
                        handleSwitchChange(event, "paraphrasing")
                      }
                      className="paraphrasing-switch"
                    />
                  }
                />
              )}
            </Box>
          </Box>
          <Box className="setting-row">
            <Box className="setting-label">
              <Typography variant="subtitle1" className="label-text">
                Persona Suggestion
              </Typography>
              <CustomToolTip title="Evaluates if the persona fits the context , also suggests the best match for the product. This will result in 1 extra product call consumption.">
                <HelpIcon sx={{ fontSize: "14px" }} />
              </CustomToolTip>
            </Box>
            <Box
              sx={{ marginLeft: "25px", display: "flex", alignItems: "center" }}
            >
              {loadingSettings ? (
                <CircularProgress size={24} />
              ) : (
                <FormControlLabel
                  sx={{ marginLeft: "25px" }}
                  control={
                    <Switch
                      checked={isPersonaSuggestionChecked}
                      onChange={(event) =>
                        handleSwitchChange(event, "personaSuggestion")
                      }
                      className="paraphrasing-switch"
                    />
                  }
                />
              )}
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography fontWeight="bold">Access Level</Typography>
              <FormControlLabel
                control={
                  <Radio
                    checked={accessType === "org"}
                    onChange={handleAccessTypeChange}
                    value="org"
                    disabled={brandSpecific}
                  />
                }
                label="Org Access"
              />
              <Tooltip
                title={brands.length === 0 ? "No Brands available" : ""}
                arrow
              >
                <span>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={accessType === "brand"}
                        onChange={handleAccessTypeChange}
                        value="brand"
                        disabled={brands.length === 0}
                      />
                    }
                    label="Brand Access"
                  />
                </span>
              </Tooltip>
            </Grid>
            {!isBrandAccess && (
              <Grid item xs={4}>
                <Typography fontWeight="bold">
                  Organization:{" "}
                  <span style={{ fontWeight: "normal" }}>{orgName}</span>
                </Typography>
              </Grid>
            )}

            {isBrandAccess && (
              <Grid item xs={4}>
                <Typography fontWeight="bold">Brands Selection</Typography>
                <Select
                  value={selectedBrandId || ""}
                  onChange={handleBrandSelection}
                  displayEmpty
                  fullWidth
                  renderValue={() => selectedBrandName}
                >
                  {brands.length === 0 ? (
                    <MenuItem disabled>Brands not available</MenuItem>
                  ) : (
                    brands
                      .filter((brand) => brand?.status === "active")
                      .map((brand) => (
                        <MenuItem key={brand.brand_id} value={brand.brand_id}>
                          <Radio checked={selectedBrandId === brand.brand_id} />
                          <ListItemText primary={brand.name} />
                        </MenuItem>
                      ))
                  )}
                </Select>
              </Grid>
            )}
          </Grid>

          <Box>
            <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={envBtn}
              >
                Save Environment Settings
              </Button>
            </Stack>
          </Box>
        </Box>
      ) : (
        <EnvironmentSettingsMore user={user} />
      )}
    </Box>
  );
};

export default environmentSettings;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };
  const user = session.user;

  if (user?.planCode?.startsWith("chgpt-enterprise"))
    return { props: { user } };
  else return { redirect: { destination: "/dashboard/home?redirectMessage=upgrade" } };
}
