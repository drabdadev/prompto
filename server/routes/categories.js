const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../config/logger');

const router = express.Router();

// GET /api/categories - List all categories ordered by position
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const categories = db.prepare(`
      SELECT * FROM categories ORDER BY position ASC
    `).all();

    res.json(categories);
  } catch (err) {
    logger.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories - Create new category
router.post('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, color, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Get max position for new category
    const maxPos = db.prepare('SELECT MAX(position) as max FROM categories').get();
    const position = (maxPos?.max ?? -1) + 1;

    const id = uuidv4();
    const category = {
      id,
      name: name.trim(),
      color: color || '#6B7280',
      icon: icon || 'Tag',
      position
    };

    db.prepare(`
      INSERT INTO categories (id, name, color, icon, position)
      VALUES (@id, @name, @color, @icon, @position)
    `).run(category);

    const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    logger.error('Error creating category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/reorder - Reorder categories
router.put('/reorder', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds)) {
      return res.status(400).json({ error: 'categoryIds array is required' });
    }

    const updateStmt = db.prepare('UPDATE categories SET position = ? WHERE id = ?');

    db.transaction(() => {
      categoryIds.forEach((id, index) => {
        updateStmt.run(index, id);
      });
    })();

    const categories = db.prepare('SELECT * FROM categories ORDER BY position ASC').all();
    res.json(categories);
  } catch (err) {
    logger.error('Error reordering categories:', err);
    res.status(500).json({ error: 'Failed to reorder categories' });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { name, color, icon } = req.body;

    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updates = {
      name: name?.trim() || existing.name,
      color: color || existing.color,
      icon: icon || existing.icon,
      id
    };

    db.prepare(`
      UPDATE categories SET name = @name, color = @color, icon = @icon WHERE id = @id
    `).run(updates);

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    logger.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id - Delete category (prompts keep null category_id)
router.delete('/:id', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // ON DELETE SET NULL will set prompts.category_id to null automatically
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    logger.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
