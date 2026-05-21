const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// POST /api/orders
router.post('/', async (req, res) => {
  const { email, total, stripe_session_id, shipping_address, items } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderNumber = 'MILORA-' + Date.now();
    const { rows } = await client.query(
      `INSERT INTO orders (order_number, email, total, stripe_session_id, shipping_address)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [orderNumber, email, total, stripe_session_id, shipping_address]
    );
    const order = rows[0];
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, size, quantity, price)
         VALUES ($1,$2,$3,$4,$5)`,
        [order.id, item.product_id, item.size, item.quantity, item.price]
      );
    }
    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// GET /api/orders/:id (suivi par order_number + email)
router.get('/:orderNumber', async (req, res) => {
  const { email } = req.query;
  try {
    const { rows } = await pool.query(
      `SELECT o.*, json_agg(json_build_object(
         'name', p.name, 'size', oi.size,
         'quantity', oi.quantity, 'price', oi.price, 'image_url', p.image_url
       )) AS items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p ON p.id = oi.product_id
       WHERE o.order_number=$1 AND o.email=$2
       GROUP BY o.id`,
      [req.params.orderNumber, email]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Commande introuvable' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
