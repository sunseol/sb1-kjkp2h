import { getSession } from 'next-auth/react';
import { query } from '../../../utils/database';
import Cors from 'cors';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  console.log('API route hit:', req.url);
  console.log('Query params:', req.query);

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { userId } = req.query;

  if (session.user.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const result = await query('SELECT * FROM projects WHERE user_id = $1', [userId]);
    console.log('Projects found:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
