const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/reviews/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/reviews — avis validés uniquement
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM reviews WHERE status = 'approuve' ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews — soumettre un avis (en attente de validation)
router.post('/', upload.single('photo'), async (req, res) => {
  const { name, rating, comment, size } = req.body;
  if (!name || !rating || !comment) return res.status(400).json({ error: 'Champs obligatoires manquants' });
  try {
    const photoUrl = req.file ? `/uploads/reviews/${req.file.filename}` : null;
    await pool.query(
      `INSERT INTO reviews (name, rating, comment, size, photo_url, status) VALUES ($1,$2,$3,$4,$5,'en_attente')`,
      [name, parseInt(rating), comment, size || null, photoUrl]
    );
    res.status(201).json({ success: true, message: 'Avis soumis, en attente de validation.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reviews/:id/approve — valider un avis (admin)
router.patch('/:id/approve', async (req, res) => {
  try {
    await pool.query(`UPDATE reviews SET status='approuve' WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reviews/:id — supprimer un avis (admin)
router.delete('/:id', async (req, res) => {
  try {
    await pool.query(`DELETE FROM reviews WHERE id=$1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
