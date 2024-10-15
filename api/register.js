import { createPool } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import cors from 'micro-cors';

const corsHandler = cors({
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  origin: process.env.VERCEL_URL 
    ? 'https://sb1-kjkp2h-o6stapb0f-sunseols-projects.vercel.app' 
    : 'http://localhost:5173'
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
    connectionString: `postgres://default:Na1fi3zUgMFc@ep-twilight-boat-a4kkazrn-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require`
  });

  try {
    console.log('Attempting to sign up user...');
    console.log('Received data:', { username, email });
    
    // 사용자 이름 중복 확인
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    console.log('Existing users:', rows);

    if (rows.length > 0) {
      console.log('User already exists');
      return res.status(400).json({ message: '이미 존재하는 사용자 이름 또는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 새 사용자 추가
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, email, username',
      [username, email, hashedPassword]
    );
    console.log('New user created:', result.rows[0]);

    res.status(201).json({ message: '회원가입 성공', user: result.rows[0] });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류', error: error.toString() });
  }
};

export default corsHandler(handler);