# Festival Events Nomination System

This document explains the new Festival Events nomination system that has been implemented.

## Overview

The Festival Events section now includes a nomination system where users can:
1. **Nominate** for events by selecting their building/flat and entering their details
2. **View Nominations** for each event to see who has registered
3. **Access Individual Event Pages** with detailed information and nomination lists

## Features

### 1. Event Cards
- Each event card now has two buttons:
  - **Nominations** (Green): Shows all nominations for that event
  - **Nominate** (Blue): Opens the nomination form

### 2. Nomination Form
The nomination form follows a 3-step process:
1. **Building Selection**: Choose from buildings A-H
2. **Flat Selection**: Select your specific flat number
3. **User Details**: Enter name and mobile number

### 3. Individual Event Pages
- Access via `/events/[event-slug]` (e.g., `/events/ganesha-idol-making`)
- Shows detailed event information
- Displays recent nominations preview
- Full nomination management

### 4. Database Structure
- New `event_nominations` table stores all nomination data
- Includes user details, building/flat, and event information
- Timestamps for tracking when nominations were made

## Database Setup

### 1. Run the SQL Script
Execute the `EVENT_NOMINATIONS_SETUP.sql` file in your Supabase SQL Editor.

### 2. Table Structure
```sql
event_nominations (
  id: UUID (Primary Key)
  event_title: VARCHAR(255)
  event_date: VARCHAR(100)
  user_name: VARCHAR(255)
  mobile_number: VARCHAR(15)
  building: VARCHAR(10)
  flat: VARCHAR(20)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

### 3. RLS Policies
- Anonymous users can read, insert, and update nominations
- Secure and scalable for production use

## User Flow

### For Users Wanting to Nominate:
1. Click **"Nominate"** button on any event card
2. Select your building (A-H)
3. Select your flat number
4. Enter your name and mobile number
5. Submit the nomination

### For Users Wanting to View Nominations:
1. Click **"Nominations"** button on any event card
2. View all nominations for that event
3. See participant details (name, building, flat, contact)

### For Direct Event Access:
1. Click on the event title (links to individual event page)
2. View comprehensive event information
3. Access nomination management from the event page

## Technical Implementation

### Components Created:
1. **EventNominationForm**: Handles the 3-step nomination process
2. **EventNominations**: Displays nominations for an event
3. **Individual Event Pages**: Dynamic routes for each event

### Database Service Updates:
- Added `EventNomination` interface
- Added `CreateEventNomination` interface
- Added nomination CRUD methods

### File Structure:
```
components/
├── EventCard.tsx (updated with nomination buttons)
├── EventNominationForm.tsx (new)
└── EventNominations.tsx (new)

app/events/[eventSlug]/
└── page.tsx (new individual event pages)

lib/
└── database-service.ts (updated with nomination methods)
```

## Mobile Responsiveness

- All components are fully responsive
- Mobile-first design approach
- Touch-friendly buttons and forms
- Optimized layouts for tablets and mobile devices

## Validation

### Name Field:
- Only letters and spaces allowed
- Minimum 2 characters required
- Real-time validation feedback

### Mobile Number:
- Exactly 10 digits required
- Numbers only (no special characters)
- Real-time validation feedback

## Security Features

- Row Level Security (RLS) enabled
- Input sanitization and validation
- Secure database operations
- Anonymous access for public events

## Future Enhancements

Potential improvements that could be added:
1. Email notifications for nominations
2. Admin panel for managing nominations
3. Export functionality for event coordinators
4. Duplicate nomination prevention
5. Event capacity limits

## Troubleshooting

### Common Issues:
1. **Table not found**: Ensure SQL script was executed in Supabase
2. **Permission denied**: Check RLS policies are correctly set
3. **Form not submitting**: Verify all required fields are filled
4. **Nominations not loading**: Check database connection and RLS policies

### Support:
- Check browser console for error messages
- Verify Supabase configuration
- Ensure all components are properly imported

## Testing

To test the system:
1. Create a test nomination for any event
2. Verify it appears in the nominations list
3. Check individual event page functionality
4. Test mobile responsiveness
5. Verify validation rules work correctly

The system is now ready for production use and provides a comprehensive solution for event nominations in the Ganesh Pooja Festival.
