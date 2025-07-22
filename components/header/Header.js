import Image from "next/image";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Button,
  Container,
  Stack,
  Menu,
  MenuItem,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
  AlertTitle,
  Avatar,
  Drawer,
  Divider,
  List,
  ListItem,
  SvgIcon,
} from "@mui/material";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { validateSession } from "../../hooks/validateSession";
import { useRouter } from "next/router";
import LinearProgress from "@mui/material/LinearProgress";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setImageRec } from "../../store/uploadSlice";

export default function Header(props) {
  // const { data: session } = useSession();
  const { data: session, status } = useSession();
  const router = useRouter();
  const isUploadPage = router.pathname === "/uploadpage";
  const [paid, setPaid] = useState(false);
  const [warnSnackbar, setWarnSnackbar] = useState(false);
  const [taxonomySnackbar, setTaxonomySnackbar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taxonomy, setTaxonomy] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userPlan, setUserPlan] = useState("Free");
  const dispatch = useDispatch();
  const uploadState = useSelector((state) => state.uploadpage);
  const open = Boolean(anchorEl);
  const [windowSize, setWindowSize] = useState(800);

  const [renewalDate, setRenewalDate] = useState("");
  const [daysLeftToReset, setDaysLeftToReset] = useState(0);
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalCallsMade, setTotalCallsMade] = useState(0);

  // To fetch window screen width
  useEffect(() => {
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    handleSize();
  });
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickProfile = () => {
    setAnchorEl(null);
    props.user.realm === "walmart"
      ? router.push("/walmart/profile")
      : router.push("/profile");
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleSignOut = () => {
    if (session.user?.realm === "walmart") {
      signOut({ callbackUrl: "/walmart/dashboard" });
    } else {
      signOut({ callbackUrl: "/uploadpage" });
    }
  };

  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    const handleStart = () => {
      document.getElementById("prog-bar").style.visibility = "visible";
      setProgress(30); // Set an initial progress value
    };

    const handleComplete = () => {
      setProgress(100); // Set progress to 100% when navigation completes
      const progBarElement = document.getElementById("prog-bar");
      if (progBarElement) {
        setTimeout(() => {
          progBarElement.style.visibility = "hidden";
        }, 1000);
      }
    };
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [status]);

  useEffect(() => {
    document.getElementById("prog-bar").style.visibility = "hidden";

    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/profile", {
        headers: {
          Authorization: props.user?.id_token,
        },
      })
      .then((response) => {
        if (response.data.paidUser == true) {
          let spliteWords = response.data.planCode.split("-");
          let userPlanCode =
            spliteWords[1].charAt(0).toUpperCase() + spliteWords[1].slice(1);
          setUserPlan(userPlanCode);
          setPaid(true);
          if (
            response.data.planCode == "chgpt-premium" ||
            response.data.planCode == "chgpt-elite"
          ) {
            setTaxonomy(true);
          }

          if (
            response.data.planCode == "chgpt-elite" ||
            response.data.planCode.startsWith("chgpt-enterprise")
          ) {
            dispatch(setImageRec(true));
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [status]);

  const processAccountData = (data) => {
    // parse Data object from  ISO 8601 format
    const dataString = data?.Account_Renewal_Date;
    const formattedDate = dataString
      ? new Date(dataString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

    //Calcuated Number of day's from given date for reset
    const countResetDateString = data?.Count_Reset;
    const currentDate = new Date();
    const countResetDate = new Date(countResetDateString);
    const timeDifference = countResetDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    setRenewalDate(formattedDate);
    setTotalCalls(data?.Calls_Left + data?.Calls_Made);
    setTotalCallsMade(data?.Calls_Made);
    setDaysLeftToReset(daysDifference);
  };

  const fetchAccountParameters = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL +
          "/standalone/show/account_parameters",
        {
          headers: {
            Authorization: props.user?.id_token,
          },
        }
      );
      // console.log("Account Parameter: ", response);
      const { data } = response;
      processAccountData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAccountParameters();
  }, [status]);

  const handleSnackbarClose = () => {
    setWarnSnackbar(false);
    setTaxonomySnackbar(false);
  };
  const handleLinkClick = () => {
    if (paid == false) {
      setWarnSnackbar(true);
    }
  };
  const handleTaxonomyClick = () => {
    if (taxonomy == false) {
      setTaxonomySnackbar(true);
    }
  };
  //To fetch first letters of the user name
  const nameIntials = props?.user?.name
    ? (props?.user?.name)
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: windowSize <= 768 ? "#f1f1f1" : "#fff",
          boxShadow:
            windowSize <= 768
              ? "none"
              : "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px",
        }}
      >
        <LinearProgress
          id="prog-bar"
          value={progress}
          variant="determinate"
          sx={{ width: "100%", paddingLeft: "0px" }}
        />

        <Container
          maxWidth="xl"
          sx={{
            pl: "10px",
            pr: "10px",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}>
              {isUploadPage ? (
                <Image
                  priority={true}
                  src="/standalone-logo.png"
                  width="204"
                  height="34"
                  alt="logo"
                ></Image>
              ) : props?.user?.realm === "walmart" ? (
                <Box>
                  <Link href="/walmart/dashboard">
                    <Image
                      priority
                      src="/standalone-logo.png"
                      width="204"
                      height="34"
                      alt="logo"
                    ></Image>
                  </Link>
                  <Image
                    alt="img"
                    src="/walmart/Walmart_logo.png"
                    width="125"
                    height="25"
                    style={{ marginLeft: "15px", marginBottom: "5px" }}
                  />
                </Box>
              ) : (
                <Link href="/dashboard/home">
                  <Image
                    priority
                    src="/standalone-logo.png"
                    width="204"
                    height="34"
                    alt="logo"
                  ></Image>
                </Link>
              )}
            </Box>

            {props?.user && (
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{
                    padding: "0px !important",
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  <Grid
                    item
                    className="hamburger-container"
                    xs={12}
                    sx={{
                      width: "100%",
                      height: "100vh",
                      background:
                        "linear-gradient(170.23deg, #001E48 0%, #000D20 111.21%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="./hamburger_bg.png"
                      alt="menu-background"
                      style={{
                        position: "relative",
                        WebkitMaskImage:
                          "linear-gradient(to bottom, #000D20 -500%, transparent)",
                      }}
                    />
                    <Grid
                      item
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        width: "100%",
                        position: "absolute",
                        top: 0,
                      }}
                    >
                      <Grid
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "50px",
                        }}
                      >
                        <Avatar
                          onClick={() => {
                            const profileRoute =
                              props?.user?.realm === "walmart"
                                ? "/walmart/profile"
                                : "/profile";
                            router.push(profileRoute);
                            handleCloseNavMenu();
                          }}
                          sx={{
                            bgcolor: "#FB9005",
                            width: "100px",
                            height: "100px",
                          }}
                        >
                          {nameIntials ? (
                            <Typography
                              variant="h4"
                              color="#FFFFFF"
                              sx={{ margin: 0 }}
                            >
                              {nameIntials}
                            </Typography>
                          ) : null}
                        </Avatar>
                      </Grid>

                      <Grid
                        item
                        className="user-details"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "10px",
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{
                            color: "#FFFFFF",
                            marginBottom: "12px",
                          }}
                        >
                          {props?.user?.name}
                        </Typography>

                        <Typography
                          sx={{
                            color: "#FFFFFF",
                            fontSize: "14px",
                          }}
                        >
                          <SvgIcon
                            sx={{
                              fontSize: "11px",
                              paddingRight: "8px",
                            }}
                          >
                            {userPlan == "Free" ? (
                              ""
                            ) : (
                              <svg
                                fill="none"
                                viewBox="0 0 12 12"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#a)">
                                  <path
                                    d="M0.5 4.625H3.25L5.3125 10.5375L0.5 4.625ZM11.5 4.625H8.75L6.6875 10.5375L11.5 4.625ZM6 10.8125L3.9375 4.625H8.0625L6 10.8125ZM3.25 3.9375H0.5L1.875 1.875L3.25 3.9375ZM11.5 3.9375H8.75L10.125 1.875L11.5 3.9375ZM7.375 3.9375H4.625L6 1.875L7.375 3.9375ZM2.79625 1.875H5.3125L3.9375 3.9375L2.79625 1.875ZM6.6875 1.875H9.4375L8.0625 3.9375L6.6875 1.875Z"
                                    fill="#FB9005"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="a">
                                    <rect
                                      transform="translate(.5 .5)"
                                      width="11"
                                      height="11"
                                      fill="#fff"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                            )}
                          </SvgIcon>
                          {userPlan} User
                        </Typography>

                        {props?.user?.realm === "walmart" ? (
                          ""
                        ) : (
                          <Typography
                            sx={{
                              color: "#FFFFFF",
                              fontSize: "14px",
                            }}
                          >
                            {userPlan == "Free" ? "" : "Renews"} {renewalDate}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    {props?.user?.realm === "walmart" ? (
                      ""
                    ) : (
                      <Grid
                        className="call-reset-info"
                        sx={{
                          display: "flex",
                          width: "80%",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingTop: "15px",
                        }}
                      >
                        <Grid item className="col-1" xs={8}>
                          <Typography
                            className="column-name"
                            sx={{
                              color: "white",
                              marginBottom: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            Product Calls Made
                          </Typography>
                          <Grid
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "35px",
                                textAlign: "center",
                                color: "white",
                              }}
                            >
                              {totalCallsMade}
                            </Typography>
                            <Typography
                              sx={{
                                textAlign: "center",
                                color: "white",
                                marginTop: "15px",
                              }}
                            >
                              /{totalCalls}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider
                          orientation="vertical"
                          sx={{
                            background: "#002E6D",
                          }}
                        />

                        <Grid item className="col-2" xs={4}>
                          <Typography
                            color="white"
                            className="column-name"
                            sx={{
                              color: "white",
                              marginBottom: "15px",
                              fontWeight: "bold",
                            }}
                          >
                            Resets In
                          </Typography>
                          <Grid
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "35px",
                                textAlign: "center",
                                color: "white",
                              }}
                            >
                              {daysLeftToReset}
                            </Typography>
                            <Typography
                              sx={{
                                textAlign: "center",
                                color: "white",
                                marginTop: "15px",
                              }}
                            >
                              days
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}

                    <Grid
                      className="linkGrid"
                      sx={{
                        width: "100%",
                      }}
                    >
                      <List
                        className="menuItems"
                        sx={{
                          paddingTop: "70px",
                        }}
                        onClick={() => handleCloseNavMenu()}
                      >
                        <ListItem
                          className={
                            router.pathname == "/how-to-guide" ? "active" : ""
                          }
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {props?.user?.realm === "walmart" ? (
                            ""
                          ) : (
                            <Link href="/how-to-guide" underline="none">
                              <Typography
                                sx={{
                                  margin: "0 10px",
                                  color: "#FFFFFF",
                                  display: "inline-block",
                                }}
                              >
                                How To Guide
                              </Typography>
                            </Link>
                          )}
                        </ListItem>
                        <ListItem
                          className={
                            router.pathname == "/pricing" ? "active" : ""
                          }
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Link
                            href={
                              props?.user?.realm === "walmart"
                                ? "/walmart/pricing"
                                : "/pricing"
                            }
                            underline="none"
                          >
                            <Typography
                              sx={{
                                margin: "0 10px",
                                color: "#FFFFFF",
                                display: "inline-block",
                              }}
                            >
                              Pricing
                            </Typography>
                          </Link>
                        </ListItem>
                        <ListItem
                          className={
                            router.pathname == "/uploadpage" ? "active" : ""
                          }
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Link
                            href={
                              props?.user?.realm === "walmart"
                                ? "/walmart/dashboard"
                                : "/uploadpage"
                            }
                            underline="none"
                          >
                            <Typography
                              sx={{
                                margin: "0 10px",
                                color: "#FFFFFF",
                                display: "inline-block",
                              }}
                            >
                              Upload Products
                            </Typography>
                          </Link>
                        </ListItem>
                        {props?.user?.realm === "walmart" ? (
                          <ListItem
                            className={
                              router.pathname == "/walmart/feeds"
                                ? "active"
                                : ""
                            }
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Link href="/walmart/feeds" underline="none">
                              <Typography
                                sx={{
                                  margin: "0 10px",
                                  color: "#FFFFFF",
                                  display: "inline-block",
                                }}
                              >
                                Feed Ids
                              </Typography>
                            </Link>
                          </ListItem>
                        ) : (
                          ""
                        )}

                        {uploadState.imageRec ? (
                          <ListItem
                            className={
                              router.pathname == "/imgrec_upload"
                                ? "active"
                                : ""
                            }
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Link href="/imgrec_upload" underline="none">
                              <Typography
                                sx={{
                                  margin: "0 10px",
                                  color: "#FFFFFF",
                                  display: "inline-block",
                                }}
                              >
                                Image Recognition
                              </Typography>
                            </Link>
                          </ListItem>
                        ) : (
                          ""
                        )}

                        <ListItem
                          className={
                            router.pathname == "/profile" ? "active" : ""
                          }
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Link
                            href={
                              props?.user?.realm === "walmart"
                                ? "/walmart/profile"
                                : "/profile"
                            }
                            underline="none"
                          >
                            <Typography
                              sx={{
                                padding: "10px 15px",
                                margin: "0 10px",
                                color: "#FFFFFF",
                                display: "inline-block",
                              }}
                            >
                              Settings
                            </Typography>
                          </Link>
                        </ListItem>
                      </List>
                    </Grid>
                  </Grid>
                </Drawer>
              </Box>
            )}

            {/* not need to touch  below code standalone logo mobile  */}
            <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
              {isUploadPage ? (
                <Image
                  priority
                  src="/standalone-logo.png"
                  width="204"
                  height="34"
                  alt="logo"
                ></Image>
              ) : (
                <Link href="/uploadpage">
                  <Image
                    priority
                    src="/standalone-logo.png"
                    width="204"
                    height="34"
                    alt="logo"
                  ></Image>
                </Link>
              )}
            </Box>

            {/* menu item for webpage */}
            {props?.user && (
              <Box
                className="menuRight"
                sx={{
                  flexGrow: 1,
                  display: {
                    xs: "none",
                    md: "flex",
                    justifyContent: "flex-end",
                  },
                }}
              >
                {props?.user?.realm === "walmart" ? null : (
                  <Link
                    href="/how-to-guide"
                    className={
                      router.pathname == "/how-to-guide" ? "active" : ""
                    }
                    underline="none"
                  >
                    <Typography
                      sx={{
                        padding: "10px 15px",
                        margin: "0 10px",
                        color: "#828282",
                        display: "inline-block",
                      }}
                    >
                      How To Guide
                    </Typography>
                  </Link>
                )}
                {props?.user?.realm === "walmart" ? (
                  <Link
                    href="/walmart/pricing"
                    className={
                      router.pathname == "/walmart/pricing" ? "active" : ""
                    }
                    underline="none"
                  >
                    <Typography
                      sx={{
                        padding: "10px 15px",
                        margin: "0 10px",
                        color: "#828282",
                        display: "inline-block",
                      }}
                    >
                      Pricing
                    </Typography>
                  </Link>
                ) : (
                  <Link
                    href="/pricing"
                    className={router.pathname == "/pricing" ? "active" : ""}
                    underline="none"
                  >
                    <Typography
                      sx={{
                        padding: "10px 15px",
                        margin: "0 10px",
                        color: "#828282",
                        display: "inline-block",
                      }}
                    >
                      Pricing
                    </Typography>
                  </Link>
                )}

                {props?.user?.realm === "walmart" ? (
                  <Link
                    href="/walmart/feeds"
                    className={
                      router.pathname === "/walmart/feeds" ? "active" : ""
                    }
                    underline="none"
                  >
                    <Typography
                      sx={{
                        padding: "10px 15px",
                        margin: "0 10px",
                        color: "#828282",
                        display: "inline-block",
                      }}
                    >
                      Feed Ids
                    </Typography>
                  </Link>
                ) : (
                  ""
                )}

                {props?.user?.realm === "walmart" ? (
                  <Link
                    href="/walmart/dashboard"
                    className={
                      router.pathname === "/walmart/dashboard" ? "active" : ""
                    }
                    underline="none"
                  >
                    <Typography
                      sx={{
                        padding: "10px 15px",
                        margin: "0 10px",
                        color: "#828282",
                        display: "inline-block",
                      }}
                    >
                      Upload Products
                    </Typography>
                  </Link>
                ) : (
                  <Link
                    href="/uploadpage"
                    className={
                      router.pathname === "/uploadpage" ? "active" : ""
                    }
                    underline="none"
                  >
                    <Typography
                      sx={{
                        padding: "10px 15px",
                        margin: "0 10px",
                        color: "#828282",
                        display: "inline-block",
                      }}
                    >
                      Upload Products
                    </Typography>
                  </Link>
                )}
                {uploadState.imageRec ? (
                  <Link
                    href="/imgrec_upload"
                    className={
                      router.pathname == "/imgrec_upload" ? "active" : ""
                    }
                    underline="none"
                  >
                    <Typography
                      sx={{
                        padding: "10px 15px",
                        margin: "0 10px",
                        color: "#828282",
                        display: "inline-block",
                      }}
                    >
                      Image Recognition
                    </Typography>
                  </Link>
                ) : (
                  ""
                )}
              </Box>
            )}

            {/* for moble view    */}
            <Box>
              {windowSize <= 768 ? (
                <Avatar
                  onClick={handleClick}
                  sx={{
                    backgroundColor: "#FB9005",
                    color: "#ffffff",
                    padding: "4px",
                  }}
                >
                  {nameIntials ? (
                    <Typography variant="h2" color="#FFFFFF" sx={{ margin: 0 }}>
                      {nameIntials}
                    </Typography>
                  ) : null}
                </Avatar>
              ) : (
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  variant="contained"
                  size="medium"
                  startIcon={<AccountCircleRoundedIcon />}
                  sx={{
                    backgroundColor: "#FB9005",
                    color: "#ffffff",
                    borderRadius: "50px",
                    "&:hover": {
                      backgroundColor: "#f6aa46",
                    },
                  }}
                >
                  {props?.user?.name}
                </Button>
              )}
            </Box>

            {/* profile logo -->  */}
            <Box sx={{ flexGrow: 0 }}>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  sx={{ paddingLeft: "50px", paddingRight: "50px" }}
                  onClick={handleClickProfile}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  sx={{ paddingLeft: "50px", paddingRight: "50px" }}
                  onClick={() => handleSignOut()}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
        {/* Snackbar section */}
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
            please{" "}
            <a style={{ color: "red" }} href="/pricing">
              upgrade
            </a>{" "}
            to use SEO enhancement
          </Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={taxonomySnackbar}
          autoHideDuration={10000}
          onClose={handleSnackbarClose}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            <AlertTitle>Error</AlertTitle>
            please{" "}
            <a style={{ color: "red" }} href="/pricing">
              upgrade
            </a>{" "}
            to add taxonomy feature
          </Alert>
        </Snackbar>
      </AppBar>
    </>
  );
}
