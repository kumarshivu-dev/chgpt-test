import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Modal,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedBrandFile } from "/store/brandVoiceSlice";
import { useToast } from "../../../context/ToastContext";
import axios from "axios";
import StyledCircularProgress from "/utils-ui/StyledCircularProgress";
import {
  FETCH_EXISTING_BRAND_VOICE_FILE,
  UPLOAD_BRAND_VOICE_FILE,
  DELETE_BRAND_VOICE_FILE,
} from "/utils/apiEndpoints";

const BrandVoiceFileUploadModal = ({ open, onClose, user }) => {
  // Hooks
  const { showToast } = useToast();
  const dispatch = useDispatch();

  // State
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const brandVoiceState = useSelector((state) => state.brandvoice);
  const [showLoader, setShowLoader] = useState(false);

  // Fetch existing file on mount
  useEffect(() => {
    const fetchExistingFile = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}${FETCH_EXISTING_BRAND_VOICE_FILE}`,
          {
            headers: { Authorization: user?.id_token },
          }
        );
        setExistingFile(res?.data?.file_name);
        dispatch(setSelectedBrandFile(res?.data?.file_url));
      } catch (err) {
        if (err?.response?.data === "Unauthorized") signOut();
      }
    };

    fetchExistingFile();
  }, []);

  const handleBrandVoiceFileUpload = async () => {
    if (!uploadedFile) return;
    setShowLoader(true);
    const formData = new FormData();
    formData.append("brandVoiceFile", uploadedFile);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${UPLOAD_BRAND_VOICE_FILE}`,
        formData,
        {
          headers: { Authorization: user?.id_token },
        }
      );
      showToast("File uploaded successfully", "success");
      setExistingFile(uploadedFile?.name);
      setShowLoader(false);
      dispatch(setSelectedBrandFile(res?.data?.file_url));
      handleClose();
    } catch (err) {
      showToast("Error Uploading the file", "error");
      setShowLoader(false);
      if (err?.response?.data === "Unauthorized") signOut();
    }
  };

  const handleBrandVoiceFileDelete = async () => {
    setShowLoader(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}${DELETE_BRAND_VOICE_FILE}`,
        {
          headers: { Authorization: user?.id_token },
        }
      );
      showToast("File Deleted Successfully", "success");
      dispatch(setSelectedBrandFile(null));
      setExistingFile(null);
      handleClose();
      setShowLoader(false);
    } catch (err) {
      showToast("Error deleting the File", "error");
      setShowLoader(false);
    }
  };

  // Handlers
  const handleFileChange = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setUploadedFile(file);
      setExistingFile(null);
      event.target.value = "";
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);

    const file = event?.dataTransfer?.files?.[0];
    if (file) {
      setUploadedFile(file);
      setExistingFile(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleClose = () => {
    setUploadedFile(null);
    onClose();
  };

  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
    >
      <Box className="modal-box">
        <Grid container justifyContent="flex-end">
          <IconButton className="icon-btn" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Grid>

        <Grid
          className="par-grid"
          container
          sx={{ padding: 2, minHeight: { xs: "45vh", sm: "55vh" } }}
        >
          {showLoader && <StyledCircularProgress />}
          <Grid
            className="upload-grid"
            item
            xs={12}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Box
              className="upload-box"
              sx={{
                textAlign: "center",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                color="gray"
                priority
                src="/dashboard/drop_icon.svg"
                width={25}
                height={25}
                alt="excel-icon"
              />
              <Typography variant="h6">Drag and Drop</Typography>
              <Typography variant="body2">OR</Typography>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                id="file-upload"
                hidden
              />
              <label htmlFor="file-upload">
                <Box
                  sx={{
                    background: "#f0f0f0",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    textAlign: "center",
                    border: "1px dashed #ccc",
                    display: "inline-block",
                  }}
                >
                  Click to Upload your file
                </Box>
              </label>

              <Typography variant="caption">
                Upload your document in .pdf, .doc, .docx only
              </Typography>

              {uploadedFile?.name || existingFile ? (
                <Typography sx={{ mt: 1 }}>
                  Selected File: {uploadedFile?.name || existingFile}
                </Typography>
              ) : null}
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            padding: 2,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            // onClick={handleBrandVoiceFileUpload}
            onClick={()=>handleBrandVoiceFileUpload()}
            disabled={!uploadedFile}
            sx={{ width: "100px" }}
          >
            Save
          </Button>
          <Button
          sx={{
            background: "#EE071B",
            width: "100px",
            ":hover": {
              background: "#ee071b",
            },
          }}
            variant="contained"
            onClick={()=>handleBrandVoiceFileDelete()}
            disabled={!existingFile}
          >
            Delete
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BrandVoiceFileUploadModal;
