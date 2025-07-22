import { useEffect, useState, useMemo, useCallback } from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import "./sidebar.css";
import SettingsDrawer from "./SettingsDrawer";
import { useSelector, useDispatch } from "react-redux";
import { getSession, useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import axios from "axios";
import {
  setUserPlan,
  setCallsLeft,
  setCallsMade,
  setAccountRenewalDate,
  setCountReset,
  setPlanName,
  setAllowedCalls,
  setUserInfo,
  setCompany,
  setBrandIdList,
  setUserBrands,
  setCallsUsageCount,
  setUserChosenLLM,
  setUserCloudInfo
} from "../../../store/userSlice";
import trackActivity from "../../helper/dashboard/trackActivity";
import { useRouter } from "next/router";
import { useWarning } from "../../../context/WarningContext";
import {
  GET_USER_PROFILE,
  GET_USER_BRANDS_LIST,
  GET_CLOUD_INFO,
} from "../../../utils/apiEndpoints";
import { useBrandDisplay } from "../../../hooks/data/useBrandDisplay";
import { useToast } from "../../../context/ToastContext";

const dashboardRoute = "dashboard";
const menuItems = [
  {
    icon: <Box className="material-symbols-outlined">home</Box>,
    text: "Home",
    route: `/${dashboardRoute}/home`,
  },

  {
    icon: <Box className="material-symbols-outlined">package_2</Box>,
    text: "Products",
    route: `/${dashboardRoute}/products`,
  },
  {
    icon: <Box className="material-symbols-outlined">folder</Box>,
    text: "Documents",
    route: `/${dashboardRoute}/documents`,
  },
  {
    icon: <Box className="material-symbols-outlined">schedule</Box>,
    text: "Activity",
    route: `/${dashboardRoute}/activity`,
  },
  {
    icon: <Box className="material-symbols-outlined">bolt</Box>,
    text: "Integration",
    route: `/${dashboardRoute}/integration`,
  },
  {
    icon: <Box className="material-symbols-outlined">api</Box>,
    text: "Developer",
    route: `/${dashboardRoute}/developer`,
    isDisabled: true,
  },
];

/* 
const MenuItem = (props) => {
  const { route, pathname } = props;

  const isPathSelected = route === pathname && route;
  return (
    <Link href={props.route} style={{ textDecoration: "none" }}>
      <Box
        className="settings-menu-item"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          padding: "6px 0",
          marginBottom: "5px",
          color: isPathSelected ? "#FCFCFC" : "#C6C6C6",
          border: isPathSelected ? "1px solid #163058" : null,
          background: isPathSelected ? "#00102B" : null,
          borderRadius: "4px",
          textDecoration: "none",
          transition: "color 0.3s",
          "&:hover": {
            color: isPathSelected ? null : "#FCFCFC",
            backgroundColor: isPathSelected ? null : "#2e4770",
          },
        }}
        onClick={props.onClick}
      >
        {props.icon}
        <Typography variant="caption">{props.text}</Typography>
      </Box>
    </Link>
  );
};*/

const MenuItem = (props) => {
  const { route, pathname, isDisabled } = props;

  const isPathSelected = route === pathname && route;

  return (
    <Link
      href={isDisabled ? "#" : props.route} // Disable link if disabled
      style={{
        textDecoration: "none",
        pointerEvents: isDisabled ? "none" : "auto",
      }} // Prevent interaction
    >
      <Box
        className="settings-menu-item"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: isDisabled ? "not-allowed" : "pointer", // Change cursor
          padding: "6px 0",
          marginBottom: "5px",
          color: isPathSelected
            ? "#FCFCFC"
            : isDisabled
            ? "#A0A0A0" // Gray out when disabled
            : "#C6C6C6",
          border: isPathSelected ? "1px solid #163058" : null,
          background: isPathSelected ? "#00102B" : null,
          borderRadius: "4px",
          textDecoration: "none",
          transition: "color 0.3s",
          "&:hover": {
            color: isDisabled ? "#A0A0A0" : "#FCFCFC", // Prevent hover effect when disabled
            backgroundColor: isDisabled ? "transparent" : "#2e4770",
          },
        }}
        onClick={isDisabled ? null : props.onClick} // Disable onClick handler
      >
        {props.icon}
        <Typography variant="caption">{props.text}</Typography>
      </Box>
    </Link>
  );
};

const SideBarMenu = (props) => {
  const { data: session, status, update } = useSession();
  const userState = useSelector((state) => state.user);
  const brandIdList = userState?.brandIdList;
  const windowSize = props.windowSize || 0;
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { setShowWarning } = useWarning();

  const { department, phone, country, company, websiteUrl } =
    userState?.userInfo || {};
  const route = router.pathname;
  const { showToast } = useToast();

  // const {
  //   displayName,
  //   brandUrl,
  //   isSpecificBrand,
  //   brandId,
  //   isActive,
  //   brandLanguages,
  //   defaultLanguage,
  // } = useBrandDisplay();

  // const handleRedirect = useCallback(() => {
  //   if (
  //     !userState?.userInfo ||
  //     defaultLanguage === undefined ||
  //     !userState?.userPlan
  //   ) {
  //     return;
  //   }

  //   if (userState?.userInfo?.orgId && !brandLanguages) {
  //     showToast(
  //       "Please contact your admin for language options or set on org-settings page",
  //       "error"
  //     );
  //     router.push("/dashboard/settings/organization-settings");
  //     return;
  //   } else if (
  //     defaultLanguage === null ||
  //     !brandLanguages?.includes(defaultLanguage)
  //   ) {
  //     console.log(defaultLanguage);
  //     console.log(brandLanguages);
  //     showToast("Please complete your profile to continue", "error");
  //     router.push("/dashboard/profile");
  //   }
  // }, [brandLanguages, defaultLanguage]);
 
// const handleRedirect = useCallback(() => {
//   if (!userState?.userInfo || defaultLanguage === undefined || !userState?.userPlan) {
//       return;
//   }
//   if (userState?.userInfo && !brandLanguages) {
//       showToast("Please contact your admin for language options or set on org-settings page", "error");
//       router.push("/dashboard/settings/organization-settings");
//       return;
//   };
 
//   if (defaultLanguage === null || !(brandLanguages.includes(defaultLanguage))) {
//       showToast("Please complete your profile to continue", "error");
//       router.push("/dashboard/profile");
//       return;
//   };
// }, [brandLanguages, defaultLanguage, router]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (userState?.userInfo && defaultLanguage !== undefined) {
  //       handleRedirect();
  //     }
  //   }, 2000); // 2 seconds delay

// useEffect(() => {
//   if (userState?.userInfo && defaultLanguage !== undefined) {
//       handleRedirect();
//   }
// }, [userState?.userInfo, defaultLanguage, brandLanguages, router.pathname]);

  // useEffect(() => {
  //   handleRedirect();
  // }, [router.pathname]);

  useEffect(() => {
    if (
      [department, phone, country, company, websiteUrl].some(
        (field) => field == ""
      )
    ) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [department, phone, country, company, websiteUrl, route]);

  const getAccountPara = async () => {
    axios
      .get(
        process.env.NEXT_PUBLIC_BASE_URL +
          "/standalone/show/account_parameters",
        {
          headers: {
            Authorization: props?.user?.id_token,
          },
        }
      )
      .then((response) => {
        // console.log('response', response)
        dispatch(setCallsLeft(response.data.Calls_Left));
        dispatch(setCallsMade(response.data.Calls_Made));
        dispatch(setUserPlan(response.data.User_Plan));
        dispatch(setCountReset(response.data.Count_Reset));
        dispatch(setAccountRenewalDate(response.data.Account_Renewal_Date));
        dispatch(setPlanName(response.data.Plan_name));
        dispatch(setAllowedCalls(response.data.allowed_calls));

        update({
          user: { ...session?.user, planCode: response?.data?.User_Plan },
        });
      })
      .catch((error) => {
        // console.log("error response int auth para: ", error);
        if (
          error?.response?.status === 401 ||
          error?.response?.data?.message ===
            "Organization permissions revoked" ||
          error?.response?.data?.error === "Signature has expired"
        ) {
          trackActivity(
            "LOGOUT",
            "",
            props?.user,
            "",
            userState?.userInfo?.orgId,
            null,
            null,
            null,
            brandIdList
          );

          signOut({ redirect: false });
        }

        console.error("error log: ", error);
      });
  };

  const getUserProfile = async () => {
    axios
      .get(process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_USER_PROFILE, {
        headers: {
          Authorization: props?.user?.id_token,
        },
      })
      .then((response) => {
        dispatch(setUserInfo(response?.data));
        if (response?.data?.callsUsageCount) {
          dispatch(setCallsUsageCount(response?.data?.callsUsageCount));
        }
        if (response?.data?.company) {
          dispatch(setCompany(response?.data?.company));
        }
        if(response?.data?.chosen_llm){
          dispatch(setUserChosenLLM(response?.data?.chosen_llm))
        }

        //Redirect to profile page if profile is not updated
        if (response.data.profileUpdated == false) {
          router.push("/dashboard/profile");
        }
        if (response?.data?.role) {
          // update({ ...session, role: response?.data?.role })
          // session.user.role = response?.data?.role
          props.user.role = response?.data?.role;
          update({
            user: {
              ...session?.user,
              role: response?.data?.role,
              org_id: response?.data?.orgId,
            },
          });
          session.user.role = response?.data?.role;
          session.user.org_id = response?.data?.orgId;
        }
        // console.log('updated role', response?.data?.role)
      })
      .catch((error) => {
        if (error?.response?.data?.message == "Authentication token expired.") {
          signOut({ redirect: false });
        }
      });
  };

  const CloudInformation = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_BASE_URL + GET_CLOUD_INFO,
        {
          headers: {
            Authorization: props?.user?.id_token,
          },
        }
      );
      dispatch(setUserCloudInfo(response?.data))
    } catch (error) {
      showToast("Unable to fetch Cloud Information", "error");
    }
  };

  useEffect(() => {
    CloudInformation();
  }, []);

  const getUserBrandsList = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_USER_BRANDS_LIST,
        {
          headers: {
            Authorization: props?.user?.id_token,
          },
        }
      );
      const brands = response?.data;
      const brandIds = brands.map((brand) => brand.brand_id);
      dispatch(setBrandIdList(brandIds));
      dispatch(setUserBrands(brands));
    } catch (err) {
      console.error("Error fetching user brands: ", err);
    }
  };

  useEffect(() => {
    getAccountPara();
    getUserProfile();
    getUserBrandsList();
  }, [router.pathname]);

  // Memoize the publicApiClient to avoid unnecessary re-computations
  const publicApiClient = useMemo(
    () => userState?.apiClientId,
    [userState?.apiClientId]
  );

  return (
    <>
      <AppBar
        sx={
          windowSize > 768
            ? {
                left: "0",
                backgroundColor: "#022149",
                width: "80px",
                height: "100vh",
              }
            : {}
        }
      >
        <Box
          className={
            props.windowSize <= 768
              ? `sidebar ${props.isOpen == true ? "active" : ""}`
              : ""
          }
        >
          <Toolbar
            className="sidebartool"
            disableGutters
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100vh",
            }}
          >
            <Box
              className="menu-container"
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                width: "75px",
                paddingLeft: "2px",
                paddingRight: "3px",
              }}
            >
              <Link href="/dashboard/home">
                <Image
                  style={{
                    padding: "5px 12px",
                  }}
                  width="50"
                  height="50"
                  src="/dashboard/dashboard-logo.svg"
                  alt="Logo"
                  priority
                />
              </Link>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  route={item.route}
                  pathname={pathname}
                  isDisabled={
                    item.route === "/dashboard/developer" && !publicApiClient
                  } // Pass the isDisabled flag true of publicApiClient is present
                />
              ))}
            </Box>

            <Box
              className="menu-footer"
              sx={{
                width: "75px",
                paddingLeft: "2px",
                paddingRight: "3px",
              }}
            >
              <SettingsDrawer user={props.user} />
              <Image
                width="75"
                height="18"
                src="/dashboard/gspann_logo_white_red.png"
                alt="Logo"
                priority
              />
            </Box>
          </Toolbar>
        </Box>
        <Box
          className={`sidebar-overlay ${props.isOpen == true ? "active" : ""}`}
          onClick={props.ToggleSidebar}
        ></Box>
      </AppBar>
    </>
  );
};

export default SideBarMenu;
