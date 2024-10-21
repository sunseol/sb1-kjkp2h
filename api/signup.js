import { db } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['POST', 'HEAD', 'OPTIONS'],
  origin: 'https://sb1-kjkp2h-git-v11-sunseols-projects.vercel.app',
});

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { username, password, email } = req.body;

  try {
    console.log('Signup attempt:', { username, email });
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: '이미 존재하는 사용자 이름 또는 이메일입니다.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, hashedPassword, email]
    );

    res.status(201).json({ success: true, message: '회원가입 성공', user: result.rows[0] });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.toString() });
  }
};

export default cors(handler);
