import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  Card,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import PlayDisabledIcon from "@mui/icons-material/PlayDisabled";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import axios from "axios";

// Import all required modals and components
import AddBrandModal from "../../../components/dashboard/org-management/AddBrandModal";
import EditBrandModal from "../../../components/dashboard/org-management/EditBrandModal";
import EditOrgModal from "../../../components/dashboard/org-management/EditOrgModal";
import DisabledBrandAcknowledgment from "../../../components/dashboard/org-management/DisabledBrandAcknowledgment";
import SnackbarNotifier from "../../../components/helper/dashboard/snackbarNotifier";
import "../../../components/dashboard/org-management/org-mgmt-style.css";
// Custom hooks
import { useUserBrands } from "../../../hooks/data/useUserBrands";
import { useToast } from "../../../context/ToastContext";
import trackActivity from "../../../components/helper/dashboard/trackActivity";

const OrgSettings = ({ user }) => {
  // Router initialization for navigation
  const router = useRouter();

  // Theme and responsiveness hooks
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Custom hook for fetching user brands
  const { fetchUserBrands, isLoading, setIsLoading, error } = useUserBrands();

  // State to store fetched brands
  const [brands, setBrands] = useState([]);

  // Redux selector to get user state
  const userState = useSelector((state) => state.user);
  // const { userBrands } = userState;

  // Check if brand-specific user
  const IsUseBrandSpecific = userState?.userInfo?.brandSpecific;

  const { showToast } = useToast();

  const [modalState, setModalState] = useState({
    addBrand: false, // Add brand modal visibility
    editBrand: false, // Edit brand modal visibility
    editOrg: false, // Edit organization modal visibility
    disableBrand: false, // Disable brand modal visibility
    enableBrand: false, // Enable brand modal visibility - ADDED
    deleteBrand: false, // Delete brand modal visibility - ADDED
    selectedBrand: null, // Currently selected brand for edit/disable
  });

  const [snackbarState, setSnackbarState] = useState({
    open: false, // Snackbar visibility
    message: "", // Message to display
    severity: "success", // Notification type (success/error)
  });

  const orgDetails = useMemo(
    () => ({
      orgID: userState?.userInfo?.public_org_id,
      orgName: userState?.userInfo?.company,
      webUrl: userState?.userInfo?.websiteUrl,
      orglang: userState?.userInfo?.allowedLanguage || [],
    }),
    [user, userState]
  );

  const toggleModal = useCallback((modalType, open, brand = null) => {
    setModalState((prev) => ({
      ...prev,
      [modalType]: open,
      ...(brand && { selectedBrand: brand }),
    }));
  }, []);

  const handleDisableBrand = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}/dashboard/profile/brand/${modalState.selectedBrand?.brand_id}/disable`,
        {}, // Empty body for PATCH
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );

      // Handle successful disable
      if (response?.data?.status === true) {
        activateSnackbar(response?.data?.message, "success");
        loadBrands(); // Reload brands list
      } else {
        // Handle disable failure
        activateSnackbar(
          response?.data?.errorMessage || "Failed to disable brand.",
          "error"
        );
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error while disabling brand: ", error);
      activateSnackbar(
        error.response?.data?.message || "Network error. Please try again.",
        "error"
      );
    } finally {
      // Close disable modal
      toggleModal("disableBrand", false);
    }
  };

  const handleEnableBrand = async () => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}/dashboard/profile/brand/${modalState.selectedBrand?.brand_id}/enable`,
        {}, // Empty body for PATCH
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );

      // Handle successful enable
      if (response?.data?.status === true) {
        activateSnackbar(
          response?.data?.message || "Brand enabled successfully",
          "success"
        );
        loadBrands(); // Reload brands list
      } else {
        // Handle enable failure
        activateSnackbar(
          response?.data?.errorMessage || "Failed to enable brand.",
          "error"
        );
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error while enabling brand: ", error);
      activateSnackbar(
        error.response?.data?.message || "Network error. Please try again.",
        "error"
      );
    } finally {
      // Close enable modal
      toggleModal("enableBrand", false);
    }
  };

  const handleDeleteBrand = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}/dashboard/profile/brand/${modalState.selectedBrand?.brand_id}`,
        {
          headers: {
            Authorization: user.id_token,
          },
          data: {
            brandId: parseInt(modalState.selectedBrand?.brand_id), // Convert to number (Long)
            brandName: modalState.selectedBrand?.name, // Add brandName as required
          },
        }
      );

      // Handle successful delete
      if (response?.data?.status === true) {
        activateSnackbar(
          response?.data?.message || "Brand deleted successfully",
          "success"
        );
        loadBrands(); // Reload brands list
      } else {
        // Handle delete failure
        activateSnackbar(
          response?.data?.errorMessage || "Failed to delete brand.",
          "error"
        );
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error while deleting brand: ", error);
      activateSnackbar(
        error.response?.data?.message || "Network error. Please try again.",
        "error"
      );
    } finally {
      // Close delete modal
      toggleModal("deleteBrand", false);
    }
  };

  const activateSnackbar = useCallback((message, severity = "success") => {
    setSnackbarState({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  }, []);

  const loadBrands = async () => {
    if (user?.id_token) {
      const fetchedBrands = await fetchUserBrands(user.id_token);
      if (fetchedBrands) {
        setBrands(fetchedBrands);
      }
    }
  };

  useEffect(() => {
    loadBrands();
  }, [fetchUserBrands]);

  // Render the component
  return (
    <Box
      sx={{
        padding: isMobile ? "0 16px" : "0 100px",
      }}
    >
      {/* Page Header */}
      <Box sx={{ display: "grid" }}>
        <Typography
          variant={isMobile ? "h6" : "subtitle1"}
          fontWeight="bold"
          fontSize={isMobile ? "18px" : "20px"}
        >
          Organization Settings
        </Typography>
        <Typography
          variant="subtitle2"
          color="#777777"
          marginBottom="12.5px"
          fontSize={isMobile ? "14px" : "inherit"}
        >
          Manage your organization and brand information efficiently.
        </Typography>
        <Divider />
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={isMobile ? 2 : 4}>
        <Grid item xs={12}>
          {/* Organization Information Card */}
          <Card
            sx={{
              padding: isMobile ? "10px" : "15px",
              marginBottom: "10px",
            }}
          >
            {/* Organization Info Header */}
            <Grid container>
              <Grid item xs={8}>
                <Typography variant="h6">Organization Info</Typography>
              </Grid>

              {/* Edit Organization Button */}
              <Grid item xs={4} textAlign="right">
                <Button
                  variant="outlined"
                  startIcon={<BorderColorRoundedIcon />}
                  sx={{ textTransform: "none" }}
                  onClick={() => toggleModal("editOrg", true)}
                  disabled={user?.role === "Editor" || IsUseBrandSpecific}
                >
                  Edit
                </Button>
              </Grid>

              {/* Organization Details */}
              <Grid className="org-details" container paddingTop="12.5px">
                <Grid item xs={4}>
                  <Typography>Org ID</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>Name</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>Org Web Link</Typography>
                </Grid>

                {/* Actual Organization Values */}
                <Grid item xs={4}>
                  <Typography fontWeight="bold">{orgDetails?.orgID}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography fontWeight="bold">
                    {orgDetails?.orgName}
                  </Typography>
                </Grid>
                <Grid item xs={4} className="web-link-class">
                  <Typography fontWeight="bold">
                    {orgDetails?.webUrl}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={5} className="brand-details">
                  <Grid item xs={4}>
                    <Typography className="label">Languages:</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontWeight="bold" className="value">
                      {[...orgDetails?.orglang]?.sort()?.join(", ") ||
                        "No languages available"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>

          {/* Brand List Card */}
          <Card
            className="brand-list-card"
            sx={{ padding: "15px", marginBottom: "10px" }}
          >
            {/* Brand List Header */}
            <Grid container spacing={2}>
              <Grid item xs={8} sm={8}>
                <Typography variant="h6">Brand List Info</Typography>
              </Grid>

              {/* Add Brand Button */}
              <Grid
                item
                xs={4}
                sm={4}
                textAlign={{ xs: "center", sm: "right" }}
              >
                {user?.role === "Admin" && !IsUseBrandSpecific && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ textTransform: "none" }}
                    // onClick={() => toggleModal("addBrand", true)}
                    onClick={() => {
                      console.log("the total no of brands are", brands);
                      const activeBrands = brands.filter(
                        (brand) =>
                          brand.status.trim().toLowerCase() === "active"
                      );

                      if (activeBrands.length >= 3) {
                        showToast(
                          "Brand limit exceeded. You cannot add more than 3 active brands.",
                          "error"
                        );
                        trackActivity(
                          "ADD_BRAND",
                          "",
                          user,
                          user?.email,
                          user?.org_id,
                          null,
                          0,
                          null,
                          brands.map((b) => b._id),
                          [],
                          [],
                          " "
                        );
                      } else {
                        toggleModal("addBrand", true);
                      }
                    }}
                  >
                    Add
                  </Button>
                )}
              </Grid>
            </Grid>

            {/* Brand List Headers */}

            {/* Brand List Rendering */}
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : brands.length > 0 ? (
              brands
                .filter(
                  (brand) =>
                    (!IsUseBrandSpecific || brand.status === "active") &&
                    (user?.role !== "Editor" || brand.status === "active")
                )
                .map((brand) => (
                  <Grid
                    className="brand-list-headers"
                    container
                    sx={{ marginTop: "10px" }}
                  >
                    <Grid
                      container
                      key={brand.brand_id}
                      paddingTop="8px"
                      spacing={1}
                      sx={{
                        opacity: brand.status === "inactive" ? 0.5 : 1,
                        // pointerEvents:
                        //   brand.status === "inactive" ? "none" : "auto",
                        alignItems: "center",
                      }}
                    >
                      {/* Brand Details */}

                      <Grid item xs={12} sm={5} className="brand-details">
                        <Grid item xs={4}>
                          <Typography xs={4} className="label">
                            Name:
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            xs={4}
                            fontWeight="bold"
                            className="value"
                          >
                            {brand.name}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} sm={5} className="brand-details">
                        <Grid item xs={4}>
                          <Typography xs={4} className="label">
                            Brand Web Link:
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography
                            xs={4}
                            fontWeight="bold"
                            className="value"
                          >
                            {brand.website_url}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Brand Actions */}
                      <Grid
                        className="brand-actions"
                        item
                        xs={12}
                        sm={2}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: isMobile ? "10px" : "8px", // Add gap between buttons
                          flexDirection: isMobile ? "column" : "row", // Stack vertically on mobile
                        }}
                      >
                        {user?.role === "Admin" && !IsUseBrandSpecific && (
                          <>
                            {/* Show Enable button for inactive brands, Disable button for active brands */}
                            {brand.status === "inactive" ? (
                              <Button
                                variant="outlined"
                                startIcon={<PlayArrowIcon />}
                                sx={{
                                  textTransform: "none",
                                  width: isMobile ? "100%" : "auto",
                                  minWidth: "100px",
                                }}
                                onClick={() => {
                                  const noOfActiveBrands = brands.filter(
                                    (brand) =>
                                      brand?.status?.trim().toLowerCase() ===
                                      "active"
                                  );
                                  if (noOfActiveBrands.length >= 3) {
                                    showToast(
                                      "Limit of 3 brands reached. Remove or disable an existing brand to continue.",
                                      "error"
                                    );
                                  } else {
                                    toggleModal("enableBrand", true, brand);
                                  }
                                }}
                              >
                                Enable
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="outlined"
                                  startIcon={<PlayDisabledIcon />}
                                  sx={{
                                    textTransform: "none",
                                    width: isMobile ? "100%" : "auto",
                                    minWidth: "100px",
                                    borderColor: "#000000 ",
                                    color: "#000000",
                                  }}
                                  onClick={() =>
                                    toggleModal("disableBrand", true, brand)
                                  }
                                >
                                  Disable
                                </Button>
                                <Button
                                  variant="outlined"
                                  startIcon={<DeleteIcon />}
                                  sx={{
                                    textTransform: "none",
                                    width: isMobile ? "100%" : "auto",
                                    minWidth: "100px",
                                    borderColor: "#000000 ",
                                    color: "#000000",
                                  }}
                                  onClick={() =>
                                    toggleModal("deleteBrand", true, brand)
                                  }
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </>
                        )}
                        <Button
                          variant="outlined"
                          startIcon={<BorderColorRoundedIcon />}
                          sx={{
                            textTransform: "none",
                            width: isMobile ? "100%" : "auto", // Full width on mobile
                            minWidth: "100px",
                          }}
                          onClick={() => toggleModal("editBrand", true, brand)}
                          disabled={
                            brand.status === "inactive" ||
                            user?.role !== "Admin"
                          }
                        >
                          Edit
                        </Button>
                      </Grid>

                      <Grid item xs={12} sm={5} className="brand-details">
                        <Grid item xs={4}>
                          <Typography className="label">Languages:</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography fontWeight="bold" className="value">
                            {[...brand?.Languages]?.sort()?.join(", ") ||
                              "No languages available"}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* </Grid> */}
                  </Grid>
                ))
            ) : (
              <Typography>No Brands Found</Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Modals */}
      {/* Add Brand Modal */}
      {modalState.addBrand && (
        <AddBrandModal
          open={modalState.addBrand}
          onClose={() => toggleModal("addBrand", false)}
          user={user}
          onBrandAddition={loadBrands}
          activateSnackbar={activateSnackbar}
        />
      )}

      {/* Edit Brand Modal */}
      {modalState.editBrand && modalState.selectedBrand && (
        <EditBrandModal
          user={user}
          open={modalState.editBrand}
          onClose={() => toggleModal("editBrand", false)}
          brand={modalState.selectedBrand}
          onBrandUpdate={loadBrands}
          activateSnackbar={activateSnackbar}
        />
      )}

      {/* Edit Organization Modal */}
      {modalState.editOrg && (
        <EditOrgModal
          user={user}
          open={modalState.editOrg}
          orgDetails={orgDetails}
          onClose={() => toggleModal("editOrg", false)}
          activateSnackbar={activateSnackbar}
        />
      )}

      {/* Disable Brand Confirmation Modal */}
      {modalState.disableBrand && modalState.selectedBrand && (
        <DisabledBrandAcknowledgment
          brandName={modalState.selectedBrand.name}
          onDisableConfirmed={handleDisableBrand}
          onCancel={() => toggleModal("disableBrand", false)}
        />
      )}

      {/* Enable Brand Confirmation Modal */}
      {modalState.enableBrand && modalState.selectedBrand && (
        <DisabledBrandAcknowledgment
          brandName={modalState.selectedBrand.name}
          onDisableConfirmed={handleEnableBrand}
          onCancel={() => toggleModal("enableBrand", false)}
          title="Enable Brand?"
          confirmButtonText="Enable"
          isEnableAction={true}
        />
      )}

      {/* Delete Brand Confirmation Modal */}
      {modalState.deleteBrand && modalState.selectedBrand && (
        <DisabledBrandAcknowledgment
          brandName={modalState.selectedBrand.name}
          onDisableConfirmed={handleDeleteBrand}
          onCancel={() => toggleModal("deleteBrand", false)}
          title="Delete Brand?"
          message={`Are you sure you want to permanently delete the brand "${modalState.selectedBrand.name}"? This action cannot be undone and all associated data will be lost.`}
          confirmButtonText="Delete"
          confirmButtonColor="#f44336"
          isDeleteAction={true}
        />
      )}

      {/* Snackbar Notification */}
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={closeSnackbar}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Box>
  );
};

export default OrgSettings;

// Server-side rendering to get user session
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: {} };
  const user = session.user;

  if (user?.planCode?.startsWith("chgpt-enterprise"))
    return { props: { user } };
  else return { redirect: { destination: "/dashboard/home?redirectMessage=upgrade" } };
}
