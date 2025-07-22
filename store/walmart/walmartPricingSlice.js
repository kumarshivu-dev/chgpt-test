import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isWalmartPaidUser: false,
    planMode: false,
    paymentButton: false,
    essentialButton: {
        name: 'Get Started',
        disable: false,
    },
    premiumButton: {
        name: 'Get Started',
        disable: false,
    },
    eliteButton: {
        name: 'Get Started',
        disable: false,
    },
    fullname: [],
    plancodeValue: 'Your Current Plan',
};

const walmartPricingSlice = createSlice({
    name: 'walmartPricing',
    initialState,
    reducers: {
        SetIsWalmartPaidUser: (state, action) => {
            state.isWalmartPaidUser = action.payload;
        },
        setPlanMode: (state, action) => {
            state.planMode = action.payload;
        },
        setPaymentButton: (state, action) => {
            state.paymentButton = action.payload;
        },
        setEssentialButton: (state, action) => {
            state.essentialButton.name = action.payload.name;
            state.essentialButton.disable = action.payload.disable;
        },
        setPremiumButton: (state, action) => {
            state.premiumButton.name = action.payload.name;
            state.premiumButton.disable = action.payload.disable;
        },
        setEliteButton: (state, action) => {
            state.eliteButton.name = action.payload.name;
            state.eliteButton.disable = action.payload.disable;
        },
        setFullName: (state, action) => {
            state.fullname = action.payload;
        },
        setPlancodeValue: (state, action) => {
            state.plancodeValue = action.payload;
        },

    },
});

export const {
    setPlanMode,
    setPaymentButton,
    setEssentialButton,
    setPremiumButton,
    setEliteButton,
    setFullName,
    setPlancodeValue,
    SetIsWalmartPaidUser,
} = walmartPricingSlice.actions;

export default walmartPricingSlice.reducer;
