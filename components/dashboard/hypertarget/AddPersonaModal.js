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
import { useDispatch, useSelector } from "react-redux";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import { VpnLock } from "@mui/icons-material";
import { set } from "lodash";
import { showToast } from "../../../context/ToastContext";
import { GET_VALIDATION_RULES } from "../../../constants/texts";
import { setSelectedPersona } from "../../../store/dashboard/documentTableSlice";

const AddPersonaModal = ({
  isOpen,
  onClose,
  user,
  onTableUpdate,
  personaData,
  // orgPersonaData
}) => {
  const [personaTextArea, setPersonaTextArea] = useState("");
  const [keywordsTextArea, setKeywordsTextArea] = useState([]);
  const [descriptionArea, setDescriptionArea] = useState("");
  const [minLengthArea, setMinlengthArea] = useState("");
  const [maxLengthArea, setMaxlengthArea] = useState("");
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const dispatch = useDispatch();

  const userState = useSelector((state) => state?.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;

  const handleTextFieldChange = (e) => {
    const TextValue = e.target.value;

    if (/^\s+$/.test(TextValue)) {
      return;
    }

    setPersonaTextArea(TextValue);
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
    const descriptionValue = e.target.value;
    if (/^\s+$/.test(descriptionValue)) {
      return;
    }
    setDescriptionArea(descriptionValue);
  };
  const handleMinTextFieldChange = (e) => {
    const value = e.target.value;
    if (/^\s+$/.test(value)) {
      return;
    }
    if (!isNaN(value) || value === "") {
      setMinlengthArea(value);
    }
  };
  const handleMaxTextFieldChange = (e) => {
    const value = e.target.value;
    if (/^\s+$/.test(value)) {
      return;
    }
    if (!isNaN(value) || value === "") {
      setMaxlengthArea(value);
    }
  };

  const handleClose = () => {
    setPersonaTextArea("");
    setKeywordsTextArea("");
    setDescriptionArea("");
    setMinlengthArea("");
    setMaxlengthArea("");
    onClose();
  };

  const handleSubmit = async () => {
    const isValidString = (value) => value && value.trim() !== "";

    if (
      !isValidString(personaTextArea) ||
      !isValidString(descriptionArea) ||
      !isValidString(minLengthArea) ||
      !isValidString(maxLengthArea)
    ) {
      activateSnackbar("Required fields cannot be empty", "warning");
      return;
    }
    const minLength = parseInt(minLengthArea, 10);
    const maxLength = parseInt(maxLengthArea, 10);

    // Perform the validation checks
    const validations = GET_VALIDATION_RULES(minLength, maxLength);
    for (const { condition, message } of validations) {
      if (condition) {
        showToast(message, "warning");
        return;
      }
    }


    // Construct payload
    const payload = {
      personas: [
        {
          persona: personaTextArea,
          keywords: Array.isArray(keywordsTextArea)
            ? keywordsTextArea
            : [keywordsTextArea], // Ensure it's always an array
          characteristics: descriptionArea,
          minLength: minLength,
          maxLength: maxLength,
        },
      ],
      brandSpecific: brandSpecification?.brandSpecific,
      brandId: brandSpecification?.brandId,
    };

    // handleCloseEditModal();

    const personaExists = personaData.some((p) => {
      return (
        p.persona.toLowerCase() === payload.personas[0].persona.toLowerCase()
      );
    });

    // const personaExistsOnOrg = orgPersonaData.some((p) => {
    //   return (
    //     p.persona.toLowerCase() === payload.personas[0].persona.toLowerCase()
    //   );
    // });

    if (personaExists) {
      activateSnackbar("Persona name already exists.", "error");
      return;
    }
    // else if (personaExistsOnOrg) {
    //   activateSnackbar("Persona name already exists for your org.", "error");
    //   return;
    // }
    handleClose();
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
          "/dashboard/hypertarget/add/persona",
        payload,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      if (response?.data?.status === true) {
        onTableUpdate();
        dispatch(setSelectedPersona([]))
        activateSnackbar("Persona added successfully.", "success");
      } else {
        onTableUpdate();
        
        activateSnackbar(
          response?.data?.errorMessage ||
            "Error while adding the persona. Please delete and try again.",
          "error"
        );
      }
    } catch (error) {
      onTableUpdate();
      console.error("Error while adding the persona", error);
      activateSnackbar(
        "Error while adding the persona. Please delete and try again.",
        "error"
      );
    } finally {
      setPersonaTextArea("");
      setKeywordsTextArea([]);
      setDescriptionArea("");
      setMinlengthArea("");
      setMaxlengthArea("");
    }
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className=""
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();

            // onClose();
          },
          sx: {
            maxWidth: { sm: "700px", md: "700px" },
            width: { sm: "700px", md: "700px" },
            borderRadius: "6px",
            overflowY: "unset",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "16px", fontWeight: 700 }}>
          New Persona
        </DialogTitle>
        <DialogContent>
          <Box className="text-field-style">
            <InputLabel className="popup-lable">
              {" "}
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
              fullWidth
            />
          </Box>
          <Box className="text-field-style">
            <InputLabel className="popup-lable">
              <span style={{ fontWeight: "600", color: "black" }}>
                Minimum Length{" "}
              </span>
              <span style={{ color: "red" }}>*</span>
            </InputLabel>
            <TextareaAutosize
              margin="dense"
              className="table-textarea"
              type="text"
              variant="standard"
              id="minLength"
              name="minimum_length"
              value={minLengthArea}
              onChange={handleMinTextFieldChange}
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
              id="maxLength"
              name="maximum_length"
              value={maxLengthArea}
              onChange={handleMaxTextFieldChange}
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
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={
              personaTextArea == "" ||
              descriptionArea == "" ||
              minLengthArea == "" ||
              maxLengthArea == ""
            }
            onClick={handleSubmit}
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

export default AddPersonaModal;
