import React, { useEffect, useState } from "react";
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {
  Button,
  FormControl,
  FormControlLabel,
  Typography,
  Box,
  Grid,
  Alert,
  AlertTitle,
  Snackbar,
  Radio,
  RadioGroup,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";
import 'dotenv';
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedFile, setPaid, setPremium, setImageRec
} from '../store/uploadSlice';
import cookie from "js-cookie";
import Progress from "./progressBar";
import ProgressTracker from "../components/feature/ProgressTracker";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Modaltable from "../components/helper/Modaltable";
const Root = styled("div")(({ theme }) => ({
  [`&.${"root"}`]: {
    margin: theme.spacing(3),
  },
  [`& .${"uploadBox"}`]: {
    backgroundColor: "#FFEAD0",
    color: "black",
    borderRadius: "10px",
    padding: theme.spacing(4),
    textAlign: "center",
  },
  [`& .${"newUploadBox"}`]: {
    backgroundColor: "#595959",
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
  },
  [`& .${"textInBox"}`]: {
    fontSize: 16,
    color: "#7B89B2",
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
  [`& .${"uploadBtnGrey"}`]: {
    margin: theme.spacing(1),
    borderRadius: "5px",
    backgroundColor: 'grey',
    '&:hover': {
      backgroundColor: 'grey',
    },
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
    width: "83%",
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },

  },

}));


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));


function UploadFilePage({ user }) {

  const { data: session, status, update } = useSession();
  const [errorMsg, setErrorMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [warnSnackbar, setwarnSnackbar] = useState(false);
  const [monthSnackbar, setMonthSnackbar] = useState(false);
  const [monthLimit, setMonthLimit] = useState(true)
  const uploadUrl = process.env.UPLOAD_URL;
  const router = useRouter();
  const dispatch = useDispatch();
  const uploadState = useSelector((state) => state.uploadpage);
  const [windowSize, setWindowSize] = useState(800);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectedValuetemp, setSelectedValueTemp] = useState(null);
  const [sampleRows, setSampleRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const firstRowsPaid = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
    ['product_id', 'product_name', 'brand', 'keywords', 'product_description', 'feature_bullet1', 'feature_bullet2', 'feature_bullet3', 'feature_bullet4', 'feature_bullet5'],
    ['WYZEC3X2', 'Wyze Cam v3', 'WYZE', '', '', '', '', '', '', '', ''],
    ['960-000733', 'Sennheiser HD 800 S Wired Headphones', 'Sennheiser', '', '', '', '', '', '', '', ''],
    ['BS27', 'Beautyshade Jackie Sunglasses, Tortise', 'BeautyShade', 'classic style, tortiseshell rims, UV protection, fashionable, durable, elegant, protective case', '', '', '', '', '', '', ''],
    ['142152375', 'Lululemon The Reversible Yoga Mat 5mm', 'Lululemon', '', '', 'Our innovative grippy top layer absorbs moisture to help you stay grounded in high-sweat practices',
      'A sustainably sourced and FSC™-certified natural rubber base gives you cushioning and textured grip for low-sweat practices',
      "I'm reversible—flip as needed between the smooth, grippy side and the cushioned, natural rubber side",
      'An antimicrobial additive helps prevent mould and mildew on the mat',
      'CONTAINS LATEX: People with rubber or latex allergies should avoid contact with this product as it contains natural rubber and may contain latex', ''],
    ['52205', 'Gaiam Total Body Balance Yoga Ball Kit', 'Gaiam', '',
      'The Total Body Balance Ball Workout was developed to combine our Balance Ball with resistance training for maximum results. Leading fitness instructor Tanja Djelevic takes you through a series of Pilates, yoga and strength moves using the Balance Ball to focus on major muscle groups. Improve your body’s core strength and natural balance while getting trim and toned. Kit delivers dynamic whole-body workouts that range from beginner to advanced featuring a 105-minute workout (Total Body Balance Ball with three 20-minute focused segments on upper body, lower body and abs and Balance Ball Express with three 10-minute segments), an air pump and high-quality, anti-burst Balance Ball.   Includes Anti-Burst Stability Exercise Yoga Ball, Air Pump, and Workout Program.',
      '', '', '', '', '', ''],
    ['ABCD1234', 'Hydr8 Water Bottle', 'Hydr8', 'Ocean-blue, BPA free, made from 50% recycled materials, durable construction, lid attached with keeper loop, includes carabiner', '32 oz water bottle', '32 oz', 'Wide mouth', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', '']
  ];

  const firstRowsUnpaid = [
    ['A', 'B', 'C', 'D'],
    ['product_id', 'product_name', 'brand', 'keywords'],
    ['1', 'Wyze Cam v3', 'WYZE', ''],
    ['2', 'Sennheiser HD 800 S', 'Sennheiser', ''],
    ['3', 'Beautyshade Jackie Sunglasses, Tortise', 'BeautyShade', 'classic style, tortiseshell rims, UV protection, fashionable, durable, elegant, protective case'],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ];
  //To handle radio click on while selecting excel file method
  const handleDivClick = (value) => {
    if (value === "sample") {
      handleRadioChange();
    } else if (value === "paid") {
      dispatch(setSelectedFile(null));
    }
    setSelectedValue(value);
  };
  // Setting sellected File in redux null at time of initial render of upload page
  useEffect(() => {
    // dispatch(setSelectedFile(null));
    handleDivClick('sample')
  }, [])

  // To fetch window screen width
  useEffect(() => {
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    }
    window.addEventListener("resize", handleSize);
    handleSize();
  })

  useEffect(() => {
    if (session && !session.user.terms) {
      update({ ...session, terms: cookie.get("rememberMe") });
      session.user.terms = cookie.get("rememberMe");
    }

    if (user?.newUser) {
      router.push({
        pathname: "/profile",
        query: {
          profile_message: "Please update your profile to continue"
        }
      });
    }

    axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/profile", {
      headers: {
        "Authorization": user?.id_token
      }
    })
      .then((res) => {
        if (res.data.paidUser == true) {
          setSampleRows(firstRowsPaid);
          dispatch(setPaid(true))
          if (res.data.planCode == "chgpt-premium" || res.data.planCode == "chgpt-elite" || res.data.planCode.startsWith("chgpt-enterprise")) {
            dispatch(setPremium(true))
          }
          if (res.data.planCode == "chgpt-elite" || res.data.planCode.startsWith("chgpt-enterprise")) {
            dispatch(setImageRec(true))
          }
        }
        else {
          setSampleRows(firstRowsUnpaid);
        }

        if (res.data.monthlyLimit <= 0) {
          setMonthLimit(false);
          setMonthSnackbar(true);
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
    if (!monthLimit) return
    const file = event.target.files[0];
    dispatch(setSelectedFile(file));
  };
  //Calling excell API to fetch sample excel file
  const handleRadioChange = async (event) => {
    try {
      const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + '/standalone/fetch/excelfile', {
        headers: {
          Authorization: user?.id_token,
        },
        responseType: 'blob', // Set the response type to 'blob'
      });
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const file = new File([blob], "Example_Product_Upload.xlsx");
      dispatch(setSelectedFile(file));
    } catch (err) {
      console.error('Error fetching excel file:', err);
      if (err?.response?.data === 'Unauthorized') {
        signOut();
      }
    }
  }

  const handleDrop = (event) => {
    event.preventDefault();
    if (!monthLimit) return
    const file = event.dataTransfer.files[0];
    dispatch(setSelectedFile(file));

  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!monthLimit) return
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setwarnSnackbar(false);
    setMonthSnackbar(false);
  };

  const handleClose = () => {
    setModalOpen(false);
  }

  return (
    <Root
      className="root"
      style={{ display: "flex", flexDirection: "column", margin: "0px" }}
    >
      {windowSize > 768 ? (
        <Progress active={0} />
      ) : (
        <ProgressTracker active={0} />
      )}
      {windowSize > 768 ? (
        <Box>
          <Typography className="content" variant="h6">
            Please Upload Product file
          </Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8}>
              <Box
                className={!monthLimit ? "newUploadBox" : "uploadBox"}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Box
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "15px",
                  }}
                >
                  <FormControl
                    sx={{
                      width: "100%",
                    }}
                  >
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        onClick={() => handleDivClick("sample")}
                      >
                        <FormControlLabel
                          value="sample"
                          control={<Radio checked={selectedValue === "sample"} />}
                          sx={{
                            opacity: 0.8,
                            marginRight: "0px",
                          }}
                        />
                      </Box>
                      <Typography
                        style={{ fontSize: "20px", color: "black" }}
                        variant="body1"
                      >
                        <strong>Try Sample File</strong>
                      </Typography>
                      <Box className="inputBox">
                        <Box
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "100%",
                              md: "50%",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              border: "1px dashed grey",
                              borderRadius: "10px",
                              padding: "15px 15px 10px 15px",
                              margin: "16px 0px 0px 0px",
                              backgroundColor: "#F9F9FB",
                              color: "#7B89B2",
                              position: 'relative'
                            }}
                          >
                            <Box
                              onClick={() => setModalOpen(true)}
                              sx={{cursor: 'pointer'}}
                              onMouseEnter={() => setTooltipVisible(true)}
                              onMouseLeave={() => setTooltipVisible(false)}
                              >
                              <ZoomInIcon sx={{ position: 'absolute', top: 0, right: 0, fontSize: '40px', cursor: 'pointer' }}></ZoomInIcon>
                              <Box className="tooltip" sx={{display: isTooltipVisible ? 'block' : 'none',position:'absolute',top:50,right:100, backgroundColor:'#737171',padding:'3px', color:'white',borderRadius:'3px',fontSize:'10px'}}>Click to preview contents</Box>
                              {uploadState.paid ?
                                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                  <Table aria-label="simple table">
                                    <TableBody>
                                      <TableRow sx={{ padding: 0, backgroundColor: "#dedede" }}>
                                        <TableCell sx={{ fontSize: '3px', padding: 0, textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                                        {sampleRows[0]?.slice(0).map((column, index) => (
                                          <TableCell key={index} sx={{ fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', padding: 0 }} align="left">
                                            {column}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                      {sampleRows.slice(1, 6).map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                          <TableCell sx={{ backgroundColor: "#dedede", minWidth: '3px', padding: 0, fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>{rowIndex + 1}</TableCell>
                                          {row.slice(0).map((value, colIndex) => (
                                            <TableCell key={colIndex} sx={{ minWidth: '3px', padding: 0, fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: rowIndex === 0 && colIndex >= 0 ? 'bold' : 'normal' }}>{value}</TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                                : 
                                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                                  <Table aria-label="simple table">
                                    <TableBody>
                                      <TableRow sx={{ padding: 0, backgroundColor: "#dedede" }}>
                                        <TableCell sx={{ fontSize: '5px', padding: 0, textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                                        {sampleRows[0]?.slice(0).map((column, index) => (
                                          <TableCell key={index} sx={{ fontSize: '5px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', padding: 0 }} align="left">
                                            {column}
                                          </TableCell>
                                        ))}
                                      </TableRow>
                                      {sampleRows.slice(1).map((row, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                          <TableCell sx={{ backgroundColor: "#dedede", minWidth: '3px', padding: 0, fontSize: '5px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>{rowIndex + 1}</TableCell>
                                          {row.slice(0).map((value, colIndex) => (
                                            <TableCell key={colIndex} sx={{ minWidth: '3px', padding: 0, fontSize: '5px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: rowIndex === 0 && colIndex >= 0 ? 'bold' : 'normal' }}>{value}</TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              }
                            </Box>
                            <Typography variant="body1" sx={{
                              wordBreak: 'break-word',
                              fontSize:'14px',
                              opacity: 0.8,
                              mt: "10px",
                              mb: "5px",
                              textAlign: "center"
                            }}>
                              {"Example_Product_Upload.xlsx"}
                            </Typography>
                            <Box sx={{
                              display: "flex",
                              justifyContent: "center"
                            }}>
                              <img src="/sucess_sample.png" width="25px" />
                              <Typography style={{ color: "#01c42b", paddingLeft: "10px",fontSize:'14px', fontWeight: 500 }}>Ready</Typography></Box>
                          {/* </Box> */}
                        </Box>

                      </Box>
                    </Box>
                  </RadioGroup>
                </FormControl>

              </Box>

              <Box
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "30px",
                  marginTop: '20px'
                }}
              >
                <Box sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  mt: "20px"
                }}
                  onClick={() => handleDivClick('paid')}
                >
                  <FormControlLabel value="paid" control={<Radio checked={selectedValue === 'paid'} />} sx={{
                    opacity: 0.8,
                    marginRight: "0px"
                  }} />
                </Box>
                <Typography
                  style={{ fontSize: "20px", color: "black" }}
                  variant="body1"
                >
                  <strong>Upload Product File</strong>
                </Typography>
                <Typography variant="body2" className="textInBox">
                  Drag and drop your file
                </Typography>
                <Box className="inputBox">
                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "100%",
                        md: "50%",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        border: "1px dashed grey",
                        padding: "13px",
                        borderRadius: "10px",
                        padding: "30px",
                        margin: "16px 0px 8px 0px",
                        backgroundColor: "#F9F9FB",
                        color: "#7B89B2",
                      }}
                    >
                      {uploadState.selectedFile && selectedValue === 'paid' ? (
                        <img src="/sucess.png"></img>
                      ) : (
                        <img src="/folder_image.png"></img>
                      )}
                      {uploadState.selectedFile && selectedValue === 'paid' ? (
                        <Typography
                          variant="body1"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {/* File selected: {uploadState.selectedFile.name} */}
                          {uploadState.selectedFile.name}
                        </Typography>
                      ) : (
                        <Typography variant="body1">
                          Drop File here
                        </Typography>
                      )}
                    </Box>
                    <input
                      type="file"
                      id="chooseFile"
                      accept=".xls, .xlsx, .csv"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    {!monthLimit ? (
                      <>
                        <Button
                          htmlFor="chooseFile"
                          size={"large"}
                          variant="contained"
                          component="label"
                          className="browseBtn"
                          disabled
                          style={{ width: "100%" }}
                          onClick={() => { handleDivClick('paid') }}
                        >
                          <label htmlFor="chooseFile" className="fileLabel">
                            Browse File
                          </label>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          htmlFor="chooseFile"
                          size={"large"}
                          variant="contained"
                          component="label"
                          className="browseBtn"
                          style={{ width: "100%" }}
                          onClick={() => { handleDivClick('paid') }}
                        >
                          <label htmlFor="chooseFile" className="fileLabel">
                            Browse File
                          </label>
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
              {!uploadState.paid ? (
                <Typography style={{ marginTop: "10px", fontSize: "16px" }}>
                  <Link
                    style={{ color: "orange", textDecoration: "none" }}
                    href="/Example_Product_Upload.xlsx"
                  >
                    <strong style={{ textDecoration: "none" }}>
                      Download Sample File
                    </strong>
                  </Link>
                </Typography>
              ) : (
                <Typography style={{ marginTop: "10px", fontSize: "16px" }}>
                  <Link
                    style={{ color: "orange", textDecoration: "none" }}
                    href="/paid_product_example.xlsx"
                  >
                    <strong style={{ textDecoration: "none" }}>
                      Download Sample File
                    </strong>
                  </Link>
                </Typography>
              )}
            </Box>
            <Typography style={{ textAlign: "end", marginTop: "20px" }}>
              Select Product Enhancement
              {uploadState.selectedFile ? (
                <Link
                  href={{
                    pathname: "/enhancementPage",
                  }}
                >
                  <Button
                    style={{ borderRadius: "5px", marginLeft: "5px" }}
                    size="small"
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForwardOutlinedIcon />}
                  >
                    Continue
                  </Button>
                </Link>
              ) : (
                <Button
                  style={{ borderRadius: "5px", marginLeft: "5px" }}
                  size="small"
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardOutlinedIcon />}
                  disabled
                >
                  Continue
                </Button>
              )}
            </Typography>
          </Grid>
        </Grid>
        </Box>
  ) : (
    <Box sx={{ mt: "40px" }}>
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#FB9005",
          textTransform: "uppercase",
          marginLeft: "12px",
        }}
      >
        Select File To Proceed
      </Typography>
      <Box
        sx={{
          mt: "20px",
        }}
      >
        <Typography
          sx={{
            ml: "12px",
            opacity: "0.7",
          }}
        >
          Select example data, or upload your own product file.
        </Typography>
        <FormControl
          sx={{
            width: "100%",
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              onClick={() => handleDivClick("sample")}
            >
              <FormControlLabel
                value="sample"
                control={<Radio checked={selectedValue === "sample"} />}
                sx={{
                  opacity: 0.8,
                  marginRight: "0px",
                }}
              />
              <lable style={{ fontWeight: "bold", opacity: 0.8 }}>
                Try it with Example data
              </lable>
            </Box>
            <Box className="tableBox"
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "2px dashed #FB9005",
                m: "10px",
                borderRadius: "10px",
                textAlign: "center",
                position: 'relative'
              }}
              onClick={() => handleDivClick('sample')}
            >
              <Box
                sx={{
                  padding: "32px 32px 0 32px",
                  cursor:'pointer'
                }}
                onClick={() => setModalOpen(true)}
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
                >
                <ZoomInIcon sx={{ position: 'absolute', top: 0, right: 0, fontSize: '50px', cursor: 'pointer' }} onClick={() => setModalOpen(true)}></ZoomInIcon>
                  <Box className="tooltip" sx={{display: isTooltipVisible ? 'block' : 'none',position:'absolute',top:50,right:100, backgroundColor:'#737171',padding:'1px', color:'white',borderRadius:'3px',fontSize:'10px'}}>Click to preview contents</Box>
                  {uploadState.paid?
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow sx={{ padding: 0, backgroundColor: "#dedede" }}>
                        <TableCell sx={{ fontSize: '3px', padding: 0, textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                        {sampleRows[0]?.slice(0).map((column, index) => (
                          <TableCell key={index} sx={{ fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', padding: 0 }} align="left">
                            {column}
                          </TableCell>
                        ))}
                      </TableRow>
                      {sampleRows.slice(1,6).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          <TableCell sx={{ backgroundColor: "#dedede", minWidth: '3px', padding: 0, fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>{rowIndex + 1}</TableCell>
                          {row.slice(0).map((value, colIndex) => (
                            <TableCell key={colIndex} sx={{ minWidth: '3px', padding: 0, fontSize: '3px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: rowIndex === 0 && colIndex >= 0 ? 'bold' : 'normal' }}>{value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                :
                <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                  <Table aria-label="simple table">
                    <TableBody>
                      <TableRow sx={{ padding: 0, backgroundColor: "#dedede" }}>
                        <TableCell sx={{ fontSize: '5px', padding: 0, textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                        {sampleRows[0]?.slice(0).map((column, index) => (
                          <TableCell key={index} sx={{ fontSize: '5px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', padding: 0 }} align="left">
                            {column}
                          </TableCell>
                        ))}
                      </TableRow>
                      {sampleRows.slice(1).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          <TableCell sx={{ backgroundColor: "#dedede", minWidth: '3px', padding: 0, fontSize: '5px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>{rowIndex + 1}</TableCell>
                          {row.slice(0).map((value, colIndex) => (
                            <TableCell key={colIndex} sx={{ minWidth: '30px', padding: 0, fontSize: '5px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: rowIndex === 0 && colIndex >= 0 ? 'bold' : 'normal' }}>{value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                  }
                

              </Box>
              <Typography variant="body1" sx={{
                wordBreak: 'break-word',
                opacity: 0.8,
                mt: "10px",
                mb: "10px",
                textAlign: "center"
              }}>
                {"Example_Product_Upload.xlsx"}
              </Typography>
              <Box sx={{
                display: "flex",
                justifyContent: "center"
              }}>
                <img src="/sucess_sample.png" width="35px" />
                <Typography style={{ color: "#01c42b", paddingLeft: "10px", fontWeight: 500 }}>Ready</Typography></Box>
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mt: "20px"
            }}
              onClick={() => handleDivClick('paid')}
            >
              <FormControlLabel value="paid" control={<Radio checked={selectedValue === 'paid'} />} sx={{
                opacity: 0.8,
                marginRight: "0px"
              }} />
              <lable style={{ fontWeight: "bold", opacity: 0.8 }}>Download & Use Template File</lable>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                border: "2px dashed #FB9005",
                m: "10px 10px 35px 10px",
                borderRadius: "10px",
                textAlign: "center"
              }}
            >
              {/* <Box><img src="/paid_user_image.png"  width={"190px"} height={"140px"}/></Box> */}
              <Box>
                <Typography
                  sx={{
                    padding: {
                      xs: "14px 42px 0px 42px"
                    }
                  }}
                >Download this example file & edit with your own data</Typography>
                {!uploadState.paid ?
                  <Typography style={{ marginTop: '15px', marginBottom: "15px", fontSize: '16px' }}>
                    <Link style={{ color: 'orange' }} href="/Example_Product_Upload.xlsx">Download File
                    </Link>
                  </Typography> :
                  <Typography style={{ marginTop: '15px', marginBottom: "15px", fontSize: '16px' }}>
                    <Link style={{ color: 'orange' }} href="/paid_product_example.xlsx">Download Sample file
                    </Link>
                  </Typography>
                }
              </Box>
              <input
                type="file"
                id="chooseFile"
                accept=".xls, .xlsx, .csv"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              {!monthLimit ?
                (<>
                  <Button
                    htmlFor="chooseFile"
                    size={"large"}
                    variant="contained"
                    component="label"
                    className="browseBtn"
                    disabled
                    sx={{ m: "25px" }}
                    onClick={() => { setSelectedValue('paid') }}
                  >
                    <CloudUploadOutlinedIcon />
                    <Box sx={{ ml: "10px" }}><label htmlFor="chooseFile" className="fileLabel">
                      Upload File
                    </label></Box>
                  </Button>
                </>
                )
                : (<>
                  <Button
                    htmlFor="chooseFile"
                    size={"large"}
                    variant="contained"
                    component="label"
                    className="browseBtn"
                    sx={{ m: "25px" }}
                    onClick={() => { setSelectedValue('paid') }}
                  >
                    <CloudUploadOutlinedIcon />
                    <Box sx={{ ml: "10px" }}><label htmlFor="chooseFile" className="fileLabel">
                      Upload File
                    </label></Box>
                  </Button>
                </>)}
            </Box>
          </RadioGroup>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <InfoOutlinedIcon />
        <Typography
          sx={{
            paddingLeft: {
              xs: "14px",
              opacity: 0.8
            },
            fontSize: {
              xs: "12px",
              sm: "14px"
            },
            lineHeight: 1.2,
            fontWeight: 800
          }}
        >
          Working with spreadsheets on mobile can be difficult. For the best experience, we recommend using ContentHubGPT on Desktop.
        </Typography>
      </Box>
    </Box>
  )
}
      <Modal
        open={modalOpen}
        onClose={handleClose}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { md: 1000, xs: "85%" },
            bgcolor: "background.paper",
            border: "1px solid #000",
            borderRadius: "10px",
            boxShadow: 24,
          }}>
          <Grid sx={{ maxHeight: "500px", overflowY: "auto" }}>
            {/* <Modaltable firstTenRows={sampleRows}></Modaltable> */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', padding: 0, textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                    {sampleRows[0]?.map((column, index) => (
                      <TableCell key={index} sx={{ fontSize: '10px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', padding: 0 }} align="left">
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sampleRows.slice(1).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell sx={{ minWidth: '50px', padding: 0, fontSize: '10px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>{rowIndex + 1}</TableCell>
                      {row.map((value, colIndex) => (
                        <TableCell key={colIndex} sx={{ minWidth: colIndex === 4 ? '300px' : colIndex === 0 ? '70px' : '100px', padding: 0, fontSize: '10px', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', fontWeight: rowIndex === 0 && colIndex >= 0 ? 'bold' : 'normal', verticalAlign: 'top' }}>{value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid container>
            <Grid item xs={2}>
              <Item>
                <Typography>&nbsp;</Typography>
              </Item>
            </Grid>
            <Grid item xs={8}>
              <Item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClose}
                  sx={{
                    marginRight: "5px",
                    borderRadius: "5px",
                  }}
                >
                  Close
                </Button>

              </Item>
            </Grid>

          </Grid>
        </Box>
      </Modal>
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
        open={monthSnackbar}
        autoHideDuration={null}
        onClose={handleSnackbarClose}>
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>"You have reached your monthly limit. Please Visit the <Link style={{ color: "red" }} href="/pricing">pricing page</Link> to upgrade your plan."</AlertTitle>
        </Alert>
      </Snackbar>
{
  uploadState.selectedFile && windowSize <= 768 ? (
    <Link
      href={{
        pathname: '/enhancementPage',
      }}
    >
      <Button
        htmlFor="chooseFile"
        size={"large"}
        variant="contained"
        component="label"
        className="sticky-button-new"
        sx={{
          // m: "25px",
          position: "fixed",
          bottom: 100,
          left: 24,
          borderRadius: "10px",
          width: "88%"
        }}
      >
        <Box sx={{ ml: "10px" }}>
          <label htmlFor="chooseFile" className="fileLabel">
            Proceed
          </label>
        </Box>
      </Button>
    </Link>
  ) : (windowSize <= 768 && (
    <Button
      htmlFor="chooseFile"
      size={"large"}
      variant="contained"
      component="label"
      className="sticky-button-new"
      sx={{
        position: "fixed",
        bottom: 100,
        left: 24,
        borderRadius: "10px",
        width: "88%",
        fontWeight: "700",
        bgcolor: "#bdbdbd !important"
      }}
      disabled
    >
      <Box sx={{ ml: "10px" }}>
        <label htmlFor="chooseFile" className="fileLabel">
          Proceed
        </label>
      </Box>
    </Button>
  ))
}
    </Root >
  );
}
export default UploadFilePage;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {}
    }
  }
  const { user } = session;
  if (user.realm && user.realm == "walmart") {
    return {
      props: { user },
      redirect: {
        destination: "/walmart/dashboard"
      }
    }
  }
  else {
    return {
      props: { user }
    }
  }

}