-- Create vibe_registrations table for Vibe Coding registrations
CREATE TABLE IF NOT EXISTS vibe_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    building TEXT NOT NULL,
    flat TEXT NOT NULL,
    website_idea TEXT NOT NULL,
    vibe_code TEXT NOT NULL,
    expectations TEXT DEFAULT '',
    event_type TEXT DEFAULT 'vibe_coding',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vibe_registrations_building_flat ON vibe_registrations(building, flat);
CREATE INDEX IF NOT EXISTS idx_vibe_registrations_created_at ON vibe_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vibe_registrations_event_type ON vibe_registrations(event_type);

-- Enable Row Level Security (RLS)
ALTER TABLE vibe_registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can modify this based on your security requirements)
CREATE POLICY "Allow all operations on vibe_registrations" ON vibe_registrations
    FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vibe_registrations_updated_at 
    BEFORE UPDATE ON vibe_registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE vibe_registrations IS 'Stores registrations for Vibe Coding sessions';
COMMENT ON COLUMN vibe_registrations.full_name IS 'Full name of the participant';
COMMENT ON COLUMN vibe_registrations.building IS 'Building letter (A, B, C, etc.)';
COMMENT ON COLUMN vibe_registrations.flat IS 'Flat number (101, 102, etc.)';
COMMENT ON COLUMN vibe_registrations.website_idea IS 'Description of the website idea they want to create';
COMMENT ON COLUMN vibe_registrations.vibe_code IS 'Personal vibe description (e.g., cool gamer, nature lover)';
COMMENT ON COLUMN vibe_registrations.expectations IS 'Additional expectations from the session (optional)';
COMMENT ON COLUMN vibe_registrations.event_type IS 'Type of event (default: vibe_coding)';
