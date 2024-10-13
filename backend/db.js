import { createPool } from '@vercel/postgres';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('POSTGRES_URL:', process.env.POSTGRES_URL); // 환경 변수 확인용

const pool = createPool({
  connectionString: process.env.POSTGRES_URL
});

export const sql = {
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }
};

// 데이터베이스 연결 테스트
export const testConnection = async () => {
  try {
    const result = await sql.query('SELECT NOW()');
    console.log('Vercel Postgres 연결 성공:', result.rows[0]);
  } catch (err) {
    console.error('Vercel Postgres 연결 오류:', err);
    console.error('연결 문자열:', process.env.POSTGRES_URL);
  }
};

// 서버 시작 시 연결 테스트 실행
testConnection();
