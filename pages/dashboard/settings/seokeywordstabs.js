import React, { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { Tab, Tabs, Typography, Box, TextField, Button, FormControl, Form, InputLabel, Select,MenuItem} from "@mui/material";
import axios from "axios";


const demoProducts = [
    { id: 1, name: "Product 1", description: "Description for product 1" },
    { id: 2, name: "Product 2", description: "Description for product 2" },
    { id: 3, name: "Product 3", description: "Description for product 3" }
];

function seokeywordstabs() {
    const [tabIndex, setTabIndex] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(demoProducts[0].id);
    const [keywordData, setKeywordData] = useState({
        customer_id: "5304609207",
        pageUrl: "",
        keywords: "",
        country: "",
    });
    

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setKeywordData({ ...keywordData, [name]: value });
    };

    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const selectedProductData = demoProducts.find(product => product.id === selectedProduct);

        if (tabIndex === 0) {
            console.log("Generating keywords from business:", keywordData);
            const requestData = {
                customer_id: keywordData.customer_id,
                location_ids: ["1023191"],
                language_id: "1000",
                page_url: keywordData.pageUrl,
                description: selectedProductData.description,
                ...(keywordData.keywords && { keyword_texts: keywordData.keywords.split(',').map(keyword => keyword.trim()) })
            };

            // Send data to the API endpoint
            axios
                .post("http://localhost:8000/adsense/generatekeywords", requestData)
                .then((response) => {
                    // Handle successful response
                    console.log("Response:", response.data);
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error:", error);
                });
        } else if (tabIndex === 1) {
            console.log("Generating keywords from global trending:", keywordData);
            const requestData = {
                country: keywordData.country
            };

            // Send data to the API endpoint
            axios
                .post("http://localhost:8000/adsense/generatealltrending", requestData)
                .then((response) => {
                    // Handle successful response
                    console.log("Response:", response.data);
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error:", error);
                })
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Generate Keywords from Business" />
                <Tab label="Generate Keywords from Global Trending" />
            </Tabs>
            <TabPanel value={tabIndex} index={0}>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Product</InputLabel>
                        <Select
                            value={selectedProduct}
                            onChange={handleProductChange}
                        >
                            {demoProducts.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="customer_id"
                        label="Customer ID"
                        value={keywordData.customer_id}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="pageUrl"
                        label="Page URL"
                        value={keywordData.pageUrl}
                        onChange={handleInputChange}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="keywords"
                        label="Keywords"
                        value={keywordData.keywords}
                        onChange={handleInputChange}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Generate Keywords
                    </Button>
                </form>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        name="country"
                        label="Country"
                        value={keywordData.country}
                        onChange={handleInputChange}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Generate Keywords
                    </Button>
                </form>
            </TabPanel>
        </Box>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export default seokeywordstabs;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            props: {},
        };
    }
    const { filename, requestedUserId } = context.query;
    const user = session.user;

    return {
        props: {
            getFileName: filename || "",
            requestedUserId: requestedUserId || null,
            // Ensure getFileName is defined
            user,
        },
    };
}
