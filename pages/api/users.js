import { openDb } from '../../lib/db';

export default async function handler(req, res) {
  const db = await openDb();

  if (req.method === 'GET') {
    const users = await db.all('SELECT * FROM users');
    res.json(users);
  } else if (req.method === 'POST') {
    const { process_name, email, task_id, auth_token } = req.body;

    // Ensure the required fields are present
    if (!process_name || !email || !task_id) {
      return res.status(400).json({ message: 'process_name, email, and task_id are required' });
    }

    try {
      // Step 1: Check if a user with the same email and task_id exists
      const existingUser = await db.get('SELECT * FROM users WHERE email = ? AND task_id = ?', [email, task_id]);

      // If user exists with same email and task_id, no need to insert
      if (existingUser) {
        return res.status(200).json({ message: 'User with this task already exists' });
      }

      // Step 2: Check if the email exists but with a different task_id
      const existingUserWithEmail = await db.get('SELECT * FROM users WHERE email = ?', [email]);

      // If a user exists with the same email but a different task_id, delete previous records
      if (existingUserWithEmail) {
        await db.run('DELETE FROM users WHERE email = ?', [email]);
        console.log(`Deleted existing records for email: ${email}`);
      }

      // Step 3: Insert the new user with the current timestamp
      await db.run(
        'INSERT INTO users (email, process_name, task_id, auth_token, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [email, process_name, task_id, auth_token]
      );
      res.status(201).json({ message: 'User added successfully' })

    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Database insertion failed' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
