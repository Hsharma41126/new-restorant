const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const printerService = require('../services/printerService');

const router = express.Router();

// Get all printers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [printers] = await pool.execute(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT c.name) as mapped_categories
      FROM printers p
      LEFT JOIN printer_category_mappings pcm ON p.id = pcm.printer_id
      LEFT JOIN categories c ON pcm.category_id = c.id
      GROUP BY p.id
      ORDER BY p.name
    `);

    res.json({ success: true, printers });
  } catch (error) {
    console.error('Get printers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single printer
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [printers] = await pool.execute(
      'SELECT * FROM printers WHERE id = ?',
      [req.params.id]
    );

    if (printers.length === 0) {
      return res.status(404).json({ error: 'Printer not found' });
    }

    const printer = printers[0];

    // Get mapped categories
    const [mappings] = await pool.execute(`
      SELECT 
        pcm.*,
        c.name as category_name,
        sc.name as subcategory_name
      FROM printer_category_mappings pcm
      JOIN categories c ON pcm.category_id = c.id
      LEFT JOIN subcategories sc ON pcm.subcategory_id = sc.id
      WHERE pcm.printer_id = ?
    `, [printer.id]);

    printer.category_mappings = mappings;

    res.json({ success: true, printer });
  } catch (error) {
    console.error('Get printer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new printer
router.post('/', authenticateToken, authorizeRoles('Admin', 'Manager'), [
  body('name').isLength({ min: 1 }).trim(),
  body('type').isIn(['Kitchen', 'Bar', 'Receipt', 'General']),
  body('ip_address').isIP(),
  body('port').isInt({ min: 1, max: 65535 }),
  body('paper_size').isIn(['58mm', '80mm'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      type,
      ip_address,
      port = 9100,
      paper_size = '80mm',
      category_mappings = []
    } = req.body;

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Insert printer
      const [result] = await connection.execute(`
        INSERT INTO printers (name, type, ip_address, port, paper_size)
        VALUES (?, ?, ?, ?, ?)
      `, [name, type, ip_address, port, paper_size]);

      const printerId = result.insertId;

      // Add category mappings
      for (const mapping of category_mappings) {
        await connection.execute(`
          INSERT INTO printer_category_mappings (printer_id, category_id, subcategory_id)
          VALUES (?, ?, ?)
        `, [printerId, mapping.category_id, mapping.subcategory_id || null]);
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: 'Printer added successfully',
        printer_id: printerId
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Add printer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update printer
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'Manager'), [
  body('name').optional().isLength({ min: 1 }).trim(),
  body('type').optional().isIn(['Kitchen', 'Bar', 'Receipt', 'General']),
  body('ip_address').optional().isIP(),
  body('port').optional().isInt({ min: 1, max: 65535 }),
  body('paper_size').optional().isIn(['58mm', '80mm']),
  body('is_active').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const printerId = req.params.id;
    const {
      name,
      type,
      ip_address,
      port,
      paper_size,
      is_active,
      category_mappings
    } = req.body;

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Update printer details
      const updates = {};
      const values = [];

      if (name !== undefined) {
        updates.name = name;
        values.push(name);
      }
      if (type !== undefined) {
        updates.type = type;
        values.push(type);
      }
      if (ip_address !== undefined) {
        updates.ip_address = ip_address;
        values.push(ip_address);
      }
      if (port !== undefined) {
        updates.port = port;
        values.push(port);
      }
      if (paper_size !== undefined) {
        updates.paper_size = paper_size;
        values.push(paper_size);
      }
      if (is_active !== undefined) {
        updates.is_active = is_active;
        values.push(is_active);
      }

      if (values.length > 0) {
        values.push(printerId);
        const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        await connection.execute(
          `UPDATE printers SET ${setClause} WHERE id = ?`,
          values
        );
      }

      // Update category mappings if provided
      if (category_mappings !== undefined) {
        // Delete existing mappings
        await connection.execute(
          'DELETE FROM printer_category_mappings WHERE printer_id = ?',
          [printerId]
        );

        // Add new mappings
        for (const mapping of category_mappings) {
          await connection.execute(`
            INSERT INTO printer_category_mappings (printer_id, category_id, subcategory_id)
            VALUES (?, ?, ?)
          `, [printerId, mapping.category_id, mapping.subcategory_id || null]);
        }
      }

      await connection.commit();

      res.json({ success: true, message: 'Printer updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update printer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete printer
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const printerId = req.params.id;

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Delete category mappings first
      await connection.execute(
        'DELETE FROM printer_category_mappings WHERE printer_id = ?',
        [printerId]
      );

      // Delete printer
      const [result] = await connection.execute(
        'DELETE FROM printers WHERE id = ?',
        [printerId]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Printer not found' });
      }

      await connection.commit();

      res.json({ success: true, message: 'Printer deleted successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete printer error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test printer
router.post('/:id/test', authenticateToken, authorizeRoles('Admin', 'Manager', 'Staff'), async (req, res) => {
  try {
    const printerId = req.params.id;
    const result = await printerService.testPrinter(printerId);
    res.json(result);
  } catch (error) {
    console.error('Test printer error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check printer status
router.get('/:id/status', authenticateToken, async (req, res) => {
  try {
    const printerId = req.params.id;
    
    const [printers] = await pool.execute(
      'SELECT id, name, ip_address, port, is_online, last_test_print FROM printers WHERE id = ?',
      [printerId]
    );

    if (printers.length === 0) {
      return res.status(404).json({ error: 'Printer not found' });
    }

    const printer = printers[0];

    // Try to ping the printer (basic connectivity check)
    try {
      const printerInstance = await printerService.initializePrinter(printerId);
      const isConnected = await printerInstance.isPrinterConnected();
      
      // Update status in database
      await pool.execute(
        'UPDATE printers SET is_online = ? WHERE id = ?',
        [isConnected, printerId]
      );

      printer.is_online = isConnected;
      printer.status = isConnected ? 'Online' : 'Offline';
    } catch (error) {
      await pool.execute(
        'UPDATE printers SET is_online = FALSE WHERE id = ?',
        [printerId]
      );
      printer.is_online = false;
      printer.status = 'Offline';
      printer.error = error.message;
    }

    res.json({ success: true, printer });
  } catch (error) {
    console.error('Check printer status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;