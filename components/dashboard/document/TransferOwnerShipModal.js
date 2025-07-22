import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Modal, Grid, Divider, Button } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import "./../user-management/user-mgmt-style.css";
import { useSelector } from "react-redux";
import {
  GET_FETCH_USERS,
  PUT_TRANSFER_DOCUMNET_OWNER,
} from "../../../utils/apiEndpoints";
import OwnerTransferAcknowledgment from "./OwnerTransferAcknowledgment";

const TransferOwnerShipModal = ({
  user,
  rowData,
  isOpen,
  onClose,
  onTableUpdate,
}) => {
  const userState = useSelector((state) => state.user);
  const [orgUser, setOrgUser] = useState([]);
  const [showTransferBtn, setShowTransferBtn] = useState(true);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(null);

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

  const handleEmailClick = (index) => {
    if (selectedEmailIndex === index) {
      // If the same email is clicked again, deselect it
      setSelectedEmailIndex(null);
      setShowTransferBtn(true); // Re-enable the transfer button when deselected
    } else {
      // If a different email is clicked, select it
      setSelectedEmailIndex(index);
      setShowTransferBtn(false); // Disable the transfer button
      const clickedUser = orgUser[index];
      setSelectedUser(clickedUser);
    }
  };

  const handlesTransferOwnerShip = () => {
    setShowAcknowledgment(true);
  };

  const handleTransferConfirmed = async () => {
    try {
      const response = await axios.put(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL +
          PUT_TRANSFER_DOCUMNET_OWNER,
        {},
        {
          params: {
            filename: rowData?.filename,
            transferUserId: selectedUser?.userId,
          },
          headers: {
            Authorization: user.id_token,
          },
        }
      );

      if (response?.data?.status === true) {
        activateSnackbar(
          response?.data?.message || "Document transferred successfully"
        );
        onTableUpdate();
      } else {
        activateSnackbar(
          response?.data?.errorMessage || "Document transferred Failed",
          "error"
        );
      }
    } catch (error) {
      console.error("Error while updating Document", error);
      activateSnackbar(
        "Error while updating documents. Please try again.",
        "error"
      );
    }
  };

  const handleTransferCancel = () => {
    setShowAcknowledgment(false);
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
        // Filter active users and extract necessary data
        const activeOrgUsers = response?.data?.users
          .filter((tempUser) => {
            const isActive = tempUser?.inviteStatus === "active";
            const isNotCurrentOrgUser = orgUser?.email !== tempUser?.email;
            const isNotCurrentUser = tempUser?.email !== user?.email;
            const isOrgLevelExcluded =
              userState?.userInfo?.brandSpecific === false
                ? tempUser?.accessLevel === "Org"
                : true;

            return (
              isActive &&
              isNotCurrentOrgUser &&
              isNotCurrentUser &&
              isOrgLevelExcluded
            );
          })
          .map(({ name, email, userId }) => ({
            name,
            email,
            userId,
          }));
        // Set the state with filtered active users
        setOrgUser(activeOrgUsers);
      }
    } catch (error) {
      if (error?.response?.data === "Organization permissions revoked") {
        signOut();
      }
      activateSnackbar(
        "Network connection failed. Please refresh the page to reload the content",
        "error"
      );
    }
  };

  useEffect(() => {
    getUserMgmtList();
  }, []);

  return (
    <Box>
      <Modal
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
        className="document-modal"
        keepMounted
        open={isOpen}
        onClose={onClose}
      >
        {/* Upload Container */}
        <Box className="add-user-container">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  color: "#000000",
                }}
              >
                Transfer Ownership
              </Typography>
            </Grid>
            <Divider />
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={8} sx={{ display: "flex", justifyContent: "start" }}>
              <DescriptionIcon />
              <Typography
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                  maxWidth: "400px",
                  fontWeight: "bold",
                }}
                title={rowData?.filename}
              >
                {rowData?.filename}
              </Typography>
            </Grid>

            <Grid item xs={4} sx={{ display: "flex", justifyContent: "end" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle1" component="span">
                  {rowData?.product_count}
                </Typography>
                <Typography variant="subtitle1" component="span">
                  product(s)
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <span className="material-symbols-outlined">package_2</span>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="">People in Organization</Typography>
            </Grid>

            <Grid item xs={12}>
              <Box className="displayed-email-box">
                {orgUser
                  .filter((user_) => user_.email !== user.email)
                  .map((user, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEmailClick(index)}
                    >
                      <Box
                        className="input-email"
                        display="flex"
                        alignItems="center"
                        sx={{
                          border: "1.5px solid #E0E3E6",
                          borderRadius: "30px",
                          padding: "3px 6px 3px 6px",
                          margin: "0 8px 8px 0",
                          background:
                            selectedEmailIndex === index
                              ? "#022149"
                              : "inherit",

                          // flex: 0,
                          ":hover": {
                            background: "#ECF0FF",
                            color: "#000000",
                          },
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "12px",
                            color:
                              selectedEmailIndex === index
                                ? "white"
                                : "inherit",
                            ":hover": {
                              background: "#ECF0FF",
                              color: "#000000",
                            },
                          }}
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Grid>
          </Grid>
          <Grid>
            <Divider sx={{ width: "100%" }} />
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              //   borderTop: "1px solid #C5C5C5",
              padding: "10px 2px",
              //   gap: "7.5px",
            }}
          >
            <Button
              className="cancelbtn"
              variant="outlined"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              className="sharebtn"
              variant="contained"
              disabled={showTransferBtn}
              onClick={() => handlesTransferOwnerShip()}
            >
              Transfer Ownership
            </Button>
          </Grid>
        </Box>
      </Modal>

      {showAcknowledgment && (
        <OwnerTransferAcknowledgment
          onTransferConfirmed={handleTransferConfirmed}
          onCancel={handleTransferCancel}
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
};

export default TransferOwnerShipModal;
