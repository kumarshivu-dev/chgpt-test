import { createTheme } from '@mui/material';


const theme = createTheme({
    palette: {
        // mode: 'dark',
      primary: {
        main: '#FB9005',
      }
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
            backgroundColor: '#FB9005',
            color: '#ffffff',
            borderRadius: '0px',
            borderRight: "1px solid #fff",
            '&:hover': {
                backgroundColor: '#f6aa46',
            },
            
        },
        outlined: {
            color: '#FB9005',
            borderColor: "#FB9005",
        },
    },
  },
} 
    
  });
export default theme