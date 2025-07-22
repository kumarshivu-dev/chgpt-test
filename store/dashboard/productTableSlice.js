import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productTableData: [],
  imgRecTableData: [],
  selectedTab: "product",
  chosenLanguage: "English",
};

const productEntriesSlice = createSlice({
  name: "productTable",
  initialState,
  reducers: {
    setproductTableData: (state, action) => {
      state.productTableData = action.payload;
    },
    setImgRecTableData: (state, action) => {
      state.imgRecTableData = action.payload;
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setChosenLanguage: (state, action) => {
      state.chosenLanguage = action.payload;
    },
  },
});

export const {
  setproductTableData,
  setImgRecTableData,
  setSelectedTab,
  setChosenLanguage,
} = productEntriesSlice.actions;

export default productEntriesSlice.reducer;
