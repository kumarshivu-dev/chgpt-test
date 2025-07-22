import { openDb } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { user_email } = req.body;

    if (!user_email) {
      return res.status(400).json({ message: 'Missing user_email' });
    }

    try {
      const db = await openDb();
      const result = await db.run(
        'DELETE FROM files WHERE user_email = ?',
        [user_email]
      );

      if (result.changes > 0) {
        res.status(200).json({ message: 'Product data deleted successfully' });
      } else {
        res.status(404).json({ message: 'No product data found for this user' });
      }
    } catch (error) {
      console.error('Error deleting product data:', error);
      res.status(500).json({ message: 'Database deletion failed', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
