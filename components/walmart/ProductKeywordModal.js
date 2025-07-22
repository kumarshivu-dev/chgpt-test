import {
  Checkbox,
  Button,
  FormControlLabel,
  Typography,
  Box,
  Grid,
  IconButton,
  FormControl,
  OutlinedInput,
  Snackbar,
  Alert,
  AlertTitle,
  Modal,
  TextareaAutosize,
} from "@mui/material";
import {
  setTags,
  setModalData,
  setKeywordTable,
  setCheck,
  setDeleteKeyFromTable,
  setFeaturesTable,
  setDescriptionTable,
  setKeywordFilterSortTable,
  setFeaturesFilterTable,
  setDescriptionFilterTable,
} from "../../store/walmart/productTableSlice";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 500,
  bgcolor: "#FAFAFA",
  border: "2px solid #FB9005",
  boxShadow: 24,
  p: 4,
};

export default function ProductKeywordModal({ isOpen, onClose, readOnly }) {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const productTableData = useSelector((state) => state.productTable);
  const checked = productTableData.check;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [LimitErrorsnackbarOpen, setLimitErrorsnackbarOpen] = useState(false);
  const [limitError, setLimitError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  let keywordsList = [];
  if (
    productTableData.modalData &&
    typeof productTableData.modalData.keywords === "string"
  ) {
    keywordsList =
      productTableData.modalData.keywords !== ""
        ? productTableData.modalData.keywords
            .split(",")
            .map((keyword) => keyword.trim())
        : [];
  }

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (
      (key === "," || key === "Enter") &&
      trimmedInput.length &&
      trimmedInput !== ","
    ) {
      e.preventDefault();
      const wordsBetweenCommas = trimmedInput
        .split(",")
        .map((word) => word.trim());

      const uniqueWordsBetweenCommas = wordsBetweenCommas.filter(
        (word) => !keywordsList.includes(word)
      );

      const newTags = [...keywordsList, ...uniqueWordsBetweenCommas];

      if (newTags.length > 50) {
        setLimitError("Maximum limit of 50 keywords exceeded.");
        setLimitErrorsnackbarOpen(true);
      } else {
        dispatch(
          setModalData({
            ...productTableData.modalData,
            keywords: newTags.join(","),
          })
        );
        setInput("");
      }
    }

    if (key === "Backspace" && !input.length && keywordsList.length) {
      const tagsCopy = [...keywordsList];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      dispatch(
        setModalData({
          ...productTableData.modalData,
          keywords: tagsCopy.join(","),
        })
      );
      setInput(poppedTag);
    }
  };
  const deleteKey = (index) => {
    if (index >= 0 && index < keywordsList.length) {
      const keywordToDelete = keywordsList[index];
      const updatedKeywords = [
        ...productTableData.modalData.keywords.split(","),
      ];
      updatedKeywords.splice(index, 1);

      const updatedKeywordsString = updatedKeywords.join(",");

      dispatch(
        setModalData({
          ...productTableData.modalData,
          keywords: updatedKeywordsString,
        })
      );

      dispatch(
        setDeleteKeyFromTable({
          rowId: productTableData.modalData.id,
          keywordToDelete: keywordToDelete,
        })
      );
    }
  };

  const handleCheckboxChange = (event) => {
    dispatch(setTags(keywordsList));
    dispatch(setCheck(event.target.checked));
  };
  const handleSubmit = () => {
    console.log("keywordlist", keywordsList);
    if (keywordsList.length === 0) {
      setLimitError("Please enter at least one non-empty keyword.");
      setLimitErrorsnackbarOpen(true);
      return;
    } else {
      dispatch(
        setKeywordTable({
          keywords: keywordsList,
          id: productTableData.modalData.id,
          check: checked,
        })
      );
      dispatch(
        setKeywordFilterSortTable({
          keywords: keywordsList,
          id: productTableData.modalData.id,
          check: checked,
        })
      );
    }
    setTags([]);
    setSuccessMsg("Keywords Added Successfully!");
    setSnackbarOpen(true);
  };

  //Keyword Resutl Modal
  const handleDescription = (e) => {
    const newDesc = e.target.value;
    dispatch(setModalData({ ...productTableData.modalData, desc: newDesc }));
  };

  const handleFeatureBulletOne = (e, index) => {
    const newFeatures = [...productTableData.modalData.featureBulletOne];
    newFeatures[index] = e.target.value;

    dispatch(
      setModalData({
        ...productTableData.modalData,
        featureBulletOne: newFeatures,
      })
    );
  };

  const handleSave = () => {
    dispatch(
      setFeaturesTable({
        rowId: productTableData.modalData.id,
        product_bullets: productTableData.modalData.featureBulletOne,
      })
    );
    dispatch(
      setDescriptionTable({
        rowId: productTableData.modalData.id,
        description: productTableData.modalData.desc,
      })
    );

    dispatch(
      setFeaturesFilterTable({
        rowId: productTableData.modalData.id,
        product_bullets: productTableData.modalData.featureBulletOne,
      })
    );
    dispatch(
      setDescriptionFilterTable({
        rowId: productTableData.modalData.id,
        description: productTableData.modalData.desc,
      })
    );

    setSuccessMsg("Description and feature bullets saved successfully");
    setSnackbarOpen(true);
  };

  //SnackBar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setLimitErrorsnackbarOpen(false);
  };

  return (
    <div>
      <Modal
        className="main-modal-wrapper"
        keepMounted
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="product-modal-container">
          <Grid container className="modal-content">
            <Grid item sm={11}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Image
                  className="svg-alingment"
                  src="/walmart/product_name.png"
                  width="38"
                  height="41"
                  quality={100}
                  alt="logo"
                ></Image>
                <Typography variant="h5" gutterBottom>
                  {productTableData.modalData.productName}
                  <Typography
                    variant="span"
                    sx={{ display: "block", fontSize: "12px" }}
                  >
                    <strong>#ID</strong> {productTableData.modalData.id}
                  </Typography>
                </Typography>
              </div>
            </Grid>

            <Grid item sm={1}>
              <IconButton
                sx={{
                  marginLeft: "45px",
                  "& svg": {
                    fontSize: "2rem",
                  },
                }}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            {/* keywords/Tags Input Box */}
            <Grid item xs={12}>
              {/* {readOnly && ( */}
              <Grid
                mt={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Image
                  className="pointer-svg-alingment"
                  src="/walmart/product_keyword.png"
                  width="17"
                  height="14"
                  quality={80}
                  alt="logo"
                ></Image>
                <Typography>
                  {readOnly ? (
                    <strong>Add Keywords or Keyphrases, comma separated</strong>
                  ) : (
                    <strong>Added Keywords</strong>
                  )}
                </Typography>
              </Grid>

              {readOnly && (
                <div>
                  <FormControl fullWidth>
                    <OutlinedInput
                      type="text"
                      placeholder="Input Your Keywords"
                      value={input}
                      onKeyDown={onKeyDown}
                      onChange={handleInput}
                    />
                  </FormControl>
                  <Typography sx={{ textAlign: "right" }}>
                    {keywordsList.length}/50
                  </Typography>
                </div>
              )}

              <Grid container>
                {keywordsList.map((tag, index) => (
                  <Grid item sz={1} className="tag" key={index}>
                    <Grid className="tagList">{tag}</Grid>

                    {keywordsList.length > 0 && readOnly && (
                      <IconButton onClick={() => deleteKey(index)}>
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Check Keywords */}

            {readOnly && (
              <div>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleCheckboxChange}
                      />
                    }
                    label="Append Keywords to each product"
                  />
                </Grid>
                {/* Submit & Cancel Button */}
                <Grid item xs={12}>
                  <Button
                    sx={{
                      marginRight: "10px",
                      backgroundColor: "#828282",
                      color: "#FFFFFF",
                      borderRadius: "5px",
                    }}
                    onClick={handleSubmit}
                    variant="contained"
                  >
                    Submit
                  </Button>
                  <Button
                    variant="transparent"
                    sx={{ color: "#828282", borderRadius: "5px" }}
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </Grid>
              </div>
            )}

            {/* Description box */}
            <Grid item sm={12}>
              <Grid
                mt={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <Image
                  className="pointer-svg-alingment"
                  src="/walmart/product_description.png"
                  width="14"
                  height="12"
                  quality={100}
                  alt="logo"
                ></Image>
                <Typography>
                  <strong>Description</strong>
                </Typography>
              </Grid>

              <FormControl fullWidth>
                <TextareaAutosize
                  style={{ maxWidth: "750px" }}
                  minRows={3}
                  maxRows={10}
                  value={productTableData.modalData.desc}
                  placeholder="Type your description here..."
                  onChange={handleDescription}
                  readOnly={readOnly}
                />
              </FormControl>
            </Grid>
            {/*Feature Buttel point 1 */}
            <Grid item sm={12}>
              {!readOnly &&
              Array.isArray(productTableData.modalData.featureBulletOne) &&
              productTableData.modalData.featureBulletOne.length > 0 ? (
                productTableData.modalData.featureBulletOne.map(
                  (features, index) => (
                    <div key={index}>
                      <Grid
                        mt={4}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <Image
                          className="pointer-svg-alingment"
                          src="/walmart/product_feature.png"
                          width="17"
                          height="14"
                          quality={100}
                          alt="logo"
                        ></Image>
                        <Typography>
                          <strong>Key Feature</strong>
                        </Typography>
                      </Grid>
                      <FormControl fullWidth>
                        <TextareaAutosize
                          style={{ maxWidth: "750px" }}
                          minRows={3}
                          maxRows={10}
                          value={features}
                          placeholder="Key Feature"
                          onChange={(e) => handleFeatureBulletOne(e, index)}
                          disabled={readOnly}
                        />
                      </FormControl>
                    </div>
                  )
                )
              ) : (
                <>
                  <Grid
                    mt={4}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <Image
                      className="pointer-svg-alingment"
                      src="/walmart/product_feature.png"
                      width="17"
                      height="14"
                      quality={100}
                      alt="logo"
                    ></Image>
                    <Typography>
                      <strong>Key Feature</strong>
                    </Typography>
                  </Grid>
                  <FormControl fullWidth>
                    <TextareaAutosize
                      style={{ maxWidth: "750px" }}
                      minRows={3}
                      maxRows={10}
                      value=""
                      placeholder="Key Feature"
                      disabled={readOnly}
                    />
                  </FormControl>
                </>
              )}
            </Grid>
          </Grid>
          {!readOnly && (
            <Grid className="modal-footer">
              <Grid
                item
                xs={12}
                sx={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  sx={{
                    marginRight: "10px",
                    backgroundColor: "#828282",
                    color: "#FFFFFF",
                    borderRadius: "5px",
                  }}
                  onClick={handleSave}
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  variant="transparent"
                  sx={{
                    color: "#828282",
                    borderRadius: "5px",
                  }}
                  onClick={onClose}
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </Modal>

      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={snackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="success" onClose={handleSnackbarClose}>
          <AlertTitle>success</AlertTitle>
          {successMsg}
        </Alert>
      </Snackbar>
      {/* <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={ErrorsnackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>Error</AlertTitle>
          {errorMsg?.response?.data?.error
            ? errorMsg?.response?.data?.error
            : "unknown error occured"}
        </Alert>
      </Snackbar> */}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={LimitErrorsnackbarOpen}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert severity="error" onClose={handleSnackbarClose}>
          <AlertTitle>Error</AlertTitle>
          {limitError}
        </Alert>
      </Snackbar>
    </div>
  );
}
