-- Simple script to add age_group column
-- Run this in your Supabase SQL Editor

-- Add age_group column
ALTER TABLE vibe_registrations 
ADD COLUMN IF NOT EXISTS age_group TEXT DEFAULT '10-13';

-- Update existing records
UPDATE vibe_registrations 
SET age_group = '10-13' 
WHERE age_group IS NULL;

-- Make it NOT NULL
ALTER TABLE vibe_registrations 
ALTER COLUMN age_group SET NOT NULL;
