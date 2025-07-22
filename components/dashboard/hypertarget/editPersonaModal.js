import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import "../product/product.css";
import axios from "axios";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../context/ToastContext";

const EditPersonaModal = ({
  user,
  isOpen,
  editData,
  onCancel,
  onTableUpdate,
  personaData,
  currentRowIndex,
}) => {
  const [personaTextArea, setPersonaTextArea] = useState(
    editData?.persona || ""
  );
  const [keywordsTextArea, setKeywordsTextArea] = useState(
    editData?.keywords || []
  );
  const [minLengthArea, setMinlengthArea] = useState(editData?.minLength || "");
  const [maxLengthArea, setMaxlengthArea] = useState(editData?.maxLength || "");
  const [descriptionArea, setDescriptionArea] = useState(
    editData?.characteristics
  );
  const [currIndex, setCurrIndex] = useState(currentRowIndex);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const userState = useSelector((state) => state?.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;

  const handleTextFieldChange = (e) => {
    setPersonaTextArea(e.target.value);
  };
  const handleKeywordsTextFieldChange = (e) => {
    const comakeywords = e.target.value;
    const keywordsArray = comakeywords.split(",");
    setKeywordsTextArea(keywordsArray);
  };
  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };
  const handleDescriptionTextFieldChange = (e) => {
    setDescriptionArea(e.target.value);
  };
  const handleMinLengthChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setMinlengthArea(value);
    }
  };
  const handleMaxLengthChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setMaxlengthArea(value);
    }
  };
  const handleSubmit = async () => {
    const minLength = parseInt(minLengthArea, 10);
    const maxLength = parseInt(maxLengthArea, 10);

    // Perform the validation checks
    if (minLength < 50) {
      showToast("Minimum length must be 50 or greater.", "warning");
      return;
    }

    if (maxLength < 100) {
      showToast("Maximum length must be 100 or greater.", "warning");
      return;
    }

    if (minLength > maxLength) {
      showToast(
        "Minimum length should be less than maximum length.",
        "warning"
      );
      return;
    }

    try {
      const persona_id = editData?.id;
      const data = {
        id: persona_id,
        persona: personaTextArea,
        characteristics: descriptionArea,
        keywords: keywordsTextArea,
        minLength: minLengthArea,
        maxLength: maxLengthArea,
        brandId: brandSpecification?.brandId,
        brandSpecific: brandSpecification?.brandSpecific,
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}/dashboard/hypertarget/edit/persona`,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      if (response?.data?.status === true) {
        showToast("Persona details updated successfully");
        onTableUpdate();
      } else {
        showToast(
          response?.data?.errorMessage || "Failed to edit persona.",
          "error"
        );
      }
    } catch (error) {
      showToast("Error while editing persona. Please try again.", "error");
    }
    handleCloseEditModal();
  };

  const handleCloseEditModal = () => {
    setTimeout(onCancel, 400);
  };

  const handlePrev = () => {
    const new_ind = currIndex - 1 < 0 ? 0 : currIndex - 1;
    const new_data = personaData[new_ind];

    setPersonaTextArea(new_data?.persona);
    setKeywordsTextArea(new_data?.keywords);
    setDescriptionArea(new_data?.characteristics);
    setCurrIndex(new_ind);
  };
  const handleNext = () => {
    const new_ind = Math.min(parseInt(currIndex) + 1, personaData.length - 1);
    const new_data = personaData[new_ind];
    setPersonaTextArea(new_data?.persona);
    setKeywordsTextArea(new_data?.keywords);
    setDescriptionArea(new_data?.characteristics);
    setCurrIndex(new_ind);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onCancel}
        className=""
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
          },
          sx: {
            maxWidth: { sm: "700px", md: "700px" },
            width: { sm: "700px", md: "700px" },
            borderRadius: "6px",
            overflowY: "unset",
          },
        }}
      >
        {" "}
        {/* <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle sx={{ fontSize: "16px", fontWeight: 700 }}>
            Persona Edit
          </DialogTitle>
          <Box sx={{ padding: "16px 24px" }}>
            <Button
              sx={{
                bgcolor: "#001b3f",
                minWidth: "10px",
                mr: "10px",
                "&:hover": {
                  backgroundColor: "#001b3f !important",
                },
              }}
              onClick={handlePrev}
            >
              <ArrowBackIosNewIcon sx={{ color: "white !important" }} />
            </Button>
            <Button
              sx={{
                bgcolor: "#001b3f",
                minWidth: "10px",
                "&:hover": {
                  backgroundColor: "#001b3f !important",
                },
              }}
              onClick={handleNext}
            >
              <ArrowForwardIosIcon sx={{ color: "white !important" }} />
            </Button>
          </Box>
        </Box> */}
        <DialogTitle sx={{ fontSize: "16px", fontWeight: 700 }}>
          Edit Persona
        </DialogTitle>
        {/* <Box className="divide-header"></Box> */}
        <DialogContent>
          <Box className="text-field-style">
            <InputLabel className="popup-lable">
              <span style={{ fontWeight: "600", color: "black" }}>
                Persona Name{" "}
              </span>
              <span style={{ color: "red" }}>*</span>
            </InputLabel>
            <TextareaAutosize
              margin="dense"
              className="table-textarea"
              value={personaTextArea}
              id="keywords"
              name="keywords"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleTextFieldChange}
              disabled={editData?.persona === "Default"}
            />
          </Box>
          <Box className="text-field-style">
            <InputLabel className="popup-lable">
              <span style={{ fontWeight: "600", color: "black" }}>
                Keywords{" "}
              </span>
            </InputLabel>
            <TextareaAutosize
              margin="dense"
              className="table-textarea"
              value={keywordsTextArea}
              id="keywords"
              name="keywords"
              type="text"
              fullWidth
              variant="standard"
              onChange={handleKeywordsTextFieldChange}
            />
          </Box>

          <Box className="text-field-style">
            <InputLabel className="popup-lable">
              <span style={{ fontWeight: "600", color: "black" }}>
                Persona Description{" "}
              </span>
              <span style={{ color: "red" }}>*</span>
            </InputLabel>
            <TextareaAutosize
              margin="dense"
              className="table-textarea"
              type="text"
              variant="standard"
              id="productDescription"
              name="product_description"
              value={descriptionArea}
              onChange={handleDescriptionTextFieldChange}
              disabled={editData?.persona === "Default"}
              fullWidth
            />
          </Box>

          <Box className="text-field-style">
            <InputLabel className="popup-lable">
              <span style={{ fontWeight: "600", color: "black" }}>
                Minimum length{" "}
              </span>
              <span style={{ color: "red" }}>*</span>
            </InputLabel>
            <TextareaAutosize
              margin="dense"
              className="table-textarea"
              type="text"
              variant="standard"
              id="productDescription"
              name="product_description"
              value={minLengthArea}
              onChange={handleMinLengthChange}
              fullWidth
            />
          </Box>
          <Box className="text-field-style">
            <InputLabel className="popup-lable">
              <span style={{ fontWeight: "600", color: "black" }}>
                Maximum Length{" "}
              </span>
              <span style={{ color: "red" }}>*</span>
            </InputLabel>
            <TextareaAutosize
              margin="dense"
              className="table-textarea"
              type="text"
              variant="standard"
              id="productDescription"
              name="product_description"
              value={maxLengthArea}
              onChange={handleMaxLengthChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button variant="outlined" onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              personaTextArea == "" ||
              descriptionArea == "" ||
              minLengthArea == "" ||
              maxLengthArea == ""
            }
            variant="contained"
            type="submit"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </>
  );
};

export default EditPersonaModal;
