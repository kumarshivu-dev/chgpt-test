import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import useDrivePicker from "react-google-drive-picker";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import "../product/product.css";
import axios from "axios";
import { requiredFields } from "../../helper/dashboard/productHelper";

const UploadDocModal = ({ user, isOpen, onClose, onUploadSuccess }) => {
  const [isValidFile, setIsValidFile] = useState("");
  const [isValidFilesnackbarOpen, setIsValidFilesnackbarOpen] = useState(false);

  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    openPicker({
      clientId:
        "974176577368-0sggsio2ou7529r1oki7ht2db4o0eqe3.apps.googleusercontent.com",
      developerKey: "AIzaSyC7phApDj2vEYk90ipJN4liHA7O47kwXCc",
      viewId: "DOCS",
      // token: token, // pass oauth token in case you already have one
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      // customViews: customViewsArray, // custom view
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          console.log("User clicked cancel/close button");
        }
        console.log(data);
      },
    });
  };

  const saveDocument = async (fileName, docData) => {
    const data = {
      filename: fileName,
      username: user.name,
      products: docData,
      type: "PRODUCT_DOCUMENT",
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + "/dashboard/save/products",
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      // console.log("response after save document: ", response);
      // Call the callback function after successful document upload
      onUploadSuccess();
    } catch (error) {
      console.error("Error while Saving Document", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet);
      excelData.map((item) => {
        item.id = uuidv4();
      });
      const keys = Object.keys(excelData[0]);
      const columnNameFormat = Object.keys(requiredFields);
      const firstMismatchedField = columnNameFormat.find(
        (value) => !keys.includes(value)
      );

      if (!firstMismatchedField) {
        saveDocument(file.name, excelData);
      } else {
        const errorMessage = `Missing or incorrect column name "${firstMismatchedField}"`;
        setIsValidFile(errorMessage);
        setIsValidFilesnackbarOpen(true);
      }
    };
    reader.readAsBinaryString(file);

    onClose();
  };

  const handleBoxClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleSnackbarClose = () => {
    setIsValidFilesnackbarOpen(false);
  };

  return (
    <>
      <Modal
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
        className="document-modal"
        keepMounted
        open={isOpen}
        onClose={onClose}
      >
        {/* Upload Container */}
        <Box className="upload-container-doc">
          <Grid container>
            <Grid item xs={11}>
              <Typography
                variant="h3"
                sx={{
                  color: "#223B64",
                }}
              >
                Import Document
              </Typography>
            </Grid>
            <Grid
              item
              xs={1}
              sx={{
                marginTop: "-10px",
                marginLeft: "-3x",
              }}
            >
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography
                sx={{
                  color: "#777777",
                  fontSize: "14px",
                }}
              >
                Import your data from spreadsheets.
              </Typography>
            </Grid>

            <Grid
              className="file-io-section"
              item
              xs={12}
              sx={{
                margin: "15px 0",
              }}
            >
              {/* csv or excel file */}
              <Box className="io-box" onClick={handleBoxClick}>
                <Image
                  color="gray"
                  priority={true}
                  src="/dashboard/excel.svg"
                  width="25"
                  height="25"
                  alt="excel-icon"
                />
                <Typography className="io-box-header">Excel</Typography>
                <Typography className="io-box-content">
                  Import your product data from Excel files using your own data
                  format or the ones provided by us.
                </Typography>
                <input
                  id="fileInput"
                  type="file"
                  accept=".xls, .xlsx"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </Box>

              {/* google sheets */}
              <Box className="io-box" onClick={handleOpenPicker}>
                <Image
                  color="gray"
                  priority={true}
                  src="/dashboard/drive.svg"
                  width="25"
                  height="25"
                />
                <Typography className="io-box-header">Google Sheets</Typography>
                <Typography className="io-box-content">
                  Import your product data from CSV or Excel files using your
                  own data format or the ones provided by us.
                </Typography>
              </Box>

              {/* Saved Docs */}
              {/* <Box
                className="io-box"
                // onClick={() => {
                //   router.push({
                //     pathname: "/dashboard/",
                //   });
                // }}
              >
                <Image
                  color="gray"
                  priority={true}
                  src="/dashboard/folder.svg"
                  width="25"
                  height="25"
                />
                <Typography className="io-box-header">Saved Docs</Typography>
                <Typography className="io-box-content">
                  Import your product data from CSV or Excel files using your
                  own data format or the ones provided by us.
                </Typography>
              </Box> */}
            </Grid>
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
    </>
  );
};

export default UploadDocModal;
