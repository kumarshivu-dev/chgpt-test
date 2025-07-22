import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  CardContent,
  Card,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import ActivityTable from "../../components/dashboard/activity/ActivityTable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SnackbarNotifier from "../../components/helper/dashboard/snackbarNotifier";
import { POST_CHECK_USER_ACTIVITIES } from "../../utils/apiEndpoints";
import { useWarning } from "../../context/WarningContext";
import WarningBox from "../../components/helper/WarningBox";
import { useToast } from "../../context/ToastContext";
import { excelExport } from "../../components/helper/dashboard/productHelper";
import trackActivity from "../../components/helper/dashboard/trackActivity.js";
import { ACTIVITY_DESCRIPTIONS } from "../../constants/texts.js";

const Activity = ({ user }) => {
  const userState = useSelector((state) => state.user);
  const [activityTableLoader, setActivityTableLoader] = useState(true);
  const [activityData, setActivityData] = useState([]);
  const [errDoctData, setErrDocData] = useState(null);
  const [showFilterCard, setShowFilterCard] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const { showToast } = useToast();

  const [filterValues, setFilterValues] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const description = user?.role === "Editor"
  ? ACTIVITY_DESCRIPTIONS.EDITOR
  : ACTIVITY_DESCRIPTIONS.DEFAULT;

  const { showWarning } = useWarning();

  const handleOpenFilterCard = () => {
    setShowFilterCard(true);
  };

  // Utility function to parse and normalize date strings
  const parseAndNormalizeDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  // Validate date range
  const isValidDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return true;
    if (startDate && !endDate) return false;
    if (!startDate && endDate) return false;

    return new Date(startDate) <= new Date(endDate);
  };

  const handleApplyFilter = async () => {
    if (filterValues?.startDate) {
      if (!filterValues.endDate) {
        showToast("Please provide end date as well ", "error");
      }
    }
    if (filterValues?.endDate) {
      if (!filterValues.startDate) {
        showToast("Please provide start date as well ", "error");
      }
    }

    if (!isValidDateRange(filterValues?.startDate, filterValues?.endDate)) {
      showToast("End date must be greater than start date", "error");

      return;
    }
    await getActivityList(filterValues);
    setShowFilterCard(false);
  };

  const handleResetFilter = async () => {
    setFilterValues({ name: "", startDate: "", endDate: "" });
    await getActivityList();
    setPageNumber(1);
    setShowFilterCard(false);
  };

  const handleCancelFilter = async () => {
    setFilterValues({ name: "", startDate: "", endDate: "" });
    await getActivityList();
    setPageNumber(1);
    setShowFilterCard(false);
  };

  const handleStartDateChange = (e) => {
    const { value } = e.target;
    // Validate if selected start date is not greater than current date
    const currentDate = new Date().toISOString().slice(0, 10);
    if (value <= currentDate) {
      setFilterValues({ ...filterValues, startDate: value });
    } else {
      showToast("Cannot choose future dates", "error");
    }
  };

  const handleEndDateChange = (e) => {
    const { value } = e.target;
    // Validate if end date is greater than or equal to start date
    const currentDate = new Date().toISOString().slice(0, 10);
    if (value <= currentDate) {
      setFilterValues({ ...filterValues, endDate: value });
    } else {
      showToast("Cannot choose future dates", "error");
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPageNumber(1); // Reset page number to 1 when page size changes
  };

  const getActivityList = async (requestValues) => {
    setActivityTableLoader(true);
    const data = {
      username: requestValues?.name?.trim() || "",
      start_date: requestValues?.startDate
        ? parseAndNormalizeDate(requestValues.startDate)
        : "",
      end_date: requestValues?.endDate
        ? parseAndNormalizeDate(requestValues.endDate)
        : "",
      operation: [],
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_CHECK_USER_ACTIVITIES,
        data,
        {
          params: {
            pageSize: pageSize,
            pageNumber: pageNumber,
          },
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      if (response?.data?.status === true) {
        setActivityData(response?.data?.userActivityAttrsList);
        if (response?.data?.userActivityAttrsList.length === 0) {
          setErrDocData("No activity found for the user!");
        } else {
          setTotalRows(response?.data?.totalCount);
          setErrDocData(null);
        }
      }
      if (response?.status === false) {
        setErrDocData(response?.data?.errorMessage);
      }
      setActivityTableLoader(false);
    } catch (error) {
      setActivityTableLoader(false);
      console.error("Error while retrieving activity list", error);
      // showToast(
      //   "Network connection failed. Please refresh the page to reload the content",
      //   "error"
      // );
    }
  };

  const exportAllActivities = async (requestValues) => {
    try {
      let allActivities = [];
      let currentPage = 1;
      const PAGE_SIZE = 100;
      let hasMoreData = true;

      // Prepare request data
      const data = {
        username: requestValues?.name?.trim() || "",
        start_date: requestValues?.startDate
          ? parseAndNormalizeDate(requestValues.startDate)
          : "",
        end_date: requestValues?.endDate
          ? parseAndNormalizeDate(requestValues.endDate)
          : "",
        operation: [],
      };

      // Fetch all pages
      while (hasMoreData) {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
            POST_CHECK_USER_ACTIVITIES,
          data,
          {
            params: {
              pageSize: PAGE_SIZE,
              pageNumber: currentPage,
            },
            headers: {
              Authorization: user.id_token,
            },
          }
        );

        if (response?.data?.status === true) {
          const activities = response?.data?.userActivityAttrsList;

          if (activities && activities.length > 0) {
            allActivities = [...allActivities, ...activities];
            currentPage++;
          } else {
            hasMoreData = false;
          }
        } else {
          throw new Error(
            response?.data?.errorMessage || "Failed to fetch activities"
          );
        }
      }

      // Generate Excel file if we have data
      if (allActivities.length > 0) {
        const exportData = allActivities.map((activity) => {
          const {
            id,
            action,
            endingTime,
            startingTime,
            user_id,
            filename,
            ...rest
          } = activity;
          return rest;
        });

        // Using Excel export function
        excelExport(exportData, "Activities", null);

        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${(
          "0" +
          (currentDate.getMonth() + 1)
        ).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}`;

        const fileName = `Activities-${formattedDate}-ContentHubGPT.xlsx`;

        trackActivity(
          "EXPORT",
          fileName,
          user,
          "",
          userState?.userInfo?.orgId,
          null,
          null,
          null,
          null
        );

        showToast(
          `Successfully exported ${allActivities.length} activities`,
          "success"
        );
      } else {
        showToast("No activities found to export", "warning");
      }
    } catch (error) {
      console.error("Error while exporting activities:", error);
      showToast(
        "Failed to export activities. Please try again later.",
        "error"
      );
    }
  };

  useEffect(() => {
    getActivityList(filterValues);
  }, [pageSize, pageNumber]);

  // console.log('filter values', filterValues)
  return (
    <Box className="activity-container">
      <Box sx={{ display: "grid" }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          fontSize="20px"
          marginTop="5px"
        >
          Activity
        </Typography>
        <Typography
          className="activity-pg-content"
          variant="subtitle2"
          color="#777777"
        >
          {description}
        </Typography>
        {showWarning && <WarningBox />}
        <Box className="activiy-action-panel">
          <Box
            className="doc-action-panel-right"
            sx={{
              transition: "opacity 0.3s ease",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Box className="action-btn-share" sx={{ position: "relative" }}>
              <Button
                variant="outlined"
                disableFocusRipple
                onClick={() => exportAllActivities(filterValues)}
                sx={{ margin: "6px 6px 0 0" }}
              >
                <FileUploadOutlinedIcon />
                <Typography sx={{ fontWeight: 500 }}>Export</Typography>
              </Button>
              <Button
                sx={{ margin: "6px 6px 0 0" }}
                variant="contained"
                onClick={handleOpenFilterCard}
              >
                <FilterAltIcon />
                <Typography sx={{ fontWeight: 500 }}>Filter</Typography>
              </Button>
              {showFilterCard && (
                <Card className="card-component">
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
                    <Box className="name-component">
                      <Box style={{ marginTop: "16px" }}>Name</Box>
                      <TextField
                        label="Search by user name"
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
                    <Box className="date-component">
                      <Box className="start-date-comp">
                        <Box>Start Date</Box>
                        <TextField
                          type="date"
                          variant="outlined"
                          fullWidth
                          value={filterValues.startDate} // Ensure the value is controlled
                          // onChange={(e) => setFilterValues({ ...filterValues, startDate: e.target.value })} // Update startDate in state
                          // You can handle onChange event to update start date filter state
                          onChange={handleStartDateChange}
                        />
                      </Box>
                      <Box>
                        <Box>End Date</Box>
                        <TextField
                          type="date"
                          variant="outlined"
                          fullWidth
                          value={filterValues.endDate} // Ensure the value is controlled
                          // onChange={(e) => setFilterValues({ ...filterValues, endDate: e.target.value })} // Update startDate in state
                          onChange={handleEndDateChange}
                          // You can handle onChange event to update end date filter state
                        />
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
          </Box>
          <Box className="activiy-action-panel-left">
            <Button
              className="activiy-action-left-btn"
              variant="text"
              sx={{
                textTransform: "capitalize",
                borderRadius: "0px",
                color: "#022149",
                marginBottom: "-5px",
                borderBottom: "5px solid #022149",
                fontWeight: "bold",
              }}
            >
              All
            </Button>
          </Box>
        </Box>
        <Divider />
      </Box>

      {/* Document Table compoent */}
      {activityTableLoader ? (
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
        <ActivityTable
          activityData={activityData}
          // onTableUpdate={getActivityList}
          // onTableUpdate={handleTableUpdate}
          user={user}
          errDoctData={errDoctData}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalRows={totalRows}
          onPageNumberChange={setPageNumber}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </Box>
  );
};

export default Activity;
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
