import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Slider,
  Paper,
  Tooltip,
  useMediaQuery,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { getSession, signOut } from "next-auth/react";
import HelpIcon from "@mui/icons-material/Help";
import SnackbarNotifier from "../../../components/helper/dashboard/snackbarNotifier";
import axios from "axios";
import BrandVoiceDocModal from "../../../components/dashboard/brand-voice/brandVoiceDocModal";
import TourComponent from "../../../components/dashboard/product/TourComponent";
import { tourStepsConfig } from "../../../components/dashboard/product/OnboardingTourSteps";
import trackActivity from "../../../components/helper/dashboard/trackActivity";
import { getCookie, setCookie } from "../../../utils/cookies";
import { useRouter } from "next/router";
import { useWarning } from "../../../context/WarningContext";
import WarningBox from "../../../components/helper/WarningBox";
import {
  CREATE_BRAND_VOICE,
  GET_BRAND_VOICE,
  SAVE_BRAND_VOICE,
} from "../../../utils/apiEndpoints";
import { useBrandDisplay } from "../../../hooks/data/useBrandDisplay";
import { setSelectedBrandFile } from "/store/brandVoiceSlice";
import { useToast } from "/context/ToastContext";
import BrandVoiceFileUploadModal from "/components/dashboard/brand-voice/BrandVoiceFileUploadModal";
import BrandVoiceKeywordModal from "/components/dashboard/brand-voice/BrandVoiceKeywordModal";
import UpgradeToast from "../../../utils-ui/UpgradeToast";
import { Upgrade } from "@mui/icons-material";
//Added custom styles to circular progress using styled library
const Root = styled("div")(({ theme }) => ({
  [`&.${"root"}`]: {
    margin: theme.spacing(3),
    "@media (max-width: 600px)": {
      margin: 0,
    },
  },
  // Targeting the .MuiTooltip-tooltip class within the Tooltip
  "& .MuiTooltip-tooltip": {
    margin: 0, // Setting margin to zero
  },
}));

const Item = styled(Paper)(({ theme }) => ({}));

// Made a custom tool tip according to the title so that we don't have to repeat ourself everytime
const CustomTooltip = ({ title, placement }) => (
  <Tooltip
    componentsProps={{
      tooltip: {
        sx: {
          marginTop: "-12px",
          bgcolor: "#022149",
          "& .MuiTooltip-arrow": {
            color: "#022149",
          },
          margin: 0, // Setting margin to zero
        },
      },
    }}
    title={title}
    placement={placement}
  >
    <span>
      <HelpIcon sx={{ fontSize: "14px", cursor: "pointer" }} />
    </span>
  </Tooltip>
);

function home({ user }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const userState = useSelector((state) => state.user);
  const brandVoiceState = useSelector((state) => state.brandvoice);
  const brandvoiceFile = brandVoiceState?.selectedBrandFile;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [casualValue, setCasualValue] = useState(10); // setting the casual tone
  const [seriousValue, setSeriousValue] = useState(10); // setting the serious tone
  const [respectfulValue, setRespectfulValue] = useState(10); // setting the respect tone
  const [matterOfFactValue, setMatterOfFactValue] = useState(10); // setting the matter of fact tone
  const [languageValue, setLanguageValue] = useState(10); // setting the language tone
  const [inputValue, setInputValue] = useState(""); // what are we typing in the keywords section in brand voice
  const [inputValuepurpose, setInputValuePurpose] = useState(""); // what are we typing in the purpose section in brand voice
  const [charArray, setCharArray] = useState([]); // we are converting the keywords into array and sending it to the backend
  const [purposeArray, setPurposeArray] = useState([]); // we are converting the purpose string into array
  const [genCharArray, setGenCharArray] = useState([]);
  const [genPurposeArray, setGenPurposeArray] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isTourStarted, setIsTourStarted] = useState(null);
  const { showWarning } = useWarning();
  const [isFreshUser, setIsFreshUser] = useState(false);
  const [steps, setSteps] = useState([]);
  const [openKeywordsModal, setOpenKeywordsModal] = useState(false);
  const [openFileUploadModal, setOpenFileUploadModal] = useState(false);
  const [keywordsLoading, setKeywordsLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState("");
  const { displayName } = useBrandDisplay();
  const isEnterpriseUser = userState?.userPlan?.startsWith("chgpt-enterprise");
  const [resetState, setResetState] = useState(false);
  const brandSpecification = userState?.userInfo?.brandSpecification;
  const brandIds = userState?.brandIdList;

  // when we click on the reset button, all the values that we selected should be set to default values
  const handleDeleteClick = () => {
    if (isEnterpriseUser && !brandSpecification) {
      showToast(<UpgradeToast />, "error");
      return;
    }
    setShowDeleteConfirmation(true);
    setCasualValue(10);
    setSeriousValue(10);
    setRespectfulValue(10);
    setMatterOfFactValue(10);
    setLanguageValue(10);
    setInputValue("");
    setInputValuePurpose("");
    setCharArray([]);
    setPurposeArray([]);
  };

  const handleActionChange = (event) => {
    const action = event.target.value;
    setSelectedAction(action);

    // Perform the respective action
    switch (action) {
      case "upload":
        handleUploadClick();
        break;
      case "suggest":
        handleGenerateClick();
        break;
      case "reset":
        handleDeleteClick();
        break;
      case "save":
        handleSaveBrandVoice("save");
        break;
      default:
        break;
    }
  };

  // Function for mobile slider according to the label and values we pass so that we don't have to repeat ourself
  const CustomSliderGridMobile = ({
    label1,
    label2,
    min,
    max,
    onChange,
    value,
  }) => (
    <Grid className="slider-grid-mobile" item xs={12} sx={{ padding: 0 }}>
      <Item
        className="slider-item-mobile"
        sx={{ boxShadow: "none", padding: 0 }}
      >
        {/* <Slider defaultValue={defaultValue} min={min}
                    max={max} aria-label="Default" valueLabelDisplay="auto" /> */}

        <Slider
          track={false}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          value={value}
          onChange={onChange}
          valueLabelFormat={valueLabelFormat(value, label1, label2)}
          getAriaValueText={valueLabelFormat}
        />
      </Item>
      <Item
        sx={{
          display: "flex",
          justifyContent: "space-between",
          boxShadow: "none",
          padding: 0,
          marginTop: "-15px",
          marginBottom: "15px",
        }}
      >
        <Box>{label1}</Box>
        <Box>{label2}</Box>
      </Item>
    </Grid>
  );
  const suggestKeywordsClick = async () => {
    setKeywordsLoading(true);
    const data = {
      brandvoiceFile: brandvoiceFile,
      company: displayName,
    };
    await axios
      .post(process.env.NEXT_PUBLIC_BASE_URL + CREATE_BRAND_VOICE, data, {
        headers: {
          Authorization: user?.id_token,
        },
      })
      .then((res) => {
        setGenCharArray(res?.data?.charArray);
        setGenPurposeArray(res?.data?.purposeArray);
        setKeywordsLoading(false);
      })
      .catch((err) => {
        showToast("Could not generate keywords for your organization", "error");
        dispatch(setSelectedBrandFile(null));
        setKeywordsLoading(false);
      });
  };
  const handleGenerateClick = async () => {
    if (isEnterpriseUser && !brandSpecification) {
      showToast(<UpgradeToast />, "error");
      return;
    }
    setOpenKeywordsModal(true);
    suggestKeywordsClick();
  };
  const handleUploadClick = async () => {
    if (isEnterpriseUser && !brandSpecification) {
      showToast(<UpgradeToast />, "error");
      return;
    }
    setOpenFileUploadModal(true);
  };

  // when we click on the confirm reset, we will save the default values back for that particular user
  const handleDeleteConfirmed = async () => {
    await handleSaveBrandVoice("reset");
    setShowDeleteConfirmation(false);
  };

  // when the user selects cancel button after reset we will again fetch back the existing Brand voice
  const handleDeleteCancel = () => {
    getExistingBrandVoice();
    setShowDeleteConfirmation(false);
    setSelectedAction("");
  };

  //for disablong the save button if brand voice
  const handleDisable = () => {
    if (inputValue?.length == 0 && inputValuepurpose?.length == 0) return true;
    else return false;
  };

  useEffect(() => {
    handleDisable();
  }, [inputValue, inputValuepurpose]);

  // Function to show the percentage value in the frontend while hovering over the slider
  const valueLabelFormat = (value, label1, label2) => {
    var per = 0;
    if (value < 10) {
      per = ((10 - value) / 10) * 100;
      return `${per}% ${label1}`;
    } else if (value > 10) {
      per = ((value - 10) / 10) * 100;
      return `${per}% ${label2}`;
    } else {
      return "Neutral tone";
    }
  };

  const handleSaveBrandVoice = async (operation) => {
    if (isEnterpriseUser && !brandSpecification) {
      showToast(<UpgradeToast />, "error");
      return;
    }
    // Set up the base data object
    const data = {
      brand_specific: brandSpecification?.brandSpecific,
      brand_id: brandSpecification?.brandId,
      brand_voice_config: {
        charKeywords: inputValue,
        purposeKeywords: inputValuepurpose,
        casualValue: casualValue,
        seriousValue: seriousValue,
        respectfulValue: respectfulValue,
        matterOfFactValue: matterOfFactValue,
        languageValue: languageValue,
      },
    };

    if (
      charArray.length != 0 ||
      purposeArray.length != 0 ||
      casualValue != 10 ||
      seriousValue != 10 ||
      respectfulValue != 10 ||
      matterOfFactValue != 10 ||
      languageValue != 10
    ) {
      setResetState(true);
    }

    // Conditionally add brand_id if BrandLevel is selected
    // let url = "http://localhost:8081/dashboard/save/brand-voice";
    let url = process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + SAVE_BRAND_VOICE;

    // if (brandSpecification?.brandSpecific) {
    //   data?.brand_id = brandSpecification?.brandId;
    // }

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: user?.id_token,
        },
      });

      if (
        response?.data?.status === false &&
        response.data.errorCode === "UNAUTHORIZED"
      ) {
        signOut();
      }

      const message =
        operation === "save"
          ? "Brand Voice Saved."
          : resetState === true
          ? "Brand Voice has Reset."
          : "No values changed";
      if (response?.status === 200) {
        showToast(message, "success");
        getExistingBrandVoice();
        setSelectedAction("");
      }
    } catch (error) {
      showToast(
        error?.response?.data?.error ||
          "Some error occurred saving the brand voice ",
        "error"
      );
    }
  };

  // handling the casual values changes
  const handleCasualChange = (event, newValue) => {
    setCasualValue(newValue);
  };
  // handling the serious values changes
  const handleSeriousChange = (event, newValue) => {
    setSeriousValue(newValue);
  };

  // handling the respectful values changes
  const handleRespectfulChange = (event, newValue) => {
    setRespectfulValue(newValue);
  };

  // handling the matter of fact values changes
  const handleMatterOfFactChange = (event, newValue) => {
    setMatterOfFactValue(newValue);
  };
  // handling the language values changes
  const handleLanguageChange = (event, newValue) => {
    setLanguageValue(newValue);
  };

  // Function for desktop slider according to the label and values we pass so that we don't have to repeat ourself
  const CustomSliderGrid = ({ label1, label2, min, max, onChange, value }) => (
    <Grid container spacing={3}>
      <Grid item xs>
        <Item sx={{ boxShadow: "none", fontSize: "14px" }}>{label1}</Item>
      </Grid>
      <Grid className="slider-grid" item xs={8} sx={{ padding: 0 }}>
        <Item className="slider-item" sx={{ boxShadow: "none", padding: 0 }}>
          <Slider
            track={false}
            min={min}
            max={max}
            valueLabelDisplay="auto"
            value={value}
            onChange={onChange}
            valueLabelFormat={valueLabelFormat(value, label1, label2)}
            getAriaValueText={valueLabelFormat}
          />
          {/* <DeviationSlider value={value} onChange={onChange}></DeviationSlider> */}
        </Item>
      </Grid>
      <Grid item xs>
        <Item sx={{ boxShadow: "none", fontSize: "14px" }}>{label2}</Item>
      </Grid>
    </Grid>
  );

  const addCharacterKeyword = (keyword) => {
    const capitalizedKeyword =
      keyword.charAt(0).toLowerCase() + keyword.slice(1);
    keyword = capitalizedKeyword;
    const updatedCharArray = charArray.filter((item) => item.trim() !== "");

    // Toggle selection: Remove if selected, add if not
    if (updatedCharArray.includes(keyword)) {
      // Unselect the keyword by removing it from the array
      const newCharArray = updatedCharArray.filter((item) => item !== keyword);
      setCharArray(newCharArray);
      setInputValue(newCharArray.join(", ")); // Update the text field value
    } else if (updatedCharArray.length < 10) {
      // Select the keyword if less than 5 keywords are selected
      const newCharArray = [...updatedCharArray, keyword];
      setCharArray(newCharArray);
      setInputValue(newCharArray.join(", ")); // Update the text field value
    } else {
      showToast("Maximum limit of 10 keywords reached", "error");
    }
  };

  const addPurposeKeyword = (keyword) => {
    const capitalizedKeyword =
      keyword.charAt(0).toLowerCase() + keyword.slice(1);
    keyword = capitalizedKeyword;
    const updatedPurposeArray = purposeArray.filter(
      (item) => item.trim() !== ""
    );

    // Toggle selection: Remove if selected, add if not
    if (updatedPurposeArray.includes(keyword)) {
      // Unselect the keyword by removing it from the array
      const newPurposeArray = updatedPurposeArray.filter(
        (item) => item !== keyword
      );
      setPurposeArray(newPurposeArray);
      setInputValuePurpose(newPurposeArray.join(", ")); // Update the text field value
    } else if (updatedPurposeArray.length < 10) {
      // Select the keyword if less than 5 keywords are selected
      const newPurposeArray = [...updatedPurposeArray, keyword];
      setPurposeArray(newPurposeArray);
      setInputValuePurpose(newPurposeArray.join(", ")); // Update the text field value
    } else {
      showToast("Maximum limit of 10 keywords reached", "error");
    }
  };

  // we convert the string to coma seprated array and then check if it's above 5 words
  const handleChangechararray = (event) => {
    var inputValue = event.target.value;
    const comaSepratedkeywords = inputValue
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    setCharArray(comaSepratedkeywords);
    if (comaSepratedkeywords.length > 10) {
      showToast("Maximum limit of 10 keywords reached", "error");
    } else {
      setInputValue(inputValue);
    }
  };
  // we convert the string to coma seprated array and then check if it's above 5 words
  const handleChangepurposeArray = (event) => {
    var inputValue = event.target.value;
    const comaSepratedkeywords = inputValue
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    setPurposeArray(comaSepratedkeywords);
    if (comaSepratedkeywords.length > 10) {
      showToast("Maximum limit of 10 keywords reached", "error");
    } else {
      setInputValuePurpose(inputValue);
    }
  };

  const handleSkipTour = () => {
    setCookie("isFreshUser", false);
    setCookie("isTour", false);
    // setShowOnboardModal(false);
    setIsTourStarted(false);
  };

  const handleCloseUploadModal = () => {
    setOpenFileUploadModal(false); // Close the modal when needed
    setSelectedAction("");
  };
  const handleCloseKeywordModal = () => {
    setOpenKeywordsModal(false); // Close the modal when needed
    setSelectedAction("");
  };

  const getExistingBrandVoice = async () => {
    const brandId = brandSpecification?.brandId;

    if (brandSpecification) {
      // let url = "http://localhost:8081/dashboard/fetch/brand-voice";
      let url = process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_BRAND_VOICE;

      if (brandSpecification?.brandSpecific) {
        url += `?brandId=${brandId}`;
      }

      console.log("get url: ", url);

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: user?.id_token,
          },
        });

        console.log("get-brand-voice-response: ", response);

        if (
          response?.data?.status === false &&
          response?.data?.errorCode === "UNAUTHORIZED"
        ) {
          signOut();
        }

        // Assuming the response contains data like the commented-out code:
        if (response?.status === 200) {
          setCasualValue(response?.data?.casualValue ?? 10); // Default to 10 if null/undefined
          setSeriousValue(response?.data?.seriousValue ?? 10); // Default to 10 if null/undefined
          setRespectfulValue(response?.data?.respectfulValue ?? 10); // Default to 10 if null/undefined
          setMatterOfFactValue(response?.data?.matterOfFactValue ?? 10); // Default to 10 if null/undefined
          setLanguageValue(response?.data?.languageValue ?? 10); // Default to 10 if null/undefined
          setInputValue(response?.data?.charKeywords ?? ""); // Default to an empty string
          setInputValuePurpose(response?.data?.purposeKeywords ?? ""); // Default to an empty string

          const comaSepratedkeywords = (response?.data?.charKeywords ?? "")
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean); // Avoid empty strings in the array

          setCharArray(comaSepratedkeywords);

          const purpose_string = (response?.data?.purposeKeywords ?? "")
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean); // Avoid empty strings in the array

          setPurposeArray(purpose_string);
        }
      } catch (error) {
        showToast(
          error?.response?.data?.error ||
            "Error fetching the existing brand voice ",
          "error"
        );

        // Set default values on error
        setCasualValue(10);
        setSeriousValue(10);
        setRespectfulValue(10);
        setMatterOfFactValue(10);
        setLanguageValue(10);
        setInputValue("");
        setInputValuePurpose("");
        setCharArray([]);
        setPurposeArray([]);
      }
    } else {
      // Handle case where brandSpecification is falsy if needed
      showToast(<UpgradeToast />, "error");
      return;
    }
  };

  useEffect(() => {
    const freshUserCookie = getCookie("isFreshUser");
    setIsFreshUser(freshUserCookie);
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    const tourSteps =
      getCookie("isTour") === "true"
        ? tourStepsConfig[currentPath]
          ? isMobile
            ? tourStepsConfig[currentPath].mobile
            : tourStepsConfig[currentPath].desktop
          : []
        : [];

    setSteps(tourSteps);
  }, [isMobile]);

  // Effect to fetch brand voice data when brandSpecification becomes available
  useEffect(() => {
    // Only run this effect when userState.userInfo is fully loaded and defined
    if (userState?.userInfo && Object.keys(userState.userInfo).length > 0) {
      // Now check for brandSpecification
      if (!userState.userInfo.brandSpecification) {
        console.log("No brand specification found");
        showToast(<UpgradeToast />, "error");
        return;
      }

      getExistingBrandVoice();
    }
  }, [userState?.userInfo]);

  return (
    <Root
      className="root"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "40px",
        marginBottom: "20px",
      }}
    >
      {getCookie("isTour") === "true" && isFreshUser === "false" && (
        <TourComponent
          steps={steps}
          handleClose={() => setIsTourStarted(false)}
          handleSkipTour={handleSkipTour}
        />
      )}

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={9}>
          <Box
            className="par"
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              borderRadius: "6px !important",
              justifyContent: "space-between",
              alignItems: {
                sx: "center",
              },
            }}
          >
            <Box className="left-child">
              <Typography
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "32px",
                  },
                  lineHeight: 1.2,
                  fontWeight: 700,
                }}
              >
                Brand Voice
              </Typography>
              <Typography
                sx={{
                  paddingTop: "5px",
                  fontSize: {
                    xs: "14px",
                    sm: "16px",
                  },
                }}
              >
                Tell us how would you like your <strong>Brand Voice !</strong>
              </Typography>
              {isMobile && showWarning && <WarningBox />}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {isMobile ? (
                <>
                  <FormControl
                    sx={{
                      minWidth: 200,
                      backgroundColor: "white",
                      borderRadius: 2,
                      boxShadow: 1,
                    }}
                    size="small"
                  >
                    <Select
                      value={selectedAction}
                      onChange={handleActionChange}
                      displayEmpty
                      renderValue={
                        (value) => value || "More Actions" // Placeholder when no value is selected
                      }
                    >
                      <MenuItem disabled value="">
                        More Actions
                      </MenuItem>
                      <MenuItem value="upload">
                        <FileUploadOutlinedIcon sx={{ marginRight: 1 }} />{" "}
                        Upload
                      </MenuItem>
                      <MenuItem value="suggest">Suggest Brand Voice</MenuItem>
                      <MenuItem value="reset">Reset</MenuItem>
                      <MenuItem value="save">Save Brand Voice</MenuItem>
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <Box
                    className="right-child"
                    sx={{
                      marginRight: "20px",
                      marginTop: {
                        xs: "15px",
                        sx: "0px",
                      },
                    }}
                  >
                    <Button
                      sx={{ padding: "6px 16px" }}
                      onClick={() => handleUploadClick()}
                      variant="outlined"
                    >
                      {" "}
                      <FileUploadOutlinedIcon /> Upload
                    </Button>
                  </Box>
                  <Box
                    className="right-child"
                    sx={{
                      marginRight: "20px",
                      marginTop: {
                        xs: "15px",
                        sx: "0px",
                      },
                    }}
                  >
                    <Button
                      sx={{ padding: "6px 16px" }}
                      onClick={() => handleGenerateClick()}
                      variant="outlined"
                    >
                      {" "}
                      Suggest Brand Voice
                    </Button>
                  </Box>
                  <Box
                    className="right-child"
                    sx={{
                      marginRight: "20px",
                      marginTop: {
                        xs: "15px",
                        sx: "0px",
                      },
                    }}
                  >
                    <Button
                      sx={{ padding: "6px 16px" }}
                      onClick={() => handleDeleteClick()}
                      variant="outlined"
                    >
                      {" "}
                      Reset
                    </Button>
                  </Box>

                  <Box
                    className="right-child"
                    sx={{
                      marginTop: {
                        xs: "15px",
                        sx: "0px",
                      },
                    }}
                  >
                    {/* <Button onClick={handleReset} variant="contained"> Reset</Button> */}
                    <Button
                      onClick={() => handleSaveBrandVoice("save")}
                      variant="contained"
                    >
                      {" "}
                      save brand voice
                    </Button>
                  </Box>
                </>
              )}
            </Box>
            <BrandVoiceFileUploadModal
              open={openFileUploadModal}
              onClose={handleCloseUploadModal}
              user={user}
            />
            <BrandVoiceKeywordModal
              open={openKeywordsModal}
              onClose={handleCloseKeywordModal}
              charArray={charArray}
              purposeArray={purposeArray}
              genCharArray={genCharArray}
              genPurposeArray={genPurposeArray}
              keywordsLoading={keywordsLoading}
              addCharacterKeyword={addCharacterKeyword}
              addPurposeKeyword={addPurposeKeyword}
              suggestKeywordsClick={suggestKeywordsClick}
            />
            {showDeleteConfirmation && (
              <BrandVoiceDocModal
                onDeleteConfirmed={handleDeleteConfirmed}
                onCancel={handleDeleteCancel}
                setResetState={setResetState}
              />
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={9} sx={{ mt: "32px" }}>
          {!isMobile && showWarning && <WarningBox />}
          <Box
            className="par"
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "6px !important",
            }}
          >
            <Box
              className="character"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                  },
                  lineHeight: 1.2,
                  fontWeight: 700,
                  marginRight: "8px",
                }}
              >
                Character Keywords
              </Typography>
              <CustomTooltip
                title="Define traits of your brand as if it were a human."
                placement="bottom"
              ></CustomTooltip>
            </Box>
            <Box
              className="character-input"
              component="form"
              sx={{
                "& > :not(style)": {
                  marginTop: { xs: "5px", sx: "15px" },
                  width: { xs: "100%", sx: "60ch" },
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Eg: Reliable , Authentic , Inclusive"
                variant="outlined"
                value={inputValue || ""}
                onChange={handleChangechararray}
              />
            </Box>
          </Box>
          <Box
            className="par-purpose"
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: "6px !important",
              marginTop: "15px",
            }}
          >
            <Box
              className="purpose"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                  },
                  lineHeight: 1.2,
                  fontWeight: 700,
                  marginRight: "8px",
                }}
              >
                Purpose Keywords
              </Typography>

              <CustomTooltip
                title="Define how you want your brand to be perceived in overall marketplace."
                placement="bottom"
              ></CustomTooltip>
            </Box>
            <Box
              className="purpose-input"
              component="form"
              sx={{
                "& > :not(style)": {
                  marginTop: { xs: "5px", sx: "15px" },
                  width: { xs: "100%", sx: "60ch" },
                },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Eg: Sustainability , Empowerment , Quality"
                variant="outlined"
                value={inputValuepurpose || ""}
                onChange={handleChangepurposeArray}
              />
            </Box>
          </Box>
          <Box sx={{ marginTop: "30px" }}>
            <Box
              className="tone"
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                  },
                  lineHeight: 1.2,
                  fontWeight: 700,
                  marginRight: "8px",
                }}
              >
                Tone
              </Typography>
              <CustomTooltip
                title="Set your desired tone, to reflect the voice of your brand."
                placement="bottom"
              ></CustomTooltip>
            </Box>
            {isMobile ? (
              <>
                <CustomSliderGridMobile
                  label1="Casual"
                  label2="Formal"
                  defaultValue={10}
                  min={0}
                  max={20}
                  value={casualValue}
                  onChange={handleCasualChange}
                />
                <CustomSliderGridMobile
                  label1="Serious"
                  label2="Funny"
                  defaultValue={10}
                  min={0}
                  max={20}
                  value={seriousValue}
                  onChange={handleSeriousChange}
                />
                <CustomSliderGridMobile
                  label1="Respectful"
                  label2="Irreverent"
                  defaultValue={10}
                  min={0}
                  max={20}
                  value={respectfulValue}
                  onChange={handleRespectfulChange}
                />
                <CustomSliderGridMobile
                  label1="Matter of fact"
                  label2="Enthusiastic"
                  defaultValue={10}
                  min={0}
                  max={20}
                  value={matterOfFactValue}
                  onChange={handleMatterOfFactChange}
                />
              </>
            ) : (
              <>
                <CustomSliderGrid
                  label1="Casual"
                  label2="Formal"
                  min={0}
                  max={20}
                  value={casualValue}
                  onChange={handleCasualChange}
                />
                <CustomSliderGrid
                  label1="Serious"
                  label2="Funny"
                  min={0}
                  max={20}
                  value={seriousValue}
                  onChange={handleSeriousChange}
                />
                <CustomSliderGrid
                  label1="Respectful"
                  label2="Irreverent"
                  min={0}
                  max={20}
                  value={respectfulValue}
                  onChange={handleRespectfulChange}
                />
                <CustomSliderGrid
                  label1="Matter of fact"
                  label2="Enthusiastic"
                  min={0}
                  max={20}
                  value={matterOfFactValue}
                  onChange={handleMatterOfFactChange}
                />

                {/* <DeviationSlider value={casualValue} onChange={setCasualValue}/> */}
              </>
            )}
          </Box>
          <Box sx={{ marginTop: "20px" }}>
            <Box
              className="tone"
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "16px",
                  },
                  lineHeight: 1.2,
                  fontWeight: 700,
                  marginRight: "8px",
                }}
              >
                Language
              </Typography>
              <CustomTooltip
                title="How formal you want your language to be ?"
                placement="bottom"
              ></CustomTooltip>
            </Box>
            {isMobile ? (
              <>
                <CustomSliderGridMobile
                  label1="Simple"
                  label2="Complex"
                  defaultValue={10}
                  min={0}
                  max={20}
                  value={languageValue}
                  onChange={handleLanguageChange}
                />
              </>
            ) : (
              <>
                <CustomSliderGrid
                  label1="Simple"
                  label2="Complex"
                  min={0}
                  max={20}
                  value={languageValue}
                  onChange={handleLanguageChange}
                />
              </>
            )}
          </Box>
        </Grid>
      </Grid>
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Root>
  );
}

export default home;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const user = session.user;

  if (
    user?.role === "Admin" &&
    (user?.planCode).startsWith("chgpt-enterprise")
  ) {
    return {
      props: { user },
    };
  } else {
    return {
      redirect: {
        destination: "/dashboard/home?redirectMessage=upgrade",
      },
    };
  }
}
