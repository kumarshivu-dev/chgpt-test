import { createSlice } from "@reduxjs/toolkit";
const initialState = {
 
  selectedProducts: [],
 
};

const selectedProductsSlice = createSlice({
  name: "selectedProducts",
  initialState,
  reducers: {
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },
  },
});

export const {
  setSelectedProducts,
} = selectedProductsSlice.actions;
export default selectedProductsSlice.reducer;