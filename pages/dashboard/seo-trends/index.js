// pages/dashboard/seo-trends/index.js
import { Box, Typography, Grid, Card, Button, CircularProgress, Checkbox, FormControlLabel, Backdrop } from "@mui/material";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { POST_GENERATE_KEYWORDS, POST_TRACK_KEYWORDS } from "../../../utils/apiEndpoints";
import { useBrandDisplay } from "../../../hooks/data/useBrandDisplay";
import { PLATFORM_DEFAULT } from "../../../constants/globalvars";
import { useToast } from "../../../context/ToastContext";
import { GET_SEO_REPORT } from "../../../utils/apiEndpoints";




const getTrendIcon = (trend) => {
    if (trend === "up") return "📈";
    if (trend === "down") return "📉";
    return "➖";
};

const getSentiment = (popularity) => {
    if (popularity >= 8) return "👍"; // very positive
    if (popularity >= 5) return "🤔"; // neutral
    return "👎"; // negative
};

export default function SEOTrendsPage({ user }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [keywordsLoading, setKeywordsLoading] = useState(false);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [keywords, setKeywords] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [trends, setTrends] = useState([]);
    const [step, setStep] = useState("generate"); // "generate", "select", "results"

    const {
        displayName,
        brandUrl,
        isSpecificBrand,
        brandId,
        isActive,
        brandLanguages,
        defaultLanguage,
    } = useBrandDisplay();
    const userState = useSelector((state) => state.user);
    const websiteUrl = userState?.userInfo?.websiteUrl;

    useEffect(() => {
        if (selectedKeywords.length > 5) {
            showToast("You can select up to 5 keywords only", "error");
        }
    }, [selectedKeywords]);

    useEffect(() => {
        const savedReport = localStorage.getItem("seo_report");
        const savedTrends = localStorage.getItem("seo_trends");
        if (savedReport && savedTrends) {
            setTrends(JSON.parse(savedTrends));
            setStep("results");
        }
    }, []);



    const { showToast } = useToast();


    // Function to handle keyword generation
    const handleGenerateKeywords = async () => {
        setKeywordsLoading(true);
        try {
            const config = { headers: { Authorization: user?.id_token } };
            const requestData = {
                page_url: brandUrl || websiteUrl,
                source: "website",
                language: PLATFORM_DEFAULT,
            }

            const response = await axios.post(
                process.env.NEXT_PUBLIC_BASE_URL + POST_GENERATE_KEYWORDS,
                requestData,
                config
            );

            setKeywords(response?.data?.keyword_results || []);
            setStep("select");
        } catch (error) {
            console.error("Error generating keywords:", error);
        } finally {
            setKeywordsLoading(false);
        }
    };

    // Function to handle keyword selection toggle
    const handleKeywordToggle = (keywordObj) => {
        setSelectedKeywords((prev) => {
            // Check if the keyword object is already selected (by comparing keyword_text)
            const isSelected = prev.some(k => k.keyword_text === keywordObj.keyword_text);

            if (isSelected) {
                return prev.filter(k => k.keyword_text !== keywordObj.keyword_text);
            } else {
                return [...prev, keywordObj];
            }
        });
    };

    // Function to track selected keywords
    const handleTrackKeywords = async () => {
        if (selectedKeywords.length === 0) {
            alert("Please select at least one keyword to track");
            return;
        }

        setTrackingLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: user?.id_token,
                },
            };

            // Extract keyword_text from each selected keyword object
            const keywordTexts = selectedKeywords.map(k => k.keyword_text);

            const requestData = {
                keywords: keywordTexts,
                source: "website"
            };

            const response = await axios.post(
                process.env.NEXT_PUBLIC_BASE_URL + POST_TRACK_KEYWORDS,
                requestData,
                config
            );

            // The rest of the function remains the same
            if (response?.data?.seo_report) {
                localStorage.setItem("seo_report", response?.data?.seo_report);

                const resultsResponse = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL}${GET_SEO_REPORT}?path=${encodeURIComponent(response.data.seo_report)}`
                );

                const formattedTrends = resultsResponse.data.results.results.map((topicObj) => ({
                    topic: topicObj.topic,
                    trend: topicObj.aggregate.overall_trend || "stable",
                    popularity: topicObj.aggregate.avg_popularity || 5,
                    keywords: topicObj.aggregate.top_keywords || [],
                }));

                localStorage.setItem("seo_trends", JSON.stringify(formattedTrends)); // Save trends too
                setTrends(formattedTrends);
                setStep("results");
            }
        } catch (error) {
            console.error("Error tracking keywords:", error);
        } finally {
            setTrackingLoading(false);
        }
    };

    // Reset to initial state
    const handleReset = () => {
        localStorage.removeItem("seo_report");
        localStorage.removeItem("seo_trends");
        setKeywords([]);
        setSelectedKeywords([]);
        setTrends([]);
        setStep("generate");
    };

    // Render different UI based on the current step
    const renderStepContent = () => {
        switch (step) {
            case "generate":
                return (
                    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                        <Typography variant="h6" mb={2}>
                            Fetch SEO keywords to track trends
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={handleGenerateKeywords}
                            disabled={keywordsLoading}
                        >
                            {keywordsLoading ? <CircularProgress size={24} /> : "Generate Keywords"}
                        </Button>
                    </Box>
                );

            case "select":
                return (
                    <Box mt={4} position="relative">
                        {/* Keyword Selection Content */}
                        <Box
                            sx={{
                                filter: trackingLoading ? 'blur(4px)' : 'none',
                                transition: 'filter 0.3s ease-in-out',
                                pointerEvents: trackingLoading ? 'none' : 'auto',
                            }}
                        >
                            <Typography variant="h6" mb={2}>
                                Select up to 5 keywords you want to track
                            </Typography>
                            <Grid container spacing={2}>
                                {keywords.map((keywordObj, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card sx={{ p: 2 }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={selectedKeywords.some(k => k.keyword_text === keywordObj.keyword_text)}
                                                        onChange={() => handleKeywordToggle(keywordObj)}
                                                    />
                                                }
                                                label={keywordObj.keyword_text}
                                            />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box display="flex" justifyContent="center" mt={4} gap={2}>
                                <Button
                                    variant="contained"
                                    onClick={handleTrackKeywords}
                                    disabled={trackingLoading || selectedKeywords.length === 0 || selectedKeywords.length > 5}
                                >
                                    {trackingLoading ? <CircularProgress size={24} /> : "Track Selected Keywords"}
                                </Button>
                                <Button variant="outlined"
                                    disabled={trackingLoading || selectedKeywords.length === 0 || selectedKeywords.length > 5}
                                    onClick={handleReset}>
                                    Start Over
                                </Button>
                            </Box>
                        </Box>

                        {/* Loading Overlay */}
                        {trackingLoading && (
                            <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                sx={{
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1000,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                <CircularProgress size={60} thickness={4} />
                                <Typography 
                                    variant="h6" 
                                    color="primary"
                                    sx={{ 
                                        fontWeight: 600,
                                        textShadow: '0 0 10px rgba(255,255,255,0.8)',
                                    }}
                                >
                                    Tracking Keywords...
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ 
                                        textAlign: 'center',
                                        maxWidth: '300px',
                                        textShadow: '0 0 5px rgba(255,255,255,0.6)',
                                    }}
                                >
                                    Analyzing trends for your selected keywords. This may take a moment.
                                </Typography>
                            </Box>
                        )}
                    </Box>
                );

            case "results":
                return (
                    <Box mt={4}>
                        <Typography variant="h6" mb={2}>
                            Keyword Trend Report
                        </Typography>
                        <Grid container spacing={2}>
                            {trends.map(({ topic, trend, keywords, popularity }) => (
                                <Grid item xs={12} sm={6} md={4} key={topic}>
                                    <Card
                                        sx={{
                                            p: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            boxShadow: 3,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => router.push(`/dashboard/seo-trends/${encodeURIComponent(topic)}`)} // Add this line for redirection
                                    >
                                        <Typography variant="h6">{topic}</Typography>
                                        <Typography mt={1} fontSize="0.9rem" textAlign="center" color="text.secondary">
                                            Related Keywords: {keywords.slice(0, 4).join(", ")}{keywords.length > 4 ? "..." : ""}
                                        </Typography>
                                        <Typography mt={1}>{getTrendIcon(trend)} {trend.toUpperCase()}</Typography>
                                        <Typography mt={1}>{getSentiment(popularity)} Popularity: {popularity.toFixed(1)}</Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button variant="outlined" onClick={handleReset}>
                                Start Over
                            </Button>
                        </Box>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Box p={4}>
            <Typography variant="h4" mb={2}>SEO Keyword Trends Dashboard</Typography>
            {renderStepContent()}
        </Box>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session) {
        return {
            props: {
                user: null,
            },
        };
    }

    return {
        props: {
            user: session.user,
        },
    };
}