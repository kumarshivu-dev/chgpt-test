import { Paid, Help } from "@mui/icons-material";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Link,
  Avatar,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContent,
  Chip,
  MenuItem,
  Menu,
} from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import LinearProgress from "@mui/material/LinearProgress";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { setCookie } from "../../../utils/cookies";
import { useSelector } from "react-redux";
import { CONTACT_US_LINK } from "../../../utils/apiEndpoints";
import "../../../components/dashboard/header/dashboard-header.css";
import {showToast, useToast } from "../../../context/ToastContext";
import {useUser } from "../../../context/UserContext";

export default function DashboardHeader(props) {
  // redux-state management
  const userStore = useSelector((state) => state.user);
  const { userInfo } = userStore;
  // const { data: session } = useSession();
  const { data: session, status } = useSession();
  const router = useRouter();
  // const showToast = useToast();
  const [progress, setProgress] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [windowSize, setWindowSize] = useState(800);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [tourValue, setTourValue] = useState("");

  //To fetch first letters of the user name
  const nameInitials = useMemo(() => {
    if (props?.user?.name) {
      return props?.user?.name
        .split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("");
    }
    return "";
  }, [props?.user?.name]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseHelp = () => {
    setAnchorEl(null);
  };
  const uploadState = useSelector((state) => state.uploadpage);
  const userState = useSelector((state) => state.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;
  const userBrands = userState?.userBrands;
  const orgName = userState?.userInfo?.company;

  useEffect(() => {
    const currentURL = router.pathname;
    const isImage = uploadState.isImageRec;

    const tourMap = {
      "/dashboard/settings/brand-voice": "Brand Voice Tour",
      "/dashboard/settings/hypertarget": "Hypertargeting Tour",
      "/dashboard/products": () =>
        isImage ? "Image Recognition Tour" : "Run Quick Tour",
    };

    const getTourValue = tourMap[currentURL];
    setTourValue(
      typeof getTourValue === "function"
        ? getTourValue()
        : getTourValue || "Run Quick Tour"
    );
  }, [router.pathname, uploadState.isImageRec]);

  const { users, loading, refreshUserData, progressData, clearUserData } = useUser();
  const refreshedRef = useRef(false);

  // Create a ref to track if this specific success has been handled
  const successHandledRef = useRef(false);
  
  useEffect(() => {
    if (
      (progressData?.state === "SUCCESS" ||
        progressData?.state === "TIMEOUT" ||
        progressData?.state === "FAILURE") &&
      !successHandledRef.current
    ) {
      successHandledRef.current = true;

      const userEmail = localStorage.getItem("useremail");
      if(progressData?.state === "SUCCESS"){
        showToast("Your Instance Operation is Successful", "info");
      }
      else if(progressData?.state === "FAILURE"){
        showToast("Your Instance Operation is Failed", "info");
      }
      else{
        showToast("Your Instance Operation is Timeout", "info");
      }

      fetch("/api/deleteUsers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          clearUserData();
        })
        .catch((err) => {
          console.error("Delete error:", err);
        });
        localStorage.removeItem("useremail");
    }

    // Reset the ref when progressData changes to something other than SUCCESS
    // This ensures we can handle the next success
    if (!["SUCCESS", "TIMEOUT", "FAILURE"].includes(progressData?.state)) {
      successHandledRef.current = false;
    }
  }, [progressData, clearUserData]);

    useEffect(() => {
      // Only refresh if we haven't refreshed before on this path
      if (!refreshedRef.current) {
        refreshUserData();
        refreshedRef.current = true;
      }
      
      // Reset the ref when the path changes
      return () => {
        refreshedRef.current = false;
      };
    }, [router.pathname]); // Only run when the path changes

  const handleMenuAction = (action) => {
    setAnchorEl(null);

    if (action === "help") {
      router.push("/dashboard/how-to-guide");
    } else if (action === "contact support") {
      router.push("/dashboard/contact-support");
    } else {
      const tourMap = {
        "/dashboard/settings/brand-voice": "/dashboard/settings/brand-voice",
        "/dashboard/settings/hypertarget": "/dashboard/settings/hypertarget",
        "/dashboard/products": "/dashboard/products",
      };

      const targetURL = tourMap[router.pathname] || "/dashboard/products";
      setCookie("isTour", true);
      setCookie("isFreshUser", false);
      if (uploadState.isImageRec) {
        setCookie("isImageRec", true);
      }
      window.location.href = targetURL;
    }
  };

  // To fetch window screen width
  useEffect(() => {
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    handleSize();
  }, []);

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
  }, [status]);

  const handleOpenProfileModal = () => {
    setProfileDialogOpen(true);
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
  };

  const displayName = useMemo(() => {
    if (brandSpecification?.brandSpecific && brandSpecification?.brandId) {
      const brand = userBrands?.find(
        (brand) => brand.brand_id === brandSpecification.brandId
      );
      return brand?.name; // Fallback if brand ID does not match
    } else if (brandSpecification?.brandSpecific === false) {
      return orgName; // Fallback for missing organization name
    }
    return null; // Default fallback
  }, [brandSpecification, userBrands, orgName]);

  return (
    <>
      <AppBar
        // position="static"
        className="dashboard-header"
      >
        <LinearProgress
          className="linear-progress"
          id="prog-bar"
          value={progress}
          variant="determinate"
        />

        <Container className="container" maxWidth="xl">
          <Toolbar className="toolbar" disableGutters>
            <Box sx={{ flexGrow: 1 }} />
            {displayName && (
              <Typography className="access-name">
                {brandSpecification?.brandSpecific && displayName
                  ? `BRAND: ${displayName}`
                  : `ORG: ${displayName}`}
              </Typography>
            )}

            <Box className="icons-box">
              <IconButton
                className="paid-icon"
                onClick={() => router.push("/dashboard/pricing")}
              >
                <Paid className="icons" />
              </IconButton>

              <IconButton
                className="help-icon"
                id="basic-button"
                onClick={handleClick}
                // onClick={() => router.push("/dashboard/how-to-guide")}
              >
                <Help
                  className="icons"

                  // fontSize='large'
                />
              </IconButton>

              {/* <Box sx={{ flexGrow: 0 }}> */}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseHelp}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  className="menu-item"
                  onClick={() => handleMenuAction("help")}
                >
                  How-to Guide
                </MenuItem>

                <MenuItem
                  className="menu-item"
                  onClick={() => handleMenuAction("tour")}
                >
                  {tourValue}
                </MenuItem>

                <MenuItem
                  className="menu-item"
                  onClick={() => handleMenuAction("contact support")}
                >
                  Contact Support
                </MenuItem>
              </Menu>
              <Dialog
                open={profileDialogOpen}
                onClose={handleCloseProfileDialog}
                fullWidth
                className="profile-ic-modal"
              >
                <DialogTitle className="dialog-title">
                  <img src="/contenthubgpt_logo.png" />
                </DialogTitle>
                <DialogContent>
                  <Box className="dialog-content">
                    <Avatar
                      src={
                        process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL +
                        userInfo?.profileImage
                      }
                      className="avatar"
                    >
                      {!userInfo?.profileImage && nameInitials}
                    </Avatar>
                    <Box className="name-email-box">
                      <Box>
                        <Typography variant="h6">
                          {props?.user?.name}
                          <Chip
                            size="small"
                            className="chip"
                            label={props?.user?.role || "User"}
                            color={
                              props?.user?.role === "Admin"
                                ? "primary"
                                : "default"
                            }
                            variant="outlined"
                          />
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {props?.user?.email}
                      </Typography>
                    </Box>
                  </Box>
                  <DialogActions className="dialog-actions">
                    <Button
                      variant="contained"
                      onClick={() => {
                        router.push("/dashboard/profile");
                        handleCloseProfileDialog();
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCloseProfileDialog}
                    >
                      Close
                    </Button>
                  </DialogActions>
                </DialogContent>
              </Dialog>

              <Link
                className="profile-link"
                onClick={() =>
                  windowSize <= 768
                    ? handleOpenProfileModal()
                    : router.push("/dashboard/profile")
                }
              >
                <Tooltip
                  placement="bottom-start"
                  title={
                    <Box>
                      <Typography variant="body2">
                        {props?.user?.name}{" "}
                        {props?.user?.role &&
                        props.user.role !== "ROLE_NOT_DEFINED" ? (
                          <strong>({props?.user?.role})</strong>
                        ) : null}
                      </Typography>
                      <Typography variant="body2">
                        {props?.user?.email}
                      </Typography>
                    </Box>
                  }
                >
                  <Avatar
                    src={
                      process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL +
                      userInfo?.profileImage
                    }
                    className="profile-avatar"
                  >
                    {!userInfo?.profileImage && nameInitials}
                  </Avatar>
                </Tooltip>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
