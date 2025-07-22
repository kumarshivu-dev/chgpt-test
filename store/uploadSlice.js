import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedFile: null,
  paid: false,
  premium: false,
  imageRec: false,
  seo: false,
  isImageRec: false
};

const uploadSlice = createSlice({
  name: "uploadpage",
  initialState,
  reducers: {
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    setPaid: (state, action) => {
      state.paid = action.payload;
    },
    setSeo: (state, action) => {
      state.seo = action.payload;
    },
    setPremium: (state, action) => {
      state.premium = action.payload;
    },
    setImageRec: (state, action) => {
      state.imageRec = action.payload;
    },
    setIsImageRec: (state, action) => {
      state.isImageRec = action.payload;
    },
  },
});

export const {
  setSelectedFile,
  setPaid,
  setPremium,
  setImageRec,
  setSeo,
  setIsImageRec,
} = uploadSlice.actions;

export default uploadSlice.reducer;
