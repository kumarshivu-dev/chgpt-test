
import React, { useEffect, useState } from "react";
import {
    Button,
    Typography,
    Box,
    Grid,
    Alert,
    AlertTitle,
    Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CircularProgress from '@mui/material/CircularProgress';
import axios from "axios";
import { getSession, useSession } from "next-auth/react";
import 'dotenv';
import Link from "next/link";
import { useDispatch, useSelector } from 'react-redux';

const Root = styled("div")(({ theme }) => ({
    [`&.${"root"}`]: {
        margin: theme.spacing(3),
    },
    [`& .${"uploadBox"}`]: {
        backgroundColor: "#ECF0FF",
        color: "black",
        borderRadius: "10px",
        padding: theme.spacing(4),
        textAlign: "center",
    },
    [`& .${"newUploadBox"}`]: {
        backgroundColor: "#ECF0FF",
        color: "white",
        borderRadius: 4,
        padding: theme.spacing(4),
        textAlign: "center",
    },
    [`& .${"inputBox"}`]: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    [`& .${"textInBox"}`]: {
        fontSize: 16,
        color: "#7B89B2",
    },
    [`& .${"fileLabel"}`]: {
        cursor: "pointer",
    },
    [`& .${"redText"}`]: {
        color: "red",
    },
    [`& .${"content"}`]: {
        margin: theme.spacing(3),
        textAlign: "center",
        [theme.breakpoints.down('sm')]: {
            margin: 0,
        },
    },
    [`& .${"browseBtn"}`]: {
        marginTop: theme.spacing(1),
        borderRadius: "5px"
    },
    [`& .${"uploadBtn"}`]: {
        margin: theme.spacing(1),
        borderRadius: "5px"
    },
    [`& .${"uploadBtnGrey"}`]: {
        margin: theme.spacing(1),
        borderRadius: "5px",
        backgroundColor: 'grey',
        '&:hover': {
            backgroundColor: 'grey',
        },
    },
    [`& .${"checkBoxClass"}`]: {
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: '20px'
    },
    [`& .${"formBox"}`]: {
        marginTop: "20px",
        width: "83%",
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },

    },

}));


function checkCompliance({ user }) {

    const { data: session, status, update } = useSession();
    const [errorMsg, setErrorMsg] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [yesValue, setYesValue] = useState(false);
    const [noValue, setNoValue] = useState(false);
    const [showText, setShowText] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setShowText("")
        setYesValue(false);
        setNoValue(false)
        if (file) {
            if (file.type.startsWith('image/')) {
                setImage(file);
            } else {
                console.error('Please select an image file.');
            }
        }
        
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setShowText("")
        setNoValue(false)
        const file = event.dataTransfer.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                setImage(file);
            } else {
                console.error('Please drop an image file.');
            }
        }
    };

    const handleButtonClick = async () => {
        if (image) {
            setLoading(true)
            const formData = new FormData();
            formData.append('image', image);
            await axios.post(process.env.NEXT_PUBLIC_BASE_URL+'/img/image/ocr', formData,
                {
                    headers: {
                        Authorization: user?.id_token,
                    }
                }
            )
            .then((response)=> {
                setLoading(false)
                if (response.data === 'Yes' || response.data === 'yes') {
                    console.log('yesssss')
                    setYesValue(true)
                    setShowText("Your content is compliant")
                }
                if (response.data === 'No' || response.data === 'no') {
                    console.log('Nooooo')
                    setNoValue(true)
                    setShowText("Your content is Non compliant")
                }
            }).catch((error)=>{
                setLoading(false)
                setErrorMsg(error?.response?.data?.error || "Some error occured")
                setSnackbarOpen(true)

                console.log('response compliance', error)
            })
        } else {
            console.error('Please select an image before clicking the button.');
        }
    };
    const handleDragOver = (event) => {
        setShowText("")
        setYesValue(false)
        event.preventDefault();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file)
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Root className="root" style={{ display: "flex", flexDirection: "column" }}>
            <>
                <Typography className="content" variant="h6">
                    Please Upload the Image 
                </Typography>
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={8}>
                        <Box className="uploadBox" onDrop={handleDrop} onDragOver={handleDragOver}>
                            <Box style={{ backgroundColor: 'white', borderRadius: '10px', padding: '30px' }}>
                                <Typography style={{ fontSize: '20px', color: 'black' }} variant="body1"><strong>Add Image</strong></Typography>
                                <Typography variant="body2" className="textInBox">
                                    Drag and drop your Image
                                </Typography>
                                <Box className="inputBox">
                                    <Box sx={{ width: { xs: '100%', sm: '100%', md: '50%' } }}>
                                        <Box sx={{ border: '1px dashed grey', padding: '13px', borderRadius: '10px', padding: '30px', margin: "16px 0px 8px 0px", backgroundColor: '#F9F9FB', color: '#7B89B2' }}>
                                        {loading ? (
                                                <CircularProgress disableShrink />// Display the circular progress when loading is true
                                            ):
                                            image ? (
                                                <img src={URL.createObjectURL(image)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                            ) : (
                                                <>
                                                    <img src="/folder_image.png" alt="Folder" />
                                                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                                        Drop Image here
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                        <input
                                            type="file"
                                            id="chooseFile"
                                            accept="image/*" // Accept only image files
                                            onChange={handleImageChange}
                                            style={{ display: "none" }}
                                        />
                                        <Button
                                            htmlFor="chooseFile"
                                            size="large"
                                            variant="contained"
                                            component="label"
                                            className="browseBtn"
                                            style={{ width: '100%' }}
                                        >
                                            <label htmlFor="chooseFile" className="fileLabel">
                                                Browse Image
                                            </label>
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={{ display: 'flex',justifyContent:'end', marginTop: '10px' }}>
                            <Typography sx={{ display: yesValue || noValue ? 'block' : 'none', fontSize:'20px',fontWeight:'700', color:yesValue?'green':'red',marginRight:'20px' }}>
                                {showText}
                            </Typography>
                            <Button variant="contained" onClick={handleButtonClick}>Check Compliance</Button>
                        </Box>
                    </Grid>
                </Grid>

            </>
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                open={snackbarOpen}
                autoHideDuration={null}
                onClose={handleSnackbarClose}
            >
                <Alert severity="error" onClose={handleSnackbarClose} style={{ whiteSpace: 'pre-line' }}>
                    <AlertTitle>Error</AlertTitle>
                    {errorMsg}
                </Alert>
            </Snackbar>

        </Root>
    );
}
export default checkCompliance;

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