import { sql } from "@vercel/postgres";
import bcrypt from 'bcryptjs';
import cors from 'micro-cors';

const corsHandler = cors({
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  origin: 'https://sb1-kjkp2h-pr3chvx7d-sunseols-projects.vercel.app'
});

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, email, password } = req.body;

  try {
    console.log('Attempting to sign up user...');
    console.log('Received data:', { username, email });
    
    // 사용자 이름 중복 확인
    const { rows } = await sql`SELECT * FROM users WHERE username = ${username} OR email = ${email}`;
    console.log('Existing users:', rows);

    if (rows.length > 0) {
      console.log('User already exists');
      return res.status(400).json({ message: '이미 존재하는 사용자 이름 또는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 새 사용자 추가
    const result = await sql`
      INSERT INTO users (username, email, password) 
      VALUES (${username}, ${email}, ${hashedPassword}) 
      RETURNING id, email, username
    `;
    console.log('New user created:', result.rows[0]);

    res.status(201).json({ message: '회원가입 성공', user: result.rows[0] });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류', error: error.toString() });
  }
};

export default corsHandler(handler);