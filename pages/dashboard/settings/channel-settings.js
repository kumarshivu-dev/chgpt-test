import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getSession } from "next-auth/react";
import { Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetChannelsListQuery,
  useDeleteChannelDataMutation,
} from "../../../store/services/channel.services";
import { channelApi } from "../../../store/services/channel.services";
import ChannelFormDialog from "../../../components/dashboard/settings/channel-settings/ChannelFormDialog";
import ChannelTable from "../../../components/dashboard/settings/channel-settings/ChannelTable";
import { setSelectedChannels } from "../../../store/dashboard/documentTableSlice";

const ChannelSettings = ({ user }) => {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state?.user);
  const brandSpecification = userState?.userInfo?.brandSpecification;
  const documentState = useSelector((state) => state.documentTable);
  const selectedChannels = documentState?.selectedChannels;
  // react-state-management
  const [selectedChannelData, setSelectedChannelData] = useState(null);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [totalChannels, setTotalChannels] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isChannelsLoading, setIsChannelsLoading] = useState(false);

  const [deleteChannelData] = useDeleteChannelDataMutation();
  const isDisabled =
    user?.planCode?.startsWith("chgpt-free") ||
    user?.role === "Editor" ||
    (totalChannels !== null && totalChannels >= 3);

  const getTooltipMessage = () => {
    if (user?.role === "Editor") return "Only admins can create new channels.";
    if (user?.planCode?.startsWith("chgpt-free"))
      return "Upgrade your plan to create new channels.";
    if (totalChannels >= 3)
      return "Only 3 channels are allowed per organization; please delete existing ones to add new.";
    return "";
  };
  const { data: orgChannels } = useGetChannelsListQuery({
    isBrandSpecific: false,
    // brandId: brandSpecification?.brandId,
  });

  const {
    data: channelList,
    isLoading,
    error,
  } = useGetChannelsListQuery({
    isBrandSpecific: brandSpecification?.brandSpecific,
    brandId: brandSpecification?.brandId,
  });

  useEffect(() => {
    const fetchAllChannels = async () => {
      let total = orgChannels?.length || 0;

      const brandIds = userState?.brandIdList || [];

      const fetchPromises = brandIds.map((brandId) =>
        // Use .initiate to manually trigger RTK Query from hook outside render
        dispatch(
          channelApi.endpoints.getChannelsList.initiate({
            isBrandSpecific: true,
            brandId,
          })
        )
      );

      const results = await Promise.allSettled(fetchPromises);

      results.forEach((result) => {
        if (
          result.status === "fulfilled" &&
          result.value?.data &&
          Array.isArray(result.value.data)
        ) {
          total += result?.value?.data?.length;
        }
      });
      setTotalChannels(total - 2 - 2 * brandIds?.length);
      // setIsChannelsLoading(false);
    };
    dispatch(setSelectedChannels([]));
    if (orgChannels && userState?.brandIdList?.length) {
      fetchAllChannels();
    }
  }, [orgChannels, userState?.brandIdList, channelList]);

  const handleEdit = (row) => {
    setSelectedChannelData(row);
    setIsChannelDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedChannels && selectedChannels.length > 0) {
      const payload = {
        ids: selectedChannels.map((item) => item.id),
        channelNames: selectedChannels.map((item) => item.channelName),
      };
      deleteChannelData(payload);
    }
    dispatch(setSelectedChannels([]));
    setShowDeleteConfirmation(false);
  };
  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  return (
    <>
      {isChannelDialogOpen && (
        <ChannelFormDialog
          open={isChannelDialogOpen}
          channelData={selectedChannelData}
          channelList={channelList}
          setSelectedChannelData={setSelectedChannelData}
          onClose={() => {
            setSelectedChannelData(null);
            setIsChannelDialogOpen(false);
          }}
        />
      )}
      <Stack direction="column" spacing={3}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            Channel Settings
          </Typography>
          <Typography variant="subtitle2" color="#777777">
            Manage your channel for tailored content generation.
          </Typography>
        </Box>
        <Box sx={{ display: "inline-block" }}>
          {/* {isChannelsLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : ( */}
          <Box sx={{ display: "inline-block" }}>
            <Tooltip
              title={isDisabled ? getTooltipMessage() : ""}
              arrow
              disableHoverListener={!isDisabled}
              placement="bottom"
            >
              <span>
                <Button
                  disabled={
                    !channelList ||
                    user?.planCode?.startsWith("chgpt-free") ||
                    user?.role === "Editor" ||
                    totalChannels >= 3
                  }
                  variant="contained"
                  onClick={() => setIsChannelDialogOpen(true)}
                >
                  {" "}
                  <Add />
                  <Typography
                    sx={{ textTransform: "capitalize" }}
                    variant="text"
                  >
                    Create New channel
                  </Typography>
                </Button>
              </span>
            </Tooltip>
          </Box>
          {/* )} */}
        </Box>

        <Box
          className="doc-action-panel-right"
          sx={{
            transition: "opacity 0.3s ease",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "0px !important",
          }}
        >
          {userState?.userInfo?.role === "Admin" &&
            selectedChannels?.length > 1 && (
              <Box className="action-btn-del">
                <Button
                  sx={{
                    borderRadius: "5px",
                    marginRight: "3px",
                    textTransform: "capitalize",
                    transition: "opacity 0.3s ease",
                  }}
                  variant="outlined"
                  onClick={() => handleDeleteClick()}
                >
                  <DeleteIcon />
                  Delete
                </Button>
                {showDeleteConfirmation && (
                  <Dialog
                    open={showDeleteConfirmation}
                    onClose={() => setShowDeleteConfirmation(false)}
                    PaperProps={{
                      component: "form",

                      sx: {
                        maxWidth: "700px",
                        width: "700px",
                        borderRadius: "10px",
                      },

                      onSubmit: handleConfirmDelete,
                    }}
                  >
                    <DialogTitle sx={{ fontWeight: "bold" }}>
                      Confirm Deletion
                    </DialogTitle>
                    <DialogContent>
                      Are you sure you want to delete the selected channels? The{" "}
                      <strong>default and blog</strong> channels will be
                      retained. This action is irreversible.
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setShowDeleteConfirmation(false)}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </Box>
            )}
        </Box>

        <ChannelTable
          open={isChannelDialogOpen}
          handleEdit={handleEdit}
          onClose={() => setIsChannelDialogOpen(false)}
        />
      </Stack>
    </>
  );
};

export default ChannelSettings;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const user = session.user;

  if (
    user?.role === "Admin" &&
    (user?.planCode).startsWith("chgpt-enterprise")
  ) {
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

