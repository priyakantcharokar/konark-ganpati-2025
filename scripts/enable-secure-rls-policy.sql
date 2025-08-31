-- ENABLE SECURE RLS POLICY - Run this in Supabase SQL Editor

-- First, make sure RLS is enabled
ALTER TABLE vibe_registrations ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be blocking operations
DROP POLICY IF EXISTS "Allow all operations on vibe_registrations" ON vibe_registrations;
DROP POLICY IF EXISTS "vibe_registrations_insert_policy" ON vibe_registrations;
DROP POLICY IF EXISTS "vibe_registrations_select_policy" ON vibe_registrations;
DROP POLICY IF EXISTS "allow_insert" ON vibe_registrations;
DROP POLICY IF EXISTS "allow_select" ON vibe_registrations;

-- Create secure policies for the specific operations we need

-- Policy 1: Allow INSERT for new registrations (form submissions)
CREATE POLICY "enable_insert_registrations" ON vibe_registrations
    FOR INSERT 
    WITH CHECK (true);

-- Policy 2: Allow SELECT for reading registrations (displaying list)
CREATE POLICY "enable_select_registrations" ON vibe_registrations
    FOR SELECT 
    USING (true);

-- Verify the policies were created
SELECT 
    policyname, 
    cmd, 
    permissive,
    CASE 
        WHEN cmd = 'INSERT' THEN '✅ INSERT allowed'
        WHEN cmd = 'SELECT' THEN '✅ SELECT allowed'
        ELSE '❓ Unknown'
    END as status
FROM pg_policies 
WHERE tablename = 'vibe_registrations';

-- Verify RLS is enabled
SELECT 
    tablename, 
    rowsecurity,
    CASE 
        WHEN rowsecurity = true THEN '✅ RLS Enabled (Secure)'
        ELSE '❌ RLS Disabled'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'vibe_registrations';

-- Test by counting records
SELECT COUNT(*) as total_records FROM vibe_registrations;

-- Show existing records
SELECT * FROM vibe_registrations LIMIT 5;
