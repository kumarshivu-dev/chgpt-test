import { getSession } from "next-auth/react";
import React, { useState, useEffect, useMemo     } from 'react';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Alert,
    AlertTitle,
    TextField,
    Typography,
    List, ListItem, ListItemText, ListItemSecondaryAction,
    Container, Divider
} from '@mui/material';

import { VpnKey, MenuBook, Dashboard, Delete} from '@mui/icons-material';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';

import "../developer/developer.css";


const ApiKeys = ({user}) => {

    const [apiKeys, setApiKeys] = useState([]);
    const [apiKey, setApiKey] = useState('');
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingKeys, setFetchingKeys] = useState(true); // For fetching API keys loader
    const [error, setError] = useState('');
    const [showNewKey, setShowNewKey] = useState(false);

    const userState = useSelector((state) => state.user);
    // Memoize the publicApiClient to avoid unnecessary re-computations
    const clientId = useMemo(
        () => userState?.apiClientId,
        [userState?.apiClientId]
    );

    useEffect(() => {
        console.log('Cleint idd ->>> ', clientId)
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        setFetchingKeys(true); // Start fetching
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + '/api/keys/list', {
                headers: {
                    Authorization: user.id_token,
                    "Client-Id": clientId,
                },
            });
            console.log(response.data);
            setApiKeys(response.data.keys);
        } catch (err) {
            console.log('Error : ', err);
            setError('Failed to fetch API keys');
        } finally {
            setFetchingKeys(false); // Done fetching
        }
    };


    const generateApiKey = async () => {
        setLoading(true);
        setError('');
        try {
            console.log("Making new API-KEY request : ", user.name)
            const response = await axios.post(process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + '/api/keys/generate', null, {
                headers: {
                    'Authorization': user.id_token,
                    'Client-Id': clientId
                }
            });
            console.log(response)

            setApiKey(response.data);
            setShowNewKey(true);
            
            fetchApiKeys(); // Refresh the list
        } catch (err) {
            console.log("Error : ", err)
            setError('Failed to generate API key.');
        } finally {
            setLoading(false);
        }
    };

    const revokeApiKey = async (key) => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + '/api/keys/revoke', {
                params: { 'keyId': key.id },
                headers: {
                    "Authorization": user.id_token,
                    'Client-Id': clientId
                }
            });

            fetchApiKeys(); // Refresh the list
        } catch (err) {
            console.log("Error during key revoking : ", err)
            setError('Failed to revoke API key');
        }
    }

    //will be used to have current key copy 
    const copyToClipboard = async (keyValue) => {
        try {
            await navigator.clipboard.writeText(keyValue);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatApiKey = (key) => {
        return `${key.slice(0, 8)}${'*'.repeat(24)}${key.slice(-4)}`;
    };


    return (
        <Container>
            <Typography variant="h4" component="h1" class="documentation-title">
                API Key Management
            </Typography>

            <Typography sx={{mt:1}}>
                Generate your api keys to access the contenthubgpt apis.
                For your security, it's important to store these keys in a safe place. Do not share them publicly or with anyone you don’t trust. If you believe your key has been compromised, regenerate a new one immediately.
                Always keep your keys secure to ensure that your data remains protected.
            </Typography>

            <Box 
                sx={{
                    width: '70%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3, mt:4
                }}
            >
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    Generate new key and keep it securely stored
                </Typography>
                <Button
                    variant="outlined"
                    onClick={generateApiKey}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                    sx={{ml:3}}
                >
                    {loading ? 'Generating...' : 'Generate New API Key'}
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 , width:'50%'}}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
            )}

            {showNewKey && (
                <Alert severity="success" sx={{ mb: 3 , width: '70%'}}>
                    <AlertTitle>New API Key Generated</AlertTitle>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <TextField
                            fullWidth
                            value={apiKey}
                            variant="outlined"
                            size="small"
                            InputProps={{
                                readOnly: true,
                                sx: { fontFamily: 'monospace' }
                            }}
                        />
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => copyToClipboard(newKey)}
                            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                        >
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Make sure to copy this key now. You won't be able to see it again!
                    </Typography>
                </Alert>
            )}

            {/**List the existing keys from DB */}
            <List sx={{ width: '70%' }}>
                {fetchingKeys ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                ) : apiKeys.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                        No API keys available. Generate a new one!
                    </Typography>
                ) : (
                    apiKeys.map((key, index) => (
                        <React.Fragment key={key.id}>
                            {index > 0 && <Divider />}
                            <ListItem>
                                <ListItemIcon>
                                    <VpnKey color="action" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={formatApiKey(key.key)}
                                    secondary={`Created on ${new Date(key.createdAt).toLocaleDateString()}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() => copyToClipboard(key.key)} size="small">
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton onClick={() => revokeApiKey(key)} edge="end" size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </React.Fragment>
                    ))
                )}
            </List>


        </Container>


    );
};


export default ApiKeys;

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
