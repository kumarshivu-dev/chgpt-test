import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import "../../../app/dashboard/dashboard-style.css";
import { useSelector } from "react-redux";

const DeleteAcknowledgmentPersona = ({ onDeleteConfirmed, onCancel }) => {
  const documentState = useSelector((state) => state.documentTable);
  const selectedPersona = documentState?.selectedPersona;
  const isDefaultPersonaSelected = selectedPersona.some(
    (persona) => persona?.persona === "Default"
  );

  const [openDeleteAlert, setOpenDeleteAlert] = useState(true);

  const handleCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
    onCancel && onCancel();
  };

  const handleDeleteConfirmed = () => {
    onDeleteConfirmed && onDeleteConfirmed();
    // handleCloseDeleteAlert();
  };
  return (
    <>
      <Dialog
        className="delete-alert-box"
        open={openDeleteAlert}
        onClose={handleCloseDeleteAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          sx={{
            color: "#C00011",
          }}
          id="alert-dialog-title"
        >
          Delete Persona ?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#000000",
            }}
            id="alert-dialog-description"
          >
            {`Are you sure you want to delete the selected personas? ${
              isDefaultPersonaSelected
                ? "The default persona will be retained."
                : ""
            } This action is irreversible.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              borderRadius: "3px",
              color: "#000000",
              border: "1px solid #ABABAB",
              "&:hover": {
                border: "1px solid #ABABAB",
              },
            }}
            variant="outlined"
            onClick={() => handleCloseDeleteAlert()}
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
            onClick={() => handleDeleteConfirmed()}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAcknowledgmentPersona;
