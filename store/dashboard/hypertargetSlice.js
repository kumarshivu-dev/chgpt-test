import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  chosenPersona: [],
  chosenTaxonomy: null,
};

const hypertargetSlice = createSlice({
  name: "hyperTarget",
  initialState,
  reducers: {
    setChosenPersona: (state, action) => {
      state.chosenPersona = action.payload;
    },
    setChosenTaxonomy: (state, action) => {
      state.chosenTaxonomy = action.payload;
    },
  },
});

export const { setChosenPersona, setChosenTaxonomy } = hypertargetSlice.actions;
export default hypertargetSlice.reducer;
