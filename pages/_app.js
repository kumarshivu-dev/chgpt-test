"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import MenuIcon from "@mui/icons-material/Menu";
import "../app/custom.css";
import Header from "../components/header/Header";
import SideBarMenu from "../components/dashboard/SideBar/SideBarMenu";
import Footer from "../components/footer/Footer";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { Container, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../app/theme.js";
import { Provider } from "react-redux";
import appStore from "../store/appStore";
import Head from "next/head";
import dashboardtheme from "../app/dashboard/dashboardtheme.js";
import DashboardHeader from "../components/dashboard/header/DashboardHeader";
import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { FilenameProvider } from "../context/filename";
import { WarningProvider } from "../context/WarningContext";
import { ToastProvider } from "../context/ToastContext.js";
import { UserProvider } from "../context/UserContext";
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [windowSize, setWindowSize] = useState(800);
  const [isOpen, setIsopen] = useState(false);
  const router = useRouter();
  const ToggleSidebar = () => {
    isOpen === true ? setIsopen(false) : setIsopen(true);
  };
  const isInvitationPage = Component.isInvitationPage;

  useEffect(() => {
    document.body.className = router.pathname.replace("/", ""); // Remove leading slash

    return () => {
      document.body.className = "";
    };
  }, [router.pathname]);

  // To fetch window screen width
  useEffect(() => {
    const handleSize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleSize);
    handleSize();
  });

  if (
    router.pathname == "/login" ||
    router.pathname == "/thankyou" ||
    router.pathname == "/okta-guide" ||
    router.pathname == "/auth/error"
  ) {
    return (
      <>
        <Head>
          {/* {router.pathname === "/login" ? (
            <>
              <script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-XQN16ZBK91"></script>
              <script dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-XQN16ZBK91');
                `
              }} />
            </>
          ) : null} */}
            
            <>
              <script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-DN8Z7VPF8P"
              ></script>
              <script
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-DN8Z7VPF8P');
                  `
                }}
              />
              <script
                strategy="afterInteractive"
                type="text/javascript"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(c,l,a,r,i,t,y){
                      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "j19iwgl4h2");
                  `
                }}
              />
            </>
          
        </Head>

      <UserProvider>
        <Provider store={appStore}>
          <SessionProvider session={session} refetchOnWindowFocus={true}>
            <ThemeProvider theme={theme}>
              <ToastProvider>
                <FilenameProvider>
                  <WarningProvider>
                    <GlobalStyles />
                    {/* <Header /> */}
                    <Container className="main-login">
                      <Component {...pageProps} />
                    </Container>
                    {/* <Footer /> */}
                  </WarningProvider>
                </FilenameProvider>{" "}
              </ToastProvider>
            </ThemeProvider>
          </SessionProvider>
        </Provider>
        </UserProvider>
      </>
    );
  } else if (router.pathname.startsWith("/dashboard")) {
    return (
      <>
        {process.env.NODE_ENV !== "development" && (
          <Head>
            <script
              strategy="afterInteractive"
              src="https://www.googletagmanager.com/gtag/js?id=G-DN8Z7VPF8P"
            ></script>
            <script strategy="afterInteractive">
              {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

gtag('config', 'G-DN8Z7VPF8P');

`}
            </script>
            <script strategy="afterInteractive" type="text/javascript">
              {`    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "j19iwgl4h2");
`}
            </script>
          </Head>
        )}
        <UserProvider>
        <Provider store={appStore}>
          <SessionProvider session={session}>
            <ThemeProvider theme={dashboardtheme}>
              <ToastProvider>
                <FilenameProvider>
                  <WarningProvider>
                    <GlobalStyles />
                    {windowSize <= 768 && (
                      <Box
                        className="side-hamburger"
                        sx={{
                          position: "fixed", // Set position to fixed
                          top: "1px", // Fix it to the top of the viewport
                          left: "4%", // Fix it to the left of the viewport
                          height: "60px",
                          bgcolor: "#F9FAFB",
                          zIndex: 1000, // Ensure it's above other content
                        }}
                      >
                        <Box
                          className="btn btn-primary"
                          onClick={ToggleSidebar}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            color: "#111111",
                            padding: "12px",
                            width: "10%",
                            cursor: "pointer",
                          }}
                        >
                          <MenuIcon sx={{ fontSize: "36px" }} />
                        </Box>
                      </Box>
                    )}
                    <DashboardHeader {...pageProps} />

                    <Box
                      sx={{
                        display: "flex",
                      }}
                    >
                      <SideBarMenu
                        {...pageProps}
                        isOpen={isOpen}
                        ToggleSidebar={ToggleSidebar}
                        windowSize={windowSize}
                      />
                      <Container
                        sx={{
                          background: "#FCFCFC",
                          marginLeft: windowSize <= 768 ? "0px" : "80px",
                          paddingTop: { xs: "70px", md: "80px" },
                          height: "100vh",
                          maxWidth: "none !important",
                          overflow: "auto",
                        }}
                      >
                        <Component {...pageProps} />
                      </Container>
                    </Box>

                    {/* <Footer /> */}
                  </WarningProvider>
                </FilenameProvider>
              </ToastProvider>
            </ThemeProvider>
          </SessionProvider>
        </Provider>
        </UserProvider>
      </>
    );
  } else {
    return (
      <>
        {process.env.NODE_ENV !== "development" && (
          <Head>
            <script
              strategy="afterInteractive"
              src="https://www.googletagmanager.com/gtag/js?id=G-DN8Z7VPF8P"
            ></script>
            <script strategy="afterInteractive">
              {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

gtag('config', 'G-DN8Z7VPF8P');

`}
            </script>
            <script strategy="afterInteractive" type="text/javascript">
              {`    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "j19iwgl4h2");
`}
            </script>
          </Head>
        )}
        <UserProvider>
          <Provider store={appStore}>
            <SessionProvider session={session}>
              <ThemeProvider theme={theme}>
                <ToastProvider>
                  <FilenameProvider>
                    <WarningProvider>
                      <GlobalStyles />
                      {!isInvitationPage && (
                        <Link href="/dashboard/home">
                          <Image
                            style={{
                              padding: "5px 12px",
                              zIndex: 1000000,
                              position: "relative",
                            }}
                            width="50"
                            height="50"
                            src="/dashboard/dashboard-logo.svg"
                            alt="Logo"
                            priority
                          />
                        </Link>
                      )}
                      {!isInvitationPage && <DashboardHeader {...pageProps} />}
                      <Container
                        className="main"
                        sx={{
                          marginTop:
                            windowSize > 768 && !isInvitationPage
                              ? "30px"
                              : "0px",
                          padding: isInvitationPage ? "0px" : "120px",
                          maxWidth: "100%", // fallback
                          "@media (min-width:1200px)": {
                            maxWidth: "100%",
                            padding: 0, // or whatever custom width you want
                          },
                        }}
                      >
                        <Component {...pageProps} windowSize={windowSize} />
                      </Container>
                      {!isInvitationPage && <Footer />}
                    </WarningProvider>
                  </FilenameProvider>
                </ToastProvider>
              </ThemeProvider>
            </SessionProvider>
          </Provider>
        </UserProvider>
      </>
    );
  }
}