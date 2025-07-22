import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      user_email,
      file_name,
      mime_type,
      product_data,
      last_modified,
      chosen_persona,
      generation_type,
    } = req.body;

    if (
      !user_email ||
      !file_name ||
      !mime_type ||
      !product_data ||
      !chosen_persona ||
      !generation_type
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const db = await openDb();

      // Insert product_data as a stringified JSON into the files table
      await db.run(
        `INSERT INTO files (user_email, file_name, mime_type, product_data, last_modified, chosen_persona, generation_type)
         VALUES (?, ?, ?, ?, ?,?, ?)`,
        [
          user_email,
          file_name,
          mime_type,
          JSON.stringify(product_data),
          last_modified,
          JSON.stringify(chosen_persona),
          generation_type,
        ] // Ensure product_data is stored as a JSON string
      );

      res.status(201).json({ message: "Product data saved successfully" });
    } catch (error) {
      console.error("Error saving product data:", error.message);
      res.status(500).json({ message: "Database error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
