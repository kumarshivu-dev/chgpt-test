import React from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import { CheckCircle, Search, Dashboard, Email, Menu } from "@mui/icons-material";

const OktaIntegrationGuide = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* Header Section */}
      <Typography variant="h4" align="center" gutterBottom>
        Okta Integration Guide for ContentHubGPT
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        Follow these steps to set up ContentHubGPT with Okta’s SSO and JIT provisioning.
      </Typography>

      {/* Prerequisites Section */}
      <Card sx={{ mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            1. Prerequisites
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary="An active Okta admin account." />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Configuration Steps Section */}
      <Card sx={{ mt: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            3. Configuration Steps
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Dashboard color="primary" />
              </ListItemIcon>
              <ListItemText primary="Log in to your Okta admin URL." />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Menu color="primary" />
              </ListItemIcon>
              <ListItemText primary="Click on the Hamburger menu (☰) on the top left." />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary="Go to 'Applications' and expand the section." />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Search color="primary" />
              </ListItemIcon>
              <ListItemText primary="Click on 'Browse App Catalog'." />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Search color="primary" />
              </ListItemIcon>
              <ListItemText primary="Search for 'ContentHubGPT' in the application catalog." />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary="Click on 'Add Integration' to add the ContentHubGPT application." />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Dashboard color="primary" />
              </ListItemIcon>
              <ListItemText primary="Go to the 'Sign On' tab." />
            </ListItem>

            <ListItem>
              <ListItemIcon>
                <Email color="primary" />
              </ListItemIcon>
              <ListItemText primary="Copy the metadata and email it to: chgpt-support@gspann.com." />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Box textAlign="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="https://www.okta.com/integrations/"
          target="_blank"
        >
          Explore on Okta Integration Network
        </Button>
      </Box>
    </Container>
  );
};

export default OktaIntegrationGuide;
