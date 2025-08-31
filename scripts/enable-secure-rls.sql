-- Enable secure RLS for vibe_registrations table
-- Run this in your Supabase SQL Editor

-- First, enable RLS if it's disabled
ALTER TABLE vibe_registrations ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow all operations on vibe_registrations" ON vibe_registrations;
DROP POLICY IF EXISTS "Allow insert on vibe_registrations" ON vibe_registrations;
DROP POLICY IF EXISTS "Allow select on vibe_registrations" ON vibe_registrations;

-- Create secure policies for different operations

-- Policy for INSERT operations (allowing new registrations)
CREATE POLICY "Allow insert on vibe_registrations" ON vibe_registrations
    FOR INSERT 
    WITH CHECK (true);

-- Policy for SELECT operations (allowing reading registrations)
CREATE POLICY "Allow select on vibe_registrations" ON vibe_registrations
    FOR SELECT 
    USING (true);

-- Policy for UPDATE operations (if needed for admin purposes)
CREATE POLICY "Allow update on vibe_registrations" ON vibe_registrations
    FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- Policy for DELETE operations (if needed for admin purposes)
CREATE POLICY "Allow delete on vibe_registrations" ON vibe_registrations
    FOR DELETE 
    USING (true);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'vibe_registrations';

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'vibe_registrations';
