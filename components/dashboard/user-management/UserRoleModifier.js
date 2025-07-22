import { useState, Fragment } from "react";
import { Box, Menu, MenuItem, ListItemIcon, Typography } from "@mui/material";
import axios from "axios";
import SnackbarNotifier from "../../helper/dashboard/snackbarNotifier";
import trackActivity from "../../helper/dashboard/trackActivity";
import { useSelector } from "react-redux";
import { POST_EDIT_USER_ROLE } from "../../../utils/apiEndpoints";

const UserRoleModifier = ({
  anchorPosition,
  onClose,
  rowData,
  onTableUpdate,
  user,
}) => {
  const userState = useSelector((state) => state.user);
  const brandIds = userState?.brandIdList;
  let changeRole = rowData?.role === "Admin" ? "Editor" : "Admin";
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

  const handleUpdateUserRole = async () => {
    if (user?.user_id === rowData?.userId) {
      activateSnackbar("You can't change your own role", "error");
      return;
    }
    const data = {};
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}${POST_EDIT_USER_ROLE}`,
        data,
        {
          headers: {
            Authorization: user.id_token,
          },
          params: {
            user_id: rowData?.userId,
            role_name: changeRole,
          },
        }
      );
      if (response?.data?.status === true) {
        activateSnackbar(response?.data?.message, "success");
        onTableUpdate();
        // trackActivity(
        //   "EDIT_USER_ROLE",
        //   "",
        //   user,
        //   rowData.email,
        //   user?.org_id,
        //   changeRole,
        //   null,
        //   null,
        //   brandIds
        // );
      } else {
        activateSnackbar(
          response?.data?.message || "Document operation Failed",
          "error"
        );
      }
    } catch (error) {
      activateSnackbar(
        "Error while updating documents. Please try again.",
        "error"
      );
    } finally {
      setTimeout(onClose, 1000);
    }
  };

  return (
    <Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      ></Box>
      <Menu
        id="account-menu"
        anchorReference="anchorPosition"
        anchorPosition={
          anchorPosition.x !== null && anchorPosition.y !== null
            ? { top: anchorPosition.y, left: anchorPosition.x }
            : undefined
        }
        open={Boolean(anchorPosition.x !== null && anchorPosition.y !== null)}
        onClose={onClose}
      >
        <MenuItem onClick={() => handleUpdateUserRole()}>
          <Typography variant="">
            Change role to <strong>{changeRole}</strong>
          </Typography>
        </MenuItem>
      </Menu>

      {/* Snackbar Error handling section  */}
      <SnackbarNotifier
        open={snackbarState.open}
        onClose={() => setSnackbarState({ ...snackbarState, open: false })}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
    </Fragment>
  );
};

export default UserRoleModifier;
