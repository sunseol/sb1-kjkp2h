import { query } from '../../utils/database';
import bcrypt from 'bcryptjs';
import Cors from 'cors';

const cors = Cors({
  methods: ['POST', 'HEAD'],
  origin: '*', // 개발 중에는 모든 출처를 허용합니다. 프로덕션에서는 특정 도메인으로 제한하세요.
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

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Invalid password for email:', email);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const response = {
      success: true,
      id: user.id.toString(),
      username: user.username,
      email: user.email
    };
    console.log('Successful login. Response:', JSON.stringify(response));
    res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
