import { sql } from "@vercel/postgres";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'micro-cors';

const corsHandler = cors({
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  origin: '*'
});
const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  try {
    console.log('Attempting to query database...');
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    console.log('Query result:', result.rows);

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: '로그인 성공', token, id: user.id, username: user.username });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류', error: error.toString() });
  }
};

export default corsHandler(handler);