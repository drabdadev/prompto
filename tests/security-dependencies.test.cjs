const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const express = require('express');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'prompto-security-'));
fs.chmodSync(directory, 0o700);
process.env.DATABASE_PATH = path.join(directory, 'fixture.sqlite');
process.env.NODE_ENV = 'test';
delete process.env.BETTER_SQLITE3_PATH;
delete process.env.SERVER_DIR;
const { initializeDatabase } = require('../server/database');

test('native SQLite applies migrations, preserves rollback and serves real prompt routes', async t => {
  const db = await initializeDatabase();
  let server;
  try {
    assert.equal(db.pragma('integrity_check', { simple: true }), 'ok');
    assert.equal(db.prepare('SELECT count(*) AS total FROM migrations').get().total, 4);
    assert.throws(() => db.transaction(() => {
      db.prepare('INSERT INTO projects (id, name) VALUES (?, ?)').run('rolled-back', 'Transient');
      throw new Error('fixture rollback');
    })());
    assert.equal(db.prepare('SELECT count(*) AS total FROM projects WHERE id = ?').get('rolled-back').total, 0);

    const app = express();
    app.locals.db = db;
    app.use(express.json());
    app.use('/api/projects', require('../server/routes/projects'));
    app.use('/api/prompts', require('../server/routes/prompts'));
    server = await new Promise(resolve => {
      const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
    });
    const base = `http://127.0.0.1:${server.address().port}`;
    const projectResponse = await fetch(base + '/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Synthetic project' }) });
    assert.equal(projectResponse.status, 201);
    const project = await projectResponse.json();
    const created = await fetch(base + '/api/prompts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project_id: project.id, content: "Synthetic 'prompt'", type: 'ui' }) });
    assert.equal(created.status, 201);
    const listed = await fetch(base + '/api/prompts');
    assert.equal(listed.status, 200);
    const prompts = await listed.json();
    assert.equal(prompts.length, 1);
    assert.equal(prompts[0].content, "Synthetic 'prompt'");
  } finally {
    if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    db.close();
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
