 
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StyledCircularProgress from "utils-ui/StyledCircularProgress";
const BrandVoiceKeywordModal = ({
  open,
  onClose,
  charArray,
  purposeArray,
  genCharArray,
  genPurposeArray,
  keywordsLoading,
  addCharacterKeyword,
  addPurposeKeyword,
  suggestKeywordsClick,
}) => {

  const handleClose = () => {
    onClose(); // Call the onClose function
  };
  
  return (
    <div>
      <Modal
        keepMounted
        open={open}
        onClose={onClose} // Don't forget to close the modal properly
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box className="modal-box">
          <Grid className="close-icon" item xs={1}>
            <IconButton className="icon-btn" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
          
            <Grid
              className="par-grid"
              container
              sx={{
                padding: 2,
                display: "flex",
                // minHeight:'54vw'
                minHeight: {
                  xs: "45vh",
                  sm: "55vh",
                },
                // height: '75vh'
              }}
            >
              {/* Loading or Error Handling */}
              {keywordsLoading && (
                <StyledCircularProgress/>
              )}

              {/* Character Keywords */}
              <Grid
                className="character-class"
                item
                xs={6}
                sx={{ padding: "0 16px", position: "relative" }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Character Keywords:
                </Typography>
                {genCharArray?.length > 0 && (
                  <Box className="character-keywords-container">
                    {genCharArray?.map((keyword, index) => (
                      <Box key={index} sx={{ width: "100%" }}>
                        <Button
                          sx={{
                            mb: "10px",
                            width: "100%",
                            textAlign: "center",
                            backgroundColor: charArray
                              .map((item) => item?.toLowerCase())
                              .includes(keyword?.toLowerCase())
                              ? "#022149"
                              : "primary",
                            color: charArray
                              .map((item) => item?.toLowerCase())
                              .includes(keyword?.toLowerCase())
                              ? "white"
                              : "black",

                            "&:hover": {
                              backgroundColor: charArray
                                .map((item) => item?.toLowerCase())
                                .includes(keyword?.toLowerCase())
                                ? "#022149"
                                : "#f5f5f5", // No hover effect if selected
                              color: charArray
                                .map((item) => item?.toLowerCase())
                                .includes(keyword?.toLowerCase())
                                ? "white"
                                : "black",
                            },
                          }}
                          key={index}
                          variant="outlined"
                          onClick={() => addCharacterKeyword(keyword)}
                          className="character-keyword-button"
                        >
                          {keyword}
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>

              {/* Purpose Keywords */}
              <Grid
                className="purpose-class"
                item
                xs={6}
                sx={{ padding: "0 16px", position: "relative" }}
              >
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Purpose Keywords:
                </Typography>
                {genPurposeArray?.length > 0 && (
                  <Box className="character-keywords-container">
                    {genPurposeArray?.map((keyword, index) => (
                      <Box key={index} sx={{ width: "100%" }}>
                        <Button
                          sx={{
                            mb: "10px",
                            width: "100%",
                            textAlign: "center",
                            backgroundColor: purposeArray
                              ?.map((item) => item?.toLowerCase())
                              ?.includes(keyword?.toLowerCase())
                              ? "#022149"
                              : "primary",
                            color: purposeArray
                              ?.map((item) => item?.toLowerCase())
                              ?.includes(keyword?.toLowerCase())
                              ? "white"
                              : "black",

                            "&:hover": {
                              backgroundColor: purposeArray
                                ?.map((item) => item?.toLowerCase())
                                ?.includes(keyword?.toLowerCase())
                                ? "#022149"
                                : "#f5f5f5", // No hover effect if selected
                              color: purposeArray
                                ?.map((item) => item?.toLowerCase())
                                ?.includes(keyword?.toLowerCase())
                                ? "white"
                                : "black",
                            },
                          }}
                          key={index}
                          variant="outlined"
                          onClick={() => addPurposeKeyword(keyword)}
                          className="character-keyword-button"
                        >
                          {keyword}
                        </Button>
                      </Box>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
        </Box>
      </Modal>
    </div>
  );

  
};

export default BrandVoiceKeywordModal;
