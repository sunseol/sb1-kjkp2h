import { db } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['POST', 'HEAD', 'OPTIONS'],
  origin: '*', // 프로덕션에서는 특정 도메인으로 제한하세요.
});

const handler = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    console.log('Attempting to login user:', email);
    const client = await db.connect();
    const { rows } = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    client.release();

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        console.log('Login successful for user:', email);
        res.status(200).json({ 
          success: true, 
          message: '로그인 성공', 
          id: user.id,
          username: user.username,
          email: user.email
        });
      } else {
        console.log('Invalid password for user:', email);
        res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }
    } else {
      console.log('User not found:', email);
      res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.message });
  }
};

export default cors(handler);
