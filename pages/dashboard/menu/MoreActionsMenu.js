import React from "react";
import {
  MenuItem,
  ListItemIcon,
  Typography,
  Select,
} from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";

const MoreActionsMenu = ({
  selectedAction,
  handleMoreActionChange,
  handleMenuItemClick,
  newRow,
  exportDocData,
  isSelected,
  selectedProduct,
  complianceData,
  readinessData,
  limitReached,
}) => {
  return (
    <Select
      value={selectedAction}
      onChange={handleMoreActionChange}
      displayEmpty
      renderValue={(selected) => {
        if (!selected) {
          return <Typography>More Actions</Typography>;
        }
        return selected;
      }}
      sx={{
        textTransform: "capitalize",
        height: "37px",
      }}
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
        disabled={!newRow?.length || !exportDocData}
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
        disabled={!newRow?.length || !exportDocData}
      >
        <ListItemIcon>
          <SaveOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <Typography>Save</Typography>
      </MenuItem>
      {isSelected === "product" && (
        <>
          <MenuItem
            value="Compliance"
            onClick={() => handleMenuItemClick("compliance")}
            disabled={!selectedProduct.length || limitReached}
          >
            <ListItemIcon>
              <AnalyticsIcon />
            </ListItemIcon>
            <Typography>Compliance</Typography>
          </MenuItem>
          <MenuItem
            value="SEO Readiness"
            onClick={() => handleMenuItemClick("seo")}
            disabled={!selectedProduct.length || limitReached}
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
  );
};

export default MoreActionsMenu;
