import React, { useEffect, useState, useMemo } from "react";
import { useSession, getSession } from "next-auth/react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import FilterListIcon from "@mui/icons-material/FilterList";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { PLATFORM_DEFAULT } from "../../constants/globalvars";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  FormControl,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Select,
  Popover,
  Tooltip,
  InputLabel,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import "dotenv";
import { useRouter } from "next/router";
import UploadModal from "../../components/dashboard/product/UploadModal";
import ProductLoader from "../../components/dashboard/product/ProductLoader";
import { setSelectedFile } from "../../store/uploadSlice";
import SnackbarNotifier from "../../components/helper/dashboard/snackbarNotifier";
import * as XLSX from "xlsx/xlsx";
import {
  requiredFields,
  requiredFieldsImgRec,
} from "../../components/helper/dashboard/productHelper";
import { v4 as uuidv4 } from "uuid";
import { useWarning } from "../../context/WarningContext";
import WarningBox from "../../components/helper/WarningBox";
import {
  POST_GENERATE_KEYWORDS,
  POST_ANALYZE_INDUSTRY_GENERATE_KEYWORDS,
  GET_TWITTER_TRENDS,
  POST_IMAGE_RECOGNITION,
} from "../../utils/apiEndpoints.js";
import trackActivity from "../../components/helper/dashboard/trackActivity";
import { useBrandDisplay } from "../../hooks/data/useBrandDisplay";
import useTaxonomyParser from "../../hooks/data/useTaxonomyParser";
import { useToast } from "../../context/ToastContext";
import { setChosenPersona } from "../../store/dashboard/hypertargetSlice";
import { handledeleteFile, fetchProductData } from "../../utils/fileUtils";
import { saveFileToDB } from "../../utils/excelUtils";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));

const Root = styled("div")(({ theme }) => ({
  [`& .${"uploadBox"}`]: {
    backgroundColor: "#fff",
    color: "black",
    borderRadius: "10px",
    // padding: theme.spacing(4),
    padding: "16px 32px 0px 32px",
    textAlign: "center",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  },

  [`& .${"back-arrow-container"}`]: {
    marginBottom: "5px",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "33px !important",
      marginRight: "10px",
    },
  },
  [`& .${"newUploadBox"}`]: {
    backgroundColor: "#f5f2f2",
    color: "gray",
    borderRadius: "10px",
    padding: "16px 32px 0px 32px",
    textAlign: "center",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    "&:hover": {
      // filter: "blur(2px)",
    },
  },
  [`& .${"mobuploadBox"}`]: {
    backgroundColor: "#FFFFF",
    color: "black",
    borderRadius: "10px",
    padding: "16px 32px 0px 32px",
    textAlign: "center",
  },
  [`& .${"mobNewUploadBox"}`]: {
    backgroundColor: "#ffead0",
    color: "gray",
    borderRadius: "10px",
    padding: "16px 32px 0px 32px",
    textAlign: "center",
  },
  [`& .${"inputBox"}`]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  [`& .${"textInBox"}`]: {
    fontSize: 14,
    color: "#7B89B2",
  },
  [`& .${"newTextInBox"}`]: {
    fontSize: 14,
    color: "grey",
  },
  [`& .${"fileLabel"}`]: {
    cursor: "pointer",
  },
  [`& .${"redText"}`]: {
    color: "red",
  },
  [`& .${"content"}`]: {
    textAlign: "left",
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      fontSize: "24px",
    },
  },
  [`& .${"language-options"}`]: {
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    gap: "5px",
    maxWidth: "100%",
    height: "100%",
    overflowY: "auto",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    backgroundColor: "#f9f9f9",
    marginBottom: "15px",
  },
  [`& .${"language-checkbox"}`]: {
    width: "50%",
    marginLeft: "1%",
  },
  [`& .${"browseBtn"}`]: {
    marginTop: theme.spacing(1),
    borderRadius: "5px",
    // marginBottom: "5px",
  },
  [`& .${"uploadBtn"}`]: {
    margin: theme.spacing(1),
    borderRadius: "5px",
  },
  [`& .${"uploadBtnGrey"}`]: {
    margin: theme.spacing(1),
    borderRadius: "5px",
    backgroundColor: "grey",
    "&:hover": {
      backgroundColor: "grey",
    },
  },
  [`& .${"checkBoxClass"}`]: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  [`& .${"formBox"}`]: {
    marginTop: "20px",
    width: "83%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  [`& .${"upgradeOverlay"}`]: {
    position: "absolute",
    zIndex: "99",
    top: "0%",
    right: "0%",
    bottom: "0%",
    left: "0%",
    boxShadow: "5px 5px 38px #cdc9c9",
    borderRadius: "10px",
    padding: "25px 25px 25px 25px",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    transition: "height 2s ease-in",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      opacity: 0.9,
    },
  },
}));

const languageToCountry = {
  english: "United States",
  spanish: "Spain",
  french: "France",
  german: "Germany",
};

function Enhancement({ user }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const showToast = useToast();
  const state = useSelector((state) => state);
  const { data: session, status } = useSession();
  const [seoTab, setSeoTab] = useState("suggested");
  const [generationType, setGenerationType] = useState("product");
  const [content, setContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [existingTaxonomy, setExistingTaxonomy] = useState("");
  const [seo, setSeo] = useState(false);
  const [selectedSeoLanguage, setSelectedSeoLanguage] = useState("english");
  const [country, setCountry] = useState(languageToCountry["english"]);

  const [taxonomy, setTaxonomy] = useState(false);
  const [taxonomyFile, setTaxonomyFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [ErrorsnackbarOpen, setErrorsnackbarOpen] = useState(false);
  const [keywordsCount, setKeywordsCount] = useState(0);
  const [taxonomyError, setTaxonomyError] = useState(false);
  const [warnSnackbar, setwarnSnackbar] = useState(false);
  const uploadState = useSelector((state) => state.uploadpage);
  const [LimitErrorsnackbarOpen, setLimitErrorsnackbarOpen] = useState(false);
  const [limitError, setLimitError] = useState("");
  const [open, setOpen] = useState(false);
  const [fileUploadFlag, setFileUploadFlag] = useState("");
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [suggestedKeywordsError, setSuggestedKeywordsError] = useState(false);
  const [rawSeoKeywords, setRawSeoKeywords] = useState([]);
  const [seoPagination, setSeoPagination] = useState([]);
  const [seoPageNumber, setSeoPageNumber] = useState(1);

  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [suggestedKeywordsLoading, setSuggestedKeywordsLoading] =
    useState(true);

  const [industryKeywords, setIndustryKeywords] = useState([]);
  const [industryKeywordsLoading, setIndustryKeywordsLoading] = useState(false);
  const [industryKeywordsError, setIndustryKeywordsError] = useState(false);

  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [trendingKeywordsLoading, setTrendingKeywordsLoading] = useState(false);
  const [trendingKeywordsError, setTrendingKeywordsError] = useState(false);

  //Seo filter popover states
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [openSEOFilter, setOpenSEOFilter] = useState(false);
  // const [filterType, setFilterType] = useState("");
  // const [sortByRanking, setSortByRanking] = useState("desc");
  //const openFilter = Boolean(anchorEl);
  //const id = openFilter ? "filter-popover" : undefined;

  //SEO multilanguage
  const {
    displayName,
    brandUrl,
    isSpecificBrand,
    brandId,
    isActive,
    brandLanguages,
    defaultLanguage,
  } = useBrandDisplay();

  const initialCheckedLanguage = brandLanguages?.includes(defaultLanguage)
    ? [defaultLanguage]
    : [];
  const userState = useSelector((state) => state.user);
  const [languages, setLanguages] = useState(initialCheckedLanguage);
  const taxonomyList = useTaxonomyParser(taxonomyFile);

  const brandIds = userState?.brandIdList;
  const orgUrl = userState?.userInfo?.websiteUrl;
  //added the router state here
  const personaState = useSelector((state) => state.hyperTarget);
  const choosenTaxonomyFileName = personaState?.chosenTaxonomy;
  const selectedProductData = useSelector((state) => state.selectedProducts);

  const isAllowedSEO = user?.allowedFeatures?.includes("seo");
  const isAllowedpremium = user?.allowedFeatures?.includes("taxonomy");
  const chosenLLM = userState?.userInfo?.chosen_llm;

  const handleOpenUploadModal = (flag) => {
    setFileUploadFlag(flag);
    setOpenUploadModal(true);
  };
  const handleCloseUploadModal = () => setOpenUploadModal(false);

  const [overlayVisibleSeo, setOverlayVisibleSeo] = useState(false);
  const [overlayVisibleTaxonomy, setOverlayVisibleTaxonomy] = useState(false);
  const [productTaskId, setProductTaskId] = useState("");
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const chosenLanguage = useSelector(
    (state) => state?.productEntries?.chosenLanguage
  );
  const { showWarning } = useWarning();

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  // const handleSEOLanguageChange = (event) => {
  //   setSeoLanguage(event.target.value);
  // };

  const handleLanguagesChange = (event) => {
    const { value, checked } = event.target;

    if (!checked && languages.length === 1) {
      activateSnackbar(
        "You must keep at least one language selected to continue.",
        "error"
      );
      return;
    }

    const updatedLanguages = checked
      ? [...languages, value]
      : languages.filter((lang) => lang !== value);
    setLanguages(updatedLanguages);
  };

  //SEO language handler
  const handleSeoLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedSeoLanguage(lang);
    setCountry(languageToCountry[lang] || "");
  };

  const addKeyword = (keyword) => {
    const currentKeywords = keywords
      ? keywords.split(",").map((k) => k.trim())
      : [];
    if (!currentKeywords.includes(keyword)) {
      const newKeywords = [...currentKeywords, keyword].join(", ");
      setKeywords(newKeywords);
      setKeywordsCount(
        newKeywords.split(",").filter((k) => k.trim() !== "").length
      );
    }
    //remove the suggested keyword from state once used
    setSuggestedKeywords((prevSuggestedKeywords) =>
      prevSuggestedKeywords.filter((item) => item.keyword_text !== keyword)
    );
    // Remove from trending list if it exists in it
    setTrendingKeywords((prevTrendingKeywords) =>
      prevTrendingKeywords.filter((item) => item !== keyword)
    );

    // Remove from industry list if it exists in it
    setIndustryKeywords((prevIndustryKeywords) =>
      prevIndustryKeywords.filter((item) => item.keyword_text !== keyword)
    );
  };

  //Heatmap labels
  const heatTags = [
    { label: "Red", color: "#ffdfdf" },
    { label: "High" },
    { label: "Yellow", color: "#fff3cd" },
    { label: "Medium" },
    { label: "Blue", color: "#d6ecff" },
    { label: "Low" },
  ];

  //Seo filter controls
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   setOpenSEOFilter(!openSEOFilter);
  // };

  // const handleCloseFilter = () => {
  //   setAnchorEl(null);
  //   setOpenSEOFilter(!openSEOFilter);
  // };

  // const applyFilters = () => {
  //   //console.log("Applied Filters:", {
  //   //  filterType,
  //   //  sortByRanking,
  //   //});
  //   //console.log(rawSeoKeywords);

  //   if (filterType === "brand_url") {
  //     //console.log(rawSeoKeywords);
  //     const keywordTexts =  [ ...(rawSeoKeywords?.url_based || []), ];
  //     //console.log(keywordTexts);
  //     setSuggestedKeywords(keywordTexts);
  //   } else if (filterType === "products") {
  //     //console.log(rawSeoKeywords);
  //     const keywordTexts =  [...(rawSeoKeywords?.product_based || []), ];
  //     //console.log(keywordTexts);
  //     setSuggestedKeywords(keywordTexts);
  //   } else {
  //     const keywords = [
  //       ...(rawSeoKeywords?.product_based || []),
  //       ...(rawSeoKeywords?.url_based || []),
  //     ];

  //     const sortedKeywords = keywords.sort(
  //       (a, b) => b.avg_monthly_searches - a.avg_monthly_searches
  //     );

  //     setSuggestedKeywords(sortedKeywords);
  //   }
  //   handleCloseFilter();
  // };

  useEffect(() => {
    // fetchExistingKeywords();
    axios
      .get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
          "/dashboard/profile/get/user",
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      )
      .then((res) => {
        if (res.data.paidUser == false) {
          setContent(true);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data == "Unauthorized") {
          signOut();
        }
      });
  }, [status]);

  //SEO calls
  useEffect(() => {
    if (open && selectedSeoLanguage) {
      handleOpen();
    }
  }, [selectedSeoLanguage]);

  // Industry analysis logic in its own separate function
  const analyzeIndustryKeywords = async (keywords, config) => {
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL +
          POST_ANALYZE_INDUSTRY_GENERATE_KEYWORDS,
        { keywords },
        config
      );

      if (response?.status === 200) {
        return response.data.keyword_results;
      } else {
        console.error("Industry API returned a non-200 status.");
        return [];
      }
    } catch (error) {
      console.error("Error in industry analysis:", error.message);
      return [];
    }
  };

  // Main handleOpen function
  const handleOpen = async (pageNumber) => {
    setOpen(true);
    setSuggestedKeywordsLoading(true);
    setIndustryKeywordsLoading(true);
    setTrendingKeywordsLoading(true);
    setSuggestedKeywords([]);

    const websiteUrl = userState?.userInfo?.websiteUrl;

    try {
      const productNames = selectedProductData?.selectedProducts
        ?.map((product) => product.product_name)
        .join(", ");

      const requestData = {
        page_url: brandUrl || websiteUrl,
        source: "website",
        language: selectedSeoLanguage,
        location: country,
      };

      const config = { headers: { Authorization: user?.id_token } };

      let sortedKeywords = [];

      const generateKeywordsPromise = axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + POST_GENERATE_KEYWORDS,
        requestData,
        config
      );

      const fetchTrendingKeywordsPromise = axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + GET_TWITTER_TRENDS,
        config
      );

      generateKeywordsPromise
        .then((response) => {
          setRawSeoKeywords(response?.data?.keyword_results);

          const keywordResults = [...(response?.data?.keyword_results || [])];

          sortedKeywords = keywordResults.sort(
            (a, b) => b.avg_monthly_searches - a.avg_monthly_searches
          );

          if (sortedKeywords?.length > 0) {
            setSuggestedKeywords(sortedKeywords);
          }

          return analyzeIndustryKeywords(websiteUrl, config);
        })
        .then((industryKeywords) => {
          setIndustryKeywords(industryKeywords);
          setIndustryKeywordsLoading(false);

          // Now sortedKeywords is visible here
          if (!sortedKeywords?.length && industryKeywords?.length > 0) {
            const fallbackKeywords = industryKeywords.slice(0, 5).map((kw) => ({
              keyword_text: kw.keyword_text || kw,
              avg_monthly_searches: 0,
              source: "industry-fallback",
            }));

            console.log(
              "Using fallback industry keywords as SEO suggestions:",
              fallbackKeywords
            );
            setSuggestedKeywords(fallbackKeywords);
          }
          setSuggestedKeywordsLoading(false);
        })
        .catch((error) => {
          console.error("Error during keyword processing:", error);
          setSuggestedKeywordsError(true);
        })
        .finally(() => {
          setSuggestedKeywordsLoading(false);
        });

      fetchTrendingKeywordsPromise
        .then((trendingResponse) => {
          if (trendingResponse.status === 200) {
            setTrendingKeywords(trendingResponse.data.keywords);
            setTrendingKeywordsLoading(false);
          } else {
            throw new Error("Trending keywords fetch failed.");
          }
        })
        .catch((error) => {
          console.error("Error fetching trending keywords:", error);
          setTrendingKeywordsError(true);
        });
    } catch (error) {
      console.error("Error in handleOpen:", error);
      setSuggestedKeywordsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // setKeywords("");
    fetchExistingKeywords();
    setOpen(false);
  };

  const handleInputChange = (event) => {
    const keywordsList = event.target.value
      .split(",")
      .map((keyword) => keyword.trim());
    setKeywordsCount(keywordsList.length);
    if (keywordsList.length > 125) {
      setLimitError("Maximum limit of 125 keywords exceeded.");
      setLimitErrorsnackbarOpen(true);
    } else {
      setKeywords(event.target.value);
    }
  };

  const fetchExistingKeywords = async () => {
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/standalone/fetch/keywords", {
        headers: {
          Authorization: user.id_token,
        },
      })
      .then((response) => {
        const existingKeywords = response.data.keywords.join(", ");
        setKeywords(existingKeywords);
        const keywordsList = existingKeywords
          .split(",")
          .map((keyword) => keyword.trim());
        setKeywordsCount(keywordsList.length);
        // handleInputChange()
      })
      .catch((err) => {
        console.error("Error fetching existing keywords:", err);
        if (err?.response?.data == "Unauthorized") {
          signOut();
        }
      });
  };

  const fetchExistingTaxonomy = async () => {
    if (taxonomy === false) return;
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/standalone/fetch/taxonomy", {
        headers: {
          Authorization: user.id_token,
        },
      })
      .then((response) => {
        // handleInputChange()
        if (response.status == 200) {
          setExistingTaxonomy(response.data.file);
        }
      })
      .catch((err) => {
        console.error("Error fetching existing Taxonomy:", err);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // const file = event.dataTransfer.files[0];
    // Continue processing if the file is an Excel file
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet);
      // // Determine the required fields based on selection
      const requiredFieldsList = Object.keys(
        generationType === "product" ? requiredFields : requiredFieldsImgRec
      );

      const processedData = processExcelData(excelData);

      const firstMismatchedField = validateColumnNames(
        processedData,
        requiredFieldsList
      );

      if (!firstMismatchedField) {
        trackActivity(
          "IMPORT",
          file?.name,
          user,
          "",
          userState?.userInfo?.orgId,
          null,
          null,
          null,
          brandIds
        );

        // Only proceed if the file type is valid
        if (fileUploadFlag === "content") {
          const file = event.target.files[0];
          dispatch(setSelectedFile(file));
          const fileData = {
            user_email: user?.email,
            file_name: file.name,
            mime_type: file.type,
            product_data: processedData, // Save the product data instead of base64
            last_modified: file.lastModified,
            chosen_persona: personaState?.chosenPersona,
            generation_type: generationType,
          };
          await saveFileToDB(fileData);
        }
      } else {
        activateSnackbar(
          `Missing or incorrect column name "${firstMismatchedField}"`,
          "error"
        );
        return;
      }
    };
    reader.readAsArrayBuffer(file);

    handleCloseUploadModal();
  };

  const handleFileChangeTaxonomy = (event) => {
    const file = event.target.files[0];
    setTaxonomyFile(file);
  };

  //func to check the  uploaded file type
  const IsFileTypeExcel = (event) => {
    const file = event.dataTransfer.files[0];
    const fileType = file.name.split(".").pop().toLowerCase();

    // Check if the file is not an Excel file (not .xlsx or .xls)
    if (fileType !== "xlsx" && fileType !== "xls") {
      activateSnackbar(
        "Please upload only Excel files (.xlsx or .xls).",
        "error"
      );
      handleCloseUploadModal();
      return false; // Return false indicating invalid file type
    }
    return true; // Return true indicating valid file type
  };
  // Helper function to process excel data by adding default values and ids
  const processExcelData = (excelData) => {
    return excelData.map((item) => {
      item.id = uuidv4();
      return item;
    });
  };

  // Helper function to validate column names
  const validateColumnNames = (excelData, requiredFieldsList) => {
    const keys = Object.keys(excelData[0]);
    return requiredFieldsList.find((field) => !keys.includes(field));
  };

  const handleDrop = (event) => {
    if (fileUploadFlag !== "content") {
      return;
    }
    event.preventDefault();

    if (!IsFileTypeExcel(event)) {
      // If file type is not valid, return early and do not proceed
      return;
    }

    const file = event.dataTransfer.files[0];
    // Continue processing if the file is an Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet);

      // // Determine the required fields based on selection
      const requiredFieldsList = Object.keys(
        generationType === "product" ? requiredFields : requiredFieldsImgRec
      );

      const processedData = processExcelData(excelData);

      const firstMismatchedField = validateColumnNames(
        processedData,
        requiredFieldsList
      );

      if (!firstMismatchedField) {
        trackActivity(
          "IMPORT",
          file?.name,
          user,
          "",
          userState?.userInfo?.orgId,
          null,
          null,
          null,
          brandIds
        );

        // Only proceed if the file type is valid
        if (fileUploadFlag === "content") {
          const file = event.dataTransfer.files[0];
          dispatch(setSelectedFile(file));
        }
      } else {
        activateSnackbar(
          `Missing or incorrect column name "${firstMismatchedField}"`,
          "error"
        );
        return;
      }
    };
    reader.readAsArrayBuffer(file);

    handleCloseUploadModal();
  };

  const handleDropTaxonomy = (event) => {
    event.preventDefault();

    if (!IsFileTypeExcel(event)) {
      // If file type is not valid, return early and do not proceed
      return;
    }

    if (!isAllowedpremium) return;
    const file = event.dataTransfer.files[0];
    setTaxonomyFile(file);
    handleCloseUploadModal();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragOverTaxonomy = (event) => {
    event.preventDefault();
    if (!isAllowedpremium) return;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setErrorsnackbarOpen(false);
    setLimitErrorsnackbarOpen(false);
    setwarnSnackbar(false);
    setTaxonomyError(false);
    setLoading(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    const keywordsList = keywords.split(",").map((keyword) => keyword.trim());
    const nonEmptyKeywords = keywordsList.filter((keyword) => keyword !== "");

    if (nonEmptyKeywords.length === 0) {
      setLimitError("Please enter at least one non-empty keyword.");
      setLimitErrorsnackbarOpen(true);
      return;
    }
    const config = {
      headers: {
        Authorization: user.id_token,
      },
    };

    axios
      .post(
        process.env.NEXT_PUBLIC_BASE_URL + "/standalone/upload/keywords",
        { keywords },
        config
      )
      .then((response) => {
        activateSnackbar("Keywords uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading keywords:", error);
        setErrorsnackbarOpen(true);
        setErrorMsg(error);
      });
  };

  const handleTaxonomyUpload = () => {
    if (taxonomyFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", taxonomyFile);
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };

      axios
        .post(
          process.env.NEXT_PUBLIC_BASE_URL + "/standalone/upload/taxonomy",
          formData,
          config
        )
        .then((response) => {
          activateSnackbar("File uploaded successfully");
        })
        .catch((error) => {
          setTaxonomyFile(null);
          setErrorMsg(
            error?.response?.data?.error ||
              error?.response?.data?.message ||
              "Some error occured, please try again"
          );
          setLoading(false);
          setSnackbarOpen(true);
          setTaxonomy(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setwarnSnackbar(true);
    }
  };
  const handleLlmcheck = async () => {
    const config = {
      headers: {
        Authorization: user?.id_token,
      },
    };

    const data = {
      input_llm: userState?.userInfo?.chosen_llm,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/cloudService/monitor/llm/server`,
        data,
        config
      );
      if (response?.data === "Server is down") {
        showToast("Server is not running. Your task may fail", "error");
      }
      return response?.data;
    } catch (error) {
      console.error("LLM error", error);
    } finally {
    }
  };

  const imagefunction = () => {
    if (uploadState.selectedFile) {
      setGenerateLoading(true);

      const personaName = personaState?.chosenPersona;
      const formData = new FormData();
      formData.append("file", uploadState.selectedFile);
      formData.append("channels", JSON.stringify(personaName));
      formData.append("languages", JSON.stringify(languages));
      formData.append("doSeo", seo);
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };
      axios
        .post(
          process.env.NEXT_PUBLIC_BASE_URL + POST_IMAGE_RECOGNITION,
          formData,
          config
        )
        .then((response) => {
          setProductTaskId({
            name: response?.data?.file_name,
            taskId: response?.data?.task_id,
          });
        })
        .catch((error) => {
          setErrorMsg(
            Array.isArray(error?.response?.data?.errors)
              ? error.response.data.errors.join("\n")
              : error?.response?.data?.message
          );

          // setFile(null);
          setSnackbarOpen(true);
        })
        .finally(() => {
          // setLoading(false);
        });
    } else {
      showToast("Products File is not Available", "error");
    }
  };

  const handleUpload = async () => {
    const deletedFiles = handledeleteFile(userState?.userInfo?.email);
    const llmstatus = handleLlmcheck();
    setGenerateLoading(true);
    if (uploadState.selectedFile) {
      if (uploadState.paid && !content && !seo && !taxonomy) {
        activateSnackbar(
          "You must check at least one of the checkbox",
          "error"
        );
        return;
      }
      if (!userState?.userInfo?.paidUser == false && !isAllowedSEO) {
        if (keywords == "") {
          return;
        }
      }
      const personaName = personaState?.chosenPersona;
      const formData = new FormData();
      formData.append("file", uploadState.selectedFile);
      formData.append("doSEO", seo);
      formData.append("doContent", content);
      formData.append("doTaxonomy", taxonomy);
      formData.append("channels", JSON.stringify(personaName));
      formData.append("inputLLM", chosenLLM || "openai");
      formData.append("languages", JSON.stringify(languages));
      formData.append("taxonomy_list", JSON.stringify(taxonomyList));
      formData.append(
        "paraphrasing",
        userState?.userInfo?.paraphrasing || false
      );
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };

      axios
        .post(
          process.env.NEXT_PUBLIC_BASE_URL + "/standalone/upload/excel/v1",
          formData,
          config
        )
        .then(async (response) => {
          setProductTaskId({
            name: response?.data?.file_name,
            blogName: response?.data?.blog_filename,
            taskId: response?.data?.task_id,
            blogTaskId: response?.data?.blog_task_id,
          });
        })
        .catch((error) => {
          console.log("upload page error", error);
          if (
            error?.response?.data?.error === "Please upload a taxonomy file."
          ) {
            setTaxonomyError(true);
          } else {
            setErrorMsg(
              error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Some error occured, please try again"
            );
            setSnackbarOpen(true);
          }
          // setLoading(false);
        })
        .finally(() => {
          // setLoading(false);
        });
    } else {
      setwarnSnackbar(true);
    }
  };

  useEffect(() => {
    fetchExistingKeywords();
    // fetchExistingTaxonomy();
    axios
      .get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
          "/dashboard/profile/get/user",
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      )
      .then((res) => {
        if (res.data.paidUser == false) {
          setContent(true);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data == "Unauthorized") {
          signOut();
        }
      });
  }, [status]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchProductData(userState?.userInfo?.email);
      if (result) {
        const { file, chosen_persona, generation_type } = result;
        setGenerationType(generation_type);
        dispatch(setSelectedFile(file));
        dispatch(setChosenPersona(chosen_persona));
      }
    };
    if (userState?.userInfo?.email) {
      fetchData();
    }
  }, [userState?.userInfo?.email]);
  // Convert fileName to a real File object
  useEffect(() => {
    if (choosenTaxonomyFileName) {
      //  Now we are creating a fully real File object
      const fakeFile = new File(
        [], // Empty file content (you can use actual content if needed)
        choosenTaxonomyFileName,
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // File Type
          lastModified: new Date().getTime(), // Current timestamp
        }
      );

      setTaxonomyFile(fakeFile);
    }
  }, [choosenTaxonomyFileName]);

  // useEffect(() => {
  //   if (taxonomyFile !== null) {
  //     handleTaxonomyUpload();
  //   }
  // }, [taxonomyFile]);

  if (generateLoading && productTaskId) {
    return (
      <ProductLoader
        productTaskId={productTaskId}
        user={user}
        isSelected={generationType}
        {...(generationType === "product" && { seoTab: "product" })}
      />
    );
  }

  return (
    <>
      <Root
        className="root"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Box>
          {/* header section  */}
          <Grid
            container
            sx={{
              display: "flex",
              alignItems: "center",
              ml: "2px",
              mb: "50px",
            }}
          >
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              sx={{ maxWidth: "2% !important" }}
              className="back-arrow-container"
            >
              <ArrowBackIosIcon
                onClick={() => {
                  router.push({
                    pathname: "/dashboard/products",
                  });
                }}
                sx={{
                  cursor: "pointer",
                }}
              />
            </Grid>
            <Grid item xs={11} sm={11} md={11}>
              <Item sx={{ p: "8px 8px 0px 8px" }}>
                <Typography
                  className="content"
                  variant="h6"
                  fontWeight="bold"
                  color="#000"
                  fontSize="34px"
                >
                  {generationType === "image"
                    ? "Image Recognition"
                    : "Product Generation"}
                </Typography>
              </Item>
              <Typography
                variant="subtitle2"
                color="#777777"
                fontSize="16px"
                pl="8px"
              >
                {`Please choose your ${
                  generationType === "image"
                    ? "Content Generation"
                    : "Product Generation"
                } options to proceed.`}
              </Typography>
            </Grid>
          </Grid>
          {showWarning && <WarningBox />}
          <Grid container justifyContent="center" sx={{ display: "flex" }}>
            {/* content generation section */}
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Item
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Grid
                  sx={{ height: "100%" }}
                  className={"uploadBox"}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Grid
                    className="descriptionSection"
                    sx={{
                      marginBottom: { xs: "20px", md: "0px" },
                      minHeight: { xs: "auto", md: "130px" },
                    }}
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <img
                        src="/dashboard/contentgen.svg"
                        style={{ height: "35px" }}
                      ></img>
                      <Typography
                        className="card-title"
                        sx={{ color: content ? "#022149" : "#5E5E5E" }}
                      >
                        <strong>Content Generation</strong>
                      </Typography>

                      <Switch
                        checked={content}
                        onChange={(e) => setContent(e.target.checked)}
                      />
                    </Grid>
                    <Typography className="card-content">
                      Creates product descriptions and feature bullets,
                      optionally using keyword hints you supply.
                    </Typography>
                  </Grid>

                  <Grid
                    className="whiteSection"
                    sx={{ height: { xs: "auto", sm: "34%", md: "34%" } }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        borderRadius: "21.024px 21.024px 0px 0px",
                        backgroundColor: content
                          ? languages.length > 0
                            ? "#23BF6E"
                            : "#DEDEDE"
                          : "white",
                      }}
                    >
                      {content ? (
                        languages.length > 0 ? (
                          <Typography style={{ color: "white" }}>
                            Ready for generation
                          </Typography>
                        ) : (
                          <Typography>Not Ready for generation</Typography>
                        )
                      ) : (
                        <Typography>&nbsp;</Typography>
                      )}
                    </Typography>
                    <FormControl>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: ["1fr 1fr"], // Always 2 columns
                          gap: "10px",
                          justifyContent: "center",
                          alignItems: "center",
                          marginBottom: { xs: "20px" },
                        }}
                      >
                        {[...brandLanguages]?.sort()?.map((language) => (
                          <Box
                            key={language}
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              // minWidth: "150px",
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={handleLanguagesChange}
                                  value={language}
                                  checked={languages?.includes(language)}
                                />
                              }
                              label={language}
                            />
                          </Box>
                        ))}
                      </Box>
                    </FormControl>
                  </Grid>

                  <Grid
                    style={{
                      backgroundColor: "white",
                      borderRadius: "0px 0px 10px 10px",
                      padding: "20px 30px 0px 30px",
                    }}
                  >
                    <Grid
                      className="textArea"
                      sx={{
                        flex: "1 1 auto", // Allows it to expand and shrink based on space
                      }}
                    ></Grid>
                    <Grid sx={{ width: "100%" }}>
                      <Grid
                        className="classessss"
                        sx={{
                          border: "1px dashed grey",
                          // padding: "13px",
                          borderRadius: "10px",
                          // padding: "30px",
                          // margin: "16px 0px 8px 0px",
                          backgroundColor: "#F9F9FB",
                          color: "#7B89B2",
                          height: { xs: "90px", md: "95px" },
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "-20px",
                          marginBottom: "0px",
                        }}
                      >
                        {uploadState.selectedFile ? (
                          <img src="/sucess.png"></img>
                        ) : (
                          <img src="/folder_image.png"></img>
                        )}
                        <Typography
                          variant="body1"
                          sx={{ wordBreak: "break-word", textAlign: "center" }}
                        >
                          {uploadState.selectedFile
                            ? uploadState.selectedFile.name
                            : "Drop File here"}
                        </Typography>
                      </Grid>
                      {/* </Box> */}
                      <Typography>or</Typography>
                      <>
                        <Button
                          htmlFor="chooseFile"
                          size={"large"}
                          variant="contained"
                          component="label"
                          className="browseB
                          tn"
                          style={{ width: "100%" }}
                          onClick={() => handleOpenUploadModal("content")}
                          sx={{
                            "&.Mui-disabled": {
                              background: "#FFFFFF !important",
                              borderColor: "#ABABAB",
                              color: "#ABABAB",
                            },
                            "&:hover": {
                              color: "#2E4770",
                              backgroundColor: "#F9F9FF",
                              borderColor: "#6077A4",
                            },
                            marginRight: "6px",
                            marginBottom: { xs: "10px" },
                            textTransform: "none",
                            borderRadius: "5px",
                            backgroundColor: "#FFFFFF",
                            borderColor: "#C6C6C6",
                            color: "#474747",
                            boxShadow: "none !important",
                          }}
                        >
                          <label htmlFor="chooseFile" className="fileLabel">
                            Reupload File
                          </label>
                        </Button>
                        <UploadModal
                          user={user}
                          isOpen={openUploadModal}
                          onClose={handleCloseUploadModal}
                          isSelected={generationType}
                          flag={
                            fileUploadFlag === "content"
                              ? "enhancePage"
                              : "enhanceTaxonomy"
                          }
                          handleFile={
                            fileUploadFlag === "content"
                              ? handleFileChange
                              : handleFileChangeTaxonomy
                          }
                          handleDropFile={
                            fileUploadFlag === "content"
                              ? handleDrop
                              : handleDropTaxonomy
                          }
                          handleDragOverFile={
                            fileUploadFlag === "content"
                              ? handleDragOver
                              : handleDragOverTaxonomy
                          }
                        />
                      </>
                    </Grid>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
            {/* SEO  section */}

            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Item
                sx={{
                  height: "100%",
                }}
              >
                <Grid
                  sx={{ height: "100%", position: "relative" }}
                  className={"uploadBox"}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onMouseEnter={() => setOverlayVisibleSeo(true)}
                  onMouseLeave={() => setOverlayVisibleSeo(false)}
                >
                  <Grid
                    className="descriptionSection"
                    sx={{
                      marginBottom: { xs: "20px", md: "0px" },
                      minHeight: { xs: "auto", md: "130px" },
                    }}
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <img
                        src="/dashboard/SEO.svg"
                        style={{ height: "35px" }}
                      ></img>
                      <Typography
                        className="card-title"
                        sx={{ color: seo ? "#022149" : "#5E5E5E" }}
                      >
                        <strong>SEO</strong>
                      </Typography>

                      <Switch
                        checked={seo}
                        onChange={(e) => {
                          setSeo(e.target.checked);
                        }}
                      />
                    </Grid>
                    <Typography className="card-content">
                      Integrates SEO keywords from a master list with your
                      descriptions and features, but only if they are related to
                      the product.
                    </Typography>
                  </Grid>
                  <Grid className="whiteSection">
                    <Typography
                      variant="h6"
                      sx={{
                        borderRadius: "21.024px 21.024px 0px 0px",
                        backgroundColor: seo
                          ? keywords.length > 0
                            ? "#23BF6E"
                            : "#DEDEDE"
                          : "white",
                      }}
                    >
                      <>
                        {seo ? (
                          keywords.length > 0 ? (
                            <Typography style={{ color: "white" }}>
                              Ready for generation
                            </Typography>
                          ) : (
                            <Typography>Not Ready for generation</Typography>
                          )
                        ) : (
                          <Typography>&nbsp;</Typography>
                        )}
                      </>
                    </Typography>
                    <Grid
                      style={{
                        backgroundColor: "white",
                        borderRadius: "0px 0px 10px 10px",
                        padding: "10px 30px ",
                      }}
                    >
                      <Grid
                        className="textArea"
                        sx={{ minHeight: { xs: "auto", md: "50px" } }}
                      >
                        <Typography
                          style={{
                            fontSize: "15px",
                            color: isAllowedSEO ? "black" : "gray",
                          }}
                          variant="body1"
                        >
                          <strong>Add Keywords</strong>
                        </Typography>
                        <Typography variant="body2" className={"textInBox"}>
                          Please supply in a comma separated list
                        </Typography>
                      </Grid>
                      <Grid sx={{ width: "100%" }}>
                        <TextField
                          className="classesss"
                          variant="outlined"
                          value={keywords}
                          onChange={handleInputChange}
                          fullWidth
                          margin="normal"
                          multiline
                          onClick={() => {
                            handleOpen();
                          }}
                          rows={6}
                          sx={{
                            border: "1px dashed black",
                            backgroundColor: "#F9F9FB",
                            borderRadius: "10px",
                            paddingBottom: "12px",
                            height: {
                              xs: "150px",
                              md: "150px",
                              lg: "150px",
                              xl: "150px",
                            },
                            mb: { md: "4px" },
                            mt: { md: "9px" },
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                border: "none",
                              },
                              "&.Mui-focused fieldset": {
                                border: "none",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              border: "none",
                              "&.Mui-focused": {
                                border: "none",
                              },
                            },
                            "& textarea::-webkit-scrollbar": {
                              width: "5px",
                            },
                            "& textarea::-webkit-scrollbar-track": {
                              background: "#f1f1f1",
                            },
                            "& textarea::-webkit-scrollbar-thumb": {
                              background: "#022149",
                              borderRadius: "10px",
                            },
                            "& textarea::-webkit-scrollbar-thumb:hover": {
                              background: "#555",
                            },
                          }}
                          disabled={!isAllowedSEO || !seo}
                        />
                        <Modal
                          keepMounted
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: "90%", md: "68%" },
                              bgcolor: "background.paper",
                              border: "1px solid #000",
                              borderRadius: "10px",
                              boxShadow: 24,
                            }}
                          >
                            <Grid container>
                              <Grid item xs={12} lg={6} sx={{ padding: 2 }}>
                                <Typography
                                  sx={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                  }}
                                >
                                  Edit SEO Keywords
                                </Typography>

                                <FormControl
                                  fullWidth
                                  sx={{ mb: 2, marginTop: 2 }}
                                >
                                  <InputLabel id="seo-language-select-label">
                                    Keywords Language
                                  </InputLabel>
                                  <Select
                                    labelId="seo-language-select-label"
                                    id="seo-language-select"
                                    value={selectedSeoLanguage}
                                    label="Keywords Language"
                                    onChange={handleSeoLanguageChange}
                                  >
                                    <MenuItem value="english">English</MenuItem>
                                    <MenuItem value="spanish">Spanish</MenuItem>
                                    <MenuItem value="french">French</MenuItem>
                                    {/* <MenuItem value="german">German</MenuItem> */}
                                  </Select>
                                </FormControl>
                                <Box sx={{ marginTop: 0 }}>
                                  <TextField
                                    variant="outlined"
                                    value={keywords}
                                    onChange={handleInputChange}
                                    fullWidth
                                    multiline
                                    rows={14}
                                    sx={{
                                      height: "100%",
                                      overflowY: "auto",
                                      border: "1px solid lightgrey",
                                      borderRadius: "5px",
                                      maxHeight: { xs: "30vh", lg: "40vh" },
                                      "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                          border: "none",
                                        },
                                        "&.Mui-focused fieldset": {
                                          border: "none",
                                        },
                                      },
                                      "& .MuiInputLabel-root": {
                                        border: "none",
                                        "&.Mui-focused": {
                                          border: "none",
                                        },
                                      },
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginTop: 1,
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        fontColor: "lightgrey",
                                      }}
                                    >
                                      *Use 3-5 suggested keywords for better
                                      results
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        fontColor: "#C6C6C6",
                                      }}
                                    >
                                      {keywordsCount}/125
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} lg={6} sx={{ padding: 2 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    gap: 2,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      color:
                                        seoTab === "suggested"
                                          ? "#032148"
                                          : "#C6C6C6",
                                      borderRadius: "0",
                                      marginBottom:
                                        seoTab === "suggested" ? "-5px" : "0",
                                      borderBottom:
                                        seoTab === "suggested"
                                          ? "5px solid #032148"
                                          : "none",
                                      padding: "0px",
                                      fontSize: {
                                        xs: "16px",
                                        sm: "18px",
                                        md: "24px",
                                      },
                                      fontWeight: 700,
                                    }}
                                    onClick={() => setSeoTab("suggested")}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Suggested
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      color:
                                        seoTab === "trending"
                                          ? "#032148"
                                          : "#C6C6C6",
                                      borderRadius: "0",
                                      marginBottom:
                                        seoTab === "trending" ? "-5px" : "0",
                                      borderBottom:
                                        seoTab === "trending"
                                          ? "5px solid #032148"
                                          : "none",
                                      padding: "0px",
                                      fontSize: {
                                        xs: "16px",
                                        sm: "18px",
                                        md: "24px",
                                      },
                                      fontWeight: 700,
                                    }}
                                    onClick={() => setSeoTab("trending")}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Trending{" "}
                                      <Typography
                                        component={"span"}
                                        sx={{
                                          fontSize: "18px",
                                          fontWeight: 700,
                                          display: {
                                            xs: "none",
                                            lg: "inline-block",
                                          },
                                        }}
                                      >
                                        {" "}
                                        WorldWide
                                      </Typography>
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      color:
                                        seoTab === "industry"
                                          ? "#032148"
                                          : "#C6C6C6",
                                      borderRadius: "0",
                                      marginBottom:
                                        seoTab === "industry" ? "-5px" : "0",
                                      borderBottom:
                                        seoTab === "industry"
                                          ? "5px solid #032148"
                                          : "none",
                                      padding: "0px",
                                      fontSize: {
                                        xs: "16px",
                                        sm: "18px",
                                        md: "24px",
                                      },
                                      fontWeight: 700,
                                    }}
                                    onClick={() => setSeoTab("industry")}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                      }}
                                    >
                                      Industry
                                    </Typography>
                                  </Box>
                                </Box>
                                <Divider />
                                <Box
                                  sx={{
                                    overflowY: "auto",
                                    maxHeight: { xs: "25vh", lg: "50vh" },
                                    minHeight: { xs: "25vh", lg: "50vh" },
                                    marginTop: 2,
                                  }}
                                >
                                  {seoTab === "suggested" && (
                                    <>
                                      {suggestedKeywordsLoading &&
                                        !suggestedKeywordsError && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center", // Vertical centering
                                              justifyContent: "center", // Horizontal centering (optional)
                                              height: "35vh", // Or a fixed height like 200 if needed
                                            }}
                                          >
                                            <CircularProgress />
                                          </Box>
                                        )}

                                      {!suggestedKeywordsLoading &&
                                        !suggestedKeywordsError &&
                                        suggestedKeywords.length > 0 && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              gap: 1,
                                              overflowY: "auto",
                                            }}
                                          >
                                            {suggestedKeywords.map(
                                              ({
                                                keyword_text,
                                                avg_monthly_searches,
                                                index,
                                              }) => (
                                                <Box
                                                  key={index}
                                                  onClick={() =>
                                                    addKeyword(keyword_text)
                                                  }
                                                  sx={{
                                                    textTransform: "capitalize",
                                                    fontWeight: 600,
                                                    fontSize: "12px",
                                                    padding: "2px 12px",
                                                    backgroundColor:
                                                      avg_monthly_searches >
                                                      50000
                                                        ? "#ffdfdf"
                                                        : avg_monthly_searches >
                                                          10000
                                                        ? "#fff3cd"
                                                        : "#d6ecff",
                                                    // backgroundColor:
                                                    //   "lightgrey",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  {keyword_text}
                                                </Box>
                                              )
                                            )}
                                          </Box>
                                        )}
                                    </>
                                  )}

                                  {seoTab === "industry" && (
                                    <>
                                      {industryKeywordsLoading &&
                                        !industryKeywordsError && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              height: "35vh",
                                            }}
                                          >
                                            <CircularProgress />
                                          </Box>
                                        )}

                                      {!industryKeywordsLoading &&
                                        !industryKeywordsError &&
                                        industryKeywords.length > 0 && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              gap: 1,
                                            }}
                                          >
                                            {industryKeywords.map(
                                              (keyword, index) => (
                                                <Box
                                                  key={index}
                                                  variant="contained"
                                                  onClick={() =>
                                                    addKeyword(
                                                      keyword.keyword_text
                                                    )
                                                  }
                                                  sx={{
                                                    textTransform: "capitalize",
                                                    fontWeight: 600,
                                                    fontSize: "12px",
                                                    padding: "2px 12px",
                                                    backgroundColor:
                                                      keyword.avg_monthly_searches >
                                                      10000
                                                        ? "#ffdfdf"
                                                        : keyword.avg_monthly_searches >
                                                          1000
                                                        ? "#fff3cd"
                                                        : "#d6ecff",
                                                    // backgroundColor:
                                                    //   "lightgrey",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  {keyword.keyword_text}
                                                </Box>
                                              )
                                            )}
                                          </Box>
                                        )}
                                    </>
                                  )}
                                  {seoTab === "trending" && (
                                    <>
                                      {trendingKeywordsLoading &&
                                        !trendingKeywordsError && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center", // Vertical centering
                                              justifyContent: "center", // Horizontal centering (optional)
                                              height: "35vh", // Or a fixed height like 200 if needed
                                            }}
                                          >
                                            <CircularProgress />
                                          </Box>
                                        )}
                                      {!trendingKeywordsLoading &&
                                        !trendingKeywordsError &&
                                        trendingKeywords.length > 0 && (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              flexWrap: "wrap",
                                              gap: 1,
                                            }}
                                          >
                                            {trendingKeywords.map(
                                              (
                                                keyword,
                                                index,
                                                avg_monthly_searches
                                              ) => (
                                                <Box
                                                  key={index}
                                                  variant="contained"
                                                  onClick={() =>
                                                    addKeyword(keyword)
                                                  }
                                                  sx={{
                                                    textTransform: "capitalize",
                                                    fontWeight: 600,
                                                    fontSize: "12px",
                                                    padding: "2px 12px",
                                                    backgroundColor:
                                                      avg_monthly_searches >
                                                      10000
                                                        ? "#ffdfdf"
                                                        : avg_monthly_searches >
                                                          10
                                                        ? "#fff3cd"
                                                        : "#d6ecff",
                                                    // backgroundColor:
                                                    //   "lightgrey",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  {keyword}
                                                </Box>
                                              )
                                            )}
                                          </Box>
                                        )}
                                    </>
                                  )}
                                </Box>

                                <Box
                                  sx={{
                                    marginTop: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {heatTags.map(({ label, color }, index) => (
                                    <Box
                                      key={index}
                                      sx={{
                                        textTransform: "capitalize",
                                        fontWeight: 600,
                                        fontSize: "12px",
                                        padding: "2px 12px",
                                        backgroundColor: color || "white",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        transition:
                                          "background-color 0.2s ease",
                                      }}
                                    >
                                      {label}
                                    </Box>
                                  ))}
                                </Box>
                              </Grid>
                            </Grid>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: 2,
                                marginTop: 1,
                              }}
                            >
                              <Button
                                variant="outlined"
                                onClick={handleClose}
                                sx={{
                                  marginRight: "5px",
                                }}
                              >
                                Close
                              </Button>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                              >
                                Submit
                              </Button>
                            </Box>
                          </Box>
                        </Modal>

                        <Typography>&nbsp;</Typography>
                        <Button
                          size={"large"}
                          variant="contained"
                          component="label"
                          className="browseBtn"
                          onClick={() => {
                            handleOpen();
                          }}
                          style={{ width: "100%" }}
                          disabled={!isAllowedSEO || !seo}
                          sx={{
                            "&.Mui-disabled": {
                              background: "#FFFFFF !important",
                              borderColor: "#ABABAB",
                              color: "#ABABAB",
                            },
                            "&:hover": {
                              color: "#2E4770",
                              backgroundColor: "#F9F9FF",
                              borderColor: "#6077A4",
                            },
                            marginRight: "6px",
                            textTransform: "none",
                            borderRadius: "5px",
                            backgroundColor: "#FFFFFF",
                            borderColor: "#C6C6C6",
                            color: "#474747",
                            boxShadow: "none !important",
                          }}
                        >
                          Edit Keywords
                        </Button>
                      </Grid>

                      {/* {!isAllowedSEO && overlayVisibleSeo ? (
                        <Box className="upgradeOverlay">
                          <Link href="/dashboard/pricing">
                            <Image
                              style={{
                                padding: "20px",
                              }}
                              width="100"
                              height="100"
                              src="/dashboard/diamond.svg"
                              alt="Logo"
                              priority
                            />
                          </Link>
                          <Typography
                            sx={{
                              color: "#022149",
                              fontWeight: "bold",
                            }}
                          >
                            You Have Discoverd Paid feature!
                          </Typography>
                          <Typography>
                            Click on the diamond to to check the pricing plans.
                          </Typography>
                        </Box>
                      ) : null} */}
                    </Grid>
                  </Grid>
                </Grid>
              </Item>
            </Grid>

            {/* Taxonomy section */}
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Tooltip
                title={generationType === "image" ? "Upcoming Feature" : ""}
                arrow
                disableHoverListener={generationType !== "image"}
              >
                <div
                  style={{
                    height: "97%",
                  }}
                >
                  <Item sx={{ height: "100%" }}>
                    <Grid
                      sx={{
                        height: "100%",
                        position: "relative",
                        opacity: generationType === "image" ? 0.5 : 1,
                        pointerEvents:
                          generationType === "image" ? "none" : "auto",
                      }}
                      className={
                        isAllowedpremium ? "uploadBox" : "newUploadBox"
                      }
                      onDrop={handleDropTaxonomy}
                      onDragOver={handleDragOverTaxonomy}
                      onMouseEnter={() => setOverlayVisibleTaxonomy(true)}
                      onMouseLeave={() => setOverlayVisibleTaxonomy(false)}
                    >
                      <Grid
                        className="descriptionSection"
                        sx={{
                          marginBottom: { xs: "20px", md: "0px" },
                          minHeight: { xs: "auto", md: "130px" },
                        }}
                      >
                        <Grid
                          container
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <img
                            src="/dashboard/taxonomy.svg"
                            style={{ height: "35px" }}
                          ></img>
                          <Typography
                            className="card-title"
                            sx={{ color: seo ? "#022149" : "#5E5E5E" }}
                          >
                            <strong>Taxonomy</strong>
                          </Typography>

                          <Switch
                            checked={taxonomy}
                            onChange={(e) => {
                              setTaxonomy(e.target.checked);
                            }}
                            disabled={!isAllowedpremium}
                          />
                        </Grid>
                        <Typography className="card-content">
                          Categorizes products based on their content, assigning
                          them to nodes in your Taxonomy structure.
                        </Typography>
                      </Grid>
                      <Grid className="whiteSection">
                        <Typography
                          variant="h6"
                          sx={{
                            borderRadius: "21.024px 21.024px 0px 0px",
                            backgroundColor: taxonomy
                              ? taxonomyFile || existingTaxonomy != ""
                                ? "#23BF6E"
                                : "#DEDEDE"
                              : "white",
                          }}
                        >
                          <>
                            {taxonomy ? (
                              taxonomyFile || existingTaxonomy != "" ? (
                                <Typography style={{ color: "white" }}>
                                  Ready for generation
                                </Typography>
                              ) : (
                                <Typography>
                                  Not Ready for generation
                                </Typography>
                              )
                            ) : (
                              <Typography>&nbsp;</Typography>
                            )}
                          </>
                        </Typography>
                        <Grid
                          style={{
                            backgroundColor: "white",
                            borderRadius: "0px 0px 10px 10px",
                            padding: "10px 30px 10px 30px",
                          }}
                        >
                          <Grid
                            className="textArea"
                            sx={{ minHeight: { xs: "auto", md: "50px" } }}
                          >
                            <Typography
                              style={{
                                fontSize: "15px",
                                color: isAllowedpremium ? "black" : "gray",
                              }}
                              variant="body1"
                            >
                              <strong>Add File</strong>
                            </Typography>
                            <Typography
                              variant="body2"
                              className={
                                uploadState.paid ? "textInBox" : "newTextInBox"
                              }
                            >
                              Drag and drop your file
                            </Typography>
                          </Grid>
                          <Grid sx={{ width: "100%" }}>
                            <Grid
                              sx={{
                                border: "1px dashed grey",
                                borderRadius: "10px",
                                padding: "30px",
                                margin: "16px 0px 8px 0px",
                                backgroundColor: "#F9F9FB",
                                color: "#7B89B2",
                                height: { xs: "150px", md: "150px" },
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {(taxonomyFile && taxonomy) ||
                              (taxonomy && existingTaxonomy != "") ? (
                                <img src="/sucess.png"></img>
                              ) : (
                                <img src="/folder_image.png"></img>
                              )}
                              {taxonomyFile && taxonomy ? (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {taxonomyFile.name}
                                </Typography>
                              ) : (
                                <>
                                  {taxonomy && existingTaxonomy ? (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      {existingTaxonomy}
                                    </Typography>
                                  ) : (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        wordBreak: "break-word",
                                        overflow: "hidden",
                                      }}
                                    >
                                      Drop File here
                                    </Typography>
                                  )}
                                </>
                              )}
                            </Grid>
                            <Typography>or</Typography>
                            <>
                              <Button
                                htmlFor="chooseFileTaxonomy"
                                size={"large"}
                                variant="contained"
                                component="label"
                                className="browseBtn"
                                style={{ width: "100%" }}
                                disabled={
                                  !uploadState.paid ||
                                  !taxonomy ||
                                  !uploadState.premium
                                }
                                onClick={() =>
                                  handleOpenUploadModal("taxonomy")
                                }
                                sx={{
                                  "&.Mui-disabled": {
                                    background: "#FFFFFF !important",
                                    borderColor: "#ABABAB",
                                    color: "#ABABAB",
                                  },
                                  "&:hover": {
                                    color: "#2E4770",
                                    backgroundColor: "#F9F9FF",
                                    borderColor: "#6077A4",
                                  },
                                  marginRight: "6px",
                                  textTransform: "none",
                                  borderRadius: "5px",
                                  backgroundColor: "#FFFFFF",
                                  borderColor: "#C6C6C6",
                                  color: "#474747",
                                  boxShadow: "none !important",
                                }}
                              >
                                <label
                                  htmlFor="chooseFileTaxonomy"
                                  className="fileLabel"
                                >
                                  {taxonomyFile ||
                                  (taxonomy && existingTaxonomy != "")
                                    ? "Reupload File"
                                    : "Upload File"}
                                </label>
                              </Button>
                            </>
                          </Grid>

                          {!isAllowedpremium && overlayVisibleTaxonomy ? (
                            <Box className="upgradeOverlay">
                              <Link href="/dashboard/pricing">
                                <Image
                                  style={{
                                    padding: "20px",
                                  }}
                                  width="100"
                                  height="100"
                                  src="/dashboard/diamond.svg"
                                  alt="Logo"
                                  priority
                                />
                              </Link>
                              <Typography
                                sx={{
                                  color: "#022149",
                                  fontWeight: "bold",
                                }}
                              >
                                You Have Discoverd Paid feature!
                              </Typography>
                              <Typography>
                                Click on the diamond to to check the pricing
                                plans.
                              </Typography>
                            </Box>
                          ) : null}
                        </Grid>
                      </Grid>
                      <Typography variant="text">
                        {!isAllowedpremium ? (
                          <Typography
                            style={{ color: "gray", textDecoration: "none" }}
                          >
                            Try It!{" "}
                            <strong style={{ textDecoration: "none" }}>
                              Download Sample File
                            </strong>
                          </Typography>
                        ) : (
                          <Link
                            style={{ color: "#022149", textDecoration: "none" }}
                            href="/taxonomy_example.xlsx"
                          >
                            Try It!{" "}
                            <strong style={{ textDecoration: "none" }}>
                              Download Sample File
                            </strong>
                          </Link>
                        )}
                      </Typography>
                    </Grid>
                  </Item>
                </div>
              </Tooltip>
            </Grid>
          </Grid>

          {/* Bottom section  */}
          <Box
            sx={{
              padding: "0px 16px",
              mt: "50px",
              mb: "20px",
              textAlign: "center",
            }}
          >
            <Button
              className="product-step-4"
              sx={{
                width: "34%",
                height: "40px",
                m: "12px 30px 12px 30px",
                textAlign: "center",
                "& .MuiButton-endIcon": {
                  ml: "10px",
                },
              }}
              size="small"
              variant="contained"
              color="primary"
              // onClick={handleUpload}
              onClick={
                generationType === "product" ? handleUpload : imagefunction
              }
              endIcon={<ArrowForwardOutlinedIcon />}
              disabled={
                (!content && !seo && !taxonomy) ||
                (content && !uploadState.selectedFile) ||
                (seo && keywords.length === 0) ||
                (taxonomy && !taxonomyFile && existingTaxonomy == "") ||
                loading ||
                generateLoading ||
                languages.length === 0
              }
            >
              Generate
            </Button>
          </Box>
        </Box>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={loading}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="info" onClose={handleSnackbarClose}>
            <AlertTitle>Success</AlertTitle>
            Please wait, the Taxonomy File is being uploaded...
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={ErrorsnackbarOpen}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            {errorMsg?.response?.data?.error
              ? errorMsg?.response?.data?.error
              : "unknown error occured"}
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={LimitErrorsnackbarOpen}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            {limitError}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={LimitErrorsnackbarOpen}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            {limitError}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={snackbarOpen}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            {/* {error.response.data.error} */}
            {errorMsg?.response?.data?.error ||
              errorMsg ||
              "Please make sure the name of the columns on your file are as given in the sample"}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={warnSnackbar}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            Please select a file
          </Alert>
        </Snackbar>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={taxonomyError}
          autoHideDuration={null}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>
              You must upload a{" "}
              <Link style={{ color: "red" }} href="/taxonomy">
                taxonomy
              </Link>{" "}
              spreadsheet first
            </AlertTitle>
          </Alert>
        </Snackbar>
        <SnackbarNotifier
          open={snackbarState.open}
          onClose={() => setSnackbarState({ ...snackbarState, open: false })}
          message={snackbarState.message}
          severity={snackbarState.severity}
        />
      </Root>
    </>
  );
}

export default Enhancement;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}
