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
  Button,
  CircularProgress,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import Image from "next/image";
import { useRouter } from "next/router";
import "../product/product.css";
import { useEffect, useState } from "react";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import axios from "axios";
import { useSelector } from "react-redux";
import trackActivity from "../../helper/dashboard/trackActivity";
import { showToast } from "../../../context/ToastContext";

const AddFileModal = ({
  isOpen,
  onClose,
  user,
  handleClose,
  complianceFiles,
  fetchComplianceFiles,
  snackbarState,
  setSnackbarState,
  ragModel,
  setTaskId,
}) => {
  const [loading, setLoading] = useState(false);
  const [forAllBrands, setForAllBrands] = useState(true);
  const [snackbarModalState, setSnackbarModalState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const userState = useSelector((state) => state.user);

  const isDesktop = useMediaQuery("(min-width:600px)");

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarModalState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const handleFileChange = (event) => {
    if (ragModel) {
      const file = event.target.files[0];
      if (file) {
        // send file to api
        sendFileToAPI(file);
      }
    } else {
      setSnackbarState({
        open: true,
        message: "Please set a RAG Chunking Type",
        severity: "error",
      });
    }
  };
  const normalizeFilename = (filename) =>
    filename.replace(/ /g, "_").toLowerCase();

  const sendFileToAPI = async (file) => {
    const samenamecheck = complianceFiles.some(
      (fileItem) =>
        fileItem.status === "COMPLETED" &&
        normalizeFilename(fileItem.filename) === normalizeFilename(file.name)
    );
    if (samenamecheck) {
      showToast(
        "A file with the same name already exists. If the content is unchanged, there's no need to re-upload. If it's updated, please use a different filename.",
        "warning"
      );
      handleClose();
      return;
    }
    setLoading(true);
    const formData = new FormData();

    formData.append("files", file);
    formData.append("rag_text_splitter", ragModel);
    formData.append("for_all_brands", forAllBrands);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/compliance/file/upload`,
        formData,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      if (response?.status === 200) {
        setLoading(false);
        setSnackbarState({
          open: true,
          message: response?.data?.message,
          severity: "success",
        });
        const taskId = response?.data?.task_id;
        setTaskId(taskId);
        fetchComplianceFiles();
        handleClose();
      }
    } catch (error) {
      console.log("error during compliance upload:", error);
      setLoading(false);
      if (error?.response?.status === 400) {
        setSnackbarState({
          open: true,
          message: error?.response?.data?.message,
          severity: "error",
        });
      } else {
        setSnackbarState({
          open: true,
          message: error.response?.data || error.message,
          severity: "error",
        });
      }
      handleClose();
    }
  };

  const handleBoxClick = () => {
    if (ragModel) {
      document.getElementById("fileInput").click();
    } else {
      setSnackbarState({
        open: true,
        message: "Please set a RAG Chunking Type",
        severity: "error",
      });
    }
  };

  const handleDrop = (event) => {
    if (ragModel) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        sendFileToAPI(file);
      }
    } else {
      setSnackbarState({
        open: true,
        message: "Please set a RAG Chunking Model",
        severity: "error",
      });
    }
  };

  const handleDragEnter = () => {
    const dropHereEl = document.getElementsByClassName("drop-here")[0];
    dropHereEl.style.display = "block";
  };

  const handleDragLeave = () => {
    const dropHereEl = document.getElementsByClassName("drop-here")[0];
    dropHereEl.style.display = "none";
  };
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <Modal
        className="add-file-modal"
        keepMounted
        open={isOpen}
        onClose={handleClose}
      >
        {/* Upload Container */}
        <Box
          className="upload-container"
          sx={{
            width: {
              xs: "85%",
              sm: "30vw",
            },
            padding: "15px !important",
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
                Import File
              </Typography>
            </Grid>
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
              <Typography
                sx={{
                  color: "#777777",
                }}
              >
                Choose the Compliance file to import.
              </Typography>
              {loading && <CircularProgress className="loader" />}
            </Grid>
            <Grid className="add-modal-drop-grid">
              <Box
                className="add-modal-drop-box"
                onDrop={isDesktop ? handleDrop : null}
                onDragOver={
                  isDesktop ? (event) => event.preventDefault() : null
                } // Needed to allow the drop event
                onDragEnter={isDesktop ? handleDragEnter : null}
                onDragLeave={isDesktop ? handleDragLeave : null}
              >
                <Button
                  variant="contained"
                  className="upload-file-btn"
                  onClick={handleBoxClick}
                >
                  <FileDownloadOutlinedIcon />
                  Import File
                </Button>
                {isDesktop && (
                  <>
                    <Typography variant="body2" className="drag-here">
                      Or Drag a file here
                    </Typography>
                    <Typography className="drop-here" variant="body2">
                      Drop here
                    </Typography>
                  </>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf, .txt, .docx"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* Error handling component */}
      <SnackbarNotifier
        open={snackbarModalState.open}
        onClose={() =>
          setSnackbarModalState({ ...snackbarModalState, open: false })
        }
        message={snackbarModalState.message}
        severity={snackbarModalState.severity}
      />
    </>
  );
};
export default AddFileModal;
