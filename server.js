import express from 'express';
import { db } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// CORS 설정을 환경에 따라 다르게 적용
const corsOptions = {
  origin: ['https://sb1-kjkp2h-git-v11-sunseols-projects.vercel.app', 'http://localhost:5173'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

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

// 프로젝트 테이블 생성 함수 수정
async function checkAndCreateProjectsTable() {
  try {
    const tableExists = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'projects'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Projects table does not exist. Creating...');
      await db.query(`
        CREATE TABLE projects (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          name VARCHAR(255) NOT NULL,
          data JSONB NOT NULL,
          html_content TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Projects table created successfully');
    } else {
      console.log('Projects table already exists');
      // 기존 테이블에 html_content 컬럼 추가
      await db.query(`
        ALTER TABLE projects
        ADD COLUMN IF NOT EXISTS html_content TEXT;
      `);
      console.log('Added html_content column if it did not exist');
    }
  } catch (error) {
    console.error('Error checking/creating projects table:', error);
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
    await checkAndCreateUsersTable();
    await checkAndCreateProjectsTable();
    return client;
  })
  .then((client) => {
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
  const { email, password } = req.body;
  console.log('Login attempt:', { email }); // 비밀번호는 로그에 남기지 않습니다.

  try {
    console.log('Querying database for user:', email);
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Query result:', rows.length > 0 ? 'User found' : 'User not found');

    if (rows.length > 0) {
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);

      if (isMatch) {
        console.log('Login successful for user:', email);
        res.status(200).json({ 
          success: true, 
          message: '로그인 성공', 
          id: user.id,
          username: user.username 
        });
      } else {
        console.log('Login failed: incorrect password for user:', email);
        res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }
    } else {
      console.log('Login failed: user not found:', email);
      res.status(401).json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.message });
  }
});

app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;
  console.log('Signup attempt:', { username, email });

  try {
    console.log('Checking for existing user:', { username, email });
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    console.log('Existing users found:', rows.length);

    if (rows.length > 0) {
      console.log('Signup failed: User already exists');
      return res.status(400).json({ success: false, message: '이미 존재하는 사용자 이름 또는 이메일입니다.' });
    }

    console.log('Hashing password');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Inserting new user into database');
    const result = await db.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, email]
    );
    console.log('New user created:', { id: result.rows[0].id, username: result.rows[0].username });

    res.status(201).json({ success: true, message: '회원가입 성공' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.toString() });
  }
});

// 프로젝트 저장 API 수정
app.post('/api/projects', async (req, res) => {
  const { userId, name, data, htmlContent } = req.body;

  console.log('Received project data:', { userId, name, dataLength: JSON.stringify(data).length, htmlContentLength: htmlContent ? htmlContent.length : 0 });

  try {
    const result = await db.query(
      'INSERT INTO projects (user_id, name, data, html_content) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name || '새 프로젝트', JSON.stringify(data), htmlContent || '']
    );
    console.log('Inserted project:', result.rows[0]);
    res.status(201).json({ success: true, project: result.rows[0] });
  } catch (error) {
    console.error('프로젝트 저장 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.toString() });
  }
});

// 사용자의 프로젝트 목록 조회 API
app.get('/api/users/:userId/projects', async (req, res) => {
  const { userId } = req.params;

  try {
    console.log('Fetching projects for user:', userId);
    const result = await db.query('SELECT id, name, created_at FROM projects WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    console.log('Projects found:', result.rows.length);
    res.status(200).json({ success: true, projects: result.rows });
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.toString() });
  }
});

// 단일 프로젝트 조회 API
app.get('/api/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    console.log('Fetching project with id:', projectId);
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    console.log('Query result:', result.rows);
    if (result.rows.length > 0) {
      const project = result.rows[0];
      // data 필드가 JSON 문자열이라면 파싱
      if (typeof project.data === 'string') {
        project.data = JSON.parse(project.data);
      }
      res.status(200).json({ success: true, project: project });
    } else {
      res.status(404).json({ success: false, message: '프로젝트를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('프로젝트 조회 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.toString() });
  }
});

// 프로젝트 삭제 API
app.delete('/api/projects/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    console.log('Deleting project with id:', projectId);
    const result = await db.query('DELETE FROM projects WHERE id = $1 RETURNING *', [projectId]);
    
    if (result.rows.length > 0) {
      res.status(200).json({ success: true, message: '프로젝트가 성공적으로 삭제되었습니다.' });
    } else {
      res.status(404).json({ success: false, message: '프로젝트를 찾을 수 없습니다.' });
    }
  } catch (error) {
    console.error('프로젝트 삭제 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류', error: error.toString() });
  }
});

// 프로젝트 조회 API 수정
app.get('/api/projects', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    console.log('Fetching projects for user:', userId);
    const result = await db.query('SELECT * FROM projects WHERE user_id = $1', [userId]);
    console.log('Projects found:', result.rows.length);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 전역 에러 핸들러 추가
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: '서버 오류', error: err.toString() });
});

export default app;
