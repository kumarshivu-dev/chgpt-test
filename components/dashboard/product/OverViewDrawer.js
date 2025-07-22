import {
  Drawer,
  Box,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LinearProgress from "@mui/material/LinearProgress";
import { useSelector } from "react-redux";
import { CloseOutlined } from "@mui/icons-material";
import * as XLSX from "xlsx/xlsx";
import { DownloadExcel } from "../../../utils/excelUtils";
import trackActivity from "/components/helper/dashboard/trackActivity";
const OverViewDrawer = ({ toggleDrawer, isDrawerOpen, user }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  // redux state management
  // compliance store
  const complianceStore = useSelector((state) => state.compliance);
  const complianceData = complianceStore?.data;
  const mergedDataToExportData = complianceStore?.mergedDataToExport;

  const userState = useSelector((state) => state.user);
  const brandIds = userState?.brandIdList;

  // product readiness store
  const productReadinessStore = useSelector((state) => state.productReadiness);
  const productReadinessData = productReadinessStore?.data;

  // utils functions to generate compliance report
  const totalComplianceCount = complianceData?.length || 0;
  const compliantCount =
    complianceData?.filter(
      (item) =>
        item?.complianceResults?.compliant === true &&
        item?.brandVoiceResults?.brand_voice_compliant === true
    ).length || 0;
  const nonCompliantCount = totalComplianceCount - compliantCount;
  const averageCompliance =
    parseFloat(((compliantCount / totalComplianceCount) * 100)?.toFixed(2)) ||
    0;

  // utils functions to generate seo readiness report
  const totalReadinessCount = productReadinessData?.total_products || 0;
  const seoReadyCount = productReadinessData?.compliant_products || 0;
  const nonSeoReadyCount = totalReadinessCount - seoReadyCount;
  const averageSeoReadiness =
    parseFloat(productReadinessData?.readiness_percentage?.toFixed(2)) || 0;
  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paperAnchorRight": {
          width: 320,
          background: "#00102b",
          background: "white",
          right: 0,
          padding: 5,
        },
      }}
      anchor="right" // Set the anchor to "right"
      open={isDrawerOpen}
      onClose={() => toggleDrawer(false)}
    >
      {/* content for the drawer */}
      <Box
        sx={{
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: "700 !important" }}>
          Readiness Report
        </Typography>
        {isSmallScreen && (
          <CloseOutlined
            sx={{ cursor: "pointer", fontWeight: 700 }}
            onClick={() => toggleDrawer(false)}
          />
        )}
      </Box>

      <Grid className="compliant-products-readiness">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
            Average Products Compliant
          </Typography>
          <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
            {averageCompliance}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={averageCompliance}
          sx={{
            "& .MuiLinearProgress-bar": { backgroundColor: "#84D149" },
            padding: "2px 0",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            margin: "10px 0",
            backgroundColor: "#E5E7EB",
          }}
        />
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {/* {[0, 1, 2, 3].map((value) => {
      const labelId = `checkbox-list-label-${value}`;

      return ( */}
          <ListItem
            //   key={value}
            secondaryAction={
              <Typography
                sx={{ color: "#84D149" }}
                edge="end"
                aria-label="comments"
                size="small"
              >
                {compliantCount}
              </Typography>
            }
            sx={{ padding: 0 }}
            //   disablePadding
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 0,
                margin: "2px 0",
                cursor: "text",
              }}
            >
              <ListItemIcon sx={{ minWidth: "10px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "#84D149",
                    borderRadius: "8px",
                    marginRight: "5px",
                  }}
                ></div>
              </ListItemIcon>
              <ListItemText primary={"Compliant"} />
            </Box>
          </ListItem>
          {/* <ListItem
      //   key={value}
      secondaryAction={
        <Typography
          sx={{ color: "#FEC500" }}
          edge="end"
          aria-label="comments"
          size="small"
        >
          2
        </Typography>
      }
      disablePadding
    >
      <ListItemButton
        role={undefined}
        dense
        sx={{ padding: 0, margin: "2px 0" }}
      >
        <ListItemIcon sx={{ minWidth: "10px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              background: "#FEC500",
              borderRadius: "8px",
              marginRight: "5px",
            }}
          ></div>
        </ListItemIcon>
        <ListItemText primary={"Skipped"} />
      </ListItemButton>
    </ListItem> */}
          <ListItem
            //   key={value}
            secondaryAction={
              <Typography
                sx={{ color: "#F51A38" }}
                edge="end"
                aria-label="comments"
                size="small"
              >
                {nonCompliantCount}
              </Typography>
            }
            disablePadding
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 0,
                margin: "2px 0",
              }}
            >
              <ListItemIcon sx={{ minWidth: "10px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "#F51A38",
                    borderRadius: "8px",
                    marginRight: "5px",
                  }}
                ></div>
              </ListItemIcon>
              <ListItemText primary={"Not Compliant"} />
            </Box>
          </ListItem>
          <ListItem
            sx={{ borderTop: "2px solid #E5E7EB", marginTop: "20px" }}
            //   key={value}
            secondaryAction={
              <Typography edge="end" aria-label="comments" size="small">
                {totalComplianceCount}
              </Typography>
            }
            disablePadding
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 0,
                margin: "2px 0",
              }}
            >
              <ListItemIcon sx={{ minWidth: "10px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "#F51A38",
                    borderRadius: "8px",
                    marginRight: "5px",
                  }}
                ></div>
              </ListItemIcon>
              <ListItemText primary={"Total Products"} />
            </Box>
          </ListItem>
        </List>
      </Grid>

      <Grid className="compliant-products-readiness" sx={{ marginTop: "50px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
            Average Products SEO Ready
          </Typography>
          <Typography sx={{ fontSize: "14px", fontWeight: "600" }}>
            {averageSeoReadiness}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={averageSeoReadiness}
          sx={{
            "& .MuiLinearProgress-bar": { backgroundColor: "#84D149" },
            padding: "2px 0",
            borderRadius: "10px",
            margin: "10px 0",
            backgroundColor: "#E5E7EB",
          }}
        />
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {/* {[0, 1, 2, 3].map((value) => {
      const labelId = `checkbox-list-label-${value}`;

      return ( */}
          <ListItem
            //   key={value}
            secondaryAction={
              <Typography
                sx={{ color: "#84D149" }}
                edge="end"
                aria-label="comments"
                size="small"
              >
                {seoReadyCount}
              </Typography>
            }
            sx={{ padding: 0 }}
            //   disablePadding
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 0,
                margin: "2px 0",
              }}
            >
              <ListItemIcon sx={{ minWidth: "10px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "#84D149",
                    borderRadius: "8px",
                    marginRight: "5px",
                  }}
                ></div>
              </ListItemIcon>
              <ListItemText primary={"SEO Ready"} />
            </Box>
          </ListItem>
          {/* <ListItem
      //   key={value}
      secondaryAction={
        <Typography
          sx={{ color: "#FEC500" }}
          edge="end"
          aria-label="comments"
          size="small"
        >
          5
        </Typography>
      }
      disablePadding
    >
      <ListItemButton
        role={undefined}
        dense
        sx={{ padding: 0, margin: "2px 0" }}
      >
        <ListItemIcon sx={{ minWidth: "10px" }}>
          <div
            style={{
              width: "16px",
              height: "16px",
              background: "#FEC500",
              borderRadius: "8px",
              marginRight: "5px",
            }}
          ></div>
        </ListItemIcon>
        <ListItemText primary={"Needs Improvement"} />
      </ListItemButton>
    </ListItem> */}
          <ListItem
            //   key={value}
            secondaryAction={
              <Typography
                sx={{ color: "#F51A38" }}
                edge="end"
                aria-label="comments"
                size="small"
              >
                {nonSeoReadyCount}
              </Typography>
            }
            disablePadding
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 0,
                margin: "2px 0",
              }}
            >
              <ListItemIcon sx={{ minWidth: "10px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "#F51A38",
                    borderRadius: "8px",
                    marginRight: "5px",
                  }}
                ></div>
              </ListItemIcon>
              <ListItemText primary={"Not SEO Ready"} />
            </Box>
          </ListItem>
          <ListItem
            //   key={value}
            sx={{ borderTop: "2px solid #E5E7EB", marginTop: "20px" }}
            secondaryAction={
              <Typography
                sx={{ color: "" }}
                edge="end"
                aria-label="comments"
                size="small"
              >
                {totalReadinessCount}
              </Typography>
            }
            disablePadding
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 0,
                margin: "2px 0",
              }}
            >
              <ListItemIcon sx={{ minWidth: "10px" }}>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background: "#F51A38",
                    borderRadius: "8px",
                    marginRight: "5px",
                  }}
                ></div>
              </ListItemIcon>
              <ListItemText primary={"Total Products"} />
            </Box>
          </ListItem>
        </List>
      </Grid>
      <Grid sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={() => {
            trackActivity(
              "READINESS_REPORT_EXPORT", 
              "", 
              user, 
              "", 
              userState?.userInfo?.orgId, 
              null, 
              null, 
              null, 
              brandIds
            );
            DownloadExcel(mergedDataToExportData);
          }}
          sx={{ width: "100%" }}
          variant="contained"
        >
          Export file
        </Button>
      </Grid>
    </Drawer>
  );
};

export default OverViewDrawer;
