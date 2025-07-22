import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Icon,
  SvgIcon,
  Stack,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { signOut, useSession, getSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import Carousel from "react-material-ui-carousel";
import "dotenv";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowForward, Directions } from "@mui/icons-material";
import cookie from "js-cookie";
import { useContext } from "react";
import { getCookie, setCookie } from "cookies-next";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Spinner from "../components/spinner/Spinner";
import { useSearchParams } from "next/navigation";
import SnackbarNotifier from "../components/helper/dashboard/snackbarNotifier";
import VisualStatsGraph from "../components/feature/VisualStatsGraph";
import { useFilename } from "../context/filename";
import { useToast } from "../context/ToastContext";
import LoginPage from "./variant-login";

export default function Login({ showNewPage, ...props }) {
  const { showToast } = useToast();
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  let getEmail = searchParams.get("email");
  const [email, setEmail] = useState(getEmail);
  const [emailLowerCase, setEmailLowerCase] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const [otp, setOtp] = useState("");
  const [formError, setFormError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  let imageWidth = 300; // Default size
  if (isMobile) imageWidth = 200; // Reduce size for mobile
  else if (isTablet) imageWidth = 350; // Reduce size for tablet

  const logo1Width = isMobile ? 140 : isTablet ? 190 : 230;
  const logo1Height = isMobile ? 40 : isTablet ? 45 : 50;
  const logo2Width = isMobile ? 130 : isTablet ? 160 : 180;
  const logo2Height = isMobile ? 40 : isTablet ? 45 : 50;

  useEffect(() => {
    let timer;
    if (showOtpForm && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showOtpForm, resendTimer]);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: session, status } = useSession();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { setIsFilenameExists } = useFilename();

  useEffect(() => {
    if (
      router.query.callbackUrl &&
      router.query.callbackUrl.includes("filename")
    ) {
      setIsFilenameExists(true);
    }
  }, [router.query, setIsFilenameExists]);

  useEffect(() => {
    document.getElementsByClassName("main-login")[0].style.maxWidth = "none";
    document.getElementsByClassName("main-login")[0].style.paddingLeft = "0px";
    document.getElementsByClassName("main-login")[0].style.paddingRight = "0px";
    document.getElementsByClassName("main-login")[0].style.marginBottom = "0px";

    if (props?.query?.realm === "walmart") {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const rememberMeCookie = cookie.get("rememberMe");
    if (rememberMeCookie) {
      setIsChecked(!rememberMeCookie.match(/^(not-accepted)/));
    }
    if (props.query.realm === "walmart") {
      cookie.set("realm", "walmart");
    } else {
      cookie.remove("realm");
    }
    cookie.remove("callbackUrl");
  }, []);

  useEffect(() => {
    if (cookie.get("login-msg")) {
      setSnackbarState({
        open: true,
        message: cookie.get("login-msg"),
        severity: "error",
      });
      setTimeout(() => {
        setSnackbarState({ open: false, severity: "error" });
        cookie.remove("login-msg");
      }, 3000);
    }
  }, [cookie.get()]);

  useEffect(() => {
    const { oktaAccess, email: queryEmail, callbackUrl } = router.query;
    if (oktaAccess && queryEmail) {
      const signInOptions = { token: oktaAccess, userEmail: queryEmail };
      signIn("okta", signInOptions).then((result) => {});
    }
  }, [router.query]);

  const handleBookDemoClick = () => {
    window.location.href =
      "https://meetings.hubspot.com/chandra-singh2/chandra-contenthubgpt";
  };

  const handleWhatIsGPTClick = () => {
    window.location.href = "https://contenthubgpt.gspann.com";
  };

  const handleWalmartMarkeSellertClick = () => {
    window.location.href =
      "https://seller.walmart.com/signup?q=&origin=solution_provider&src=0018Y000032uulT";
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    const currentTime = new Date();
    const utcString = currentTime.toISOString();
    cookie.set(
      "rememberMe",
      checked ? "accepted " + utcString : "not-accepted " + utcString
    );
  };

  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  const handleInput = (index, event) => {
    const value = event.target.value;
    if (value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    } else if (value.length === 0 && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleEnterOnEmail = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (e.target.value.length !== 0) {
        if (isChecked) {
          handleEmailSubmit();
        } else {
          setEmailError("Please accept the terms and conditions.");
          setEmailHelperText("Please accept the terms and conditions.");
        }
      }
    }
  };

  const handleEnterOnLogin = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (e.target.value.length !== 0) {
        handleOtpSubmit();
      }
    }
  };

  const handleEmailSubmit = async (e) => {
    setSpinner(true);
    if (!email || emailError) {
      setEmailHelperText(emailError || "");
    }
    if (email.trim() === "") {
      setFormError(true);
    } else {
      setEmailLowerCase(email.toLocaleLowerCase());
      await axios
        .post(process.env.NEXT_PUBLIC_BASE_URL + `/auth/email/otp`, {
          email: email.toLowerCase(),
          variant_page: false, // Old page indicator
          sign_up: !!props?.query?.signup,
        })
        .then((res) => {
          if (res.data.status == "success") {
            setSpinner(false);
            setShowOtpForm(true);
            setResendTimer(30);
          }
        })
        .catch((err) => {
          setSpinner(false);
          const errorMsg = err?.response?.data?.message;
          setEmailError(errorMsg);
          setEmailHelperText(errorMsg);
          setCookie("login-msg", errorMsg);
        });
    }
  };

  const handleOtpSubmit = async (e) => {
    setSpinner(true);
    if (otp.trim() === "") {
      setFormError(true);
    } else {
      const result = await signIn("otp", {
        email: emailLowerCase,
        otp,
        redirect: false,
      });
      if (result.error === "Invalid OTP") {
        setSpinner(false);
        setOtp("");
        setErrorMessage("Invalid Secure Code");
      } else if (
        result.error === "OTP has expired. Please request a new one."
      ) {
        setSpinner(false);
        setOtp("");
        setErrorMessage("OTP has expired. Please request a new one.");
      } else if (result.ok) {
        setSpinner(false);
        setSuccessMessage("Success");
        setErrorMessage("");
        const userSession = await getSession();
        if (window.gtag && userSession?.user?.newUser) {
          window.gtag("event", "Old_Page_SignUp", {
            event_category: "Authentication",
            event_label: "Old Login Page",
          });
        }
        if (
          userSession?.user?.realm === "walmart" ||
          props.query.realm === "walmart"
        ) {
          router.push({ pathname: "/walmart/dashboard" });
        } else {
          if (
            Object.keys(router.query).length !== 0 &&
            router.query.callbackUrl !== undefined
          ) {
            router.push(router.query.callbackUrl);
            cookie.set("callbackUrl", router.query.callbackUrl);
          } else {
            router.push({ pathname: "/dashboard/home" });
          }
        }
      } else {
        setSpinner(false);
        setErrorMessage("");
      }
    }
  };

  useEffect(() => {
    if (window.gtag && !showNewPage) {
      window.gtag("event", "Old_page_view", {
        page_title: "Login",
        page_location: window.location.href,
        page_path: "/login",
        event_label: "Old Login Page",
      });
    }
  }, [showNewPage]);

  const handleResendOtp = async () => {
    setSpinner(true);
    setOtp("");
    setErrorMessage("");
    await axios
      .post(process.env.NEXT_PUBLIC_BASE_URL + `/auth/email/otp`, {
        email: email.toLowerCase(),
        variant_page: false,
        sign_up: !!props?.query?.signup,
      })
      .then((res) => {
        if (res.data.status == "success") {
          setSpinner(false);
          setResendTimer(30);
          showToast(`OTP sent successfully to ${email}`, "success");
        }
      })
      .catch((err) => {
        setSpinner(false);
        showToast(err?.message || "Failed to resend OTP.", "error");
      });
  };

  const arrayOfButtons = [
    <div className="nav-indicators">
      <p>Content Generation</p>
    </div>,
    <div className="nav-indicators">
      <p>SEO</p>
    </div>,
    <div className="nav-indicators">
      <p>Taxonomy</p>
    </div>,
  ];

  return (
    <>
      {showNewPage ? (
        <LoginPage {...props} />
      ) : (
        <Grid container className="login-page" sx={{ position: "relative" }}>
          <Image
            src="/loginBG.webp"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "31%",
              filter: "brightness(0.5)",
            }}
            alt="loginBG"
          />
          <Grid container item xs={12} className="new-login">
            <Grid item xs={10} md={6} className="login-text">
              {props?.query?.realm !== "walmart" ? (
                <Box>
                  <Grid container item>
                    <VisualStatsGraph />
                  </Grid>
                  {!isSmallScreen && (
                    <Box
                      className="cta-buttons-grid"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        padding: "15px 0",
                      }}
                    >
                      <Button
                        variant="contained"
                        component={Link}
                        sx={{
                          margin: "0 5px",
                          borderRadius: "2.5px",
                          padding: "5px 10px",
                          borderColor: "#FB9005",
                          textTransform: "capitalize",
                          "&:hover": { borderColor: "#FB9005" },
                        }}
                        href="https://meetings.hubspot.com/chandra-singh2/chandra-contenthubgpt"
                        target="_blank"
                      >
                        Book a Demo
                      </Button>
                      <Button
                        component={Link}
                        variant="outlined"
                        sx={{
                          margin: "0 5px",
                          color: "#FFFFFF",
                          textTransform: "capitalize",
                        }}
                        target="_blank"
                        href="https://contenthubgpt.gspann.com"
                      >
                        What is ContentHubGPT?
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                <Grid container item>
                  <Typography className="login-text-heading-wal">
                    Want to become a Walmart Marketplace Seller?
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#0070DC",
                      borderRadius: "2.5px",
                      padding: "7.5px 30px",
                      textTransform: "capitalize",
                      borderColor: "#0070DC",
                      "&:hover": {
                        backgroundColor: "#137FE8",
                        borderColor: "#0070DC",
                      },
                    }}
                    onClick={handleWalmartMarkeSellertClick}
                  >
                    Sign Up
                  </Button>
                </Grid>
              )}
              <div className="arrows-div">
                <svg
                  className="arrows"
                  onClick={() =>
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    })
                  }
                >
                  <path className="a1" d="M0 0 L30 32 L60 0"></path>
                  <path className="a2" d="M0 20 L30 52 L60 20"></path>
                  <path className="a3" d="M0 40 L30 72 L60 40"></path>
                </svg>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} className="login-right">
              <Grid
                item
                xs={10}
                mt={4}
                className={`form_login ${
                  props?.query?.realm == "walmart" ? "walmart-active" : ""
                }`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  textAlign: "center",
                  backgroundColor: "white",
                  flexWrap: "nowrap",
                  position: "relative",
                  right:
                    props?.query?.realm == "walmart" && !isSmallScreen
                      ? "70px"
                      : "auto",
                }}
              >
                <Grid
                  item
                  sx={{
                    paddingTop:
                      props?.query?.realm == "walmart" ? "15px" : "20px",
                  }}
                >
                  {props?.query?.realm == "walmart" ? (
                    // <Image
                    //   src="/walmart/contenthubgpt_gspann_walmart_logo.png"
                    //   width={380}
                    //   height={50}
                    //   className="chgpt-walmart"
                    //   alt="logo"
                    // />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        ml: 1,
                      }}
                    >
                      <Image
                        src="/contenthub-gpt-logo1.png"
                        width={logo1Width}
                        height={logo1Height}
                        fetchpriority="high"
                        alt="ContentHubGPT Logo"
                      />
                      <Typography
                        sx={{
                          color: "#000",
                          fontSize: "40px",
                          fontWeight: 300,
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        |
                      </Typography>
                      <Image
                        src="/walmart/walmart-marketplace-logo.png"
                        width={logo2Width}
                        height={logo2Height}
                        fetchpriority="high"
                        alt="Walmart Marketplace Logo"
                      />
                    </Box>
                  ) : (
                    <Image
                      src="/contenthub-gpt-logo1.png"
                      width={256}
                      height={50}
                      alt="logo"
                    />
                  )}
                </Grid>
                <Grid item>
                  {!showOtpForm ? (
                    <Box
                      component="form"
                      sx={{ width: "100%" }}
                      noValidate
                      autoComplete="off"
                    >
                      <Grid
                        container
                        item
                        xs={10}
                        md={9}
                        sx={{
                          margin: { xs: "8px auto", xl: "22px auto" },
                          position: "relative",
                        }}
                      >
                        <TextField
                          label="Email"
                          fullWidth
                          className="otpinput"
                          disabled={getEmail ? true : false}
                          error={!email ? formError : emailError ? true : false}
                          helperText={emailHelperText}
                          value={email ? email : ""}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailHelperText("");
                            setEmailError("");
                            setFormError(false);
                          }}
                          InputProps={{
                            endAdornment: <Spinner show={spinner} />,
                          }}
                          onKeyDown={handleEnterOnEmail}
                        />
                        <Button
                          size="medium"
                          disabled={!isChecked}
                          onClick={handleEmailSubmit}
                          sx={{
                            backgroundColor: "#FB9005",
                            color: "#ffffff",
                            marginTop: "10px",
                            padding: "10px",
                            width: "100%",
                            borderRadius: "8px",
                            height: "40px",
                            "&:hover": { backgroundColor: "#f6aa46" },
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Box>
                  ) : (
                    <Box
                      component="form"
                      sx={{ width: "100%" }}
                      noValidate
                      autoComplete="off"
                    >
                      <Grid item xs={12}>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            marginBottom: "8px",
                            color: "grey",
                          }}
                        >
                          A Secure Code was sent to you at{" "}
                          <strong>{email}</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={8} md={10} sx={{ margin: "0 auto" }}>
                        <TextField
                          label="Secure Code"
                          fullWidth
                          error={otp ? false : formError}
                          helperText={
                            otp ? "" : formError ? "This field is required" : ""
                          }
                          value={otp ? otp : ""}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          inputProps={{ maxLength: 6 }}
                          InputProps={{
                            endAdornment: <Spinner show={spinner} />,
                          }}
                          onKeyDown={handleEnterOnLogin}
                        />
                        {!successMessage && (
                          <Box
                            sx={{ display: "flex", justifyContent: "start" }}
                          >
                            <Button
                              variant="text"
                              size="small"
                              disabled={spinner || resendTimer > 0}
                              onClick={handleResendOtp}
                              sx={{
                                textTransform: "none",
                                color: "#174060",
                                "&:hover": {
                                  backgroundColor: "transparent",
                                  color: "#163058",
                                },
                              }}
                            >
                              {resendTimer > 0
                                ? `Resend OTP in ${resendTimer}s`
                                : "Resend OTP"}
                            </Button>
                          </Box>
                        )}
                        {errorMessage ? (
                          <Alert
                            severity="error"
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            {errorMessage}
                          </Alert>
                        ) : successMessage ? (
                          <Alert
                            severity="success"
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            {successMessage}
                          </Alert>
                        ) : (
                          ""
                        )}
                        <Button
                          size="medium"
                          onClick={handleOtpSubmit}
                          disabled={!isChecked}
                          sx={{
                            backgroundColor: "#FB9005",
                            color: "#ffffff",
                            marginTop: "10px",
                            padding: "10px",
                            width: "100%",

                            borderRadius: "8px",
                            "&:hover": { backgroundColor: "#f6aa46" },
                          }}
                        >
                          Login
                        </Button>
                      </Grid>
                    </Box>
                  )}
                </Grid>
                <Grid
                  item
                  xs={10}
                  md={8}
                  sx={{ margin: "0 auto", width: "100%" }}
                >
                  <hr className="hr-text gradient" data-content="OR" />
                </Grid>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Grid item xs={10} md={9} className="buttons">
                    {/* <Button
                      size="medium"
                      variant="text"
                      disabled={!isChecked}
                      startIcon={
                        <SvgIcon className="button-ic">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 326667 333333"
                            shapeRendering="geometricPrecision"
                            textRendering="geometricPrecision"
                            imageRendering="optimizeQuality"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          >
                            <path
                              d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z"
                              fill="#4285f4"
                            />
                            <path
                              d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z"
                              fill="#34a853"
                            />
                            <path
                              d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z"
                              fill="#fbbc04"
                            />
                            <path
                              d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z"
                              fill="#ea4335"
                            />
                          </svg>
                        </SvgIcon>
                      }
                      className="button"
                      onClick={() => {
                        if (Object.keys(router.query).length !== 0 && router.query.callbackUrl !== undefined) {
                          signIn("google", { callbackUrl: router?.query?.callbackUrl });
                          cookie.set("callbackUrl", router?.query?.callbackUrl);
                        } else {
                          signIn("google");
                        }
                      }}
                    >
                      <Typography className="btn-text">Continue with Google</Typography>
                    </Button> */}
                    <Button
                      variant="text"
                      disabled={!isChecked}
                      startIcon={
                        <SvgIcon className="button-ic-linkedin">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            style={{ height: "25px", width: "25px" }}
                          >
                            <path
                              fill="#0288D1"
                              d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                            />
                            <path
                              fill="#FFF"
                              d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                            />
                          </svg>
                        </SvgIcon>
                      }
                      className="button linkedin"
                      onClick={() => {
                        if (
                          Object.keys(router.query).length !== 0 &&
                          router.query.callbackUrl !== undefined
                        ) {
                          signIn("linkedin", {
                            callbackUrl: router?.query?.callbackUrl,
                          });
                          cookie.set("callbackUrl", router?.query?.callbackUrl);
                        } else {
                          signIn("linkedin");
                        }
                      }}
                    >
                      <Typography className="btn-text">
                        Continue with LinkedIn
                      </Typography>
                    </Button>
                  </Grid>
                </div>
                <Grid item xs={12} md={12} sx={{ margin: "5px auto 5px auto" }}>
                  <FormGroup
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FormControlLabel
                      checked={isChecked}
                      control={<Checkbox />}
                      label={
                        <Typography sx={{ fontSize: "14px" }}>
                          I accept the
                        </Typography>
                      }
                      onChange={handleCheckboxChange}
                      sx={{ marginRight: "5px", fontSize: "14px !important" }}
                    />
                    <Link
                      href={process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL}
                      target="_blank"
                      style={{ color: "#fb9005", textDecoration: "none" }}
                    >
                      <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
                        Terms and Conditions
                      </Typography>
                    </Link>
                  </FormGroup>
                </Grid>
                <Grid
                  item
                  xs={10}
                  md={8}
                  className={`need-help ${
                    errorMessage || successMessage ? "adjust" : ""
                  }`}
                  sx={{
                    display:
                      props?.query?.realm === "walmart" ? "block" : "none",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "white" }}>
                    Need help?{" "}
                    <Link
                      href="https://www.gspann.com/contact-us/"
                      target="_blank"
                      style={{
                        color: "#fb9005",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Contact Us
                    </Link>
                  </Typography>
                </Grid>
                {props?.query?.realm === "walmart" ? (
                  <Grid item xs={12} sx={{ padding: "10px 0" }}>
                    <Link
                      href="/login?old=true"
                      onClick={() =>
                        router.push({
                          pathname: "/login",
                          query: { old: "true" },
                        })
                      }
                      style={{
                        color: "#fb9005",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Back to Sign In
                    </Link>
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    sx={{
                      backgroundColor: "#0071dc",
                      margin: "0 auto",
                      width: "100%",
                      borderBottomRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      position: "relative",
                    }}
                  >
                    <Image
                      src="/walmart/walmart_marketplace_logo.png"
                      width={225}
                      height={25}
                      style={{ paddingTop: 16 }}
                      alt="walmart_logo"
                    />
                    <Typography sx={{ color: "white", fontSize: "12px" }}>
                      For Walmart Marketplace Seller
                    </Typography>
                    <Link
                      href="/login?realm=walmart&old=true"
                      onClick={() =>
                        router.replace({
                          pathname: "/login",
                          query: { realm: "walmart", old: "true" },
                        })
                      }
                      style={{
                        color: "#ffc120",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingBottom: 16,
                        fontSize: 16,
                        textDecoration: "none",
                      }}
                    >
                      Login here <ArrowRightAltIcon />
                    </Link>
                    <Grid
                      item
                      xs={10}
                      md={8}
                      className={`need-help ${
                        errorMessage || successMessage ? "adjust" : ""
                      }`}
                    >
                      <Typography variant="body2" sx={{ color: "white" }}>
                        Need help?{" "}
                        <Link
                          target="_blank"
                          href="https://www.gspann.com/contact-us/"
                          style={{
                            color: "#fb9005",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          Contact Us
                        </Link>
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          <SnackbarNotifier
            open={snackbarState.open}
            onClose={() => setSnackbarState({ ...snackbarState, open: false })}
            message={snackbarState.message}
            severity={snackbarState.severity}
          />
        </Grid>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const randomNum = Math.floor(Math.random() * 10) + 1;
  const isWalmart = context.query.realm === "walmart";
  const forceOldPage = context.query.old === "true";
  const forceNewPage = context.query.new === "true";

  // Prioritize forceNewPage and forceOldPage over other conditions
  const showNewPage = forceOldPage
    ? false
    : forceNewPage
    ? true
    : isWalmart
    ? true
    : randomNum > 5;

  if (!session) {
    return {
      props: {
        query: context.query,
        showNewPage: showNewPage,
      },
    };
  } else {
    let realm;
    await axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + "/auth/user/profile", {
        headers: { Authorization: session.user.id_token },
      })
      .then((res) => {
        realm = res?.data?.realm;
        if (realm === "walmart") {
          setCookie("realm", "walmart", context);
        }
      })
      .catch((err) => {
        signOut();
      });
    return {
      props: { ...session, showNewPage: showNewPage },
      redirect: {
        destination:
          (realm && realm === "walmart") || context.query.realm === "walmart"
            ? "/walmart/dashboard"
            : "/dashboard/home",
      },
    };
  }
}
