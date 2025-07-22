import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Spinner from '../components/spinner/Spinner';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { INVITE_VALIDATION } from '../utils/apiEndpoints';



function InvitationPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [mainContent, setMainContent]=useState("");
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (router.isReady) {
      const queryToken = router.query.token;

      if (queryToken) {
        setToken(queryToken);
        validateToken(queryToken);
      } else {
        setTokenStatus('missing');
        setLoading(false);
      }
    }
  }, [router.isReady, router.query.token]);

  const validateToken = async (queryToken) => {
    try {
      // console.log("Validating token:", queryToken);
      const res = await axios.get(process.env.NEXT_PUBLIC_BASE_URL+INVITE_VALIDATION +queryToken);
      if (res?.status === 200) {
        setTokenStatus('valid');
        if(res?.data?.email){
        const firstDecode = decodeURIComponent(res?.data?.email);
        const finalDecoded = decodeURIComponent(firstDecode);
        setEmail(finalDecoded|| '');
        }
        setMainContent("Invitation accepted successfully. You are now part of the organization/brand. Your activities and saved documents will be shared at the organization/brand level.");
      }
    } catch (err) {
      setTokenStatus('invalid');
      // console.log(err.response);
      setMainContent(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  const handleRedirect = () => {
    router.push({
      pathname: '/login',
      query: { 
        email: email,
      },
    });
  };

  return (
    <Box className="invitation-root">
      {/* First Row */}
      <Box className="invitation-top-row">
        {/* Logo */}
        <Box className="invitation-logo-container">
          <Box
            component="img"
            src="/dashboard/contentHubGPT.svg"
            alt="Logo"
            className="invitation-logo"
          />
        </Box>

        {/* Welcome Message */}
        
        <Box className="invitation-welcome-section">
        {loading? <Spinner show={loading} /> : <><Typography
            variant={isMobile ? "h3" : "h5"}
            align="center"
            className="invitation-welcome-title"
          >
           {tokenStatus==='valid'?"Welcome!":"Oops!"} 
          </Typography>
          <Typography
            variant="body2"
            align="center"
            className="invitation-welcome-text"
          >
            {token? mainContent:"No token received. Please recheck your invitation URL"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className="invitation-dashboard-button"
            onClick={handleRedirect}   
          >
            Go to Dashboard <ArrowForwardIcon sx={{ ml: 1 }} />
          </Button></>}
        </Box>
      </Box>

      {/* Second Row */}
      <Box className="invitation-bottom-row">
        <Box
          component="img"
          src="/dashboard/invitation-image-1.png"
          alt="Visual"
          className="invitation-bottom-image"
        />
      </Box>
    </Box>
  );
};

InvitationPage.isInvitationPage = true;

export default InvitationPage;
