import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import Cors from 'cors';
import bcrypt from 'bcryptjs';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)
  
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      console.log('Attempting to query database...');
      const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      console.log('Query result:', rows);

      if (rows.length > 0) {
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          res.status(200).json({ success: true, message: '로그인 성공' });
        } else {
          res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
      } else {
        res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류', error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: '허용되지 않는 메소드' });
  }
}
