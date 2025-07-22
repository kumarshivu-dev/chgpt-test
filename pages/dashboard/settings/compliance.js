import { useCallback, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Checkbox,
  IconButton,
  Accordion,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useSession, getSession } from "next-auth/react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import Add from "@mui/icons-material/Add";
import AddFileModal from "../../../components/dashboard/compliance/AddFileModal";
import axios from "axios";
import SnackbarNotifier from "../../../components/helper/dashboard/snackbarNotifier";
import TargetComplianceModal from "../../../components/dashboard/compliance/TargetComplianceModal";
import DeleteFIleModal from "../../../components/dashboard/compliance/DeleteFileModal";
import ComplianceTable from "../../../components/dashboard/compliance/ComplianceTable";
import RagChunkingModal from "../../../components/dashboard/compliance/RagChunkingModal";
import { useSelector } from "react-redux";
import ResetModal from "../../../components/dashboard/compliance/ResetModal";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view";
import DownloadIcon from "@mui/icons-material/Download";
import {
  GET_COMPLIANCE_FILES,
  GET_SAMPLE_COMPLIANCE_FILES,
} from "../../../utils/apiEndpoints";
import SettingsIcon from "@mui/icons-material/Settings";
import { useWarning } from "../../../context/WarningContext";
import WarningBox from "../../../components/helper/WarningBox";
import { showToast, useToast } from "../../../context/ToastContext";
import UpgradeToast from "../../../utils-ui/UpgradeToast";

export const Compliance = ({ user }) => {
  const sampleData = [
    { name: "FDA guidelines for Medical Devices", uploaded: "15 Mar 2021" },
    { name: "FDA guidelines for Medical Devices", uploaded: "15 Mar 2021" },
    { name: "FDA guidelines for Medical Devices", uploaded: "15 Mar 2021" },
  ];
  const industryGuidelines = [
    {
      aws_file_name: "123",
      filename: "Health Claims FDA",
    },
  ];
  const { showToast } = useToast();
  const [taskId, setTaskId] = useState(null);
  const [progressData, setProgressData] = useState({
    progress: 0,
    state: "PENDING",
    error: null,
  });
  const [complianceFiles, setComplianceFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [sliderModalOpen, setSliderModalOpen] = useState(false);
  const [complianceSliderValue, setComplianceSliderValue] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ragChunkingModalOpen, setRagChunkingModalOpen] = useState(false);
  const [ragModel, setRagModel] = useState("SEMANTIC");
  const [ragModelBtn, setRagModelBtn] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [industryLevel, setIndustryLevel] = useState(true);
  const [sampleFiles, setSampleFiles] = useState([]);
  const [totalFilesInOrg, setTotalFilesInOrg] = useState(null);

  const userState = useSelector((state) => state.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;
  const { showWarning } = useWarning();
  const handleIndustryCheck = () => {
    setIndustryLevel(true);
  };

  const fetchComplianceFiles = () => {
    setSelected([]);
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + GET_COMPLIANCE_FILES, {
        headers: {
          Authorization: user?.id_token,
        },
      })
      .then((response) => {
        setTotalFilesInOrg(response?.data?.total_files_under_org);
        setComplianceFiles(response?.data?.files);
        setLoading(false);
      })
      .catch((error) => {
        setSnackbarState({
          open: true,
          message: error?.message,
          severity: "error",
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!taskId) return;
    const pollUploadFileTask = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/standalone/task_progress/${taskId}`,
          {
            headers: {
              Authorization: user?.id_token,
            },
          }
        );

        setProgressData({
          progress: response.data?.progress || 0,
          state: response.data?.state || "PENDING",
          error: response.data?.error?.message || null,
        });

        // Stop polling when task completes
        if (
          response?.data?.state === "SUCCESS" ||
          response?.data?.state === "FAILURE"
        ) {
          showToast("File uploaded successfully", "success");
          fetchComplianceFiles();
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error in polling:", error);
        setProgressData((prev) => ({ ...prev, error: error?.message }));
      }
    };

    const interval = setInterval(pollUploadFileTask, 100);
    return () => {
      clearInterval(interval);
    };
  }, [taskId]);

  useEffect(() => {
    retrieveSampleFiles();
  }, []);

  useEffect(() => {
    if (complianceFiles.length > 0) {
      setIndustryLevel(false);
    }
  }, [complianceFiles]);

  useEffect(() => {
    // Only run this effect when userState.userInfo is fully loaded and defined
    if (userState?.userInfo && Object.keys(userState.userInfo).length > 0) {
      // Now check for brandSpecification
      if (!userState.userInfo.brandSpecification) {
        showToast(<UpgradeToast />, "error");
        setLoading(false);
        return;
      }

      // Proceed with fetching compliance files since brandSpecification exists
      fetchComplianceFiles();

      // Handle ragModel state
      const { ragModel } = userState.userInfo;
      if (ragModel !== undefined) {
        setRagModel(ragModel);
        setRagModelBtn(false);
      } else {
        setRagModelBtn(true);
      }
    }
  }, [userState?.userInfo]);

  useEffect(() => {
    if (!taskId) return;
    const pollUploadFileTask = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/standalone/task_progress/${taskId}`,
          {
            headers: {
              Authorization: user?.id_token,
            },
          }
        );

        // Stop polling when task completes
        if (
          response?.data?.state === "SUCCESS" ||
          response?.data?.state === "FAILURE"
        ) {
          showToast("File uploaded successfully", "success");
          clearInterval(interval);
          fetchComplianceFiles();
        }
      } catch (error) {
        console.error("Error in polling:", error);
        clearInterval(interval);
        setProgressData((prev) => ({ ...prev, error: error?.message }));
      }
    };

    const interval = setInterval(pollUploadFileTask, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [taskId]);

  const handlefileuploadmodal = () => {
    if (!brandSpecification) {
      showToast(<UpgradeToast />, "error");
      return;
    }
    if (totalFilesInOrg >= 10) {
      activateSnackbar(
        "You can upload a maximum of 10 files in an organization. Please remove some files to continue",
        "error"
      );
      return;
    }
    setModalOpen(true);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.grey,
      fontSize: 16,
      paddingLeft: 6,
      paddingRight: 6,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: 6,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const handleCheck = (key) => {
    if (isSelected(key)) {
      setSelected(selected.filter((item) => item["aws_file_name"] !== key));
    } else {
      setSelected(
        selected.concat(
          complianceFiles.find((obj) => obj["aws_file_name"] === key)
        )
      );
    }
  };

  const handleOpenSliderModal = () => {
    setSliderModalOpen(true);
  };

  const handleCloseSliderModal = () => {
    setSliderModalOpen(false);
  };

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleResetModalClose = () => {
    setResetModalOpen(false);
  };

  const handleResetSplitter = () => {
    setResetModalOpen(true);
  };

  const handleRagChunkingModalOpen = () => {
    if (!brandSpecification) {
      showToast(<UpgradeToast />, "error");
      return;
    }
    setRagChunkingModalOpen(true);
  };

  const handleRagChunkingModalClose = () => {
    setRagChunkingModalOpen(false);
  };

  const handleCheckIndustryLevel = () => {
    if (complianceFiles.length > 0) {
      setSnackbarState({
        open: true,
        message: "Reset to use Industry Level",
        severity: "error",
      });
    } else {
      setIndustryLevel(true);
    }
  };

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const handleCheckAll = () => {
    if (selected.length === complianceFiles.length) {
      setSelected([]);
    } else {
      setSelected(complianceFiles);
    }
  };

  const isSelected = (key) =>
    selected.find((obj) => obj["aws_file_name"] === key) ? true : false;

  const [modalOpen, setModalOpen] = useState(false);
  const handleModalClose = () => setModalOpen(false);

  const CustomTreeItem = () => {
    return <TreeItem></TreeItem>;
  };

  const retrieveSampleFiles = () => {
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + GET_SAMPLE_COMPLIANCE_FILES, {
        headers: {
          Authorization: user?.id_token,
        },
      })
      .then((res) => {
        setSampleFiles(res?.data);
      });
  };

  const downloadSampleFile = (url) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.removeChild(link);
      });
  };

  return (
    <Box className="compliance-container">
      <Box sx={{ display: "grid", gridTemplateRows: "repeat(2, 1fr)" }}>
        <Typography variant="subtitle1" fontWeight="bold" fontSize="20px">
          Compliance
        </Typography>
        <Typography variant="subtitle2" color="#777777">
          Make sure your content is compliant with your internal and industry
          Policies, Rules and Regulations.
        </Typography>
      </Box>
      {showWarning && <WarningBox />}
      <Box className="compliance-buttons">
        <Box className="compliance-buttons-left">
          <Button
            className="btn"
            variant="contained"
            onClick={() => handlefileuploadmodal()}
            // disabled={ragModel.length === 0}
          >
            <Add />
            Add New File
          </Button>
          {/* <Button
            className="btn"
            variant="outlined"
            onClick={() => handleOpenSliderModal()}
          >
            <AssuredWorkloadIcon />
            Target Compliance
          </Button> */}
          <Button
            className="btn delete"
            variant="contained"
            color="error"
            sx={{
              visibility: selected.length > 0 ? "visible" : "hidden",
            }}
            onClick={() => handleOpenDeleteModal()}
          >
            <DeleteIcon />
            Delete
          </Button>
        </Box>
        <Box className="compliance-buttons-right">
          <Button
            variant="contained"
            // disabled={
            //   complianceFiles.length !== 0 &&
            //   (!ragModelBtn || ragModel.length !== 0)
            // }
            onClick={handleRagChunkingModalOpen}
          >
            <SettingsIcon sx={{ marginRight: "5px" }} /> Configuration
          </Button>

          {/* <Button
            variant="outlined"
            disabled={ragModel.length === 0 || complianceFiles.length === 0}
            onClick={handleResetSplitter}
          >
            Reset
          </Button> */}
          {/* {ragChunkingModalOpen && (<RagChunkingModal />)} */}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Box
          sx={{
            flex: "0 0 30%",
            minWidth: 200,
          }}
        >
          <SimpleTreeView>
            <TreeItem
              itemId="sample-files"
              label={
                <Typography sx={{ fontWeight: "bold" }}>
                  Sample Files
                </Typography>
              }
            >
              {sampleFiles.map((file, index) => (
                <TreeItem
                  itemId={index}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {file.file_name}
                      </Typography>
                      <a href={file.download_url} target="_blank">
                        <IconButton>
                          <DownloadIcon />
                        </IconButton>
                      </a>
                    </Box>
                  }
                />
              ))}
            </TreeItem>
          </SimpleTreeView>
        </Box>

        {!loading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginLeft: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Number of Files Uploaded:
            </Typography>
            <Typography sx={{ marginLeft: 1 }}>
              {complianceFiles.length}
            </Typography>
          </Box>
        )}
      </Box>

      {modalOpen && (
        <AddFileModal
          isOpen={modalOpen}
          onClose={handleModalClose}
          handleClose={handleModalClose}
          user={user}
          complianceFiles={complianceFiles}
          fetchComplianceFiles={fetchComplianceFiles}
          snackbarState={snackbarState}
          setSnackbarState={setSnackbarState}
          ragModel={ragModel}
          setTaskId={(taskId) => setTaskId(taskId)}
        />
      )}
      {deleteModalOpen && (
        <DeleteFIleModal
          isOpen={deleteModalOpen}
          onClose={handleDeleteModalClose}
          user={user}
          setSnackbarState={setSnackbarState}
          selected={selected}
          setSelected={setSelected}
          fetchComplianceFiles={fetchComplianceFiles}
        />
      )}
      {sliderModalOpen && (
        <TargetComplianceModal
          isOpen={sliderModalOpen}
          onClose={handleCloseSliderModal}
          complianceSliderValue={complianceSliderValue}
          setComplianceSliderValue={setComplianceSliderValue}
        />
      )}
      {ragChunkingModalOpen && (
        <RagChunkingModal
          isOpen={ragChunkingModalOpen}
          onClose={handleRagChunkingModalClose}
          user={user}
          setSnackbarState={setSnackbarState}
          fetchComplianceFiles={fetchComplianceFiles}
        />
      )}
      {resetModalOpen && (
        <ResetModal
          isOpen={resetModalOpen}
          onClose={handleResetModalClose}
          user={user}
          setSnackbarState={setSnackbarState}
          ragModel={ragModel}
          setRagModel={setRagModel}
          setRagModelBtn={setRagModelBtn}
          setRagChunkingModalOpen={setRagChunkingModalOpen}
          fetchComplianceFiles={fetchComplianceFiles}
        />
      )}
      {loading && <CircularProgress className="loader" />}
      <Box sx={{ mt: 2 }}>
        {!loading && (
          <>
            <ComplianceTable
              complianceData={complianceFiles}
              selectedFiles={selected}
              setSelectedFiles={setSelected}
              industryLevel={false}
            />
          </>
        )}

        {!loading && complianceFiles.length === 0 && (
          <Typography className="no-files-msg">No files found</Typography>
        )}
      </Box>
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Box>
  );
};

export default Compliance;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const user = session.user;
  if (user?.role !== "Admin") {
    return {
      redirect: {
        destination: "/dashboard/home",
      },
    };
  } else if (user?.planCode?.startsWith("chgpt-enterprise")) {
    return {
      props: { user },
    };
  } else {
    return {
      redirect: {
        destination: "/dashboard/home?redirectMessage=upgrade",
      },
    };
  }
}
