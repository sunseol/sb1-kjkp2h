import express from 'express';
import { db } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Vite 개발 서버 주소
  credentials: true,
}));

console.log('Database URL:', process.env.POSTGRES_URL);

async function checkAndCreateUsersTable() {
  try {
    const tableExists = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Users table does not exist. Creating...');
      await db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL
        );
      `);
      console.log('Users table created successfully');
    } else {
      console.log('Users table already exists');
    }
  } catch (error) {
    console.error('Error checking/creating users table:', error);
  }
}

// 서버 시작 전에 테이블 확인 및 생성
db.connect()
  .then(async (client) => {
    console.log('Database connected successfully');
    console.log('Database name:', client.database);
    console.log('Database user:', client.user);
    // 연결 테스트를 위한 간단한 쿼리 실행
    const result = await client.query('SELECT NOW()');
    console.log('Current database time:', result.rows[0].now);
    return checkAndCreateUsersTable();
  })
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

app.post('/api/login', async (req, res) => {
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
});

app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    console.log('Attempting to sign up user...');
    console.log('Received data:', { username, email });
    
    // 사용자 이름 중복 확인
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    console.log('Existing users:', rows);

    if (rows.length > 0) {
      console.log('User already exists');
      return res.status(400).json({ success: false, message: '이미 존재하는 사용자 이름 또는 이메일입니다.' });
    }

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 새 사용자 추가
    const result = await db.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, email]
    );
    console.log('New user created:', result.rows[0]);

    console.log('User signed up successfully');
    res.status(201).json({ success: true, message: '회원가입 성공' });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.toString() });
  }
});

export default app;
