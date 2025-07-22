import { createTheme } from "@mui/material";

const dashboardtheme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: "#022149",
    },
  },

  typography: {
    fontFamily: "'Noto Sans', sans-serif",

    h1: {
      fontSize: "26px !important",
      fontWeight: "800 !important",
      margin: "20px 0 6px 0",
      textAlign: "center",
      color: "#000",
    },

    h2: {
      fontSize: "22px !important",
      fontWeight: "400 !important",
      margin: "0px 0px 6px 0px",
    },
    h3: {
      fontSize: "25px !important",
      fontWeight: "700 !important",
      margin: "0px 0px 6px 0px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#022149",
          color: "#FCFCFC",
          border: "1px solid #022149",
          textTransform: "capitalize",
          borderRadius: "5px",
          boxShadow: "none",
          margin: "0",
          "&:hover": {
            backgroundColor: "#163058",
            border: "1px solid #163058",
            boxShadow: "none",
          },
        },
        outlined: {
          background: "#FFFFFF",
          color: "#474747",
          border: "1px solid #C6C6C6",
          borderRadius: "5px",
          textTransform: "capitalize",
          margin: "0",
          padding: "6px 16px",
          "&:hover": {
            background: "#F9F9FF",
            color: "#2E4770",
            border: "1px solid #6077A4",
          },
        },
        containedError: {
          background: "#d32f2f",
          border: 0,
          "&:hover": {
            background: "rgba(238, 7, 27, 1)",
            border: 0,
          },
        },
      },
    },
  },
  container: {
    backgroundColor: "#232FEe",
    // backgroundColor: "#f6aa46",
  },
});
export default dashboardtheme;
