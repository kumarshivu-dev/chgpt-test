import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import {
  setproductTableData,
  setImgRecTableData,
  setSelectedTab,
} from "../../../store/dashboard/productTableSlice.js";
import { showToast } from "../../../context/ToastContext.js";

const AddNewDialog = ({
  openDialog,
  handleCloseDialog,
  isSelected,
  uploadState,
  setNewRow,
  newRow,
}) => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    product_id: "",
    product_name: "",
    brand: "",
    keywords: "",
    seo_keywords: "",
    exclude_keywords: "",
    product_description: "",
    feature_bullet1: "",
    feature_bullet2: "",
    feature_bullet3: "",
    feature_bullet4: "",
    feature_bullet5: "",
    image_id: "",
    item: "",
    optional_keywords: "",
    image_url: "",
  });

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // const formData = new FormData(event.currentTarget);
    // const formJson = Object.fromEntries(formData.entries())
    const isValidString = (value) => value && value.trim() !== "";
    const hasNoSpaces = (value) => !/\s/.test(value);

    const { product_id, product_name, brand, image_id, image_url } = formValues;

    const isAnyProductFieldTouched =
      product_id !== "" || product_name !== "" || brand !== "";

    const isImageInfoFilled = image_id !== "" || image_url !== "";

    if (isAnyProductFieldTouched) {
      if (!isValidString(product_id)) {
        showToast("Product ID cannot be empty.", "error");
        return;
      }
      if (!hasNoSpaces(product_id)) {
        showToast("ID must not contain spaces.", "error");
        return;
      }
      if (!isValidString(product_name)) {
        showToast("Product Name cannot be empty.", "error");
        return;
      }
      if (!isValidString(brand)) {
        showToast("Brand cannot be empty.", "error");
        return;
      }
    }

    if (isImageInfoFilled) {
      const trimmedImageId = image_id.trim();
      const trimmedImageUrl = image_url.trim();

      if (
        (trimmedImageId && !hasNoSpaces(trimmedImageId)) ||
        (trimmedImageUrl && !hasNoSpaces(trimmedImageUrl))
      ) {
        showToast(
          "Spaces are not allowed in Image ID or Image URL. Please check!",
          "error"
        );
        return;
      }
    }

    const createProductRow = () => ({
      id: uuidv4(),
      product_id: formValues.product_id,
      product_name: formValues.product_name,
      product_description: uploadState.seo
        ? formValues.product_description
        : formValues.product_description || "",
      brand: formValues.brand,
      feature_bullet1: formValues.feature_bullet1 || "",
      feature_bullet2: formValues.feature_bullet2 || "",
      feature_bullet3: formValues.feature_bullet3 || "",
      feature_bullet4: formValues.feature_bullet4 || "",
      feature_bullet5: formValues.feature_bullet5 || "",
      keywords: formValues.keywords,
      seo_keywords: formValues.seo_keywords || "",
      exclude_keywords: formValues.exclude_keywords,
      productDescription_1: "",
    });

    const createImageRow = () => ({
      id: uuidv4(),
      image_id: formValues.image_id,
      item: formValues.item,
      optional_keywords: formValues.optional_keywords,
      image_url: formValues.image_url,
    });

    const newRowData =
      isSelected === "product" ? createProductRow() : createImageRow();
    setNewRow([newRowData, ...newRow]);
    dispatch(
      isSelected === "product"
        ? setproductTableData([newRowData, ...newRow])
        : setImgRecTableData([newRowData, ...newRow])
    );

    event.target.reset();
    handleCloseDialog();

    setFormValues({
      product_id: "",
      product_name: "",
      brand: "",
      keywords: "",
      seo_keywords: "",
      exclude_keywords: "",
      product_description: "",
      feature_bullet1: "",
      feature_bullet2: "",
      feature_bullet3: "",
      feature_bullet4: "",
      feature_bullet5: "",
      image_id: "",
      item: "",
      optional_keywords: "",
      image_url: "",
    });
  };

  return (
    <Dialog
      open={openDialog}
      // onClose={handleCloseDialog}
      onClose={() => {
        handleCloseDialog();
        // Ensure any element with focus loses focus to avoid lingering tooltips
        document.activeElement.blur();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "6px",
        boxShadow: 24,
      }}
    >
      <Box>
        {isSelected === "product" ? (
          <DialogContent>
            <Typography sx={{ color: "#022149" }}>Add New Row</Typography>
            <TextField
              autoFocus
              required
              margin="dense"
              id="product_id"
              name="product_id"
              label="Product Id"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.product_id}
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="product_name"
              name="product_name"
              label="Product Name"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.product_name}
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="brand"
              name="brand"
              label="Brand"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.brand}
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="keywords"
              name="keywords"
              label="Keywords"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.keywords}
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="seo_keywords"
              name="seo_keywords"
              label="SEO Keywords"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.seo_keywords}
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="exclude_keywords"
              name="exclude_keywords"
              label="Exclude Keywords"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.exclude_keywords}
              onChange={handleInputChange}
            />
            {/* {uploadState.seo && ( */}
            <Box>
              <TextField
                autoFocus
                margin="dense"
                id="product_description"
                name="product_description"
                label="Product Description"
                type="text"
                fullWidth
                variant="standard"
                value={formValues.product_description}
                onChange={handleInputChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="feature_bullet1"
                name="feature_bullet1"
                label="Feature Bullet 1"
                type="text"
                fullWidth
                variant="standard"
                value={formValues.feature_bullet1}
                onChange={handleInputChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="feature_bullet2"
                name="feature_bullet2"
                label="Feature Bullet 2"
                type="text"
                fullWidth
                variant="standard"
                value={formValues.feature_bullet2}
                onChange={handleInputChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="feature_bullet3"
                name="feature_bullet3"
                label="Feature Bullet 3"
                type="text"
                fullWidth
                variant="standard"
                value={formValues.feature_bullet3}
                onChange={handleInputChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="feature_bullet4"
                name="feature_bullet4"
                label="Feature Bullet 4"
                type="text"
                fullWidth
                variant="standard"
                value={formValues.feature_bullet4}
                onChange={handleInputChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="feature_bullet5"
                name="feature_bullet5"
                label="Feature Bullet 5"
                type="text"
                fullWidth
                variant="standard"
                value={formValues.feature_bullet5}
                onChange={handleInputChange}
              />
            </Box>
            {/* )} */}
          </DialogContent>
        ) : (
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="image_id"
              name="image_id"
              label="Id"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.image_id}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="item"
              name="item"
              label="Item"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.item}
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              margin="dense"
              id="optional_keywords"
              name="optional_keywords"
              label="Optional Keywords"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.optional_keywords}
              onChange={handleInputChange}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="image_url"
              name="image_url"
              label="Image URL"
              type="text"
              fullWidth
              variant="standard"
              value={formValues.image_url}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
            />
          </DialogContent>
        )}
        <DialogActions>
          <Button
            id="cancel-btn"
            disableFocusRipple
            onClick={() => {
              handleCloseDialog();
              document.activeElement.blur();
            }}
          >
            Cancel
          </Button>
          <Button className="submit-btn" disableFocusRipple type="submit">
            Submit
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddNewDialog;
