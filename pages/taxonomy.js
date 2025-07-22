import React, { useEffect, useState } from "react";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import {
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Grid,
  Alert,
  AlertTitle,
  Snackbar,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
  LinearProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";
import 'dotenv';

const Root = styled("div")(({ theme }) => ({
  [`&.${"root"}`]: {
    margin: theme.spacing(3),
  },
  [`& .${"uploadBox"}`]: {
    backgroundColor: "#0d0d44",
    color: "white",
    borderRadius: 4,
    padding: theme.spacing(4),
    textAlign: "center",
  },
  [`& .${"newUploadBox"}`]: {
    backgroundColor: "#858181",
    color: "white",
    borderRadius: 4,
    padding: theme.spacing(4),
    textAlign: "center",
  },
  [`& .${"inputBox"}`]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  [`& .${"textInBox"}`]: {
    fontSize: 16,
    color: "#cdcdcd",
  },
  [`& .${"fileLabel"}`]: {
    cursor: "pointer",
  },
  [`& .${"redText"}`]: {
    color: "red",
  },
  [`& .${"content"}`]: {
    margin: theme.spacing(3),
    textAlign: "center",
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  },
  [`& .${"browseBtn"}`]: {
    marginTop: theme.spacing(1),
    borderRadius: "5px"
  },
  [`& .${"uploadBtn"}`]: {
    margin: theme.spacing(1),
    borderRadius: "5px"
  },
  [`& .${"checkBoxClass"}`]: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: '20px'
  },
  [`& .${"formBox"}`]: {
    marginTop: "20px",
    width: "70%",
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },

  },

}));


function UploadTaxonomy({ user }) {

  const { data: session, status } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [warnSnackbar, setwarnSnackbar] = useState(false);
  const [completeSnackbar, setCompleteSnackbar] = useState(false);
  const uploadUrl = process.env.UPLOAD_URL;
  const router = useRouter();

  useEffect(() => {

    axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/profile", {
      headers: {
        "Authorization": user?.id_token
      }
    })
      .then((res) => {
        if (res.data.profileUpdated == false) {
          router.push({
            pathname: "/profile",
            query: {
              profile_message: "Please update your profile to continue"
            }
          });
        }

      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data == "Unauthorized") {
          signOut();
        }
      })
  }, [status])

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  useEffect(() => {
    if (selectedFile !== null) {
      handleUpload();
    }
  }, [selectedFile]);

  const handleUpload = () => {
    if (selectedFile) {
      setLoading(true)
      console.log('File selected')
      const formData = new FormData();
      formData.append("file", selectedFile);
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };

      axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + "/standalone/upload/taxonomy",
        formData, config
      ).then((response) => {
        console.log('response',response)
        setCompleteSnackbar(true)
        console.log("Taxonomy file uploaded")
        router.push("/uploadpage")

      }).catch((error) => {
        console.log('taxonomy page error', error)
        setErrorMsg(error?.response?.data?.error || error?.response?.data?.message || "Some error occured, please try again");
        // setLoading(false);
        setSnackbarOpen(true);

      }).finally(() => {
        setLoading(false);
      });

    } else {
      setwarnSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setwarnSnackbar(false);
    setCompleteSnackbar(false);
    // setMonthSnackbar(false);
    // setCheckBoxSnackbar(false);
    // setKeywordsError(false);
  };

  function createData(first, second, third, fourth) {
    return { first, second, third, fourth };
  }
  const rows = [
    createData('Electronics', 'TVs', '', ''),
    createData('Electronics', 'Headphones', 'Wired', ''),
    createData('Electronics', 'Headphones', 'Wireless', ''),
    createData('Sports', 'Exercise', 'Treadmills', ''),
    createData('Sports', 'Exercise', 'Weights', 'Free Weights'),
    createData('Sports', 'Exercise', 'Weights', 'Machines'),
    createData('Sports', 'Yoga'),
    createData('Gift Cards')
  ];
  return (
    <Root className="root" style={{ display: "flex", flexDirection: "column" }}>
      {loading && <Grid
        container
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={12} sm={8}>
          <Box className="progression container">
            <LinearProgress />
          </Box>
        </Grid>
      </Grid>}
      <Typography className="content" variant="h6">
        Please upload a file for Taxonomy
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8}>
          <Box
            className="uploadBox"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <CloudUploadIcon fontSize="large" />
            <Typography style={{ fontSize: '20px' }} variant="body1">Upload File</Typography>
            <Typography variant="body2" className="textInBox">
              Upload a file in .xls or .xlsx format to create or update your Taxonomy.
            </Typography>
            <Box className="inputBox">
              <Box>
                {selectedFile ? (
                  <Typography variant="body1">
                    File selected: {selectedFile.name}
                  </Typography>
                ) : (
                  <Typography sx={{ border: '1px dashed white', padding: '13px' }} variant="body1">
                    Drag and drop a file here
                  </Typography>
                )}
                <input
                  type="file"
                  id="chooseFile"
                  accept=".xls, .xlsx, .csv"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <Button
                  size={"large"}
                  variant="contained"
                  component="label"
                  className="browseBtn"
                  style={{ width: '100%' }}
                >
                  <label htmlFor="chooseFile" className="fileLabel">
                    Browse File
                  </label>
                </Button>
                {/* <Button
                  size={"small"}
                  variant="contained"
                  onClick={handleUpload}
                  className="uploadBtn"
                >
                  Upload File
                </Button> */}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" mt={5}>
        <Grid item className="image_box" xs={12} sm={8}>
          <Typography
            variant="h6"
            sx={{ marginBottom: "18px" }}
            align="center"
            textAlign="center"
          >
            Please upload your file in this format
          </Typography>
          {/* <img className="table_img" src={paid ? '/paid_user_image.png' : '/upload.png'} /> */}


          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow sx={{ '&:last-child td, &:last-child th': { border: 1 } }}>
                  <TableCell style={{ textAlign: "center" }} sx={{ border: 1 }}>A</TableCell>
                  <TableCell style={{ textAlign: "center" }} sx={{ border: 1 }}>B</TableCell>
                  <TableCell style={{ textAlign: "center" }} sx={{ border: 1 }}>C</TableCell>
                  <TableCell style={{ textAlign: "center" }} sx={{ border: 1 }}>D</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 1 } }}
                  >
                    <TableCell sx={{ border: 1 }}>{row.first}</TableCell>
                    <TableCell sx={{ border: 1 }}>{row.second}</TableCell>
                    <TableCell sx={{ border: 1 }}>{row.third}</TableCell>
                    <TableCell sx={{ border: 1 }}>{row.fourth}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>


        </Grid>
      </Grid>
      <div style={{ display: "flex" }}>
        <Grid container spacing={2} style={{ justifyContent: "center" }}>
          <Grid style={{ marginTop: "24px" }} item xs={12} sm={4}>
            <Paper style={{ padding: 16, height: "100%" }}>
              <Typography variant="h6" style={{ textAlign: "center" }}>
                Columns and Roles
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Each level of your taxonomy should be in a separate column. See file format example." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Each row represents a taxonomy node." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Products will only be assigned to ending nodes. Example:You have a row  | A | B | C |.   Products would only be assigned to C.If you want Products assigned to B also, you would add the row:  | A | B |" />
                </ListItem>
                <ListItem>
                  <ListItemText primary={<Typography>Taxonomy text can contains letters, numbers, and any of the following characters : & $ - + " ' , . ! ? ( ) : ; /</Typography>} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid style={{ marginTop: "24px" }} item xs={12} sm={4}>
            <Paper style={{ padding: 16, height: "100%" }}>
              <Typography variant="h6" style={{ textAlign: "center" }}>
                How it works
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="ContentHubGPT uses the product brand, name, description and features to pick the taxonomy node that best fits each product." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Taxonomy assignment is performed after content generation and SEO enhancement are completed." />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>


      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>Error</AlertTitle>
          {/* {error.response.data.error} */}
          {errorMsg?.response?.data?.error ||
            errorMsg || "Please make sure the name of the columns on your file are as given in the sample"}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={warnSnackbar}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>Error</AlertTitle>
          Please select a file
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={completeSnackbar}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" onClose={handleSnackbarClose}>
          <AlertTitle>success</AlertTitle>
          File uploaded successfully
        </Alert>
      </Snackbar>

    </Root>
  );
}
export default UploadTaxonomy;

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