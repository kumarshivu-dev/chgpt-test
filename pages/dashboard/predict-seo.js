import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, CircularProgress, Paper, Tabs, Tab, Divider } from "@mui/material";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getSession } from "next-auth/react";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PredictSeo = () => {
    const [keyword, setKeyword] = useState("");
    const [trendData, setTrendData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    // Mock data for demo purposes
    useEffect(() => {
        setTrendData({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Search Volume',
                    data: [50, 60, 70, 65, 80, 95],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.4
                }
            ]
        });
    }, []);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Keyword Trend Analysis',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 10
                }
            }
        }
    };

    const handleChange = (event) => {
        setKeyword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            console.log("Analyzing Keyword:", keyword);

            // Update with new mock data (simulate new analysis)
            setTrendData({
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: `Search Volume for "${keyword}"`,
                        data: [55, 65, 75, 70, 85, 100],
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            });
        } catch (error) {
            console.error("Error fetching trend data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ width: "100%", p: 4 }}>
            <Typography variant="h4" gutterBottom>Predictive SEO Analysis</Typography>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>Enter Keyword for Analysis</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Keyword"
                        variant="outlined"
                        value={keyword}
                        onChange={handleChange}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Analyze"}
                    </Button>
                </form>
            </Paper>

            <Paper elevation={3} sx={{ p: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Trend Analysis" />
                    <Tab label="High-Value Keywords" />
                    <Tab label="Competitor Insights" />
                </Tabs>
                <Divider sx={{ mb: 3 }} />

                {activeTab === 0 && trendData && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Trend Analysis for "{keyword || 'Demo Data'}"</Typography>
                        <Line data={trendData} options={chartOptions} />
                    </Box>
                )}

                {activeTab === 1 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>High-Value Keywords</Typography>
                        <Typography>No data available. Analyze a keyword to see results.</Typography>
                    </Box>
                )}

                {activeTab === 2 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Competitor Insights</Typography>
                        <Typography>Feature coming soon...</Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default PredictSeo;


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