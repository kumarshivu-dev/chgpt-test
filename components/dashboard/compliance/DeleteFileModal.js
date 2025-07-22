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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import "../product/product.css";
import { useEffect, useState } from "react";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import axios from "axios";
import { useSelector } from "react-redux";
import trackActivity from "../../helper/dashboard/trackActivity";

const DeleteFileModal = ({
  isOpen,
  onClose,
  user,
  setSnackbarState,
  selected,
  setSelected,
  fetchComplianceFiles,
}) => {
  const [snackbarModalState, setSnackbarModalState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const userState = useSelector((state) => state.user);
  const brandIds = userState?.brandIdList;

  const fileNames = selected.map((item) => item?.filename).join(", ");

  const data = {
    files: selected.map((item) => item?.aws_file_name),
  };

  const handleDelete = () => {
    setLoading(true);
    axios
      .post(
        process.env.NEXT_PUBLIC_BASE_URL + "/compliance/file/delete",
        data,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      )
      .then((res) => {
        if (res?.status === 200) {
          setLoading(false);
          setSnackbarState({
            open: true,
            message: res?.data,
            severity: "success",
          });
          onClose();
          fetchComplianceFiles();
          setSelected([]);
          trackActivity(
            "DELETE_COMPLIANCE", // action
            fileNames, // filenames (array of deleted files)
            user, // user
            "", // editor_email (optional or empty string)
            userState?.userInfo?.orgId, // orgId
            null, // changed_role (optional or null)
            null, // number_of_products (optional or null)
            null, // changed_chunking_type (optional or null)
            brandIds // brandIds (optional or null)
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        setSnackbarState({
          open: true,
          message: err?.response?.data ? err?.response?.data : err?.message,
          severity: "error",
        });
        onClose();
      });
  };
  return (
    <>
      <Dialog
        className="delete-alert-box"
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          background: "#2D131640",
        }}
      >
        {loading && (
          <CircularProgress
            sx={{ position: "absolute", top: "45%", left: "45%" }}
          />
        )}
        <DialogTitle
          sx={{
            color: "#C00011",
          }}
          id="alert-dialog-title"
        >
          Delete Compliance Files ?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            Are you sure you want to delete these Compliance files? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              borderRadius: "3px",
              color: "#000000",
              border: "1px solid #ABABAB",
              "&:hover": {
                border: "1px solid #ABABAB", // Same color as default state
              },
            }}
            variant="outlined"
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button
            sx={{
              borderRadius: "3px",
              border: "none",
              background: "#EE071B",
              ":hover": {
                background: "#ee071b",
                border: "none",
              },
            }}
            variant="contained"
            onClick={() => handleDelete()}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

export default DeleteFileModal;
