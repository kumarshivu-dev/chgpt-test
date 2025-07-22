import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const useTaxonomyParser = (file) => {
  const [taxonomyList, setTaxonomyList] = useState([]);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      // Convert rows into hierarchical strings
      const processedTaxonomy = sheet
        .map((row) => row.filter(Boolean).join(" > ")) // Remove empty values & join with " > "
        .filter((item) => item.length > 0); // Remove empty strings

      setTaxonomyList(processedTaxonomy);
    };

    reader.readAsArrayBuffer(file);
  }, [file]);

  return taxonomyList;
};

export default useTaxonomyParser;
