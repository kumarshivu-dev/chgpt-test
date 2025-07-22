import * as XLSX from "xlsx/xlsx";

export const handledeleteFile = async (email) => {
  try {
    const res = await fetch("/api/deleteFile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email: email }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Delete error:", err);
  }
};

export const fetchProductData = async (email) => {
  try {
    const res = await fetch("/api/getFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email: email }),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.warn("No product data found or error occurred:", data.message);
      return;
    }

    const {
      product_data,
      file_name,
      last_modified,
      mime_type,
      chosen_persona,
      generation_type,
    } = data;

    if (!product_data || !file_name || !chosen_persona) {
      console.warn("Product data or file name is missing required fields.");
      return;
    }

    // Create Excel file from fetched product data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(product_data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mysheet");

    // Generate Excel file buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // Create a Blob from the Excel buffer
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a file from the Blob
    const file = new File([blob], file_name, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return { file, chosen_persona, generation_type };
  } catch (err) {
    console.error("Error fetching product data from DB:", err);
  } finally {
    // setLoading(false);
  }
};
