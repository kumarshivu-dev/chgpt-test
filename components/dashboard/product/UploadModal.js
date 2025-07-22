import {
  Typography,
  Box,
  Modal,
  Grid,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  AlertTitle,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import useDrivePicker from "react-google-drive-picker";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import "./product.css";
import { useEffect, useState } from "react";
import DocumentTableDataImporter from "./DocumentTableDataImporter";
import { useSelector, useDispatch } from "react-redux";
import {
  requiredFields,
  requiredFieldsImgRec,
} from "../../helper/dashboard/productHelper";
import {
  setproductTableData,
  setImgRecTableData,
} from "../../../store/dashboard/productTableSlice";
import trackActivity from "../../helper/dashboard/trackActivity";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import "dotenv";

const UploadModal = ({
  isOpen,
  onClose,
  flag,
  newRow,
  setNewRow,
  handleFile,
  user,
  onFileUpload,
  handleDropFile,
  handleDragOverFile,
  isSelected,
}) => {
  const dispatch = useDispatch();
  const [isTableDataVisible, setIsTableDataVisible] = useState(false);
  const [isValidFile, setIsValidFile] = useState("");
  const [oauthToken, setOauthToken] = useState("");
  const [isValidFilesnackbarOpen, setIsValidFilesnackbarOpen] = useState(false);
  const [windowSize, setWindowSize] = useState(800);
  const userState = useSelector((state) => state.user);
  const brandIds = userState?.brandIdList;
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openPicker, authResponse] = useDrivePicker();
  const [isLoading, setIsLoading] = useState(false);

  const authenticateUser = () => {
    return new Promise((resolve, reject) => {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_GSPANN}`,
        scope: "https://www.googleapis.com/auth/drive.readonly",
        callback: (response) => {
          if (response.access_token) {
            setOauthToken(response.access_token);
            resolve(response.access_token);
          } else {
            reject("Failed to fetch OAuth token");
          }
        },
      });

      client.requestAccessToken();
    });
  };

  const handleOpenPicker = async () => {
    const token = await authenticateUser();
    // Open the picker only after the OAuth token is set
    if (!token) {
      console.log("OAuth token is not set yet.");
      return;
    }

    setIsLoading(true);
    openPicker({
      clientId: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID_GSPANN}`,
      developerKey: `${process.env.NEXT_PUBLIC_GOOGLE_DEVELOPER_KEY_GSPANN}`,
      viewId: "SPREADSHEETS",
      token: token,
      showUploadView: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: async (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        } else if (data.action === "picked") {
          const file = data.docs[0]; // Selected file
          const sheetId = file.id;

          // Fetch the file using Google Drive API to get MIME type
          fetch(
            `https://www.googleapis.com/drive/v3/files/${sheetId}?fields=id,name,mimeType`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Correct token passed here
              },
            }
          )
            .then((response) => response.json())
            .then((fileInfo) => {
              if (
                fileInfo.mimeType === "application/vnd.google-apps.spreadsheet"
              ) {
                // Export Google Sheets file to XLSX
                fetch(
                  `https://www.googleapis.com/drive/v3/files/${sheetId}/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                )
                  .then((response) => response.blob())
                  .then((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const arrayBuffer = reader.result;
                      const data = new Uint8Array(arrayBuffer);
                      const workbook = XLSX.read(data, { type: "array" });
                      const sheetName = workbook.SheetNames[0];
                      const worksheet = workbook.Sheets[sheetName];
                      const excelData = XLSX.utils.sheet_to_json(worksheet);

                      const processedData = processExcelData(
                        excelData,
                        isSelected
                      );

                      const allKeys = Array.from(
                        new Set(
                          processedData.flatMap((item) => Object.keys(item))
                        )
                      );

                      const requiredFieldsList =
                        isSelected === "image"
                          ? Object.values(requiredFieldsImgRec)
                          : Object.keys(requiredFields);

                      // Validate that all required fields are present
                      const firstMismatchedField = requiredFieldsList.find(
                        (field) => !allKeys.includes(field)
                      );

                      if (!firstMismatchedField) {
                        // All required fields are present
                        dispatch(
                          isSelected === "product"
                            ? setproductTableData([...processedData, ...newRow])
                            : setImgRecTableData([...processedData, ...newRow])
                        );

                        setNewRow([...processedData, ...newRow]);

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
                      } else {
                        // Field mismatch found
                        activateSnackbar(
                          `Missing or incorrect column name "${firstMismatchedField}"`,
                          "error"
                        );
                      }
                    };
                    reader.readAsArrayBuffer(blob);
                  })
                  .catch((error) => {
                    console.error("Error exporting Google Sheet:", error);
                  });
              } else {
                // Handle non-Google Sheets file (e.g., .xlsx)
                fetch(
                  `https://www.googleapis.com/drive/v3/files/${sheetId}?alt=media`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                )
                  .then((response) => response.blob())
                  .then((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const arrayBuffer = reader.result;
                      const data = new Uint8Array(arrayBuffer);
                      const workbook = XLSX.read(data, { type: "array" });
                      const sheetName = workbook.SheetNames[0];
                      const worksheet = workbook.Sheets[sheetName];
                      const excelData = XLSX.utils.sheet_to_json(worksheet);

                      const processedData = processExcelData(
                        excelData,
                        isSelected
                      );

                      const allKeys = Array.from(
                        new Set(
                          processedData.flatMap((item) => Object.keys(item))
                        )
                      );

                      const requiredFieldsList =
                        isSelected === "image"
                          ? Object.values(requiredFieldsImgRec)
                          : Object.keys(requiredFields);

                      // Validate that all required fields are present
                      const firstMismatchedField = requiredFieldsList.find(
                        (field) => !allKeys.includes(field)
                      );

                      if (!firstMismatchedField) {
                        // All required fields are present
                        dispatch(
                          isSelected === "product"
                            ? setproductTableData([...processedData, ...newRow])
                            : setImgRecTableData([...processedData, ...newRow])
                        );

                        setNewRow([...processedData, ...newRow]);

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
                      } else {
                        // Field mismatch found
                        activateSnackbar(
                          `Missing or incorrect column name "${firstMismatchedField}"`,
                          "error"
                        );
                      }
                    };
                    reader.readAsArrayBuffer(blob);
                  })
                  .catch((error) => {
                    console.error("Error downloading file:", error);
                  });
              }
            })
            .catch((error) =>
              console.error("Error fetching file metadata:", error)
            )
            .finally(() => {
              setIsLoading(false);
            });
        }
      },
    });
    onClose();
  };

  // Helper function to check if all required fields are present in excel data

  const isValidFileUpload = (excelData, requiredFields) => {
    return excelData.every((item) =>
      requiredFields.every((field) => item[field])
    );
  };

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

  const handleFileChange = (event) => {
    let isProductPage = flag === "productsPage";

    if (!isProductPage) {
      handleFile(event);
      onClose();
      return;
    }

    const file = event.target.files[0];
    const importedFileName = file?.name;

    if (isProductPage) {
      onFileUpload(importedFileName);
    }

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

        //dispatch data for both prod & img
        dispatch(
          isSelected === "product"
            ? setproductTableData([...processedData, ...newRow])
            : setImgRecTableData([...processedData, ...newRow])
        );

        if (isProductPage) {
          setNewRow([...processedData, ...newRow]);
          // dispatch(setproductTableData([...processedData, ...newRow]));
        } else {
          // Upload excel file to slice if not product page and no mismatched fields
          handleFile(event);
        }
      } else {
        activateSnackbar(
          `Missing or incorrect column name "${firstMismatchedField}"`,
          "error"
        );
        event.target.value = ""; // Clear the file input to allow re-upload when error occurs
        return;
      }

      // Validate the file content
      if (!isValidFileUpload(excelData, requiredFieldsList)) {
        activateSnackbar("Enter all the mandatory fields data", "error");
        return;
      }
    };
    reader?.readAsArrayBuffer(file);

    onClose();
  };

  const handleBoxClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleGetSavedDocs = () => {
    setIsTableDataVisible(true);
  };

  const handleClose = () => {
    setIsTableDataVisible(false); // Set isTableDataVisible to false
    onClose(); // Close the modal
  };

  const handleSnackbarClose = () => {
    setIsValidFilesnackbarOpen(false);
  };

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

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
  });

  return (
    <>
      {isLoading && (
        <CircularProgress
          sx={{
            display: "block",
            margin: "0 auto",
          }}
        />
      )}
      <Modal
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
        className="document-modal"
        keepMounted
        open={isOpen}
        onClose={handleClose}
      >
        {/* Upload Container */}
        <Box
          className="upload-container"
          sx={{
            width: {
              xs: "87%",
              sm: "40vw",
            },
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={9} sm={10} md={11}>
              <Typography
                variant="h3"
                sx={{
                  color: "#223B64",
                }}
              >
                {flag !== "enhancePage"
                  ? "Import Products"
                  : "Import Documents"}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={handleClose}
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
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                pl: "8px",
                pb: "10px",
              }}
            >
              {!isTableDataVisible ? (
                <Typography
                  sx={{
                    color: "#777777",
                    fontSize: "14px",
                  }}
                >
                  Import your data from spreadsheets or saved documents.
                </Typography>
              ) : (
                <Typography
                  sx={{
                    color: "#777777",
                    // fontSize: "14px",
                  }}
                >
                  Choose the document to import.
                </Typography>
              )}
            </Grid>
            {!isTableDataVisible ? (
              <Grid
                className="file-io-section"
                item
                xs={12}
                sx={{
                  flexDirection: {
                    xs: "column",
                    sm: "column",
                    md: "column",
                  },
                  pl: "0px !important",
                  ml: "1px !important",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                      md: "row",
                    },
                    mr: {
                      md: "60px !important",
                    },
                    ml: {
                      md: "60px !important",
                    },
                    width: "80%",
                    overflow: "hidden",
                  }}
                >
                  {/* csv or excel file */}
                  <Box
                    className="io-box "
                    onClick={handleBoxClick}
                    sx={{
                      mb: {
                        xs: "10px !important",
                      },
                      mr: {
                        sm: "5px",
                      },
                      height: {
                        xs: "126px !important",
                        sm: "150px !important",
                        md: "150px !important",
                      },
                    }}
                  >
                    <Image
                      color="gray"
                      priority={true}
                      src="/dashboard/excel.svg"
                      width="25"
                      height="25"
                      alt="excel-icon"
                    />
                    <Typography
                      // className="io-box-header"
                      sx={{
                        color: "#5E5E5E",
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "5px",
                      }}
                    >
                      Excel
                    </Typography>
                    <Typography
                      // className="io-box-content"
                      sx={{
                        color: "#777777",
                        fontSize: "12px",
                      }}
                    >
                      Import your product data from Excel file using your own
                      data format or the ones provided by us.
                    </Typography>
                    <input
                      id="fileInput"
                      type="file"
                      accept=".xls, .xlsx,"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </Box>

                  {/* google sheets */}
                  <Box
                    className="io-box"
                    onClick={handleOpenPicker}
                    sx={{
                      mb: {
                        xs: "10px !important",
                      },
                      mr: {
                        sm: "5px",
                      },
                      height: {
                        xs: "126px !important",
                        sm: "150px !important",
                        md: "150px !important",
                      },
                    }}
                  >
                    <Image
                      color="gray"
                      priority={true}
                      src="/dashboard/drive.svg"
                      width="25"
                      height="25"
                    />
                    <Typography className="io-box-header">
                      Google Sheets
                    </Typography>
                    <Typography className="io-box-content">
                      Import your product data from CSV or Excel files using
                      your own data format or the ones provided by us.
                    </Typography>
                  </Box>

                  {/* Saved Docs */}
                  {flag !== "enhanceTaxonomy" && (
                    <Box
                      className="io-box"
                      onClick={handleGetSavedDocs}
                      sx={{
                        mb: {
                          xs: "10px !important",
                        },
                        mr: {
                          sm: "5px",
                        },
                        height: {
                          xs: "126px !important",
                          sm: "150px !important",
                          md: "150px !important",
                        },
                      }}
                    >
                      <Image
                        color="gray"
                        priority={true}
                        src="/dashboard/folder_blue.svg"
                        width="25"
                        height="25"
                        alt="folder-icon"
                      />
                      <Typography
                        // className="io-box-header"
                        sx={{
                          color: "#5E5E5E",
                          fontWeight: "bold",
                          fontSize: "16px",
                          marginBottom: "5px",
                        }}
                      >
                        Saved Docs
                      </Typography>
                      <Typography
                        // className="io-box-content"
                        sx={{
                          color: "#777777",
                          fontSize: "12px",
                        }}
                      >
                        Import your product data from Excel files using your own
                        data format or the ones provided by us.
                      </Typography>
                    </Box>
                  )}
                </Box>

                {windowSize >= 768 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      mt: "15px !important",
                      width: "80%",
                    }}
                  >
                    <Box
                      className="io-box"
                      sx={{
                        mb: {
                          xs: "10px !important",
                        },
                        border: "1px dashed #001B3F",
                        bgcolor: "#E2E2E2 !important",
                        height: {
                          xs: "126px !important",
                          sm: "150px !important",
                          md: "150px !important",
                        },
                        width: "100%",
                      }}
                      onDrop={handleDropFile}
                      onDragOver={handleDragOverFile}
                    >
                      <Image
                        color="gray"
                        priority={true}
                        src="/dashboard/drop_icon.svg"
                        width="25"
                        height="25"
                        alt="excel-icon"
                      />
                      <Typography className="io-box-header">
                        Drag and Drop
                      </Typography>
                      <Typography className="io-box-content">
                        Import your product data dropping your files here.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Grid>
            ) : (
              <Grid
                className="table-data-importer"
                item
                xs={12}
                sx={{
                  padding: {
                    xs: "0 0 0 6px !important",
                  },
                }}
              >
                <DocumentTableDataImporter
                  activateSnackbarModal={activateSnackbar}
                  isSelected={isSelected}
                  user={user}
                  onCloseModal={() => handleClose()}
                  flag={flag}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={isValidFilesnackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>Error</AlertTitle>
          {isValidFile}
        </Alert>
      </Snackbar>

      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </>
  );
};
export default UploadModal;
