import { React, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputLabel,
  Link,
  TextareaAutosize,
  Typography,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { isEqual } from "lodash";
import axios from "axios";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  setproductTableData,
  setImgRecTableData,
} from "../../../store/dashboard/productTableSlice";
import Spinner from "../../spinner/Spinner";
import { PRODUCT_SEO_SUGGESTION } from "../../../utils/apiEndpoints";
import { useToast } from "../../../context/ToastContext";
import LimitReachedBox from "../../../utils-ui/limitReachedBox";

const EditProductDialog = ({
  openEditProductDialog,
  handleCloseSaveDialog,
  rowData,
  handleTextFieldChange,
  editableRow,
  setEditableRow,
  newRow,
  setNewRow,
  selectedProduct,
  setSelectedProduct,
  isResultPage,
  setIsValidProduct,
  autoSave,
  setAutoSave,
  setCurrentProductIndex,
  currentProductIndex,
  isSelected,
  user,
}) => {
  const dispatch = useDispatch();
  const uploadState = useSelector((state) => state.uploadpage);
  const userState = useSelector((state) => state?.user);
  const [showKeywords, setShowKeywords] = useState(false);
  const [availableSeoKeywords, setAvailableSeoKeywords] = useState([]);
  const [isLoadingSeoKeywords, setIsLoadingSeoKeywords] = useState(false);
  const [regenerateSeo, setRegenerateSeo] = useState(false);
  const [triggeredByKeywordClick, setTriggeredByKeywordClick] = useState(false);
  const { showToast } = useToast();

  const getInitialValue = () => {
    return isResultPage
      ? rowData.seo_keywords
        ? rowData.seo_keywords
        : ""
      : rowData.seo_keywords || "";
  };
  // const getInitialValue = () => {
  //   return isResultPage
  //     ? rowData.seo_keywords || rowData.input_keywords || ""
  //     : rowData.seo_keywords || rowData.input_keywords || "";
  // };

  // const [inputValue, setInputValue] = useState(getInitialValue());
  const [inputValue, setInputValue] = useState("");

  // Update inputValue whenever rowData changes
  useEffect(() => {
    const initial = rowData?.seo_keywords || rowData?.input_keywords || "";
    setInputValue(initial);
  }, [rowData]);

  useEffect(() => {
    if (triggeredByKeywordClick) {
      updateProductData();
      setTriggeredByKeywordClick(false);
    }
  }, [inputValue]);

  const handleKeywordClick = (keyword) => {
    const currentKeywords = inputValue
      ? inputValue.split(",").map((k) => k.trim().toLowerCase())
      : [];
    // Check if the keyword already exists
    if (currentKeywords.includes(keyword.toLowerCase())) {
      setAvailableSeoKeywords((prev) =>
        prev.filter((k) => k.keyword_text !== keyword)
      );
      showToast("Keyword already selected", "warning");
      return;
    }
    const newValue = inputValue ? `${inputValue}, ${keyword}` : keyword;
    setInputValue(newValue);
    handleTextFieldChange({
      target: {
        name: "seo_keywords",
        value: newValue,
      },
    });
    setTriggeredByKeywordClick(true);
    setAvailableSeoKeywords((prev) =>
      prev.filter((k) => k.keyword_text !== keyword)
    );
  };

  let isFreeBasicUser =
    userState?.userPlan?.startsWith("chgpt-basic") ||
    userState?.userPlan?.startsWith("chgpt-free");

  const handlePrev = () => {
    setCurrentProductIndex(() => {
      return currentProductIndex === 0
        ? newRow.length - 1
        : currentProductIndex - 1;
    });
  };

  const handleNext = () => {
    setCurrentProductIndex(() => {
      return currentProductIndex === newRow.length - 1
        ? 0
        : currentProductIndex + 1;
    });
  };

  const fetchSuggestedKeywords = async () => {
    if (showKeywords === true) {
      setShowKeywords((prev) => !prev);
      return;
    }

    setIsLoadingSeoKeywords(true);

    const productName = rowData?.product_name;
    const keywords = rowData?.keywords;
    const brand = rowData?.brand;
    // console.log(rowData);
    const regenerate = regenerateSeo;

    const requestData = {
      page_url: "",
      product: productName,
      input_keywords: keywords,
      regenerate: regenerate,
      source: "website",
      keyword_type: "product_based",
      brand_name: brand,
    };

    const config = {
      headers: {
        Authorization: user?.id_token,
      },
    };

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${PRODUCT_SEO_SUGGESTION}`,
        requestData,
        config
      );

      const productKeywords = data?.keyword_results?.product_based || [];
      const hasKeywords = productKeywords.length > 0;

      setAvailableSeoKeywords(hasKeywords ? productKeywords.slice(0, 10) : []);
      setShowKeywords(hasKeywords);

      if (!hasKeywords) {
        showToast(
          "No SEO keywords found. Please update the Keywords section to help generate better suggestions.",
          "info"
        );
      }
    } catch (error) {
      console.error("Error fetching SEO keywords:", error);
      showToast("Error while fetching suggested keywords", "error");
      setAvailableSeoKeywords([]);
      setShowKeywords(false);
    } finally {
      setIsLoadingSeoKeywords(false);
      setRegenerateSeo(false);
    }
  };

  // const updateProductData = () => {
  //   if (!isEqual(editableRow.original, rowData)) {
  //     editableRow.original = rowData;
  //     const updatedData = newRow.map((item, i) => {
  //       if (item.id === rowData.id) {
  //         return rowData;
  //       }
  //       return item;
  //     });
  //     const filteredArray = selectedProduct.filter(
  //       (item1) => item1.id !== rowData.id
  //     );
  //     setSelectedProduct([...filteredArray, rowData]);
  //     setNewRow(updatedData);
  //     setEditableRow(editableRow);
  //     setAutoSave(true);
  //     setTimeout(() => {
  //       setAutoSave(false);
  //     }, 2000);
  //     const hasValues = selectedProduct.every(
  //       (item) => item.product_id && item.product_name && item.brand
  //     );
  //     if (!isResultPage) {
  //       setIsValidProduct(!hasValues);
  //     }
  //   }
  // };

  const updateProductData = () => {
    if (!isEqual(editableRow.original, rowData)) {
      // Create a new object instead of mutating editableRow
      const updatedEditableRow = {
        ...editableRow,
        original: rowData,
      };

      // Update newRow by mapping through and replacing the specific item
      const updatedData = newRow.map((item) => {
        if (item.id === rowData.id) {
          return rowData;
        }
        return item;
      });
      // Filter and update the selectedProduct array
      const filteredArray = selectedProduct.filter(
        (item) => item.id !== rowData.id
      );

      // Set the updated values
      setSelectedProduct([...filteredArray, rowData]);
      setNewRow(updatedData);
      if (!isResultPage) {
        dispatch(
          isSelected === "product"
            ? setproductTableData(updatedData)
            : setImgRecTableData(updatedData)
        );
      }

      setEditableRow(updatedEditableRow); // Set the new editableRow
      setAutoSave(true);

      // Auto-save functionality with a timeout
      setTimeout(() => {
        setAutoSave(false);
      }, 2000);

      // Validation logic to check if product details are complete
      const hasValues = selectedProduct.every(
        (item) => item.product_id && item.product_name && item.brand
      );
      if (!isResultPage) {
        setIsValidProduct(!hasValues);
      }
    }
  };

  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "10px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#555",
    },
  };

  return (
    <Dialog
      open={openEditProductDialog}
      onClose={() => {
        updateProductData();
        handleCloseSaveDialog();
        setShowKeywords(false);
      }}
      className=""
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          let hasValues;
          event.preventDefault();
          editableRow.original = rowData;
          const updatedData = newRow.map((item, i) => {
            if (item.id === rowData.id) {
              return rowData;
            }
            return item;
          });
          const filteredArray = selectedProduct.filter(
            (item1) => item1.id !== rowData.id
          );
          setSelectedProduct([...filteredArray, rowData]);
          setNewRow(updatedData);
          setEditableRow(editableRow);
          if (isSelected === "product") {
            hasValues = selectedProduct.every(
              (item) => item.product_id && item.product_name && item.brand
            );
          } else if (isSelected === "image") {
            hasValues = selectedProduct.every((item) => item.image_url);
          }
          if (!isResultPage) {
            setIsValidProduct(!hasValues);
          }
          handleCloseSaveDialog();
        },
        sx: {
          maxWidth: { xs: "360px", sm: "700px", md: "700px" },
          width: { xs: "360px", sm: "700px", md: "700px" },
          borderRadius: "6px",
          padding: "2.5px",
          overflowY: "unset",
          backgroundColor: autoSave ? "#eeeeef" : "#f9f8f8",
        },
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          margin: "0 5px",
        }}
      >
        <Grid
          item
          xs={1}
          sm={1}
          md={1}
          sx={{ maxWidth: "2% !important" }}
          className="back-arrow-container"
        >
          <ArrowBackIosIcon
            onClick={() => {
              handleCloseSaveDialog();
            }}
            sx={{
              cursor: "pointer",
            }}
          />
        </Grid>
        <Grid item xs={7} sm={9} md={9} lg={9}>
          <DialogTitle
            sx={{
              padding: "10px 22px 0px 7.5px",
              fontSize: "16px",
              "@media (max-width: 600px)": {
                marginLeft: "10px", // Applies when screen width is 600px or less
              },
            }}
          >
            {isSelected === "product" ? rowData.product_id : rowData.image_id}
          </DialogTitle>
          <DialogTitle
            sx={{
              padding: "0px 22px 0px 7.5px",
              fontSize: "16px",
              "@media (max-width: 600px)": {
                marginLeft: "10px", // Applies when screen width is 600px or less
              },
            }}
          >
            {isSelected === "product" ? rowData.product_name : rowData.item}
          </DialogTitle>
        </Grid>
        <Box>
          <Button
            sx={{
              bgcolor: "#001b3f",
              minWidth: "10px",
              mr: "10px",
              "&:hover": {
                backgroundColor: "#001b3f !important",
              },
            }}
            onClick={handlePrev}
          >
            <ArrowBackIosNewIcon sx={{ color: "white !important" }} />
          </Button>
          <Button
            sx={{
              bgcolor: "#001b3f",
              minWidth: "10px",
              "&:hover": {
                backgroundColor: "#001b3f !important",
              },
            }}
            onClick={handleNext}
          >
            <ArrowForwardIosIcon sx={{ color: "white !important" }} />
          </Button>
        </Box>
      </Grid>
      {autoSave && (
        <Box
          sx={{
            color: "#1a927d",
            mb: "20px",
            ml: "60px",
            fontWeight: 600,
            display: "flex",
          }}
        >
          <Typography>Changes Saved </Typography>
          <CheckCircleOutlineIcon
            sx={{ color: "#1a927d !important", ml: "4px" }}
          />
        </Box>
      )}
      <Box className="divide-header"></Box>
      {isSelected === "product" ? (
        <DialogContent sx={{ bgcolor: "#f9f8f8" }}>
          <Box
            className="text-field-style"
            sx={{
              bgcolor: "#f3f4f6 !important",
            }}
          >
            <InputLabel className="popup-lable">Brand</InputLabel>
            <TextareaAutosize
              required
              className="table-textarea"
              margin="dense"
              value={rowData.brand}
              id="brand"
              name="brand"
              type="text"
              variant="standard"
              onChange={handleTextFieldChange}
              disabled
              onBlur={() => {
                updateProductData();
              }}
            />
          </Box>
          <Box
            className="text-field-style"
            sx={{
              bgcolor: isResultPage ? "#f3f4f6 !important" : "white",
            }}
          >
            <InputLabel className="popup-lable">Keywords</InputLabel>
            <TextareaAutosize
              margin="dense"
              className="table-textarea"
              // value={isResultPage ? (rowData.input_keywords?rowData.input_keywords:null) : rowData.keywords}
              value={
                isResultPage
                  ? rowData.input_keywords
                    ? rowData.input_keywords
                    : ""
                  : rowData.keywords || ""
              }
              id="keywords"
              name="keywords"
              type="text"
              variant="standard"
              onChange={(e) => {
                handleTextFieldChange(e);
                setRegenerateSeo(true);
              }}
              disabled={isResultPage}
              onBlur={() => {
                setRegenerateSeo(true);
                updateProductData();
              }}
            />
          </Box>
          <Box
            className="text-field-style"
            sx={{
              bgcolor: isResultPage ? "#f3f4f6 !important" : "white",
              display: "flex",
            }}
          >
            <InputLabel className="popup-lable">SEO Keywords</InputLabel>

            <Box
              sx={{
                width: "50%",
              }}
            >
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                value={inputValue}
                id="seo_keywords"
                name="seo_keywords"
                type="text"
                variant="standard"
                onChange={(e) => {
                  setInputValue(e.target.value);
                  handleTextFieldChange(e);
                }}
                disabled={isResultPage}
                onBlur={() => {
                  updateProductData();
                }}
              />
            </Box>

            {isLoadingSeoKeywords && (
              <Box sx={{ alignContent: "center" }}>
                <Spinner show={isLoadingSeoKeywords} />
              </Box>
            )}

            {!isResultPage && !isLoadingSeoKeywords && (
              <Button
                sx={{ alignSelf: "center" }}
                variant="contained"
                size="small"
                onClick={() => fetchSuggestedKeywords()}
              >
                {availableSeoKeywords.length != 0 && showKeywords
                  ? "Hide"
                  : "Suggest"}{" "}
                Keywords
              </Button>
            )}
          </Box>
          {availableSeoKeywords.length != 0 && (
            <Box
              sx={{
                borderBottom: showKeywords ? "1px solid #c6c6c6" : "0px",
              }}
            >
              {!isResultPage && showKeywords && (
                <Stack
                  direction="flex"
                  spacing={1}
                  sx={{ margin: 0.5, flexWrap: "wrap", gap: 1 }}
                >
                  {availableSeoKeywords.map((keyword) => (
                    <Chip
                      key={keyword.keyword_text}
                      label={keyword.keyword_text}
                      onClick={() => handleKeywordClick(keyword.keyword_text)}
                      sx={{ cursor: "pointer", borderRadius: 1 }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          )}

          <Box
            className="text-field-style"
            sx={{
              bgcolor: isResultPage ? "#f3f4f6 !important" : "white",
            }}
          >
            <InputLabel className="popup-lable">
              {isResultPage ? "Excluded Keywords" : "Exclude Keywords"}
            </InputLabel>
            <TextareaAutosize
              margin="dense"
              className="table-textarea"
              value={rowData.exclude_keywords}
              id="exclude_keywords"
              name="exclude_keywords"
              type="text"
              variant="standard"
              onChange={handleTextFieldChange}
              disabled={isResultPage}
              onBlur={() => {
                updateProductData();
              }}
            />
          </Box>
          {isResultPage && (
            <Box
              className="text-field-style"
              sx={{
                bgcolor: isResultPage ? "#f3f4f6 !important" : "white",
              }}
            >
              <InputLabel className="popup-lable">Channel</InputLabel>
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                value={rowData?.channel}
                id="channel"
                name="channel"
                type="text"
                variant="standard"
                // onChange={handleTextFieldChange}
                disabled={isResultPage}
                // onBlur={() => {
                //   updateProductData();
                // }}
              />
            </Box>
          )}
          {isResultPage && (
            <Box
              className="text-field-style"
              sx={{
                bgcolor: isResultPage ? "#f3f4f6 !important" : "white",
              }}
            >
              <InputLabel className="popup-lable">Persona</InputLabel>
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                value={rowData.persona}
                id="persona"
                name="persona"
                type="text"
                variant="standard"
                onChange={handleTextFieldChange}
                disabled={isResultPage}
                onBlur={() => {
                  updateProductData();
                }}
              />
            </Box>
          )}
          {/* {(uploadState?.premium || isResultPage) && ( */}
          <>
            <Box className="text-field-style">
              <InputLabel className="popup-lable">
                Product Description
              </InputLabel>
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                type="text"
                variant="standard"
                id="productDescription"
                name="product_description"
                value={rowData.product_description}
                onChange={handleTextFieldChange}
                onBlur={() => {
                  updateProductData();
                }}
              />
            </Box>
            <Box className="text-field-style">
              <InputLabel className="popup-lable">Feature Bullet1</InputLabel>
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                value={rowData.feature_bullet1}
                id="featureBullet1"
                name="feature_bullet1"
                type="text"
                variant="standard"
                onChange={handleTextFieldChange}
                onBlur={() => {
                  updateProductData();
                }}
              />
            </Box>
            <Box className="text-field-style">
              <InputLabel className="popup-lable">Feature Bullet2</InputLabel>
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                value={rowData.feature_bullet2}
                id="featureBullet2"
                name="feature_bullet2"
                type="text"
                variant="standard"
                onChange={handleTextFieldChange}
                onBlur={() => {
                  updateProductData();
                }}
              />
            </Box>
            <Box className="text-field-style">
              <InputLabel className="popup-lable">Feature Bullet3</InputLabel>
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                value={rowData.feature_bullet3}
                id="featureBullet3"
                name="feature_bullet3"
                type="text"
                variant="standard"
                onChange={handleTextFieldChange}
                onBlur={() => {
                  updateProductData();
                }}
              />
            </Box>
            <Box className="text-field-style">
              <InputLabel className="popup-lable">Feature Bullet4</InputLabel>
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                value={rowData.feature_bullet4}
                id="featureBullet4"
                name="feature_bullet4"
                type="text"
                variant="standard"
                onChange={handleTextFieldChange}
                onBlur={() => {
                  updateProductData();
                }}
              />
            </Box>
            <Box className="text-field-style">
              <InputLabel className="popup-lable">Feature Bullet5</InputLabel>
              <TextareaAutosize
                margin="dense"
                className="table-textarea"
                value={rowData.feature_bullet5}
                id="featureBullet5"
                name="feature_bullet5"
                type="text"
                variant="standard"
                onChange={handleTextFieldChange}
                onBlur={() => {
                  updateProductData();
                }}
              />
            </Box>
            {isResultPage && (
              <Box>
                <Box>
                  {rowData.seo_meta_title !== "" && (
                    <Box className="text-field-style">
                      <InputLabel className="popup-lable">
                        SEO Meta Title
                      </InputLabel>

                      {/* <Tooltip
                        title={
                          isFreeBasicUser
                            ? "Upgrade your plan to unlock this feature"
                            : ""
                        }
                        placement="bottom-start"
                      > */}
                      <TextareaAutosize
                        // style={{
                        //   filter: isFreeBasicUser ? "blur(5px)" : "none",
                        //   color: isFreeBasicUser ? "grey" : "initial",
                        //   userSelect: isFreeBasicUser ? "none" : "auto",
                        // }}
                        margin="dense"
                        className="table-textarea"
                        value={
                          rowData.seo_meta_title
                          // "Upgrade your plan to unlock SEO meta title"
                        }
                        id="seoMetaTitle"
                        name="seo_meta_title"
                        type="text"
                        variant="standard"
                        onChange={handleTextFieldChange}
                        // disabled={isFreeBasicUser}
                        onBlur={() => {
                          updateProductData();
                        }}
                        // onCopy={(e) => {
                        //   if (isFreeBasicUser) {
                        //     e.preventDefault();
                        //   }
                        // }}
                      />
                      {/* </Tooltip> */}
                    </Box>
                  )}

                  {rowData.seo_meta_description !== "" && (
                    <Box className="text-field-style">
                      <InputLabel className="popup-lable">
                        SEO Meta Description
                      </InputLabel>
                      {/* <Tooltip
                        title={
                          isFreeBasicUser
                            ? "Upgrade your plan to unlock this feature"
                            : ""
                        }
                        placement="top-start"
                      > */}
                      <TextareaAutosize
                        // style={{
                        //   filter: isFreeBasicUser ? "blur(5px)" : "none",
                        //   color: isFreeBasicUser ? "grey" : "initial",
                        //   userSelect: isFreeBasicUser ? "none" : "auto",
                        // }}
                        margin="dense"
                        className="table-textarea"
                        value={
                          rowData.seo_meta_description
                          // "Upgrade your plan to unlock SEO meta title & SEO meta description"
                        }
                        id="seoMetaDescription"
                        name="seo_meta_description"
                        type="text"
                        variant="standard"
                        onChange={handleTextFieldChange}
                        onBlur={() => {
                          updateProductData();
                        }}
                        // disabled={isFreeBasicUser}
                        // onCopy={(e) => {
                        //   if (isFreeBasicUser) {
                        //     e.preventDefault();
                        //   }
                        // }}
                      />
                      {/* </Tooltip> */}
                    </Box>
                  )}
                </Box>

                {!isFreeBasicUser && rowData.Taxonomy && (
                  <Box className="text-field-style">
                    <InputLabel className="popup-lable">Taxonomy</InputLabel>
                    <TextareaAutosize
                      margin="dense"
                      className="table-textarea"
                      value={rowData.Taxonomy}
                      id="Taxonomy"
                      name="Taxonomy"
                      type="text"
                      variant="standard"
                      onChange={handleTextFieldChange}
                      onBlur={() => {
                        updateProductData();
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}
          </>
          {/* )} */}
        </DialogContent>
      ) : (
        <DialogContent sx={{ bgcolor: "#f9f8f8" }}>
          {!isResultPage ? (
            <>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">
                  Optional Keywords
                </InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  type="text"
                  variant="standard"
                  id="optional_keywords"
                  name="optional_keywords"
                  value={rowData.optional_keywords}
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              <Box
                className="text-field-style"
                sx={{
                  borderBottom: "1px solid #b2b2b2",
                }}
              >
                <InputLabel className="popup-lable">Image URL</InputLabel>
                <Tooltip
                  title={
                    <>
                      <Link
                        href={rowData.image_url}
                        sx={{
                          pl: "4px",
                          width: {
                            xs: "50%",
                            sm: "100%",
                          },
                          overflow: "auto",
                          color: "white",
                        }}
                        className="table-textarea"
                        target="_blank"
                      >
                        {rowData.image_url}
                      </Link>
                    </>
                  }
                  sx={{
                    "& .css-yem012-MuiPopper-root-MuiTooltip-popper": {
                      backgroundColor: "white !important",
                    },
                  }}
                >
                  <TextareaAutosize
                    margin="dense"
                    className="table-textarea"
                    type="text"
                    variant="standard"
                    id="image_url"
                    name="image_url"
                    value={rowData.image_url}
                    onChange={handleTextFieldChange}
                    onBlur={() => {
                      updateProductData();
                    }}
                  />
                </Tooltip>
              </Box>
            </>
          ) : (
            <>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">
                  Optional Keywords
                </InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  type="text"
                  variant="standard"
                  id="optional keywords"
                  name="optional keywords"
                  value={rowData["optional_keywords"]}
                  onChange={handleTextFieldChange}
                  disabled
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              {isResultPage && (
                <Box className="text-field-style">
                  <InputLabel className="popup-lable">Persona</InputLabel>
                  <TextareaAutosize
                    margin="dense"
                    className="table-textarea"
                    type="text"
                    variant="standard"
                    id="persona"
                    name="persona"
                    value={rowData["persona"]}
                    onChange={handleTextFieldChange}
                    disabled
                    onBlur={() => {
                      updateProductData();
                    }}
                  />
                </Box>
              )}
              <Box
                className="text-field-style"
                sx={{
                  borderBottom: "1px solid #b2b2b2",
                }}
              >
                <InputLabel className="popup-lable">Image URL</InputLabel>
                <Tooltip
                  title={
                    <>
                      <Link
                        href={rowData.image_url}
                        sx={{
                          pl: "4px",
                          width: {
                            xs: "50%",
                            sm: "100%",
                          },
                          overflow: "auto",
                          color: "white",
                        }}
                        className="table-textarea"
                        target="_blank"
                      >
                        {rowData.image_url}
                      </Link>
                    </>
                  }
                  sx={{
                    "& .css-yem012-MuiPopper-root-MuiTooltip-popper": {
                      backgroundColor: "white !important",
                    },
                  }}
                >
                  <TextareaAutosize
                    margin="dense"
                    className="table-textarea"
                    type="text"
                    variant="standard"
                    id="image_url"
                    name="image_url"
                    value={rowData.image_url}
                    onChange={handleTextFieldChange}
                    disabled={isResultPage}
                    onBlur={() => {
                      updateProductData();
                    }}
                  />
                </Tooltip>
              </Box>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">Labels</InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  type="text"
                  variant="standard"
                  id="labels"
                  name="labels"
                  value={rowData.labels}
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">Alt Text</InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  type="text"
                  variant="standard"
                  id="alt-text"
                  name="alt-text"
                  value={rowData["alt-text"]}
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">
                  Product Description
                </InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  type="text"
                  variant="standard"
                  id="Item Description"
                  name="Item Description"
                  value={rowData["Item Description"]}
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">Feature Bullet1</InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  value={rowData.Feature_Bullet1}
                  id="Feature_Bullet1"
                  name="Feature_Bullet1"
                  type="text"
                  variant="standard"
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">Feature Bullet2</InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  value={rowData.Feature_Bullet2}
                  id="Feature_Bullet2"
                  name="Feature_Bullet2"
                  type="text"
                  variant="standard"
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">Feature Bullet3</InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  value={rowData.Feature_Bullet3}
                  id="Feature_Bullet3"
                  name="Feature_Bullet3"
                  type="text"
                  variant="standard"
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">Feature Bullet4</InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  value={rowData.Feature_Bullet4}
                  id="Feature_Bullet4"
                  name="Feature_Bullet4"
                  type="text"
                  variant="standard"
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>
              <Box className="text-field-style">
                <InputLabel className="popup-lable">Feature Bullet5</InputLabel>
                <TextareaAutosize
                  margin="dense"
                  className="table-textarea"
                  value={rowData.Feature_Bullet5}
                  id="Feature_Bullet5"
                  name="Feature_Bullet5"
                  type="text"
                  variant="standard"
                  onChange={handleTextFieldChange}
                  onBlur={() => {
                    updateProductData();
                  }}
                />
              </Box>

              {isResultPage && (
                <Box>
                  {rowData.seo_meta_title && (
                    <Box>
                      <Box className="text-field-style">
                        <Tooltip title="">
                          <InputLabel className="popup-lable">
                            SEO Meta Title
                          </InputLabel>
                        </Tooltip>

                        <TextareaAutosize
                          margin="dense"
                          className="table-textarea"
                          value={rowData.seo_meta_title}
                          id="seoMetaTitle"
                          name="seo_meta_title"
                          type="text"
                          variant="standard"
                          onChange={handleTextFieldChange}
                          onBlur={() => {
                            updateProductData();
                          }}
                        />
                      </Box>
                      <Box className="text-field-style">
                        <InputLabel className="popup-lable">
                          SEO Meta Description
                        </InputLabel>

                        <TextareaAutosize
                          margin="dense"
                          className="table-textarea"
                          value={rowData.seo_meta_description}
                          id="seoMetaDescription"
                          name="seo_meta_description"
                          type="text"
                          variant="standard"
                          onChange={handleTextFieldChange}
                          onBlur={() => {
                            updateProductData();
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  {rowData.Taxonomy && (
                    <Box className="text-field-style">
                      <InputLabel className="popup-lable">Taxonomy</InputLabel>
                      <TextareaAutosize
                        margin="dense"
                        className="table-textarea"
                        value={rowData.Taxonomy}
                        id="Taxonomy"
                        name="Taxonomy"
                        type="text"
                        variant="standard"
                        onChange={handleTextFieldChange}
                        onBlur={() => {
                          updateProductData();
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </DialogContent>
      )}
      <DialogActions>
        {/* <Button variant="contained" type="submit">
                Edit
            </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
