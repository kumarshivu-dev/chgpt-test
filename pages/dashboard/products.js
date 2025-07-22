import React, { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  TextField,
  Typography,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  ListItemIcon,
  FormControl,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import * as XLSX from "xlsx/xlsx";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { v4 as uuidv4 } from "uuid";
import ProductLoader from "../../components/dashboard/product/ProductLoader";
import ProductTable from "../../components/dashboard/product/ProductTable";
import ImageRecTable from "../../components/dashboard/product/ImageRecTable";
import TourComponent from "../../components/dashboard/product/TourComponent.js";
import { tourStepsConfig } from "../../components/dashboard/product/OnboardingTourSteps.js";
import ProductOperations from "../../utils/productOperations.js";
import ProductOperationsMobile from "../../utils/productOperationsMobile.js";
import "../../components/dashboard/product/product.css";
import AddNewDialog from "./product/AddNewDialog";
import SaveDocumentDialog from "./product/SaveDocumentDialog";
import { useBrandDisplay } from "../../hooks/data/useBrandDisplay";
import {
  createCurrentRowData,
  excelExport,
  productSampleData,
  paidProductSampleData,
  imageRecSampleData,
  requiredFields,
  requiredFieldsImgRec,
} from "../../components/helper/dashboard/productHelper";
import trackActivity from "../../components/helper/dashboard/trackActivity.js";
import UploadModal from "../../components/dashboard/product/UploadModal.js";
import axios from "axios";
import { useRouter } from "next/router";
import {
  setSelectedFile,
  setImageRec,
  setPaid,
  setPremium,
  setSeo,
  setIsImageRec,
} from "../../store/uploadSlice";
import {
  setDocTableData,
  setOnRowExportBool,
  setIsSelectedProduct,
} from "../../store/dashboard/documentTableSlice.js";
import {
  setproductTableData,
  setImgRecTableData,
  setSelectedTab,
} from "../../store/dashboard/productTableSlice.js";
import UploadFilePage from "../../components/helper/dashboard/imagerec_dashboard.js";
import cookie from "js-cookie";
import EditProductDialog from "../../components/dashboard/product/EditProductDialog.js";
import "../../components/dashboard/product/product.css";
import SnackbarNotifier from "../../components/helper/dashboard/snackbarNotifier";
import { setProductData } from "../../store/dashboard/productReadiness.js";
import {
  setComplianceData,
  setComplianceExportData,
  setSeoReadinessExport,
  setMergedDataToExport,
  setBrandVoiceData,
  setSelectedId,
} from "../../store/dashboard/complianceSlice.js";
import { setCookie, getCookie, removeCookie } from "../../utils/cookies.js";
import WelcomeModal from "../../components/dashboard/product/WelcomeModal.js";
import AddPersonaModal from "../../components/dashboard/hypertarget/ChoosePersonaModal.js";
import ChooseChannelModal from "../../components/dashboard/hypertarget/ChooseChannelModal";
import {
  GET_USER_PROFILE,
  PUT_COMPLIANCE_PRODUCT,
  GET_DOCUMENTS_V2,
  POST_GENERATE_KEYWORDS,
  POST_ANALYZE_DESCRIPTION,
  POST_IMAGE_RECOGNITION,
  POST_SAVE_PRODUCTS,
  GET_ACCOUNT_PARAMETERS,
  GET_CLOUD_INFO,
} from "../../utils/apiEndpoints.js";
import LanguageSelector from "../../components/dashboard/product/LanguageSelector.js";
import { useWarning } from "../../context/WarningContext";
import WarningBox from "../../components/helper/WarningBox";
import { createExcel } from "../../utils/excelUtils.js";
import { scrollPageUp } from "../../utils-ui/scrollUtils.js";
import LimitReachedBox from "../../utils-ui/limitReachedBox.js";
import {
  resultPageText,
  productPageText,
  defaultPageText,
} from "../../constants/texts.js";
import ComplianceModal from "../../components/dashboard/product/ComplianceModal";
import { setSelectedProducts } from "../../store/dashboard/selectedProductsSlice";
import { useToast } from "../../context/ToastContext.js";
import { setUserChosenLLM } from "/store/userSlice";
import useInstanceState from "../../hooks/data/useInstanceState.js";
import CustomToolTip from "../../components/common-ui/CustomToolTip";
const products = ({ user, getFileName, requestedUserId }) => {
  const { Cloudresponse } = useInstanceState(user);
  const { data: session, status, update } = useSession();

  // redux state management
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const userChosenLLM = userState?.userInfo?.chosen_llm;
  const complianceStore = useSelector((state) => state.compliance);
  const complianceData = complianceStore?.data;
  const complianceExportData = complianceStore?.complianceExportData;
  const seoReadinessExport = complianceStore?.seoReadinessExport;
  const mergedDataToExport = complianceStore?.mergedDataToExport;

  const readinessData = useSelector((state) => state.productReadiness?.data);

  // react router hook
  const router = useRouter();

  // react state management
  const [openComplianceModal, setOpenComplianceModal] = useState(false);
  const [windowSize, setWindowSize] = useState(800);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const uploadState = useSelector((state) => state.uploadpage);
  const documnetState = useSelector((state) => state.documentTable);
  const [isValidProduct, setIsValidProduct] = useState(false);
  const [sampleData, setSampleData] = useState(productSampleData);
  const exportDocBool = documnetState?.onRowExportBool;
  const exportDocData = documnetState?.docTableData?.products;
  const isSelectedProduct = documnetState?.isSelectedProduct;
  const [isGenerateErrorOpen, setIsGenerateErrorOpen] = useState(false);
  const [isValidColumnName, setIsValidColumnName] = useState(false);
  const [isSampleData, setIsSampleData] = useState(false);
  const [isNewProductUserFlag, setIsNewProductUserFlag] = useState(true);
  const [isNewImageUserFlag, setIsNewImageUserFlag] = useState(true);
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [productTableReloader, setProductTableReloader] = useState(false);
  const [role, setRole] = useState("");
  const { brandLanguages, defaultLanguage } = useBrandDisplay();
  //product table store
  const productTableStore = useSelector((state) => state.productEntries);
  const productEntries = productTableStore?.productTableData;
  const imgRecEntries = productTableStore?.imgRecTableData;
  const selectedTab = productTableStore?.selectedTab;
  const [isSelected, setIsSelected] = useState(selectedTab);
  // const[complianceExport,setCompliancExport] = useState([])
  //To add seo and taxonomy in result table if it was opted in enhancement page
  const [isSEO, setIsSEO] = useState(false);
  const [isTaxonomy, setIsTaxonomy] = useState(false);
  // Upload Modal
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openPersonaModal, setOpenPersonaModal] = useState(false);
  // used to check whether auto save is completed or not in edit product popup
  const [autoSave, setAutoSave] = useState(false);

  //To maintain a state of editable row
  const [editableRow, setEditableRow] = useState({});
  const [rowData, setRowData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  //To track the result page
  const [isResultPage, setIsResultPage] = useState(false);

  //To track the enahancement page
  const [isGenerate, setIsGenerate] = useState(false);

  //To save new row entred by user in product page
  const [newRow, setNewRow] = useState([]);
  const [limitReached, setLimitReached] = useState(false);
  const [limitAlert, setLimitAlert] = useState(null);
  const [isLimitAlertClosed, setIsLimitAlertClosed] = useState(false);
  const [hasAlertBeenClosedTwice, setHasAlertBeenClosedTwice] = useState(false);

  //Save documents
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
  const [fileName, setFileName] = useState("");
  const [saveFileName, setSaveFileName] = useState(
    "Example_Product_Upload.xlsx"
  );
  const [currentProductIndex, setCurrentProductIndex] = useState(null);

  //state variable for image rec file
  // const [file, setFile] = useState("");
  const [productTaskId, setProductTaskId] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [snackbarOpen, setSnacklabarOpen] = useState(false);
  const [adsenseError, setAdsenseError] = useState(false);
  // const [invalidProductError, setInvalidProductError] = useState(false);
  const [isFreshUser, setIsFreshUser] = useState(null);

  // get the global redux values of user
  const isEnterpiseUser = userState?.userPlan?.startsWith("chgpt-enterprise");
  const brandIds = userState?.brandIdList;
  const chosenllm = userState?.userChosenLLM;

  const [cloudData, setCloudData] = useState(null);

  //New User guide - Onboarding
  const [showOnboardModal, setShowOnboardModal] = useState(true);
  const [selectedAction, setSelectedAction] = useState("");
  // const [cloudData, setCloudData] = useState(null);
  const [isTourStarted, setIsTourStarted] = useState(false);
  const [steps, setSteps] = useState([]);
  const personaState = useSelector((state) => state.hyperTarget);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [overviewDrawerOpen, setOverviewDrawerOpen] = useState(false);
  const { showToast } = useToast();
  const { displayName, brandUrl, isSpecificBrand, brandId, isActive } =
    useBrandDisplay();
  //Warning message context if profile is not updated
  const { setShowWarning, showWarning } = useWarning();

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const handleOpenUploadModal = () => setOpenUploadModal(true);
  const handleCloseUploadModal = () => setOpenUploadModal(false);

  useEffect(() => {
    if (Cloudresponse) {
      setCloudData(Cloudresponse);
    }
  }, [Cloudresponse]);

  // const handlePersonaUpload = () => setOpenPersonaModal(true);
  const handlePersonaUpload = () => {
    if (
      !["openai", "claude"].includes(chosenllm) &&
      ["TERMINATED", "PENDING", "STOPPED"].includes(cloudData?.instance_state)
    ) {
      showToast(
        <>
          <Typography variant="body1">
            No LLM is selected. Please choose any LLM from
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                router.push("/dashboard/settings/environmentSettings?tab=more"); // Redirect to settings page
              }}
              underline="hover"
              color="primary"
            >
              Environment settings to continue....
            </Link>
          </Typography>
        </>,
        "error", // Severity
        10000 // Duration (10 seconds)
      );
    } else {
      setOpenPersonaModal(true); // Open modal if conditions are not met
    }
  };

  const handleClosePersona = () => setOpenPersonaModal(false);

  const choosePersona = () => {
    if (!isValidProduct) {
      createExcel(
        selectedProduct,
        dispatch,
        setSelectedFile,
        setIsGenerate,
        isGenerate,
        isSelected,
        imagefunction,
        userState?.userInfo,
        personaState?.chosenPersona
      );
      handleRowClick(null);
      //isSelected - product/image
      dispatch(setSelectedProducts(selectedProduct));
      router.push({
        pathname: "/dashboard/enhancements",
      });
    } else {
      setIsGenerateErrorOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setIsValidColumnName(false);
    setIsGenerateErrorOpen(false);
    setShareSnackbar(false);
  };

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  useEffect(() => {
    setIsSampleData(false);
    setRole(user?.role);
    const isNewUser = JSON.parse(localStorage.getItem("newUser"));
    if (isSelected === "product") {
      dispatch(setIsImageRec(false));

      if (uploadState.paid || uploadState.premium || uploadState.seo) {
        setSampleData(paidProductSampleData);
      }
      if (isNewUser && isNewProductUserFlag) {
        setIsSampleData(true);
        setIsNewProductUserFlag(false);
      }
    } else if (isSelected === "image") {
      dispatch(setIsImageRec(true));
      if (uploadState.imageRec) {
        setSampleData(imageRecSampleData);
        if (isNewUser && isNewImageUserFlag) {
          setIsSampleData(true);
          setIsNewImageUserFlag(false);
        }
      }
    }

    if (isNewProductUserFlag && isNewImageUserFlag) {
      localStorage.setItem("newUser", JSON.stringify(false));
    }

    //if product table data present in redux
  }, [isSelected, uploadState.paid]);

  useEffect(() => {
    if (currentProductIndex !== null) {
      const value = createCurrentRowData(
        newRow[currentProductIndex],
        isSelected,
        false
      );
      setRowData(value);
    }
  }, [currentProductIndex]);

  // To fetch window screen width
  useEffect(() => {
    //To fetch category value from URL when clicking link in Mail
    const queryParams = new URLSearchParams(window.location.search);
    const value = queryParams.get("category");
    if (value) {
      setIsSelected(value);
    }
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    handleSize();
  }, []);

  //Function to get user Details
  useEffect(() => {
    if (session && !session.user.terms) {
      update({ ...session, terms: cookie.get("rememberMe") });
      session.user.terms = cookie.get("rememberMe");
    }
    axios
      .get(process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_USER_PROFILE, {
        headers: {
          Authorization: user?.id_token,
        },
      })
      .then((response) => {
        // setchosenllm_model(response?.data?.chosen_llm);
        dispatch(setUserChosenLLM(response?.data?.chosen_llm));

        if (response.data.paidUser == true) {
          if (!response.data.planCode.startsWith("chgpt-basic")) {
            dispatch(setSeo(true));
          }
          dispatch(setPaid(true));
          if (
            response.data.planCode == "chgpt-premium" ||
            response.data.planCode.startsWith("chgpt-enterprise")
          ) {
            dispatch(setPremium(true));
          }
          if (response.data.planCode.startsWith("chgpt-enterprise")) {
            dispatch(setImageRec(true));
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Helper function to process excel data by adding default values and ids
  const processExcelData = (excelData, isSelected) => {
    return excelData.map((item) => {
      item.id = uuidv4();
      if (isSelected === "image") {
        item.image_id = item.image_id || "";
        item.item = item.item || "";
        item.optional_keywords = item.optional_keywords || "";
      }
      return item;
    });
  };

  // Helper function to validate column names
  const validateColumnNames = (excelData, requiredFieldsList) => {
    const keys = Object.keys(excelData[0]);
    return requiredFieldsList.find((field) => !keys.includes(field));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    // Get the file extension by splitting the file name and converting it to lower case
    const fileType = file.name.split(".").pop().toLowerCase();

    // Check if the file is not an Excel file (not .xlsx or .xls)
    if (fileType !== "xlsx" && fileType !== "xls") {
      activateSnackbar(
        "Please upload only Excel files (.xlsx or .xls).",
        "error"
      );
      handleCloseUploadModal();
      return;
    }

    // Continue processing if the file is an Excel file
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet);

      // Determine the required fields based on selection
      const requiredFieldsList =
        isSelected === "image"
          ? Object.values(requiredFieldsImgRec)
          : Object.keys(requiredFields);

      const processedData = processExcelData(excelData, isSelected);

      const firstMismatchedField = validateColumnNames(
        processedData,
        requiredFieldsList
      );

      if (!firstMismatchedField) {
        trackActivity(
          "IMPORT", // action
          file?.name, // filename
          user, // user
          "", // editor_email
          userState?.userInfo?.orgId, // orgId
          null, // changed_role
          null, // number_of_products
          null, // changed_chunking_type
          brandIds // brandIds
        );
        //dispatch both product & image
        dispatch(
          isSelected === "product"
            ? setproductTableData([...processedData, ...newRow])
            : setImgRecTableData([...processedData, ...newRow])
        );

        // if (isProductPage) {
        setNewRow([...processedData, ...newRow]);
        // dispatch(setproductTableData([...processedData, ...newRow]));
        // }
      } else {
        activateSnackbar(
          `Missing or incorrect column name "${firstMismatchedField}"`,
          "error"
        );
        return;
      }
    };
    reader.readAsArrayBuffer(file);
    handleSnackbarClose();
    handleCloseUploadModal();
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const extractfirstTenRows = async (getFileName) => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_DOCUMENTS_V2,
        {
          headers: {
            Authorization: user.id_token,
          },
          params: {
            requestedUserId: requestedUserId,
            filename: getFileName,
          },
        }
      );

      const products = response?.data.document_attrs?.products;

      if (products && products[0].product_id) {
        dispatch(setproductTableData(products));
      } else if (products && products[0].image_id) {
        dispatch(setImgRecTableData(products));
      } else {
        dispatch(setproductTableData(products));
        dispatch(setImgRecTableData(products));
      }

      setNewRow(products);

      setIsSelected((prevIsSelected) => {
        if (
          products &&
          products[0]?.image_id != null &&
          user?.allowedFeatures?.includes("image_rec")
        ) {
          dispatch(setSelectedTab("image"));
          return "image";
        } else {
          return prevIsSelected;
        }
      });

      if (
        products &&
        products[0]?.image_id != null &&
        !user?.allowedFeatures?.includes("image_rec")
      ) {
        setNewRow([]);
        activateSnackbar(
          "You need to upgrade to Enterprise to access Image recognition",
          "error"
        );
      }
    } catch (error) {
      setShareSnackbar(true);
    }
  };

  useEffect(() => {
    if (getFileName !== "" && requestedUserId != null) {
      const encoded_name = encodeURIComponent(getFileName);
      extractfirstTenRows(encoded_name);
    }
  }, [getFileName, requestedUserId]);

  useEffect(() => {
    if (isSampleData) {
      if (isNewProductUserFlag || isNewImageUserFlag) {
        setNewRow([...sampleData]);
      } else {
        setNewRow([...sampleData, ...newRow]);
      }
    } else {
      //To remove the sample data from table when toggle is turned off
      const rowData = newRow?.filter(
        (item1) => !sampleData?.some((item2) => item1.id === item2.id)
      );
      const selectedRowData = selectedProduct.filter(
        (item1) => !sampleData?.some((item2) => item1.id === item2.id)
      );

      setNewRow(rowData);
      setSelectedProduct(selectedRowData);
    }
  }, [isSampleData, sampleData]);
  

  const updateMergedData = (
    complianceExportData = [],
    seoReadinessExport = []
  ) => {
    const merged = complianceExportData?.map((complianceItem) => {
      const readinessItem = seoReadinessExport.find(
        (item) => item.id === complianceItem.id
      );
      return {
        ...complianceItem,
        ...readinessItem, // Readiness data will overwrite compliance fields if they overlap
      };
    });
    const remainingReadinessItems = seoReadinessExport.filter(
      (readinessItem) =>
        !complianceExportData.some(
          (complianceItem) => complianceItem.id === readinessItem.id
        )
    );

    const finalMergedData = [...merged, ...remainingReadinessItems];
    dispatch(setMergedDataToExport(finalMergedData)); // Update the Redux store
  };
  //function to check compliance for selected products
  const checkCompliance = async (complianceSettings) => {
    setProductTableReloader(true);
    // Filter and map products in one step, and check if all products have descriptions
    const { products, allHaveDescriptions } = selectedProduct.reduce(
      (acc, item) => {
        if (item.product_description) {
          acc.products.push({
            product_description: item.product_description,
            id: item.id,
            product_name: item.product_name,
            brand: item.brand,
          });
        }
        acc.allHaveDescriptions =
          acc.allHaveDescriptions && !!item.product_description;
        return acc;
      },
      { products: [], allHaveDescriptions: true }
    );

    if (!allHaveDescriptions) {
      activateSnackbar("Products must have descriptions.", "error");
      setProductTableReloader(false);
      return;
    }

    const industryLevel = !userState?.userInfo?.ragModel;
    const dataToSend = {
      ...complianceSettings,
      products,
      files: [],
      // industry: "FDA_FOOD",
      // industryLevel,
    };
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}${PUT_COMPLIANCE_PRODUCT}`,
        dataToSend,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      const responseData = response?.data;
      dispatch(setComplianceData(responseData));

      // compliance mapping to export data
      const complianceMapping = selectedProduct.map((product) => {
        const complianceData = responseData?.find(
          (res) => res.id === product.id
        );

        // export file data
        const exportFileData = {
          ...product,
          ...(complianceData?.complianceResults && {
            compliance_files_compliant:
              complianceData.complianceResults.compliant,
            compliance_files_concern: complianceData.complianceResults.concern,
          }),
          ...(complianceData?.brandVoiceResults && {
            brand_voice_compliant:
              complianceData.brandVoiceResults.brand_voice_compliant,
            brand_voice_concern: complianceData.brandVoiceResults.concern,
          }),
        };

        return exportFileData;
      });

      // trackActivity(
      //   "COMPLIANCE_ANALYSED",
      //   "",
      //   user,
      //   "",
      //   userState?.userInfo?.orgId,
      //   "",
      //   selectedProduct.length,
      //   null, // changed_chunking_type (optional or null)
      //   brandIds
      // );

      dispatch(setComplianceExportData(complianceMapping));
      updateMergedData(complianceMapping, seoReadinessExport);
      setCheckButton(true);
    } catch (error) {
      console.error("Network error:", error);
      if (error?.response?.status === 400) {
        activateSnackbar(
          <>
            {error?.response?.data?.message}{" "}
            {error?.response?.data?.link && (
              <Link href={`/dashboard/${error?.response?.data?.link}`}>
                Navigate here to upload
              </Link>
            )}
          </>,
          "error"
        );
      }
    } finally {
      setProductTableReloader(false);
    }
  };
  // check checkReadiness
  const checkReadiness = async () => {
    setProductTableReloader(true);
    let websiteUrl = userState?.userInfo?.websiteUrl;

    try {
      const results = [];
      const analysisResults = [];
      let successfullyProcessedCount = 0;

      // Process each product sequentially
      for (const product of selectedProduct) {
        if (
          product?.product_description === undefined ||
          product?.product_description === ""
        ) {
          continue;
        }

        try {
          // Step 1: Generate keywords for this single product
          const requestData = {
            page_url: brandUrl || websiteUrl,
            product: product?.product_name,
            source: "website",
          };

          const config = {
            headers: {
              Authorization: user?.id_token,
            },
          };

          const response = await axios.post(
            process.env.NEXT_PUBLIC_BASE_URL + POST_GENERATE_KEYWORDS,
            requestData,
            config
          );

          if (response?.status === 200) {
            successfullyProcessedCount++;
          }

          const keywordResults = [
            ...(response?.data?.keyword_results?.product_based || []),
            ...(response?.data?.keyword_results?.url_based || []),
          ];

          const highValueKeywords = keywordResults?.filter(
            (keyword) => keyword?.avg_monthly_searches > 0
          );

          const keywordTexts = highValueKeywords?.map(
            (keyword) => keyword?.keyword_text
          );

          // Step 2: Analyze description for this single product
          const products = [
            {
              product_description: product?.product_description,
              product_id: product?.id,
            },
          ];

          const analysisResponse = await axios.post(
            process.env.NEXT_PUBLIC_BASE_URL + POST_ANALYZE_DESCRIPTION,
            {
              products,
              high_value_keywords: keywordTexts,
            },
            config
          );

          const analysisResult = analysisResponse?.data?.product_analysis?.[0];

          // Update product with readiness data
          const updatedProduct = {
            ...product,
            readiness_percentage: analysisResult
              ? analysisResult?.readiness_percentage
              : null,
          };

          results.push(updatedProduct);
          if (analysisResult) {
            analysisResults.push(analysisResult);
          }
        } catch (error) {
          continue;
          // console.error("Error processing product:", error);
          // Continue with next product even if this one fails
        }
      }

      // Track activity once after all products are processed
      if (successfullyProcessedCount > 0) {
        trackActivity(
          "SEO_COMPLIANCE_ANALYSED",
          "",
          user,
          "",
          userState?.userInfo?.orgId,
          "",
          successfullyProcessedCount, // total number of successfully processed products
          null,
          brandIds
        );
      }

      // Check if any products were successfully processed
      if (results.length === 0) {
        scrollPageUp();
        showToast(
          "None of the selected products have valid descriptions to analyze",
          "error"
        );

        // setInvalidProductError(
        //   "None of the selected products have valid descriptions to analyze"
        // );
        setProductTableReloader(false);
        return;
      }

      // Update state with all processed results
      dispatch(setSeoReadinessExport(results));
      updateMergedData(complianceExportData, results);

      const readyProducts = analysisResults?.filter(
        (result) => result?.using_high_value_keywords
      );

      const report = {
        total_products: selectedProduct?.length,
        compliant_products: readyProducts?.length,
        readiness_percentage:
          analysisResults?.length > 0
            ? (readyProducts?.length / analysisResults?.length) * 100
            : 0,
        all_ready: readyProducts?.length > 0,
        product_readiness: analysisResults,
      };

      dispatch(setProductData(report));
    } catch (error) {
      scrollPageUp();
      setAdsenseError(true);
    } finally {
      setProductTableReloader(false);
    }
  };

  const imagefunction = (file) => {
    if (file) {
      const personaName = personaState?.chosenPersona;
      const formData = new FormData();
      formData.append("file", file);
      // formData.append("personas", personaName);
      formData.append("channels", JSON.stringify(personaName));
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
          setErrorMsg((error?.response?.data?.errors).join("\n"));
          // setFile(null);
          setSnackbarOpen(true);
        })
        .finally(() => {
          // setLoading(false);
        });
    } else {
    }
  };

  const handleOpenSaveDialog = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      "0" +
      (currentDate.getMonth() + 1)
    ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`;

    let contentToAdd = isResultPage
      ? "Results"
      : isSelected === "product"
      ? "Products"
      : "Image-Rec";
    contentToAdd = `${contentToAdd}-${formattedDate}`;
    const updateFileName = `${contentToAdd}-Example_Product_Upload.xlsx`;

    setSaveFileName(updateFileName);
    setOpenSaveDialog(true);
  };

  const handleCloseSaveDialog = () => {
    setOpenEditProductDialog(false);
    setOpenSaveDialog(false);
  };

  const handleSaveDocument = async (updatedFileName, errorMessage) => {
    if (errorMessage) {
      console.log(errorMessage);
      return;
    }

    setSaveFileName(updatedFileName);

    if (newRow.length === 0) {
      return;
    }

    const data = {
      filename: updatedFileName,
      username: user?.name || "NA",
      products: newRow,
      type:
        isSelected === "product"
          ? "PRODUCT_DOCUMENT"
          : "IMAGE_RECOGNITION_DOCUMENT",
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_SAVE_PRODUCTS,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      if (response?.data?.status === true) {
        activateSnackbar("Document is successfully saved!");
      } else {
        activateSnackbar(response?.data?.errorMessage, "error");
      }
    } catch (error) {
      console.error("Error while Saving Document", error);
    }

    handleCloseSaveDialog(); // Close the dialog after save
  };

  //get file name to save document modal
  const getUploadFileName = (uploadFileName) => {
    setSaveFileName(uploadFileName);
  };

  // function related to table operation
  const handleRowClick = (row, cellIndex) => {
    setEditableRow(row?.original);
    if (row !== null) {
      setCurrentProductIndex(cellIndex);
      setRowData(row?.original);
      setOpenEditProductDialog(true);
    }
  };

  const handleIsSelected = (value) => {
    setIsSelected(value);
    dispatch(setSelectedTab(value));
    setNewRow([]);
    // dispatch(setproductTableData([]));
  };

  const generateExcel = () => {
    // if (newRow?.length === 0 || exportDocData === 0) {
    //   activateSnackbar("No Products to Save", "error");
    //   return;
    // }

    //Removing Id property from array for excel

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      "0" +
      (currentDate.getMonth() + 1)
    ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`;

    let contentToAdd = isResultPage
      ? "Results"
      : isSelected === "product"
      ? "Products"
      : "Image-Rec";
    contentToAdd = `${contentToAdd}-${formattedDate}`;
    const updateFileName = `${contentToAdd}-Example_Product_Upload.xlsx`;
    const newArray = newRow.map((obj) => {
      const { id, ...rest } = obj;
      return rest;
    });

    if (newArray.length > 0) {
      excelExport(newArray, isResultPage);
      trackActivity(
        "EXPORT", // action
        updateFileName, // filename
        user, // user
        "", // editor_email (optional or empty string)
        userState?.userInfo?.orgId, // orgId
        null, // changed_role (optional or null)
        null, // number_of_products (optional or null)
        null, // changed_chunking_type (optional or null)
        brandIds // brandIds (optional or null)
      );
    }
  };

  useEffect(() => {
    handleSaveDocument();
    handleCloseSaveDialog();
  }, [fileName]);

  const handleTextFieldChange = (event) => {
    const { name, value } = event.target;
    setRowData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const fetchAccountParameters = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + GET_ACCOUNT_PARAMETERS,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );
      // if (
      //   response?.data?.User_Plan === "chgpt-basic" ||
      //   response?.data?.User_plan === "chgpt-free"
      // ) {
      //   setSampleData(productSampleData);
      // }
      if (!user?.allowedFeatures.includes("seo")) {
        setSampleData(productSampleData);
      }
      if (response?.data?.Calls_Left <= 0) {
        setLimitReached(true);
      }

      const isLimitAlertClosedCookie = getCookie("isLimitAlertClosed");
      if (isLimitAlertClosedCookie) {
        setIsLimitAlertClosed(isLimitAlertClosedCookie === "true");
      }

      const hasAlertBeenClosedTwiceCookie = getCookie(
        "hasAlertBeenClosedTwice"
      );
      if (hasAlertBeenClosedTwiceCookie) {
        setHasAlertBeenClosedTwice(hasAlertBeenClosedTwiceCookie === "true");
      }

      if (response?.data?.percenatge_left <= 1 && !hasAlertBeenClosedTwice) {
        setIsLimitAlertClosed(false);
      }

      setLimitAlert(response?.data?.alert_messsgae);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseLimitAlert = () => {
    if (!isLimitAlertClosed) {
      setCookie("isLimitAlertClosed", "true");
      setIsLimitAlertClosed(true);
    } else {
      setCookie("hasAlertBeenClosedTwice", "true");
      setHasAlertBeenClosedTwice(true);
    }
    setLimitAlert(null);
  };

  const handleMoreActionChange = (event) => {
    const action = event.target.value;
    setSelectedAction(action);
  };

  const handleMenuItemClick = (action) => {
    setSelectedAction(action);

    switch (action) {
      case "import":
        handleOpenUploadModal();
        break;
      case "export":
        generateExcel();
        break;
      case "newRow":
        handleOpenDialog();
        break;
      case "save":
        handleOpenSaveDialog();
        break;
      case "seo":
        checkReadiness();
        break;
      case "compliance":
        setOpenComplianceModal(true);
        // checkCompliance();
        break;
      case "readiness report":
        setOverviewDrawerOpen(true);
        break;
      default:
        break;
    }
  };

  const handleStartTour = () => {
    setIsTourStarted("true");
    setShowOnboardModal(false);
  };

  const handleSkipTour = () => {
    setCookie("isFreshUser", false);
    setCookie("isTour", false);
    setCookie("isImageRec", false);
    setShowOnboardModal(false);
    setIsTourStarted(false);
  };

  const smallScreen = useMediaQuery("(max-width:768px)");
  useEffect(() => {
    const freshUserCookie = getCookie("isFreshUser");
    if (freshUserCookie === "true") setCookie("isTour", true);
    setIsFreshUser(freshUserCookie);
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    if (currentPath === "/dashboard/products") {
      // Handle specific case for /dashboard/products
      let tourSteps;
      tourSteps = uploadState.isImageRec
        ? (smallScreen
            ? tourStepsConfig[currentPath].mobile.imageRec
            : tourStepsConfig[currentPath].desktop.imageRec) || []
        : (smallScreen
            ? tourStepsConfig[currentPath].mobile
            : tourStepsConfig[currentPath].desktop) || [];
      setSteps(tourSteps);
    } else {
      // Handle other paths
      tourSteps =
        (smallScreen
          ? tourStepsConfig[currentPath].mobile
          : tourStepsConfig[currentPath].desktop) || [];
      setSteps(tourSteps);
    }

    fetchAccountParameters();
  }, [smallScreen]);

  useEffect(() => {
    // if (!isSelectedProduct) {
    //   setIsSelected("image");
    // }
    if (exportDocBool) {
      let exportedData = exportDocData?.map((item) => ({
        ...item,
        id: uuidv4(),
      }));

      // condition to check validation of column Name Format
      const keys = Object.keys(exportedData[0]);
      const columnNameFormat = !isSelectedProduct
        ? Object.values(requiredFieldsImgRec)
        : Object.keys(requiredFields);
      const isMatchedFields = columnNameFormat.every((value) =>
        keys.includes(value)
      );
      isMatchedFields
        ? setNewRow([...exportedData, ...newRow])
        : setIsValidColumnName(true);

      //dispatch both prod & image

      dispatch(
        isSelected === "product"
          ? setproductTableData([...exportedData, ...newRow])
          : setImgRecTableData([...exportedData, ...newRow])
      );

      dispatch(setOnRowExportBool(false)); // Reset the flag
      dispatch(setDocTableData([]));
      dispatch(setIsSelectedProduct(true));
    }
  }, [exportDocBool]);

  useEffect(() => {
    setNewRow(isSelected === "product" ? productEntries : imgRecEntries);
  }, [isSelected]);

  if (generateLoading && productTaskId) {
    return (
      <ProductLoader
        productTaskId={productTaskId}
        user={user}
        isSelected={isSelected}
      />
    );
  }

  //condition to check whether this is a result page.
  if (!isGenerate) {
    return (
      <Box>
        {/* product header section  */}
        <Box
          className="before-divider"
          sx={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {!isResultPage && (
            <Box
              ml={"10px"}
              sx={{
                display: "flex",
                flexDirection: "row",
                width: {
                  xs: "100%",
                  sm: "100%",
                  md: "50%",
                },
              }}
            >
              <Button
                className="product-generation-btn"
                variant="text"
                sx={{
                  color: isSelected === "product" ? "#032148" : "#C6C6C6",
                  borderRadius: "0",
                  marginBottom: isSelected === "product" ? "-5px" : "0",
                  borderBottom:
                    isSelected === "product" ? "5px solid #032148" : "none",
                  padding: "0px",
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                    md: "24px",
                  },
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
                onClick={() => handleIsSelected("product")}
              >
                Product Generation
              </Button>
              {user?.allowedFeatures?.includes("image_rec") && (
                <CustomToolTip
                  title={
                    userChosenLLM !== "openai" &&
                    "Switch to OpenAI to use this feature."
                  }
                >
                  <Button
                    className="image-recognition-btn"
                    variant="text"
                    sx={{
                      color: isSelected === "image" ? "#032148" : "#C6C6C6",
                      borderRadius: "0",
                      marginBottom: isSelected === "image" ? "-5px" : "0",
                      borderBottom:
                        isSelected === "image" ? "5px solid #032148" : "none",
                      padding: "0px",
                      marginLeft: "15px",
                      fontSize: {
                        xs: "16px",
                        sm: "18px",
                        md: "24px",
                      },
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                    disabled={userChosenLLM !== "openai"}
                    onClick={() => handleIsSelected("image")}
                  >
                    Image Recognition
                  </Button>
                </CustomToolTip>
              )}
            </Box>
          )}
        </Box>

        {!isResultPage && <Divider />}
        {isResultPage && (
          <Box>
            <Typography className="content" variant="h6">
              Product Results
            </Typography>
          </Box>
        )}
        <Box className="box-layout">
          <Box className="inner-box-layout">
            {isResultPage ? (
              <Typography
                className="product-pg-content"
                dangerouslySetInnerHTML={{ __html: resultPageText }}
              />
            ) : isSelected === "product" ? (
              <Typography
                className="product-pg-content"
                dangerouslySetInnerHTML={{ __html: productPageText }}
              />
            ) : (
              <Typography
                className="product-pg-content"
                dangerouslySetInnerHTML={{ __html: defaultPageText }}
              />
            )}
          </Box>
          {/* {isEnterpiseUser && isSelected === "product" && <LanguageSelector />} */}
        </Box>

        {/* loader element */}
        {productTableReloader ? (

          <>
          {/* Background Blur Overlay */}
          <Box
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            sx={{
              backdropFilter: 'blur(8px)', // Adjust blur strength here
              backgroundColor: 'rgba(255, 255, 255, 0.3)', // Optional: translucent background
              zIndex: 999,
            }}
          />

          {/* Loader Box */}
          <Box
            position="fixed"
            top="50%"
            left="50%"
            sx={{
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography
              variant="h6"
              color="primary"
              sx={{
                fontWeight: 600,
                textShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
            >
              Checking Compliance
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                maxWidth: '300px',
                textShadow: '0 0 5px rgba(255,255,255,0.6)',
              }}
            >
              Almost there…
            </Typography>
          </Box>
          </>
        ) : (
          <></>
        )}

        {/* Alert Limit Reached: only 5 product calls remaining */}
        {limitAlert && !isLimitAlertClosed && !hasAlertBeenClosedTwice && (
          <>
            <Box
              className="alert-reach-box"
              sx={{
                position: "relative",
                padding: "0px !important",
                margin: "0px !important",
                marginTop: "8.5px !important",
              }}
            >
              <IconButton
                onClick={() => handleCloseLimitAlert()}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  //transform: "translate(45%, -45%)",
                  // background: "rgba(0, 0, 0, 0.4)",
                  ":hover": {
                    background: "rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <LimitReachedBox
              sx={{
                padding: "0px !important", // Override MUI default padding
                margin: "0px !important", // Remove extra spacing
                minHeight: "auto", // Adjust height dynamically
                display: "flex",
                alignItems: "center",
              }}
              limitReached={limitAlert}
              title="Heads Up!"
              description={limitAlert}
            />
          </>
        )}

        {showWarning && <WarningBox />}
        {adsenseError && (
          <Box className="alert-reached-box">
            <IconButton
              size="small"
              className="alert-close-icon"
              aria-label="close"
              onClick={() => setAdsenseError(null)}
            >
              <CloseRoundedIcon />
            </IconButton>
            {role === "Editor" ? (
              <Typography className="alert-typography">
                Ask your admin(s) to update the Website URL.
              </Typography>
            ) : (
              <Typography className="alert-typography">
                Please{" "}
                <Link href="/dashboard/profile" className="alert-link">
                  Update Your Profile
                </Link>{" "}
                and Enter a valid Website URL to access this feature!
              </Typography>
            )}
          </Box>
        )}

        {/* {invalidProductError && (
          <Box className="invalid-product-box">
            <IconButton
              size="small"
              className="invalid-product-close-icon"
              aria-label="close"
              onClick={() => setInvalidProductError(null)}
            >
              <CloseRoundedIcon />
            </IconButton>
            <Typography className="invalid-product-typography">
              {invalidProductError}
            </Typography>
          </Box>
        )} */}

        {/* Limit Reached box */}
        <LimitReachedBox limitReached={limitReached} />

        {/* New User Onboarding tour */}
        {isFreshUser === "true" && (
          <WelcomeModal
            open={showOnboardModal}
            handleClose={() => setShowOnboardModal(false)}
            handleStartTour={handleStartTour}
            handleSkipTour={handleSkipTour}
          />
        )}

        {/* Existing User Onboarding tour */}
        {(isTourStarted === "true" ||
          (getCookie("isTour") === "true" && isFreshUser === "false")) && (
          <TourComponent
            steps={steps}
            handleClose={() => setIsTourStarted(false)}
            handleSkipTour={handleSkipTour}
          />
        )}

        {/*Edit product pop up component*/}
        <EditProductDialog
          key={currentProductIndex}
          openEditProductDialog={openEditProductDialog}
          handleCloseSaveDialog={handleCloseSaveDialog}
          editableRow={editableRow}
          setEditableRow={setEditableRow}
          rowData={rowData}
          handleTextFieldChange={handleTextFieldChange}
          newRow={newRow}
          setNewRow={setNewRow}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          isResultPage={isResultPage}
          setIsValidProduct={setIsValidProduct}
          setAutoSave={setAutoSave}
          autoSave={autoSave}
          setCurrentProductIndex={setCurrentProductIndex}
          currentProductIndex={currentProductIndex}
          isSelected={isSelected}
          user={user}
        />

        {/* product import modal  */}
        <UploadModal
          isOpen={openUploadModal}
          onClose={handleCloseUploadModal}
          flag={"productsPage"}
          newRow={newRow}
          setNewRow={setNewRow}
          user={user}
          onFileUpload={getUploadFileName}
          handleDropFile={handleDrop}
          handleDragOverFile={handleDragOver}
          isSelected={isSelected}
          windowSize={windowSize}
        />

        {windowSize > 1236 ? (
          <ProductOperations
            isSelected={isSelected}
            windowSize={windowSize}
            isSampleData={isSampleData}
            setIsSampleData={setIsSampleData}
            handleOpenUploadModal={handleOpenUploadModal}
            generateExcel={generateExcel}
            handleOpenSaveDialog={handleOpenSaveDialog}
            handleOpenDialog={handleOpenDialog}
            checkCompliance={checkCompliance}
            checkReadiness={checkReadiness}
            handlePersonaUpload={handlePersonaUpload}
            selectedProduct={selectedProduct}
            complianceData={complianceData}
            readinessData={readinessData}
            limitReached={limitReached}
            overviewDrawerOpen={overviewDrawerOpen}
            setOverviewDrawerOpen={setOverviewDrawerOpen}
            user={user}
            newRow={newRow}
            exportDocData={exportDocData}
            isResultPage={isResultPage}
          />
        ) : (
          <ProductOperationsMobile
            isSelected={isSelected}
            windowSize={windowSize}
            isSampleData={isSampleData}
            setIsSampleData={setIsSampleData}
            handleOpenUploadModal={handleOpenUploadModal}
            generateExcel={generateExcel}
            handleOpenSaveDialog={handleOpenSaveDialog}
            handleOpenDialog={handleOpenDialog}
            checkCompliance={checkCompliance}
            checkReadiness={checkReadiness}
            handlePersonaUpload={handlePersonaUpload}
            selectedProduct={selectedProduct}
            complianceData={complianceData}
            readinessData={readinessData}
            limitReached={limitReached}
            overviewDrawerOpen={overviewDrawerOpen}
            setOverviewDrawerOpen={setOverviewDrawerOpen}
            user={user}
            newRow={newRow}
            exportDocData={exportDocData}
            isResultPage={isResultPage}
            handleMenuItemClick={handleMenuItemClick}
            handleMoreActionChange={handleMoreActionChange}
          />
        )}

        {/* Compliance Modal  */}
        <ComplianceModal
          open={openComplianceModal}
          onClose={() => setOpenComplianceModal(false)}
          checkCompliance={checkCompliance}
        />

        {/* {productReadinessState.data != null ? (
          <Box className="label-box" sx={{ display: "flex" }}>
            <Box
              className="label primary "
              sx={{
                padding: "5px",
                borderRadius: "5px",
                marginRight: "10px",
                background: "#4CAF50",
                color: "white",
              }}
            >
              Total Products Analyzed:{" "}
              {productReadinessState.data.total_products}
            </Box>

            <Box
              className="label success "
              sx={{
                padding: "5px",
                borderRadius: "5px",
                marginRight: "10px",
                background: "#4CAF50",
                color: "white",
              }}
            >
              Ready : {productReadinessState.data.compliant_products}
            </Box>
            <Box
              className="label warning "
              sx={{
                padding: "5px",
                borderRadius: "5px",
                marginRight: "10px",
                background: "#4CAF50",
                color: "white",
              }}
            >
              Avg Readiness : {productReadinessState.data.readiness_percentage.toFixed(2)}%
            </Box>
          </Box>
        ) : (
          <></>
        )} */}

        {/* {isSelected === 'product' &&  */}
        {/* <AddPersonaModal
          isOpen={openPersonaModal}
          onClose={() => handleClosePersona()}
          user={user}
          onTableUpdate={() => getPersonaList()}
          choosePersona={() => choosePersona()}
        /> */}

        {/* {openPersonaModal && ( */}
        <ChooseChannelModal
          isOpen={openPersonaModal}
          onClose={() => handleClosePersona()}
          user={user}
          choosePersona={() => choosePersona()}
        />
        {/* )} */}

        {/* } */}

        <SaveDocumentDialog
          open={openSaveDialog}
          onClose={handleCloseSaveDialog}
          onSubmit={handleSaveDocument}
          defaultValue={saveFileName}
        />

        {/* New product addition  modal  */}
        <AddNewDialog
          openDialog={openDialog}
          handleCloseDialog={handleCloseDialog}
          isSelected={isSelected}
          uploadState={uploadState}
          setNewRow={setNewRow}
          newRow={newRow}
        />

        {/* product table  */}
        {isSelected == "product" ? (
          <ProductTable
            tableData={newRow}
            setSelectedProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
            handleRowClick={handleRowClick}
            editableRow={editableRow}
            isResultPage={isResultPage}
            setIsResultPage={setIsResultPage}
            setIsSampleData={setIsSampleData}
            isSampleData={isSampleData}
            setIsValidProduct={setIsValidProduct}
            isGenerate={isGenerate}
            isTaxonomy={isTaxonomy}
            isSEO={isSEO}
          />
        ) : (
          // <UploadFilePage user={user} />
          <ImageRecTable
            tableData={newRow}
            setSelectedProduct={setSelectedProduct}
            selectedProduct={selectedProduct}
            handleRowClick={handleRowClick}
            editableRow={editableRow}
            isResultPage={isResultPage}
            setIsResultPage={setIsResultPage}
            setIsSampleData={setIsSampleData}
            setIsValidProduct={setIsValidProduct}
            isGenerate={isGenerate}
            isTaxonomy={isTaxonomy}
            isSEO={isSEO}
          />
        )}

        <SnackbarNotifier
          open={snackbarState.open}
          onClose={() => setSnackbarState({ ...snackbarState, open: false })}
          message={snackbarState.message}
          severity={snackbarState.severity}
        />

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={isGenerateErrorOpen}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            {"Enter all the mandatory fields data"}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={isValidColumnName}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            {"Please provide valid column names"}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={shareSnackbar}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            {"Some error occur populating your data"}
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={snackbarOpen}
          autoHideDuration={null}
          onClose={handleSnackbarClose}
        >
          <Alert
            severity="error"
            onClose={handleSnackbarClose}
            style={{ whiteSpace: "pre-line" }}
          >
            <AlertTitle>Error</AlertTitle>
            {errorMsg}
          </Alert>
        </Snackbar>
      </Box>
    );
  }
};

export default products;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }
  const { filename, requestedUserId } = context.query;
  const user = session.user;

  return {
    props: {
      getFileName: filename || "",
      requestedUserId: requestedUserId || null,
      // Ensure getFileName is defined
      user,
    },
  };
}
