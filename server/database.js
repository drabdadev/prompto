const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { logger } = require('./config/logger');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'webprompter.db');

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const db = new Database(DB_PATH);

      // Enable foreign keys
      db.pragma('foreign_keys = ON');
      db.pragma('journal_mode = WAL');

      // Run migrations
      runMigrations(db);

      logger.info(`Database initialized at ${DB_PATH}`);
      resolve(db);
    } catch (err) {
      logger.error('Database initialization failed:', err);
      reject(err);
    }
  });
}

function runMigrations(db) {
  const migrationsDir = path.join(__dirname, 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  // Create migrations tracking table
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const appliedMigrations = db.prepare('SELECT name FROM migrations').all().map(r => r.name);

  for (const file of migrationFiles) {
    if (!appliedMigrations.includes(file)) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      db.transaction(() => {
        db.exec(sql);
        db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
      })();

      logger.info(`Applied migration: ${file}`);
    }
  }
}

module.exports = { initializeDatabase };
