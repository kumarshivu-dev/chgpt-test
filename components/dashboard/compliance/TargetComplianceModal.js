import {
  Slider,
  Modal,
  Box,
  Grid,
  Button,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TargetComplianceModal = ({
  isOpen,
  onClose,
  complianceSliderValue,
  setComplianceSliderValue,
}) => {
  const handleChange = (e, newValue) => {
    setComplianceSliderValue(newValue);
  };
  return (
    <>
      <Modal className="document-modal" open={isOpen} onClose={onClose}>
        <Box
          className="upload-container"
          sx={{
            width: {
              xs: "90%",
              sm: "30vw",
            },
            background: "white",
            margin: "0 auto",
          }}
        >
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={9} sm={10} md={12} sx={{ paddingBottom: 2 }}>
              <Typography
                variant="h3"
                sx={{
                  color: "#223B64",
                }}
              >
                Target Compliance Percentage
              </Typography>
              <Typography variant="body2">
                Tell us your target compliance percentage
              </Typography>
            </Grid>
            <Avatar
              onClick={onClose}
              sx={{
                position: "absolute",
                top: "-9%",
                right: "-4%",
                background: "rgba(0, 0, 0, 0.3)",
                cursor: "pointer",
              }}
            >
              <CloseIcon />
            </Avatar>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={8} sx={{ margin: "0 auto", padding: "30px 0" }}>
              <Slider
                value={complianceSliderValue}
                onChange={handleChange}
                valueLabelDisplay="auto"
                valueLabelFormat={complianceSliderValue + "%"}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Box sx={{ display: "flex", gap: "5px" }}>
                <Button variant="outlined">Cancel</Button>
                <Button variant="contained">Apply</Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default TargetComplianceModal;
