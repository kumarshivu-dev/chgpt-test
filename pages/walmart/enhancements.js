import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
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
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import Progress from "../../components/walmart/Progress";
import {
  setContent,
  setSeo,
  setSeoKeywords,
} from "../../store/walmart/productTableSlice";
import axios from "axios";
import Image from "next/image";
import {
  POST_UPLOAD_SEO_KEYWORDS,
  POST_FETCH_SEO_KEYWORDS,
} from "../../utils/apiEndpoints";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "none",
}));

const Root = styled("div")(({ theme }) => ({
  [`& .${"uploadBox"}`]: {
    backgroundColor: "#FFEAD0",
    color: "black",
    borderRadius: "10px",
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

export default function Enhancement({ user }) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [keywordsCount, setKeywordsCount] = useState(0);
  const [LimitErrorsnackbarOpen, setLimitErrorsnackbarOpen] = useState(false);
  const [limitError, setLimitError] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();
  const productTableData = useSelector((state) => state.productTable);
  const walmartPricing = useSelector((state) => state.walmartPricing);
  const content = productTableData.content;
  const seo = productTableData.seo;
  const seoKeywords = productTableData.seoKeywords;
  const isWalmartPaidUser = walmartPricing.isWalmartPaidUser;
  const productSelectedIndex = productTableData.productSelected;

  const fetchExistingSEOKeywords = async () => {
    try {
      const config = {
        headers: {
          Authorization: user.id_token,
        },
      };
      const response = await axios.post(
        process.env.NEXT_PUBLIC_WALMART_BASE_URL + POST_FETCH_SEO_KEYWORDS,
        {
          email: user.email,
        },
        config
      );
      dispatch(setSeoKeywords(response?.data?.keywords));
    } catch (err) {
      console.error("Error fetching existing SEO keywords:", err);
      if (err?.response?.data === "Unauthorized") {
        signOut();
      }
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = (event) => {
    const keywordsList = event.target.value
      .split(",")
      .map((keyword) => keyword.trim());

    setKeywordsCount(keywordsList.length);

    if (keywordsList.length > 125) {
      setLimitError("Maximum limit of 125 keywords exceeded.");
      setLimitErrorsnackbarOpen(true);
    } else {
      dispatch(setSeoKeywords(event.target.value));
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setLimitErrorsnackbarOpen(false);
  };

  const handleSubmit = async () => {
    if (seoKeywords.length === 0) {
      setLimitError("Please enter at least one non-empty keyword");
      setLimitErrorsnackbarOpen(true);
      return;
    }
    const data = {
      seo_keywords: seoKeywords,
      email: user.email,
    };
    try {
      const config = {
        headers: {
          Authorization: user.id_token,
        },
      };
      const response = await axios.post(
        process.env.NEXT_PUBLIC_WALMART_BASE_URL + POST_UPLOAD_SEO_KEYWORDS,
        data,
        config
      );
      if (response.status === 200) {
        setSuccessMsg("Seo Keywords added successfully");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error while uploading seo keywords", error);
      setLimitError("Failed to upload SEO keywords, Please retry");
      setLimitErrorsnackbarOpen(true);
    }
  };

  const handleContentChange = (e) => {
    const isChecked = e.target.checked;
    dispatch(setContent(isChecked)); // Dispatch the action to update content in Redux store
  };

  const handleSeoChange = (e) => {
    const isChecked = e.target.checked;
    dispatch(setSeo(isChecked)); // Dispatch the action to update content in Redux store
  };

  const handleGenerate = async () => {
    if (seo && seoKeywords.length === 0) {
      setLimitError("Please enter at least one non-empty Seo keywords");
      setLimitErrorsnackbarOpen(true);
      return;
    }
    router.push({
      pathname: "/walmart/generate",
    });
  };

  useEffect(() => {
    if (productSelectedIndex.length === 0) {
      router.push({
        pathname: "/walmart/dashboard",
      });
    }
    fetchExistingSEOKeywords();
  }, []);

  return (
    <>
      <Root
        className="root"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Progress active={1} />

        {/* Enhancement Header */}
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
              }}
            >
              <Typography style={{ marginRight: "10px" }}>
                Generate Results
              </Typography>
              <Button
                style={{ borderRadius: "5px", color: "#FFFFFF" }}
                size="small"
                variant="contained"
                onClick={handleGenerate}
                endIcon={<ArrowForwardOutlinedIcon />}
                disabled={!content && !seo}
              >
                Generate
              </Button>
            </Item>
          </Grid>
        </Grid>

        {/* Content Generation Box */}
        <Grid container justifyContent="center" sx={{ display: "flex" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Item sx={{ height: "100%" }}>
              <Grid sx={{ height: "100%" }} className={"uploadBox"}>
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

                    <Switch checked={content} onChange={handleContentChange} />
                  </Grid>
                  <Typography style={{ textAlign: "left", color: "#4F4F4F" }}>
                    Creates product descriptions and feature bullets, optionally
                    using keyword hints you supply.
                  </Typography>
                </Grid>

                <Grid className="whiteSection">
                  <Typography
                    variant="h6"
                    sx={{
                      borderRadius: "21.024px 21.024px 0px 0px",
                      backgroundColor: content ? "#23BF6E" : "#BDBDBD",
                    }}
                  >
                    <>
                      {content ? (
                        <Typography style={{ color: "#FFFFFF" }}>
                          Ready for generation
                        </Typography>
                      ) : (
                        <Typography style={{ color: "#FFFFFF" }}>
                          Not Ready for generation
                        </Typography>
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
                        <strong>Products Selected</strong>
                      </Typography>
                    </Grid>
                    <Grid sx={{ width: "100%" }}>
                      {" "}
                      {/* Doted section */}
                      <Grid
                        sx={{
                          border: "1px dashed grey",
                          borderRadius: "10px",
                          padding: "50px",
                          margin: "16px 0px 8px 0px",
                          backgroundColor: "#F9F9FB",
                          color: "#7B89B2",
                          minHeight: { xs: "auto", md: "200px" },
                        }}
                      >
                        <Image
                          src="/walmart/product_selected_check.png"
                          width="110"
                          height="70"
                          quality={100}
                          alt="product selection"
                        ></Image>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Item>
          </Grid>

          {/* SEO Box */}
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Item sx={{ height: "100%" }}>
              <Grid
                sx={{ height: "100%" }}
                className={isWalmartPaidUser ? "uploadBox" : "newUploadBox"}
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
                      onChange={handleSeoChange}
                      disabled={!isWalmartPaidUser}
                    />
                  </Grid>
                  <Typography style={{ textAlign: "left" }}>
                    {" "}
                    Integrates SEO keywords from a master list with your
                    descriptions and features, but only if they are related to
                    the product.
                  </Typography>
                </Grid>
                <Grid className="whiteSection">
                  <Typography
                    variant="h6"
                    sx={{
                      borderRadius: "21.024px 21.024px 0px 0px",
                      backgroundColor: seo
                        ? seoKeywords.length > 0
                          ? "#23BF6E"
                          : "#BDBDBD"
                        : "#FFFFFF",
                    }}
                  >
                    <>
                      {seo ? (
                        seoKeywords.length > 0 ? (
                          <Typography style={{ color: "#FFFFFF" }}>
                            Ready for generation
                          </Typography>
                        ) : (
                          <Typography style={{ color: "#FFFFFF" }}>
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
                          color: isWalmartPaidUser ? "black" : "gray",
                        }}
                        variant="body1"
                      >
                        <strong>Add Keywords</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        className={
                          isWalmartPaidUser ? "textInBox" : "newTextInBox"
                        }
                      >
                        Please supply in a comma separated list
                      </Typography>
                    </Grid>
                    <Grid sx={{ width: "100%" }}>
                      <TextField
                        className="classesss"
                        variant="outlined"
                        value={seoKeywords}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        onClick={handleOpen}
                        rows={6}
                        sx={{
                          border: "1px dashed black",
                          backgroundColor: "#F9F9FB",
                          borderRadius: "10px",
                          minHeight: { xs: "auto", md: "200px" },

                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },
                          },
                          "& .MuiInputLabel-root": {
                            border: "none",
                            "&.Mui-focused": {
                              border: "none",
                            },
                          },
                        }}
                        disabled={!seo}
                      />
                      <Modal
                        keepMounted
                        open={open}
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
                              value={seoKeywords}
                              onChange={handleInputChange}
                              fullWidth
                              margin="normal"
                              multiline
                              rows={14}
                              sx={{
                                borderRadius: "10px",

                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    border: "none",
                                  },
                                  "&.Mui-focused fieldset": {
                                    border: "none",
                                  },
                                },
                                "& .MuiInputLabel-root": {
                                  border: "none",
                                  "&.Mui-focused": {
                                    border: "none",
                                  },
                                },
                              }}
                            />
                            <Typography sx={{ textAlign: "end" }}>
                              {keywordsCount}/125
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              position: "absolute",
                              top: { md: "82%", xs: "72%" },
                              left: { md: "45%", xs: "30%" },
                              marginTop: "10px",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={handleClose}
                              sx={{ marginRight: "5px", borderRadius: "5px" }}
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
                          </Box>
                        </Box>
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
                            !isWalmartPaidUser ||
                            !seo ||
                            seoKeywords.length <= 0
                          }
                        >
                          Edit
                        </Button>
                      </>
                    </Grid>

                    {!isWalmartPaidUser ? (
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
                          <a
                            href="/walmart/pricing"
                            style={{ color: "orange", textDecoration: "none" }}
                          >
                            <strong>Upgrade</strong>
                          </a>{" "}
                          to use this feature
                        </Typography>
                      </Box>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            </Item>
          </Grid>
        </Grid>

        {/* Next Button  No hydration error */}
        <Grid
          sx={{ display: "flex", justifyContent: "end", padding: "0px 16px" }}
        >
          <Button
            style={{ borderRadius: "5px", marginLeft: "5px", color: "#FFF" }}
            size="small"
            variant="contained"
            color="primary"
            onClick={handleGenerate}
            endIcon={<ArrowForwardOutlinedIcon />}
            disabled={!content && !seo}
          >
            Generate
          </Button>
        </Grid>

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
          <Alert severity="success" onClose={handleSnackbarClose}>
            <AlertTitle>success</AlertTitle>
            {successMsg}
          </Alert>
        </Snackbar>
      </Root>
    </>
  );
}

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
