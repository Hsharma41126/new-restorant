const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Get all categories with subcategories and items
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute(`
      SELECT * FROM categories WHERE is_active = TRUE ORDER BY name
    `);

    for (let category of categories) {
      // Get subcategories
      const [subcategories] = await pool.execute(`
        SELECT * FROM subcategories WHERE category_id = ? AND is_active = TRUE ORDER BY name
      `, [category.id]);

      for (let subcategory of subcategories) {
        // Get menu items
        const [items] = await pool.execute(`
          SELECT * FROM menu_items WHERE subcategory_id = ? AND is_available = TRUE ORDER BY name
        `, [subcategory.id]);

        subcategory.items = items;
      }

      category.subcategories = subcategories;
    }

    res.json({ success: true, categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single category
router.get('/categories/:id', async (req, res) => {
  try {
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [req.params.id]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const category = categories[0];

    // Get subcategories with items
    const [subcategories] = await pool.execute(`
      SELECT * FROM subcategories WHERE category_id = ? ORDER BY name
    `, [category.id]);

    for (let subcategory of subcategories) {
      const [items] = await pool.execute(`
        SELECT * FROM menu_items WHERE subcategory_id = ? ORDER BY name
      `, [subcategory.id]);

      subcategory.items = items;
    }

    category.subcategories = subcategories;

    res.json({ success: true, category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new category
router.post('/categories', authenticateToken, authorizeRoles('Admin', 'Manager'), [
  body('name').isLength({ min: 1 }).trim(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, image_url } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
      [name, description, image_url]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category_id: result.insertId
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new subcategory
router.post('/subcategories', authenticateToken, authorizeRoles('Admin', 'Manager'), [
  body('category_id').isInt(),
  body('name').isLength({ min: 1 }).trim(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category_id, name, description } = req.body;

    // Check if category exists
    const [categories] = await pool.execute(
      'SELECT id FROM categories WHERE id = ?',
      [category_id]
    );

    if (categories.length === 0) {
      return res.status(400).json({ error: 'Category not found' });
    }

    const [result] = await pool.execute(
      'INSERT INTO subcategories (category_id, name, description) VALUES (?, ?, ?)',
      [category_id, name, description]
    );

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      subcategory_id: result.insertId
    });
  } catch (error) {
    console.error('Create subcategory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new menu item
router.post('/items', authenticateToken, authorizeRoles('Admin', 'Manager'), [
  body('subcategory_id').isInt(),
  body('name').isLength({ min: 1 }).trim(),
  body('price').isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('preparation_time').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      subcategory_id,
      name,
      description,
      price,
      image_url,
      preparation_time = 15
    } = req.body;

    // Check if subcategory exists
    const [subcategories] = await pool.execute(
      'SELECT id FROM subcategories WHERE id = ?',
      [subcategory_id]
    );

    if (subcategories.length === 0) {
      return res.status(400).json({ error: 'Subcategory not found' });
    }

    const [result] = await pool.execute(`
      INSERT INTO menu_items (subcategory_id, name, description, price, image_url, preparation_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [subcategory_id, name, description, price, image_url, preparation_time]);

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      item_id: result.insertId
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update menu item
router.put('/items/:id', authenticateToken, authorizeRoles('Admin', 'Manager'), [
  body('name').optional().isLength({ min: 1 }).trim(),
  body('price').optional().isFloat({ min: 0 }),
  body('description').optional().trim(),
  body('preparation_time').optional().isInt({ min: 1 }),
  body('is_available').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const itemId = req.params.id;
    const {
      name,
      description,
      price,
      image_url,
      preparation_time,
      is_available
    } = req.body;

    const updates = {};
    const values = [];

    if (name !== undefined) {
      updates.name = name;
      values.push(name);
    }
    if (description !== undefined) {
      updates.description = description;
      values.push(description);
    }
    if (price !== undefined) {
      updates.price = price;
      values.push(price);
    }
    if (image_url !== undefined) {
      updates.image_url = image_url;
      values.push(image_url);
    }
    if (preparation_time !== undefined) {
      updates.preparation_time = preparation_time;
      values.push(preparation_time);
    }
    if (is_available !== undefined) {
      updates.is_available = is_available;
      values.push(is_available);
    }

    if (values.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(itemId);

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const [result] = await pool.execute(
      `UPDATE menu_items SET ${setClause} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete menu item
router.delete('/items/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM menu_items WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all menu items (for ordering)
router.get('/items', async (req, res) => {
  try {
    const { category_id, subcategory_id, available_only = 'true' } = req.query;
    
    let query = `
      SELECT 
        mi.*,
        sc.name as subcategory_name,
        c.name as category_name
      FROM menu_items mi
      JOIN subcategories sc ON mi.subcategory_id = sc.id
      JOIN categories c ON sc.category_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (available_only === 'true') {
      query += ' AND mi.is_available = TRUE AND sc.is_active = TRUE AND c.is_active = TRUE';
    }
    
    if (category_id) {
      query += ' AND c.id = ?';
      params.push(category_id);
    }
    
    if (subcategory_id) {
      query += ' AND sc.id = ?';
      params.push(subcategory_id);
    }
    
    query += ' ORDER BY c.name, sc.name, mi.name';
    
    const [items] = await pool.execute(query, params);
    
    res.json({ success: true, items });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;