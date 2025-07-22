import React, { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import Progress from "./progressBar";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import Link from "next/link";
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedFile, setPaid } from "../store/uploadSlice";
import "dotenv";
import { useRouter } from "next/router";
import ProgressTracker from "../components/feature/ProgressTracker";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));
const Root = styled("div")(({ theme }) => ({
  // [`&.${"root"}`]: {
  //     margin: theme.spacing(3),
  // },
  [`& .${"uploadBox"}`]: {
    backgroundColor: "#FFEAD0",
    color: "black",
    borderRadius: "10px",
    // padding: theme.spacing(4),
    padding: "16px 32px 32px 32px",
    textAlign: "center",
  },
  [`& .${"newUploadBox"}`]: {
    backgroundColor: "gainsboro",
    color: "gray",
    borderRadius: "10px",
    padding: "16px 32px 32px 32px",
    textAlign: "center",
  },
  [`& .${"mobuploadBox"}`]: {
    backgroundColor: "#FFFFF",
    color: "black",
    borderRadius: "10px",
    padding: "16px 32px 32px 32px",
    textAlign: "center",
  },
  [`& .${"mobNewUploadBox"}`]: {
    backgroundColor: "#ffead0",
    color: "gray",
    borderRadius: "10px",
    padding: "16px 32px 32px 32px",
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
  [`& .${"newTextInBox"}`]: {
    fontSize: 16,
    color: "grey",
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

function Enhancementpage({ user }) {
  const { data: session, status } = useSession();
  const [content, setContent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [existingTaxonomy, setExistingTaxonomy] = useState("");
  const [seo, setSeo] = useState(false);
  const [seoTextBox, setSeoTextBox] = useState(false);
  const [taxonomy, setTaxonomy] = useState(false);
  const [taxonomyFile, setTaxonomyFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpenSuccess, setSnackbarOpenSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [ErrorsnackbarOpen, setErrorsnackbarOpen] = useState(false);
  const [checkBoxSnackbar, setCheckBoxSnackbar] = useState(false);
  const [KeywordsError, setKeywordsError] = useState(false);
  const [keywordsCount, setKeywordsCount] = useState(0);
  const [taxonomyError, setTaxonomyError] = useState(false);
  const [completeSnackbar, setCompleteSnackbar] = useState(false);
  const [warnSnackbar, setwarnSnackbar] = useState(false);
  const dispatch = useDispatch();
  const uploadState = useSelector((state) => state.uploadpage);
  const [LimitErrorsnackbarOpen, setLimitErrorsnackbarOpen] = useState(false);
  const [limitError, setLimitError] = useState("");
  const [domLoaded, setDomLoaded] = useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [windowSize, setWindowSize] = useState(800);
  const [basicPlan, setBasicPlan] = useState(false)
  // To fetch window screen width

  useEffect(() => {
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    handleSize();
  });
  useEffect(() => {
    setDomLoaded(true);
    !uploadState.selectedFile ? router.push("/uploadpage") : "";
  }, []);
  useEffect(() => {
    fetchExistingKeywords();
    // fetchExistingTaxonomy();
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/profile", {
        headers: {
          Authorization: user?.id_token,
        },
      })
      .then((res) => {
        // removing this line as we need to keep the content as true by default for both paid and unpaid

        // if (res.data.paidUser == false) {
        //   setContent(true);
        // }
        if(res.data.planCode == 'chgpt-basic' || res.data.planCode == 'chgpt-basic-monthly'){
          setBasicPlan(true);
        }
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data == "Unauthorized") {
          signOut({redirect: false});
        }
      });
  }, [status]);
  useEffect(() => {
    fetchExistingTaxonomy();
  }, [taxonomy]);
  const handleOpen = () => {
    setSeoTextBox(true);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleInputChange = (event) => {
    const keywordsList = event.target.value
      .split(",")
      .map((keyword) => keyword.trim());
    setKeywordsCount(keywordsList.length);
    console.log("first", keywordsList.length);
    if (keywordsList.length > 125) {
      setLimitError("Maximum limit of 125 keywords exceeded.");
      setLimitErrorsnackbarOpen(true);
    } else {
      setKeywords(event.target.value);
    }
  };

  const fetchExistingKeywords = async () => {
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/standalone/fetch/keywords", {
        headers: {
          Authorization: user.id_token,
        },
      })
      .then((response) => {
        const existingKeywords = response.data.keywords.join(", ");

        setKeywords(existingKeywords);
        const keywordsList = existingKeywords
          .split(",")
          .map((keyword) => keyword.trim());
        setKeywordsCount(keywordsList.length);
        // handleInputChange()
      })
      .catch((err) => {
        console.error("Error fetching existing keywords:", err);
        if (err?.response?.data == "Unauthorized") {
          signOut({redirect: false});
        }
      });
  };

  const fetchExistingTaxonomy = async () => {
    if(taxonomy === false)
        return ;
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/standalone/fetch/taxonomy", {
        headers: {
          Authorization: user.id_token,
        },
      })
      .then((response) => {
        // handleInputChange()
        if (response.status == 200) {
          setExistingTaxonomy(response.data.file);
          console.log(existingTaxonomy);
        }
      })
      .catch((err) => {
        console.error("Error fetching existing Taxonomy:", err);
      });
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    dispatch(setSelectedFile(file));
  };
  const handleFileChangeTaxonomy = (event) => {
    const file = event.target.files[0];
    setTaxonomyFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    dispatch(setSelectedFile(file));
  };
  const handleDropTaxonomy = (event) => {
    event.preventDefault();
    if (!uploadState.paid || !uploadState.premium || !taxonomy) return;
    const file = event.dataTransfer.files[0];
    setTaxonomyFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDragOverTaxonomy = (event) => {
    event.preventDefault();
    if (!uploadState.paid || !uploadState.premium || !taxonomy) return;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setErrorsnackbarOpen(false);
    setLimitErrorsnackbarOpen(false);
    setwarnSnackbar(false);
    setCheckBoxSnackbar(false);
    setKeywordsError(false);
    setTaxonomyError(false);
    setSnackbarOpenSuccess(false);
    setCompleteSnackbar(false);
    setLoading(false);
  };

  useEffect(() => {
    if (taxonomyFile !== null) {
      handleTaxonomyUpload();
    }
  }, [taxonomyFile]);
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

    axios
      .post(
        process.env.NEXT_PUBLIC_BASE_URL + "/standalone/upload/keywords",
        { keywords },
        config
      )
      .then((response) => {
        console.log("Keywords uploaded successfully");
        setSnackbarOpenSuccess(true);
        setSuccessMsg("Keywords uploaded successfully");
      })
      .catch((error) => {
        console.error("Error uploading keywords:", error);
        setErrorsnackbarOpen(true);
        setErrorMsg(error);
      });
  };

  const handleTaxonomyUpload = () => {
    if (taxonomyFile) {
      setLoading(true);
      console.log("File selected");
      const formData = new FormData();
      formData.append("file", taxonomyFile);
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };

      axios
        .post(
          process.env.NEXT_PUBLIC_BASE_URL + "/standalone/upload/taxonomy",
          formData,
          config
        )
        .then((response) => {
          console.log("response", response);
          setCompleteSnackbar(true);
          console.log("Taxonomy file uploaded");
        })
        .catch((error) => {
          console.log("taxonomy page error", error);
          setTaxonomyFile(null);
          setErrorMsg(
            error?.response?.data?.error ||
              error?.response?.data?.message ||
              "Some error occured, please try again"
          );
          setLoading(false);
          setSnackbarOpen(true);
          setTaxonomy(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setwarnSnackbar(true);
    }
  };
  const handleUpload = () => {
    if (uploadState.selectedFile) {
      if (uploadState.paid && !content && !seo && !taxonomy) {
        setCheckBoxSnackbar(true);
        return;
      }
      if (uploadState.paid && seo) {
        if (keywords == "") {
          setKeywordsError(true);
          return;
        }
      }
      const formData = new FormData();
      formData.append("file", uploadState.selectedFile);
      formData.append("doSEO", seo);
      formData.append("doContent", content);
      formData.append("doTaxonomy", taxonomy);
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };
      axios
        .post(
          process.env.NEXT_PUBLIC_BASE_URL + "/standalone/upload/excel/v1",
          formData,
          config
        )
        .then((response) => {
          console.log("response", response);
          router.push({
            pathname: "/downloadpage",
            query: {
              name: response.data.file_name,
              taskId: response.data.task_id,
            },
          });
        })
        .catch((error) => {
          console.log("upload page error", error);
          if (
            error?.response?.data?.error === "Please upload a taxonomy file."
          ) {
            setTaxonomyError(true);
          } else {
            setErrorMsg(
              error?.response?.data?.error ||
                error?.response?.data?.message ||
                "Some error occured, please try again"
            );
            setSnackbarOpen(true);
          }
          // setLoading(false);
        })
        .finally(() => {
          // setLoading(false);
          console.log("done uploading");
        });
    } else {
      setwarnSnackbar(true);
    }
  };

  return (
    <>
      {domLoaded && (
        <Root
          className="root"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {windowSize > 768 ? (
            <Progress active={1} />
          ) : (
            <ProgressTracker active={1} />
          )}

          {windowSize > 768 ? (
            <Box>
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  padding: "0px 16px",
                }}
              >
                <Grid item xs={12} sm={12} md={4}>
                  <Item>
                    <Typography className="content" variant="h6">
                      Select Product Enhancement
                    </Typography>
                  </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                  <Item
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-end" },
                      alignItems: "center",
                      padding: "0px",
                    }}
                  >
                    <Typography style={{ marginRight: "5px" }}>
                      Generate Results
                    </Typography>
                    <Button
                      style={{ borderRadius: "5px" }}
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={handleUpload}
                      endIcon={<ArrowForwardOutlinedIcon />}
                      disabled={
                        (!content && !seo && !taxonomy) ||
                        (content && !uploadState.selectedFile) ||
                        (seo && keywords.length === 0) ||
                        (taxonomy && !taxonomyFile && existingTaxonomy == "") ||
                        loading
                      }
                    >
                      Generate
                    </Button>
                  </Item>
                </Grid>
              </Grid>

              <Grid container justifyContent="center" sx={{ display: "flex" }}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Item sx={{ height: "100%" }}>
                    <Grid
                      sx={{ height: "100%" }}
                      className={"uploadBox"}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <Grid
                        className="descriptionSection"
                        sx={{
                          marginBottom: { xs: "20px", md: "20px" },
                          minHeight: { xs: "auto", md: "160px" },
                        }}
                      >
                        <Grid
                          container
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography>
                            <strong>Content Generation</strong>
                          </Typography>

                          <Switch
                            checked={content}
                            onChange={(e) => setContent(e.target.checked)}
                          />
                        </Grid>
                        <Typography style={{ textAlign: "left" }}>
                          Creates product descriptions and feature bullets,
                          optionally using keyword hints you supply.
                        </Typography>
                      </Grid>
                      <Grid className="whiteSection">
                        <Typography
                          sx={{
                            borderRadius: "21.024px 21.024px 0px 0px",
                            backgroundColor: content ? "#23BF6E" : "white",
                          }}
                        >
                          <>
                            {content ? (
                              <Typography style={{ color: "white" }}>
                                Ready for generation
                              </Typography>
                            ) : (
                              <Typography>&nbsp;</Typography>
                            )}
                          </>
                        </Typography>

                        <Grid
                          style={{
                            backgroundColor: "white",
                            borderRadius: "0px 0px 10px 10px",
                            padding: "10px 30px 30px 30px",
                          }}
                        >
                          <Grid
                            className="textArea"
                            sx={{ minHeight: { xs: "auto", md: "100px" } }}
                          >
                            <Typography
                              style={{ fontSize: "20px", color: "black" }}
                              variant="body1"
                            >
                              <strong>Add File</strong>
                            </Typography>
                            <Typography variant="body2" className="textInBox">
                              Drag and drop your file
                            </Typography>
                          </Grid>
                          <Grid sx={{ width: "100%" }}>
                            <Grid
                              className="classessss"
                              sx={{
                                border: "1px dashed grey",
                                padding: "13px",
                                borderRadius: "10px",
                                padding: "30px",
                                margin: "16px 0px 8px 0px",
                                backgroundColor: "#F9F9FB",
                                color: "#7B89B2",
                                height: { xs: "200px", md: "200px" },
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {uploadState.selectedFile ? (
                                <img src="/sucess.png"></img>
                              ) : (
                                <img src="/folder_image.png"></img>
                              )}
                              {uploadState.selectedFile ? (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    wordBreak: "break-word",
                                    overflow: "hidden",
                                  }}
                                >
                                  {/* File selected: {uploadState.selectedFile.name} */}
                                  {uploadState.selectedFile.name}
                                </Typography>
                              ) : (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    wordBreak: "break-word",
                                    overflow: "hidden",
                                  }}
                                >
                                  Drop File here
                                </Typography>
                              )}
                            </Grid>
                            {/* </Box> */}
                            <Typography>or</Typography>
                            <input
                              type="file"
                              id="chooseFile"
                              accept=".xls, .xlsx, .csv"
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            />
                            <>
                              <Button
                                htmlFor="chooseFile"
                                size={"large"}
                                variant="contained"
                                component="label"
                                className="browseBtn"
                                style={{ width: "100%" }}
                              >
                                <label
                                  htmlFor="chooseFile"
                                  className="fileLabel"
                                >
                                  Reupload File
                                </label>
                              </Button>
                            </>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Item>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Item sx={{ height: "100%" }}>
                    <Grid
                      sx={{ height: "100%" }}
                      className={
                        (uploadState.paid && basicPlan==false) ? "uploadBox" : "newUploadBox"
                      }
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    >
                      <Grid
                        className="descriptionSection"
                        sx={{
                          marginBottom: { xs: "20px", md: "20px" },
                          minHeight: { xs: "auto", md: "160px" },
                        }}
                      >
                        <Grid
                          container
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography>
                            <strong>SEO</strong>
                          </Typography>

                          <Switch
                            checked={seo}
                            onChange={(e) => setSeo(e.target.checked)}
                            disabled={!uploadState.paid || basicPlan}
                          />
                        </Grid>
                        <Typography style={{ textAlign: "left" }}>
                          {" "}
                          Integrates SEO keywords from a master list with your
                          descriptions and features, but only if they are
                          related to the product.
                        </Typography>
                      </Grid>
                      <Grid className="whiteSection">
                        <Typography
                          sx={{
                            borderRadius: "21.024px 21.024px 0px 0px",
                            backgroundColor: seo
                              ? keywords.length > 0
                                ? "#23BF6E"
                                : "#DEDEDE"
                              : "white",
                          }}
                        >
                          <>
                            {seo ? (
                              keywords.length > 0 ? (
                                <Typography style={{ color: "white" }}>
                                  Ready for generation
                                </Typography>
                              ) : (
                                <Typography>
                                  Not Ready for generation
                                </Typography>
                              )
                            ) : (
                              <Typography>&nbsp;</Typography>
                            )}
                          </>
                        </Typography>
                        <Grid
                          style={{
                            backgroundColor: "white",
                            borderRadius: "0px 0px 10px 10px",
                            padding: "10px 30px 30px 30px",
                            position: "relative",
                          }}
                        >
                          <Grid
                            className="textArea"
                            sx={{ minHeight: { xs: "auto", md: "100px" } }}
                          >
                            <Typography
                              style={{
                                fontSize: "20px",
                                color: uploadState.paid ? "black" : "gray",
                              }}
                              variant="body1"
                            >
                              <strong>Add Keywords</strong>
                            </Typography>
                            <Typography
                              variant="body2"
                              className={
                                uploadState.paid ? "textInBox" : "newTextInBox"
                              }
                            >
                              Please supply in a comma separated list
                            </Typography>
                          </Grid>
                          <Grid sx={{ width: "100%" }}>
                            <TextField
                              className="classesss"
                              variant="outlined"
                              value={keywords}
                              onChange={handleInputChange}
                              fullWidth
                              margin="normal"
                              multiline // Enable multiline
                              onClick={handleOpen}
                              rows={6} // Set the number of rows (adjust as needed)
                              sx={{
                                border: "1px dashed black",
                                backgroundColor: "#F9F9FB",
                                borderRadius: "10px",
                                height: { xs: "200px", md: "200px" },

                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    border: "none", // Set the border color when not focused
                                  },
                                  "&.Mui-focused fieldset": {
                                    border: "none",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  border: "none", // Set the label color
                                  "&.Mui-focused": {
                                    border: "none", // Set the label color when focused
                                  },
                                },
                              }}
                              disabled={!uploadState.paid || !seo}
                            />
                            <Modal
                              keepMounted
                              open={open}
                              // onClose={handleClose}
                              aria-labelledby="keep-mounted-modal-title"
                              aria-describedby="keep-mounted-modal-description"
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
                                  <TextField
                                    variant="outlined"
                                    value={keywords}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="0"
                                    multiline
                                    rows={14} // Set the number of rows (adjust as needed)
                                    sx={{
                                      // border: '1px solid black',
                                      borderRadius: "10px",

                                      "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                          border: "none", // Set the border color when not focused
                                        },
                                        "&.Mui-focused fieldset": {
                                          border: "none",
                                        },
                                      },
                                      "& .MuiInputLabel-root": {
                                        border: "none", // Set the label color
                                        "&.Mui-focused": {
                                          border: "none", // Set the label color when focused
                                        },
                                      },
                                    }}
                                  />

                                  <Grid container>
                                    <Grid item xs={4}>
                                      <Item>
                                        <Typography>&nbsp;</Typography>
                                      </Item>
                                    </Grid>
                                    <Grid item xs={4}>
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
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={handleSubmit}
                                          sx={{ borderRadius: "5px" }}
                                        >
                                          Submit
                                        </Button>
                                      </Item>
                                    </Grid>
                                    <Grid item xs={4}>
                                      <Item>
                                        <Typography sx={{ textAlign: "end" }}>
                                          {keywordsCount}/125
                                        </Typography>
                                      </Item>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Box>
                              {/* <Button>Done</Button> */}
                            </Modal>
                            {/* </Box> */}
                            <Typography>&nbsp;</Typography>

                            <>
                              <Button
                                size={"large"}
                                variant="contained"
                                component="label"
                                className="browseBtn"
                                onClick={handleOpen}
                                style={{ width: "100%" }}
                                disabled={
                                  !uploadState.paid ||
                                  !seo ||
                                  keywords.length <= 0
                                }
                              >
                                {keywords.length <= 0 ? "Edit" : "Edit"}
                              </Button>
                            </>
                          </Grid>

                          {!uploadState.paid || basicPlan ? (
                            <Box
                              sx={{
                                position: "absolute",
                                zIndex: "99",
                                top: "50%",
                                bottom: "50%",
                                boxShadow: "5px 5px 38px #cdc9c9",
                                borderRadius: "10px",
                                left: "0%",
                                right: "0%",
                                backgroundColor: "white",
                                padding: "25px 25px 25px 25px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "orange",
                                fontSize: "25px",
                                fontWeight: "600",
                              }}
                            >
                              <Typography>
                                <Link
                                  href="/pricing"
                                  style={{
                                    color: "orange",
                                    textDecoration: "none",
                                  }}
                                >
                                  <strong>Upgrade</strong>
                                </Link>{" "}
                                to use this feature
                              </Typography>
                            </Box>
                          ) : null}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Item>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Item sx={{ height: "100%" }}>
                    <Grid
                      sx={{ height: "100%" }}
                      className={
                        uploadState.paid && uploadState.premium
                          ? "uploadBox"
                          : "newUploadBox"
                      }
                      onDrop={handleDropTaxonomy}
                      onDragOver={handleDragOverTaxonomy}
                    >
                      <Grid
                        className="descriptionSection"
                        sx={{
                          marginBottom: { xs: "20px", md: "20px" },
                          minHeight: { xs: "auto", md: "160px" },
                        }}
                      >
                        <Grid
                          container
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography>
                            <strong>Taxonomy</strong>
                          </Typography>

                          <Switch
                            checked={taxonomy}
                            onChange={(e) => setTaxonomy(e.target.checked)}
                            disabled={!uploadState.paid || !uploadState.premium}
                          />
                        </Grid>
                        <Typography style={{ textAlign: "left" }}>
                          Categorizes products based on their content, assigning
                          them to nodes in your Taxonomy structure.
                        </Typography>
                      </Grid>
                      <Grid className="whiteSection">
                        <Typography
                          sx={{
                            borderRadius: "21.024px 21.024px 0px 0px",
                            backgroundColor: taxonomy
                              ? taxonomyFile || existingTaxonomy != ""
                                ? "#23BF6E"
                                : "#DEDEDE"
                              : "white",
                          }}
                        >
                          <>
                            {taxonomy ? (
                              taxonomyFile || existingTaxonomy != "" ? (
                                <Typography style={{ color: "white" }}>
                                  Ready for generation
                                </Typography>
                              ) : (
                                <Typography>
                                  Not Ready for generation
                                </Typography>
                              )
                            ) : (
                              <Typography>&nbsp;</Typography>
                            )}
                          </>
                        </Typography>
                        <Grid
                          style={{
                            backgroundColor: "white",
                            borderRadius: "0px 0px 10px 10px",
                            padding: "10px 30px 30px 30px",
                            position: "relative",
                          }}
                        >
                          <Grid
                            className="textArea"
                            sx={{ minHeight: { xs: "auto", md: "100px" } }}
                          >
                            <Typography
                              style={{
                                fontSize: "20px",
                                color:
                                  uploadState.paid && uploadState.premium
                                    ? "black"
                                    : "gray",
                              }}
                              variant="body1"
                            >
                              <strong>Add File</strong>
                            </Typography>
                            <Typography
                              variant="body2"
                              className={
                                uploadState.paid ? "textInBox" : "newTextInBox"
                              }
                            >
                              Drag and drop your file
                            </Typography>
                          </Grid>
                          <Grid sx={{ width: "100%" }}>
                            <Grid
                              sx={{
                                border: "1px dashed grey",
                                padding: "13px",
                                borderRadius: "10px",
                                padding: "30px",
                                margin: "16px 0px 8px 0px",
                                backgroundColor: "#F9F9FB",
                                color: "#7B89B2",
                                height: { xs: "200px", md: "200px" },
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {(taxonomyFile && taxonomy) ||
                              (taxonomy && existingTaxonomy != "") ? (
                                <img src="/sucess.png"></img>
                              ) : (
                                <img src="/folder_image.png"></img>
                              )}
                              {taxonomyFile && taxonomy ? (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    wordBreak: "break-word",
                                    overflow: "hidden",
                                  }}
                                >
                                  {/* File selected: {taxonomyFile.name} */}
                                  {taxonomyFile.name}
                                </Typography>
                              ) : (
                                <>
                                  {taxonomy && existingTaxonomy ? (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        wordBreak: "break-word",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {existingTaxonomy}
                                    </Typography>
                                  ) : (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        wordBreak: "break-word",
                                        overflow: "hidden",
                                      }}
                                    >
                                      Drop File here
                                    </Typography>
                                  )}
                                </>
                              )}
                            </Grid>
                            {/* </Box> */}
                            <Typography>or</Typography>
                            <input
                              type="file"
                              id="chooseFileTaxonomy"
                              accept=".xls, .xlsx, .csv"
                              onChange={handleFileChangeTaxonomy}
                              style={{ display: "none" }}
                              disabled={
                                !uploadState.paid ||
                                !uploadState.premium ||
                                !taxonomy
                              }
                            />
                            <>
                              <Button
                                htmlFor="chooseFileTaxonomy"
                                size={"large"}
                                variant="contained"
                                component="label"
                                className="browseBtn"
                                style={{ width: "100%" }}
                                disabled={
                                  !uploadState.paid ||
                                  !taxonomy ||
                                  !uploadState.premium
                                }
                              >
                                <label
                                  htmlFor="chooseFileTaxonomy"
                                  className="fileLabel"
                                >
                                  {taxonomyFile ||
                                  (taxonomy && existingTaxonomy != "")
                                    ? "Reupload File"
                                    : "Upload File"}
                                </label>
                              </Button>
                            </>
                          </Grid>

                          {!uploadState.paid || !uploadState.premium ? (
                            <Box
                              sx={{
                                position: "absolute",
                                zIndex: "99",
                                top: "50%",
                                bottom: "50%",
                                boxShadow: "5px 5px 38px #cdc9c9",
                                borderRadius: "10px",
                                left: "0%",
                                right: "0%",
                                backgroundColor: "white",
                                padding: "25px 25px 25px 25px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "orange",
                                fontSize: "25px",
                                fontWeight: "600",
                              }}
                            >
                              <Typography>
                                <Link
                                  href="/pricing"
                                  style={{
                                    color: "orange",
                                    textDecoration: "none",
                                  }}
                                >
                                  <strong>Upgrade</strong>
                                </Link>{" "}
                                to use this feature
                              </Typography>
                            </Box>
                          ) : null}
                        </Grid>
                      </Grid>
                      {/* <Typography style={{ marginTop: '10px', fontSize: '16px' }}><Link style={{ color: 'orange', textDecoration: 'none' }} href="/taxonomy_example.xlsx">Try It! <strong style={{ textDecoration: "none" }}>Download Sample File</strong></Link></Typography> */}
                      <Typography>
                        {!taxonomy ||
                        !uploadState.paid ||
                        !uploadState.premium ? (
                          <Box
                            style={{ color: "gray", textDecoration: "none" }}
                          >
                            Try It!{" "}
                            <strong style={{ textDecoration: "none" }}>
                              Download Sample File
                            </strong>
                          </Box>
                        ) : (
                          <Link
                            style={{ color: "orange", textDecoration: "none" }}
                            href="/taxonomy_example.xlsx"
                          >
                            Try It!{" "}
                            <strong style={{ textDecoration: "none" }}>
                              Download Sample File
                            </strong>
                          </Link>
                        )}
                      </Typography>
                    </Grid>
                  </Item>
                </Grid>
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  padding: "0px 16px",
                }}
              >
                <Typography>Generate Results</Typography>
                <Button
                  style={{ borderRadius: "5px", marginLeft: "5px" }}
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  endIcon={<ArrowForwardOutlinedIcon />}
                  disabled={
                    (!content && !seo && !taxonomy) ||
                    (content && !uploadState.selectedFile) ||
                    (seo && keywords.length === 0) ||
                    (taxonomy && !taxonomyFile && existingTaxonomy == "") ||
                    loading
                  }
                >
                  Generate
                </Button>
              </Grid>
            </Box>
          ) : (
            <>
              <Box>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#FB9005",
                    textTransform: "uppercase",
                    marginLeft: "12px",
                    marginTop: "5px",
                  }}
                >
                  Select Enhancements
                </Typography>
                <Typography
                  sx={{
                    mt: "20px",
                    ml: "12px",
                    opacity: "0.7",
                  }}
                >
                  Select the enhancements you want AI to perform.
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    ml: "12px",
                    mt: "35px",
                    display: "flex",
                  }}
                >
                  File selected:
                  <Typography
                    sx={{
                      fontWeight: 500,
                      opacity: 0.7,
                      ml: "10px",
                      overflowWrap: "anywhere",
                    }}
                  >
                    {uploadState.selectedFile
                      ? uploadState.selectedFile.name
                      : ""}
                  </Typography>
                </Typography>
                <Box>
                  <input
                    type="file"
                    id="chooseFile"
                    accept=".xls, .xlsx, .csv"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <>
                    <Button
                      htmlFor="chooseFile"
                      size={"large"}
                      variant="contained"
                      component="label"
                      className="browseBtn"
                      sx={{
                        mt: "20px !important",
                        ml: "12px !important",
                        mb: "20px !important",
                        borderRadius: "10px !important",
                      }}
                    >
                      <CloudUploadOutlinedIcon />
                      <Box sx={{ ml: "10px" }}>
                        <label htmlFor="chooseFile" className="fileLabel">
                          Reupload File
                        </label>
                      </Box>
                    </Button>
                  </>
                </Box>
                <Grid
                  container
                  justifyContent="center"
                  sx={{ display: "flex" }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Item sx={{ height: "100%" }}>
                      <Grid
                        sx={{
                          height: "100%",
                          p: "18px !important",
                          bgcolor: "white !important",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                        className={"uploadBox"}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <Grid
                          className="descriptionSection"
                          sx={{
                            marginBottom: { xs: "20px", md: "20px" },
                            minHeight: { xs: "auto", md: "160px" },
                          }}
                        >
                          <Grid container alignItems="center">
                            <Switch
                              checked={content}
                              onChange={(e) => setContent(e.target.checked)}
                            />
                            <Typography
                              sx={{
                                color: content ? "#01c42b" : "#727272",
                              }}
                            >
                              <strong>Content Generation</strong>
                            </Typography>
                          </Grid>
                          <Typography style={{ textAlign: "left" }}>
                            Creates product descriptions and feature bullets,
                            optionally using keyword hints you supply.
                          </Typography>
                        </Grid>
                        {content && (
                          <Box
                            textAlign={"initial"}
                            color={"#01c42b"}
                            display={"flex"}
                            flexDirection={"row"}
                            alignItems={"center"}
                          >
                            <img
                              src="/sucess_sample.png"
                              width="14%"
                            />{" "}
                            Ready
                          </Box>
                        )}
                      </Grid>
                    </Item>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Item sx={{ height: "100%" }}>
                      <Grid
                        sx={{
                          height: "100%",
                          p: "18px !important",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                        className={
                          (uploadState.paid && !basicPlan) ? "mobuploadBox" : "mobNewUploadBox"
                        }
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        <Grid
                          className="descriptionSection"
                          sx={{
                            marginBottom: { xs: "20px", md: "20px" },
                            minHeight: { xs: "auto", md: "160px" },
                          }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            justifyContent={"space-between"}
                          >
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              flexDirection={"row"}
                            >
                              <Switch
                                checked={seo}
                                onChange={(e) => setSeo(e.target.checked)}
                                disabled={!uploadState.paid || basicPlan}
                              />
                              <Typography
                                sx={{
                                  color: seo ? "#01c42b" : "#727272",
                                }}
                              >
                                <strong>SEO</strong>
                                {!uploadState.paid || basicPlan ? (
                                <Typography
                                  variant="body"
                                  fontSize=""
                                  fontWeight="bold"
                                  color="#a6a6a6"
                                >
                                  (Subscription required)
                                </Typography>
                              ) : (
                                ""
                              )}
                              </Typography>
                            </Box>
                            {!uploadState.paid || basicPlan && (
                              <Box>
                                <LockIcon
                                  sx={{
                                    color: "#FB9005",
                                  }}
                                />
                              </Box>
                            )}
                          </Grid>
                          <Typography style={{ textAlign: "left" }}>
                            {" "}
                            Integrates SEO keywords from a master list with your
                            descriptions and features, but only if they are
                            related to the product.
                          </Typography>
                        </Grid>
                        {seoTextBox && (
                          <Grid className="whiteSection">
                            <Typography
                              sx={{
                                borderRadius: "21.024px 21.024px 0px 0px",
                                backgroundColor: seo
                                  ? keywords.length > 0
                                    ? "#23BF6E"
                                    : "#DEDEDE"
                                  : "white",
                              }}
                            >
                            </Typography>
                          </Grid>
                        )}
                        {seoTextBox && seo && (
                          <Grid
                            style={{
                              backgroundColor: "white",
                              borderRadius: "0px 0px 10px 10px",
                              position: "relative",
                            }}
                          >
                            <Grid sx={{ width: "100%" }}>
                              <Modal
                                // keepMounted
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="keep-mounted-modal-title"
                                aria-describedby="keep-mounted-modal-description"
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
                                    <TextField
                                      variant="outlined"
                                      value={keywords}
                                      onChange={handleInputChange}
                                      fullWidth
                                      margin="0"
                                      multiline
                                      rows={14} // Set the number of rows (adjust as needed)
                                      sx={{
                                        // border: '1px solid black',
                                        borderRadius: "10px",

                                      "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                          border: "none", // Set the border color when not focused
                                        },
                                        "&.Mui-focused fieldset": {
                                          border: "none",
                                        },
                                      },
                                      "& .MuiInputLabel-root": {
                                        border: "none", // Set the label color
                                        "&.Mui-focused": {
                                          border: "none", // Set the label color when focused
                                        },
                                      },
                                    }}
                                  />

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
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            sx={{ borderRadius: "5px" }}
                                          >
                                            Submit
                                          </Button>
                                        </Item>
                                      </Grid>
                                      <Grid item xs={2}>
                                        <Item>
                                          <Typography sx={{ textAlign: "end" }}>
                                            {keywordsCount}/125
                                          </Typography>
                                        </Item>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Box>
                                {/* <Button>Done</Button> */}
                              </Modal>
                              {/* </Box> */}
                              <Typography>&nbsp;</Typography>
                            </Grid>
                            {!uploadState.paid ? (
                              <Box
                                sx={{
                                  position: "absolute",
                                  zIndex: "99",
                                  top: "50%",
                                  bottom: "50%",
                                  boxShadow: "5px 5px 38px #cdc9c9",
                                  borderRadius: "10px",
                                  left: "0%",
                                  right: "0%",
                                  backgroundColor: "white",
                                  padding: "25px 25px 25px 25px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "orange",
                                  fontSize: "25px",
                                  fontWeight: "600",
                                }}
                              >
                                <Typography>
                                  <Link
                                    href="/pricing"
                                    style={{
                                      color: "orange",
                                      textDecoration: "none",
                                    }}
                                  >
                                    <strong>Upgrade</strong>
                                  </Link>{" "}
                                  to use this feature
                                </Typography>
                              </Box>
                            ) : null}
                          </Grid>
                        )}
                        {seo && (
                          <>
                            <Box
                              textAlign={"initial"}
                              color={"green"}
                              display={"flex"}
                              flexDirection={"row"}
                              alignItems={"center"}
                              mt={"15px"}
                            >
                              <Button
                                size={"large"}
                                variant="contained"
                                component="label"
                                className="browseBtn"
                                onClick={handleOpen}
                                sx={{
                                  width: "50%",
                                  display: "flex",
                                  textTransform: "capitalize",
                                }}
                                disabled={
                                  !uploadState.paid ||
                                  !seo
                                }
                              >
                                <Typography sx={{ fontSize: "16px" }}>
                                  {keywords.length <= 0
                                    ? "Add Keyword"
                                    : "Add/Edit Keyword"}
                                </Typography>
                              </Button>
                              {keywords.length > 0 && (
                                <Box
                                  display={"flex"}
                                  flexDirection={"row"}
                                  alignItems={"center"}
                                  pl={"10px"}
                                  color={"#01c42b"}
                                >
                                  <img
                                    src="/sucess_sample.png"
                                    width="44%"
                                  />{" "}
                                  Ready
                                </Box>
                              )}
                            </Box>
                          </>
                        )}
                      </Grid>
                    </Item>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <Item sx={{ height: "100%" }}>
                      <Grid
                        sx={{
                          height: "100%",
                          p: "18px !important",
                          bgcolor: "white",
                          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                        }}
                        className={
                          uploadState.paid && uploadState.premium
                          ?
                          "mobuploadBox" : "mobNewUploadBox"
                        }
                        onDrop={handleDropTaxonomy}
                        onDragOver={handleDragOverTaxonomy}
                      >
                        <Grid
                          className="descriptionSection"
                          sx={{
                            marginBottom: { xs: "20px", md: "20px" },
                            minHeight: { xs: "auto", md: "160px" },
                          }}
                        >
                          <Grid
                            container
                            alignItems="center"
                            justifyContent={"space-between"}
                          >
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              flexDirection={"row"}
                            >
                              <Switch
                                checked={taxonomy}
                                onChange={(e) => setTaxonomy(e.target.checked)}
                                disabled={
                                  !uploadState.paid || !uploadState.premium
                                }
                              />
                              <Typography
                                sx={{
                                  color: taxonomy ? "#01c42b" : "#727272",
                                }}
                              >
                                <strong>Taxonomy</strong>
                                {uploadState.paid && uploadState.premium ? (
                                ""
                              ) : (
                                <Typography
                                  variant=""
                                  fontSize=""
                                  fontWeight="bold"
                                  color="#a6a6a6"
                                >
                                  (Subscription required)
                                </Typography>
                              )}
                              </Typography>
                            </Box>
                            {(!uploadState.paid || !uploadState.premium) && (
                              <Box>
                                <LockIcon
                                  sx={{
                                    color: "#FB9005",
                                  }}
                                />
                              </Box>
                            )}
                          </Grid>
                          <Typography style={{ textAlign: "left" }}>
                            Categorizes products based on their content,
                            assigning them to nodes in your Taxonomy structure.
                          </Typography>
                          <Typography
                            sx={{
                              textAlign: "justify",
                            }}
                          >
                            {!taxonomy ||
                            !uploadState.paid ||
                            !uploadState.premium ? (
                              <></>
                            ) : (
                              <Link
                                style={{ color: "orange" }}
                                href="/taxonomy_example.xlsx"
                              >
                                <strong>Download Sample File</strong>
                              </Link>
                            )}
                          </Typography>
                        </Grid>
                        <Grid className="whiteSection">
                          {taxonomy && (
                            <Grid>
                              {!uploadState.paid || !uploadState.premium ? (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    zIndex: "99",
                                    top: "50%",
                                    bottom: "50%",
                                    boxShadow: "5px 5px 38px #cdc9c9",
                                    borderRadius: "10px",
                                    left: "0%",
                                    right: "0%",
                                    backgroundColor: "white",
                                    padding: "25px 25px 25px 25px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "orange",
                                    fontSize: "25px",
                                    fontWeight: "600",
                                  }}
                                >
                                  <Typography>
                                    <Link
                                      href="/pricing"
                                      style={{
                                        color: "orange",
                                        textDecoration: "none",
                                      }}
                                    >
                                      <strong>Upgrade</strong>
                                    </Link>{" "}
                                    to use this feature
                                  </Typography>
                                </Box>
                              ) : null}
                            </Grid>
                          )}
                          {taxonomyFile && taxonomy ? (
                            <Typography
                              variant="body1"
                              sx={{
                                wordBreak: "break-word",
                                overflow: "hidden",
                                fontSize: "18px",
                              }}
                            >
                              {taxonomyFile.name}
                            </Typography>
                          ) : (
                            <>
                              {taxonomy && existingTaxonomy && (
                                <Typography
                                  variant="body1"
                                  sx={{
                                    wordBreak: "break-word",
                                    overflow: "hidden",
                                  }}
                                >
                                  {existingTaxonomy}
                                </Typography>
                              )}
                            </>
                          )}
                          {taxonomy && (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <input
                                type="file"
                                id="chooseFileTaxonomy"
                                accept=".xls, .xlsx, .csv"
                                onChange={handleFileChangeTaxonomy}
                                style={{ display: "none" }}
                                disabled={
                                  !uploadState.paid ||
                                  !uploadState.premium ||
                                  !taxonomy
                                }
                              />
                              <>
                                <Button
                                  htmlFor="chooseFileTaxonomy"
                                  size={"large"}
                                  variant="contained"
                                  component="label"
                                  className="browseBtn"
                                  style={{ width: "100%" }}
                                  disabled={
                                    !uploadState.paid ||
                                    !taxonomy ||
                                    !uploadState.premium
                                  }
                                >
                                  <label
                                    htmlFor="chooseFileTaxonomy"
                                    className="fileLabel"
                                  >
                                    {taxonomyFile ||
                                    (taxonomy && existingTaxonomy != "")
                                      ? "Reupload File"
                                      : "Upload File"}
                                  </label>
                                </Button>
                              </>
                              <Box
                                sx={{
                                  textAlign: "initial",
                                  color: "#01c42b",
                                  display: "flex",
                                  flexDirection: "row",
                                  alignItems: "center",
                                  mt: "16px",
                                }}
                              >
                                <img
                                  src="/sucess_sample.png"
                                  width={"40px"}
                                  height={"40px"}
                                />{" "}
                                Ready
                              </Box>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </Item>
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
                    Working with spreadsheets on mobile can be difficult. For
                    the best experience, we recommend using ContentHubGPT on
                    Desktop.
                  </Typography>
                </Box>
                {windowSize <= 768 && (
                  <Button
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
                      width: "88%" }}
                    onClick={handleUpload}
                    disabled={
                      (!content && !seo && !taxonomy) ||
                      (content && !uploadState.selectedFile) ||
                      (seo && keywords.length === 0) ||
                      (taxonomy && !taxonomyFile && existingTaxonomy == "") ||
                      loading
                    }
                  >
                    <Box sx={{ ml: "10px" }}>Proceed</Box>
                  </Button>
                )}
              </Box>
            </>
          )}
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
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={loading}
            autoHideDuration={10000}
            onClose={handleSnackbarClose}
          >
            <Alert severity="info" onClose={handleSnackbarClose}>
              <AlertTitle>success</AlertTitle>
              Please wait, the Taxonomy File is being uploaded...
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
              {errorMsg?.response?.data?.error
                ? errorMsg?.response?.data?.error
                : "unknown error occured"}
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={snackbarOpenSuccess}
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
            open={LimitErrorsnackbarOpen}
            autoHideDuration={10000}
            onClose={handleSnackbarClose}
          >
            <Alert severity="error" onClose={handleSnackbarClose}>
              <AlertTitle>Error</AlertTitle>
              {limitError}
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
                errorMsg ||
                "Please make sure the name of the columns on your file are as given in the sample"}
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
            open={checkBoxSnackbar}
            autoHideDuration={10000}
            onClose={handleSnackbarClose}
          >
            <Alert severity="error" onClose={handleSnackbarClose}>
              <AlertTitle>
                You must check at least one of the checkbox
              </AlertTitle>
            </Alert>
          </Snackbar>

          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={taxonomyError}
            autoHideDuration={null}
            onClose={handleSnackbarClose}
          >
            <Alert severity="error" onClose={handleSnackbarClose}>
              <AlertTitle>
                You must upload a{" "}
                <Link style={{ color: "red" }} href="/taxonomy">
                  taxonomy
                </Link>{" "}
                spreadsheet first
              </AlertTitle>
            </Alert>
          </Snackbar>
        </Root>
      )}
    </>
  );
}

export default Enhancementpage;

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
