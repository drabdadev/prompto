-- Migration: Add categories system
-- Created: 2025-12-10

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  icon TEXT DEFAULT 'Tag',
  position INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_category_position ON categories(position);

-- Settings table for app preferences
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default setting for category visibility (hidden by default)
INSERT OR IGNORE INTO settings (key, value) VALUES ('categories_visible', 'false');

-- Insert default categories
INSERT OR IGNORE INTO categories (id, name, color, icon, position) VALUES
  ('cat_frontend', 'Frontend', '#10B981', 'Layout', 0);
INSERT OR IGNORE INTO categories (id, name, color, icon, position) VALUES
  ('cat_backend', 'Backend', '#3B82F6', 'Server', 1);
