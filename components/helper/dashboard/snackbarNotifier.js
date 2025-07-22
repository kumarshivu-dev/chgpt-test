import { Alert, Snackbar } from "@mui/material";

const SnackbarNotifier = ({
  open,
  onClose,
  message,
  severity,
  autoHideDuration,
}) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={10000}
      onClose={onClose}
    >
      <Alert severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotifier;
