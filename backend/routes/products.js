const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, json_agg(json_build_object('size', ps.size, 'stock', ps.stock)) AS sizes
      FROM products p
      LEFT JOIN product_sizes ps ON ps.product_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, json_agg(json_build_object('size', ps.size, 'stock', ps.stock)) AS sizes
      FROM products p
      LEFT JOIN product_sizes ps ON ps.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Produit introuvable' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
