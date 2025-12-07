-- Projects Table (Kanban columns)
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  position INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_position ON projects(position);

-- Prompts Table (Kanban cards)
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('ui', 'backend')),
  position INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prompt_project ON prompts(project_id);
CREATE INDEX IF NOT EXISTS idx_prompt_position ON prompts(project_id, position);
CREATE INDEX IF NOT EXISTS idx_prompt_type ON prompts(type);

-- Trigger to update updated_at on projects
CREATE TRIGGER IF NOT EXISTS update_project_timestamp
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
  UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Trigger to update updated_at on prompts
CREATE TRIGGER IF NOT EXISTS update_prompt_timestamp
AFTER UPDATE ON prompts
FOR EACH ROW
BEGIN
  UPDATE prompts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
