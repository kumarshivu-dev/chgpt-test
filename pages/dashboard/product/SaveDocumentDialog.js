import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const SaveDocumentDialog = ({
  open,
  onClose,
  onSubmit,
  defaultValue,
}) => {
  const [inputFileName, setInputFileName] = useState(defaultValue);

  useEffect(() => {
    setInputFileName(defaultValue);
  }, [defaultValue]);

  const handleChange = (event) => {
    setInputFileName(event.target.value); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedFileName = inputFileName;

    // Validate input
    if (/^\s*$/.test(updatedFileName)) {
      onSubmit(null, "File name can't be empty or contain only spaces.");
      return;
    }

    // Pass the updated file name back to the parent
    onSubmit(updatedFileName);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
        style: { width: "500px", borderRadius: "6px" },
      }}
    >
      <DialogTitle>Save Document</DialogTitle>
      <DialogContent>
        <DialogContentText>Document Name</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="fileName"
          name="fileName"
          label="Example_Product_Upload.xlsx"
          type="text"
          value={inputFileName}  
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button
          disableFocusRipple
          variant="contained"
          type="submit"
          sx={{
            "&.MUI-focusVisible": {
              boxShadow: "none",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDocumentDialog;