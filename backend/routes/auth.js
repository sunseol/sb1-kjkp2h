import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    console.log('회원가입 요청 받음:', req.body);
    const { email, password } = req.body;
    let user = await User.findByEmail(email);
    if (user) {
      console.log('이미 존재하는 사용자:', email);
      return res.status(400).json({ msg: '이미 존재하는 사용자입니다.' });
    }
    user = await User.create(email, password);
    console.log('새 사용자 생성됨:', user);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('회원가입 오류:', err);
    res.status(500).json({ msg: '서버 오류', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('로그인 요청 받음:', req.body);
    const { email, password } = req.body;
    let user = await User.findByEmail(email);
    if (!user) {
      console.log('사용자를 찾을 수 없음:', email);
      return res.status(400).json({ msg: '유효하지 않은 인증 정보입니다.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('비밀번호 불일치:', email);
      return res.status(400).json({ msg: '유효하지 않은 인증 정보입니다.' });
    }
    console.log('로그인 성공:', email);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('로그인 오류:', err);
    res.status(500).send('서버 오류');
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    console.log('사용자 정보 요청 받음:', req.user.id);
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (err) {
    console.error('사용자 정보 조회 오류:', err);
    res.status(500).send('서버 오류');
  }
});

export default router;
