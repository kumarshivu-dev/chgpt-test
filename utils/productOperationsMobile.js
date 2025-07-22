// utils-ui/ProductOperationsMobile.js
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import SampleSwitch from "../utils-ui/sampleSwitch.js";
import OverViewDrawer from "../components/dashboard/product/OverViewDrawer.js";
import { useSelector } from "react-redux";
import CustomToolTip from "../components/common-ui/CustomToolTip";

const ProductOperationsMobile = ({
  isSelected,
  windowSize,
  isSampleData,
  setIsSampleData,
  selectedProduct,
  limitReached,
  handlePersonaUpload,
  selectedAction,
  handleMoreActionChange,
  handleMenuItemClick,
  overviewDrawerOpen,
  setOverviewDrawerOpen,
  user,
  complianceData,
  readinessData,
  newRow,
  exportDocData,
}) => {
  const userState = useSelector((state) => state.user);
  const userChosenLLM = userState?.userInfo?.chosen_llm;

  if (!["product", "image"].includes(isSelected) || windowSize > 1236)
    return null;
  return (
    <Box
      spacing={2}
      sx={{ marginBottom: "5px", marginTop: "25px", marginLeft: "1px" }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          className="table-sample-btnt io-btn"
          variant="contained"
          sx={{
            border: isSampleData ? "1px solid #022149" : "1px solid #C6C6C6",
            color: isSampleData ? "#022149" : "#474747",
            padding: { xs: "5px 5px", sm: "5px 15px" },
          }}
        >
          <SampleSwitch
            checked={isSampleData}
            onChange={(e) => setIsSampleData(e.target.checked)}
          />
          <Typography
            sx={{
              fontSize: "14px",
              color: isSampleData ? "#022149" : "#474747",
              fontWeight: 500,
            }}
          >
            {isSampleData ? "Hide" : "Show"} Sample Data
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableFocusRipple
          disabled={!(selectedProduct.length > 0) || limitReached}
          sx={{
            "&.Mui-disabled": {
              background: "#777777 !important",
              borderColor: "#777777",
              color: "#C6C6C6",
            },
            "&:hover": {
              color: "#FCFCFC",
              backgroundColor: "#163058",
              borderColor: "#163058",
            },
            marginRight: "6px",
            textTransform: "none",
            borderRadius: "5px",
            backgroundColor: "#022149",
            borderColor: "#022149",
            color: "#FCFCFC",
            fontWeight: 500,
          }}
          onClick={handlePersonaUpload}
        >
          <PlayArrowIcon />
          Generate
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
          paddingTop: "10px",
          paddingRight: "5px",
        }}
      >
        <FormControl>
          <Select
            value={selectedAction}
            onChange={handleMoreActionChange}
            displayEmpty
            renderValue={(selected) => {
              if (!selected || selected.length === 0) {
                return <Typography>More Actions</Typography>;
              }
              return selected;
            }}
            sx={{ textTransform: "capitalize", height: "37px" }}
          >
            <MenuItem value="" disabled>
              <Typography>Select Action</Typography>
            </MenuItem>
            <MenuItem
              value="import"
              onClick={() => handleMenuItemClick("import")}
            >
              <ListItemIcon>
                <FileUploadOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <Typography>Import</Typography>
            </MenuItem>
            <MenuItem
              value="export"
              onClick={() => handleMenuItemClick("export")}
              disabled={newRow?.length === 0 || exportDocData === 0}
            >
              <ListItemIcon>
                <FileDownloadOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <Typography>Export</Typography>
            </MenuItem>
            <MenuItem
              value="newRow"
              onClick={() => handleMenuItemClick("newRow")}
            >
              <ListItemIcon>
                <AddIcon fontSize="small" />
              </ListItemIcon>
              <Typography>New Row</Typography>
            </MenuItem>
            <MenuItem
              value="save"
              onClick={() => handleMenuItemClick("save")}
              disabled={newRow?.length === 0 || exportDocData === 0}
            >
              <ListItemIcon>
                <SaveOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <Typography>Save</Typography>
            </MenuItem>
            {isSelected === "product" && (
              <>
                <CustomToolTip
                  title="Switch to OpenAI or Claude to use this feature.  "
                  disableHoverListener={["openai", "claude"].includes(userChosenLLM?.toLowerCase())}
                >
                  <MenuItem
                    value="Compliance"
                    onClick={() => handleMenuItemClick("compliance")}
                    disabled={
                      !(selectedProduct.length > 0) ||
                      limitReached ||
                      !["openai","claude"].includes(userChosenLLM)
                    }
                  >
                    <ListItemIcon>
                      <AnalyticsIcon />
                    </ListItemIcon>
                    <Typography>Compliance</Typography>
                  </MenuItem>
                </CustomToolTip>
                <MenuItem
                  value="SEO Readiness"
                  onClick={() => handleMenuItemClick("seo")}
                  disabled={!(selectedProduct.length > 0) || limitReached}
                >
                  <ListItemIcon>
                    <QueryStatsIcon />
                  </ListItemIcon>
                  <Typography>SEO Readiness</Typography>
                </MenuItem>
                <MenuItem
                  value="readiness report"
                  onClick={() => handleMenuItemClick("readiness report")}
                  disabled={!complianceData && !readinessData}
                >
                  <ListItemIcon>
                    <DescriptionOutlined />
                  </ListItemIcon>
                  <Typography>Readiness Report</Typography>
                </MenuItem>
              </>
            )}
          </Select>
        </FormControl>
        {overviewDrawerOpen && (
          <OverViewDrawer
            isDrawerOpen={overviewDrawerOpen}
            toggleDrawer={setOverviewDrawerOpen}
            user={user}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProductOperationsMobile;
