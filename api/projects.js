import { db } from '@vercel/postgres';
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['GET', 'HEAD', 'OPTIONS'],
  origin: 'https://sb1-kjkp2h-git-v11-sunseols-projects.vercel.app',
});

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      console.log('Fetching projects for user:', userId);
      const client = await db.connect();
      const result = await client.query('SELECT * FROM projects WHERE user_id = $1', [userId]);
      client.release();
      console.log('Projects found:', result.rows.length);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default cors(handler);
