import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  Tooltip,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import cookie from "js-cookie";
import { getSession, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../components/dashboard/home/home-style.css";
import CircularWithValueLabel from "../../components/helper/dashboard/circularProgress";
import SnackbarNotifier from "../../components/helper/dashboard/snackbarNotifier";
import WarningBox from "../../components/helper/WarningBox";
import { useWarning } from "../../context/WarningContext";
import { PieChart } from "@mui/x-charts";
import { useTheme } from "@mui/material";
import { pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useRouter } from "next/router";
import { useToast } from "../../context/ToastContext";
import UpgradeToast from "../../utils-ui/UpgradeToast";
import { useUser } from "../../context/UserContext";

const Root = styled("div")(({ theme }) => ({
  [`&.${"root"}`]: {
    margin: theme.spacing(3),
  },

  [`& .${"home-upper-grid"}`]: {
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },

  [`& .${"content"}`]: {
    margin: theme.spacing(3),
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      margin: 0,
    },
  },

  [`& .${"left-section"}`]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "16px",
    paddingTop: "0px",

    "@media (max-width: 768px)": {
      paddingTop: "16px",
    },
  },
  [`& .${"right-section"}`]: {
    "@media (max-width: 768px)": {
      display: "flex",
      flexDirection: "row-reverse",
      padding: "30px 19px",
      justifyContent: "center",
      alignItems: "center",
    },
  },

  [`& .${"analytics-card"}`]: {
    borderRadius: "10px",
    "&:hover": {
      transition: "box-shadow 0.5s ease",
      boxShadow: "#0056c6 0px 0px 8px 0px !important",
    },
  },

  [`& .${"text"}`]: {
    "&:hover": {
      color: "white",
    },
  },

  [`& .${"full-plan-badge"}`]: {
    height: "188px",

    "@media (max-width: 768px)": {
      height: "128px",
    },
  },

  [`& .${"blue-btn"}`]: {
    backgroundColor: "#022149",
  },

  [`& .${"btn-box"}`]: {
    borderRadius: "5px",
    marginTop: "20px",
  },

  [`& .${"feature-cards"}`]: {
    borderRadius: "10px",
    overflow: "hidden", // Ensure that any overflow content is hidden
    transition: "background-color 0.3s ease-in-out", // Only transition background color
    minHeight: "200px",

    "&:hover": {
      backgroundColor: "#022149",
      color: "white",
    },

    "@media (max-width: 768px)": {
      minHeight: "104px",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
  },

  [`& .${"feature-cards"}:hover .${"feature-image"}`]: {
    height: "50px", // Transition only the height of the image
    transition: "height 0.3s ease-in-out", // Apply transition to image height
  },

  [`& .${"feature-image"}`]: {
    height: "35px",
    transition: "height 0.3s ease-in-out",
  },
}));

function home({ user }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  //state values to set collapse values
  const { session, update } = useSession();
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isHoveredContent, setIsHoveredContent] = useState(false);
  const [isHoveredSeo, setIsHoveredSeo] = useState(false);
  const [isHoveredTaxonomy, setIsHoveredTaxonomy] = useState(false);
  let isFreeUser =
    userState?.userPlan?.startsWith("chgpt-basic") ||
    userState?.userPlan?.startsWith("chgpt-free");
  let isEnterpriseUser = userState?.userPlan?.startsWith("chgpt-enterprise");

  const brandSpecification = userState?.userInfo?.brandSpecification;
  const { showToast } = useToast();
  const { redirectMessage } = router.query;

  const totalConsumedCalls =
    userState?.callsUsageCount.reduce((sum, item) => sum + item?.value, 0) || 0; // Total consumed calls

  // Calculate the percentage for each platform based on totalConsumedCalls
  const pieData = userState?.callsUsageCount.map((item) => ({
    label: `% ${item?.label} Utilization`, // Adding Utilization label to the pie chart
    value:
      totalConsumedCalls > 0
        ? ((item?.value / totalConsumedCalls) * 100).toFixed(2)
        : 0, // Percentage of consumed calls
  }));

  const planImagesFull = {
    "chgpt-free": "/dashboard/Free_Badge_Full.svg",
    "chgpt-free-monthly": "/dashboard/Free_Badge_Full.svg",
    "chgpt-basic": "/dashboard/Basic_Badge_Full.svg",
    "chgpt-basic-monthly": "/dashboard/Basic_Badge_Full.svg",
    "chgpt-essentials": "/dashboard/Essentials_Badge_Full.svg",
    "chgpt-essentials-monthly": "/dashboard/Essentials_Badge_Full.svg",
    "chgpt-premium": "/dashboard/Premium_Badge_Full.svg",
    "chgpt-premium-monthly": "/dashboard/Premium_Badge_Full.svg",
    "chgpt-enterprise": "/dashboard/Enterprise_Badge_Full.svg",
  };
  const plantext1 = {
    "chgpt-free": "Get 50 product calls per month!",
    "chgpt-free-monthly": "Get 50 product calls per month!",
    "chgpt-basic": "Get 500 product calls on 3 Users & ",
    "chgpt-basic-monthly": "Get 500 product calls on 3 Users & ",
    "chgpt-essentials": "Taxonomy/Categorization & ",
    "chgpt-essentials-monthly": "Taxonomy/Categorization & ",
    "chgpt-premium": "Brand voice, Compliance,",
    "chgpt-premium-monthly": "Brand voice, Compliance,",
    "chgpt-enterprise": "Talk to our representative",
  };
  const plantext2 = {
    "chgpt-free": "",
    "chgpt-free-monthly": "",
    "chgpt-basic": "SEO Keywords!",
    "chgpt-basic-monthly": "SEO Keywords!",
    "chgpt-essentials": "Content Training!",
    "chgpt-essentials-monthly": "Content Training!",
    "chgpt-premium": "Governance and App Integration!",
    "chgpt-premium-monthly": "Governance and App Integration!",
    "chgpt-enterprise": "",
  };

  useEffect(() => {
    if (redirectMessage === "upgrade") {
      showToast("Upgrade your plan to Enterprise");
      router.replace("/dashboard/home", undefined, { shallow: true });
    } else if (redirectMessage === "upgradeManagement") {
      showToast("Upgrade your plan");
      router.replace("/dashboard/home", undefined, { shallow: true });
    }
  }, [redirectMessage]);
  

  useEffect(() => {
    if (session && !session.user.terms) {
      update({ ...session, terms: cookie.get("rememberMe") });
      session.user.terms = cookie.get("rememberMe");
    }

    if (user?.inviteStatus === "disabled") {
      showToast("You have been disabled. Contact your admin.", "error");
      setTimeout(() => {
        signOut({ redirect: false });
      }, 2000);
    }
  }, []);

  useEffect(() => {
    if (isEnterpriseUser && !brandSpecification) {
      showToast(<UpgradeToast />, "error");
    }
  }, []);

  const { showWarning } = useWarning();

  return (
    <Root
      className="root"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "40px",
      }}
    >
      <Grid container justifyContent="center">
        <Grid
          className="par-grid"
          item
          xs={12}
          sm={9}
          sx={{ background: "#ffffff", borderRadius: "10px" }}
        >
          {showWarning && <WarningBox />}
          <Box
            className="home-upper-grid"
            sx={{
              display: "flex",
              flexDirection: "row",
              borderRadius: "6px !important",
              boxShadow: "rgba(99, 99, 99, 0.2) 0 2px 8px 0 !important",
              justifyContent: "space-between",
            }}
          >
            <Box className="left-section">
              <Typography
                sx={{
                  padding: {
                    xs: "10px",
                    sm: "14px",
                  },
                  fontSize: {
                    xs: "16px",
                    sm: "32px",
                  },
                  lineHeight: 1.2,
                  fontWeight: 700,
                }}
              >
                Hello {user?.name ? user?.name : "User"}, Let's get to work!
              </Typography>
              <Typography
                sx={{
                  p: {
                    xs: "10px",
                    sm: "14px",
                  },
                }}
              >
                We recommend choosing one of more of the following steps to get
                started!
              </Typography>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                href="/dashboard/products"
                passHref
              >
                <Card
                  sx={{
                    p: "10px",
                    m: "0px 10px",
                    boxShadow: "none",
                    border: "1px solid #cdcdcd",
                    mb: "10px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      // justifyContent:'center',
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 500,
                        mr: {
                          md: "50px",
                        },
                      }}
                    >
                      Generate Product Description
                    </Typography>
                  </Box>
                </Card>
              </Link>
              <Card
                sx={{
                  p: "10px",
                  m: "0px 10px",
                  boxShadow: "none",
                  border: "1px solid #cdcdcd",
                  mb: "10px",
                  cursor: isFreeUser ? "cursor" : "pointer",
                }}
              >
                {isFreeUser ? (
                  <Tooltip title="Upgrade your plan to Enterprise">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          mr: {
                            md: "110px",
                          },
                        }}
                      >
                        Update your environment settings
                      </Typography>
                    </Box>
                  </Tooltip>
                ) : (
                  <Link
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                    href="/dashboard/settings/environmentSettings"
                    passHref
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 500,
                          mr: {
                            md: "110px",
                          },
                        }}
                      >
                        Update your environment settings
                      </Typography>
                    </Box>
                  </Link>
                )}
              </Card>
            </Box>
            <Box
              className="right-section"
              sx={{
                textAlign: "center",
                borderTopRightRadius: "6px !important",
                borderBottomRightRadius: "6px !important",
                background: "#f9f9ff",
                padding: "41px 19px",
                width: {
                  xs: "auto",
                  sm: "55%",
                  md: "40%",
                },
              }}
            >
              <Box sx={{}}>
                <img
                  className="full-plan-badge"
                  src={
                    userState.userPlan?.startsWith("chgpt-enterprise")
                      ? planImagesFull["chgpt-enterprise"]
                      : userState.userPlan?.startsWith("chgpt-basic")
                      ? planImagesFull["chgpt-basic"]
                      : userState.userPlan?.startsWith("chgpt-essentials")
                      ? planImagesFull["chgpt-essentials"]
                      : planImagesFull[userState.userPlan]
                  }
                ></img>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column-reverse", sm: "column" },
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  href="/dashboard/pricing"
                  passHref
                >
                  <Box className="btn-box blue-btn" sx={{ width: "100%" }}>
                    <Button
                      sx={{
                        color: "white",
                      }}
                    >
                      {userState.userPlan?.startsWith("chgpt-enterprise")
                        ? "Want More?"
                        : "Upgrade to Unlock"}
                    </Button>
                  </Box>
                </Link>
                <Typography
                  sx={{
                    opacity: 0.9,
                    fontSize: "16px",
                  }}
                >
                  {userState.userPlan?.startsWith("chgpt-enterprise")
                    ? plantext1["chgpt-enterprise"]
                    : plantext1[userState.userPlan]}
                  {userState.userPlan?.startsWith("chgpt-enterprise")
                    ? plantext2["chgpt-enterprise"]
                    : plantext2[userState.userPlan]}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Data Analytics section starts */}
        <Grid item xs={12} sm={9} sx={{ mt: "32px" }}>
          <Typography
            sx={{
              pb: {
                xs: "4px",
                sm: "10px",
              },
              fontSize: {
                xs: "16px",
                sm: "20px",
              },
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            {" "}
            Data Analytics{" "}
          </Typography>
          <Typography>
            Here is a quick overview of your account analytics.
          </Typography>
          <hr style={{ opacity: "0.5" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              mt: "40px",
              justifyContent: "space-between",
            }}
          >
            <Card sx={{ width: "100%" }}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  lg={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "25px",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: {
                          xs: "18px",
                          sm: "24px",
                        },
                        opacity: 0.8,
                      }}
                      gutterBottom
                    >
                      Usage
                    </Typography>
                    <Typography
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      See how many product calls you have left this month
                    </Typography>
                  </Box>
                  <Box sx={{ display: isDesktop ? "block" : "none" }}>
                    <Stack
                      direction={"row"}
                      spacing={1}
                      alignItems={"center"}
                      sx={{ paddingY: "15px" }}
                    >
                      <AutoFixHighIcon
                        sx={{
                          fontSize: {
                            xs: "20px",
                            sm: "24px",
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "14px",
                            sm: "24px",
                          },
                          fontWeight: 600,
                          opacity: 0.8,
                        }}
                      >
                        {userState.callsLeft}/{userState.allowedCalls}{" "}
                        <Typography
                          component="span"
                          sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                        >
                          product calls left
                        </Typography>
                      </Typography>
                    </Stack>
                    <Button
                      component={Link}
                      href="/dashboard/pricing"
                      variant="contained"
                      sx={{ width: "100%", color: "white" }}
                    >
                      Upgrade
                    </Button>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  lg={6}
                  sx={{
                    display: "flex",
                    justifyContent: isDesktop ? "flex-end" : "center",
                    alignItems: "center",
                    padding: "25px",
                  }}
                  gap={2}
                >
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    {totalConsumedCalls > 0 ? (
                      // Show the Pie Chart when consumed calls are not zero
                      <PieChart
                        series={[
                          {
                            data: pieData.map((item) => ({
                              label: item?.label,
                              value: parseFloat(item?.value), // Convert back to number
                            })),
                            innerRadius: isMobile ? 29 : 64,
                            outerRadius: isMobile ? 35 : 75,
                            cx: isMobile ? 30 : 70,
                          },
                        ]}
                        slotProps={{
                          legend: { hidden: true },
                        }}
                        width={isMobile ? 70 : 150}
                        height={isMobile ? 70 : 150}
                      />
                    ) : (
                      // Display static view when consumed calls are zero
                      <Box
                        sx={{
                          width: isMobile ? "60px" : "150px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          paddingRight: "35px",
                        }}
                      >
                        {/* Static Platform Utilization Section */}
                        {/* <Typography sx={{ fontWeight: 'bold', fontSize: isMobile ? '8px' : '12px', marginBottom: '4px' }}>Platform Utilization</Typography> */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "2px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: isMobile ? "10px" : "14px",
                              marginRight: "4px", // Ensure there's space between the text and next element
                            }}
                          >
                            Platform
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              fontSize: isMobile ? "10px" : "1px",
                            }}
                          >
                            Utilization
                          </Typography>
                        </Box>

                        {/* ContentHubGPT */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "2px",
                            marginRight: "20px",
                          }}
                        >
                          <Box
                            sx={{
                              width: "15px",
                              height: "15px",
                              backgroundColor: "#03A9F4",
                              marginRight: "4px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: isMobile ? "10px" : "14px",
                              fontWeight: "semi-bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ContentHubGPT 0%
                          </Typography>
                        </Box>
                        {/* Salsify */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "2px",
                          }}
                        >
                          <Box
                            sx={{
                              width: "15px",
                              height: "15px",
                              backgroundColor: "#1E88E5",
                              marginRight: "4px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: isMobile ? "10px" : "14px",
                              fontWeight: "semi-bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Salsify 0%
                          </Typography>
                        </Box>

                        {/* BigCommerce */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "2px",
                          }}
                        >
                          <Box
                            sx={{
                              width: "15px",
                              height: "15px",
                              backgroundColor: "#9c27b0",
                              marginRight: "4px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: isMobile ? "10px" : "14px",
                              fontWeight: "semi-bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            BigCommerce 0%
                          </Typography>
                        </Box>

                        {/* Shopify */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "2px",
                          }}
                        >
                          <Box
                            sx={{
                              width: "15px",
                              height: "15px",
                              backgroundColor: "#60009B",
                              marginRight: "4px",
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: isMobile ? "10px" : "14px",
                              fontWeight: "semi-bold",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Shopify 0%
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Centered Text - Display only when pie chart is visible */}
                    {totalConsumedCalls > 0 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: isMobile ? "8px" : "14px", // Reduce size for mobile
                          fontWeight: "bold",
                          textAlign: "center",
                          lineHeight: isMobile ? "10px" : "14px", // Reduce line height
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        Platform Utilization
                      </Box>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      marginLeft: isMobile ? "12px" : "0px",
                    }}
                  >
                    <CircularWithValueLabel
                      progress={
                        (userState.callsLeft / userState.allowedCalls) * 100
                      }
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: isDesktop ? "none" : "block",
                    padding: "25px",
                  }}
                >
                  <Box>
                    <Stack
                      direction={"row"}
                      spacing={1}
                      alignItems={"center"}
                      sx={{ paddingY: "15px" }}
                    >
                      <AutoFixHighIcon
                        sx={{
                          fontSize: {
                            xs: "20px",
                            sm: "24px",
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "14px",
                            sm: "24px",
                          },
                          fontWeight: 600,
                          opacity: 0.8,
                        }}
                      >
                        {userState.callsLeft}/{userState.allowedCalls}{" "}
                        <Typography
                          component="span"
                          sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                        >
                          product calls left
                        </Typography>
                      </Typography>
                    </Stack>
                    <Button
                      component={Link}
                      href="/dashboard/pricing"
                      variant="contained"
                      sx={{ width: "100%", color: "white" }}
                    >
                      Upgrade
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </Grid>
        {/* Data Analytics section ends */}

        {/* Featured tools section starts */}
        <Grid item xs={12} sm={9} sx={{ mt: "32px" }}>
          <Typography
            sx={{
              pb: {
                xs: "4px",
                sm: "10px",
              },
              fontSize: {
                xs: "16px",
                sm: "20px",
              },
              lineHeight: 1.2,
              fontWeight: 600,
            }}
          >
            {" "}
            Featured Tools{" "}
          </Typography>
          <Typography>
            Try our powerful AI tools and get started generating better product
            content
          </Typography>
          <hr style={{ opacity: "0.5" }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                md: "row",
              },
              mt: "40px",
              justifyContent: "space-between",
            }}
          >
            <Card
              className="feature-cards"
              onMouseEnter={() => setIsHoveredContent(true)}
              onMouseLeave={() => setIsHoveredContent(false)}
              sx={{
                // width: "auto",
                flex: 1,
                maxWidth: "100%",
                minWidth: 0,
                boxShadow: "rgba(99, 99, 99, 0.2) 0 2px 8px 0 !important",
                p: "10px",
                mr: "18px",
                mb: {
                  xs: "20px",
                  md: "0px",
                },
                textAlign: "center",
                // padding: '25px'
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    mt: "10px",
                    pr: "10px",
                  }}
                >
                  <img
                    className="feature-image"
                    src={
                      isHoveredContent
                        ? "/dashboard/contentgen_white.svg"
                        : "/dashboard/contentgen.svg"
                    }
                  ></img>
                </Box>
                <Typography
                  className="text"
                  sx={{
                    pb: {
                      xs: "4px",
                      sm: "10px",
                    },
                    fontSize: {
                      xs: "14px",
                      sm: "20px",
                    },
                    lineHeight: 1.2,
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  Content Generation{" "}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "16px",
                  },
                }}
              >
                Organize and Manage your products within a catalog.
              </Typography>
            </Card>
            <Card
              className="feature-cards"
              onMouseEnter={() => setIsHoveredSeo(true)}
              onMouseLeave={() => setIsHoveredSeo(false)}
              sx={{
                // width: "auto",
                flex: 1,
                maxWidth: "100%",
                minWidth: 0,
                boxShadow: "rgba(99, 99, 99, 0.2) 0 2px 8px 0 !important",
                p: "10px",
                mr: "18px",
                mb: {
                  xs: "20px",
                  md: "0px",
                },
                textAlign: "center",
                // padding: '25px'
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    mt: "10px",
                    pr: "10px",
                  }}
                >
                  <img
                    className="feature-image"
                    src={
                      isHoveredSeo
                        ? "/dashboard/SEO_white.svg"
                        : "/dashboard/SEO.svg"
                    }
                  ></img>
                </Box>
                <Typography
                  className="text"
                  sx={{
                    pb: {
                      xs: "4px",
                      sm: "10px",
                    },
                    fontSize: {
                      xs: "14px",
                      sm: "20px",
                    },
                    lineHeight: 1.2,
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  SEO{" "}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "16px",
                  },
                }}
              >
                Integrate keywords relevant to product.
              </Typography>
            </Card>
            <Card
              className="feature-cards"
              onMouseEnter={() => setIsHoveredTaxonomy(true)}
              onMouseLeave={() => setIsHoveredTaxonomy(false)}
              sx={{
                // width: "auto",
                flex: 1,
                maxWidth: "100%",
                minWidth: 0,
                boxShadow: "rgba(99, 99, 99, 0.2) 0 2px 8px 0 !important",
                p: "10px",
                mr: "18px",
                mb: {
                  xs: "20px",
                  md: "0px",
                },
                textAlign: "center",
                // padding: '25px'
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    mt: "10px",
                    pr: "10px",
                  }}
                >
                  <img
                    className="feature-image"
                    src={
                      isHoveredTaxonomy
                        ? "/dashboard/taxonomy_white.svg"
                        : "/dashboard/taxonomy.svg"
                    }
                  ></img>
                </Box>
                <Typography
                  className="text"
                  sx={{
                    pb: {
                      xs: "4px",
                      sm: "10px",
                    },
                    fontSize: {
                      xs: "14px",
                      sm: "20px",
                    },
                    lineHeight: 1.2,
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  Taxonomy{" "}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "16px",
                  },
                }}
              >
                Integrate categorization of your products in the catalog.
              </Typography>
            </Card>

            {/* check trending seo keywords */}

            <Card
              className="feature-cards"
              onMouseEnter={() => {
                setIsHoveredTaxonomy(true);
              }}
              onMouseLeave={() => setIsHoveredTaxonomy(false)}
              onClick={() => router.push("/dashboard/seo-trends")}
              sx={{
                // width: "auto",
                flex: 1,
                maxWidth: "100%",
                minWidth: 0,
                boxShadow: "rgba(99, 99, 99, 0.2) 0 2px 8px 0 !important",
                p: "10px",
                mr: {
                  xs: "18px",
                  md: "0px",
                },
                mb: {
                  xs: "20px",
                  md: "0px",
                },
                textAlign: "center",
                cursor: "pointer",
                // padding: '25px'
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    mt: "10px",
                    pr: "10px",
                  }}
                >
                  <img
                    className="feature-image"
                    src={
                      isHoveredTaxonomy
                        ? "/dashboard/SEO_white.svg"
                        : "/dashboard/SEO.svg"
                    }
                  ></img>
                </Box>
                <Typography
                  className="text"
                  sx={{
                    pb: {
                      xs: "4px",
                      sm: "10px",
                    },
                    fontSize: {
                      xs: "14px",
                      sm: "20px",
                    },
                    lineHeight: 1.2,
                    fontWeight: 600,
                  }}
                >
                  {" "}
                  Explore Trending SEO{" "}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "16px",
                  },
                }}
              >
                Explore a detailed report on how we generate seo keywords for
                you.
              </Typography>
            </Card>
          </Box>
        </Grid>
        {/* Featured tools section ends */}
      </Grid>
    </Root>
  );
}

export default home;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const user = session.user;

  return {
    props: {
      user,
    },
  };
}
