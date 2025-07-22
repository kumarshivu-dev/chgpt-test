import { useState } from "react";
import {
  Typography,
  Box,
  Modal,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import "../../../product/product.css";
import axios from "axios";
import { useToast } from "../../../../../context/ToastContext";

const UploadChannelTaxonomyModal = ({
  user,
  isOpen,
  onClose,
  channelId,
  onFileUploaded,
}) => {
  const { showToast } = useToast();
  const handleUploadTaxonomy = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleTaxonomyUpload(file);
      onClose();
    }
  };

  const handleBoxClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleDragOverFile = (event) => {
    event.preventDefault(); // Prevent default behavior (e.g., opening the file in the browser)
  };

  const handleDropFile = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleTaxonomyUpload(file);
      onClose();
    }
  };

  const handleTaxonomyUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("channel_id", channelId);

    axios
      .post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/standalone/upload/channel/taxonomy`,
        formData,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      )
      .then(() => {
        showToast("File uploaded successfully", "success");
        // Pass the filename back to parent component
        onFileUploaded(file.name);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
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
                Upload Taxonomy
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
                  onChange={handleUploadTaxonomy}
                  style={{ display: "none" }}
                />
              </Box>
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
                <Typography className="io-box-header">Drag and Drop</Typography>
                <Typography className="io-box-content">
                  Import your product data dropping your files here.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default UploadChannelTaxonomyModal;
