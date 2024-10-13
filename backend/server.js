import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('POSTGRES_URL:', process.env.POSTGRES_URL); // 환경 변수 확인용

const app = express();

// 미들웨어
app.use(cors({
  origin: 'http://localhost:5173', // Vite 기본 포트
  credentials: true
}));
app.use(express.json());

// 라우트
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await testConnection(); // 서버 시작 시 데이터베이스 연결 테스트
});
