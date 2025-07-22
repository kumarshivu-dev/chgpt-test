// libs
// utils and helpers
// hooks
// components
// constants
import { useEffect, useState, memo } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import axios from "axios";
import DocumentTable from "../../components/dashboard/document/DocumentTable";
import UploadDocModal from "../../components/dashboard/document/UploadDocModal";
import DeleteAcknowledgment from "../../components/dashboard/document/DeleteAcknowledgment";
import ShareDocModal from "../../components/dashboard/document/shareDocModal";
import { useSession, getSession, signOut } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedDocuments } from "../../store/dashboard/documentTableSlice";
import SnackbarNotifier from "../../components/helper/dashboard/snackbarNotifier";
import {
  GET_FAVOURITE_LIST,
  GET_DOCUMENTS_LIST_V2,
  POST_DELETE_DOCUMENT,
  POST_STAR_DOCUMENT,
} from "../../utils/apiEndpoints";
import { useWarning } from "../../context/WarningContext";
import WarningBox from "../../components/helper/WarningBox";
import { useToast } from "../../context/ToastContext";

const documents = memo(({ user }) => {
  const dispatch = useDispatch();
  const documentState = useSelector((state) => state.documentTable);
  const selectedDocuments = documentState?.selectedDocuments;
  const [isAllSelected, setIsAllSelected] = useState(true);
  const [documentData, setDocumentData] = useState([]);
  const [docTableLoader, setDocTableLoader] = useState(true);
  const [errorDocumentData, setErrorDocumentData] = useState(null);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [fileNameList, setFileNameList] = useState([]);
  const [isFavListEmpty, setIsFavListEmpty] = useState(false);

  const [orderedUserIds, setOrderedUserIds] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isAllFav, setIsAllFav] = useState(false);
  const [isAllUserSame, setIsAllUserSame] = useState(false);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { showWarning } = useWarning();

  const { showToast } = useToast();

  const handleOpenUploadModal = () => setOpenUploadModal(true);
  const handleOpenShareModal = () => {
    if (fileNameList.length == 0) {
      activateSnackbar("Please Select a file to share", "error");
    } else {
      setOpenShareModal(true);
    }
  };

  const handleCloseUploadModal = () => setOpenUploadModal(false);
  const handleCloseShareModal = () => setOpenShareModal(false);

  // Fetches the list of documents from the server based on the isFavourite parameter.
  const getDocumentList = async (isFavourite) => {
  let endpoint = isFavourite ? GET_FAVOURITE_LIST : `${GET_DOCUMENTS_LIST_V2}?isFavourite=${isFavourite}`;

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + endpoint,
      { headers: { Authorization: user.id_token } }
    );

   if (response?.data?.status === true) {
      const documentAttrs = response?.data?.documents_attrs || [];
      const filteredDocuments = documentAttrs.filter((doc) => doc !== null);
      setDocumentData(filteredDocuments);

      if (filteredDocuments.length === 0) {
        setErrorDocumentData("No document found for the user!");
        if (isFavourite) {
          setIsFavListEmpty(true);
        } else {
          setIsFavListEmpty(false);  //  Reset for "All"
        }
      } else {
        setErrorDocumentData(null);
        setIsFavListEmpty(isFavourite ? false : false);  //  Ensures "All" is not empty
      }
    } else {
      setDocumentData([]);  //  Reset document data
      setErrorDocumentData(response?.data?.errorMessage || "Error fetching documents.");
      if (isFavourite) {
        setIsFavListEmpty(true);
      } else {
        setIsFavListEmpty(false);  //  Reset for "All"
      }
    }
  } catch (error) {
    showToast("Error while retrieving document list. Please try again later.", "error");
    setDocumentData([]);  //  Reset document data
    setErrorDocumentData("Error while retrieving document list.");
    if (isFavourite) {
      setIsFavListEmpty(true);
    } else {
      setIsFavListEmpty(false);  //  Reset for "All"
    }
  } finally {
    setDocTableLoader(false);
  }
};


  const handleAllOrStarredClick = (tab) => {
    setIsAllSelected(tab === "all");
  };

  const extractSelectedDocuments = () => {
    const fileList = selectedDocuments.map((document) => document.filename);
    const userIds = selectedDocuments.map((document) => document.userId);

    const allFav = selectedDocuments.every((document) => {
      return document.isFavourite === true;
    });

    const isAllSameUser = selectedDocuments.every((document) => {
      return document.userId === user?.user_id;
    });

    setFileNameList(fileList);
    setOrderedUserIds(userIds);
    setIsAllFav(allFav);
    setIsAllUserSame(isAllSameUser);
  };

  // Handles bulk deletion of selected documents.
  const handleBulkDelete = async () => {
    const data = {
      filenames: fileNameList,
      orderedUserIds: orderedUserIds,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + POST_DELETE_DOCUMENT,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );
      // console.log("response after delete: ", response);
      dispatch(setSelectedDocuments([]));
      getDocumentList(!isAllSelected);
      if (response?.data?.status === true) {
        activateSnackbar("Documents deleted successfully.", "success");
      } else {
        activateSnackbar(
          response?.data?.errorMessage || "Failed to delete documents.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error while Deleting Document", error);
      activateSnackbar(
        "Error while deleting documents. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteConfirmed = async () => {
    await handleBulkDelete();
    setShowDeleteConfirmation(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  //extracting data to making it fav or unfav
  const extractDataToMakeFav = () => {
    const data = {
      favouriteDocumentAttrs: [],
    };

    // Define a helper function to find an item in the state based on userId
    const findUserIndex = (userId) => {
      return data.favouriteDocumentAttrs.findIndex(
        (item) => item.userId === userId
      );
    };

    // Iterate over each item in the data array
    selectedDocuments.forEach((item) => {
      const userId = item.userId;
      const documentName = item.filename;
      const isFavourite = item.isFavourite;

      // Find the index of the user in the state
      const userIndex = findUserIndex(userId);

      // If the user already exists in the state
      if (userIndex !== -1) {
        const user = data.favouriteDocumentAttrs[userIndex];
        user.documentList.push(documentName);

        // Adjust isFavourite status
        if (!user.isFavourite || !isFavourite) {
          user.isFavourite = !isFavourite;
        }
        // If the user doesn't exist in the state, create a new entry for them
      } else {
        data.favouriteDocumentAttrs.push({
          userId: userId,
          documentList: [documentName],
          isFavourite: !isFavourite,
        });
      }
    });

    return data;
  };

  const handleBulkFavorite = async () => {
    const data = extractDataToMakeFav();

    // const data = {
    //   action: "favourite",
    //   filename: "refer_to_favourites_files",
    //   favourite_files: fileNameList,
    //   isFavourite: !isAllFav,
    // };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${POST_STAR_DOCUMENT}`,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
        }
      );

      // console.log("response after making it Favorite: ", response);
      if (response?.data?.status === true) {
        dispatch(setSelectedDocuments([]));
        getDocumentList(!isAllSelected);
        const actionText = isAllFav
          ? "Documents removed from starred successfully"
          : "Documents marked as starred successfully";
        activateSnackbar(`${actionText}.`, "success");
      } else {
        activateSnackbar(
          response?.data?.errorMessage ||
            "Failed to mark documents as favorite.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error while making it Favorite Document", error);
      activateSnackbar(
        "Error while marking documents as favorite. Please try again later.",
        "error"
      );
    }
  };

  const activateSnackbar = (message, severity = "success") => {
    setSnackbarState({
      open: true,
      message: message,
      severity: severity,
    });
  };

  useEffect(() => {
    getDocumentList(!isAllSelected);
  }, [isAllSelected]);

  useEffect(() => {
    extractSelectedDocuments();
  }, [selectedDocuments]);

  return (
    <Box className="document-container">
      <Box sx={{ display: "grid", gridTemplateRows: "repeat(2, 1fr)" }}>
        <Typography variant="subtitle1" fontWeight="bold" fontSize="20px">
          Documents
        </Typography>
        <Typography variant="subtitle2" color="#777777">
          You can store your frequently used data here, for reference or for
          import on the Products screen.
        </Typography>
        {showWarning && <WarningBox />}
        <Box className="document-action-panel">
          <Box className="doc-action-left-btn">
            {/* <Button
              variant="contained"
              onClick={handleOpenUploadModal}
              sx={{
                borderRadius: "5px",
              }}
            >
              <Typography sx={{ textTransform: "capitalize" }} variant="text">
                Upload Document
              </Typography>
            </Button> 

             Upload Document Modal component 
            <UploadDocModal
              isOpen={openUploadModal}
              onClose={handleCloseUploadModal}
              user={user}
              onUploadSuccess={() => getDocumentList(!isAllSelected)}
            />
            */}
          </Box>
          <Box
            className="doc-action-panel-right"
            sx={{
              transition: "opacity 0.3s ease",
            }}
          >
            {fileNameList.length > 1 && (
              <Box className="action-btn-del">
                <Button
                  sx={{
                    borderRadius: "5px",
                    marginRight: "3px",
                    textTransform: "capitalize",
                    // background: "#ee071b",
                    ":hover": {
                      // background: "#ee071b",
                    },
                    transition: "opacity 0.3s ease",
                  }}
                  variant="outlined"
                  onClick={() => handleDeleteClick()}
                >
                  <DeleteIcon />
                  Delete
                </Button>
                {showDeleteConfirmation && (
                  <DeleteAcknowledgment
                    onDeleteConfirmed={handleDeleteConfirmed}
                    onCancel={handleDeleteCancel}
                  />
                )}

                <Button
                  sx={{
                    borderRadius: "5px",
                    marginRight: "3px",
                    textTransform: "capitalize",
                  }}
                  variant="outlined"
                  onClick={() => handleBulkFavorite()}
                >
                  <StarIcon />
                  Favourite
                </Button>
              </Box>
            )}

            <Box className="action-btn-share">
              <Button
                className="doc-action-btn"
                sx={{
                  marginRight: "3px",
                  textTransform: "capitalize",
                }}
                variant="contained"
                onClick={handleOpenShareModal}
              >
                <ShareOutlinedIcon />
                share
              </Button>

              {/* Share Document Modal component */}
              <ShareDocModal
                user={user}
                fileList={fileNameList}
                userIds={orderedUserIds}
                isOpen={openShareModal}
                onClose={handleCloseShareModal}
                isAllUserSame={isAllUserSame}
              />
            </Box>
          </Box>
        </Box>

        <Box className="doc-action-panel-left">
          <Button
            className=""
            variant="text"
            sx={{
              textTransform: "capitalize",
              borderRadius: "0px",
              color: isAllSelected ? "#022149" : "#C6C6C6",
              marginBottom: isAllSelected ? "-5px" : "0",
              borderBottom: isAllSelected ? "5px solid #022149" : "none",
              fontWeight: "bold",
            }}
            onClick={() => handleAllOrStarredClick("all")}
          >
            All
          </Button>
          <Button
            className="doc-action-left-btn"
            variant="text"
            sx={{
              textTransform: "capitalize",
              borderRadius: "0px",
              color: !isAllSelected ? "#022149" : "#C6C6C6",
              marginBottom: !isAllSelected ? "-5px" : "0",
              borderBottom: !isAllSelected ? "5px solid #022149" : "none",
              fontWeight: "bold",
            }}
            onClick={() => handleAllOrStarredClick("star")}
          >
            Starred
          </Button>
        </Box>
        <Divider />
      </Box>
      {/* Document Table compoent */}
      {docTableLoader ? (
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
        <DocumentTable
          documentData={documentData}
          onTableUpdate={() => getDocumentList(!isAllSelected)}
          user={user}
          errDoctData={errorDocumentData}
          isAllSelected={isAllSelected}
          isFavListEmpty={isFavListEmpty}
        />
      )}

      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Box>
  );
});

export default documents;
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
