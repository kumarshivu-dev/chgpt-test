import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null
};

const productReadinessSlice = createSlice({
  name: 'productReadiness',
  initialState,
  reducers: {
    setProductData: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const { setProductData } = productReadinessSlice.actions;

export default productReadinessSlice.reducer;