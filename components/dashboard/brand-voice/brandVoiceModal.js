import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Typography,
  Modal,
  CircularProgress,
  Item,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedBrandFile } from "/store/brandVoiceSlice";

const BrandVoiceModal = ({
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
  // Destructure the props
  const dispatch = useDispatch();
  const [showUpload, setShowUpload] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const brandVoiceState = useSelector((state) => state.brandvoice);
  const brandVoiceFile = brandVoiceState?.selectedBrandFile;
  const handleGenerate = () => {
    setShowUpload(false); // Show the next section
    suggestKeywordsClick();
  };

  const handleClose = () => {
    setShowUpload(true); // Set showUpload to true
    onClose(); // Call the onClose function
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(setSelectedBrandFile(file)); // Store the file in state
    }
  };
  const handleDrop = (event) => {
    event.preventDefault(); // Prevent default browser behavior
    setDragOver(false); // Reset drag state

    const file = event.dataTransfer.files[0]; // Get the first dropped file
    if (file) {
      dispatch(setSelectedBrandFile(file));
    }
  };
  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default browser behavior
    setDragOver(true); // Highlight drop area
  };

  // return (
  //   <div>
  //     <Modal
  //       keepMounted
  //       open={open}
  //       onClose={onClose} // Don't forget to close the modal properly
  //       aria-labelledby="keep-mounted-modal-title"
  //       aria-describedby="keep-mounted-modal-description"
  //     >
  //       <Box className="modal-box">
  //         <Grid className="close-icon" item xs={1}>
  //           <IconButton className="icon-btn" onClick={handleClose}>
  //             <CloseIcon />
  //           </IconButton>
  //         </Grid>
  //         {showUpload ? (
  //           <Grid
  //             className="par-grid"
  //             container
  //             sx={{
  //               padding: 2,
  //               display: "flex",
  //               minHeight: {
  //                 xs: "45vh",
  //                 sm: "55vh",
  //               },
  //             }}
  //           >
  //             <Grid
  //               className="upload-grid"
  //               item
  //               xs={12}
  //               onDrop={handleDrop}
  //               onDragOver={handleDragOver}
  //             >
  //               <Box
  //                 className="upload-box"
  //                 sx={{
  //                   textAlign: "center",
  //                   width: "100%",
  //                   display: "flex",
  //                   flexDirection: "column",
  //                   alignItems: "center",
  //                   justifyContent: "center",
  //                 }}
  //               >
  //                 <Image
  //                   color="gray"
  //                   priority={true}
  //                   src="/dashboard/drop_icon.svg"
  //                   width="25"
  //                   height="25"
  //                   alt="excel-icon"
  //                 />
  //                 <Typography variant="h6">
  //                   Drag and Drop Your Document
  //                 </Typography>
  //                 <Typography variant="h6">
  //                   OR
  //                 </Typography>
  //                 <input
  //                   type="file"
  //                   accept=".pdf,.doc,.docx" // Add allowed file types
  //                   onChange={handleFileChange}
  //                   // style={{ display: "block", marginBottom: "16px" }}
  //                   id="file-upload"
  //                   style={{ display: "none" }}
  //                 />
  //                 <label htmlFor="file-upload">
  //                   <Box
  //                     sx={{
  //                       background: "#f0f0f0",
  //                       padding: "5px 10px",
  //                       borderRadius: "4px",
  //                       cursor: "pointer",
  //                       textAlign: "center",
  //                       border: "1px dashed #ccc",
  //                       display: "inline-block",
  //                     }}
  //                   >
  //                     Click to Upload your file
  //                   </Box>
  //                 </label>
  //                 {brandVoiceFile && (
  //                   <Typography sx={{ mb: 2 }}>
  //                     Selected File: {brandVoiceFile.name}
  //                   </Typography>
  //                 )}
  //               </Box>
  //             </Grid>
  //           </Grid>
  //         ) : (
  //           <Grid
  //             className="par-grid"
  //             container
  //             sx={{
  //               padding: 2,
  //               display: "flex",
  //               // minHeight:'54vw'
  //               minHeight: {
  //                 xs: "45vh",
  //                 sm: "55vh",
  //               },
  //               // height: '75vh'
  //             }}
  //           >
  //             {/* Loading or Error Handling */}
  //             {keywordsLoading && (
  //               <CircularProgress
  //                 sx={{
  //                   position: "absolute",
  //                   top: "50%",
  //                   left: "50%",
  //                   transform: "translate(-50%, -50%)",
  //                 }}
  //               />
  //             )}

  //             {/* Character Keywords */}
  //             <Grid
  //               className="character-class"
  //               item
  //               xs={6}
  //               sx={{ padding: "0 16px", position: "relative" }}
  //             >
  //               <Typography
  //                 sx={{
  //                   fontSize: "18px",
  //                   fontWeight: "700",
  //                   textAlign: "center",
  //                 }}
  //               >
  //                 Character Keywords:
  //               </Typography>
  //               {genCharArray?.length > 0 && (
  //                 <Box className="character-keywords-container">
  //                   {genCharArray.map((keyword, index) => (
  //                     <Box key={index} sx={{ width: "100%" }}>
  //                       <Button
  //                         sx={{
  //                           mb: "10px",
  //                           width: "100%",
  //                           textAlign: "center",
  //                           backgroundColor: charArray
  //                             .map((item) => item.toLowerCase())
  //                             .includes(keyword.toLowerCase())
  //                             ? "#022149"
  //                             : "primary",
  //                           color: charArray
  //                             .map((item) => item.toLowerCase())
  //                             .includes(keyword.toLowerCase())
  //                             ? "white"
  //                             : "black",

  //                           "&:hover": {
  //                             backgroundColor: charArray
  //                               .map((item) => item.toLowerCase())
  //                               .includes(keyword.toLowerCase())
  //                               ? "#022149"
  //                               : "#f5f5f5", // No hover effect if selected
  //                             color: charArray
  //                               .map((item) => item.toLowerCase())
  //                               .includes(keyword.toLowerCase())
  //                               ? "white"
  //                               : "black",
  //                           },
  //                         }}
  //                         key={index}
  //                         variant="outlined"
  //                         onClick={() => addCharacterKeyword(keyword)}
  //                         className="character-keyword-button"
  //                       >
  //                         {keyword}
  //                       </Button>
  //                     </Box>
  //                   ))}
  //                 </Box>
  //               )}
  //             </Grid>

  //             {/* Purpose Keywords */}
  //             <Grid
  //               className="purpose-class"
  //               item
  //               xs={6}
  //               sx={{ padding: "0 16px", position: "relative" }}
  //             >
  //               <Typography
  //                 sx={{
  //                   fontSize: "18px",
  //                   fontWeight: "700",
  //                   textAlign: "center",
  //                 }}
  //               >
  //                 Purpose Keywords:
  //               </Typography>
  //               {genPurposeArray?.length > 0 && (
  //                 <Box className="character-keywords-container">
  //                   {genPurposeArray.map((keyword, index) => (
  //                     <Box key={index} sx={{ width: "100%" }}>
  //                       <Button
  //                         sx={{
  //                           mb: "10px",
  //                           width: "100%",
  //                           textAlign: "center",
  //                           backgroundColor: purposeArray
  //                             .map((item) => item.toLowerCase())
  //                             .includes(keyword.toLowerCase())
  //                             ? "#022149"
  //                             : "primary",
  //                           color: purposeArray
  //                             .map((item) => item.toLowerCase())
  //                             .includes(keyword.toLowerCase())
  //                             ? "white"
  //                             : "black",

  //                           "&:hover": {
  //                             backgroundColor: purposeArray
  //                               .map((item) => item.toLowerCase())
  //                               .includes(keyword.toLowerCase())
  //                               ? "#022149"
  //                               : "#f5f5f5", // No hover effect if selected
  //                             color: purposeArray
  //                               .map((item) => item.toLowerCase())
  //                               .includes(keyword.toLowerCase())
  //                               ? "white"
  //                               : "black",
  //                           },
  //                         }}
  //                         key={index}
  //                         variant="outlined"
  //                         onClick={() => addPurposeKeyword(keyword)}
  //                         className="character-keyword-button"
  //                       >
  //                         {keyword}
  //                       </Button>
  //                     </Box>
  //                   ))}
  //                 </Box>
  //               )}
  //             </Grid>
  //           </Grid>
  //         )}
  //         <Box
  //           sx={{
  //             display: "flex",
  //             justifyContent: "center",
  //             padding: 2,
  //             borderTop: "1px solid #e0e0e0",
  //           }}
  //         >
  //           <Button
  //             variant="outlined"
  //             backgroundColor="primary"
  //             onClick={() => handleGenerate()} // Close the modal
  //             disabled={!brandVoiceFile}
  //             sx={{
  //               width: "170px",
  //               textAlign: "center",
  //             }}
  //           >
  //             Suggest Keywords
  //           </Button>
  //         </Box>
  //       </Box>
  //     </Modal>
  //   </div>
  // );

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
          {/* {showUpload ? (
            <Grid
              className="par-grid"
              container
              sx={{
                padding: 2,
                display: "flex",
                minHeight: {
                  xs: "45vh",
                  sm: "55vh",
                },
              }}
            >
              <Grid
                className="upload-grid"
                item
                xs={12}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <Box
                  className="upload-box"
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    color="gray"
                    priority={true}
                    src="/dashboard/drop_icon.svg"
                    width="25"
                    height="25"
                    alt="excel-icon"
                  />
                  <Typography variant="h6">
                    Drag and Drop Your Document
                  </Typography>
                  <Typography variant="h6">
                    OR
                  </Typography>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx" // Add allowed file types
                    onChange={handleFileChange}
                    // style={{ display: "block", marginBottom: "16px" }}
                    id="file-upload"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="file-upload">
                    <Box
                      sx={{
                        background: "#f0f0f0",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        textAlign: "center",
                        border: "1px dashed #ccc",
                        display: "inline-block",
                      }}
                    >
                      Click to Upload your file
                    </Box>
                  </label>
                  {brandVoiceFile && (
                    <Typography sx={{ mb: 2 }}>
                      Selected File: {brandVoiceFile.name}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          ) : ( */}
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
                <CircularProgress
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
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
                    {genCharArray.map((keyword, index) => (
                      <Box key={index} sx={{ width: "100%" }}>
                        <Button
                          sx={{
                            mb: "10px",
                            width: "100%",
                            textAlign: "center",
                            backgroundColor: charArray
                              .map((item) => item.toLowerCase())
                              .includes(keyword.toLowerCase())
                              ? "#022149"
                              : "primary",
                            color: charArray
                              .map((item) => item.toLowerCase())
                              .includes(keyword.toLowerCase())
                              ? "white"
                              : "black",

                            "&:hover": {
                              backgroundColor: charArray
                                .map((item) => item.toLowerCase())
                                .includes(keyword.toLowerCase())
                                ? "#022149"
                                : "#f5f5f5", // No hover effect if selected
                              color: charArray
                                .map((item) => item.toLowerCase())
                                .includes(keyword.toLowerCase())
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
                    {genPurposeArray.map((keyword, index) => (
                      <Box key={index} sx={{ width: "100%" }}>
                        <Button
                          sx={{
                            mb: "10px",
                            width: "100%",
                            textAlign: "center",
                            backgroundColor: purposeArray
                              .map((item) => item.toLowerCase())
                              .includes(keyword.toLowerCase())
                              ? "#022149"
                              : "primary",
                            color: purposeArray
                              .map((item) => item.toLowerCase())
                              .includes(keyword.toLowerCase())
                              ? "white"
                              : "black",

                            "&:hover": {
                              backgroundColor: purposeArray
                                .map((item) => item.toLowerCase())
                                .includes(keyword.toLowerCase())
                                ? "#022149"
                                : "#f5f5f5", // No hover effect if selected
                              color: purposeArray
                                .map((item) => item.toLowerCase())
                                .includes(keyword.toLowerCase())
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
          {/* )} */}
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: 2,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              variant="outlined"
              backgroundColor="primary"
              onClick={() => handleGenerate()} // Close the modal
              disabled={!brandVoiceFile}
              sx={{
                width: "170px",
                textAlign: "center",
              }}
            >
              Suggest Keywords
            </Button>
          </Box> */}
        </Box>
      </Modal>
    </div>
  );



};

export default BrandVoiceModal;
