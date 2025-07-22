import { getSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Box, Tab, Tabs, Typography } from "@mui/material";

import DocumentationOverview from "../../components/dashboard/developer/DocumentationOverview";

import { VpnKey, MenuBook, Dashboard } from "@mui/icons-material";
import ApiDocumentation from "../../components/dashboard/developer/ApiDocumentation";
import ApiKeys from "../../components/dashboard/developer/apiKeys";
import { setApiClientId } from "../../store/userSlice";
import axios from "axios";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DeveloperDocumentation = ({ user }) => {
  const [value, setValue] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL+"/client/get", {
          headers: {
            Authorization: user.id_token,
          },
        });
        const clientId = response?.data?.data.clientId;
        if (clientId) {
          // Dispatch the clientId to Redux
          dispatch(setApiClientId(clientId));
        } else {
          console.error("clientId not found in response metadata");
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, [dispatch, user.id_token]);
  
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {" "}
      {/* height to view port */}
      <Tabs
        orientation="vertical"
        value={value}
        variant="scrollable"
        onChange={(e, newValue) => setValue(newValue)}
        sx={{
          borderRight: 1,
          borderColor: "divider",
          minWidth: 200,
          height: "100%",
        }} /*Ensure Tabs take full height */
      >
        <Tab
          icon={<Dashboard />}
          label="Overview"
          iconPosition="start"
          sx={{ justifyContent: "flex-start", minHeight: 48 }}
        />
        <Tab
          icon={<VpnKey />}
          label="API Keys"
          iconPosition="start"
          sx={{ justifyContent: "flex-start", minHeight: 48 }}
        />
        <Tab
          icon={<MenuBook />}
          label="Documentation"
          iconPosition="start"
          sx={{ justifyContent: "flex-start", minHeight: 48 }}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <DocumentationOverview apiKey={"apiKey"} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ApiKeys user={user} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ApiDocumentation />
      </TabPanel>
    </Box>
  );
};

export default DeveloperDocumentation;

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
      user, // Pass only the user to the component
    },
  };
}
