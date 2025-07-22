import React, { useState } from "react";
import { Box, Button, Typography, Tooltip } from "@mui/material";
import SampleSwitch from "../utils-ui/sampleSwitch.js";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import OverViewDrawer from "../components/dashboard/product/OverViewDrawer.js";
import ComplianceModal from "../components/dashboard/product/ComplianceModal.js";
import { useSelector } from "react-redux";

const ProductOperations = ({
  isSelected,
  windowSize,
  isSampleData,
  setIsSampleData,
  handleOpenUploadModal,
  generateExcel,
  handleOpenSaveDialog,
  handleOpenDialog,
  checkCompliance,
  checkReadiness,
  handlePersonaUpload,
  selectedProduct,
  complianceData,
  readinessData,
  limitReached,
  overviewDrawerOpen,
  setOverviewDrawerOpen,
  user,
  newRow,
  exportDocData,
  isResultPage,
}) => {
  const userState = useSelector((state) => state.user);
  const userChosenLLM = userState?.userInfo?.chosen_llm;

  // react state management
  const [openComplianceModal, setOpenComplianceModal] = useState(false);
  return (
    <>
      <ComplianceModal
        open={openComplianceModal}
        onClose={() => setOpenComplianceModal(false)}
        checkCompliance={checkCompliance}
      />
      {(isSelected === "product" || isSelected === "image") &&
        windowSize > 1236 && (
          <Box
            sx={{
              marginBottom: "5px",
              display: "flex",
              justifyContent: "space-between",
              marginTop: "25px",
              marginLeft: "1px",
            }}
          >
            <Box>
              {!isResultPage && (
                <Box
                  className="table-sample-btnt io-btn"
                  variant="contained"
                  sx={{
                    border: isSampleData
                      ? "1px solid #022149"
                      : "1px solid #C6C6C6",
                    color: isSampleData ? "#022149" : "#474747",
                    padding: "5px 15px",
                    margin: "6px 6px 0 0",
                  }}
                >
                  <SampleSwitch
                    checked={isSampleData}
                    onChange={(e) => setIsSampleData(e.target.checked)}
                  />
                  <Typography
                    sx={{ color: isSampleData ? "#022149" : "#474747" }}
                  >
                    {isSampleData ? "Hide" : "Show"} Sample Data
                  </Typography>
                </Box>
              )}
              {/* Buttons */}
              {!isResultPage && (
                <Button
                  variant="outlined"
                  disableFocusRipple
                  onClick={handleOpenUploadModal}
                  sx={{ margin: "6px 6px 0 0" }}
                >
                  <FileDownloadOutlinedIcon />
                  <Typography sx={{ fontWeight: 500 }}>Import</Typography>
                </Button>
              )}
              <Button
                variant="outlined"
                disableFocusRipple
                onClick={generateExcel}
                sx={{ margin: "6px 6px 0 0" }}
              >
                <FileUploadOutlinedIcon />
                <Typography sx={{ fontWeight: 500 }}>Export</Typography>
              </Button>
              <Button
                variant="outlined"
                disableFocusRipple
                onClick={handleOpenSaveDialog}
                disabled={newRow?.length === 0 || exportDocData === 0}
                sx={{ margin: "6px 6px 0 0" }}
              >
                <SaveOutlinedIcon />
                <Typography sx={{ fontWeight: 500 }}> Save</Typography>
              </Button>
            </Box>
            {/* Operations Section */}
            {!isResultPage && (
              <Box className="op-section">
                <Button
                  variant="outlined"
                  onClick={handleOpenDialog}
                  disableFocusRipple
                  sx={{ margin: "6px 6px 0 0" }}
                >
                  <AddIcon />
                  New Row
                </Button>
                {isSelected === "product" && (
                  <>
                    <Tooltip
                      className="tooltipClass"
                      title={
                        !user.allowedFeatures?.includes("compliance")
                          ? "Upgrade your plan to Enterprise"
                          :  !["openai", "claude"].includes(userChosenLLM)
                          ? "Switch to OpenAI or Claude to use this feature."
                          : ""
                      }
                    >
                      <span>
                        <Button
                          variant="outlined"
                          disableFocusRipple
                          disabled={
                            !(selectedProduct.length > 0) ||
                            limitReached ||
                            !user.allowedFeatures?.includes("compliance") ||
                            !["openai", "claude"].includes(userChosenLLM)
                          }
                          // onClick={() => checkCompliance()}
                          onClick={() => setOpenComplianceModal(true)}
                          sx={{ margin: "6px 6px 0 0" }}
                        >
                          <PlayArrowIcon />
                          Compliance
                        </Button>
                      </span>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      disableFocusRipple
                      disabled={!(selectedProduct.length > 0) || limitReached}
                      onClick={() => checkReadiness()}
                      sx={{ margin: "6px 6px 0 0" }}
                    >
                      <PlayArrowIcon />
                      SEO Readiness
                    </Button>
                    <Button
                      variant="outlined"
                      disableFocusRipple
                      disabled={!complianceData && !readinessData}
                      onClick={() => setOverviewDrawerOpen(true)}
                      sx={{ margin: "6px 6px 0 0" }}
                    >
                      <DescriptionOutlined />
                      Readiness Report
                    </Button>
                  </>
                )}
                <OverViewDrawer
                  isDrawerOpen={overviewDrawerOpen}
                  toggleDrawer={setOverviewDrawerOpen}
                  user={user}
                />
                <Button
                  variant="contained"
                  disableFocusRipple
                  disabled={!(selectedProduct.length > 0) || limitReached}
                  sx={{
                    margin: "6px 6px 0 0",
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
                  }}
                  onClick={() => handlePersonaUpload()}
                >
                  <PlayArrowIcon />
                  Generate
                </Button>
              </Box>
            )}
          </Box>
        )}
    </>
  );
};

export default ProductOperations;
