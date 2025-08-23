-- Insert nominations for Ganpati Utsav Hosting event
-- All participants are assigned to Building O, Flat O101

INSERT INTO event_nominations (event_title, event_date, user_name, mobile_number, building, flat, created_at, updated_at) VALUES
('Ganpati Utsav Hosting', 'Throughout Festival', 'Tanishka Kulkarni', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Janhavi Naik', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Nirmohi Changle', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Vedika Naik', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Rayhaan', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Golu', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Anshita Saktel', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Vaidehi Charokar', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Mishti Charokar', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Riva Gupta', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Ishani Shrivastava', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Manya Chauhan', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Harshita Kapur', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Arnav Thombare', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'E.Bhargava Narasimma Raj', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Naavya Anshuman', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Shanaya Bishnoi', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Swara Katkar', NULL, 'O', 'O101', NOW(), NOW()),
('Ganpati Utsav Hosting', 'Throughout Festival', 'Manasvi Kumbhar', NULL, 'O', 'O101', NOW(), NOW());

-- Verify the insertions
SELECT COUNT(*) as total_nominations FROM event_nominations WHERE event_title = 'Ganpati Utsav Hosting';

-- View all nominations for this event
SELECT user_name, building, flat, created_at FROM event_nominations WHERE event_title = 'Ganpati Utsav Hosting' ORDER BY user_name;
