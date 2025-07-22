import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  SvgIcon,
  Modal
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";
import "dotenv";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from 'xlsx';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Progress from "./progressBar";
import useTaskProgress from "../components/helper/useTaskProgress";
import CircularWithValueLabel from "./circularProgress";
import Link from "next/link";
import ProgressTracker from "../components/feature/ProgressTracker";
import Paper from '@mui/material/Paper';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Modaltable from "../components/helper/Modaltable";
import Thumbnailtable from "../components/helper/Thumbnailtable";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));
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
    [theme.breakpoints.down("sm")]: {
      margin: 0,
    },
  },
  [`& .${"browseBtn"}`]: {
    marginTop: theme.spacing(1),
    borderRadius: "5px",
  },
  [`& .${"uploadBtn"}`]: {
    margin: theme.spacing(1),
    borderRadius: "5px",
  },
  [`& .${"uploadBtnGrey"}`]: {
    margin: theme.spacing(1),
    borderRadius: "5px",
    backgroundColor: "grey",
    "&:hover": {
      backgroundColor: "grey",
    },
  },
  [`& .${"checkBoxClass"}`]: {
    justifyContent: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  [`& .${"formBox"}`]: {
    marginTop: "20px",
    width: "83%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}));

function DownloadFilePage({ user }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const uploadState = useSelector((state) => state.uploadpage);
  const { name } = router.query;
  const encoded_name = encodeURIComponent(name);
  const { taskId } = router.query; //redis queue task id to track progress of async AI completion
  const [windowSize, setWindowSize] = useState(800);
  const [firstTenRows, setfirstTenRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    }
    window.addEventListener("resize", handleSize);
    handleSize();
  })
  let progress = 100
  if (taskId !== undefined) {
    progress = useTaskProgress(taskId, user);
  }
  const uploadUrl = process.env.UPLOAD_URL;


  const extractfirstTenRows = async () => {
    const config = {
      headers: {
        Authorization: user.id_token,
      },
    };

    try {
      if (progress < 100) return
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/standalone/fetch/result/v1?fileName=${encoded_name}`, config);

      const contentType = response.headers.get('content-type');
      if (contentType.includes('application/json')) {
        const jsonData = await response.json();
        if (response.status !== 200) {
          setErrorMsg(jsonData.message);
          setSnackbarOpen(true);
        }
      }
      else if (contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        const blobData = await response.blob();
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
          const firstTenRows = jsonData.slice(0, 11);

          setfirstTenRows(firstTenRows);
          const newRow = Array.from({ length: firstTenRows[0].length }, (_, index) => String.fromCharCode(65 + index));
          firstTenRows.unshift(newRow);
        };
        reader.readAsArrayBuffer(blobData);
      }
      else {
        throw new Error('Unsupported content type.');
      }
    } catch (error) {
      console.log('download page error', error?.response?.data?.message);
    }
  };

  useEffect(() => {
    extractfirstTenRows();
  }, [progress])
  const handleClose = () => setOpen(false);
  const handleDownload = async (req) => {
    const config = {
      headers: {
        Authorization: user.id_token,
      },
      // responseType: 'blob'
    };
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/standalone/fetch/result/v1?fileName=${encoded_name}`, config);
      const contentType = response.headers.get('content-type');

      if (contentType.includes("application/json")) {
        const jsonData = await response.json();
        if (response.status != 200) {
          setErrorMsg(jsonData.message);
          setSnackbarOpen(true);
        }
      } else if (
        contentType.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      ) {
        // Handle Blob response
        const blobData = await response.blob();
        const fileNameWithoutExtension = name.replace(/\.[^/.]+$/, "");
        const modifiedFileName = fileNameWithoutExtension.substring(
          fileNameWithoutExtension.indexOf("_") + 1
        );
        const url = window.URL.createObjectURL(blobData);
        const link = document.createElement("a");
        link.href = url;
        link.download = modifiedFileName;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        link.parentNode.removeChild(link);
      } else {
        throw new Error("Unsupported content type.");
      }
    } catch (error) {
      console.log("download page error", error?.response?.data?.message);
    }
  }

  const handleOpen = () => {
    setOpen(true)
  };

  return (
    <Root
      className="root"
      style={{
        display: "flex",
        flexDirection: "column",
        margin: windowSize > 768 ? "24px" : "0px",
      }}
    >
      {windowSize > 768 ? (
        <Progress active={progress < 100 ? 2 : 3} />
      ) : (
        <ProgressTracker active={progress < 100 ? 2 : 3} />
      )}
      {windowSize > 768 ? 
        <>
          <Typography className="content" variant="h6">
            {progress < 100
              ? "Results are being generated"
              : "Results are Ready"}

            <Typography sx={{ marginTop: "5px" }}>
              {progress < 100
                ? "The Download link will be sent to your email"
                : "The Download link has been sent to your email"}
            </Typography>
          </Typography>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8}>
              <Box className="uploadBox">
                <Box
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "30px",
                  }}
                >
                  <Typography
                    style={{ fontSize: "20px", color: "black" }}
                    variant="body1"
                  >
                    <strong>
                      {progress < 100 ? "Generating..." : "Download File"}
                    </strong>
                  </Typography>
                  <Typography variant="body2" className="textInBox">
                    {progress < 100 ? "in process" : "download here"}
                  </Typography>
                  <Box className="inputBox">
                    <Box sx={{ width: { xs: '100%', sm: '100%', md: '50%' } }}>
                      {open ? (
                        <Modal
                          keepMounted
                          open={open}
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
                            }}
                          >
                            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                              <Modaltable firstTenRows={firstTenRows}></Modaltable>
                            </div>
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
                      ) : (
                        <Box sx={{ border: '1px dashed grey', padding: '13px', borderRadius: '10px', padding: '30px', margin: "16px 0px 8px 0px", backgroundColor: '#F9F9FB', color: '#7B89B2',position:'relative' }}>
                                                    {/* {progress == 100 ? <ZoomInIcon onClick={handleOpen} sx={{ position: 'absolute', top: 0,right:0, fontSize: '40px', cursor: 'pointer' }} /> : <></>} */}
                          <>
                            {progress < 100 ?
                              <div style={{ position: 'relative' }}>
                                <img src="/Ellipse.png" alt="Background Image" />
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                >
                                  <CircularWithValueLabel progress={progress} />
                                </div>
                              </div>
                              :
                              <div onClick={handleOpen} style={{ maxHeight: "200px", overflowY: "auto",cursor:'pointer' }}
                              onMouseEnter={() => setTooltipVisible(true)}
                              onMouseLeave={() => setTooltipVisible(false)}
                              >
                              <Box className="tooltip" sx={{display: isTooltipVisible ? 'block' : 'none',position:'absolute',top:50,right:50, backgroundColor:'#737171',padding:'3px', color:'white',borderRadius:'3px',fontSize:'10px'}}>Click to preview contents</Box>
                              <ZoomInIcon onClick={handleOpen} sx={{ position: 'absolute', top: 0,right:0, fontSize: '40px', cursor: 'pointer' }} />
                            <Thumbnailtable firstTenRows={firstTenRows}></Thumbnailtable>
                            </div>
                            }
                          </>
                        </Box>
                      )}
                      <Button
                        size={"large"}
                        variant="contained"
                        component="label"
                        className="browseBtn"
                        style={{ width: "100%" }}
                        disabled={progress < 100}
                        onClick={handleDownload}
                      >
                        <label htmlFor="chooseFile" className="fileLabel">
                          Download
                        </label>
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <>
                {progress < 100 ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginTop: "5px",
                    }}
                  >
                    <Button
                      style={{ borderRadius: "5px", marginLeft: "5px" }}
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={progress < 100}
                    >
                      Start New
                    </Button>
                  </div>
                ) : (
                  <Link
                    href="/uploadpage"
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      marginTop: "5px",
                      textDecoration: "none",
                    }}
                  >
                    <Button
                      style={{ borderRadius: '5px', marginLeft: '5px' }}
                      size="small"
                      variant="contained"
                      color="primary"
                      disabled={progress < 100}
                    >
                      Start New
                    </Button>
                  </Link>
                )}
              </>

            </Grid>
          </Grid>
        </> : <>
          <Typography sx={{ color: "#FB9005", fontWeight: "bold", textTransform: "uppercase", marginTop: "12px", marginLeft: "18px"}}> Result </Typography>
          <Typography variant="h6" sx={{ margin: "0", fontSize: "18px", opacity: 0.7, fontWeight: 400, ml: "18px", mt: "20px" }}>
            {progress < 100 ? "Results are being generated and will be ready to download shortly." : "Results are Ready"}

            <Typography sx={{ marginTop: '5px', display: "flex", flexDirection: "row", mb: "14px", fontWeight: "500" }}>
            <SvgIcon sx={{
              width: "20px",
              height: "20px"
            }}>
              <svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.1338 0.88235c0.60719-1.1765 2.1252-1.1765 2.7324-2e-6l5.9201 11.471c0.6072 1.1765-0.1518 2.6471-1.3662 2.6471h-11.84c-1.2144 0-1.9734-1.4706-1.3662-2.6471l5.9201-11.471z" fill="#F8D000"/>
              <path d="m8.3414 9.3929h-1.4555l-0.20193-4.3482h1.8594l-0.20192 4.3482zm-1.6238 1.6095c0-0.3263 0.08693-0.5553 0.26081-0.6871 0.17949-0.1318 0.38983-0.1977 0.63102-0.1977 0.23557 0 0.4375 0.0659 0.60577 0.1977 0.17388 0.1318 0.26082 0.3608 0.26082 0.6871 0 0.3074-0.08694 0.5301-0.26082 0.6682-0.16827 0.138-0.3702 0.207-0.60577 0.207-0.24119 0-0.45153-0.069-0.63102-0.207-0.17388-0.1381-0.26081-0.3608-0.26081-0.6682z" fill="#001E48"/>
              </svg>
            </SvgIcon> <Typography fontSize="14px" ml="10px" fontWeight="500">NOTE: &nbsp; View Excel results on desktop for optimal experience due to large data quantity.</Typography>
            </Typography>
          </Typography>
          <Grid container justifyContent="center" mt="22px">
            <Grid item xs={12} sm={8}>
              <Box className="uploadBox" sx={{
                bgcolor: "white !important",
                boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
              }}>
                  <Typography style={{ fontSize: '20px', color: 'black', marginBottom: "20px" }} variant="body1"><strong>{progress < 100 ? "Generating..." : "DOWNLOAD"}</strong></Typography>
                  <Typography variant="body2" className="textInBox">
                    {progress < 100 ? "in process" : "Tap preview below to enlarge"}
                  </Typography>
                  <Box className="inputBox">
                    <Box sx={{
                      width: {
                        xs: "100%",
                        sm: "100%",
                        md: "50%",
                      },
                    }}
                  >
                    {open ? (
                      <Modal
                        keepMounted
                        open={open}
                        onClose={handleClose}
                      >
                        <Box>
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: { md: 600, xs: "85%" },
                              bgcolor: "background.paper",
                              border: "1px solid #000",
                              borderRadius: "10px",
                              boxShadow: 24,
                            }}
                          >
                            <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                              <Modaltable firstTenRows={firstTenRows}></Modaltable>
                            </div>
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
                        </Box>
                        {/* <Button>Done</Button> */}
                      </Modal>
                    ):(
                    <Box
                      sx={{
                        border: "1px dashed grey",
                        padding: "13px",
                        borderRadius: "10px",
                        padding: "30px",
                        margin: "16px 0px 8px 0px",
                        backgroundColor: "#F9F9FB",
                        color: "#7B89B2",
                        position:'relative'
                      }}
                    >
                      <>
                        {progress < 100 ? (
                          <div style={{ position: "relative" }}>
                            <img src="/Ellipse.png" alt="Background Image" />
                            <div
                              style={{
                                position: "absolute",
                                top: "50%", // Adjust this value to vertically center the CircularProgress
                                left: "50%", // Adjust this value to horizontally center the CircularProgress
                                transform: "translate(-50%, -50%)", // Center the CircularProgress
                              }}
                            >
                              <CircularWithValueLabel progress={progress} />
                            </div>
                          </div>
                        ) : (
                          <Box onClick={handleOpen} style={{ maxHeight: "200px", overflowY: "auto" }}>
                            {progress == 100 ? <ZoomInIcon  sx={{ position: 'absolute', top: 0,right:0, fontSize: '40px', cursor: 'pointer' }} /> : <></>}
                            <Thumbnailtable firstTenRows={firstTenRows}></Thumbnailtable>
                            </Box>
                        )}
                      </>
                    </Box>)}
                    <Button
                      size={"large"}
                      variant="contained"
                      component="label"
                      className="browseBtn"
                      style={{ width: "100%" }}
                      disabled={progress < 100}
                      onClick={handleDownload}
                    >
                      <label htmlFor="chooseFile" className="fileLabel">
                        Download
                      </label>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mt: "25px",
            }}
          >
            <InfoOutlinedIcon />
            <Typography
              sx={{
                paddingLeft: {
                  xs: "14px",
                  opacity: 0.8,
                },
                fontSize: {
                  xs: "12px",
                  sm: "14px",
                },
                lineHeight: 1.2,
                fontWeight: 800,
              }}
            >
              Working with spreadsheets on mobile can be difficult. For the best
              experience, we recommend using ContentHubGPT on Desktop.
            </Typography>
          </Box>
        </>
      }
    </Root>
  );
}
export default DownloadFilePage;

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
