import React from "react";
import { useSession, getSession } from "next-auth/react";
import {
  Grid,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  CircularProgress,
  IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { POST_CONTACT_SUPPORT } from "../../utils/apiEndpoints";
import SnackbarNotifier from "../../components/helper/dashboard/snackbarNotifier";
import "dotenv/config";


const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const ContactSupport = ({ user }) => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [attachments,setAttachments] = useState([]);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [message, setMessage] = useState(0);
  const [nameError,setNameError] = useState(false);
  const [emailError,setEmailError] = useState(false);
  const [summaryError,setSummaryError] = useState(false);
  const [detailsError,setDetailsError] = useState(false);
  const [loading, setLoading] = useState(false);


  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };
   
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    if(session?.user?.email){
      setEmail(session.user.email);
    }
  }, [session?.user?.email]);

  // Handle files dropped in the area
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setAttachments((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  // Handle file input change (for file explorer)
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setAttachments((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // Handle drag over event (prevent default behavior)
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Remove a specific file
  const handleRemoveFile = (index) => {
    setAttachments((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage(0);
    }, 4000);
  }, [message]);
  //Redirecting to home if cancel
  const handleSkip = (e) => {
    update({ ...session, newUser: false });
    session.user.newUser = false;
    setTimeout(() => {
      router.push("/dashboard/home");
    }, 2000);
  };

  //Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()||!email.trim()||!summary.trim()||!details.trim()) {

        activateSnackbar(
            "Please fill in all the required fields!", 
            "error" 
          );
          
        return; 
      }
    setLoading(true);
    const formData = new FormData();
    formData.append('contactSupportRequest', new Blob([JSON.stringify({ summary, details })], {
        type: 'application/json'
    }));

    attachments.forEach((file) => {
        formData.append('attachments', file);
    });

    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_CONTACT_SUPPORT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: user?.id_token,
            },
        });
        setDetails("");
        setSummary("");
        setAttachments([]);
        if (response.status === 200) {
            activateSnackbar(
                "Your support ticket has been submitted successfully. Thank you!"
                 );
        } else {
            throw new Error;
        }
    } 
    catch (err) {
        console.log("Error: ", err.response);
        activateSnackbar(
            "Error while submitting the form. Please try again later.", 
            "error" 
          );
    }
    finally {
        setLoading(false);
    }
};

  
  

  return (
    <>
     
     <div className="contact_support_page">
        <Typography
          variant="h1"
          sx={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Support Request Form
        </Typography>
        {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,  
                        bgcolor: 'rgba(255, 255, 255, 0.2)',  
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
        <Box sx={{
                    opacity: loading ? 0.5 : 1,
                    pointerEvents: loading ? 'none' : 'auto',
                }}>
        <Grid container justifyContent="center">
        <Grid item xs={12}>
              <Item>
                <Box
                  component="form"
                  sx={{
                    "& .MuiTextField-root": { m: 1 },
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <TextField
                        fullWidth
                        id="outlined-name"
                        label="Name"
                        required
                        value={session?.user?.name ? session?.user?.name : ""}
                        onChange={(e) => {
                          setName(e.target.value);
                          if(e.target.value!=="")
                            setNameError(false);
                            else
                            setNameError(true);
                        }}
                        disabled={loading}
                        error={nameError} 
                        helperText={nameError ? 'This field is required' : ''}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <TextField
                        fullWidth
                        // disabled
                        id="outlined-email"
                        label="Email"
                        required
                        value={session?.user?.email ? session?.user?.email : ""}
                        onChange={(e) => {
                        setEmail(e.target.value);
                        if(e.target.value!=="")
                        setEmailError(false);
                        else
                        setEmailError(true);
                      }
                    }
                    disabled={loading}
                    error={emailError} 
                    helperText={emailError ? 'This field is required' : ''}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <TextField
                        fullWidth
                        multiline
                        id="outlined-summary"
                        label="Summary"
                        required
                        value={summary}
                        onChange={(e) => {
                        setSummary(e.target.value);
                        if(e.target.value!=="")
                        setSummaryError(false);
                        else
                        setSummaryError(true);
                      } }
                      disabled={loading}
                      error={summaryError} 
                      helperText={summaryError ? 'This field is required' : ''}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        id="outlined-request-details"
                        label="What are the details of your request?"
                        required
                        value={details}
                        onChange={(e) => {
                        setDetails(e.target.value);
                        if(e.target.value!=="")
                        setDetailsError(false);
                        else
                        setDetailsError(true);
                      }}
                      disabled={loading}
                      error={detailsError} 
                      helperText={detailsError ? 'This field is required' : ''}
                      />
                    </Grid>

                    <Grid
                          item
                          xs={12}
                          sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              margin: "0px 8px",
                            }}
                                 >

      <Box sx={{ width: "100%" }}>
        {/* Drag and Drop Area */}
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            width: "100%",
            height: "150px",
            border: "2px dashed #ccc",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f9f9f9",
            color: "#333",
            position: "relative",
            marginBottom: 2,
            cursor: "pointer",
          }}
        >
          <Typography>Drag & Drop files here or click to browse</Typography>

          {/* Hidden file input for file explorer */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            style={{
              position: "absolute",
              opacity: 0,
              cursor: "pointer",
              width: "100%",
              height: "100%",
            }}
            disabled={loading}
          />

          <Button
            variant="outlined"
            component="label"
            sx={{ marginTop: 2 }}
            onClick={() => document.querySelector('input[type="file"]').click()}
            size="medium"
            disabled={loading}
          >
            Browse
          </Button>
        </Box>

        {/* Display the selected files */}
        {attachments.length > 0 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap", 
              gap: "8px", 
              marginTop: "16px", 
              width: "100%",
            }}
          >
            {attachments.map((file, index) => (
              <Box
                key={index}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#f0f0f0",
                  width: "150px", 
                  height: "40px", 
                  boxSizing: "border-box",
                  justifyContent: "space-between",
                  overflow: "hidden", 
                  whiteSpace: "nowrap", 
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis", 
                    whiteSpace: "nowrap", 
                    maxWidth: "80%", 
                  }}
                >
                  {file.name}
                </Typography>

                <IconButton
                  edge="end"
                  aria-label="remove"
                  onClick={() => handleRemoveFile(index)}
                  sx={{
                    padding: "4px", 
                    marginRight: "0px",
                    flexShrink: 0, 
                  }}
                  disabled={loading}
                >
                  <CloseIcon sx={{ fontSize: "16px" }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Box>
                   </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center", gap: 2 }}
                    >
                      <Button
                        onClick={handleSkip}
                        sx={{
                          marginTop: "20px",                   
                        }}
                        variant="outlined"
                        size="medium"
                        disabled={loading}
                      >
                        Cancel
                      </Button>

                      <Button
                        type="submit"
                        sx={{
                          marginTop: "20px",
                          color: "#ffffff",
                        }}
                        variant="contained"
                        size="medium"
                        disabled={loading}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Item>
            </Grid>
            
          </Grid>
         
        </Box>
      </div> 
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
      
    </>
  );
};

export default ContactSupport;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}