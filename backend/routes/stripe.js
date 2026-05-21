const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../db/pool');

// POST /api/stripe/checkout
router.post('/checkout', async (req, res) => {
  const { cartItems, sessionId } = req.body;
  try {
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name} — Taille ${item.size}`,
          images: item.image_url ? [`${process.env.FRONTEND_URL}${item.image_url}`] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/echec`,
      metadata: { cart_session_id: sessionId },
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU'] },
      billing_address_collection: 'required',
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/webhook
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const cartSessionId = session.metadata.cart_session_id;

    try {
      // Get cart items
      const { rows: cartItems } = await pool.query(`
        SELECT c.*, p.name, p.price FROM cart c
        JOIN products p ON p.id = c.product_id
        WHERE c.session_id = $1
      `, [cartSessionId]);

      if (cartItems.length > 0) {
        const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const orderNumber = 'MILORA-' + Date.now();
        const address = session.shipping_details?.address
          ? `${session.shipping_details.address.line1}, ${session.shipping_details.address.city}`
          : '';

        const { rows } = await pool.query(
          `INSERT INTO orders (order_number, email, total, status, stripe_session_id, shipping_address)
           VALUES ($1,$2,$3,'payee',$4,$5) RETURNING *`,
          [orderNumber, session.customer_details.email, total, session.id, address]
        );

        for (const item of cartItems) {
          await pool.query(
            `INSERT INTO order_items (order_id, product_id, size, quantity, price)
             VALUES ($1,$2,$3,$4,$5)`,
            [rows[0].id, item.product_id, item.size, item.quantity, item.price]
          );
        }

        // Clear cart
        await pool.query('DELETE FROM cart WHERE session_id=$1', [cartSessionId]);
      }
    } catch (err) {
      console.error('Webhook processing error:', err);
    }
  }

  res.json({ received: true });
});

module.exports = router;
