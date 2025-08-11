const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const printerService = require('../services/printerService');

const router = express.Router();

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, table_id, date, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        o.*,
        rt.table_number,
        rt.table_name,
        u.full_name as customer_full_name,
        creator.full_name as created_by_name
      FROM orders o
      LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN users creator ON o.created_by = creator.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }
    
    if (table_id) {
      query += ' AND o.table_id = ?';
      params.push(table_id);
    }
    
    if (date) {
      query += ' AND DATE(o.created_at) = ?';
      params.push(date);
    }
    
    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const [orders] = await pool.execute(query, params);
    
    // Get order items for each order
    for (let order of orders) {
      const [items] = await pool.execute(`
        SELECT 
          oi.*,
          mi.name as item_name,
          mi.description
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
      `, [order.id]);
      
      order.items = items;
    }
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT 
        o.*,
        rt.table_number,
        rt.table_name,
        rt.location,
        u.full_name as customer_full_name,
        creator.full_name as created_by_name
      FROM orders o
      LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN users creator ON o.created_by = creator.id
      WHERE o.id = ?
    `, [req.params.id]);

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await pool.execute(`
      SELECT 
        oi.*,
        mi.name as item_name,
        mi.description,
        mi.preparation_time
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
      ORDER BY oi.id
    `, [order.id]);

    order.items = items;

    // Get KOTs for this order
    const [kots] = await pool.execute(`
      SELECT * FROM kots WHERE order_id = ? ORDER BY created_at
    `, [order.id]);

    order.kots = kots;

    res.json({ success: true, order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
router.post('/', authenticateToken, [
  body('table_id').optional().isInt(),
  body('customer_name').optional().trim(),
  body('order_type').isIn(['Dine-in', 'Takeaway', 'Delivery']),
  body('items').isArray({ min: 1 }),
  body('items.*.menu_item_id').isInt(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('items.*.special_instructions').optional().trim()
], async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await connection.rollback();
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      table_id,
      session_id,
      customer_name,
      order_type = 'Dine-in',
      items,
      special_instructions
    } = req.body;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const [menuItems] = await connection.execute(
        'SELECT * FROM menu_items WHERE id = ? AND is_available = TRUE',
        [item.menu_item_id]
      );

      if (menuItems.length === 0) {
        await connection.rollback();
        return res.status(400).json({ error: `Menu item ${item.menu_item_id} not found or unavailable` });
      }

      const menuItem = menuItems[0];
      const totalPrice = menuItem.price * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: menuItem.price,
        total_price: totalPrice,
        special_instructions: item.special_instructions || null
      });
    }

    // Get tax rate from settings
    const [taxSettings] = await connection.execute(
      'SELECT setting_value FROM system_settings WHERE setting_key = "tax_rate"'
    );
    const taxRate = taxSettings.length > 0 ? parseFloat(taxSettings[0].setting_value) : 8.5;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    // Create order
    const [orderResult] = await connection.execute(`
      INSERT INTO orders (
        order_number, table_id, session_id, user_id, customer_name, order_type,
        subtotal, tax_amount, total_amount, special_instructions, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderNumber, table_id, session_id, req.user.id, customer_name, order_type,
      subtotal, taxAmount, totalAmount, special_instructions, req.user.id
    ]);

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of orderItems) {
      await connection.execute(`
        INSERT INTO order_items (
          order_id, menu_item_id, quantity, unit_price, total_price, special_instructions
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        orderId, item.menu_item_id, item.quantity, 
        item.unit_price, item.total_price, item.special_instructions
      ]);
    }

    // Create KOT
    const kotNumber = `KOT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Determine category type based on items
    let categoryType = 'Mixed';
    const foodCategories = ['Food'];
    const drinkCategories = ['Drinks', 'Beverages'];
    
    const [itemCategories] = await connection.execute(`
      SELECT DISTINCT c.name
      FROM menu_items mi
      JOIN subcategories sc ON mi.subcategory_id = sc.id
      JOIN categories c ON sc.category_id = c.id
      WHERE mi.id IN (${items.map(() => '?').join(',')})
    `, items.map(item => item.menu_item_id));
    
    const categories = itemCategories.map(cat => cat.name);
    if (categories.every(cat => foodCategories.includes(cat))) {
      categoryType = 'Food';
    } else if (categories.every(cat => drinkCategories.includes(cat))) {
      categoryType = 'Beverages';
    }

    const [kotResult] = await connection.execute(`
      INSERT INTO kots (kot_number, order_id, category_type, status)
      VALUES (?, ?, ?, 'Pending')
    `, [kotNumber, orderId, categoryType]);

    const kotId = kotResult.insertId;

    // Create KOT items
    const [createdOrderItems] = await connection.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    for (const orderItem of createdOrderItems) {
      const [menuItem] = await connection.execute(
        'SELECT name FROM menu_items WHERE id = ?',
        [orderItem.menu_item_id]
      );

      await connection.execute(`
        INSERT INTO kot_items (
          kot_id, order_item_id, menu_item_name, quantity, special_instructions
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        kotId, orderItem.id, menuItem[0].name, 
        orderItem.quantity, orderItem.special_instructions
      ]);
    }

    await connection.commit();

    // Auto-print KOT if enabled
    const [kotSettings] = await pool.execute(
      'SELECT setting_value FROM system_settings WHERE setting_key = "kot_auto_print"'
    );
    
    if (kotSettings.length > 0 && kotSettings[0].setting_value === 'true') {
      try {
        await printerService.printKOT(kotId);
      } catch (printError) {
        console.error('Auto KOT print failed:', printError);
        // Don't fail the order creation if printing fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: orderId,
        order_number: orderNumber,
        kot_number: kotNumber,
        total_amount: totalAmount
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    connection.release();
  }
});

// Update order status
router.put('/:id/status', authenticateToken, authorizeRoles('Admin', 'Staff', 'Manager'), [
  body('status').isIn(['Pending', 'Confirmed', 'Preparing', 'Ready', 'Served', 'Completed', 'Cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const orderId = req.params.id;

    await pool.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Print KOT
router.post('/:id/print-kot', authenticateToken, authorizeRoles('Admin', 'Staff', 'Manager'), async (req, res) => {
  try {
    const orderId = req.params.id;

    // Get KOT for this order
    const [kots] = await pool.execute(
      'SELECT id FROM kots WHERE order_id = ? ORDER BY created_at DESC LIMIT 1',
      [orderId]
    );

    if (kots.length === 0) {
      return res.status(404).json({ error: 'KOT not found for this order' });
    }

    const result = await printerService.printKOT(kots[0].id);
    res.json(result);
  } catch (error) {
    console.error('Print KOT error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Print receipt
router.post('/:id/print-receipt', authenticateToken, authorizeRoles('Admin', 'Staff', 'Manager'), async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await printerService.printReceipt(orderId);
    res.json(result);
  } catch (error) {
    console.error('Print receipt error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;