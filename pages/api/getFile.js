import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_email } = req.body;

    if (!user_email) {
      return res.status(400).json({ message: "Missing email" });
    }

    try {
      const db = await openDb();

      const file = await db.get(
        "SELECT * FROM files WHERE user_email = ? ORDER BY created_at DESC LIMIT 1",
        [user_email]
      );

      if (!file) {
        return res.status(404).json({ message: "Product data not found" });
      }

      // Check if product_data exists and is valid
      if (!file.product_data) {
        return res.status(404).json({ message: "Product data is missing" });
      }

      // Parse the stored JSON string back into an object
      let parsedProductData;
      try {
        parsedProductData = JSON.parse(file?.product_data);
      } catch (error) {
        console.error("Error parsing product data:", error);
        return res.status(500).json({ message: "Error parsing product data" });
      }

      let parsedchosenPersona;
      try {
        parsedchosenPersona = JSON.parse(file?.chosen_persona);
      } catch (error) {
        console.error("Error parsing chosen persona:", error);
        return res
          .status(500)
          .json({ message: "Error parsing chosen persona" });
      }

      res.status(200).json({
        user_email: file.user_email,
        file_name: file.file_name,
        mime_type: file.mime_type,
        created_at: file.created_at,
        product_data: parsedProductData,
        last_modified: file.last_modified,
        chosen_persona: parsedchosenPersona,
        generation_type: file.generation_type,
      });
    } catch (error) {
      console.error("Error fetching product data:", error);
      res.status(500).json({ message: "Database error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
