-- Migration: Add category_id column to prompts
-- Created: 2025-12-10
-- Note: This is a separate migration because ALTER TABLE needs special handling

-- Add category_id column to prompts (nullable for optional categories)
ALTER TABLE prompts ADD COLUMN category_id TEXT REFERENCES categories(id) ON DELETE SET NULL;

-- Migrate existing data from type to category_id
UPDATE prompts SET category_id = 'cat_frontend' WHERE type = 'ui' AND category_id IS NULL;
UPDATE prompts SET category_id = 'cat_backend' WHERE type = 'backend' AND category_id IS NULL;
