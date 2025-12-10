const express = require('express');
const { logger } = require('../config/logger');

const router = express.Router();

// GET /api/settings/:key - Get setting value
router.get('/:key', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { key } = req.params;

    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ key, value: setting.value });
  } catch (err) {
    logger.error('Error fetching setting:', err);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// PUT /api/settings/:key - Update or create setting
router.put('/:key', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ error: 'value is required' });
    }

    // Upsert setting
    db.prepare(`
      INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = CURRENT_TIMESTAMP
    `).run(key, String(value), String(value));

    res.json({ key, value: String(value) });
  } catch (err) {
    logger.error('Error updating setting:', err);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

module.exports = router;
