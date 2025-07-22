import React, { useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, Typography, CircularProgress } from "@mui/material";
import axios from "axios";


const demoProducts = [
    { id: 1, name: "Bersache Premium Grey Sports Gym Trending Stylish Running Shoes for Men", description: "Men SPORTS SHOES from the newest Bersache collection are presented. VERY DURABLE MATERIAL LIGHTWEIGHT AND COMFORTABLE made of a substance that is incredibly durable. Excellent Sole for Enhanced Flexibility and Bounce when Moving This shoe is quite comfortable sturdy and slip-resistant. a wonderful option for daily wear footwear. Every stride appears airy and light thanks to distinctive style and durable materials. With this fashionable pair of sports shoes from the Bersache brand up your sense of style. Any pair of jeans will look excellent with it. Ideal for all occasions and physical pursuits including partying running bicycling hiking the gym and jogging. Bersache's athletic and everyday footwear is ideal. A trendy collection of footwear that goes with your current look Make your casual attire unique. Put on these Bersache shoes to look elegant. We offer the most fashionable and comfortable shoes sandals and slippers available so that customers can feel and look their best. The truest representation of comfort and style is a smile so when we see people grinning we know we've done our job." },
    { id: 2, name: "Bingo! Original Style Chilli Sprinkled - Flat Cut Spicy Potato Chips Pack for Snacks – 90g", description: "Whoever looked at the potato in the ground and decided to eat it, was a true visionary. Because if it wasn’t for him/ her, centuries later we wouldn’t have had the brilliant idea of making crispy potato chips! Tear open a pack of Bingo! Original Style Chilli Sprinkled and enjoy some yummy, masala chips. We Indians love our spices and spicy food. The taste of bland food makes us head straight for our spice box for some chilli to add zing to our otherwise bland food. No dish is relished without chilli. And no demons can also be warded off without chillies. So why not add it to our snacks as well! The crispy potato chips are generously seasoned with chilli which ensures an explosion of spicy flavour bomb in our mouths. Whether you’re bored in a meeting, watching your screens buffer or waiting for your games to load. Just add some spice to your life with a bag of Bingo! Original Style Chilli Sprinkled potato chips." },
    { id: 3, name: "Action Pro™ Made in India (6-Month Warranty) Universal 360 Tripod Adapter | Phone Tripod Mount | Cell Phone Holder Mount Adapter", description: "Make Your Cell Phone Photography Stand Out. Get the best phone tripod mount so you concentrate on making the best content. When your creating awesome content, the last thing you should have to worry about is your equipment. The UniMount 360 does everything you need it to and more while providing the durability and reliability your phone photography & cinematography deserve. Produce sharper shots with less vibration thanks to the strong and stable base. Quickly switch between landscape or portrait modes in seconds." },
    { id: 4, name: "Usha ICHEF Food Processor 800 Watts Copper Motor with 9 Accessories & 8 Functions (Black)", description: "Experience culinary excellence with the iChef Food Processor, an all-in-one kitchen marvel designed to elevate your cooking game. This versatile appliance comes equipped with 9 essential accessories, enabling a range of cooking tasks. It features 8 different functions, including chopping, kneading, shredding, French fries preparation, citrus juicing, grinding, blending, and slicing. Its 1.4-liter transparent food processing bowl not only offers ample capacity but also allows you to monitor the process, ensuring your ingredients are precisely processed to perfection.", page_url: "https://www.inalsaappliances.com" },
    { id: 5, name: "HOPPER Rampage N/IBC 20T Kids Fat Bike with Front Suspension & Dual Dual DIsc Brake | Bicycle for Boys & Girls 5-8Years| Frame Size- 14 Inch | 90% Pre-Assembled | (White)", description: "Introducing the Rampage N/IBC; a high-performance bicycle designed for kids 5-8 years old. This 20 frame is made with semi-fat tires for increased stability, grip, and durability. It's equipped with reliable dual disc brakes and front suspension for greater safety and responsiveness. This bike also comes in two attractive colors – white and yellow – and it's 85% preassembled so you can put it together in a snap. With its outstanding design and features, the Rampage N/IBC will become the perfect ride for your child." },
    { id: 6, name: "AGARO RELAXO Electric Handheld Full Body Massager with 8 Massage Heads, 5 mode & 6 speed settings for pain relief & relaxation", description: "Percussion technology helps in relaxation & pain relief via deep tissue stimulation, 8 detachable massage heads for a holistic body massage, 5 Vibration Modes & 6 speed settings I Finger-touch button operation, Cloth Mesh cover to avoid tangling of body hair during massage, Compact Handheld Design, 1 Year Manufacturer's Warranty." },
    { id: 7, name: "Usha ICHEF Food Processor 800 Watts Copper Motor with 9 Accessories & 8 Functions (Black)", description: "", page_url: "https://www.inalsaappliances.com", "new_implementation": true },
    { id: 8, name: "Usha ICHEF Food Processor 800 Watts Copper Motor with 9 Accessories & 8 Functions (Black)", description: "Experience culinary excellence with the iChef Food Processor, an all-in-one kitchen marvel designed to elevate your cooking game. This versatile appliance comes equipped with 9 essential accessories, enabling a range of cooking tasks. It features 8 different functions, including chopping, kneading, shredding, French fries preparation, citrus juicing, grinding, blending, and slicing. Its 1.4-liter transparent food processing bowl not only offers ample capacity but also allows you to monitor the process, ensuring your ingredients are precisely processed to perfection.", page_url: "https://www.inalsaappliances.com", "new_implementation": true },
    { id: 9, name: "AGARO RELAXO Electric Handheld Full Body Massager with 8 Massage Heads, 5 mode & 6 speed settings for pain relief & relaxation", description: "", page_url: "https://agarolifestyle.com/collections/hand-held", "new_implementation": true },
    { id: 10, name: "AGARO RELAXO Electric Handheld Full Body Massager with 8 Massage Heads, 5 mode & 6 speed settings for pain relief & relaxation", description: "Percussion technology helps in relaxation & pain relief via deep tissue stimulation, 8 detachable massage heads for a holistic body massage, 5 Vibration Modes & 6 speed settings I Finger-touch button operation, Cloth Mesh cover to avoid tangling of body hair during massage, Compact Handheld Design, 1 Year Manufacturer's Warranty.", page_url: "https://agarolifestyle.com/collections/hand-held", "new_implementation": true },
    { id: 11, name: "Bingo! Original Style Chilli Sprinkled - Flat Cut Spicy Potato Chips Pack for Snacks – 90g", description: "", page_url: "https://bingosnacks.com/", "new_implementation": true },
    { id: 12, name: "Bingo! Original Style Chilli Sprinkled - Flat Cut Spicy Potato Chips Pack for Snacks – 90g", description: "Whoever looked at the potato in the ground and decided to eat it, was a true visionary. Because if it wasn’t for him/ her, centuries later we wouldn’t have had the brilliant idea of making crispy potato chips! Tear open a pack of Bingo! Original Style Chilli Sprinkled and enjoy some yummy, masala chips. We Indians love our spices and spicy food. The taste of bland food makes us head straight for our spice box for some chilli to add zing to our otherwise bland food. No dish is relished without chilli. And no demons can also be warded off without chillies. So why not add it to our snacks as well! The crispy potato chips are generously seasoned with chilli which ensures an explosion of spicy flavour bomb in our mouths. Whether you’re bored in a meeting, watching your screens buffer or waiting for your games to load. Just add some spice to your life with a bag of Bingo! Original Style Chilli Sprinkled potato chips.", page_url: "https://bingosnacks.com/", "new_implementation": true },

];



const Seokeywords = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [extractedKeywords, setExtractedKeywords] = useState([]);
    const [highValueKeywords, setHighValueKeywords] = useState([]);
    const [productDescription, setProductDescription] = useState([]);
    const [productTableReloader, setProductTableReloader] = useState(false);
    const [newProductDescription, setNewProductDescription] = useState(false);


    const extractKeywords = async (description) => {
        try {
            setProductTableReloader(true)
            console.log("not calling this?")
            const response = await axios.post("http://localhost:8000/adsense/extract-keywords", { description });
            const keywords = response.data.extracted_keywords || [];
            setProductTableReloader(false)
            return keywords;
        } catch (error) {
            console.error("Error extracting keywords:", error);
            return [];
        }
    };

    const handleProductChange = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const selectedProductData = demoProducts.filter(product => selectedProducts.includes(product.id));
        if (selectedProductData[0].new_implementation) {
            setProductTableReloader(true)
            setProductDescription(selectedProductData[0].description)
            try {
                const requestData = {
                    customer_id: "5304609207",
                    location_ids: ["1023191"],
                    language_id: "1000",
                    keyword_texts: selectedProductData[0].name,
                    page_url:selectedProductData[0].page_url,
                };

                const response = await axios.post("http://localhost:8000/adsense/generatekeywords", requestData);
                const highValueKeywords = response.data.keyword_results.filter(keyword => keyword.avg_monthly_searches > 0);
                const keywordTexts = highValueKeywords.map(keyword => keyword.keyword_text);
                setHighValueKeywords(keywordTexts);
                setProductTableReloader(false)
            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            const descriptions = selectedProductData.map(product => product.description);
            // extract keywords from descriptions with nlp
            try {
                setProductTableReloader(true)
                const keywordsArray = await Promise.all(descriptions.map(description => extractKeywords(description)));
                const newExtractedKeywords = keywordsArray.flat();
                setExtractedKeywords(newExtractedKeywords);
                setProductDescription(selectedProductData[0].description)

                const requestData = {
                    customer_id: "5304609207",
                    location_ids: ["1023191"],
                    language_id: "1000",
                    keyword_texts: newExtractedKeywords
                };

                const response = await axios.post("http://localhost:8000/adsense/generatewithmultiplekeywords", requestData);
                handleNewGeneratedKeyWords(response.data.keyword_results, descriptions.join(" "));
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    const handleNewGeneratedKeyWords = (keywordResults, description) => {
        const highValueKeywords = keywordResults
            .filter(result => result.highest_search_value > 0)
            .map(result => result.highest_search_keyword);
        //get high value keywords to jsx
        setHighValueKeywords(highValueKeywords);
        const requestData = {
            highvalue_keywords: highValueKeywords,
            description: description
        };
        setProductTableReloader(false)
        console.log("Request data for handleGenerateNewDescription:", requestData);
    };

    const auditproductdescription = async () => {
        console.log("in product description")
        console.log("auditproductdescription", productDescription)
        console.log("highvaluekeywords", highValueKeywords)
        const requestData = {
            description: productDescription,
            high_value_keywords: highValueKeywords,
        };
        const response = await axios.post("http://localhost:8000/adsense/analyze-description", requestData);
        console.log(response.data)
    };


    const handleGenerateNewDescription = async () => {
        setProductTableReloader(true)
        console.log(productDescription)
        console.log(highValueKeywords)

        const requestData = {
            description: productDescription,
            highvalue_keywords: highValueKeywords,
        };

        const response = await axios.post("http://localhost:8000/adsense/generatenewdescription", requestData);
        console.log(response.data.generatedresult)
        setNewProductDescription(response.data.generatedresult)
        setProductTableReloader(false)
    }

    return (
        <Box sx={{ width: "100%" }}>
            {
                productTableReloader ?
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            // height: "100%",
                            top: "50%",
                            left: "50%",
                            position: "absolute"
                        }}
                    >
                        <CircularProgress size="3rem" />
                    </Box> : <></>
            }
            <form onSubmit={handleSubmit}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Select</TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {demoProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedProducts.includes(product.id)}
                                            onChange={() => handleProductChange(product.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Audit Product
                </Button>
            </form>
            {extractedKeywords.length > 0 && (
                <Box mt={2}>
                    <Typography variant="h6">Keywords Extracted:</Typography>
                    <Typography>{extractedKeywords.join(", ")}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateNewDescription}
                        sx={{ mt: 2 }}
                    >
                        Generate New Description
                    </Button>
                </Box>
            )}

            {highValueKeywords.length > 0 && (
                <Box mt={2}>
                    <Typography variant="h6">High Value Keywords:</Typography>
                    <Typography>{extractedKeywords.join(", ")}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateNewDescription}
                        sx={{ mt: 2 }}
                    >
                        Generate New Description
                    </Button>
                </Box>
            )}

            {highValueKeywords.length > 0 && (
                <Box mt={2}>
                    <Typography variant="h6">High-Value Keywords:</Typography>
                    <Typography>{highValueKeywords.join(", ")}</Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={auditproductdescription}
                        sx={{ mt: 2 }}
                    >
                        Check Your Description Readiness
                    </Button>
                </Box>
            )}

            {
                newProductDescription ?
                    <Box mt={2}>
                        <Typography variant="h6">New Generated Description:</Typography>
                        <Typography>{newProductDescription}</Typography>
                    </Box> : <></>
            }
        </Box>
    );
};

export default Seokeywords;

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
            user,
        },
    };
}
