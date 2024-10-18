const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../utils/mongodb');

router.get('/users/:userId/projects', async (req, res) => {
  const { userId } = req.params;

  // 여기에 인증 로직을 추가해야 합니다.

  const { db } = await connectToDatabase();

  try {
    const projects = await db.collection('projects').find({ userId }).toArray();
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
