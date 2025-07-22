import { useState, useEffect } from "react";
import { Button, Typography, Box, Grid, Checkbox } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import Progress from "../../components/walmart/Progress";
import { useSelector } from "react-redux";
import axios from "axios";
import "dotenv";
import PercentageLoader from "../../components/walmart/PercentageLoader";
import useSyncFeedStatus from "../../components/helper/walmart/useSyncFeedStatus";

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

export default function sync({ user }) {
  const router = useRouter();
  const [num, setNum] = useState(0);
  const [success, setSuccess] = useState(null);
  const [feedId, setFeedId] = useState("");
  const [syncProgress, setSyncProgess] = useState(100);
  const productTableData = useSelector((state) => state.productTable);
  const productSelectedIndex = productTableData.productSelected;
  const resultsData = productTableData.resultsData;
  let progressVal = 0;
  const [checked, setChecked] = useState(false);

  if (feedId !== null) {
    progressVal = useSyncFeedStatus({ feedId, user });
  }

  useEffect(() => {
    setSyncProgess(progressVal);
    if (progressVal === 100) {
      setNum(100);
      setSuccess(true);
    }
  }, [progressVal]);

  async function syncToWalmart() {
    const dataToSync = resultsData.filter((_, index) =>
      productSelectedIndex.includes(index)
    );
    const data = {
      email: user?.email,
      itemList: dataToSync,
    };

    console.log("sync data: ", data);

    try {
      const config = {
        headers: {
          Authorization: user.id_token,
        },
      };
      const response = await axios.post(
        process.env.NEXT_PUBLIC_WALMART_BASE_URL + "/sync-walmart",
        data,
        config
      );

      console.log("sync res: ", response);
      if (response.status === 200) {
        setFeedId(response?.data?.feedId);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error while Sync to walmart", error);
      setNum(error?.response?.status);
      setSuccess(false);
    }
  }

  useEffect(() => {
    productSelectedIndex.length === 0
      ? router.push("/walmart/dashboard")
      : syncToWalmart();
  }, []);

  const handleRetry = () => {
    setNum(0);
    setSuccess(false);
    syncToWalmart();
  };

  const handleStartAgain = () => {
    router.push({
      pathname: "/walmart/dashboard",
    });
  };

  const onCheckboxToggle = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <Root className="root" style={{ display: "flex", flexDirection: "column" }}>
      <>
        <Progress active={4} />
        <Grid container justifyContent="center">
          {/* headers */}
          <Grid item xs={12} style={{ margin: "25px 0 15px 0" }}>
            <Typography variant="h3" textAlign="center">
              Syncing Products To Walmart
            </Typography>
            <Typography textAlign="center" color="#808080">
              Please remain on this page while the sync completes.
            </Typography>
          </Grid>

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
                    {num < 100
                      ? "Syncing..."
                      : success
                      ? "Sync Successfully"
                      : "Syncing Error!"}
                  </strong>
                </Typography>
                <Typography variant="body2" className="textInBox">
                  {num < 100 ? "In Process" : success ? "Completed" : "Retry"}
                </Typography>
                <Typography
                  variant="body2"
                  style={{
                    fontSize: "14px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  className="textInBox"
                >
                  {num < 100 ? "" : success ? `Feed Id: ${feedId}` : ""}
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
                            {/* <CircularProgress style={{ color: "#022149" }} /> */}
                            <PercentageLoader progress={syncProgress} />
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
                <Typography>
                  <b>Note:</b> It may Seller Central up to 30 minutes to show
                  your changes
                </Typography>
              </Box>
            </Box>
            {/* Buttom grid */}
            <Grid container>
              <Grid
                item
                xs={12}
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
                    Start New
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
                    onClick={handleStartAgain}
                  >
                    Start New
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
                    Sync Again
                  </Button>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    </Root>
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
