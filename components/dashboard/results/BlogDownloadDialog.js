import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

const BlogDownloadDialog = ({
  open,
  onClose,
  handleDownloadBlogText,
  handleDownloadBlogPdf,
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ style: { width: "500px" } }}
      >
        <DialogTitle variant="h6" fontWeight={"bold"}>
          Download Content
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            How would you like to download this content?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleDownloadBlogText();
              onClose();
            }}
          >
            Download Text
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleDownloadBlogPdf();
              onClose();
            }}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogDownloadDialog;
