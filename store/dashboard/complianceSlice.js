import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  complianceExportData: [],
  seoReadinessExport: [],
  mergedDataToExport: [],
};

const complianceSlice = createSlice({
  name: "compliance",
  initialState,
  reducers: {
    setComplianceData: (state, action) => {
      state.data = action.payload;
    },
    setComplianceExportData: (state, action) => {
      state.complianceExportData = action.payload;
    },
    setSeoReadinessExport: (state, action) => {
      state.seoReadinessExport = action.payload;
    },
    setMergedDataToExport: (state, action) => {
      state.mergedDataToExport = action.payload;
    },
  },
});

export const {
  setComplianceData,
  setComplianceExportData,
  setSeoReadinessExport,
  setMergedDataToExport,
} = complianceSlice.actions;

export default complianceSlice.reducer;
