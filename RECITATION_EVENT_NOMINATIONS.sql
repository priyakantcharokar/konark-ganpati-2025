-- Insert nominations for Recitation event
-- All participants are assigned to Building O, Flat O101

INSERT INTO event_nominations (event_title, event_date, user_name, mobile_number, building, flat, created_at, updated_at) VALUES
('Recitation', '03rd September', 'Vedika', NULL, 'O', 'O101', NOW(), NOW()),
('Recitation', '03rd September', 'Ivaan Anshuman', NULL, 'O', 'O101', NOW(), NOW()),
('Recitation', '03rd September', 'Naavya Anshuman', NULL, 'O', 'O101', NOW(), NOW()),
('Recitation', '03rd September', 'Shaurya Sharma', NULL, 'O', 'O101', NOW(), NOW()),
('Recitation', '03rd September', 'Mishti - Prayer', NULL, 'O', 'O101', NOW(), NOW()),
('Recitation', '03rd September', 'Hitika', NULL, 'O', 'O101', NOW(), NOW());

-- Verify the insertions
SELECT COUNT(*) as total_nominations FROM event_nominations WHERE event_title = 'Recitation';

-- View all nominations for this event
SELECT user_name, building, flat, created_at FROM event_nominations WHERE event_title = 'Recitation' ORDER BY user_name;
