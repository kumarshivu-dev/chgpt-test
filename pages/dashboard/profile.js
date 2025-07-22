import axios from "axios";
import {
  GET_USER_PROFILE,
  POST_FILE_UPLOAD,
  UPDATE_USER_PROFILE,
} from "../../utils/apiEndpoints";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import StyledCircularProgress from "../../utils-ui/StyledCircularProgress";
import { BorderColorRounded, Warning } from "@mui/icons-material";
import Image from "next/image";
import CircularWithValueLabel from "../circularProgress";
import {
  companyInfoFields,
  personalInfoFields,
  planImagesFull,
} from "../../constants/dashboard/profilePageConstants";
import EditProfileModal from "../../components/dashboard/Profile/EditProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../store/userSlice";
import { useToast } from "../../context/ToastContext";
import { useRouter } from "next/router";
import { useBrandDisplay } from "../../hooks/data/useBrandDisplay";

const ellipsisStyle = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "70%",
};

const Profile = ({ user }) => {
  // session state management
  const { data: session, status, update } = useSession();
  const {
    displayName,
    brandUrl,
    isSpecificBrand,
    brandId,
    isActive,
    brandLanguages,
    defaultLanguage,
    brandSpecification,
  } = useBrandDisplay();

  //hooks management
  const router = useRouter();
  const { showToast } = useToast();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  // redux state management
  const dispatch = useDispatch();
  const userStore = useSelector((state) => state.user);
  const { userInfo } = userStore;

  // react state management
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editModalType, setEditModalType] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  // upload profile image handler function
  const uploadProfileImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("files", file);

    setLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_FILE_UPLOAD,
        formData,
        {
          headers: {
            Authorization: user?.id_token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const responseData = response?.data;
      if (responseData?.status === true) {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + UPDATE_USER_PROFILE,
          {
            profileImage: responseData?.imageNames[0],
          },
          {
            headers: {
              Authorization: user?.id_token,
            },
          }
        );
        const updateProfileResponseData = response?.data;
        if (updateProfileResponseData?.status === true) {
          dispatch(
            setUserInfo({
              ...userInfo,
              percentCompleted: updateProfileResponseData?.percentCompleted,
              profileImage: responseData?.imageNames[0],
            })
          );
          showToast("Image uploaded successfully", "success");
        } else {
          showToast(
            updateProfileResponseData?.errorMessage ||
              "Profile image upload Failed",
            "error"
          );
        }
      } else {
        showToast(
          responseData?.errorMessage || "Profile image upload Failed",
          "error"
        );
      }
    } catch (error) {
      showToast(
        "Error while uploading Profile image. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // get user profile handler function
  const getUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_USER_PROFILE,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      const responseData = response?.data;
      if (responseData?.status === true) {
        dispatch(setUserInfo(responseData));
      } else {
        showToast(
          responseData?.errorMessage || "getting user info Failed",
          "error"
        );
      }
    } catch (error) {
      showToast("Error while getting Profile info. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // getting user profile data on component mount
  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    if (userInfo?.websiteUrl && !userInfo?.companyMail) {
      showToast("Please enter your organization email id", "warning");
    }
  }, [userInfo]);

  useEffect(() => {
    if (
      !hasRedirected &&
      session?.user?.newUser &&
      userInfo?.name &&
      userInfo?.email &&
      userInfo?.company &&
      userInfo?.department &&
      userInfo?.country &&
      userInfo?.phone &&
      userInfo?.websiteUrl &&
      userInfo?.companyMail
    ) {
      setHasRedirected(true); // Mark as redirected
      update({
        ...session,
        user: { ...session.user, newUser: false, name: userInfo?.name },
      });
      showToast("Profile updated successfully!", "success");

      setTimeout(() => {
        router.push("/dashboard/home");
      }, 3000); // Allows session update to settle
    }
  }, [userInfo, session, hasRedirected]); // Adde

  useEffect(() => {
    if (!userInfo || userInfo.length === 0) return;

    const personalFields = ["name", "email", "phone", "country"];
    const companyFields = [
      "company",
      "department",
      "websiteUrl",
      "companyMail",
    ];

    const isPersonalIncomplete = personalFields.some(
      (field) => !userInfo?.[field]
    );
    const isCompanyIncomplete = companyFields.some(
      (field) => !userInfo?.[field]
    );

    if (isPersonalIncomplete && isCompanyIncomplete) {
      showToast("Please complete your profile to continue.", "error");
      return;
    }

    if (isCompanyIncomplete) {
      showToast("Please complete your company details.", "error");
      return;
    }

    if (isPersonalIncomplete) {
      showToast("Please complete your personal details.", "error");
      return;
    }
  }, [userInfo]);

  return (
    <>
      {/* loader  */}
      {loading && <StyledCircularProgress />}
      {/* edit profile modal  */}
      {openEditModal && (
        <EditProfileModal
          open={openEditModal}
          loading={loading}
          setLoading={setLoading}
          onClose={() => setOpenEditModal(false)}
          user={user}
          editModalType={editModalType}
          title={
            editModalType === "personal"
              ? "Edit Personal Info"
              : "Edit Company Info"
          }
          fields={
            editModalType === "personal"
              ? personalInfoFields
              : companyInfoFields
          }
        />
      )}
      {/* profile page layout */}
      <Grid container>
        {/* profile heading  */}

        <Grid
          item
          xs={12}
          lg={8}
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Profile heading */}
          <Box>
            {" "}
            <Stack direction={"column"} spacing={2}>
              <Typography variant="h3">Profile</Typography>
              <Typography variant="subtitle2" color="#777777">
                The profile section provides a comprehensive overview of your
                account, allowing you to manage personal and company
                information.
              </Typography>
            </Stack>
          </Box>
        </Grid>
        {userInfo?.public_org_id && (
          <Grid
            item
            xs={12}
            lg={4}
            sx={{
              padding: 2,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Box
              sx={{
                display: !isDesktop ? "none" : "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography variant="h6" fontWeight={"bold"}>
                ORG Id :{" "}
                <Typography component={"span"}>
                  {userInfo?.public_org_id}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        )}
        {/* profile info  */}
        <Grid
          item
          xs={12}
          lg={8}
          sx={{
            padding: 2,
          }}
        >
          <Stack direction={"column"} spacing={2}>
            {/* profile image section */}
            {isDesktop ? (
              <Card sx={{ padding: 2 }}>
                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                  <Box>
                    <Avatar
                      src={
                        process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL +
                        userInfo?.profileImage
                      }
                      sx={{
                        width: 120,
                        height: 120,
                        background: "#022149",
                      }}
                    />
                  </Box>
                  <Box>
                    <Box>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        style={{ display: "none" }}
                        onChange={uploadProfileImage}
                        id="profile-image-upload"
                      />
                      <label htmlFor="profile-image-upload">
                        <Button variant="contained" component="span">
                          Upload New Photo
                        </Button>
                      </label>
                    </Box>
                    <Typography variant="subtitle2">
                      At least 800x800 px is recommended. JPG or PNG preferred.
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Stack direction={"column"} spacing={2}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    badgeContent={
                      <>
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          style={{ display: "none" }}
                          onChange={uploadProfileImage}
                          id="profile-image-upload-mobile"
                        />
                        <label htmlFor="profile-image-upload-mobile">
                          <Button variant="outlined" component="span">
                            <BorderColorRounded />
                          </Button>
                        </label>
                      </>
                    }
                  >
                    <Avatar
                      src={
                        process.env.NEXT_PUBLIC_PROFILE_IMAGE_URL +
                        userInfo?.profileImage
                      }
                      sx={{
                        width: 120,
                        height: 120,
                        background: "#022149",
                      }}
                    />
                  </Badge>
                </Stack>
              </Box>
            )}
            {userInfo?.public_org_id && (
              <Box
                sx={{
                  display: isDesktop ? "none" : "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Typography variant="h6" fontWeight={"bold"}>
                  ORG Id :{" "}
                  <Typography component={"span"}>
                    {userInfo?.public_org_id}
                  </Typography>
                </Typography>
              </Box>
            )}
            {/* personal data section */}
            <Card sx={{ padding: 2 }}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography variant="h6" fontWeight={"bold"}>
                    {" "}
                    Personal Information
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOpenEditModal(true), setEditModalType("personal");
                    }}
                  >
                    <BorderColorRounded /> &nbsp;
                    {isDesktop && <Typography>Edit</Typography>}
                  </Button>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Name
                  </Typography>
                  <Typography
                    sx={ellipsisStyle}
                    title={user?.name || userInfo?.name || "-"}
                  >
                    {" "}
                    {userInfo?.name || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Email
                  </Typography>
                  <Typography
                    sx={ellipsisStyle}
                    title={user?.email || userInfo?.email || "-"}
                  >
                    {user?.email || userInfo?.email || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Phone
                  </Typography>
                  <Typography sx={ellipsisStyle} title={userInfo?.phone || "-"}>
                    {userInfo?.phone || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Country
                  </Typography>
                  <Typography
                    sx={ellipsisStyle}
                    title={userInfo?.country || "-"}
                  >
                    {userInfo?.country || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Default Language
                  </Typography>
                  <Typography sx={ellipsisStyle} title={defaultLanguage || "-"}>
                    {brandLanguages && defaultLanguage
                      ? brandLanguages?.includes(defaultLanguage)
                        ? defaultLanguage
                        : "-"
                      : "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
            {/* company data section */}
            <Card sx={{ padding: 2 }}>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography variant="h6" fontWeight={"bold"}>
                    {" "}
                    Company Information
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOpenEditModal(true), setEditModalType("company");
                    }}
                  >
                    <BorderColorRounded /> &nbsp;
                    {isDesktop && <Typography>Edit</Typography>}
                  </Button>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Company Name
                  </Typography>
                  <Typography
                    sx={ellipsisStyle}
                    title={userInfo?.company || "-"}
                  >
                    {userInfo?.company || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Website
                  </Typography>
                  <Typography
                    sx={ellipsisStyle}
                    title={userInfo?.websiteUrl || "-"}
                  >
                    {userInfo?.websiteUrl || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Department
                  </Typography>
                  <Typography
                    sx={ellipsisStyle}
                    title={userInfo?.department || "-"}
                  >
                    {userInfo?.department || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6} py={1}>
                  <Typography variant="h6" fontWeight="bold">
                    Company Email
                  </Typography>
                  <Typography
                    sx={ellipsisStyle}
                    title={userInfo?.companyMail || "-"}
                  >
                    {" "}
                    {userInfo?.companyMail || "-"}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </Grid>
        {/* subscription info  */}
        <Grid item xs={12} lg={4} sx={{ padding: 2 }}>
          <Stack direction="column" flexWrap={"wrap"} spacing={2}>
            <Card sx={{ padding: 2, height: "auto" }}>
              <Stack
                direction={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={2}
              >
                <Typography variant="h6" fontWeight={"bold"}>
                  Subscription
                </Typography>

                <Image
                  color="gray"
                  priority={true}
                  src={
                    userStore?.userPlan?.startsWith("chgpt-enterprise")
                      ? planImagesFull["chgpt-enterprise"]
                      : userStore?.userPlan?.startsWith("chgpt-basic")
                      ? planImagesFull["chgpt-basic"]
                      : userStore.userPlan?.startsWith("chgpt-essentials")
                      ? planImagesFull["chgpt-essentials"]
                      : planImagesFull[userStore?.userPlan]
                  }
                  width="200"
                  height="200"
                  alt="badge"
                />
              </Stack>
            </Card>
            <Card sx={{ padding: 2, height: "auto" }}>
              <Stack
                direction={"column"}
                spacing={2}
                justifyContent={"center"}
                alignItems={"center"}
                sx={{ height: "100%" }}
              >
                <Typography variant="h6" fontWeight={"bold"}>
                  Profile Completion
                </Typography>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularWithValueLabel
                    size={150}
                    progress={Number(userInfo?.percentCompleted) || 0}
                  />
                </Box>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;

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
