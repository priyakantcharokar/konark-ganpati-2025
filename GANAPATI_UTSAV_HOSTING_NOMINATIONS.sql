-- Insert nominations for GANAPATI UTSAV HOSTING event
-- All participants are assigned to Building O, Flat O101

INSERT INTO event_nominations (event_title, event_date, user_name, mobile_number, building, flat, created_at, updated_at) VALUES
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Tanishka Kulkarni', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Janhavi Naik', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Nirmohi Changle', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Vedika Naik', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Rayhaan', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Golu', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Anshita Saktel', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Vaidehi Charokar', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Mishti Charokar', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Riva Gupta', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Ishani Shrivastava', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Manya Chauhan', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Harshita Kapur', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Arnav Thombare', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'E.Bhargava Narasimma Raj', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Naavya Anshuman', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Shanaya Bishnoi', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Swara Katkar', NULL, 'O', 'O101', NOW(), NOW()),
('GANAPATI UTSAV HOSTING', 'Throughout Festival', 'Manasvi Kumbhar', NULL, 'O', 'O101', NOW(), NOW());

-- Verify the insertions
SELECT COUNT(*) as total_nominations FROM event_nominations WHERE event_title = 'GANAPATI UTSAV HOSTING';

-- View all nominations for this event
SELECT user_name, building, flat, created_at FROM event_nominations WHERE event_title = 'GANAPATI UTSAV HOSTING' ORDER BY user_name;
