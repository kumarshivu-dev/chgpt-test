import { useState, useEffect } from "react";
import "../../../app/dashboard/dashboard-style.css";
import {
  Drawer,
  Box,
  List,
  Typography,
  Grid,
  SvgIcon,
  Tooltip,
} from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { useRouter } from "next/router";
import { useToast } from "../../../context/ToastContext";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import "./sidebar.css";
import { signOut } from "next-auth/react";
import { useSelector } from "react-redux";
import trackActivity from "../../helper/dashboard/trackActivity";
import { setCookie } from "../../../utils/cookies";
import { useBrandDisplay } from "../../../hooks/data/useBrandDisplay";

const SettingsDrawer = ({ user }) => {
  const [state, setState] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const dashboardRoute = "dashboard";
  const userState = useSelector((state) => state.user);
  const brandIds = userState?.brandIdList;
  const [leftPosition, setLeftPosition] = useState(80);
  // userState?.userInfo?.
  const {
    displayName,
    brandUrl,
    isSpecificBrand,
    brandId,
    isActive,
    brandLanguages,
    defaultLanguage,
  } = useBrandDisplay();

  const userRole = userState?.userInfo?.role;
  const userChosenLLM = userState?.userInfo?.chosen_llm;
  let IsUserEnterPrise = userState?.userPlan?.startsWith("chgpt-enterprise");
  let IsUserFreeOrBasic =
    userState?.userPlan?.startsWith("chgpt-basic") ||
    userState?.userPlan?.startsWith("chgpt-free");
  let brandVoiceEditorFlag = userRole?.toLowerCase() === "editor";
  let mgmtEditorFlag = userRole?.toLowerCase() === "editor";

  useEffect(() => {
    // Adjust left position for mobile view
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setLeftPosition(87);
      } else {
        setLeftPosition(80);
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial adjustment
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Set a timeout to wait for 2 seconds before executing the redirection logic
    const timer = setTimeout(() => {
      if (user?.newUser) {
        setCookie("isFreshUser", true);
        trackActivity(
          "USER_NEW_ACCOUNT",
          "",
          user,
          "",
          userState?.userInfo?.orgId,
          null,
          null,
          null,
          brandIds
        );

        // showToast("Please complete your profile to continue", "error");
        router.push({
          pathname: "/dashboard/profile",
          // query: {
          //   profile_message: "Please complete your profile to continue",
          // },
        });
      }
    }, 2000); // Delay the execution by 2 seconds

    // Clear the timer on cleanup to avoid memory leaks
    return () => clearTimeout(timer);
  }, [router.pathname]);

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      await trackActivity(
        "LOGOUT",
        "",
        user,
        "",
        userState?.userInfo?.orgId,
        null,
        null,
        null,
        brandIds
      );
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      signOut({ redirect: false });
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  const settingsTopItem = () => (
    <Box
      className="top-item"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {[
          {
            text: "User Management",
            icon: (
              <span className="material-symbols-outlined" fontSize="small">
                group
              </span>
            ),
            route: `/${dashboardRoute}/settings/management`,
          },
          {
            text: "Brand Voice",
            icon: (
              <span className="material-symbols-outlined" fontSize="small">
                voice_selection
              </span>
            ),
            route: `/${dashboardRoute}/settings/brand-voice`,
          },

          // {
          //   text: "Check Compliance",
          //   icon: (
          //     <span className="material-symbols-outlined">
          //       assured_workload
          //     </span>
          //   ),
          //   route: `/${dashboardRoute}/settings/checkCompliance`,
          // },

          {
            text: "Hypertargeting",
            icon: <span class="material-symbols-outlined">target</span>,
            route: `/${dashboardRoute}/settings/hypertarget`,
          },
          {
            text: "Compliance Files",
            icon: (
              <span className="material-symbols-outlined">
                assured_workload
              </span>
            ),
            route: `/${dashboardRoute}/settings/compliance`,
          },
          {
            text: "Organization Settings",
            icon: (
              <span class="material-symbols-outlined">
                settings_applications
              </span>
            ),
            route: `/${dashboardRoute}/settings/organization-settings`,
          },
          {
            text: "Environment Settings",
            icon: (
              <span
                className="material-symbols-outlined"
                style={{ marginLeft: "2.5px" }}
              >
                manage_accounts
              </span>
            ),
            route: `/${dashboardRoute}/settings/environmentSettings`,
          },
          {
            text: "Channel Settings",
            icon: (
              <span
                className="material-symbols-outlined"
                style={{ marginLeft: "2.5px" }}
              >
                local_library
              </span>
            ),
            route: `/${dashboardRoute}/settings/channel-settings`,
          },
        ]
          .filter((item) => {
            if (
              item?.text === "User Management" &&
              userRole?.toLowerCase() === "editor"
            ) {
              return true; // Hide "User Management" item if role is "Editor"
            } else if (
              item?.text === "Brand Voice" &&
              userRole?.toLowerCase() === "editor"
            ) {
              return true;
            }
            // else if (
            //   item?.text === "Environment Settings" &&
            //   environmentSettingsFlag
            // ) {
            //   return false;
            // }
            return true;
          })
          .map((item, index) => {
            const tooltipTitle =
              item?.text === "Brand Voice" && !IsUserEnterPrise
                ? "Upgrade your plan to Enterprise"
                : item?.text === "Brand Voice" && brandVoiceEditorFlag
                ? "Admin access only"
                : item?.text === "User Management" && IsUserFreeOrBasic
                ? "Upgrade your plan"
                : item?.text === "User Management" && mgmtEditorFlag
                ? "Admin access only"
                : item?.text === "Hypertargeting" && mgmtEditorFlag
                ? "Admin access only"
                : item?.text === "Compliance Files" && mgmtEditorFlag
                ? "Admin access only"
                : item?.text === "Hypertargeting" &&
                  IsUserEnterPrise &&
                  !user?.allowedFeatures?.includes("hypertarget")
                ? "Not available on this plan. Check other enterprise tiers."
                : item?.text === "Hypertargeting" &&
                  !IsUserEnterPrise
                ? "Upgrade your plan to Enterprise"

                : item?.text === "Compliance Files" &&
                  !user?.allowedFeatures?.includes("compliance")
                ? "Upgrade your plan to Enterprise"
                : item?.text === "Compliance Files" &&
                 !["openai", "claude"].includes(userChosenLLM)
                ? "Switch to OpenAI or Claude to use this feature."
                : item?.text === "Organization Settings" && !IsUserEnterPrise
                ? "Upgrade your plan to Enterprise"
                : item?.text === "Environment Settings" && !IsUserEnterPrise
                ? "Upgrade your plan to Enterprise"
                : item?.text === "Channel Settings" && IsUserFreeOrBasic
                ? "Upgrade your plan to Enterprise"
                : "";

            const handleClick = () => {
              if (
                item?.text === "Compliance Files" &&
                !["openai", "claude"].includes(userChosenLLM)
              ) {
                showToast("Switch to OpenAI or Claude to use this feature.", "warning");
                return;
              }
              const upgradeRequired = 
                (item?.text === "Compliance Files" &&
                  (mgmtEditorFlag || !user?.allowedFeatures?.includes("compliance"))) ||
                (item?.text === "Hypertargeting" && mgmtEditorFlag) ||
                (item?.text === "Brand Voice" && !IsUserEnterPrise) ||
                (item?.text === "User Management" && IsUserFreeOrBasic) ||
                (item?.text === "Hypertargeting" &&
                  !user?.allowedFeatures?.includes("hypertarget")) ||
                (item?.text === "Environment Settings" && !IsUserEnterPrise) ||
                (item?.text === "Compliance Files" &&
                  !user?.allowedFeatures?.includes("compliance")) ||
                (item?.text === "Organization Settings" && !IsUserEnterPrise) ||
                (item?.text === "Channel Settings" && IsUserFreeOrBasic);

                if(upgradeRequired){
                  const customMessage = item?.text === "User Management" ? "Upgrade your Plan" : "Upgrade Plan to Enterprise";
                  showToast(customMessage);
                  return;
                }

                router.push(item?.route);
            };

            return (
              <Tooltip
                className="tooltipClass"
                key={index}
                title={tooltipTitle}
                slotProps={{
                  popper: {
                    sx: {
                      [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                        {
                          marginTop: "-10px",
                        },
                      [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                        {
                          marginBottom: "0px",
                        },
                      [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                        {
                          marginLeft: "0px",
                        },
                      [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                        {
                          marginRight: "0px",
                        },
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    padding: "4px 30px",
                    display: "flex",
                    color: "#C6C6C6",
                    cursor: tooltipTitle !== "" ? null : "pointer", // Change cursor based on condition
                    "&:hover": {
                      color: "#F1F1F1",
                      "& svg": {
                        transform: "scale(1.1)",
                      },
                      "& p": {
                        transform: "scale(1.1)",
                      },
                    },
                  }}
                  key={item?.text}
                  onClick={handleClick}
                >
                  <Box
                    sx={{
                      marginRight: "12px",
                      transition: "color 0.3s, transform 0.3s",
                    }}
                  >
                    {item?.icon}
                  </Box>
                  <Typography
                    sx={{
                      marginTop: "4px",
                      transition: "color 0.3s, transform 0.3s",
                    }}
                  >
                    {item?.text}
                  </Typography>
                </Box>
              </Tooltip>
            );
          })}
      </List>
    </Box>
  );

  const settingsBottomItem = () => (
    <Box
      className="bottom-item"
      sx={{
        marginTop: "auto",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {[
          {
            text: "Log Out",
            icon: <span className="material-symbols-outlined">logout</span>,
            route: `/${dashboardRoute}/documents`,
            onClick: handleSignOut,
          },
        ].map((item, index) => (
          <Box
            sx={{
              padding: "4px 30px",
              display: "flex",
              cursor: "pointer",
              "&:hover": {
                "& svg": {
                  color: "#F1F1F1",
                  transform: "scale(1.1)", // Adjust the scale factor as needed for the icon
                },
                "& p": {
                  color: "#F1F1F1",
                  transform: "scale(1.1)", // Adjust the scale factor as needed for the text
                },
                // borderLeft: "4px solid #D77900",
              },
            }}
            key={item?.text}
            onClick={() => router.push(item?.route)}
          >
            <Box
              sx={{
                marginRight: "12px",
                transition: "color 0.3s, transform 0.3s",
              }}
            >
              {item?.icon}
            </Box>
            <Typography sx={{ transition: "color 0.3s, transform 0.3s" }}>
              {item?.text}
            </Typography>
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          cursor: "pointer",
          padding: "6px 0",
          color: state ? "#FCFCFC" : "#C6C6C6",
          border: state ? "1px solid #163058" : null,
          background: state ? "#00102B" : null,
          borderRadius: "4px",
          textDecoration: "none",
          transition: "color 0.3s",
          "&:hover": {
            color: state ? null : "#FCFCFC",
            backgroundColor: state ? null : "#2e4770",
          },
        }}
        onClick={toggleDrawer(true)}
      >
        <Box className="material-symbols-outlined">settings</Box>
        <Typography variant="caption">Settings</Typography>
      </Box>

      <Drawer
        className="settings-drawer"
        sx={{
          display: "flex",
          flexDirection: "column",
          "& .MuiDrawer-paperAnchorLeft": {
            width: 320,
            background: "#00102b",
            color: "white",
            left: `${leftPosition}px`,
            boxShadow:
              "11px 0px 10px 0px #00000080 inset, 5px 0px 10px 0px #00000040",
          },
        }}
        open={state}
        onClose={toggleDrawer(false)}
      >
        {/* settings header */}
        <Grid
          container
          sx={{
            margin: "0px, 30px",
            padding: "10px 30px",
          }}
        >
          <SvgIcon fontSize="large">
            <SettingsOutlinedIcon />
          </SvgIcon>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "25px",
              marginLeft: "17.5px",
            }}
          >
            Settings
          </Typography>
        </Grid>

        {/* settings search */}
        {/* <Grid
          sx={{
            paddingLeft: "30px",
          }}
        >
          <FormControl>
            <TextField
              size="small"
              variant="outlined"
              label="Search Settings"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{
                        color: "#FFF",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
              style={{
                borderColor: "#FFF",
                color: "FFF",
              }}
            />
          </FormControl>
        </Grid> */}

        {settingsTopItem()}
        {/* {settingsBottomItem()}
         */}
        <Box
          className="bottom-item"
          sx={{
            marginTop: "auto",
            padding: "4px 30px",
            display: "flex",
            cursor: "pointer",
            "&:hover": {
              "& svg": {
                color: "#F1F1F1",
                transform: "scale(1.1)", // Adjust the scale factor as needed for the icon
              },
              "& p": {
                color: "#F1F1F1",
                transform: "scale(1.1)", // Adjust the scale factor as needed for the text
              },
            },
          }}
          onClick={() => handleSignOut()}
        >
          <Box
            sx={{
              marginRight: "12px",
              transition: "color 0.3s, transform 0.3s",
              color: "red",
              marginBottom: "12px",
            }}
          >
            <span className="material-symbols-outlined">logout</span>
          </Box>
          <Typography sx={{ transition: "color 0.3s, transform 0.3s" }}>
            Log Out
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SettingsDrawer;
