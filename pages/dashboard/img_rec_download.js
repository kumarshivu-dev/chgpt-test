import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  Grid,
  Snackbar,
  Alert,
  AlertTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";
import "dotenv";
import { useDispatch, useSelector } from "react-redux";
import useTaskProgress from "../../components/helper/useTaskProgress";
import CircularWithValueLabel from "../circularProgress";
import Link from "next/link";
import axios from "axios";

const Root = styled("div")(({ theme }) => ({
  [`&.${"root"}`]: {
    margin: theme.spacing(3),
  },
  [`& .${"uploadBox"}`]: {
    backgroundColor: "#ECF0FF",
    color: "black",
    borderRadius: "10px",
    padding: theme.spacing(4),
    textAlign: "center",
  },
  [`& .${"newUploadBox"}`]: {
    backgroundColor: "#ECF0FF",
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
  const [progress, setProgress] = useState(100);
  const { name } = router.query;
  const encoded_name = encodeURIComponent(name);
  const { taskId } = router.query; //redis queue task id to track progress of async AI completion
  let progressVal = 100;

  if (taskId !== undefined) {
    progressVal = useTaskProgress(taskId, user);
  }

  useEffect(() => {
    setProgress(progressVal);
  }, [progressVal]);
  const uploadUrl = process.env.UPLOAD_URL;

  const handleDownload = async (req) => {
    const config = {
      headers: {
        Authorization: user.id_token,
      },
      // responseType: 'blob'
    };
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL +
          `/img/image/result?fileName=${encoded_name}`,
        config
      );

      const contentType = response.headers.get("content-type");

      if (contentType.includes("application/json")) {
        const jsonData = await response.json();
        // console.log('JSON Response:', jsonData);
        if (response.status != 200) {
          // setErrorMsg(jsonData.message)
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
        link.download = modifiedFileName + ".xlsx";
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
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleClose = () => {
    setProgress(0);
  };

  return (
    <Root className="root" style={{ display: "flex", flexDirection: "column" }}>
      <>
        <Typography className="content" variant="h6">
          {progress < 100 ? "Results are being generated" : "Results are Ready"}

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
                      <>
                        {progress < 100 ? (
                          <div style={{ position: "relative" }}>
                            <img src="/Ellipse.png" alt="Background Image" />

                            {/* CircularProgress as an overlay */}
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
                          <img src="/download_icon.svg"></img>
                        )}
                      </>
                    </Box>
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
                    variant="outlined"
                    color="primary"
                    disabled={progress < 100}
                  >
                    Start New
                  </Button>
                </div>
              ) : (
                <Link
                  href="/dashboard/products"
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "5px",
                    textDecoration: "none",
                  }}
                >
                  <Button
                    style={{ borderRadius: "5px", marginLeft: "5px" }}
                    size="small"
                    variant="outlined"
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
      </>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={progress == null}
        autoHideDuration={null}
        onClose={handleClose}
      >
        <Alert
          severity="error"
          onClose={handleClose}
          style={{ whiteSpace: "pre-line" }}
        >
          <AlertTitle>Error</AlertTitle>
          Task failed!. Please check the URLs in your file
        </Alert>
      </Snackbar>
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
