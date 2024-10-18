const express = require('express');
const router = express.Router();
const { query } = require('../utils/database');

router.get('/api/users/:userId/projects', async (req, res) => {
  const { userId } = req.params;

  // 여기에 인증 로직을 추가해야 합니다.

  try {
    const result = await query('SELECT * FROM projects WHERE user_id = $1', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
