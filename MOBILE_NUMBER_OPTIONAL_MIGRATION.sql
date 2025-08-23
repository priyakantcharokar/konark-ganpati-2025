-- Migration to make mobile_number optional in both bookings and event_nominations tables
-- This script should be run in your Supabase SQL editor

-- Make mobile_number nullable in bookings table
ALTER TABLE bookings 
ALTER COLUMN mobile_number DROP NOT NULL;

-- Make mobile_number nullable in event_nominations table  
ALTER TABLE event_nominations 
ALTER COLUMN mobile_number DROP NOT NULL;

-- Optional: Add comments to document the change
COMMENT ON COLUMN bookings.mobile_number IS 'Optional mobile number for the user';
COMMENT ON COLUMN event_nominations.mobile_number IS 'Optional mobile number for the user';

-- Verify the changes (these are just for verification, you can run them to check)
-- SELECT column_name, is_nullable, data_type 
-- FROM information_schema.columns 
-- WHERE table_name IN ('bookings', 'event_nominations') 
-- AND column_name = 'mobile_number';
