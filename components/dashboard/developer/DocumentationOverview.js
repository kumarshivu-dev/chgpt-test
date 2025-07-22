import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Box,
  Container,
  Tabs,
  Tab,
  AppBar,
  Select,
  MenuItem,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

import "../developer/developer.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
//import { a11yDark, a11yLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DocumentationOverview = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [theme, setTheme] = useState("light");
  const [isClient, setIsClient] = useState(false);

  const overviewData = {
    title: "Developer quickstart",
    lastUpdated: "December 4, 2024",
  };

  /*const themes = {
    light: {
      style: a11yLight,
      bg: '#f5f5f5',
      text: '#333',
    },
    dark: {
      style: a11yDark,
      bg: '#2d2d2d',
      text: '#f8f8f2',
    },
  };*/

  const themes = {
    light: {
      style: {
        'code[class*="language-"]': {
          color: "#333",
          background: "#f5f5f5",
          fontFamily:
            'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          fontSize: "1em",
          lineHeight: "1.5",
          padding: "1em",
          borderRadius: "4px",
          overflow: "auto",
        },
        'pre[class*="language-"]': {
          color: "#333",
          background: "#f5f5f5",
          fontFamily:
            'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          fontSize: "1em",
          lineHeight: "1.5",
          padding: "1em",
          borderRadius: "4px",
          overflow: "auto",
        },
      },
      bg: "#f5f5f5",
      text: "#333",
    },
    dark: {
      style: {
        'code[class*="language-"]': {
          color: "#f8f8f2", // Text color for inline code
          background: "transparent", // Make background transparent for inline code to avoid overlap
          fontFamily:
            'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          fontSize: "1em",
          lineHeight: "1.5",
          padding: "0.2em 0.4em", // Adjust padding for inline code
          borderRadius: "3px", // Slightly reduce border radius for better aesthetics
          overflow: "auto",
          whiteSpace: "pre-wrap", // Make sure long lines of code don't break the layout
          wordBreak: "break-word", // Ensure words break instead of overflowing
        },
        'pre[class*="language-"]': {
          color: "#f8f8f2", // Text color for block code
          background: "#1e1e1e", // Darker background for code block for better contrast
          fontFamily:
            'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          fontSize: "1em",
          lineHeight: "1.5",
          padding: "1em", // Adjust padding to make it more comfortable
          borderRadius: "4px",
          overflow: "auto",
          whiteSpace: "pre-wrap", // Ensure code blocks wrap when necessary
          wordBreak: "break-word", // Avoid overflow of long lines
        },
      },
      bg: "#121212", // Slightly darker background for the entire theme
      text: "#f8f8f2", // Light text color for readability
    },
  };

  const codeSnippets = {
    curl: `curl --location 'https://dev-chgpt-springboot.gspann.com/feature/content/generation' \\
--header 'version: 1.0.0' \\
--header 'x-api-key: YOUR_API_KEY' \\
--header 'x-client-id: YOUR_CLIENT_ID' \\
--header 'Content-Type: application/json' \\
--data '{
    "doContentGen": true,
    "doSeo": false,
    "doTaxonomy": false,
    "useBrandVoice": false,
    "taxonomy": [],
    "excludeKeywords": [],
    "languages": [
        "English (US)",
        "German (DE)",
        "English (GB)"
    ],
    "products": [
        {
            "id": "",
            "brand": "IKEA",
            "name": "Ben Pillow Cover",
            "description": "The Ben Pillow Cover is a brown linen decorative pillowcase used to add visual interest and texture to a room. It is made from a natural linen fabric, which is known for its durability, breathability, and classic look. The pillowcase is designed to fit over a standard size rectangle decorative pillow. It features a neutral brown color that can complement a wide variety of decor styles and color schemes. The linen fabric has a soft and slightly textured surface that adds a cozy and inviting feel to the pillow. The edges of the pillowcase are typically finished with a neat hem, which adds a polished look to the overall design. The pillowcase is often used to add a touch of warmth and natural elegance to a room, whether it is placed on a bed, a sofa, or an accent chair. It can be used on its own or paired with other decorative pillows in different shapes and colors to create a layered and cohesive look. Overall, a brown linen decorative pillowcase is a versatile and timeless accent piece that can enhance the comfort and style of any room in the home.",
            "bulletPoints": [],
            "product_keywords": []
        }
    ],
    "personas": []
}'`,
    python: `import requests

url = "https://dev-chgpt-springboot.gspann.com/feature/content/generation"
headers = {
    "version": "1.0.0",
    "x-api-key": "YOUR_API_KEY",
    "x-client-id": "YOUR_CLIENT_ID",
    "Content-Type": "application/json"
}
payload = {
    "doContentGen": True,
    "doSeo": False,
    "doTaxonomy": False,
    "useBrandVoice": False,
    "taxonomy": [],
    "excludeKeywords": [],
    "languages": ["English (US)", "German (DE)", "English (GB)"],
    "products": [
        {
            "id": "",
            "brand": "IKEA",
            "name": "Ben Pillow Cover",
            "description": "The Ben Pillow Cover is a brown linen decorative pillowcase used to add visual interest and texture to a room. It is made from a natural linen fabric, which is known for its durability, breathability, and classic look. The pillowcase is designed to fit over a standard size rectangle decorative pillow. It features a neutral brown color that can complement a wide variety of decor styles and color schemes. The linen fabric has a soft and slightly textured surface that adds a cozy and inviting feel to the pillow. The edges of the pillowcase are typically finished with a neat hem, which adds a polished look to the overall design. The pillowcase is often used to add a touch of warmth and natural elegance to a room, whether it is placed on a bed, a sofa, or an accent chair. It can be used on its own or paired with other decorative pillows in different shapes and colors to create a layered and cohesive look. Overall, a brown linen decorative pillowcase is a versatile and timeless accent piece that can enhance the comfort and style of any room in the home.",
            "bulletPoints": [],
            "product_keywords": []
        }
    ],
    "personas": []
}

response = requests.post(url, headers=headers, json=payload)
print(response.json())`,
    java: `import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class Main {
    public static void main(String[] args) throws Exception {
        URL url = new URL("https://dev-chgpt-springboot.gspann.com/feature/content/generation");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("version", "1.0.0");
        conn.setRequestProperty("x-api-key", "YOUR_API_KEY");
        conn.setRequestProperty("x-client-id", "YOUR_CLIENT_ID");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        String jsonInputString = "{\\"doContentGen\\":true,\\"doSeo\\":false,\\"doTaxonomy\\":false,\\"useBrandVoice\\":false,\\"taxonomy\\":[],\\"excludeKeywords\\":[],\\"languages\\":[\\"English (US)\\",\\"German (DE)\\",\\"English (GB)\\"],\\"products\\":[{\\"id\\":\\"\\",\\"brand\\":\\"IKEA\\",\\"name\\":\\"Ben Pillow Cover\\",\\"description\\":\\"The Ben Pillow Cover is a brown linen decorative pillowcase used to add visual interest and texture to a room. It is made from a natural linen fabric, which is known for its durability, breathability, and classic look. The pillowcase is designed to fit over a standard size rectangle decorative pillow. It features a neutral brown color that can complement a wide variety of decor styles and color schemes. The linen fabric has a soft and slightly textured surface that adds a cozy and inviting feel to the pillow. The edges of the pillowcase are typically finished with a neat hem, which adds a polished look to the overall design. The pillowcase is often used to add a touch of warmth and natural elegance to a room, whether it is placed on a bed, a sofa, or an accent chair. It can be used on its own or paired with other decorative pillows in different shapes and colors to create a layered and cohesive look. Overall, a brown linen decorative pillowcase is a versatile and timeless accent piece that can enhance the comfort and style of any room in the home.\\",\\"bulletPoints\\":[],\\"product_keywords\\":[]}]}}";

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int code = conn.getResponseCode();
        System.out.println("Response Code: " + code);
    }
}`,
    javascript: `fetch("https://dev-chgpt-springboot.gspann.com/feature/content/generation", {
  method: "POST",
  headers: {
    "version": "1.0.0",
    "x-api-key": "YOUR_API_KEY",
    "x-client-id": "YOUR_CLIENT_ID",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "doContentGen": true,
    "doSeo": false,
    "doTaxonomy": false,
    "useBrandVoice": false,
    "taxonomy": [],
    "excludeKeywords": [],
    "languages": ["English (US)", "German (DE)", "English (GB)"],
    "products": [
      {
        "id": "",
        "brand": "IKEA",
        "name": "Ben Pillow Cover",
        "description": "The Ben Pillow Cover is a brown linen decorative pillowcase used to add visual interest and texture to a room. It is made from a natural linen fabric, which is known for its durability, breathability, and classic look. The pillowcase is designed to fit over a standard size rectangle decorative pillow. It features a neutral brown color that can complement a wide variety of decor styles and color schemes. The linen fabric has a soft and slightly textured surface that adds a cozy and inviting feel to the pillow. The edges of the pillowcase are typically finished with a neat hem, which adds a polished look to the overall design. The pillowcase is often used to add a touch of warmth and natural elegance to a room, whether it is placed on a bed, a sofa, or an accent chair. It can be used on its own or paired with other decorative pillows in different shapes and colors to create a layered and cohesive look. Overall, a brown linen decorative pillowcase is a versatile and timeless accent piece that can enhance the comfort and style of any room in the home.",
        "bulletPoints": [],
        "product_keywords": []
      }
    ],
    "personas": []
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`,
  };

  const handleLanguageChange = (event, newValue) => {
    setSelectedLanguage(newValue);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {overviewData.title}
      </Typography>
      <Typography variant="body1" paragraph style={{ wordWrap: "break-word" }}>
        Welcome to the developer documentation! Follow the steps below to get
        started.
      </Typography>

      {/**Authenticate page  */}
      <Paper className="page-section" elevation={0}>
        <Typography variant="h2">Authentication</Typography>
        <Typography>
          All API requests require authentication using an API key. This key is
          associated with your organization and grants secure access to the API.
        </Typography>
        <List sx={{ width: "60%", bgcolor: "background.paper" }}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>1</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Generate Your API Key!"
              secondary="Navigate to the 'API Keys' section, Click 'Generate New Key' to create a unique API key for your organization"
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>2</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Secure Your API Key"
              secondary="Store your API key securely in environment variables or a secure configuration system"
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>3</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Using Your API Key"
              secondary="Include your API key in the HTTP headers of every request:"
            />
          </ListItem>
        </List>
      </Paper>

      {/*Document the features information */}
      <Paper className="page-section" elevation={0}>
        <Typography variant="h2">Features</Typography>

        <Typography
          variant="body1"
          paragraph
          style={{ wordWrap: "break-word" }}
        >
          Our developer tools provide a powerful suite of content generation and
          optimization capabilities that seamlessly integrate with your
          applications. Transform your content strategy with AI-powered tools
          designed to enhance user engagement and streamline content operations.
        </Typography>

        <List>
          <ListItem>
            <ListItemText
              primary="AI-Powered Content Generation"
              secondary="Create compelling product descriptions and structured bullet points that align with your brand voice and capture key product features."
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="SEO Optimization"
              secondary="Intelligently incorporate keywords into existing product descriptions and bullet points while maintaining natural readability."
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Smart Product Taxonomy"
              secondary="Get accurate category recommendations and maintain consistent product organization across your catalog to improve discoverability."
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Personalized Content Delivery"
              secondary="Tailor content based on user demographics and personas to create more engaging product descriptions."
            />
          </ListItem>
        </List>
      </Paper>

      {/**Example snippets and code sample for client */}

      <Box className="page-section">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">
            Make your first call using below snippets
          </Typography>
          <Select
            value={theme}
            onChange={handleThemeChange}
            variant="outlined"
            size="small"
          >
            <MenuItem value="light">Light Theme</MenuItem>
            <MenuItem value="dark">Dark Theme</MenuItem>
          </Select>
        </Box>

        <AppBar position="static" color="default" sx={{ marginBottom: 2 }}>
          <Tabs
            value={selectedLanguage}
            onChange={handleLanguageChange}
            aria-label="code snippet tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.keys(codeSnippets).map((lang) => (
              <Tab key={lang} label={lang.toUpperCase()} value={lang} />
            ))}
          </Tabs>
        </AppBar>

        <Paper
          elevation={2}
          sx={{
            padding: 2,
            backgroundColor: themes[theme].bg,
            color: themes[theme].text,
            fontFamily: "monospace",
            overflowX: "auto",
          }}
        >
          <SyntaxHighlighter
            language={selectedLanguage}
            style={theme[0].style}
            showLineNumbers
            customStyle={{
              backgroundColor: themes[theme].bg,
              color: themes[theme].text,
              borderRadius: "5px",
              padding: "1em",
            }}
          >
            {codeSnippets[selectedLanguage] || ""}
          </SyntaxHighlighter>
        </Paper>
      </Box>

      {/*Support detail on developer issues */}
      <Paper className="page-section" elevation={0}>
        <Typography variant="h2">Support</Typography>

        <Typography
          variant="body1"
          paragraph
          style={{ wordWrap: "break-word" }}
        >
          Our dedicated support team is here to help you with any technical
          issues or questions.
        </Typography>

        <Box mb={2}>
          <Typography variant="body1">
            Contact our support team at{" "}
            <Typography
              component="span"
              sx={{
                fontFamily: "monospace",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
                padding: "0.2em 0.4em",
                borderRadius: "4px",
              }}
            >
              chgpt-support@gspann.com
            </Typography>{" "}
            for assistance with:
          </Typography>
        </Box>

        <Box
          component="ul"
          sx={{
            paddingLeft: 1,
            marginTop: 1,
            listStyle: "none",
          }}
        >
          {[
            "API integration and implementation questions",
            "API key management and authentication issues",
            "Technical troubleshooting and error resolution",
            "General inquiries about API functionality",
          ].map((point, index) => (
            <Box
              key={index}
              component="li"
              sx={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 1,
                "&::before": {
                  content: '"•"',
                  marginRight: 2,
                  color: "primary.main",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  lineHeight: 1,
                },
              }}
            >
              <Typography variant="body1">{point}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default DocumentationOverview;

const bulletPoints = [
  "API integration and implementation questions",
  "API key management and authentication issues",
  "Technical troubleshooting and error resolution",
  "General inquiries about API functionality",
];
