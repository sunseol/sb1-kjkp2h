import { db } from '@vercel/postgres';
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['GET', 'HEAD'],
  origin: '*', // 개발 중에는 모든 출처를 허용합니다. 프로덕션에서는 특정 도메인으로 제한하세요.
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
