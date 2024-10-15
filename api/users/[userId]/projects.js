import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT id, name, created_at FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      res.status(200).json({ success: true, projects: result.rows });
    } catch (error) {
      console.error('프로젝트 조회 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류', error: error.toString() });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
