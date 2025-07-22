import React, { useState,useEffect } from 'react';
import { TextField, Button, Box,Snackbar,Alert,AlertTitle,Typography} from '@mui/material';
import { getSession, useSession, signOut } from "next-auth/react";
import axios from "axios";
const TextBox = ({ user }) => {
  const { data: session, status } = useSession();
  const [keywords, setKeywords] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [ErrorsnackbarOpen, setErrorsnackbarOpen] = useState(false);
  const [LimitErrorsnackbarOpen, setLimitErrorsnackbarOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [limitError, setLimitError]=useState("")
  const [successMsg, setSuccessMsg] = useState("");
  const handleInputChange = (event) => {
    // setKeywords(event.target.value);
    const keywordsList = event.target.value.split(",").map((keyword) => keyword.trim());
  if (keywordsList.length > 125) {
    setLimitError("Maximum limit of 125 keywords exceeded.");
    setLimitErrorsnackbarOpen(true);
  } else {
    setKeywords(event.target.value);
  }
  };

  useEffect(() => {
    fetchExistingKeywords();
  }, [status]);
  const fetchExistingKeywords = async () => {
        axios.get(process.env.NEXT_PUBLIC_BASE_URL+'/standalone/fetch/keywords',
          {
            headers: {
              Authorization: user.id_token,
            }
        })
        .then((response) => {
          const existingKeywords = response.data.keywords.join(', ');
          setKeywords(existingKeywords);
        })
        .catch((err)=> {
          console.error('Error fetching existing keywords:', err);
          if(err?.response?.data == "Unauthorized") {
            signOut();
          }
        });
  };

  const handleSubmit = () => {
    const keywordsList = keywords.split(",").map((keyword) => keyword.trim());
    const nonEmptyKeywords = keywordsList.filter((keyword) => keyword !== "");

    if (nonEmptyKeywords.length === 0) {
      setLimitError("Please enter at least one non-empty keyword.");
      setLimitErrorsnackbarOpen(true);
      return; // Stop the submission if no non-empty keywords are entered
    }
    const config = {
      headers: {
        Authorization: user.id_token,
      },
    };
  
    axios.post(process.env.NEXT_PUBLIC_BASE_URL+'/standalone/upload/keywords', { keywords }, config)
      .then(response => {
        console.log('Keywords uploaded successfully');
        setSnackbarOpen(true)
        setSuccessMsg("Keywords uploaded successfully")
        // Add any additional logic or notifications here
      })
      .catch(error => {
        console.error('Error uploading keywords:', error);
        setErrorsnackbarOpen(true)
        setErrorMsg(error);
        // Handle error condition
      })
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setErrorsnackbarOpen(false)
    setLimitErrorsnackbarOpen(false)
  };

  return (
    <Box>
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Typography style={{ margin: '16px' }}>Please supply SEO Keywords in a comma-separated list. 125 keywords or keyphrases maximum.</Typography>
      <TextField
        label="Enter your keywords"
        variant="outlined"
        value={keywords}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
        multiline // Enable multiline
        rows={13} // Set the number of rows (adjust as needed)
        sx={{
          maxWidth: '800px', // Set the maximum width of the text field
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'black', // Set the border color when not focused
            },
            '&.Mui-focused fieldset': {
              borderColor: 'blue', // Set the border color when focused
              borderWidth:'1px'
            },
          },
          '& .MuiInputLabel-root': {
            color: 'black', // Set the label color
            '&.Mui-focused': {
              color: 'blue', // Set the label color when focused
            },
          },
        }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Save Keywords List
      </Button>
    </Box>

    <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" onClose={handleSnackbarClose}>
          <AlertTitle>success</AlertTitle>
          {successMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={ErrorsnackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>Error</AlertTitle>
          {errorMsg?.response?.data?.error ? errorMsg?.response?.data?.error : "unknown error occured"}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={LimitErrorsnackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>Error</AlertTitle>
          {limitError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TextBox;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {}
    }
  }
  const { user } = session;
  return {
    props: { user },
  }
}