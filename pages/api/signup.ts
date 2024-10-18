import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';
import Cors from 'cors';
import bcrypt from 'bcryptjs';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    const { username, password, email } = req.body;

    try {
      // 사용자 이름 중복 확인
      const { rows } = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

      if (rows.length > 0) {
        return res.status(400).json({ success: false, message: '이미 존재하는 사용자 이름 또는 이메일입니다.' });
      }

      // 비밀번호 해싱
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 새 사용자 추가
      await db.query(
        'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
        [username, hashedPassword, email]
      );

      res.status(201).json({ success: true, message: '회원가입 성공' });
    } catch (error) {
      console.error('회원가입 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류' });
    }
  } else {
    res.status(405).json({ success: false, message: '허용되지 않는 메소드' });
  }
}