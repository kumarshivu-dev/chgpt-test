import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: [],
  userPlan: null,
  accountRenewalDate: null,
  callsLeft: null,
  callsMade: null,
  callsUsageCount: [],
  countReset: null,
  planName: null,
  allowedCalls: null,
  company: null,
  apiClientId: null,
  userBrands: [],
  brandIdList: [],
  userChosenLLM:null,
  userCloudInfo:null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserPlan: (state, action) => {
      state.userPlan = action.payload;
    },
    setAccountRenewalDate: (state, action) => {
      state.accountRenewalDate = action.payload;
    },
    setCallsLeft: (state, action) => {
      state.callsLeft = action.payload;
    },
    setCallsMade: (state, action) => {
      state.callsMade = action.payload;
    },
    setCountReset: (state, action) => {
      state.countReset = action.payload;
    },
    setPlanName: (state, action) => {
      state.planName = action.payload;
    },
    setAllowedCalls: (state, action) => {
      state.allowedCalls = action.payload;
    },
    setCallsUsageCount: (state, action) => {
      state.callsUsageCount = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setCompany: (state, action) => {
      state.company = action.payload;
    },
    setApiClientId: (state, action) => {
      state.apiClientId = action.payload;
    },
    setUserBrands: (state, action) => {
      state.userBrands = action.payload;
    },
    setBrandIdList: (state, action) => {
      state.brandIdList = action.payload;
    },
    setUserChosenLLM: (state, action) => {
      state.userChosenLLM = action.payload;
    },
    setUserCloudInfo: (state, action) => {
      state.userCloudInfo = action.payload;
    },
    
  },
});

export const {
  setUserInfo,
  setUserPlan,
  setCallsLeft,
  setCallsMade,
  setAccountRenewalDate,
  setCountReset,
  setPlanName,
  setAllowedCalls,
  setCompany,
  setApiClientId,
  setUserBrands,
  setBrandIdList,
  setCallsUsageCount,
  setUserChosenLLM,
  setUserCloudInfo
} = userSlice.actions;

export default userSlice.reducer;
