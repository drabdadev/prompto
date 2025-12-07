const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../config/logger');

const router = express.Router();

// GET /api/prompts - List all prompts with optional type and archived filter
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { type, archived } = req.query;

    let sql = 'SELECT * FROM prompts WHERE 1=1';
    const params = [];

    if (type && ['ui', 'backend'].includes(type)) {
      sql += ' AND type = ?';
      params.push(type);
    }

    // Filter by archived status (default to non-archived)
    const isArchived = archived === 'true' || archived === '1' ? 1 : 0;
    sql += ' AND archived = ?';
    params.push(isArchived);

    sql += ' ORDER BY project_id, position ASC';

    const prompts = db.prepare(sql).all(...params);
    res.json(prompts);
  } catch (err) {
    logger.error('Error fetching prompts:', err);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// GET /api/prompts/project/:projectId - Get prompts for a project
router.get('/project/:projectId', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { projectId } = req.params;

    const prompts = db.prepare(`
      SELECT * FROM prompts WHERE project_id = ? ORDER BY position ASC
    `).all(projectId);

    res.json(prompts);
  } catch (err) {
    logger.error('Error fetching project prompts:', err);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// PUT /api/prompts/reorder - Reorder prompts within a project
// NOTE: This must be BEFORE /:id routes to avoid "reorder" being treated as an ID
router.put('/reorder', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { projectId, promptIds } = req.body;

    if (!projectId || !Array.isArray(promptIds)) {
      return res.status(400).json({ error: 'projectId and promptIds array are required' });
    }

    const updateStmt = db.prepare('UPDATE prompts SET position = ? WHERE id = ?');

    db.transaction(() => {
      promptIds.forEach((id, index) => {
        updateStmt.run(index, id);
      });
    })();

    const prompts = db.prepare(
      'SELECT * FROM prompts WHERE project_id = ? ORDER BY position ASC'
    ).all(projectId);

    res.json(prompts);
  } catch (err) {
    logger.error('Error reordering prompts:', err);
    res.status(500).json({ error: 'Failed to reorder prompts' });
  }
});

// POST /api/prompts - Create new prompt
router.post('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { project_id, content, type } = req.body;

    if (!project_id) {
      return res.status(400).json({ error: 'project_id is required' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content is required' });
    }
    if (!type || !['ui', 'backend'].includes(type)) {
      return res.status(400).json({ error: 'type must be "ui" or "backend"' });
    }

    // Verify project exists
    const project = db.prepare('SELECT id FROM projects WHERE id = ?').get(project_id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Shift all existing prompts in this project down by 1 position
    db.prepare(
      'UPDATE prompts SET position = position + 1 WHERE project_id = ? AND archived = 0'
    ).run(project_id);

    // Insert new prompt at position 0 (top)
    const id = uuidv4();
    const prompt = {
      id,
      project_id,
      content: content.trim(),
      type,
      position: 0
    };

    db.prepare(`
      INSERT INTO prompts (id, project_id, content, type, position)
      VALUES (@id, @project_id, @content, @type, @position)
    `).run(prompt);

    const created = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    res.status(201).json(created);
  } catch (err) {
    logger.error('Error creating prompt:', err);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
});

// PUT /api/prompts/:id - Update prompt
router.put('/:id', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { content, type } = req.body;

    const existing = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    if (type && !['ui', 'backend'].includes(type)) {
      return res.status(400).json({ error: 'type must be "ui" or "backend"' });
    }

    const updates = {
      content: content?.trim() || existing.content,
      type: type || existing.type,
      id
    };

    db.prepare(`
      UPDATE prompts SET content = @content, type = @type WHERE id = @id
    `).run(updates);

    const updated = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    logger.error('Error updating prompt:', err);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// PUT /api/prompts/:id/move - Move prompt to different project
router.put('/:id/move', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { targetProjectId, position } = req.body;

    const existing = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    // Verify target project exists
    const targetProject = db.prepare('SELECT id FROM projects WHERE id = ?').get(targetProjectId);
    if (!targetProject) {
      return res.status(404).json({ error: 'Target project not found' });
    }

    // Get max position in target project if position not specified
    let newPosition = position;
    if (newPosition === undefined) {
      const maxPos = db.prepare(
        'SELECT MAX(position) as maxPos FROM prompts WHERE project_id = ?'
      ).get(targetProjectId);
      newPosition = (maxPos.maxPos ?? -1) + 1;
    }

    db.prepare(`
      UPDATE prompts SET project_id = ?, position = ? WHERE id = ?
    `).run(targetProjectId, newPosition, id);

    const updated = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    logger.error('Error moving prompt:', err);
    res.status(500).json({ error: 'Failed to move prompt' });
  }
});

// PUT /api/prompts/:id/archive - Toggle archive status
router.put('/:id/archive', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { archived } = req.body;

    const existing = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const newArchived = archived !== undefined ? (archived ? 1 : 0) : (existing.archived ? 0 : 1);

    db.prepare('UPDATE prompts SET archived = ? WHERE id = ?').run(newArchived, id);

    const updated = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    logger.error('Error archiving prompt:', err);
    res.status(500).json({ error: 'Failed to archive prompt' });
  }
});

// DELETE /api/prompts/:id - Delete prompt
router.delete('/:id', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    const existing = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    db.prepare('DELETE FROM prompts WHERE id = ?').run(id);

    res.json({ message: 'Prompt deleted successfully' });
  } catch (err) {
    logger.error('Error deleting prompt:', err);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

module.exports = router;
