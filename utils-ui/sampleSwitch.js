import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const SampleSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      "& + .MuiSwitch-track": {
        boxShadow: "0px 5px 10px grey inset",
      },
      "& .MuiSwitch-thumb": {
        color: "#032148",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    color: "white",
  },
}));

export default SampleSwitch;
