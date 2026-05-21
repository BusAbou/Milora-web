const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Champs obligatoires manquants' });
  try {
    await pool.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES ($1,$2,$3,$4)',
      [name, email, subject, message]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
