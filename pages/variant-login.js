import {
  Box,
  Grid,
  Typography,
  Button,
  Icon,
  SvgIcon,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { signOut, useSession, getSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import "dotenv";
import Link from "next/link";
import cookie from "js-cookie";
import { getCookie, setCookie } from "cookies-next";
import Spinner from "../components/spinner/Spinner";
import { useSearchParams } from "next/navigation";
import { useFilename } from "../context/filename";
import { useToast } from "../context/ToastContext";
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTheme } from '@mui/material/styles';

import { contentHubDescription, contentHubDescriptionMobile } from "../constants/texts";
import { useResponsiveBreakpoints } from "../utils-ui/useResponsiveBreakpoints";
import { responsiveSizes } from "../constants/responsiveConstants";

export default function LoginPage(props) {
  const { showToast } = useToast();
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  let getEmail = searchParams.get("email");
  const [email, setEmail] = useState(getEmail || "");
  const [emailLowerCase, setEmailLowerCase] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [otp, setOtp] = useState("");
  const [formError, setFormError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [otpSent, setOtpSent] = useState("");
  const[otpSentSuccess,setOptSentSuccess] = useState(false);
  const [isActionDisabled, setIsActionDisabled] = useState(false); // Disable actions temporarily
  const { isMobile, isTablet, isZoomed,isNormalZoom } = useResponsiveBreakpoints();
  const {
    logo1Width, logo1Height, logo2Width, logo2Height,
    logo3Width, logo3Height, logo4Width, logo4Height,
    imageWidth, imageHeight, bitmapWidth,
  } = useMemo(
    () => responsiveSizes({ isMobile, isTablet, isZoomed }),
    [isMobile, isTablet, isZoomed]
  );

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));

  const descriptionLines = isXs
    ? contentHubDescriptionMobile.split('/e')
    : contentHubDescription.split('\n');
  useEffect(() => {
    setEmail(getEmail || "");
    setEmailLowerCase("");
    setEmailError("");
    setEmailHelperText("");
    setOtp("");
    setFormError(false);
    setSuccessMessage("");
    setErrorMessage("");
    setShowOtpForm(false);
    setSpinner(false);
    setResendTimer(30);
    setOtpSent("");
    setIsActionDisabled(false);
  }, [router.query, getEmail]);

  useEffect(() => {
    let timer;
    if (showOtpForm && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showOtpForm, resendTimer]);

  const { setIsFilenameExists } = useFilename();
  useEffect(() => {
    if (router.query.callbackUrl && router.query.callbackUrl.includes("filename")) {
      setIsFilenameExists(true);
    }
  }, [router.query, setIsFilenameExists]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const mainLogin = document.getElementsByClassName("main-login")[0];
      if (mainLogin) {
        mainLogin.style.maxWidth = "none";
        mainLogin.style.paddingLeft = "0px";
        mainLogin.style.paddingRight = "0px";
        mainLogin.style.marginBottom = "0px";
      }
      if (props?.query?.realm === "walmart") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (process.env.NODE_ENV === "development") {
        console.log("Query Parameters:", props.query);
      }
    }
  }, [props?.query?.realm]);

  useEffect(() => {
    const rememberMeCookie = cookie.get("rememberMe");
    if (rememberMeCookie) setIsChecked(!rememberMeCookie.match(/^(not-accepted)/));
    if (props.query?.realm === "walmart") cookie.set("realm", "walmart");
    else cookie.remove("realm");
    cookie.remove("callbackUrl");
  }, [props.query?.realm]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "New_page_view", {
        page_title: "Login",
        page_location: window.location.href,
        page_path: "/login",
        event_label: "New Login Page",
      });
    }
  }, []);

  useEffect(() => {
    if (cookie.get("login-msg")) {
      setTimeout(() => {
        
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
  const handleWalmartMarkeSellertClick = () => {
    window.location.href = "https://seller.walmart.com/signup?q=&origin=solution_provider&src=0018Y000032uulT";
  };

  const handleCheckboxChange = (event) => {
    const { checked } = event.target;
    setIsChecked(checked);
    const currentTime = new Date();
    const utcString = currentTime.toISOString();
    cookie.set("rememberMe", checked ? "accepted " + utcString : "not-accepted " + utcString);
  };

  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  const handleEnterOnEmail = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (e.target.value.length !== 0) {
        if (isChecked) handleEmailSubmit();
        else {
          setEmailError("Please accept the terms and conditions.");
        }
      }
    }
  };

  const handleEnterOnLogin = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (e.target.value.length !== 0) handleOtpSubmit();
    }
  };

  const handleEmailSubmit = async (e) => {
    if (isActionDisabled) return; // Prevent action if disabled
    setSpinner(true);
    setErrorMessage("");
    setSuccessMessage("");
    setOtpSent("");
    setIsActionDisabled(true); // Disable actions
    if (!email || emailError) setEmailHelperText(emailError || "");
    if (email.trim() === "") {
      setFormError(true);
      setSpinner(false);
      setEmailError("Please enter a valid email address.");
      setIsActionDisabled(false); // Re-enable actions
      return;
    } else {
      setEmailLowerCase(email.toLocaleLowerCase());
      await axios
        .post(process.env.NEXT_PUBLIC_BASE_URL + `/auth/email/otp`, {
          email: email.toLowerCase(),
          variant_page: true,
          sign_up: !!props?.query?.signup,
        })
        .then((res) => {
          if (res.data.status === "success") {
            setSpinner(false);
            setShowOtpForm(true); // Immediately show OTP form
            setOtpSent("OTP sent successfully to email");
            setOptSentSuccess(true);
            setTimeout(() => {
            setOtpSent("");
              setResendTimer(30);
              setIsActionDisabled(false); // Re-enable actions after delay
            }, 2000); // Display OTP sent message for 2 seconds
          }
        })
        .catch((err) => {
          setSpinner(false);
          setIsActionDisabled(false); // Re-enable actions
          const errorMsg = err?.response?.data?.message || "Failed to send OTP.";
          setEmailError(errorMsg);
          setCookie("login-msg", errorMsg);
        });
    }
  };

  const handleOtpSubmit = async (e) => {
    if (isActionDisabled) return; // Prevent action if disabled
    setSpinner(true);
    setErrorMessage("");
    setSuccessMessage("");
    setOtpSent("");
    setEmailError("");
    setIsActionDisabled(true); // Disable actions
    if (otp.trim() === "") {
      setFormError(true);
      setSpinner(false);
      setErrorMessage("Please enter a secure code");
      setTimeout(() => {
        setIsActionDisabled(false); // Re-enable actions after delay
      }, 2000);
      return;
    } else {
      const result = await signIn("otp", { email: emailLowerCase, otp, redirect: false });
      if (result.error === "Invalid OTP") {
        setSpinner(false);
        setOtp("");
        setErrorMessage("Invalid secure code");
        setTimeout(() => {
          setIsActionDisabled(false); // Re-enable actions after delay
        }, 2000);
      } else if (result.error === "OTP has expired. Please request a new one.") {
        setSpinner(false);
        setOtp("");
        setErrorMessage("Expired secure code");
        setTimeout(() => {
          setIsActionDisabled(false); // Re-enable actions after delay
        }, 2000);
      } else if (result.ok) {
        setSpinner(false);
        setSuccessMessage("Success");
        if (typeof window !== "undefined" && window.gtag && props?.query?.signup) {
          window.gtag("event", "New_Page_SignUp", {
            event_category: "Authentication",
            event_label: "New Login Page",
          });
        }
        setTimeout(() => {
          getSession().then((userSession) => {
            if (userSession?.user?.realm === "walmart" || props.query.realm === "walmart") {
              router.push({ pathname: "/walmart/dashboard" });
            } else {
              if (Object.keys(router.query).length !== 0 && router.query.callbackUrl !== undefined) {
                router.push(router.query.callbackUrl);
                cookie.set("callbackUrl", router.query.callbackUrl);
              } else {
                router.push({ pathname: "/dashboard/home" });
              }
            }
          });
          setIsActionDisabled(false); // Re-enable actions after delay
        }, 2000); // Delay redirection by 2 seconds
      } else {
        setSpinner(false);
        setErrorMessage("An error occurred during login");
        setTimeout(() => {
          setIsActionDisabled(false); // Re-enable actions after delay
        }, 2000);
      }
    }
  };

  const handleResendOtp = async () => {
    if (isActionDisabled) return; // Prevent action if disabled
    setSpinner(true);
    setOtp("");
    setErrorMessage("");
    setSuccessMessage("");
    setOtpSent("");
    setEmailError("");
    setIsActionDisabled(true);
    await axios
      .post(process.env.NEXT_PUBLIC_BASE_URL + `/auth/email/otp`, {
        email: email.toLowerCase(),
        variant_page: true,
        sign_up: !!props?.query?.signup,
      })
      .then((res) => {
        if (res.data.status === "success") {
          setSpinner(false);
          setOtpSent("OTP sent successfully to email");
          setTimeout(() => {
            setOtpSent(""); // Clear OTP sent message after 2 seconds
            setResendTimer(30);
            setIsActionDisabled(false); // Re-enable actions after delay
          }, 2000); // Display OTP sent message for 2 seconds
        }
      })
      .catch((err) => {
        setSpinner(false);
        setShowOtpForm(false); // Show email form for error
        setIsActionDisabled(false); // Re-enable actions
        const errorMsg = err?.response?.data?.message || "Failed to resend OTP.";
        setEmailError(errorMsg);
        showToast(errorMsg, "error");
      });
  };

  const arrayOfButtons = [
    <div className="nav-indicators"><p>Content Generation</p></div>,
    <div className="nav-indicators"><p>SEO</p></div>,
    <div className="nav-indicators"><p>Taxonomy</p></div>,
  ];

  return (
    <Box
      sx={{
        width: "100vw",
        height: { xs: "auto", md: "100dvh" },
        minHeight: { xs: "100vh", md: "none" },
        overflow:"hidden",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Grid
        container
        sx={{
          height: { xs: "auto", md: "100%" },
          boxSizing: "border-box",
          flexWrap: { xs: "wrap", md: "nowrap" },
          overflow:"hidden"
        }}
      >
        <Grid
          item
          sx={{
            width: { xs: "100%", md: "45%" },
            // height: { xs: "auto", md: "100vh" },
            height: props?.query?.signup
            ? { xs: "auto", md: "100vh" }
            : { xs: "auto", md: "100vh" },
            backgroundColor: "white",
            
            overflowY: { xs: "auto", md: "hidden" },
            order: { xs: 1, md: 1 },
            minHeight: { xs: "auto", sm: "auto" },display: "flex",
            
            
            flexDirection: "column",justifyContent: "space-between",position: "relative",
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "100%" },maxWidth: { xs: "90%", md: "100%" },
              padding: { xs: 2, md: 0 },flexGrow: 1,
              display: "flex",flexDirection: "column",
              justifyContent: "flex-start",
              overflow:"hidden"
            }}
          >
            <Box
              sx={{ width: { xs: "100%", md: "80%" }, marginLeft: "auto", marginRight: "auto", pt: { xs: 2, md: 2 }, pb: { xs: 2, md: 0 } }}
            >
              <Grid sx={{ height: { xs: "auto", md: "auto" } }}>
                {props?.query?.realm === "walmart" ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },  // Ensures left-alignment on xs and center alignment on sm+
                      gap: { xs: 1.5, sm: 3 },
                      mt: 2,
                      ml: 3,
                      mb: 4,
                    }}
                  >
                  
                  <Image
                    src="/contenthub-gpt-logo1.png"
                    width={logo1Width}
                    height={logo1Height}
                    fetchPriority="high"
                    alt="ContentHubGPT Logo"
                  />
                
                  {/* Divider – Only shown on larger screens */}
                  <Box
                    sx={{
                      width: "1px",
                      height: "48px",
                      backgroundColor: "#000",
                      display: { xs: "none", sm: "block" },
                    }}
                  />
                
                  {/* Walmart Logo – Always visible, but on bottom in mobile */}
                  <Image
                    src="/walmart/walmart-marketplace-logo.png"
                    width={logo2Width}
                    height={logo2Height}
                    fetchPriority="high"
                    alt="Walmart Marketplace Logo"
                    sx={{ mt: { xs: 3, sm: 0 } }}
                  />
                </Box>
                
                ) : (
                  <Box
                   sx={{ width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", mb: 1, px: { xs: 2, md: 3 },pb:1.2 }}
                  >
                    <Image
                      src="/contenthub-gpt-logo1.png"
                      alt="logo"
                      height={logo3Height}
                      width={logo3Width}
                      style={{
                        objectFit: "contain",
                        objectPosition: "left",
                      }}
                    />
                  </Box>
                )}
                <Typography
                  variant="h4"
                  sx={{
                    height: { xs: "auto", md: "32px" },
                    fontWeight: 700,
                    color: "#0F0049",
                    fontSize: {
                      xs: "48px",
                      sm: "22.4px",
                      md: isZoomed?"30px":isNormalZoom?"38px":"38px",
                    },
                    marginBottom: isZoomed?"12px":isNormalZoom?"40px":"30px",
                    px: { xs: 2, md: 4 },
                  }}
                >
                  {props?.query?.realm === "walmart"
                    ? "Sign in to your account"
                    : props?.query?.signup
                    ? "Sign up"
                    : "Sign in to your account"}
                </Typography>

                {props?.query?.realm === "walmart" && !showOtpForm && (
                  <Typography
                    component="p"
                    sx={{
                      fontSize: { xs: "18px", sm: "10.4px", md: isZoomed?"13px":"18px" },
                      color: "#67728A",fontWeight:300,
                      mb: 0.5,
                      mt: 1,
                      textAlign: "start",
                      whiteSpace: "nowrap",
                      px: { xs: 2, md: 4 },
                    }}
                  >
                    Want to become a Walmart Marketplace
                    <Box component="br" sx={{ display: { xs: "inline", sm: "none" } }} />
                    {" "}seller?
                    <Box
                      component="span"
                      onClick={handleWalmartMarkeSellertClick}
                      sx={{ color: "#0070DC", cursor: "pointer", fontWeight: 300, display: "inline" }}
                    >
                      {" "}Sign up now
                    </Box>
                  </Typography>
                )}
                {!showOtpForm && !props?.query?.signup && !props?.query?.realm && (
                  <Typography
                    sx={{
                      marginTop: { xs: 0.5, md: "13px" },
                      marginBottom: isNormalZoom?"20px":"5px",
                      fontWeight: 300,
                      color: "#718096",
                      fontSize: { xs: "18px", sm: "10.4px", md: "18px" },
                      px: { xs: 2, md: 4 },
                      '@media (min-width: 1200px) and (max-width: 1400px)': {
                      fontSize: '14px',
                      marginBottom:"8px"
                    },
                    }}
                  >
                    Don’t have an account?{" "}
                    <Box
                      component="span"
                      onClick={() =>
                        router.push({
                          pathname: "/login",
                          query: { signup: "true", new: "true" },
                        })
                      }
                      sx={{ color: "#0651DD", fontWeight: 300, cursor: "pointer" }}
                    >
                      Sign up now
                    </Box>
                  </Typography>
                )}
                {!showOtpForm && props?.query?.signup && (
                  <Typography
                    sx={{
                      fontWeight: 300,
                      color: "#718096",
                      fontSize: "18px",
                      px: { xs: 2, md: 4 },
                      mt: { xs: 0.5, md: "6.4px" },
                      mb: 2, 
                    }}
                  >
                    Already have an account?{" "}
                    <span
                      onClick={() =>
                        router.push({
                          pathname: "/login",
                          query: { new: "true" },
                        })
                      }
                      style={{
                        color: "#0651DD",
                        fontWeight: 300,
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      Sign in now
                    </span>
                  </Typography>
                
                )}
              </Grid>
              <Grid sx={{ marginTop: { xs: 1, md: isZoomed?"4px":"6.4px" }, px: { xs: 2, md: 4 } }}>
                {!showOtpForm ? (
                  <Box component="form" noValidate autoComplete="off">
                    <Typography
                      sx={{ color: "#67728A", fontSize: {xs:"16px",md:isZoomed?"11px":"12.8px"}, mb: 1,fontWeight:500 }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      placeholder="name@company.com"
                      fullWidth
                      disabled={getEmail || isActionDisabled}
                      error={!email ? formError : !!emailError}
                      value={email || ""}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailHelperText("");
                        setEmailError("");
                        setFormError(false);
                      }}
                      InputProps={{ endAdornment: <Spinner show={spinner} /> }}
                      onKeyDown={handleEnterOnEmail}
                      sx={{
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "3.2px",
                          "& fieldset": { borderColor: "#CBD5E0" },
                          "&:hover fieldset": { borderColor: "#67728A" },
                          "& input": {
                            padding: isZoomed ? "7px 5.6px" : "10.4px 5.6px",
                          },
                        },
                      }}
                    />
                    <Box sx={{ marginTop: { xs: 0.5, md: isZoomed?"2.5px":"3.2px" } }}>
                    <FormGroup>
                      <FormControlLabel
                        checked={isChecked}
                        control={<Checkbox sx={{ color: "#67728A", "&.Mui-checked": { color: "#1976d2" }, mr: 0, p: 0 ,transform: isZoomed ? "scale(0.75)" : "scale(1)"}} />}
                        onChange={handleCheckboxChange}
                        sx={{ m: 0, mr: 1 }}
                        label={
                          <Typography sx={{ fontSize: {xs:otpSentSuccess?"14px":"14px",md:isZoomed?"12px":"16px"}, color: "#0F0049", ml: 1 ,fontWeight:300}}>
                            I accept the{" "}
                            <Link href={process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL} target="_blank" style={{ fontWeight: 300, color: "#0F0049" }}>
                              Terms and Conditions
                            </Link>
                          </Typography>
                        }
                      />
                    </FormGroup>

                      {emailError && (
                        <Box
                         sx={{ mt: isZoomed?0.2:0.3, p: 0.35, display: "flex", alignItems: "center",fontWeight:300, border: "1px solid #E53E3E", borderRadius: isZoomed?"1px":"2px", backgroundColor: "#FFFFFF", color: "#C53030",
                           fontSize:{xs:"16px",sm:isZoomed?"10px":"14px"} }}

                        >
                          <ErrorIcon sx={{ color: "#E53E3E", mr: 1,"14px" : "20px" }} />
                          {emailError}
                        </Box>
                      )}
                      <Button
                        fullWidth
                        size="medium"
                        disabled={!isChecked || !email || isActionDisabled}
                        onClick={handleEmailSubmit}
                        sx={{
                          backgroundColor: isChecked && email && !isActionDisabled ? "#1976d2" : "#9DBEFC",
                          marginTop: { xs: "30px", md: isZoomed ? "13px" : isNormalZoom ? "25px" : "18px" },
                          color: "#fff",py: { xs: 3, sm: 1 },fontWeight:600,

                          borderRadius: "50px",textTransform: "none",
                          height: isZoomed?"36px":"48px",fontSize: {xs:"20px",md:isZoomed? "16px":"20px"},
                          fontWeight: 600,
                          "&:hover": { backgroundColor: "#1976d2" },
                          "&:disabled": {
                            backgroundColor: "#9DBEFC", color: "#fff",opacity: 0.6,
                          },

                        }}
                      >
                        {props?.query?.signup ? "Sign Up" : "Get Secure Code"}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box component="form" noValidate autoComplete="off">
                    <Box sx={{  }}>
                      <Typography
                        sx={{ fontSize: { xs: otpSentSuccess?"14px":"12px", md: "14px" }, color: "#67728A", mb: 0.5,fontWeight:300 }}
                      >
                        A Secure Code was sent to you at <strong>{email}</strong>
                      </Typography>
                    </Box>
                    <TextField
                      fullWidth
                      error={!otp && formError}
                      helperText={otp ? "" : formError ? "This field is required" : ""}
                      value={otp || ""}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      inputProps={{ maxLength: 6 }}
                      InputProps={{ endAdornment: <Spinner show={spinner} /> }}
                      onKeyDown={handleEnterOnLogin}
                      sx={{
                        mb: 0,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "6.4px",
                          "& fieldset": { borderColor: "#CBD5E0" },
                          "&:hover fieldset": { borderColor: "#67728A" },
                          "& input": {
                            padding: "8px 4px",
                          },
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                    <FormGroup>
                      <FormControlLabel
                        checked={isChecked}
                        control={<Checkbox sx={{ color: "#67728A", "&.Mui-checked": { color: "#1976d2" }, mr: 0, p: 0 }} />}
                        onChange={handleCheckboxChange}
                        sx={{ m: 0, mr: 1 }}
                        label={
                          <Typography sx={{ fontWeight:300,fontSize: otpSentSuccess
                            ? { xs: "14px", md: isZoomed ? "12px" : "16px" }
                            : { xs: "16px", md: isZoomed ? "12px" : "16px" }, color: "#0F0049", ml: 1, whiteSpace: "nowrap" }}>
                            I accept the{" "}
                            <Link href={process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL} target="_blank" style={{ fontWeight: 300, color: "#0F0049" }}>
                              Terms and Conditions
                            </Link>
                          </Typography>
                        }
                      />
                    </FormGroup>
                      <Button
                        variant="text"
                        size="small"
                        disabled={spinner || resendTimer > 0 || isActionDisabled}
                        onClick={handleResendOtp}
                        sx={{
                          textTransform: "none",
                          color: "#0651DD",fontWeight:300,
                          fontSize: { xs: otpSentSuccess?"14px":"12px", md: isZoomed?"10px":"16px" }, 
                          "&:hover": {
                            backgroundColor: "transparent",
                            color: "#0651DD",
                          },
                        }}
                      >
                        {resendTimer > 0
                          ? `Resend OTP in ${resendTimer}s`
                          : "Resend OTP"}
                      </Button>
                    </Box>
                    {(errorMessage || successMessage || otpSent) && (
                      <Box
                      sx={{
                        mt: 1, p: 0.35, display: "flex", alignItems: "center",mb:1,
                        border: errorMessage ? "1px solid #E25C72" : "1px solid #54B054",
                        borderRadius: "2px", backgroundColor: "#FFFFFF",fontWeight:300,
                        color: errorMessage ? "#C53030" : "#2F855A",fontSize:{xs:"16px",sm:isZoomed?"10px":"14px"}
                      }}                      
                      >
                        {errorMessage ? (
                          <ErrorIcon sx={{ color: "#E53E3E", mr: 1 }} />
                        ) : (
                          <CheckCircleIcon sx={{ color: "#38A169", mr: 1 }} />
                        )}
                        {errorMessage || successMessage || otpSent}
                      </Box>
                    )}
                    <Button
                      fullWidth
                      size="medium"
                      onClick={handleOtpSubmit}
                      disabled={!isChecked || isActionDisabled}
                      sx={{
                        backgroundColor: "#1976d2", marginTop: { xs: 0.5, md: "16px" },
                        backgroundColor: "#1976d2", marginTop: { xs: 0.5, md: "16px" },
                        color: "#fff", py: 1, borderRadius: "50px", textTransform: "none",fontWeight:600,
                        fontSize: {
                          xs: "20px",
                          sm: isZoomed ? "14px" : "20px",
                        }, fontWeight: 600,
                        "&:hover": { backgroundColor: "#1565c0" },
                        "&:disabled": { backgroundColor: "#9DBEFC", color: "#fff", opacity: 0.6 },
                      }}                      
                    >
                      {props?.query?.signup ? "Submit" : "Log in"}
                    </Button>
                  </Box>
                )}
                {!props?.query?.signup && (
                  <Grid item xs={12} sx={{ mt: { xs: 1, md: isNormalZoom?1:0.5 }, px: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", my: isNormalZoom?1:0.5 }}>
                      <Box sx={{ flex: 1, height: "1px", backgroundColor: "#CBD5E0" }} />
                      <Typography sx={{ mx: 1, my: 2, color: "#67728A", fontSize: {xs:"12px",md:isZoomed?"10px":"12px"}, fontWeight: 300 }}>OR</Typography>
                      <Box sx={{ flex: 1, height: "1px", backgroundColor: "#CBD5E0" }} />
                    </Box>

                    <Box sx={isNormalZoom ? { display: "flex", flexDirection: "column", gap: "10px" } : {}}>
                      {/* <Button
                        fullWidth
                        variant="outlined"
                        disabled={!isChecked || isActionDisabled}
                        startIcon={
                          <SvgIcon sx={{ mr: 1 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 326667 333333" fillRule="evenodd" clipRule="evenodd">
                              <path d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593z" fill="#4285f4" />
                              <path d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z" fill="#34a853" />
                              <path d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851z" fill="#fbbc04" />
                              <path d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260z" fill="#ea4335" />
                            </svg>
                          </SvgIcon>
                        }
                        onClick={() => {
                          if (
                            Object.keys(router.query).length !== 0 &&
                            router.query.callbackUrl !== undefined
                          ) {
                            signIn("google", {
                              callbackUrl: router?.query?.callbackUrl,
                            });
                            cookie.set("callbackUrl", router?.query?.callbackUrl);
                          } else {
                            signIn("google");
                          }
                        }}
                        sx={{ mb: { xs: 3, sm: 1, md: 2 }, py: { xs: 1.5, sm: isZoomed ? 0.7 : 1.2 }, px: { xs: 1.5, sm: isZoomed ? 1.1 : 1.5 }, borderRadius: "50px", textTransform: "none", 
                        color: "#67728A", borderColor: "#CBD5E0", fontSize: isZoomed?"15px":"18px", fontWeight: 500, position: "relative", justifyContent: "center", pl: 6, 
                        "& .MuiButton-startIcon": { position: "absolute", left: 16, marginRight: 0 },
                        "&:hover": { borderColor: "#448aff", color: "#67728A" }}}
                      >
                        Continue with Google
                      </Button> */}
                      <Button
                        fullWidth
                        variant="outlined"
                        disabled={!isChecked || isActionDisabled}
                        startIcon={
                          <SvgIcon sx={{ mr: 1, width: 28, height: 28 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                              <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z" />
                              <path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z" />
                            </svg>
                          </SvgIcon>
                        }
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
                        sx={{
                          py: { xs: 1.5, sm: isZoomed ? 0.7 : 1.2 }, px: { xs: 1.5, sm: isZoomed ? 1.1 : 1.5 }, borderRadius: "50px", textTransform: "none", color: "#67728A", 
                          borderColor: "#CBD5E0", fontSize: isZoomed?"15px":"18px", fontWeight: 500, position: "relative", justifyContent: "center", pl: 6,
                          "& .MuiButton-startIcon": { position: "absolute", left: 16, marginRight: 0 },
                          "&:hover": { borderColor: "#448aff", color: "#67728A" }
                        }}                        
                      >
                        Continue with LinkedIn
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
          {props?.query?.realm !== "walmart" && !props?.query?.signup && (
            <Grid
              item
              xs={12}
              sx={{
                backgroundColor: "#E4EDF6", width: "100%", textAlign: "center", maxHeight: isZoomed?"21%":"20%", py: isZoomed?1:1.5, px: 0, mt: 0, pb: { xs: 2, md: 1.5 },
                zIndex: 1
              }}              
            >
              <Box sx={{
                  maxWidth: { xs: "100%", md: "80%" },
                  mx: "auto",
                  mt: { xs: 2, md: 0 }, // Apply margin-top only on xs
                  mb: { xs: 2, md: 0 },// Apply margin-bottom only on xs
                  px: { xs: 2, md: 4 }
                }}
              >
                <Image
                  src="/walmart/walmart-marketplace-logo.png"
                  width={logo4Width}
                  height={logo4Height}
                  fetchPriority="high"
                  alt="Walmart Marketplace Logo"
                />
                <Typography
                  sx={{ mb: 1, fontSize: { xs: "18px", sm: "10.4px", md: "18px",...(isZoomed && { md: "14px" }) }, color: "#0F0049" ,fontWeight:300}}
                >
                  Are you a Walmart Marketplace seller?
                </Typography>
                <Link
                  href="/login?realm=walmart&new=true"
                  onClick={() =>
                    router.push({
                      pathname: "/login",
                      query: { realm: "walmart", new: "true" },
                    })
                  }
                  sx={{ textDecoration: "none" }}
                >
                  <Typography
                    sx={{
                      py: { xs: 1.5, md: isZoomed ? 0.7 : 1 },  px: { xs: 1, md: isZoomed ? 1.2 : 2 }, backgroundColor: "#DD8006", color: "#fff", borderRadius: "50px", 
                      display: "inline-block", fontSize: { xs: "20px", sm: "12px", md: isZoomed?"18px":"20px" }, 
                      fontWeight: 600, width: { xs: "80%", sm: "60%", md: "80%" }
                    }}                    
                  >
                    Walmart Marketplace Login
                  </Typography>
                </Link>
              </Box>
            </Grid>
          )}
        </Grid>
        <Grid
          item
          sx={{
            
            width: { xs: "100%", md: "60%" }, height: { xs: "100vh", md: "100%" }, 
            backgroundImage: "url('/login-rectangle.png')", backgroundSize: "cover", 
            backgroundPosition: "center", backgroundColor: "#0F0049", position: "relative", 
            order: { xs: 2, md: 2 }, overflow:"hidden"
          }}          
        >
          <Box
            component="img"
            src="EllipseMobile.png"
            alt="Mobile Ellipse"
            sx={{
              position: "absolute",top: 58, right: 16,width: "137px",height: "313px",zIndex: 0,
              display: { xs: "block", sm: "none" }, // only visible on mobile
            }}
          />
          <Box
            component="img"
            src="/Ellipse2.png"
            alt="Top Right Image"
            sx={{
              position: "absolute",
              top: 24,
              right: 24,
              width: imageWidth,
              height: imageHeight,
              zIndex: 0,
              display: { xs: "none", sm: "block" }, // visible only on tablet and up
            }}
          />
          <Box sx={{ textAlign: "center", p: { xs: 3, md: 4 }, marginTop: { xs: "80px", md: "60px" }, pb: { xs: 3, md: 4 },overflow:"hidden" }}>
            <Box
              sx={{ borderRadius: 3, display: "inline-block", borderTop: "8px solid black", borderLeft: "8px solid black", borderRight: "8px solid black",zIndex:2,position:"relative", marginTop:isZoomed ? "-25px": { xs: "16px", sm: "28px", md: "0px" }}}
            >
              <img src="/bitmap3.png" alt="Bitmap" style={{ display: "block", width: bitmapWidth, height: "auto" }} />
            </Box>
            <Typography
              variant="h1"
              sx={{
                
                color: "white",
                mt: { xs: 2, sm: 2, md: 3 },
                mb: { xs: 1, sm: 1, md: 2 },
                fontWeight: 600,
                fontSize: { xs: "40px", sm: "20.8px", md: isZoomed?"32px":"40px" },
              }}
            >
              {isXs ? (
                <>
                  The Ultimate <br />
                  Platform for <br />
                  Product Content
                </>
              ) : (
                <>
                  The Ultimate Platform for <br />
                  Product Content
                </>
              )}
            </Typography>
            <Typography
            sx={{
              color: "white", fontSize: { xs: "18px", sm: "9.6px", md: isZoomed?"12px":"18px" },
              mt: { xs: 0.2, sm: "0.4", md: 1 }, textAlign: "center",
              fontWeight: 300, lineHeight: { xs: 1.2, sm: 1.4, md: 1.5 }
            }}            
          >
            {descriptionLines.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </Typography>
            <Typography
              variant="body2"
              sx={{color: "#fff",fontWeight:300, marginTop:{xs:4},fontSize: { xs: "16px", sm: "9.6px", md: "12.8px" },pt: { xs: 5, sm: 3, md: 5 },}}
            >
              Need help?{" "}
              <Link
                href="https://www.gspann.com/contact-us/"
                target="_blank"
                component="a"
                underline="none"
                style={{ color: "#9DBEFC", fontWeight: 300, textDecoration: "none" }}
              >
                Contact us
              </Link>
            </Typography>
            <Button
              component={Link}
              sx={{
                marginTop: { xs: 6, md: isNormalZoom?"30px": "20px" },
                borderRadius: "50px",
                padding: "0px 2px",
                textTransform: "capitalize",
                backgroundColor: "#FFFFFF",
                fontWeight:600,
                color: "#0651DD",
                px:isZoomed?1.5: 2, py: 1, fontSize: { xs: "20px", sm: "12px", md: isZoomed?"12px":"16px" },
                "&:hover": { backgroundColor: "#FFFFFF" }
              }}              
              href="https://meetings.hubspot.com/chandra-singh2/chandra-contenthubgpt"
              target="_blank"
            >
              Request a Demo
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { getSession } = require("next-auth/react");
  const session = await getSession(context);
  return {
    props: {
      session: session || null,
      query: context.query || {},
    },
  };
}