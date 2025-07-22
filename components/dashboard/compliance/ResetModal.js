import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import axios from "axios";

const ResetModal = ({
  isOpen,
  onClose,
  user,
  setSnackbarState,
  ragModel,
  setRagModel,
  setRagModelBtn,
  setRagChunkingModalOpen,
  fetchComplianceFiles,
}) => {
  const handleResetCall = () => {
    setRagChunkingModalOpen(true);
    // axios
    //   .post(
    //     process.env.NEXT_PUBLIC_BASE_URL + "/compliance/splitter/reset",
    //     {
    //       splitter: ragModel,
    //     },
    //     {
    //       headers: {
    //         Authorization: user?.id_token,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     setSnackbarState({
    //       open: true,
    //       message: "RAG Chunking Type reset successfully",
    //       severity: "success",
    //     });
    //     setRagModel("");
    //     setRagModelBtn(true);
    //     onClose();
    //     fetchComplianceFiles();
    //   })
    //   .catch((error) => {
    //     setSnackbarState({
    //       open: true,
    //       message: error?.message,
    //       severity: "error",
    //     });
    //   });
  };
  return (
    <>
      <Dialog
        className="delete-alert-box"
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            The RAG Chunking type is currently set to {ragModel}. Are you sure
            you want to reset it? This would be applicable to all the compliance
            files.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleResetCall()}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetModal;
