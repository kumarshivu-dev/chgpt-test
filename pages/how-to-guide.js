import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Button } from '@mui/material';
import { getSession, useSession, signOut } from "next-auth/react";
import { styled } from '@mui/material/styles';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import Scroll from "../components/scroll/Scroll";
import { Link as ScrollLink } from 'react-scroll';
import Link from 'next/link';
import Image from "next/image";



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

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (

        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h1" sx={{ textAlign: "center" }}>How To Guide</Typography>
                </Grid>
                <Grid item xs={12} direction={{ xs: 'column', sm: 'column', md: 'row' }}>
                    
                        <ScrollLink to="product_spreadsheet" smooth={true} duration={500}>
                                <Button variant="outlined" sx={{margin: '2px'}}>Product Spreadsheet</Button>
                        </ScrollLink>
                        <ScrollLink to="content_generation" smooth={true} duration={500}>
                        <Button variant="outlined" sx={{ margin: '2px' }}>Content Generation</Button>
                        </ScrollLink>
                            <ScrollLink to="seo_keywords_and_enhancement" smooth={true} duration={500}>
                        <Button variant="outlined" sx={{ margin: '2px' }}>SEO Keywords and Enhancement</Button>
                        </ScrollLink>
                            <ScrollLink to="taxonomy" smooth={true} duration={500}>
                        <Button variant="outlined" sx={{ margin: '2px'}}>Taxonomy</Button>
                        </ScrollLink>
                        <ScrollLink to="image_recognition" smooth={true} duration={500}>
                            <Button variant="outlined" sx={{ margin: '2px'}}>Image Recognition</Button>
                        </ScrollLink>
                    
                </Grid>
                <Grid item xs={12} id="product_spreadsheet">
                    <Item>
                        <Typography variant="h3" mb={2}>Product Spreadsheet</Typography>
                        <Typography>The first step in using ContentHubGPT is always to upload your product spreadsheet.  The spreadsheet content will vary, depending on your user type and intended use.</Typography>
                        <Typography mt={2}>The allowed spreadsheet columns are as follows:</Typography>
                        <Box>
                            <Typography variant='h6' mt={4}>Free Accounts:</Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="product_id" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="product_name" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="brand" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="keywords" />
                                </ListItem>

                            </List>
                            <Typography>Download example spreadsheet: <Link style={{color: '#fb9005'}} href="/Example-Product-Upload.xlsx" download>Example-Product-Upload.xlsx</Link></Typography>
                        </Box>
                        <Box>
                            <Typography variant='h6' mt={4}>Paid Accounts:</Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="product_id" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="product_name" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="brand" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="keywords" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="product_description" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="feature_bullet1" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="feature_bullet2" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="feature_bullet3" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="… etc" />
                                </ListItem>

                            </List>
                            <Typography>Download example spreadsheet: <Link style={{color: '#fb9005'}} href="/Example-Full-Product-Upload.xlsx" download>Example-Full-Product-Upload.xlsx</Link></Typography>

                        </Box>

                        <Box>
                            <Typography variant='h6' mt={4}>Column explanation:</Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            product_id - Unique identifier for the product. This could be SKU, model number, ISBN, or an internal id.{' '}
                                            <Typography component="span" variant="body2" color="error" fontWeight={900}  fontSize={17}>
                                                Required
                                            </Typography>
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={<span>product_name - Name of the product.{' '}
                                        <Typography component="span" variant="body2" color="error" fontWeight={900}  fontSize={17}>
                                             Required
                                        </Typography>
                                        </span>} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={<span>brand - Product brand.{' '}<Typography component="span" variant="body2" color="error" fontWeight={900} fontSize={17}>
                                        Required
                                    </Typography></span>} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="keywords - Optional list of comma separated product keywords or keyphrases. If supplied, these will be used as hints when generating product content. " />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="product_description - Optional. If supplied, SEO Keywords from your list will be integrated with the description where appropriate." />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="feature_bullet - Optional. Put one feature per column. The product with the most feature bullets in your upload determines how many times this column should appear. If supplied, SEO Keywords from your list will be integrated with the feature bullets where appropriate." />
                                </ListItem>
                            </List>
                        </Box>
                    </Item>

                </Grid>
                <Grid item xs={12} id="content_generation">
                    <Item>
                        <Box>
                            <Typography variant='h3' mb={2}>Content Generation</Typography>
                            <Typography>Content generation writes product descriptions and features for you. It utilizes the product brand, the product name, and optionally a list of product keywords you supply. </Typography>
                            <Typography mt={2}>Content generation requires some knowledge of the product. ChatGPT already knows many products as it was trained on internet data. This training concluded around Sept 2021, so if your product is newer than that, you will want to add keywords.</Typography>
                            <Typography mt={4}>When to use Product Keywords:</Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="If the product was introduced after mid-2021." />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="If you simply want more control over the product description. " />
                                </ListItem>
                            </List>
                        </Box>
                    </Item>
                </Grid>

                <Grid item xs={12} id="seo_keywords_and_enhancement">
                    <Item>
                        <Box>
                            <Typography variant='h3' mb={2}>SEO Keywords and Enhancement</Typography>
                            <Typography>To use this feature, you must supply a comma separated list of up to 125 SEO Keywords or Keyphrases you want to target on your website. This will be saved to your account so you don’t need to supply it each time. You can update your SEO Keywords any time you like. </Typography>
                            <Typography mt={2}>You must first have some product content (product_description and/or feature_bullets) before it can be SEO Enhanced.  If your products lack this, be sure to turn on the Content Generation feature. </Typography>
                            <Typography mt={4}>This feature does two important tasks:</Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={<span><Typography component="span"  sx={{fontWeight: '900'}}>Combines SEO Keywords With Content.</Typography> For each product uploaded, the AI will see if any of the SEO Keywords are a good fit for that product. If so, it will reword the description and feature bullets to incorporate up to five keywords. If NO keywords are a good match for the product, it will skip this step, to avoid awkward results.</span>} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={<span><Typography component="span"  sx={{fontWeight: '900'}}>Backfills Missing Content.</Typography> If partial product content is supplied (description but no feature bullets, or feature bullets with no description), the application will use product knowledge and context to fill in the missing content. </span>} />
                                </ListItem>
                            </List>

                            <Typography mt={4}>Suggestions for use:</Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={<span><Typography component="span" sx={{ fontWeight: '900' }}>Refresh your content with new SEO Keywords monthly.</Typography> Keep an unmodified version of your product descriptions to use as a seed. When you get a list of new SEO Keywords, always start with the same seed file as the basis for enhancement.  This prevents old keywords from hanging around from month to month.</span>} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={<span><Typography component="span" sx={{ fontWeight: '900' }}>Do you already have good product descriptions?</Typography>  Then skip the content generation, and only use SEO Enhancement. SEO Enhancement keeps changes to a minimum, and only modifies product content enough to include SEO Keywords where needed.</span>} />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={<span><Typography component="span" sx={{ fontWeight: '900' }}>Have a mix of good and bad content?</Typography> If you want to refresh your content without throwing away everything you have created, you are in luck. Include your existing descriptions and feature bullets in your file, but also turn on the “Generate Content” feature. Your existing content will be used as an input when creating the new content.</span>} />
                                </ListItem>
                            </List>
                        </Box>
                    </Item>
                </Grid>

                <Grid item xs={12} id="taxonomy">
                    <Item>
                        <Box>
                            <Typography variant='h3' mb={2}>Taxonomy</Typography>
                            <Typography>ContentHubGPT can assign products to the best node in your taxonomy.  Upload a taxonomy spreadsheet to use this feature (requires Premium account or above).</Typography>
                            <Typography mt={2}>Each level of your taxonomy should be in a separate column. Each row represents a taxonomy node. See file format example below.</Typography>
                            <Image style={{marginTop: '20px'}} src="/taxonomy_example.png" width="413" height="204" alt="logo"></Image>
                            <Typography>Download taxonomy example: <Link style={{color: '#fb9005'}} href="/Taxonomy-Example.xlsx" download>Taxonomy-Example.xlsx</Link></Typography>
                            <Typography mt={4}>Notes on taxonomy assignment:</Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="ContentHubGPT uses the product brand, name, description and features to pick the taxonomy node that best fits each product." />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Taxonomy assignment is performed after content generation and SEO enhancement are completed." />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Products will only be assigned to complete taxonomy paths. For example, in the table above, products could be assigned to Electronics>Headphones>Wired,  but not Electronics>Headphones.   " />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="Taxonomy text can contains letters, numbers, and any of the characters below
: & $ - + &quot; ' , . ! ? ( ) : ; /" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary="In your product file results, a “Taxonomy” column will be appended, with the assigned taxonomy node in the format:  Electronics>Headphones>Wired" />
                                </ListItem>
                            </List>
                        </Box>

                        <Scroll showBelow={250} />
                    </Item>
                </Grid>

                <Grid item xs={12} id="image_recognition">
                    <Item>
                        <Box>
                            <Typography variant='h3' mb={2}>Image Recognition</Typography>
                            <Typography>The image recognition feature creates product descriptions and feature bullets by inspecting an image you supply as a URL.  Like the other features, you upload a spreadsheet of your data.  The AI will fetch each image, create a set of labels, perform OCR to read any text in the image, and then combine this data with the rest of the info you provide in the spreadsheet to generate evocative product copy. </Typography>
                            <Typography variant='h6' mb={2} mt={2}>Input Spreadsheet:</Typography>
                            <Typography mt={2}>There is an example spreadsheet to download under the upload form. This spreadsheet gives an example of how you can supply your data. The columns are:
                            </Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>id - </Typography>
                                            The id of the product depicted in the image (optional)
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>item - </Typography>
                                            the product name. (optional, but recommended)
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>optional keywords - </Typography>
                                            hint keywords or keyphrases you can supply that describe some of the product features (optional).
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>image url - </Typography>
                                            a valid url to the image. Must be publicly accessible. Supports jpeg, png, and webp image types.
                                            <Typography component="span" variant="body2" color="error" fontWeight={900}  fontSize={17} pl={2}>
                                                Required
                                            </Typography>
                                        </span>
                                    } />
                                </ListItem>
                            </List>
                            <Typography>Download Sample Spreadsheet: <Link href="/Image_Rec_Sample.xlsx" style={{color: '#fb9005'}}>Image_Rec_Sample.xlsx</Link></Typography>
                            <Typography mt={2}>Edit the spreadsheet to contain your product images, upload it, and click “Generate”.   It takes a while to generate the results. You will be emailed a link to the completed output when the process is complete, so you can leave the page once it starts generating. But it’s also fine to wait.
                            </Typography>

                            <Typography variant='h6' mb={2} mt={2}>Output Spreadsheet:</Typography>
                            <Typography mt={2}>When the generation is complete, download the resulting spreadsheet. It will contain the following columns:
                            </Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>id - </Typography>
                                            same value you uploaded
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>item - </Typography>
                                            same value you uploaded
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>optional keywords - </Typography>
                                            same value you uploaded
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>image url - </Typography>
                                            same value you uploaded
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>labels - </Typography>
                                            words or phrases detected by the AI about your image. These are useful to import into your Digital Asset Management system to make your images keyword searchable.
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>alt-text - </Typography>
                                            combines the item name with the “what is item” info. Suitable for use in your website as image alt-text.
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>what is Item - </Typography>
                                            what the AI recognized the image as
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>Item Description - </Typography>
                                            Product copy in sentence form, designed to inspire and sell the item
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            <Typography component="span" sx={{ fontWeight: '900' }}>Feature 1, Feature 2… - </Typography>
                                            Feature bullets, each in it’s own column, so you can format as you see fit.
                                        </span>
                                    } />
                                </ListItem>
                            </List>

                            <Typography variant='h6' mb={2} mt={2}>Troubleshooting:</Typography>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                aria-label="contacts"
                            >
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            The most common problem is improperly formatted urls, which make the image inaccessible. Check your urls are valid, and that they point to the image ONLY (not a webpage containing the image)
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            Some products may be difficult to identify. If you see mis-identification, adding item name and optional keywords guides the Image Recognition and improves results.
                                        </span>
                                    } />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemIcon sx={{ minWidth: '30px' }}>
                                        <FiberManualRecordIcon sx={{ fontSize: 10 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <span>
                                            If you have urls you believe should work, but result in an error, contact <Link style={{color: '#fb9005'}} href="mailto:support@zorang.com" download>support@zorang.com</Link> and provide the url and the error you receive, and we will diagnose the issue.
                                        </span>
                                    } />
                                </ListItem>
                            </List>
                        </Box>
                        <Scroll showBelow={250} />
                    </Item>
                </Grid>

            </Grid>

        </Box>
    );

}


export default HowToGuide;

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return {
            props: {}
        }
    }
    const { user } = session;
    return {
        props: { user },
    }
}