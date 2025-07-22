import { CloseRounded, HelpOutline } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Switch from '@mui/material/Switch';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { CONFIG_GET_API, CONFIG_PUT_API, POST_SPLITTER_RESET } from "../../../utils/apiEndpoints";
import trackActivity from "../../helper/dashboard/trackActivity";

const RagChunkingModal = ({
  isOpen,
  onClose,
  user,
  setSnackbarState,
  fetchComplianceFiles,
}) => {
  const splitters = [
    {
      key: "SENTENCE",
      name: "Sentence Splitter",
      content:
        "In the Sentence Splitter, content is split into individual sentences. This enables a more granular analysis and processing of the text on a sentence-by-sentence basis.",
    },
    {
      key: "SEMANTIC",
      name: "Semantic Splitter",
      content:
        "In the Semantic Splitter, the text is spliced based on similarities in meaning or context. This helps us identify and focus on specific themes or topics within the text.",
    },
    {
      key: "SENTENCE_WINDOW",
      name: "Sentence Window Splitter",
      content:
        "The Sentence Window Splitter breaks text into small overlapping chunks of sentences to keep important context when analyzing.",
    },
    {
      key: "NO_CHUNKING",
      name: "No Chunking",
      content:
        "Your whole compliance content will be used for decision making.",
    },
  ];
  const [ragConfirmation, setRagConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textSplitter, setTextSplitter] = useState("SEMANTIC");
  const [showAnimation, setShowAnimation] = useState(false);
  const [generatedCompliance, setGeneratedCompliance] = useState(false);
  const [externalCompliance, setExternalCompliance] = useState(false);
  const [textCompliance, setTextCompliance] = useState(false);
  const [imageCompliance, setImageCompliance] = useState(false);

  useEffect(() => {
    if (!externalCompliance && !textCompliance && !imageCompliance) {
      setTextCompliance(true); // Enable text compliance if none are selected
    }
    if (!textSplitter) {
      setTextSplitter("SEMANTIC"); // Ensure default splitter is SEMANTIC
    }
  }, [externalCompliance, textCompliance, imageCompliance, textSplitter]);
  
  
   
  const fetchComplianceConfig = () => {
    axios
      .get(process.env.NEXT_PUBLIC_BASE_URL + CONFIG_GET_API, {
        headers: {
          Authorization: user?.id_token,
        },
      })
      .then((response) => {
        const complianceData = response?.data;
        setTextSplitter(complianceData?.text_splitter);
        setGeneratedCompliance(complianceData?.generated_content_compliance);
        setExternalCompliance(complianceData?.external_content_compliance);
        setTextCompliance(complianceData?.text_compliance);
        setImageCompliance(complianceData?.image_compliance);

        setLoading(false);
      })
      .catch((error) => {
        setSnackbarState({
          open: true,
          message: error?.message,
          severity: "error",
        });
        setLoading(false);
      });
  };

  const handleConfirmation = () => {
    setLoading(true);
    axios
      .put(
        process.env.NEXT_PUBLIC_BASE_URL + CONFIG_PUT_API,
        {
          text_splitter: textSplitter,
          generated_content_compliance: generatedCompliance,
          external_content_compliance: externalCompliance,
          text_compliance: textCompliance,
          image_compliance: imageCompliance,
        },
        {
          headers: {
            Authorization: user?.id_token,
          },
        }
      )
      .then((response) => {
        setSnackbarState({
          open: true,
          message: "RAG Chunking Type reset and configuration saved successfully",
          severity: "success",
        });
        setLoading(false);
        onClose();
        fetchComplianceConfig();
        fetchComplianceFiles();
      })
      .catch((error) => {
        setSnackbarState({
          open: true,
          message: error?.message,
          severity: "error",
        });
      });
    // setRagConfirmation(false);
    // onClose();
    // setSnackbarState({
    //   open: true,
    //   message: "RAG Chunking Type set",
    //   severity: "success",
    // });
  };
  

  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleRagConfirmationClose = () => {
    setRagConfirmation(false);
  };

  const handleConfirmationOpen = (splitterKey) => {
    if (textSplitter !== splitterKey) {
      setTextSplitter(splitterKey);
      setRagConfirmation(true);
      //Scroll to the bottom of the modal when chunking type is changed
      setTimeout(() => {
        const scrollToConfirmCard = document.getElementById("confirm-card");
        if (scrollToConfirmCard) {
          scrollToConfirmCard.scrollIntoView({ behavior: "smooth" });
        }
      });
    } else {
      setRagConfirmation(false);
    }
  };

  const toggleAnimationView = () => {
    setShowAnimation((prev) => !prev);
  };

  useEffect(()=>{
    fetchComplianceConfig()
  },[])

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <Grid container className="rag-chunk-container">
          {showAnimation ? (
            // Animation View
            <Grid
              sx={{ height: "auto", maxHeight: "440px" }}
            >
              <Grid item>
                <IconButton
                  onClick={toggleAnimationView}
                  sx={{
                    position: "absolute",
                    top: isMobile ? 25 : 0,
                    right: isMobile ? 25 : 0,
                    // transform: "translate(45%, -45%)",
                    // background: "rgba(0, 0, 0, 0.4)",
                    ":hover": {
                      background: "rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <CloseRounded />
                </IconButton>
              </Grid>

              <Box
                component="video"
                src="/dashboard/Sequence02.mp4"
                controls
                autoPlay
                sx={{
                  width: "100%",
                  height: "100%",
                  maxHeight: "inherit",
                  overflow:"hidden",
                }}
              />
            </Grid>
          ) : (
            <>
              <Stack
                direction={"column"}
                spacing={2}
                sx={{ textAlign: "center"}}
              >
                <IconButton
                  onClick={onClose}
                  sx={{
                    position: "absolute",
                    top: isMobile ? 25 : 0,
                    right: isMobile ? 25 : 0,
                    // transform: "translate(45%, -45%)",
                    // background: "rgba(0, 0, 0, 0.4)",
                    ":hover": {
                      background: "rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <CloseRounded  />
                </IconButton>
                <Typography
                  variant="h1"
                  sx={{
                    paddingBottom: "10px",
                    fontWeight: "600 !important",
                    marginTop: "0px",
                  }}
                >
                  RAG Chunking Type
                </Typography>
                <Typography variant="body2">
                  Your entire document might not fit every case, so let's break
                  it down and then assess the compliance status.
                </Typography>
                <Grid className="rag-chunk-tiles">
                  {splitters.map((splitter) => (
                    <Card
                      className="rag-card"
                      key={splitter.key}
                      sx={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleConfirmationOpen(splitter.key)}
                    >
                      <CardHeader
                        sx={{ paddingBottom: "0px" }}
                        title={
                          <Typography variant="h6">{splitter.name}</Typography>
                        }
                      />
                      <CardContent>
                        <Typography variant="body2">
                          {splitter.content}
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <IconButton>
                          {textSplitter === splitter.key ? (
                            <CheckCircleIcon color="primary" />
                          ) : (
                            <CheckCircleOutlineIcon />
                          )}
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))}
                </Grid>

                <Box sx={{ paddingTop: "20px", display: "flex", justifyContent: "center" }}>
                  <Grid container spacing={2} sx={{ display: "flex", flexWrap: "wrap" }}>
                    <Grid item xs="4" sx={{ display: "flex", alignItems: "center",justifyContent:"flex-start" }}>
                      <Typography>Generated Content Compliance</Typography>
                      <Switch
                        checked={generatedCompliance}
                        onChange={() =>{setRagConfirmation(true), setGeneratedCompliance(!generatedCompliance)}}
                      />
                    </Grid>
                    <Grid item xs="4" sx={{ display: "flex", alignItems: "center",justifyContent:"center" }}>
                      <Typography>External Content Compliance</Typography>
                      <Switch
                        checked={externalCompliance}
                        onChange={() => {setRagConfirmation(true), setExternalCompliance(!externalCompliance)}}
                      />
                    </Grid>
                    <Grid item xs="4" sx={{ display: "flex", alignItems: "center" ,justifyContent:"flex-end"}}>
                      <Typography>Text Compliance</Typography>
                      <Switch
                        checked={textCompliance}
                        onChange={() => {setRagConfirmation(true), setTextCompliance(!textCompliance)}}
                      />
                    </Grid>
                  </Grid>
                </Box>


                <Grid
                  className="rag-confirmation-grid"
                  id="confirm-card"
                  sx={{ display: ragConfirmation ? "flex" : "none" }}
                >
                  <Typography>
                    Are you sure you want to select this type? This would be
                    applicable to all the compliance files.
                  </Typography>
                  <Box className="rag-confirmation-box">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        onClose();
                        handleRagConfirmationClose();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleConfirmation()}
                      autoFocus
                    >
                      Yes
                    </Button>
                  </Box>
                </Grid>
                {loading && (
                  <CircularProgress
                    sx={{ position: "absolute", left: "50%", bottom: "5%" }}
                  />
                )}
                <Box
                  component={"span"}
                  sx={{ display: "flex", justifyContent: "end" }}
                >
                  <IconButton onClick={toggleAnimationView}>
                    <HelpOutline sx={{ fontSize: 30 }} />
                  </IconButton>
                </Box>
              </Stack>
            </>
          )}
        </Grid>
      </Modal>
      {/* {ragConfirmationModalOpen && (
        <RagConfirmation
          open={ragConfirmationModalOpen}
          onClose={handleRagConfirmationClose}
          setConfirmation={handleConfirmation}
        />
      )} */}
    </>
  );
};

export default RagChunkingModal;
