const express = require('express');
const pool=require('../db');
const router=express.Router();

router.post('/', async (req, res) => {
  const { supplier_id, items } = req.body;
    if (!supplier_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
        error: 'supplier_id and items are required'
    });
}
      const conn = await pool.getConnection();
        try {
    await conn.beginTransaction();
        const [head] = await conn.query(
      'INSERT INTO purchases (supplier_id, total) VALUES (?, 0)',
      [supplier_id]
    );
    const purchaseId = head.insertId;
    let total = 0;
        for (const it of items) {
      const qty = parseInt(it.qty, 10);
      const cost = Number(it.unit_cost);
      if (!(qty > 0) || !(cost > 0)) {
        throw new Error('Invalid qty or unit_cost');
      }
      const [prod] = await conn.query('SELECT id FROM products WHERE id = ?', [it.product_id]);
      if (prod.length === 0) {
        throw new Error('Product not found: ' + it.product_id);
      }
      await conn.query(
        'INSERT INTO purchase_items (purchase_id, product_id, qty, unit_cost) VALUES (?, ?, ?, ?)',
        [purchaseId, it.product_id, qty, cost]
      );
      await conn.query(
        'UPDATE products SET stock = stock + ? WHERE id = ?',
        [qty, it.product_id]
      );
      total += qty * cost;
    }
        await conn.query('UPDATE purchases SET total = ? WHERE id = ?', [total, purchaseId]);
    await conn.commit();
    res.status(201).json({ purchase_id: purchaseId, total });
      } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(400).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;

