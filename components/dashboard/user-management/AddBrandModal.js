import { Box, Modal, Checkbox, FormControlLabel, Button } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { UPDATE_BRANDS_TO_USER } from "../../../utils/apiEndpoints";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AddBrandModal = ({
  user,
  isOpen,
  onClose,
  onTableUpdate,
  rowData,
  brands,
  activateSnackbar,
}) => {
  const [selectedBrandIds, setSelectedBrandIds] = useState([]); // Store the selected brand ids (multiple brands)

  // Filter only active brands
  const activeBrands = brands.filter((brand) => brand.status === "active");

  // Extract brandNames from rowData for comparison (brands already associated with the user)
  const existingBrandNames = rowData?.brandsInfo?.map(
    (brand) => brand?.brandName
  );

  // Pre-select the brands that are already associated with the user
  useEffect(() => {
    const preselectedBrands = rowData?.brandsInfo?.map(
      (brand) => brand?.brandId
    );
    setSelectedBrandIds(preselectedBrands); // Preselect already associated brands
  }, [rowData]);

  const handleCheckboxChange = (brandId) => {
    // If the brand is already selected, deselect it
    if (selectedBrandIds?.includes(brandId)) {
      setSelectedBrandIds((prev) => prev.filter((id) => id !== brandId));
    } else {
      // Add the brandId to the selected brands
      setSelectedBrandIds((prev) => [...prev, brandId]);
    }
  };


  const handleUpdate = async () => {
    const payload = {
      email: rowData?.email,
      brandIds: selectedBrandIds, // Send all selected brand IDs
    };

    try {
      // Make API call using axios
      const response = await axios.post(
        process.env.NEXT_PUBLIC_DASHBOARD_BASE_URL + UPDATE_BRANDS_TO_USER, // Update URL accordingly
        payload,
        {
          headers: {
            Authorization: user?.id_token, // Pass the Authorization token
          },
        }
      );

      if (response?.data?.status === true) {
        // Activate the snackbar to show success
        activateSnackbar("Brands added successfully!", "success");
        onTableUpdate(); // Optionally update the table data
        onClose(); // Close the modal
      } else {
        activateSnackbar("Failed to add brands", "error");
      }
    } catch (error) {
      console.error("Error adding brands:", error);
      // activateSnackbar("Error occurred while adding brands", "error");
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={style}>
        <h2>Add Active Brands to User</h2>

        {/* Render active brands with checkboxes */}
        {activeBrands.map((brand) => (
          <FormControlLabel
            key={brand.brand_id}
            control={
              <Checkbox
                checked={selectedBrandIds.includes(brand.brand_id)} // Check if the brand is selected
                // disabled={existingBrandNames.includes(brand.name)} // Disable if already selected in rowData
                onChange={() => handleCheckboxChange(brand.brand_id)} // Handle checkbox change
              />
            }
            label={brand.name} // Display brand name
          />
        ))}

        {/* Update button to trigger the API call */}
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
      </Box>
    </Modal>
  );
};

export default AddBrandModal;
