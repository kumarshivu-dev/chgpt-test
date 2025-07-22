import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedBrandFile: null,
};

const brandVoiceSlice = createSlice({
  name: "brandvoice",
  initialState,
  reducers: {
    setSelectedBrandFile: (state, action) => {
      state.selectedBrandFile = action.payload;
    },
    
  },
});

export const {
setSelectedBrandFile
  
} = brandVoiceSlice.actions;

export default brandVoiceSlice.reducer;
