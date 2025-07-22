import * as XLSX from "xlsx/xlsx";

export const createExcel = async (
  selectedProduct,
  dispatch,
  setSelectedFile,
  setIsGenerate,
  isGenerate,
  isSelected,
  imagefunction,
  user,
  chosen_persona
) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(selectedProduct);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Mysheet");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a file from the Blob
  const file = new File([blob], "product_doc.xlsx", {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Dispatch the file to the Redux store
  dispatch(setSelectedFile(file));
  setIsGenerate(!isGenerate);

  // Save the file as JSON data (instead of base64)
  const fileData = {
    user_email: user?.email,
    file_name: file.name,
    mime_type: file.type,
    product_data: selectedProduct, // Save the product data instead of base64
    last_modified: file.lastModified,
    chosen_persona: chosen_persona,
    generation_type: isSelected,
  };

  await saveFileToDB(fileData);
};

export const saveFileToDB = async (fileData) => {
  try {
    const res = await fetch("/api/saveFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fileData),
    });

    const data = await res.json();
    console.log("File saved to DB:", data);
    return data;
  } catch (error) {
    console.error("Error saving file to DB:", error);
    throw error;
  }
};

export const DownloadExcel = (data) => {
  if (!data || data.length === 0) {
    console.error("No data available to export");
    return;
  }

  // Dynamically extract keys (columns) from the first object
  const headers = Object.keys(data[0]).filter((key) => key !== "id");
  const currentDate = new Date().toISOString().split("T")[0];
  // Format data for Excel (ensure all rows have the same keys)
  const formattedData = data.map((row) => {
    const formattedRow = {};
    headers.forEach((key) => {
      if (key === "compliant") {
        // Handle the compliant field
        formattedRow[key] =
          row[key] === true
            ? "Compliant"
            : row[key] === false
            ? "Non-compliant"
            : ""; // Handle missing or null values
      } else {
        formattedRow[key] = row[key] ?? ""; // Use empty string for missing keys
      }
    });
    return formattedRow;
  });

  // Create a new workbook and worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "");

  const fileName = `readiness_report_${currentDate}.xlsx`;
  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, fileName);
};
