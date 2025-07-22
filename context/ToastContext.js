import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { Snackbar, Alert } from "@mui/material";

const ToastContext = createContext();

let showToastFn = () => {};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "info",
    duration: 4000,
  });

  const showToast = useCallback(
    (message, severity = "info", duration = 5000) => {
      setToast({ open: true, message, severity, duration });
    },
    []
  );

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    showToastFn = showToast;
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={toast.duration}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const showToast = (message, severity = "info", duration = 4000) => {
  showToastFn(message, severity, duration);
};

export const useToast = () => useContext(ToastContext);
