import { openDb } from "../../lib/db"; // Make sure the path is correct!

export default async function handler(req, res) {
    const db = await openDb();
     
    if (req.method === "DELETE") {
        try {
          const { email } = req.body;
          if (!email) {
            return res.status(400).json({ message: "Email is required for deletion" });
          }
    
          const result = await db.run("DELETE FROM users WHERE email = ?", [email]);
    
          if (result.changes > 0) {
            res.status(200).json({ message: "User deleted successfully" });
          } else {
            res.status(404).json({ message: "User not found" });
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          res.status(500).json({ message: "Database deletion failed" });
        }
      } else {
        res.status(405).json({ message: "Method Not Allowed" });
      }
  }
  