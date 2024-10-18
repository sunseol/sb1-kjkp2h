import { db } from '@vercel/postgres';
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['GET', 'HEAD'],
  origin: '*',
});

const handler = async (req, res) => {
  console.log('Received request:', req.method, req.url);
  console.log('Query parameters:', req.query);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { userId } = req.query;
    if (!userId) {
      console.log('User ID is missing');
      return res.status(400).json({ error: 'User ID is required' });
    }
    try {
      console.log('Attempting to connect to database...');
      const client = await db.connect();
      console.log('Connected to database');
      
      console.log('Executing query for user ID:', userId);
      const result = await client.query('SELECT * FROM projects WHERE user_id = $1', [userId]);
      client.release();
      console.log('Query completed. Projects found:', result.rows.length);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error details:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  } else {
    console.log('Method not allowed:', req.method);
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default cors(handler);