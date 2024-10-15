import { createPool } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import cors from 'micro-cors';

const corsHandler = cors({
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  origin: '*' // 프로덕션 환경에서는 특정 도메인으로 제한하는 것이 좋습니다
});

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, email, password } = req.body;

  const pool = createPool({
    connectionString: process.env.POSTGRES_URL
  });

  try {
    // 이메일 중복 확인
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email, username',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: '회원가입 성공', user: result.rows[0] });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류' });
  }
};

export default corsHandler(handler);
