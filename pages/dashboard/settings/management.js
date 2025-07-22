import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  TextField,
  CardContent,
  Card,
  IconButton,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios, { all } from "axios";
import { useSession, getSession } from "next-auth/react";
import UserMgmtTable from "../../../components/dashboard/user-management/UserMgmtTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SnackbarNotifier from "../../../components/helper/dashboard/snackbarNotifier";
import AddUserModal from "../../../components/dashboard/user-management/AddUserModal";
import UserInviteModal from "../../../components/dashboard/user-management/UserInviteModal";
import "../../../components/dashboard/user-management/user-mgmt-style.css";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { redirect } from "next/navigation";
import { GET_FETCH_USERS } from "../../../utils/apiEndpoints";
import { useWarning } from "../../../context/WarningContext";
import WarningBox from "../../../components/helper/WarningBox";

//custom hook
import { useUserBrands } from "../../../hooks/data/useUserBrands";

const UserManagement = ({ user }) => {
  const router = useRouter();
  const [userMgmtTableLoader, setUserMgmtTableLoader] = useState(true);
  const [userMgmtData, setActivityData] = useState([]);
  const userState = useSelector((state) => state?.user);
  const userProfileInfo = userState?.userInfo;
  let mgmtFlag =
    userState?.userPlan?.startsWith("chgpt-basic") ||
    userState?.userPlan?.startsWith("chgpt-free");

  const userBrandSpecific = userState?.userInfo?.brandSpecific;

  const [errDoctData, setErrDocData] = useState(null);
  const [openAddUserModal, setAddUserModal] = useState(false);
  const [allData, setAllData] = useState([]);
  const [showFilterCard, setShowFilterCard] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [disabledUsers, setDisabledUsers] = useState(0);
  const [orgName, setOrgName] = useState(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [filterValues, setFilterValues] = useState({
    name: "",
    startDate: "",
    endDate: "",
    status: "",
    role: "",
  });
  const { fetchUserBrands, isLoading, error } = useUserBrands();
  const [brands, setBrands] = useState([]);

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { showWarning } = useWarning();

  // Function & operation for inviting the user
  const handleOpenAddUserModal = () => setAddUserModal(true);
  const handleCloseAddUserModal = () => setAddUserModal(false);

  //function & operation for filtering, sorting, searching
  const handleOpenFilterCard = () => setShowFilterCard(!showFilterCard);

  function parseStartTime(dateTimeString) {
    // Assuming dateTimeString is in ISO 8601 format, parse it to extract the time
    const dateTime = new Date(dateTimeString);
    return dateTime.getTime(); // or any other logic to extract the start time
  }

  const handleStartDateChange = (e) => {
    const { value } = e.target;
    // Validate if selected start date is not greater than current date
    const currentDate = new Date().toISOString().slice(0, 10);
    if (value <= currentDate) {
      setFilterValues({ ...filterValues, startDate: value });
    } else {
      activateSnackbar("Cannot choose future dates", "error");
    }
  };

  const handleEndDateChange = (e) => {
    const { value } = e.target;
    // Validate if end date is greater than or equal to start date
    const currentDate = new Date().toISOString().slice(0, 10);
    if (value <= currentDate) {
      setFilterValues({ ...filterValues, endDate: value });
    } else {
      activateSnackbar("Cannot choose future dates", "error");
    }
  };

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setFilterValues({ ...filterValues, status: value });
  };
  const handleRoleChange = (e) => {
    const { value } = e.target;
    setFilterValues({ ...filterValues, role: value });
  };

  const handleApplyFilter = () => {
    // Filter data based on the filter values
    setErrDocData(null);
    if (filterValues.startDate > filterValues.endDate) {
      activateSnackbar("End date must not be smaller than start date", "error");
      return;
    }
    const filteredData = allData.filter((item) => {
      // Filter by name (if provided)
      if (
        filterValues.name &&
        !item?.name?.toLowerCase().includes(filterValues.name.toLowerCase())
      ) {
        return false;
      }

      if (filterValues.startDate) {
        if (!filterValues.endDate) {
          activateSnackbar("Provide the end date as well", "error");
        } else {
          const filterStartDate = new Date(filterValues.startDate);
          const itemStartDate = parseStartTime(item.createdOn); // Parse the activity start date

          const itemStartDateOnly = new Date(itemStartDate);
          itemStartDateOnly.setHours(0, 0, 0, 0);
          filterStartDate.setHours(0, 0, 0, 0);
          if (itemStartDateOnly < filterStartDate) return false;
        }
      }
      // Filter by end date (if provided)
      if (filterValues.endDate) {
        if (!filterValues.startDate) {
          activateSnackbar("Provide the start date as well", "error");
        } else {
          const filterEndDate = new Date(filterValues.endDate); // Parse the end date
          const itemEndDate = parseStartTime(item.createdOn); // Parse the activity end date
          const itemEndDateOnly = new Date(itemEndDate);
          itemEndDateOnly.setHours(0, 0, 0, 0);
          filterEndDate.setHours(0, 0, 0, 0);
          if (itemEndDateOnly > filterEndDate) {
            return false; // Item falls within the range
          }
        }
      }
      if (filterValues.role && !item?.role?.includes(filterValues.role)) {
        return false;
      }
      if (
        filterValues.status &&
        !item?.inviteStatus?.includes(filterValues.status)
      ) {
        return false;
      }
      return true; // Include the item if it passes all filters
    });

    // Update activityData state with the filtered data
    if (filteredData.length == 0) {
      setErrDocData("No data found for the applied filter");
    }
    setActivityData(filteredData);
    if (filterValues.startDate && filterValues.endDate) {
      setShowFilterCard(false);
    }
    setShowFilterCard(false);
  };

  const handleResetFilter = () => {
    getUserMgmtList();
    setShowFilterCard(false);
    setFilterValues({ name: "", startDate: "", endDate: "" });
  };

  const handleCancelFilter = () => {
    setShowFilterCard(false);
    setFilterValues({ name: "", startDate: "", endDate: "" });
  };

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const getUserMgmtList = async () => {
    try {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_FETCH_USERS,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );

      if (response?.status === 200) {
        if (response?.data?.length === 0) {
          setErrDocData("No Data found for the user!");
        } else {
          setActivityData(response?.data?.users);
          setAllData(response?.data?.users);
          setOrgName(response?.data?.organization_name);

          const totalActiveUsers = response?.data?.users.filter(
            (x) => x.inviteStatus && x.inviteStatus.toLowerCase() === "active"
          );
          const totalDisabledUsers = response?.data?.users.filter(
            (x) => x.inviteStatus && x.inviteStatus.toLowerCase() === "disabled"
          );

          setActiveUsers(totalActiveUsers.length);
          setTotalUsers(response?.data?.organizationTeamSize);
          setDisabledUsers(totalDisabledUsers.length);
          setErrDocData(null);
        }
      }
      if (response?.status === false) {
        setErrDocData(response?.data?.errorMessage);
      }
      setUserMgmtTableLoader(false);
    } catch (error) {
      setUserMgmtTableLoader(false);
      if (error?.response?.data === "Organization permissions revoked") {
        signOut();
      }
      activateSnackbar(
        "Network connection failed. Please refresh the page to reload the content",
        "error"
      );
    }
  };

  const updateOrgnization = () => {
    activateSnackbar(
      "Please enter your company name to access User Management.",
      "error"
    );
    setTimeout(() => {
      router.push({
        pathname: "/dashboard/profile",
      });
    }, 2000);
  };

  useEffect(() => {
    if (!user?.org_id) {
      updateOrgnization();
    } else {
      getUserMgmtList();
    }
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
  }, []);

  return (
    <Box className="mgmt-container">
      <Box sx={{ display: "grid" }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          fontSize="20px"
          marginTop="5px"
        >
          User Management
        </Typography>
        <Typography
          className="mgmt-pg-content"
          variant="subtitle2"
          color="#777777"
        >
          You can manage the profiles from here.
        </Typography>
        {showWarning && <WarningBox />}

        <Box
          className="mgmt-action-panel-right"
          sx={{
            transition: "opacity 0.3s ease",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "30px 0 10px 0",
          }}
        >
          <Box className="mgmt-left">
            <Typography
              sx={{ fontSize: { xs: "12px", sm: "16px" } }}
              fontWeight="500"
            >
              Active Profile: {activeUsers}/{totalUsers}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: "12px", sm: "16px" } }}
              fontWeight="500"
            >
              Disabled Profile: {disabledUsers}
            </Typography>
          </Box>
          <Box
            className="mgmt-right"
            sx={{
              display: "flex",
            }}
          >
            {/* filter panel component */}
            <Box sx={{ position: "relative" }}>
              <Button
                sx={{
                  marginRight: "3px",
                  textTransform: "capitalize",
                  padding: {
                    xs: "4px 4px",
                    sm: "5px 15px",
                  },
                }}
                variant="outlined"
                onClick={handleOpenFilterCard}
              >
                <FilterAltIcon />
                filter
              </Button>
              {showFilterCard && (
                <Card className="card-box">
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="h6">Filters</Typography>
                      <IconButton onClick={handleCancelFilter}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                    <Box className="name-box">
                      <Box style={{ marginTop: "16px" }}>Name</Box>
                      <TextField
                        label="Search by User"
                        value={filterValues.name}
                        onChange={(e) =>
                          setFilterValues({
                            ...filterValues,
                            name: e.target.value,
                          })
                        }
                        fullWidth
                      />
                    </Box>
                    <Box className="date-box">
                      <Box className="start-date-box">
                        <Box>Start Date</Box>
                        <TextField
                          type="date"
                          variant="outlined"
                          fullWidth
                          value={filterValues.startDate}
                          onChange={handleStartDateChange}
                        />
                      </Box>
                      <Box>
                        <Box>End Date</Box>
                        <TextField
                          type="date"
                          variant="outlined"
                          fullWidth
                          value={filterValues.endDate}
                          onChange={handleEndDateChange}
                        />
                      </Box>
                    </Box>
                    <Box className="status-box">
                      <Box>Status</Box>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Select Status
                          </InputLabel>
                          <Select
                            labelId="select-status-label"
                            id="select-status"
                            value={filterValues.status}
                            label="Select Status"
                            onChange={handleStatusChange}
                          >
                            <MenuItem value="">Select Status</MenuItem>
                            <MenuItem value="invited">Invited</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="disabled">Disabled</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box className="role-box">
                      <Box>Role</Box>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Select Role
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filterValues.role}
                            label="Select Role"
                            onChange={handleRoleChange}
                          >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Editor">Editor</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box
                      className="btn-filter"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box mt={2} display="flex">
                        <Button
                          variant="outlined"
                          onClick={handleResetFilter}
                          sx={{ borderRadius: "5px" }}
                        >
                          Reset
                        </Button>
                      </Box>
                      <Box mt={2} display="flex">
                        <Button
                          variant="contained"
                          onClick={handleApplyFilter}
                          sx={{ borderRadius: "5px" }}
                        >
                          Apply Filters
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>

            {/* modal for Invite user */}
            <Box>
              <Button
                className="doc-action-btn"
                sx={{
                  textTransform: "capitalize",
                  padding: {
                    xs: "4px 4px",
                    sm: "5px 15px",
                  },
                }}
                variant="contained"
                onClick={() => handleOpenAddUserModal()}
              >
                <AddIcon />
                Add new user
              </Button>
              {/* <AddUserModal
                orgName={orgName}
                maxTeamSize={totalUsers}
                totalUsers={allData.length}
                user={user}
                isOpen={openAddUserModal}
                onClose={handleCloseAddUserModal}
                onTableUpdate={getUserMgmtList}
              /> */}
              <UserInviteModal
                orgName={orgName}
                maxTeamSize={totalUsers}
                totalUsers={allData.length}
                user={user}
                isOpen={openAddUserModal}
                onClose={handleCloseAddUserModal}
                onTableUpdate={getUserMgmtList}
                brands={brands}
                userBrandSpecific={userBrandSpecific}
              />
            </Box>
          </Box>
        </Box>
        <Divider />
      </Box>

      {/* user mgmt Table component */}
      {userMgmtTableLoader ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            marginTop: "40px",
          }}
        >
          <CircularProgress size="3rem" />
        </Box>
      ) : (
        <UserMgmtTable
          userMgmtData={userMgmtData}
          onTableUpdate={getUserMgmtList}
          user={user}
          orgName={orgName}
          errDoctData={errDoctData}
          brands={brands}
        />
      )}

      {/* Error handling component */}
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Box>
  );
};

export default UserManagement;
export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const { user } = session;
  if (
    (user?.role === "Admin" &&
      !user?.planCode?.startsWith("chgpt-free") &&
      !user?.planCode?.startsWith("chgpt-basic")) ||
    (!user?.planCode?.startsWith("chgpt-free") &&
      !user?.planCode?.startsWith("chgpt-basic") &&
      !user?.org_id)
  ) {
    return {
      props: { user },
    };
  } else {
    return {
      redirect: {
        destination: "/dashboard/home?redirectMessage=upgradeManagement",
      },
    };
  }
}
