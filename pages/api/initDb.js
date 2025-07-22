import { openDb } from "../../lib/db";

export default async function handler(req, res) {
  // Basic Auth Credentials
  const authUser = process.env.INIT_DB_USER || "admin";
  const authPass = process.env.INIT_DB_PASS || "password";

  // Check Authorization Header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    return res.status(401).json({ message: "Authentication Required" });
  }

  // Decode the base64 credentials`
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  if (username !== authUser || password !== authPass) {
    return res.status(403).json({ message: "Forbidden: Invalid credentials" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const db = await openDb();

    // Create the users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        process_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        task_id TEXT NOT NULL,
        auth_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.run(`DROP TABLE IF EXISTS files`);

    await db.run(`
    CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    product_data TEXT NOT NULL,
    last_modified INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chosen_persona TEXT NOT NULL,
    generation_type TEXT NOT NULL
  )
`);

    res.status(200).json({
      message: "Database initialized successfully with product_data column!",
    });
  } catch (error) {
    console.error("Database Init Error:", error);
    res.status(500).json({ error: "Failed to initialize database." });
  }
}
