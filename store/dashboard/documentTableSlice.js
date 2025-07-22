import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  //upload save modal
  docTableData: [],
  onRowExportBool: false,
  selectedDocuments: [],
  selectedPersona: [],
  isSelectedProduct: true,
  selectedChannels: [],
};

const documentTableSlice = createSlice({
  name: "documentTable",
  initialState,
  reducers: {
    setDocTableData: (state, action) => {
      state.docTableData = action.payload;
    },
    setOnRowExportBool: (state, action) => {
      state.onRowExportBool = action.payload;
    },
    setSelectedDocuments: (state, action) => {
      state.selectedDocuments = action.payload;
    },
    setSelectedPersona: (state, action) => {
      state.selectedPersona = action.payload;
    },
    setIsSelectedProduct: (state, action) => {
      state.isSelectedProduct = action.payload;
    },
    setSelectedChannels: (state, action) => {
      state.selectedChannels = action.payload;
    },
  },
});

export const {
  setDocTableData,
  setOnRowExportBool,
  setSelectedDocuments,
  setSelectedPersona,
  setIsSelectedProduct,
  setSelectedChannels,
} = documentTableSlice.actions;
export default documentTableSlice.reducer;
