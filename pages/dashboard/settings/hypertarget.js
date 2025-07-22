import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddPersonaModal from "../../../components/dashboard/hypertarget/AddPersonaModal";
import DeleteAcknowledgmentPersona from "../../../components/dashboard/hypertarget/DeleteAcknowledgment";
import HypertargetTable from "../../../components/dashboard/hypertarget/HypertargetTable";
import { tourStepsConfig } from "../../../components/dashboard/product/OnboardingTourSteps";
import TourComponent from "../../../components/dashboard/product/TourComponent";
import SnackbarNotifier from "../../../components/helper/dashboard/snackbarNotifier";
import { getCookie, setCookie } from "../../../utils/cookies";
import { useWarning } from "../../../context/WarningContext";
import WarningBox from "../../../components/helper/WarningBox";
import { GET_PERSONA_LIST } from "../../../utils/apiEndpoints";
import { ImportExport } from "@mui/icons-material";
import ImportPersonaDialog from "../../../components/dashboard/hypertarget/ImportPersonaDialog";
import { showToast } from "/context/ToastContext";
import Link from "next/link";
import useInstanceState from "../../../hooks/data/useInstanceState";
import UpgradeToast from "../../../utils-ui/UpgradeToast";
import { useRouter } from "next/router";
import { setSelectedPersona } from "../../../store/dashboard/documentTableSlice";
export const hypertarget = ({ user }) => {
  const dispatch = useDispatch();
  const [personaData, setPersonaData] = useState([]);
  const [hyperTableLoader, setHyperTableLoader] = useState(true);
  const [errorPersonaData, setErrorPersonaData] = useState(null);
  const [openAddPersonaModal, setOpenAddPersonaModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(true);
  const [isFreshUser, setIsFreshUser] = useState(null);

  const documentState = useSelector((state) => state.documentTable);
  const selectedPersona = documentState?.selectedPersona;

  const [isTourStarted, setIsTourStarted] = useState(false);
  const [steps, setSteps] = useState([]);

  //Getting the global redux values of user
  const userState = useSelector((state) => state?.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;
  const chosenllm = userState?.userChosenLLM;
  const { Cloudresponse } = useInstanceState(user);
  const [cloudData, setCloudData] = useState(null);
  // const [orgPersonaData,setOrgPersonaData] = useState([])
  const router = useRouter();

  // const personaState = useSelector((state) => state?.hyperTargetTable);
  // const selectedPersona = personaState?.selectedPersona;
  const [isImportPersonaDialogOpen, setIsImportPersonaDialogOpen] =
    useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  const { showWarning } = useWarning();

  useEffect(() => {
    if (Cloudresponse) {
      setCloudData(Cloudresponse);
    }
  }, [Cloudresponse]);

  const handleCreatePersona = () => {
    if (
      !["openai", "claude"].includes(chosenllm)&&
      ["TERMINATED", "PENDING", "STOPPED"].includes(cloudData?.instance_state)
    ) {
      showToast(
        <>
          <Typography variant="body1">
            No LLM is selected. Please choose any LLM from
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push("/dashboard/settings/environmentSettings?tab=more");
              }}
              underline="hover"
              color="primary"
            >
              Environment settings to continue....
            </Link>
          </Typography>
        </>,
        "error", // Severity
        10000 // Duration (10 seconds)
      );
      return;
    }
    setOpenAddPersonaModal(true);
  };
  const handleClosePersona = () => {
    setOpenAddPersonaModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirmed = async () => {
    await handleBulkDelete();
    setShowDeleteConfirmation(false);
  };
  const handleBulkDelete = async () => {
    try {
      const idArray = selectedPersona.map((persona) => persona?.id);
      const personaNames = selectedPersona.map((persona) => persona?.persona);
      const DemographicDeleteRequest = {
        ids: idArray,
        personaNames: personaNames,
      };
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}/dashboard/hypertarget/delete/persona`,
        DemographicDeleteRequest,
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      );
      if (response?.data?.status === true) {
        getPersonaList();
        const updatedPersona = selectedPersona.filter(
          (persona) => persona?.persona === "Default"
        );
        dispatch(setSelectedPersona(updatedPersona));
        activateSnackbar("Persona deleted successfully.", "success");
      } else {
        activateSnackbar(
          response?.data?.errorMessage || "Failed to delete persona.",
          "error"
        );
      }
    } catch (error) {
      activateSnackbar(
        "Error while deleting persona. Please try again.",
        "error"
      );
    } finally {
      setShowDeleteConfirmation(false); // Close the DeleteAcknowledgment dialog
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  // we will get the persona name , keywprds and description through api from backend.
  const getPersonaList = async () => {
    const brandId = brandSpecification?.brandId;

    if (brandSpecification) {
      let url = process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + GET_PERSONA_LIST;
      if (brandSpecification?.brandSpecific) {
        url += `?brandId=${brandId}`;
      }

      try {
        const response = await axios.get(
          // process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
          //   "/dashboard/hypertarget/list/personas",
          url,
          {
            headers: {
              Authorization: user?.id_token,
            },
          }
        );
        // console.log('the response from fetch hypertarget', response)
        if (response?.data?.status === true) {
          setPersonaData(response?.data?.personasAttrsList);
          setErrorPersonaData(null);
        } else {
          setErrorPersonaData(response?.data);
        }
        setHyperTableLoader(false);
      } catch (error) {
        activateSnackbar(
          "Error while retrieving persona list. Please try again later.",
          "error"
        );
      }
    } else {
      // Handle case where brandSpecification is falsy if needed
      showToast(<UpgradeToast />, "error");
      return;
    }
  };

  useEffect(() => {
    // Only run this effect when userState.userInfo is fully loaded and defined
    if (userState?.userInfo && Object.keys(userState.userInfo).length > 0) {
      // Now check for brandSpecification
      if (!userState.userInfo.brandSpecification) {
        console.log("No brand specification found");
        showToast(<UpgradeToast />, "error");
        return;
      }
      getPersonaList();
    }
  }, [userState?.userInfo]);
  useEffect(() => {
    setIsFreshUser(getCookie("isFreshUser"));
    // getOrgPersonas()
  }, []);

  const handleSkipTour = () => {
    setCookie("isFreshUser", false);
    setCookie("isTour", false);
    setShowOnboardModal(false);
    setIsTourStarted(false);
  };


  // const getOrgPersonas = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${GET_PERSONA_LIST}`,
  //         {
  //           headers: {
  //             Authorization: user?.id_token,
  //           },
  //         }
  //       );
  //       const responseData = response?.data?.personasAttrsList || [];
  //       console.log('org persona wala data',responseData);
  //       setOrgPersonaData(responseData);
  //     } catch (err) {
  //       showToast("Error fetching personas", "error");
  //     }
  // };



  const smallScreen = useMediaQuery("(max-width: 768px)");
  useEffect(() => {
    const freshUserCookie = getCookie("isFreshUser");
    setIsFreshUser(freshUserCookie);
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";
    const tourSteps =
      getCookie("isTour") === "true"
        ? tourStepsConfig[currentPath]
          ? smallScreen
            ? tourStepsConfig[currentPath].mobile
            : tourStepsConfig[currentPath].desktop
          : []
        : [];
    setSteps(tourSteps);
  }, [smallScreen]);

  return (
    <>
      {isImportPersonaDialogOpen && (
        <ImportPersonaDialog
          open={isImportPersonaDialogOpen}
          onClose={() => setIsImportPersonaDialogOpen(false)}
          personaData={personaData}
          setPersonaData={setPersonaData}
          getPersonaList={getPersonaList}
          user={user}
          setHyperTableLoader={setHyperTableLoader}
        />
      )}
      <Box className="hyper-container">
        {/* Existing User Onboarding tour */}
        {(isTourStarted === "true" ||
          (getCookie("isTour") === "true" && isFreshUser === "false")) && (
          <TourComponent
            steps={steps}
            handleClose={() => setIsTourStarted(false)}
            handleSkipTour={handleSkipTour}
          />
        )}

        <Box sx={{ display: "grid", gridTemplateRows: "repeat(2, 1fr)" }}>
          <Typography variant="subtitle1" fontWeight="bold" fontSize="20px">
            Hypertargeting
          </Typography>
          <Typography variant="subtitle2" color="#777777">
            Manage your target personas for tailored content generation.
          </Typography>
          {showWarning && <WarningBox />}
          <Box
            className="document-action-panel"
            sx={{ display: "flex", gap: "10px" }}
          >
            <Box className="doc-action-left-btn">
              <Button
                variant="contained"
                onClick={handleCreatePersona}
                sx={{
                  borderRadius: "5px",
                }}
              >
                <AddIcon />
                <Typography sx={{ textTransform: "capitalize" }} variant="text">
                  Create New persona
                </Typography>
              </Button>
              <AddPersonaModal
                isOpen={openAddPersonaModal}
                onClose={() => handleClosePersona()}
                user={user}
                onTableUpdate={() => getPersonaList()}
                personaData={personaData}
                // orgPersonaData={orgPersonaData}
              />
            </Box>
            {brandSpecification?.brandSpecific && (
              <Box className="doc-action-left-btn">
                <Button
                  variant="outlined"
                  onClick={() => setIsImportPersonaDialogOpen(true)}
                  sx={{
                    borderRadius: "5px",
                  }}
                >
                  <ImportExport />
                  <Typography
                    sx={{ textTransform: "capitalize" }}
                    variant="text"
                  >
                    Import Persona
                  </Typography>
                </Button>
              </Box>
            )}
            {selectedPersona.length > 1 && (
              <Box className="action-btn-del">
                <Button
                  sx={{
                    transition: "opacity 0.3s ease",
                  }}
                  variant="outlined"
                  onClick={() => handleDeleteClick()}
                >
                  <DeleteIcon />
                  Delete
                </Button>
                {showDeleteConfirmation && (
                  <DeleteAcknowledgmentPersona
                    onDeleteConfirmed={handleDeleteConfirmed}
                    onCancel={handleDeleteCancel}
                  />
                )}
              </Box>
            )}
          </Box>
        </Box>

        {hyperTableLoader ? (
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
          <HypertargetTable
            personaData={personaData}
            user={user}
            errorPersonaData={errorPersonaData}
            onTableUpdate={() => getPersonaList()}
          />
        )}

        <SnackbarNotifier
          open={snackbarState.open}
          onClose={() => setSnackbarState({ ...snackbarState, open: false })}
          message={snackbarState.message}
          severity={snackbarState.severity}
        />
      </Box>
    </>
  );
};

export default hypertarget;

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
  } else if (user?.allowedFeatures?.includes("hypertarget")) {
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
