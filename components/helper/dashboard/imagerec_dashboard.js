import React, { useEffect, useState } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import {
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";
import "dotenv";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedFile,
  setPaid,
  setPremium,
} from "../../../store/uploadSlice";
import cookie from "js-cookie";
import * as XLSX from "xlsx";

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

function UploadFilePage({ user }) {
  const { data: session, status, update } = useSession();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [warnSnackbar, setwarnSnackbar] = useState(false);
  const [monthSnackbar, setMonthSnackbar] = useState(false);
  const [monthLimit, setMonthLimit] = useState(true);
  const uploadUrl = process.env.UPLOAD_URL;
  const router = useRouter();
  const dispatch = useDispatch();
  const uploadState = useSelector((state) => state.uploadpage);

  useEffect(() => {
    if (session && !session.user.terms) {
      update({ ...session, terms: cookie.get("rememberMe") });
      session.user.terms = cookie.get("rememberMe");
    }

    if (user.newUser) {
      router.push({
        pathname: "/profile",
        query: {
          profile_message: "Please update your profile to continue",
        },
      });
    }

    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/profile", {
        headers: {
          Authorization: user?.id_token,
        },
      })
      .then((res) => {
        // console.log('result', res)
        // console.log(user?.id_token)
        if (res.data.paidUser == true) {
          dispatch(setPaid(true));
          if (
            res.data.planCode == "chgpt-premium"
          ) {
            dispatch(setPremium(true));
          }
        }

        if (res.data.monthlyLimit <= 0) {
          setMonthLimit(false);
          setMonthSnackbar(true);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data == "Unauthorized") {
          signOut({redirect: false});
        }
      });
  }, [status]);

  const handleFileChange = (event) => {
    if (!monthLimit) return;
    const file = event.target.files[0];
    setFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (!monthLimit) return;
    const file = event.dataTransfer.files[0];
    // validateFile(file);
    setFile(file);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    if (!monthLimit) return;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const imagefunction = () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };
      axios
        .post(
          process.env.NEXT_PUBLIC_BASE_URL + "/img/image/recognition",
          // process.env.NEXT_PUBLIC_BASE_URL + "/standalone/upload/excel/v1",
          formData,
          config
        )
        .then((response) => {
          // console.log('response', response)
          setLoading(false);
          router.push({
            pathname: "/dashboard/img_rec_download",
            query: {
              name: response.data.file_name,
              taskId: response.data.task_id,
            },
          });
        })
        .catch((error) => {
          // console.log("Image rec error", error);
          setLoading(false);
          setErrorMsg((error?.response?.data?.errors).join("\n"));
          setFile(null);
          setSnackbarOpen(true);
        })
        .finally(() => {
          // setLoading(false);
          // console.log("done uploading");
        });
    } else {
      setwarnSnackbar(true);
    }
  };

  return (
    <Root className="root" style={{ display: "flex", flexDirection: "column" }}>
      <>
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
                  padding: "30px",
                }}
              >
                <Typography
                  style={{ fontSize: "20px", color: "black" }}
                  variant="body1"
                >
                  <strong>Add Image Spreadsheet</strong>
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
                      {loading ? (
                        <CircularProgress disableShrink /> // Display the circular progress when loading is true
                      ) : file ? (
                        <img src="/sucess.png" alt="Success" /> // Display the success image when a file is selected
                      ) : (
                        <img src="/folder_image.png" alt="Folder" /> // Display the folder image when no file is selected
                      )}
                      <Typography
                        variant="body1"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {loading
                          ? "Validating your file..."
                          : file
                          ? file.name
                          : "Drop File here"}
                      </Typography>
                    </Box>
                    <Typography>or</Typography>
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
                          variant={file ? "outlined" : "contained"}
                          component="label"
                          className="browseBtn"
                          disabled
                          style={{ width: "100%" }}
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
                          variant={file ? "outlined" : "contained"}
                          component="label"
                          className="browseBtn"
                          style={{ width: "100%" }}
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
                    style={{ color: "#022149", textDecoration: "none" }}
                    href="/Image_Rec_Sample.xlsx"
                  >
                    Try It!{" "}
                    <strong style={{ textDecoration: "none" }}>
                      Download Sample File
                    </strong>
                  </Link>
                </Typography>
              ) : (
                <Typography style={{ marginTop: "10px", fontSize: "16px" }}>
                  <Link
                    style={{ color: "#022149", textDecoration: "none" }}
                    href="/Image_Rec_Sample.xlsx"
                  >
                    Try It!{" "}
                    <strong style={{ textDecoration: "none" }}>
                      Download Sample File
                    </strong>
                  </Link>
                </Typography>
              )}
            </Box>
            <Typography style={{ textAlign: "end", marginTop: "20px" }}>
              Generate Results
              {file ? (
                <Button
                  style={{ borderRadius: "5px", marginLeft: "5px" }}
                  size="small"
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardOutlinedIcon />}
                  onClick={imagefunction}
                >
                  Generate
                </Button>
              ) : (
                <Button
                  style={{ borderRadius: "5px", marginLeft: "5px" }}
                  size="small"
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForwardOutlinedIcon />}
                  disabled
                >
                  Generate
                </Button>
              )}
            </Typography>
          </Grid>
        </Grid>
      </>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarOpen}
        autoHideDuration={null}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity="error"
          onClose={handleSnackbarClose}
          style={{ whiteSpace: "pre-line" }}
        >
          <AlertTitle>Error</AlertTitle>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Root>
  );
}
export default UploadFilePage;

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
