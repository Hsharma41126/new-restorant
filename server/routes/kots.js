const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const printerService = require('../services/printerService');

const router = express.Router();

// Get all KOTs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, category_type, date, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        k.*,
        o.order_number,
        o.table_id,
        o.customer_name,
        o.order_type,
        rt.table_number,
        rt.table_name
      FROM kots k
      JOIN orders o ON k.order_id = o.id
      LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      query += ' AND k.status = ?';
      params.push(status);
    }
    
    if (category_type) {
      query += ' AND k.category_type = ?';
      params.push(category_type);
    }
    
    if (date) {
      query += ' AND DATE(k.created_at) = ?';
      params.push(date);
    }
    
    query += ' ORDER BY k.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [kots] = await pool.execute(query, params);
    
    // Get KOT items for each KOT
    for (let kot of kots) {
      const [items] = await pool.execute(`
        SELECT 
          ki.*,
          mi.preparation_time
        FROM kot_items ki
        JOIN order_items oi ON ki.order_item_id = oi.id
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE ki.kot_id = ?
        ORDER BY ki.id
      `, [kot.id]);
      
      kot.items = items;
      
      // Calculate time elapsed
      const now = new Date();
      const created = new Date(kot.created_at);
      const elapsedMinutes = Math.floor((now - created) / (1000 * 60));
      kot.time_elapsed = elapsedMinutes;
    }
    
    res.json({ success: true, kots });
  } catch (error) {
    console.error('Get KOTs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single KOT
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [kots] = await pool.execute(`
      SELECT 
        k.*,
        o.order_number,
        o.table_id,
        o.customer_name,
        o.order_type,
        o.special_instructions as order_instructions,
        rt.table_number,
        rt.table_name,
        rt.location
      FROM kots k
      JOIN orders o ON k.order_id = o.id
      LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
      WHERE k.id = ?
    `, [req.params.id]);

    if (kots.length === 0) {
      return res.status(404).json({ error: 'KOT not found' });
    }

    const kot = kots[0];

    // Get KOT items
    const [items] = await pool.execute(`
      SELECT 
        ki.*,
        mi.preparation_time
      FROM kot_items ki
      JOIN order_items oi ON ki.order_item_id = oi.id
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE ki.kot_id = ?
      ORDER BY ki.id
    `, [kot.id]);

    kot.items = items;

    // Calculate time elapsed
    const now = new Date();
    const created = new Date(kot.created_at);
    const elapsedMinutes = Math.floor((now - created) / (1000 * 60));
    kot.time_elapsed = elapsedMinutes;

    res.json({ success: true, kot });
  } catch (error) {
    console.error('Get KOT error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update KOT status
router.put('/:id/status', authenticateToken, authorizeRoles('Admin', 'Staff', 'Manager'), [
  body('status').isIn(['Pending', 'Printed', 'Preparing', 'Ready', 'Served'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const kotId = req.params.id;

    const updateData = { status };
    if (status === 'Ready') {
      updateData.completed_at = new Date();
    }

    const setClause = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);
    values.push(kotId);

    await pool.execute(
      `UPDATE kots SET ${setClause} WHERE id = ?`,
      values
    );

    // If marking as ready, update all KOT items
    if (status === 'Ready') {
      await pool.execute(
        'UPDATE kot_items SET status = "Ready" WHERE kot_id = ?',
        [kotId]
      );
    }

    res.json({ success: true, message: 'KOT status updated successfully' });
  } catch (error) {
    console.error('Update KOT status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update KOT item status
router.put('/:kotId/items/:itemId/status', authenticateToken, authorizeRoles('Admin', 'Staff', 'Manager'), [
  body('status').isIn(['Pending', 'Preparing', 'Ready', 'Served'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const { kotId, itemId } = req.params;

    await pool.execute(
      'UPDATE kot_items SET status = ? WHERE id = ? AND kot_id = ?',
      [status, itemId, kotId]
    );

    // Check if all items are ready, then update KOT status
    if (status === 'Ready') {
      const [pendingItems] = await pool.execute(
        'SELECT COUNT(*) as count FROM kot_items WHERE kot_id = ? AND status != "Ready"',
        [kotId]
      );

      if (pendingItems[0].count === 0) {
        await pool.execute(
          'UPDATE kots SET status = "Ready", completed_at = NOW() WHERE id = ?',
          [kotId]
        );
      }
    }

    res.json({ success: true, message: 'KOT item status updated successfully' });
  } catch (error) {
    console.error('Update KOT item status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Print KOT
router.post('/:id/print', authenticateToken, authorizeRoles('Admin', 'Staff', 'Manager'), async (req, res) => {
  try {
    const kotId = req.params.id;
    const result = await printerService.printKOT(kotId);
    res.json(result);
  } catch (error) {
    console.error('Print KOT error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get KOT statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { date = new Date().toISOString().split('T')[0] } = req.query;

    // Get KOT counts by status
    const [statusCounts] = await pool.execute(`
      SELECT 
        status,
        COUNT(*) as count
      FROM kots 
      WHERE DATE(created_at) = ?
      GROUP BY status
    `, [date]);

    // Get average preparation time
    const [avgTime] = await pool.execute(`
      SELECT 
        AVG(TIMESTAMPDIFF(MINUTE, created_at, completed_at)) as avg_prep_time
      FROM kots 
      WHERE DATE(created_at) = ? AND completed_at IS NOT NULL
    `, [date]);

    // Get category breakdown
    const [categoryBreakdown] = await pool.execute(`
      SELECT 
        category_type,
        COUNT(*) as count
      FROM kots 
      WHERE DATE(created_at) = ?
      GROUP BY category_type
    `, [date]);

    const stats = {
      date,
      status_counts: statusCounts,
      avg_preparation_time: avgTime[0].avg_prep_time || 0,
      category_breakdown: categoryBreakdown
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Get KOT stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;