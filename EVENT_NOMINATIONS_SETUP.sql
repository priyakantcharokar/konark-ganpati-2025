-- Event Nominations Table Setup
-- Run this SQL in your Supabase SQL Editor

-- Create event_nominations table
CREATE TABLE IF NOT EXISTS event_nominations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_title VARCHAR(255) NOT NULL,
  event_date VARCHAR(100) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  building VARCHAR(10) NOT NULL,
  flat VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_nominations_event_title ON event_nominations(event_title);
CREATE INDEX IF NOT EXISTS idx_event_nominations_user_name ON event_nominations(user_name);
CREATE INDEX IF NOT EXISTS idx_event_nominations_created_at ON event_nominations(created_at);
CREATE INDEX IF NOT EXISTS idx_event_nominations_building_flat ON event_nominations(building, flat);

-- Enable Row Level Security
ALTER TABLE event_nominations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow anon select event_nominations" ON event_nominations
  FOR SELECT USING (true);

CREATE POLICY "Allow anon insert event_nominations" ON event_nominations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anon update event_nominations" ON event_nominations
  FOR UPDATE USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_nominations_updated_at 
  BEFORE UPDATE ON event_nominations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- INSERT INTO event_nominations (event_title, event_date, user_name, mobile_number, building, flat) VALUES
-- ('Ganesha Idol making', '23rd August', 'John Doe', '1234567890', 'A', 'A101'),
-- ('Rangoli', 'Daily', 'Jane Smith', '0987654321', 'B', 'B205');

-- Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'event_nominations' 
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'event_nominations';
