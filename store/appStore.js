import { configureStore } from "@reduxjs/toolkit";
import pricingReducer from "./pricingSlice";
import uploadReducer from "./uploadSlice";
import productTableReducer from "./walmart/productTableSlice";
import walmartPricingReducer from "./walmart/walmartPricingSlice";
import documentTableReducer from "./dashboard/documentTableSlice";
import userReducer from "./userSlice";
import productReadiness from "./dashboard/productReadiness";
import compliance from "./dashboard/complianceSlice";
import hyperTargetReducer from "./dashboard/hypertargetSlice";
import productEntriesReducer from "./dashboard/productTableSlice";
import selectedProductsReducer from "./dashboard/selectedProductsSlice";
import brandVoiceReducer from "./brandVoiceSlice";
import api from "./api";

const appStore = configureStore({
  reducer: {
    pricing: pricingReducer,
    uploadpage: uploadReducer,
    productTable: productTableReducer,
    walmartPricing: walmartPricingReducer,
    documentTable: documentTableReducer,
    user: userReducer,
    productEntries: productEntriesReducer,
    productReadiness: productReadiness,
    compliance: compliance,
    selectedProducts:selectedProductsReducer,
    hyperTarget: hyperTargetReducer,
    brandvoice: brandVoiceReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export default appStore;
