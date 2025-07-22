import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { setChosenLanguage } from "../../../store/dashboard/productTableSlice";
const LanguageSelector = () => {
  const dispatch = useDispatch();
  const productTableStore = useSelector((state) => state.productEntries);

  const [selectedLanguage, setSelectedLanguage] = useState(productTableStore?.chosenLanguage); 

  const handleChange = (event) => {
    setSelectedLanguage(event.target.value);
    dispatch(setChosenLanguage(event.target.value));
  };

  const languages = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "Hindi" },
    { value: "French", label: "French" },
    { value: "Spanish", label: "Spanish" },
    { value: "German", label: "German" },
  ];

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ fontSize: "1rem" }}>
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={selectedLanguage}
          label="Language"
          onChange={handleChange}
          sx={{ fontSize: "1rem" }}
        >
          <MenuItem value="" disabled>
            <em>Please Choose</em>
          </MenuItem>
          {languages.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelector;
