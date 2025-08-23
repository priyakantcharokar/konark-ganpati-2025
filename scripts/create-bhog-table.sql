-- Create the fiftysixbhog table for storing Bhog nominations
CREATE TABLE IF NOT EXISTS fiftysixbhog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  mobile_number TEXT,
  building TEXT NOT NULL,
  flat TEXT NOT NULL,
  bhog_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on building and flat for faster queries
CREATE INDEX IF NOT EXISTS idx_fiftysixbhog_building_flat ON fiftysixbhog(building, flat);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_fiftysixbhog_created_at ON fiftysixbhog(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE fiftysixbhog ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can restrict this based on your needs)
CREATE POLICY "Allow all operations on fiftysixbhog" ON fiftysixbhog
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_fiftysixbhog_updated_at 
  BEFORE UPDATE ON fiftysixbhog 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data (optional)
-- INSERT INTO fiftysixbhog (user_name, building, flat, bhog_name) VALUES
--   ('John Doe', 'A', '101', 'Modak'),
--   ('Jane Smith', 'B', '205', 'Ladoo'),
--   ('Mike Johnson', 'C', '301', 'Puran Poli');
