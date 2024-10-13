import { sql } from '../db.js';
import bcrypt from 'bcryptjs';

const User = {
  async create(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await sql.query(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING *',
      [email, hashedPassword]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await sql.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await sql.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }
};

export default User;
