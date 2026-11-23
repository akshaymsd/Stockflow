const express = require('express');
const pool = require('../db');
const router = express.Router();

// 1. Low stock: stock reorder level il thaazhe aayavar
router.get('/low-stock', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, sku, stock, reorder_level FROM products WHERE stock <= reorder_level ORDER BY stock ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 2. Innathe sales total
router.get('/sales-today', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT COALESCE(SUM(total), 0) AS total FROM sales WHERE DATE(created_at) = CURDATE()'
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// 3. Last 7 days, day-wise sales
router.get('/sales-last-7-days', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DATE(created_at) AS day, SUM(total) AS total
       FROM sales
       WHERE created_at >= CURDATE() - INTERVAL 6 DAY
       GROUP BY DATE(created_at)
       ORDER BY day`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;