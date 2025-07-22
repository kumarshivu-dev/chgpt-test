import React from "react";
import "../developer/ApiDocumentation.css";
import { Typography, Box, Paper, Divider } from "@mui/material";
import ApiDoc from "../../../constants/ApiDoc.json";

import { RedocStandalone } from 'redoc';

const ApiDocumentation = () => {
    const sections = [
        {
            title: "Product Content Generation",
            description:
                "This section covers APIs to generate content for products, including SEO, taxonomy tagging, and more.",
        },
        {
            title: "User Management",
            description:
                "This section provides APIs for managing users, including registration, authentication, and role assignment.",
        },
        {
            title: "Analytics and Reporting",
            description:
                "APIs in this section deliver insights into product performance, user behavior, and detailed reports.",
        },
    ];

    return (
        <Box className="api-documentation-container">
            <Box className="api-documentation-content">
                <Typography variant="h4" component="h1" className="api-documentation-title">
                    API Documentation
                </Typography>

                {/**Content generation related information */}
                <Paper elevation={0} className="swagger-ui-card">

                    <Typography variant="h6" component="h2" className="api-section-title">
                        {sections[0].title}
                    </Typography>
                    <Typography variant="body1" className="api-section-description" sx={{mb: 5}}>
                        {sections[0].description}
                    </Typography>

                    <RedocStandalone
                        spec={ApiDoc}
                        options={{
                            // theme: {
                            //   colors: {
                            //     primary: "#1b5e20", // Correctly formatted hex color
                            //     text: "#333333", // Add other color fields as needed
                            //   },
                            //   typography: {
                            //     fontSize: "16px", // Ensure this is a string or number
                            //   },
                            // },
                            expandResponses: "200",
                            hideDownloadButton: true,
                        }}
                    />
                </Paper>
                
                {/**User management related section */}
                <Paper elevation={0} className="swagger-ui-card" sx={{mt: 4}}>

                    <Typography variant="h6" component="h2" className="api-section-title">
                        {sections[1].title}
                    </Typography>
                    <Typography variant="body1" className="api-section-description" sx={{mb: 5}}>
                        {sections[1].description}
                    </Typography>

                    {/* <RedocStandalone
                        spec={ApiDoc}
                        options={{
                            expandResponses: "200",
                            hideDownloadButton: true,
                        }}
                    /> */}
                </Paper>
                
                {/**Analytics and Reporting related section */}
                <Paper elevation={0} className="swagger-ui-card" sx={{mt: 4}}>

                    <Typography variant="h6" component="h2" className="api-section-title">
                        {sections[2].title}
                    </Typography>
                    <Typography variant="body1" className="api-section-description" sx={{mb: 5}}>
                        {sections[2].description}
                    </Typography>

                    {/* <RedocStandalone
                        spec={ApiDoc}
                        options={{
                            expandResponses: "200",
                            hideDownloadButton: true,
                        }}
                    /> */}
                </Paper>

                {/* <Paper elevation={0} className="api-sections-card">
                    {sections.map((section, index) => (
                        <Box key={index} className="api-section">
                            <Typography variant="h6" component="h2" className="api-section-title">
                                {section.title}
                            </Typography>
                            <Typography variant="body1" className="api-section-description">
                                {section.description}
                            </Typography>
                            {index !== sections.length - 1 && <Divider className="api-section-divider" />}
                        </Box>
                    ))}
                </Paper> */}

            </Box>
        </Box>
    );
};

export default ApiDocumentation;