import { openDb } from "../../lib/db"; // Make sure the path is correct!

export default async function handler(req, res) {
    const db = await openDb();
  
    if (req.method === 'POST') {
      try {
        const { email } = req.body;
        const users = await db.all('SELECT * FROM users WHERE email = ?', [email]) 
        
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Database query failed' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  