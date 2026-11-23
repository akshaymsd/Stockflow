const express = require('express');
const pool = require('../db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { customer_id, items } = req.body;
  if (!customer_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'customer_id and items are required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [head] = await conn.query(
      'INSERT INTO sales (customer_id, total) VALUES (?, 0)',
      [customer_id]
    );
    const saleId = head.insertId;
    let total = 0;

    for (const it of items) {
      const qty = parseInt(it.qty, 10);
      if (!(qty > 0)) {
        throw new Error('Invalid qty');
      }

      // Product nte price um stock um database il ninnu edukkunnu. Client nu vila parayaan pattilla.
      const [rows] = await conn.query(
        'SELECT id, price, stock FROM products WHERE id = ? FOR UPDATE',
        [it.product_id]
      );
      if (rows.length === 0) {
        throw new Error('Product not found: ' + it.product_id);
      }
      const product = rows[0];

      if (product.stock < qty) {
        throw new Error(`Not enough stock for product ${product.id}. Available: ${product.stock}`);
      }

      await conn.query(
        'INSERT INTO sale_items (sale_id, product_id, qty, unit_price) VALUES (?, ?, ?, ?)',
        [saleId, product.id, qty, product.price]
      );
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [qty, product.id]
      );
      total += qty * Number(product.price);
    }

    await conn.query('UPDATE sales SET total = ? WHERE id = ?', [total, saleId]);
    await conn.commit();
    res.status(201).json({ sale_id: saleId, total });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;