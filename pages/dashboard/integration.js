import {
  Box,
  Grid,
  Stack,
  Typography,
  Dialog,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import IntegrationCard from "../../components/dashboard/integration/IntegrationCard";
import ApiClientCard from "../../components/dashboard/integration/ApiClientCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setApiClientId } from "../../store/userSlice";
import { getSession } from "next-auth/react";
import { INTEGRATIONTYPES } from "../../constants/globalvars";
import "../../components/dashboard/integration/integration.css";

const Integration = ({ user }) => {
  const [integrations, setIntegrations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const fetchIntegrations = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL}/dashboard/active-integrations`,
        {
          headers: {
            Authorization: `${session.user.id_token}`, // Pass the user's token for authentication
          },
        }
      );
      setIntegrations(response?.data?.integrations || []); // Set the fetched integrations
    } catch (error) {
      console.error("Error fetching integrations:", error);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  useEffect(() => {
    const apiIntegration = integrations.find(
      (int) => int.integrationType === "api"
    );
    const clientId = apiIntegration?.metaData?.clientId; // Access clientId from metadata
    if (clientId) {
      dispatch(setApiClientId(clientId));
    }
  }, [integrations]);

  const getMetaDataValue = (type, key, placeholder) => {
    const integration = integrations.find(
      (int) => int.integrationType === type
    );
    return integration?.metaData?.[key] || placeholder;
  };

  return (
    <Stack spacing={3}>
      <Box sx={{ paddingX: 2 }}>
        <Typography variant="h6" fontWeight={700} fontSize="20px">
          Integrations
        </Typography>
        <Typography variant="subtitle2" color="#777777">
          Bring your platforms together and manage your content effortlessly
          with Integrations.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {INTEGRATIONTYPES.map(({ type, label, placeholder, metaKey }) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ paddingLeft: "0px !important" }}
          >
            <Box className="label-box">
              <Typography className="label" variant="subtitle2">
                {label}: {getMetaDataValue(type, metaKey, placeholder)}
              </Typography>
              <IntegrationCard
                user={user}
                integration_type={type}
                integrations={integrations}
                setIntegrations={setIntegrations}
                isLoading={setOpenModal}
                metadata={
                  integrations.find((int) => int.integrationType === type)
                    ?.metaData || {}
                }
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      {openModal && (
        <Box className="progress">
          <CircularProgress size="3rem" />
        </Box>
      )}
    </Stack>
  );
};

export default Integration;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }

  const { user } = session;

  return {
    props: {
      user,
    },
  };
}
