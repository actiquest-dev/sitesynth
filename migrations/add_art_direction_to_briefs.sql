-- Add art_direction_json column to briefs table
-- This stores the comprehensive art direction contract generated from design spec + references

ALTER TABLE briefs
ADD COLUMN IF NOT EXISTS art_direction_json jsonb DEFAULT NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_briefs_art_direction_json ON briefs USING GIN (art_direction_json);

-- Optional: Add comment describing the column
COMMENT ON COLUMN briefs.art_direction_json IS 'Comprehensive art direction contract with exact colors, typography, spacing, component recipes, and anti-patterns. Generated from design_spec_json + reference_analysis_json.';
