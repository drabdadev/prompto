const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../config/logger');

const router = express.Router();

// GET /api/projects - List all projects ordered by position
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const projects = db.prepare(`
      SELECT * FROM projects ORDER BY position ASC
    `).all();

    res.json(projects);
  } catch (err) {
    logger.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects - Create new project
router.post('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Get max position
    const maxPos = db.prepare('SELECT MAX(position) as maxPos FROM projects').get();
    const position = (maxPos.maxPos ?? -1) + 1;

    const id = uuidv4();
    const project = {
      id,
      name: name.trim(),
      color: color || '#3B82F6',
      position
    };

    db.prepare(`
      INSERT INTO projects (id, name, color, position)
      VALUES (@id, @name, @color, @position)
    `).run(project);

    const created = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    logger.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/reorder - Reorder projects
router.put('/reorder', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { projectIds } = req.body;

    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ error: 'projectIds array is required' });
    }

    const updateStmt = db.prepare('UPDATE projects SET position = ? WHERE id = ?');

    db.transaction(() => {
      projectIds.forEach((id, index) => {
        updateStmt.run(index, id);
      });
    })();

    const projects = db.prepare('SELECT * FROM projects ORDER BY position ASC').all();
    res.json(projects);
  } catch (err) {
    logger.error('Error reordering projects:', err);
    res.status(500).json({ error: 'Failed to reorder projects' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { name, color } = req.body;

    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updates = {
      name: name?.trim() || existing.name,
      color: color || existing.color,
      id
    };

    db.prepare(`
      UPDATE projects SET name = @name, color = @color WHERE id = @id
    `).run(updates);

    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    logger.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id - Delete project and its prompts
router.delete('/:id', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Cascade delete will handle prompts
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    logger.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
