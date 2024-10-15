import { createPool } from '@vercel/postgres';

const pool = createPool({
  connectionString: process.env.POSTGRES_URL
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // 프로젝트 생성 로직
  } else if (req.method === 'GET') {
    // 프로젝트 조회 로직
  } else if (req.method === 'DELETE') {
    // 프로젝트 삭제 로직
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
