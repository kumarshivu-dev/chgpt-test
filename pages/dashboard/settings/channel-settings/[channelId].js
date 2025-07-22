import { BorderColorRounded } from "@mui/icons-material";
import PersonaTable from "../../../../components/dashboard/settings/hypertarget/PersonaTable";
import {
  Box,
  Button,
  Card,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  useGetChannelDataQuery,
  useUpdateChannelDataMutation,
} from "../../../../store/services/channel.services";
import { useEffect, useState } from "react";
import ChannelConfigFormDialog from "../../../../components/dashboard/settings/channel-settings/channel/ChannelConfigFormDialog";
import UploadChannelTaxonomyModal from "../../../../components/dashboard/settings/channel-settings/channel/UploadChannelTaxonomyModal";
import BlogChannelConfigFormDialog from "../../../../components/dashboard/settings/channel-settings/channel/BlogChannelConfigFormDialog";
import ChannelConfigData from "../../../../components/dashboard/settings/channel-settings/channel/ChannelConfigData";

const Channel = ({ user, channelName, channelId, Taxonomy }) => {
  const router = useRouter();
  const { data: channelData, isLoading } =
    useGetChannelDataQuery(channelId, {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    }) || {};

  const [updateChannelData] = useUpdateChannelDataMutation() || [];

  const channelConfigData = {
    featureBullets: channelData?.featureBullets,
    shortDescription: channelData?.shortDescription,
    longDescription: channelData?.longDescription,
  };

  const blogChannelConfigData = {
    blog_length: channelData?.blog_length,
    blog_description: channelData?.blog_description,
  };

  // React state management
  const [isChannelConfigDialogOpen, setIsChannelConfigDialogOpen] =
    useState(false);
  const [selectedPersonaIds, setSelectedPersonaIds] = useState(
    channelData?.personaIds ?? []
  );

  const [isUploadTaxonomyModalOpen, setUploadTaxonomyModalOpen] =
    useState(false);
  const [taxonomyFileName, setTaxonomyFileName] = useState(Taxonomy || "");

  const openUploadTaxonomyModal = () => setUploadTaxonomyModalOpen(true);
  const closeUploadTaxonomyModal = () => setUploadTaxonomyModalOpen(false);
  // Handle file upload success
  const handleFileUploaded = (fileName) => {
    setTaxonomyFileName(fileName);
    // Update the URL with the new taxonomy filename
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          Taxonomy: fileName,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSubmitPersonaIds = () => {
    const formData = {
      personaIds: selectedPersonaIds,
    };

    updateChannelData({ id: channelId, data: formData });
  };

  useEffect?.(() => {
    if (channelData) {
      setSelectedPersonaIds(channelData?.personaIds ?? []);
    }
  }, [channelData]);

  return (
    <>
      {isChannelConfigDialogOpen &&
        (channelName === "Blog" ? (
          <BlogChannelConfigFormDialog
            open={isChannelConfigDialogOpen}
            onClose={() => setIsChannelConfigDialogOpen?.(false)}
            channelId={channelId}
            channelData={blogChannelConfigData}
          />
        ) : (
          <ChannelConfigFormDialog
            open={isChannelConfigDialogOpen}
            onClose={() => setIsChannelConfigDialogOpen?.(false)}
            channelId={channelId}
            channelData={channelConfigData}
          />
        ))}
      <Stack direction="column" spacing={3}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {channelName} Configurations
          </Typography>
          <Typography variant="subtitle2" color="#777777">
            Manage your channel configurations for content generation.
          </Typography>
        </Box>
        <Card sx={{ padding: 2 }}>
          <Grid container>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="h6" fontWeight={"bold"}>
                Channel Information
              </Typography>
              <Button
                disabled={user?.role === "Editor"}
                variant="outlined"
                onClick={() => setIsChannelConfigDialogOpen?.(true)}
              >
                <BorderColorRounded /> &nbsp;
              </Button>
            </Grid>
            {isLoading ? (
              <>
                <Skeleton variant="text" width={"100%"} height={50} />
                <Skeleton variant="text" width={"100%"} height={50} />
                <Skeleton variant="text" width={"50%"} height={50} />
              </>
            ) : (
              <ChannelConfigData
                channelName={channelName}
                channelData={channelData}
              />
            )}
          </Grid>
        </Card>

        {channelName !== "Blog" && (
          <>
            {" "}
            {user?.role === "Admin" && (
              <Stack direction={"row"} justifyContent={"flex-end"}>
                <Typography
                  variant="text"
                  sx={{
                    marginRight: "12.5px",
                    paddingTop: "5px",
                    color: "#163058",
                  }}
                >
                  {taxonomyFileName
                    ? `Taxonomy: ${taxonomyFileName}`
                    : "No taxonomy uploaded"}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ marginRight: "12.5px" }}
                  onClick={() => openUploadTaxonomyModal()}
                >
                  Upload Taxonomy
                </Button>
                <Button variant="contained" onClick={handleSubmitPersonaIds}>
                  Save Configuration
                </Button>
              </Stack>
            )}
            <PersonaTable
              selectedPersonaIds={selectedPersonaIds}
              setSelectedPersonaIds={setSelectedPersonaIds}
            />
          </>
        )}
      </Stack>

      {isUploadTaxonomyModalOpen && (
        <UploadChannelTaxonomyModal
          user={user}
          isOpen={isUploadTaxonomyModalOpen}
          onClose={closeUploadTaxonomyModal}
          channelId={channelId}
          onFileUploaded={handleFileUploaded}
        />
      )}
    </>
  );
};

export default Channel;

export async function getServerSideProps(context) {
  const channelId = context?.params?.channelId;
  const channelName = context?.query?.channelName;
  const Taxonomy = context?.query?.Taxonomy;
  const session = await getSession?.(context);

  if (!session) {
    return {
      props: {},
    };
  }

  const user = session?.user;

  return {
    props: {
      channelId,
      channelName,
      Taxonomy,
      user,
    },
  };
}
