const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET /api/cart/:sessionId
router.get('/:sessionId', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT c.*, p.name, p.price, p.image_url
      FROM cart c
      JOIN products p ON p.id = c.product_id
      WHERE c.session_id = $1
    `, [req.params.sessionId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart
router.post('/', async (req, res) => {
  const { session_id, product_id, size, quantity } = req.body;
  try {
    // Check if item already exists
    const existing = await pool.query(
      'SELECT * FROM cart WHERE session_id=$1 AND product_id=$2 AND size=$3',
      [session_id, product_id, size]
    );
    if (existing.rows[0]) {
      const { rows } = await pool.query(
        'UPDATE cart SET quantity = quantity + $1 WHERE id=$2 RETURNING *',
        [quantity || 1, existing.rows[0].id]
      );
      return res.json(rows[0]);
    }
    const { rows } = await pool.query(
      'INSERT INTO cart (session_id, product_id, size, quantity) VALUES ($1,$2,$3,$4) RETURNING *',
      [session_id, product_id, size, quantity || 1]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cart/:itemId
router.put('/:itemId', async (req, res) => {
  const { quantity } = req.body;
  try {
    if (quantity <= 0) {
      await pool.query('DELETE FROM cart WHERE id=$1', [req.params.itemId]);
      return res.json({ deleted: true });
    }
    const { rows } = await pool.query(
      'UPDATE cart SET quantity=$1 WHERE id=$2 RETURNING *',
      [quantity, req.params.itemId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:itemId
router.delete('/:itemId', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE id=$1', [req.params.itemId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
