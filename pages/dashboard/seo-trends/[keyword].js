import { useRouter } from "next/router";
import { 
  Box,
  Typography,
  Divider,
  Chip,
  Card,
  Button,
  CircularProgress
} from "@mui/material";
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip 
} from 'chart.js';
import { getSession } from "next-auth/react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useBrandDisplay } from "../../../hooks/data/useBrandDisplay";
import { PLATFORM_DEFAULT } from "../../../constants/globalvars";
import { GET_TRACK_VOLUME, GET_SEO_REPORT } from "../../../utils/apiEndpoints";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

// Helper functions from index.js
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

export default function KeywordDetail({ user }) {
  const router = useRouter();
  const { keyword } = router.query;
  const [loading, setLoading] = useState(true);
  const [keywordData, setKeywordData] = useState(null);
  const [volumeData, setVolumeData] = useState(null);
  
  const {
    displayName,
    brandUrl,
    isSpecificBrand,
    brandId,
    isActive,
    brandLanguages,
    defaultLanguage,
  } = useBrandDisplay();

  // Fetch keyword details and volume data when component mounts or keyword changes
  useEffect(() => {
    if (keyword && user?.id_token) {
      fetchKeywordDetails();
    }
  }, [keyword, user]);

  const fetchKeywordDetails = async () => {
    setLoading(true);
    try {
      // Fetch basic keyword trend data
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };

      const requestData = {
        keywords: [keyword],
        source: "website"
      };

      const get_file_from_localstorage = localStorage.getItem("seo_report")

      if (get_file_from_localstorage) {
        const resultsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}${GET_SEO_REPORT}?path=${encodeURIComponent(get_file_from_localstorage)}`
        );

        // Find the specific keyword data
        const keywordResult = resultsResponse.data.results.results.find(
          topicObj => topicObj.topic.toLowerCase() === keyword.toLowerCase()
        );

        if (keywordResult) {
          // Process keyword data
          const formattedData = {
            topic: keywordResult.topic,
            trend: keywordResult.aggregate.overall_trend || "stable",
            popularity: keywordResult.aggregate.avg_popularity || 5,
            keywords: keywordResult.aggregate.top_keywords || [],
            reasons: keywordResult.results.flatMap(result => 
              result.structured?.reasons || []
            ).filter((reason, index, self) => 
              // Remove duplicates
              index === self.findIndex((r) => r === reason)
            ),
            sources: keywordResult.results.map(result => result.link),
          };

          setKeywordData(formattedData);
          
          // Now fetch the monthly volume data
          await fetchMonthlyVolumeData(keyword);
        }
      }
    } catch (error) {
      console.error("Error fetching keyword details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyVolumeData = async (keywordText) => {
    try {
      const config = {
        headers: {
          Authorization: user?.id_token,
        },
      };

      // Call the new API endpoint for monthly volume data
      const volumeResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}${GET_TRACK_VOLUME}?keyword=${encodeURIComponent(keywordText)}`,
        config
      );

      console.log("voluemsss",volumeResponse)
      if (volumeResponse?.data?.months && volumeResponse?.data?.volumeData) {
        const fixedMonths = volumeResponse.data.months.map(month => {
          const [monthNumber, year] = month.split('-');
          if (monthNumber === '13') {
            return `1-${parseInt(year) + 1}`;
          }
      
          return month;
        });
      
        setVolumeData({
          months: fixedMonths,
          values: volumeResponse.data.volumeData
        });
      }
    } catch (error) {
      console.error("Error fetching volume data:", error);
      // Set fallback mock data on error
      const mockMonths = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
      const mockData = mockMonths.map(() => {
        return Math.floor(Math.random() * 60) + 40;
      });

      setVolumeData({
        months: mockMonths,
        values: mockData
      });
    }
  };

  // Handle going back to the main trends page
  const handleBack = () => {
    router.push("/dashboard/seo-trends");
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!keywordData) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5">No data available for "{keyword}"</Typography>
        <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
          Back to Trends
        </Button>
      </Box>
    );
  }

  const { 
    topic, 
    trend, 
    popularity, 
    keywords, 
    reasons, 
    sources
  } = keywordData;

  // Prepare chart data
  const chartData = {
    labels: volumeData?.months || [],
    datasets: [
      {
        label: "Search Volume",
        data: volumeData?.values || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Determine icons based on trend
  const trendEmoji = getTrendIcon(trend);
  const sentimentEmoji = getSentiment(popularity);

  return (
    <Box p={4}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button variant="outlined" onClick={handleBack} sx={{ mr: 2 }}>
          Back
        </Button>
        <Typography variant="h4">{topic}</Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Chip label={`Trend: ${trendEmoji} ${trend.toUpperCase()}`} color="primary" />
        <Chip 
          label={`Sentiment: ${sentimentEmoji} ${trend === "up" ? "positive" : trend === "down" ? "negative" : "neutral"}`} 
          color={trend === "up" ? "success" : trend === "down" ? "error" : "default"} 
        />
      </Box>

      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mb={4}>
        <Card sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" mb={2}>Search Volume Over Time</Typography>
          {volumeData?.values?.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <Typography variant="body2" color="text.secondary" align="center">No volume data available</Typography>
          )}
        </Card>

        <Card sx={{ p: 3, width: 200, alignSelf: 'center' }}>
          <Typography align="center" variant="subtitle1" gutterBottom>Popularity Score</Typography>
          <Box sx={{ width: 150, margin: "0 auto" }}>
            <CircularProgressbar
              value={popularity * 10} // Convert to percentage (0-100)
              text={`${popularity.toFixed(1)}`} 
              styles={buildStyles({
                textSize: "20px",
                pathColor: "#3f51b5",
                textColor: "#333",
                trailColor: "#eee",
              })}
            />
          </Box>
        </Card>
      </Box>

      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" fontWeight={600} gutterBottom>
          💡 Why it's trending:
        </Typography>
        {reasons && reasons.length > 0 ? (
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {reasons.slice(0, 3).map((reason, idx) => (
              <Typography component="li" variant="body2" key={idx} sx={{ mb: 1 }}>
                {reason.replace(/^\d+\.\s*/, '')}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No specific trend reasons available.</Typography>
        )}
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="body1" fontWeight={600} mb={1}>
          🏷️ Related Keywords:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {keywords && keywords.length > 0 ? (
            keywords.slice(0, 8).map((kw, idx) => (
              <Chip key={idx} label={kw.replace(/\.$/, '')} size="small" variant="outlined" />
            ))
          ) : (
            <Typography variant="body2">No related keywords available.</Typography>
          )}
        </Box>
        
        <Typography variant="body1" fontWeight={600} gutterBottom>
          🔗 Sources:
        </Typography>
        {sources && sources.length > 0 ? (
          <Box component="ul" sx={{ m: 0, pl: 3 }}>
            {sources.slice(0, 3).map((link, idx) => (
              <li key={idx}>
                <Typography 
                  component="a" 
                  variant="body2" 
                  href={link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ 
                    textDecoration: "none", 
                    color: "primary.main",
                    '&:hover': { textDecoration: "underline" },
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%"
                  }}
                >
                  {link.length > 60 ? `${link.substring(0, 60)}...` : link}
                </Typography>
              </li>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No sources available.</Typography>
        )}
      </Card>
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