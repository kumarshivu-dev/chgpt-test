import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Scroll from "../../components/scroll/Scroll";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const HowToGuide = ({ user }) => {
  const [isNavFixed, setIsNavFixed] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 100) {
      setIsNavFixed(true);
    } else {
      setIsNavFixed(false);
    }
  };
  //Function to handle scroll
  const onClickScroll = (sectionId) => {
    //!NOTE: IDs assigned to ListView and Typograpghy sections is not in sync as we need to set the scroll to the correct section
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1" sx={{ textAlign: "center" }}>
            How To Guide
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          direction={{ xs: "column", sm: "column", md: "row" }}
        >
          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("product_spreadsheet")}
          >
            Product Content Generation
          </Button>
          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("seo_keywords_and_enhancement")}
          >
            SEO Keywords and Enhancement
          </Button>
          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("taxonomy")}
          >
            Taxonomy
          </Button>

          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("saving_sharing")}
          >
            Saving and Sharing
          </Button>

          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("image_recognition")}
          >
            Image Recognition
          </Button>

          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("user_management")}
          >
            User Management
          </Button>

          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("brand_voice")}
          >
            Brand Voice
          </Button>

          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("hypertargeting")}
          >
            Hypertargeting
          </Button>

          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("seo_readiness")}
          >
            SEO Readiness
          </Button>

          <Button
            id="product_spreadsheet"
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("compliance")}
          >
            Compliance
          </Button>

          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("integrations")}
          >
            Integrations
          </Button>
          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("branding")}
          >
            Branding
          </Button>
          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("access_api")}
          >
            Access API
          </Button>
          <Button
            variant="outlined"
            sx={{ margin: "2px" }}
            onClick={() => onClickScroll("channel")}
          >
            Channel
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h3" mb={2}>
              Product Content Generation
            </Typography>
            <Typography>
              The first step in using ContentHubGPT is providing minimum
              required product data into the designated columns. This data input
              process offers flexibility—you can either manually input your
              product details or seamlessly import them from an existing
              spreadsheet. Additionally, you have the option to review sample
              data by toggling the button for Sample data. This feature allows
              you to explore and familiarize yourself with the format and
              structure of the data before proceeding with your own input or
              imported spreadsheet.
            </Typography>
            <Typography mt={2}>
              You can enter your data manually using +New Row and populating
              your data in the fields. The fields you’ll encounter are as
              follows:
            </Typography>
            {/* 
            <Box>
              <Typography variant="h6" mt={4}>
                Free Accounts:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Product ID" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Product Name" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Brand" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Keywords" />
                </ListItem>
              </List>
            </Box> */}
            <Box>
              {/* <Typography variant="h6" mt={4}>
                Paid Accounts:
              </Typography> */}
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Product ID" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Product Name" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Brand" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Keywords" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Product Description" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Feature Bullet1" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Feature Bullet2" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Feature Bullet3" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="… etc" />
                </ListItem>
              </List>
            </Box>

            <Typography mt={2}>
              To import your data via spreadsheets, begin by selecting the
              Import option and then choosing the desired method. Ensure that
              your spreadsheet's columns are labeled with the following names:
            </Typography>
            {/* 
            <Box>
              <Typography variant="h6" mt={4}>
                Free Accounts:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="product_id" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="product_name" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="brand" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="keywords" />
                </ListItem>
              </List>
              <Typography>
                Download example spreadsheet:{" "}
                <Link
                  style={{ color: "#022149" }}
                  href="/Example-Product-Upload.xlsx"
                  download
                >
                  Example-Product-Upload.xlsx
                </Link>
              </Typography>
            </Box> */}
            <Box>
              {/* <Typography variant="h6" mt={4}>
                Paid Accounts:
              </Typography> */}
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="product_id" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="product_name" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="brand" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="keywords" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="product_description" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="feature_bullet1" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="feature_bullet2" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="feature_bullet3" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="… etc" />
                </ListItem>
              </List>
              <Typography>
                Download example spreadsheet:{" "}
                <Link
                  style={{ color: "#022149" }}
                  href="/Example-Full-Product-Upload.xlsx"
                  download
                >
                  Example-Full-Product-Upload.xlsx
                </Link>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" mt={4}>
                Column explanation:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        product_id - Unique identifier for the product. This
                        could be SKU, model number, ISBN, or an internal id.
                        <Typography
                          component="span"
                          variant="body2"
                          color="error"
                          fontWeight={900}
                          fontSize={17}
                          pl={0.5}
                        >
                          Required
                        </Typography>
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        product_name - Name/Title of the product.
                        <Typography
                          component="span"
                          variant="body2"
                          color="error"
                          fontWeight={900}
                          fontSize={17}
                          pl={0.5}
                        >
                          Required
                        </Typography>
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        brand - Product brand.
                        <Typography
                          component="span"
                          variant="body2"
                          color="error"
                          fontWeight={900}
                          fontSize={17}
                          pl={0.5}
                        >
                          Required
                        </Typography>
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="keywords - Optional list of comma separated product keywords or keyphrases. If supplied, these will be used as hints when generating product content. " />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="product_description - Optional. If supplied, SEO Keywords from your list will be integrated with the description where appropriate." />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="feature_bullet - Optional. Put one feature per column. The product with the most feature bullets in your upload determines how many times this column should appear. If supplied, SEO Keywords from your list will be integrated with the feature bullets where appropriate" />
                </ListItem>
              </List>
              <Typography>
                Enter your data or import the spreadsheet and click “Generate”.
                Depending on your needs and goals, you can select enhancements
                for your products. For more details, please visit{" "}
                <Link
                  style={{ color: "#022149", wordBreak: "break-all" }}
                  href="/dashboard/pricing"
                  download
                >
                  https://chgpt.gspann.com/dashboard/pricing.
                </Link>
              </Typography>
              <br />
              <Typography>
                Once you've made your enhancement selections, initiate the
                generation process by clicking "Generate." Depending on how many
                products you have chosen, It might take a while to generate the
                results. The generation process happens in the background, so
                you can close the window or browse anywhere else, you will be
                notified via email when the process completes. You can always
                track the progress of your content generation in the Activity
                tab.{" "}
              </Typography>
            </Box>
            <Box mt={4}>
              <Typography variant="h6" mt={4}>
                Content Generation
              </Typography>
              <Typography>
                Content generation writes product descriptions and features for
                you. It utilizes the product brand, the product name, and
                optionally a list of product keywords you supply.
              </Typography>
              {/* <Typography mt={2}>
                Content generation requires some knowledge of the product.
                ChatGPT already knows many products as it was trained on
                internet data. This training concluded around Sept 2021, so if
                your product is newer than that, you will want to add keywords.
              </Typography> */}
              <Typography mt={4}>When to use Product Keywords:</Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="If you simply want more control over the product description or want to give clues to AI about the product, you can specify few keywords." />
                </ListItem>
                {/* <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="If you simply want more control over the product description. " />
                </ListItem> */}
              </List>

              <Typography mt={4}>
                If you want the system to automatically paraphrase your content
                for a more human-like tone, follow these steps:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Navigate to the <strong> Environment Settings </strong>{" "}
                        section in Settings.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Locate the toggle option for{" "}
                        <strong> Paraphrasing </strong> in the settings menu.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Turn the toggle <strong> on </strong> to activate
                        automatic paraphrasing.{" "}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Click <strong> Save Environment Settings </strong> to
                        apply the changes.{" "}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Once the setting is enabled, the system will
                        automatically generate paraphrased content whenever
                        applicable.{" "}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        The rephrased content will maintain the original meaning
                        while adopting a more natural, human-like tone.
                      </span>
                    }
                  />
                </ListItem>
                {/* <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="If you simply want more control over the product description. " />
                </ListItem> */}
              </List>

              <Typography mt={4}>Tips for Best Results:</Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Use clear and concise input text to get the most
                        accurate results.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Experiment with different styles or tones to suit your specific needs." />
                </ListItem>
                <ListItem disablePadding id="seo_keywords_and_enhancement">
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Ensure the rephrased content aligns with your intended message and audience." />
                </ListItem>
                {/* <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="If you simply want more control over the product description. " />
                </ListItem> */}
              </List>
            </Box>
          </Item>
        </Grid>

        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                SEO Keywords and Enhancement
              </Typography>
              <Typography>
                To use this feature, you must supply a comma separated list of
                up to 125 SEO Keywords or Keyphrases you want to target on your
                website. This will be saved to your account so you don’t need to
                supply it each time. You can update your SEO Keywords any time
                you like.
              </Typography>
              <Typography mt={2}>
                You must first have some product content (product_description
                and/or feature_bullets) before it can be SEO Enhanced. If your
                products lack this, be sure to turn on the Content Generation
                feature.
              </Typography>
              <Typography mt={4}>
                This feature does two important tasks:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Combines SEO Keywords With Content.
                        </Typography>{" "}
                        For each product uploaded, the AI will see if any of the
                        SEO Keywords are a good fit for that product. If so, it
                        will reword the description and feature bullets to
                        incorporate these keywords. If NO keywords are a good
                        match for the product, it will skip this step, to avoid
                        awkward results.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Backfills Missing Content.
                        </Typography>{" "}
                        If partial product content is supplied (description but
                        no feature bullets, or feature bullets with no
                        description), the application will use product knowledge
                        and context to fill in the missing content.
                      </span>
                    }
                  />
                </ListItem>
              </List>

              <Typography mt={4}>Suggestions for use:</Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Refresh your content with new SEO Keywords monthly.
                        </Typography>{" "}
                        Keep an unmodified version of your product descriptions
                        to use as a seed. When you get a list of new SEO
                        Keywords, always start with the same seed file as the
                        basis for enhancement. This prevents old keywords from
                        hanging around from month to month.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Do you already have good product descriptions?
                        </Typography>{" "}
                        Then skip the content generation, and only use SEO
                        Enhancement. SEO Enhancement keeps changes to a minimum,
                        and only modifies product content enough to include SEO
                        Keywords where needed.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    id="taxonomy"
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Have a mix of good and bad content?
                        </Typography>{" "}
                        If you want to refresh your content without throwing
                        away everything you have created, you are in luck.
                        Include your existing descriptions and feature bullets
                        in your file, but also turn on the “Generate Content”
                        feature. Your existing content will be used as an input
                        when creating the new content.
                      </span>
                    }
                  />
                </ListItem>
              </List>
            </Box>
          </Item>
        </Grid>

        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Taxonomy
              </Typography>
              <Typography>
                ContentHubGPT can assign products to the best node in your
                taxonomy. Upload a taxonomy spreadsheet to use this feature
                (requires Premium account or above).
              </Typography>
              <Typography mt={2}>
                Each level of your taxonomy should be in a separate column. Each
                row represents a taxonomy node. See file format example below.
              </Typography>
              <Image
                style={{ marginTop: "20px" }}
                src="/taxonomy_example.webp"
                width="300"
                height="204"
                alt="logo"
              ></Image>
              <Typography>
                Download taxonomy example:{" "}
                <Link
                  style={{ color: "#022149" }}
                  href="/Taxonomy-Example.xlsx"
                  download
                >
                  Taxonomy-Example.xlsx
                </Link>
              </Typography>
              <Typography mt={4}>Notes on taxonomy assignment:</Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="ContentHubGPT uses the product brand, name, description and features to pick the taxonomy node that best fits each product." />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Taxonomy assignment is performed after content generation and SEO enhancement are completed." />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Products will only be assigned to complete taxonomy paths. For example, in the table above, products could be assigned to Electronics>Headphones>Wired, but not Electronics>Headphones." />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Taxonomy text can contains letters, numbers, and any of the characters below
: & $ - + &quot; ' , . ! ? ( ) : ; /"
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    id="saving_sharing"
                    primary="In your product file results, a “Taxonomy” column will be appended, with the assigned taxonomy node in the format:  Electronics>Headphones>Wired"
                  />
                </ListItem>
              </List>
            </Box>

            <Scroll showBelow={250} />
          </Item>
        </Grid>

        {/* adsfadsdasjd S */}
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Saving and Sharing
              </Typography>
              <Typography>
                After providing your product data and generating results using
                ContentHubGPT, you have the option to save your work for future
                use. This "Save" feature allows you to store your input product
                data and the generated results in XLSX format within the
                Documents section. The product file will be stored in XLSX
                format within the Documents, allowing you to import the data
                whenever necessary for content generation.
              </Typography>
              <br />
              <Typography id="image_recognition">
                Additionally, you can choose to share your file with others,
                facilitating collaboration or dissemination of information as
                needed.
              </Typography>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Image Recognition
              </Typography>
              <Typography>
                The image recognition feature creates product descriptions and
                feature bullets by inspecting an image you supply as a URL. Like
                the product content generation feature, you can enter the data
                manually or upload a spreadsheet of your data. The AI will fetch
                each image, create a set of labels, perform OCR to read any text
                in the image, and then combine this data with the rest of the
                info you provide in the spreadsheet to generate evocative
                product copy.
              </Typography>
              <Typography mb={2} mt={2}>
                The input fields are as follows:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="ID" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Item" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Keywords" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="Image URL" />
                </ListItem>
              </List>

              <Typography mb={2} mt={2}>
                Input Spreadsheet columns:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="image_id" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="item" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="optional_keywords" />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary="image_url" />
                </ListItem>
              </List>
              <Typography mt={2}>
                There is an example spreadsheet to download under the upload
                form. This spreadsheet gives an example of how you can supply
                your data. The columns are:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Image id -{" "}
                        </Typography>
                        The id of the product depicted in the image.
                        <Typography
                          component="span"
                          variant="body2"
                          color="error"
                          fontWeight={900}
                          fontSize={17}
                          pl={0.5}
                        >
                          Required
                        </Typography>
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Item -{" "}
                        </Typography>
                        the product name. (optional).
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Optional_keywords -{" "}
                        </Typography>
                        hint keywords or keyphrases you can supply that describe
                        some of the product features (optional).
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Image url -{" "}
                        </Typography>
                        a valid url to the image. Must be publicly accessible.
                        Supports jpeg, png, and webp image types.
                        <Typography
                          component="span"
                          variant="body2"
                          color="error"
                          fontWeight={900}
                          fontSize={17}
                          pl={0.5}
                        >
                          Required
                        </Typography>
                      </span>
                    }
                  />
                </ListItem>
              </List>
              <Typography>
                Download Sample Spreadsheet:{" "}
                <Link
                  href="/Image_Rec_Sample.xlsx"
                  style={{ color: "#022149" }}
                >
                  Image_Rec_Sample.xlsx
                </Link>
              </Typography>
              <Typography mt={2}>
                Enter your data, and click “Generate”. It takes a while to
                generate the results. You can always see the progress on the{" "}
                <Typography component="span" fontWeight="bold">
                  Activity
                </Typography>{" "}
                page. You will be emailed a link to the completed output when
                the process is complete, so you can leave the page once it
                starts generating. But it’s also fine to wait.
              </Typography>

              <Typography variant="h6" mb={2} mt={2}>
                Output Spreadsheet:
              </Typography>
              <Typography mt={2}>
                When the generation is complete, download the resulting
                spreadsheet. It will contain the following columns:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          id -{" "}
                        </Typography>
                        same value you uploaded
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          item -{" "}
                        </Typography>
                        same value you uploaded
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          optional keywords -{" "}
                        </Typography>
                        same value you uploaded
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          image url -{" "}
                        </Typography>
                        same value you uploaded
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          labels -{" "}
                        </Typography>
                        words or phrases detected by the AI about your image.
                        These are useful to import into your Digital Asset
                        Management system to make your images keyword
                        searchable.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          alt-text -{" "}
                        </Typography>
                        combines the item name with the “what is item” info.
                        Suitable for use in your website as image alt-text.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          what is Item -{" "}
                        </Typography>
                        what the AI recognized the image as
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Item Description -{" "}
                        </Typography>
                        Product copy in sentence form, designed to inspire and
                        sell the item
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <Typography component="span" sx={{ fontWeight: "900" }}>
                          Feature 1, Feature 2… -{" "}
                        </Typography>
                        Feature bullets, each in it’s own column, so you can
                        format as you see fit.
                      </span>
                    }
                  />
                </ListItem>
              </List>

              <Typography variant="h6" mb={2} mt={2}>
                Troubleshooting:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        The most common problem is improperly formatted urls,
                        which makes the image inaccessible. Check your urls are
                        valid, and that they point to the image ONLY (not a
                        webpage containing the image)
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Some products may be difficult to identify. If you see
                        mis-identification, adding item name and optional
                        keywords guides the Image Recognition and improves
                        results.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    id="user_management"
                    primary={
                      <span>
                        If you have urls you believe should work, but result in
                        an error, contact{" "}
                        <Link
                          style={{ color: "#022149" }}
                          href="mailto:chgpt-support@gspann.com"
                          download
                        >
                          chgpt-support@gspann.com
                        </Link>{" "}
                        and provide the url and the error you receive, and we
                        will diagnose the issue.
                      </span>
                    }
                  />
                </ListItem>
              </List>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                User Management
              </Typography>
              <Typography>
                User management in ContentHubGPT is a vital aspect that empowers
                you to control access, roles, and permissions within the
                platform. This is an admin-only page where admins can manage
                user roles and permissions. There are two user roles: Admin and
                Editor. By default, any new user who subscribes to one of the
                available packages will be assigned the Admin role.
              </Typography>
              <Typography mb={2} mt={2}>
                The number of users allowed for an Organization is controlled by
                the pricing plan for ContentHubGPT that you have subscribed to.
              </Typography>
              <Typography mb={2} mt={2}>
                Admins have comprehensive control and can add, edit, and disable
                users from their organization. They can view all the user's
                activities and content generation history within the
                organization, change plans, and manage documents. Admins can
                only add users up to the limit allowed by their plan and can
                disable active or invited users, which reduces the total user
                count. It is acceptable to have more than one admin in an
                account.
              </Typography>

              <Typography mb={2} mt={2}>
                Editors, on the other hand, have limited permissions. They can
                only view their own activity and do not have the ability to
                change plans or add/disable users.
              </Typography>
              <Typography variant="h6" mb={2} mt={2}>
                Inviting a new user
              </Typography>
              <Typography mb={2} mt={2}>
                Admins can seamlessly invite users directly from this page by
                clicking "+Add New User". A modal will appear, requiring you to
                enter the user's email and select their role (Admin or Editor)
                from a dropdown menu. After entering the details, click "Submit"
                to send an invitation to the user. Upon invitation, users
                receive an email containing an invitation link to join your
                organization.
              </Typography>

              <Typography mt={2}>
                Once users become part of your organization, they gain access to
                the same plan features available to all members. This ensures
                uniformity and fairness, allowing everyone in one organization
                to leverage the full capabilities of our platform. Additionally,
                all user activities within the system, such as document edits,
                file uploads, AI generations, login-logouts, profile updations
                etc. are visible to admins.
              </Typography>

              <Typography mt={2} id="brand_voice">
                In terms of document accessibility, documents saved by any user
                are accessible to all, fostering collaboration. However, varying
                permission levels exist for editing, sharing, or managing
                documents, maintaining data integrity and security.
              </Typography>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>

        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Brand Voice
              </Typography>
              <Typography>
                Define your brand's unique voice and style within ContentHubGPT
                to ensure that all generated content aligns with your brand's
                identity and messaging. Creating and managing your brand voice
                on ContentHubGPT is a straightforward process that allows you to
                define and maintain a consistent tone and style across all your
                generated content. To get started, navigate to the "Settings",
                look for the "Brand Voice" option, where you'll find
                customization tools to tailor your brand voice to your company
                guidelines.
              </Typography>
              <Typography mb={2} mt={2}>
                In the Brand Voice panel, you'll find options to customize your
                brand voice. Begin by defining the keywords, purpose, its tone,
                style, and language characteristics. Consider the tone, style,
                and language that best represent your brand's personality and
                values. With your brand voice settings saved, ContentHubGPT will
                apply defined brand voice to all content generated within your
                organization.
              </Typography>
              <Typography variant="h6" mb={2} mt={2}>
                Review and Adjust as Needed
              </Typography>

              <Typography mb={2} mt={2} id="hypertargeting">
                To maintain relevance and alignment with your brand's evolving
                identity, periodically review and adjust your brand voice
                settings as needed. This allows you to fine-tune and optimize
                your brand voice strategy over time.
              </Typography>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Hypertargeting
              </Typography>
              <Typography>
                ContentHubGPT provides you an effective way to pinpoint and
                engage your ideal audience using Hyper Targeting. It enables the
                generation of content tailored to specific audience segments,
                ensuring effective engagement and relevance.
              </Typography>
              <Typography mb={2} mt={2}>
                To begin, access the Hypertargeting tab under Settings and click
                on “+Create new persona”. Here, you can create the persona by
                including information like Name, Keywords, and a Description of
                the persona.
              </Typography>
              <Typography mb={2} mt={2} id="seo_readiness">
                Once you've created your persona, you can utilize it by
                navigating to the Products tab. Enter your product data there,
                and when you click "Generate," you'll have the option to select
                the persona you've created. . You can choose to use
                ContentHubGPT's default persona, which yields impartial content
                results. This customization allows you to tailor your content
                generation specifically to your targeted audience segments,
                ensuring relevance and enhancing engagement effectively.
              </Typography>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                SEO Readiness
              </Typography>

              <Typography variant="h6" mb={2} mt={2}>
                Prerequisite for a product to be chosen for SEO Readiness:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        The User’s account should have the Company name, valid
                        website URL updated in the profile page.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        The selected product should have the description
                        attached to it.
                      </span>
                    }
                  />
                </ListItem>
              </List>

              <Typography mb={2} mt={2}>
                Once a product is checked and opted for SEO Readiness, the
                application will verify if the provided product description
                incorporates the latest trending keywords for that domain or
                website. The SEO Compliant column on the Product Generation page
                will display the percentage indicating how well selected
                products' descriptions adhere to SEO standards.
              </Typography>
              <Typography variant="h6" mb={2} mt={2}>
                How to use SEO Recommendation keywords:
              </Typography>

              <Typography mb={2} mt={2} id="compliance">
                SEO Recommendations are the suggested top trending keywords
                being used by organizations for their domains. When a user
                toggles on the SEO feature on the enhancement page,
                ContentHubGPT will generate a list of relevant trending keywords
                tailored to the website's URL. ContenthubGPT will then
                incorporate those keywords if they are deemed relevant and a
                good fit for the product's description.
              </Typography>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Compliance
              </Typography>

              <Typography variant="h6" mb={2} mt={2}>
                Compliance Validation:
              </Typography>
              <Typography mb={2} mt={2}>
                Compliance validation is another important feature of the app.
                It ensures that your selected product/s meet the compliance
                requirements set by your organization. Users can upload their
                organization-specific compliance guidelines and policy documents
                in the "Compliance File" section under the Settings menu.
              </Typography>
              <Typography variant="h6" mb={2} mt={2}>
                Prerequisite for a product to be chosen for Compliance
                Validation:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Compliance documents should be uploaded. A maximum of 10
                        documents can be uploaded. The default configuration is
                        set to the Semantic Splitter RAG chunking type. However,
                        users can choose either Sentence or Sentence Window
                        splitters based on their business needs.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        The selected product should have the description
                        attached to it.
                      </span>
                    }
                  />
                </ListItem>
              </List>

              <Typography variant="h6" mb={2} mt={2}>
                How to use Compliance Validation:
              </Typography>

              <Typography mb={2} mt={2} id="integrations">
                Once the Compliance documents are uploaded, navigate to the
                Product Generation page and choose the product that has to be
                validated. Clicking the "Compliance" button will validate your
                selected product against the uploaded documents, indicating
                whether the description is "Compliant" or "Non-Compliant". The
                status will be displayed in the Compliance column. If there are
                any compliance issues, clicking the "Non-Compliant" (red) button
                will display the reasons for non-compliance.
              </Typography>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Integrations
              </Typography>
              <Typography>
                The Integrations feature allows you to seamlessly connect
                ContentHubGPT with various external platforms, ensuring
                consistency across all your connected systems. Stay in control
                and keep all your platforms aligned effortlessly with
                Integrations.
              </Typography>
              <Typography variant="h6" mb={2} mt={2}>
                Steps to Set Up Integrations:
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Navigate to the Integrations section from the main
                        dashboard.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Choose the platform that you want to integrate.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Enter the required data. For example, organization_id
                        for Salsify Integration, store_hash for BigCommerce etc.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<span>Click on Add Integrations. </span>}
                  />
                </ListItem>
              </List>

              <Typography variant="h6" mb={2} mt={2}>
                Benefits of Integrations
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Centralized Limit Deduction: </strong> With
                        Integrations, limit deductions are managed from one
                        central place, ensuring that no matter where content is
                        generated, the deduction is applied consistently across
                        all platforms. This eliminates confusion and streamlines
                        your processes.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Unified Subscription Plan: </strong>
                        Purchase only one subscription plan, and it will apply
                        across all integrated platforms. This simplifies your
                        billing process and ensures consistency in your
                        subscription benefits without the need for multiple
                        plans.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong> Feasibility of Centralized Settings: </strong>
                        Take advantage of a unified settings approach for
                        BrandVoice, persona creation in Hypertargeting, and
                        more. This allows us to streamline configuration in one
                        place, ensuring that the impact of these settings is
                        reflected across platforms like Salsify or BigCommerce.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding id="branding">
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Additional Benefits: </strong>
                        If you're already a paid user of platforms like
                        Bigcommerce or Salsify, integrating them with your
                        account unlocks additional features within
                        ContentHubGPT. Take advantage of enhanced
                        functionalities and improve your overall experience.
                      </span>
                    }
                  />
                </ListItem>
              </List>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Branding
              </Typography>
              <Typography>
                Branding within your organization allows you to bring all your
                distinct brands under one umbrella, enabling you to address
                specific market needs while ensuring alignment with your
                organization’s overall strategy and individual brand
                requirements. Here's how it works:
              </Typography>
              <Typography variant="h6" mb={2} mt={2}>
                Key Features of Branding
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Distinct Brand Identities:</strong> Set up
                        unique brands tailored to different market segments or
                        product lines while ensuring alignment with your
                        organization.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        component="span"
                      >
                        Role-Based Access:
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem disablePadding sx={{ paddingLeft: "30px" }}>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordOutlinedIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Org Admin Access:</strong> Only organization
                        admins can add or manage brands within the organization.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding sx={{ paddingLeft: "30px" }}>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordOutlinedIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Brand Admin Access:</strong> Brand admins can
                        add or manage members and other Brand settings within
                        their assigned brand only.
                      </span>
                    }
                  />
                </ListItem>

                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong> Shared Membership: </strong>
                        Users can belong to multiple brands within the
                        organization.
                      </span>
                    }
                  />
                </ListItem>
              </List>

              <Typography variant="h6" mb={2} mt={2}>
                Create a Brand
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        From the dashboard, go to the organization settings
                        section under settings menu.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Click on the "Add” button present on the right corner of
                        Brand List info. Enter the brand name, and other
                        relevant details. Make sure the brand reflects a
                        distinct identity while staying aligned with your
                        organization.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Choose the appropriate tone and style for the brand’s
                        content. This can differ from the organization brand’s
                        voice.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding id="access_api">
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Customize the brand’s brand voice, Hypertargeting
                        personas, etc. to fit its specific needs.
                      </span>
                    }
                  />
                </ListItem>
              </List>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Access API
              </Typography>
              <Typography>
                The Access API feature in ContentHubGPT enables you to interact
                programmatically with your data and seamless integration with
                your existing systems. Follow these steps to get started:
              </Typography>
              <Typography variant="h6" mb={2} mt={2}>
                Generate API Credentials
              </Typography>
              <List
                sx={{ width: "100%", bgcolor: "background.paper" }}
                aria-label="contacts"
              >
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        <strong>Log in</strong> to your ContentHubGPT account.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Navigate to the <strong>Integrations</strong> section in
                        the dashboard.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Locate Access API and click on Register. The Client ID
                        will be generate and you will be able to click on
                        Explore. Click on Explore and you will be navigated to
                        the Developer section.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        component="span"
                      >
                        Generate your API key:
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem disablePadding sx={{ paddingLeft: "30px" }}>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordOutlinedIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Click on <strong>API Keys.</strong>
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding sx={{ paddingLeft: "30px" }}>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordOutlinedIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<span>Click on Generate New API key.</span>}
                  />
                </ListItem>
                <ListItem disablePadding sx={{ paddingLeft: "30px" }}>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordOutlinedIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText primary={<span>Save the key securely.</span>} />
                </ListItem>
                <Typography sx={{ mt: 1 }}>
                  <strong>Note:</strong> You won’t be able to view it again.
                </Typography>

                <Typography variant="h6" mb={2} mt={2}>
                  Understand API Documentation
                </Typography>

                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Click the <strong>API Documentation</strong> link in the
                        same Developer section.
                      </span>
                    }
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: "30px" }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span>
                        Review the documentation to understand all the available
                        endpoints, required authentication methods and response
                        formats.
                      </span>
                    }
                  />
                </ListItem>
              </List>

              <Typography variant="h6" mb={2} mt={2}>
                Make API Requests
              </Typography>

              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span>
                      Use an API client such as <strong>Postman</strong> or a
                      programming language to send requests.
                    </span>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span>
                      Include your API key in the request headers for
                      authentication.
                    </span>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span>Test the connection with a basic endpoint.</span>
                  }
                />
              </ListItem>
              <Typography variant="h6" mb={2} mt={2}>
                Integrate into Your Workflow
              </Typography>

              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span>Identify the key tasks you want to integrate.</span>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span>
                      Use the relevant endpoints for fetching data or sending
                      updates.
                    </span>
                  }
                />
              </ListItem>

              <Typography variant="h6" mb={2} mt={2}>
                Ensure Security
              </Typography>

              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                </ListItemIcon>
                <ListItemText
                  primary={<span>Rotate API keys periodically.</span>}
                />
              </ListItem>
              <ListItem disablePadding id="channel">
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span>
                      Do not share your API key publicly or in unsecured
                      repositories.
                    </span>
                  }
                />
              </ListItem>
              <Typography sx={{ mt: 1 }}>
                By following these steps, you can make the most of the Access
                API in ContentHubGPT, simplifying your workflows and improving
                efficiency. For additional support, check the API documentation
                or reach out to our support team.
              </Typography>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Box>
              <Typography variant="h3" mb={2}>
                Channel
              </Typography>
              <Typography>
                The Channel feature allows users to generate content tailored to
                the specific channels configured for their products. Users can
                create multiple channels and select them during the content
                generation process to produce product descriptions that align
                with the settings defined in the Channel settings. This ensures
                that the product description remains consistent with the desired
                channels.
              </Typography>
              <Typography mb={2} mt={2}>
                To create a channel, users can follow this path:{" "}
                <Typography fontWeight={"bold"} component="span">
                  Settings (left panel) → Channel settings → Create new
                </Typography>
              </Typography>
              <Typography mb={2} mt={2}>
                In the channel configuration page, users can adjust the
                description length, specify highlights (key traits for feature
                bullet content), and set the number of feature bullets for the
                product.
              </Typography>
            </Box>
            <Scroll showBelow={250} />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HowToGuide;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      props: {},
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}
