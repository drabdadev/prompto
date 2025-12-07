-- Add archived field to prompts
ALTER TABLE prompts ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_prompts_archived ON prompts(archived);
