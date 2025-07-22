import React, { useEffect, useState } from "react";
import { Button, Typography, Box, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import "dotenv";
import { useDispatch, useSelector } from "react-redux";
import Progress from "../../components/walmart/Progress";
import PercentageLoader from "../../components/walmart/PercentageLoader";

import axios from "axios";
import {
  setFilterResultsData,
  setResultsData,
} from "../../store/walmart/productTableSlice";
import useTaskProgressTracker from "../../components/helper/walmart/useTaskProgressTracker";

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

function GeneratePage({ user }) {
  const router = useRouter();
  const [num, setNum] = useState(0);
  const [success, setSuccess] = useState(null);
  const [taskID, setTaskID] = useState("");
  const [taskProgress, setTaskProgess] = useState(100);

  const dispatch = useDispatch();
  const productTableData = useSelector((state) => state.productTable);
  const productSelectedIndex = productTableData.productSelected;
  const content = productTableData.content;
  const seo = productTableData.seo;
  const seoKeywords = productTableData.seoKeywords;
  const tableData = productTableData.tableData;
  let progressVal = 0;

  if (taskID !== null) {
    progressVal = useTaskProgressTracker({ taskID, user });
  }

  async function getGenerationResults() {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_WALMART_BASE_URL + "/wal-generate-ai/result",
        {
          params: {
            task_id: taskID,
          },
        }
      );

      if (response.status === 200) {
        setNum(100);
        setSuccess(true);
        dispatch(setResultsData(response?.data?.itemList));
        dispatch(setFilterResultsData(response?.data?.itemList));
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error while Generating Results", error);
      setNum(error.response.status);
      setSuccess(false);
    }
  }

  useEffect(() => {
    setTaskProgess(progressVal);
    if (progressVal === 100) {
      // getGenerationResults();
      setNum(100);
      setSuccess(true);
    }
  }, [progressVal]);

  async function generateKeyFeatures() {
    const dataToGenerate = tableData.filter((_, index) =>
      productSelectedIndex.includes(index)
    );

    const data = {
      email: user.email,
      itemList: dataToGenerate,
      doContent: content,
      doSeo: seo,
      seo_keywords: seoKeywords,
    };

    try {
      const config = {
        headers: {
          Authorization: user.id_token,
        },
      };
      const response = await axios.post(
        process.env.NEXT_PUBLIC_WALMART_BASE_URL + "/wal-generate-ai",
        data,
        config
      );
      if (response.status === 200) {
        setTaskID(response.data.task_id);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error while Generating Results", error);
      setNum(error.response.status);
      setSuccess(false);
    }
  }

  useEffect(() => {
    productSelectedIndex.length === 0
      ? router.push("/walmart/dashboard")
      : generateKeyFeatures();
  }, []);

  const handleRetry = () => {
    setNum(0);
    setSuccess(false);
    generateKeyFeatures();
  };

  const handleContinue = () => {
    router.push({
      pathname: "/walmart/results",
      query: {
        task_id: taskID,
      },
    });
  };

  const getGenerationStatus = () => {
    if (num < 100) {
      return {
        text: "Generating...",
        buttonText: "In Process",
      };
    } else if (success) {
      return {
        text: "Generation Success",
        buttonText: "Done",
      };
    } else {
      return {
        text: "Generation Failed!",
        buttonText: "Retry",
      };
    }
  };
  const generationStatus = getGenerationStatus();

  return (
    <Root className="root" style={{ display: "flex", flexDirection: "column" }}>
      <>
        <Progress active={2} />
        <Grid container justifyContent="center">
          <Grid item xs={12} style={{ margin: "25px 0 15px 0" }}>
            <Typography variant="h3" textAlign="center">
              Generating Results
            </Typography>
            <Typography textAlign="center" color="#808080">
              You will be emailed when generation is complete. You can close
              this Page.
            </Typography>
          </Grid>

          {/* Generating Box */}
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
                  <strong>{generationStatus.text}</strong>
                </Typography>
                <Typography variant="body2" className="textInBox">
                  {generationStatus.buttonText}
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
                        padding: "30px",
                        margin: "16px 0px 8px 0px",
                        backgroundColor: "#F9F9FB",
                        color: "#7B89B2",
                      }}
                    >
                      {num < 100 ? (
                        <div style={{ position: "relative" }}>
                          <img src="/Ellipse.png" alt="Background Image" />

                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {/* <CircularProgress style={{ color: "#022149" }} />
                             */}
                            <PercentageLoader progress={taskProgress} />
                          </div>
                        </div>
                      ) : (
                        <>
                          {success ? (
                            <img
                              style={{ width: "90px", height: "90px" }}
                              src="/walmart/Success_icon.png"
                              alt="Success"
                            ></img>
                          ) : (
                            <img
                              style={{ width: "90px", height: "90px" }}
                              src="/walmart/Error_icon.png"
                              alt="Error"
                            ></img>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* Button grid */}
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                marginTop: "10px",
              }}
            >
              {num < 100 ? (
                <Button
                  style={{
                    borderRadius: "5px",
                    marginLeft: "5px",
                    color: "#FFFFFF",
                  }}
                  size="small"
                  variant="contained"
                  color="primary"
                  disabled={true}
                >
                  Continue
                </Button>
              ) : success ? (
                <Button
                  style={{
                    borderRadius: "5px",
                    marginLeft: "5px",
                    color: "#FFFFFF",
                  }}
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  style={{
                    borderRadius: "5px",
                    marginLeft: "5px",
                    color: "#FFFFFF",
                  }}
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleRetry}
                >
                  Retry
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </>
    </Root>
  );
}
export default GeneratePage;

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
