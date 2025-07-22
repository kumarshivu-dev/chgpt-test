import { CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: "#032148",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex:'1000'
}));

export default StyledCircularProgress;
