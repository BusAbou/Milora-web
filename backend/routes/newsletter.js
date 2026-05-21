const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email requis' });
  try {
    await pool.query(
      'INSERT INTO newsletter (email) VALUES ($1) ON CONFLICT (email) DO NOTHING',
      [email]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
