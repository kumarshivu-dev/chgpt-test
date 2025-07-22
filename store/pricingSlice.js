import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    planMode: false,
    paymentButton: false,
    basicButton: {
        name: 'Get Started',
        disable: false,
    },
    basicMonthlyButton: {
        name: 'Get Started',
        disable: false,
    },
    essentialButton: {
        name: 'Get Started',
        disable: false,
    },
    essentialMonthlyButton: {
        name: 'Get Started',
        disable: false,
    },
    premiumButton: {
        name: 'Get Started',
        disable: false,
    },
    premiumMonthlyButton: {
        name: 'Get Started',
        disable: false,
    },
    eliteButton: {
        name: 'Get Started',
        disable: false,
    },
    enterpriseButton: {
        name: 'Contact Sales',
        disable: false,
    },
    fullname: [],
    plancodeValue: 'Your Current Plan',
};

const pricingSlice = createSlice({
    name: 'pricing',
    initialState,
    reducers: {
        setPlanMode: (state, action) => {
            state.planMode = action.payload;
        },
        setPaymentButton: (state, action) => {
            state.paymentButton = action.payload;
        },
        setBasicButton: (state, action) => {
            state.basicButton.name = action.payload.name;
            state.basicButton.disable = action.payload.disable;
        },
        setBasicMonthlyButton: (state, action) => {
            state.basicMonthlyButton.name = action.payload.name;
            state.basicMonthlyButton.disable = action.payload.disable;
        },
        setEssentialButton: (state, action) => {
            state.essentialButton.name = action.payload.name;
            state.essentialButton.disable = action.payload.disable;
        },
        setEssentialMonthlyButton: (state, action) => {
            state.essentialMonthlyButton.name = action.payload.name;
            state.essentialMonthlyButton.disable = action.payload.disable;
        },
        setPremiumButton: (state, action) => {
            state.premiumButton.name = action.payload.name;
            state.premiumButton.disable = action.payload.disable;
        },
        setPremiumMonthlyButton: (state, action) => {
            state.premiumMonthlyButton.name = action.payload.name;
            state.premiumMonthlyButton.disable = action.payload.disable;
        },
        setEliteButton: (state, action) => {
            state.eliteButton.name = action.payload.name;
            state.eliteButton.disable = action.payload.disable;
        },
        setEnterpriseButton: (state, action) => {
            state.enterpriseButton.name = action.payload.name;
            state.enterpriseButton.disable = action.payload.disable;
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
    setBasicButton,
    setBasicMonthlyButton,
    setEssentialButton,
    setEssentialMonthlyButton,
    setPremiumButton,
    setPremiumMonthlyButton,
    setEliteButton,
    setEnterpriseButton,
    setFullName,
    setPlancodeValue,
} = pricingSlice.actions;

export default pricingSlice.reducer;