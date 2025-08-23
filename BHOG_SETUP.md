# Bhog Nomination System Setup

This document explains how to set up the Bhog nomination system for the Ganesh Pooja 2025 application.

## Overview

The Bhog nomination system allows users to offer Bhog (food offerings) for the छप्पन भोग (56 Bhog) event. Users can:

1. Select their building and flat
2. Enter their name and Bhog name
3. Submit their Bhog offering
4. View all Bhog offerings in a list

## Database Setup

### 1. Create the `fiftysixbhog` table

Run the SQL script in `scripts/create-bhog-table.sql` in your Supabase SQL editor:

```sql
-- This will create the table with proper indexes and RLS policies
-- Run the entire script in your Supabase SQL editor
```

### 2. Table Structure

The `fiftysixbhog` table contains:
- `id`: Unique identifier (UUID)
- `user_name`: Name of the person offering Bhog
- `mobile_number`: Optional mobile number
- `building`: Building letter (A, B, C, etc.)
- `flat`: Flat number
- `bhog_name`: Name of the Bhog being offered
- `created_at`: Timestamp when the entry was created
- `updated_at`: Timestamp when the entry was last updated

## Features Implemented

### 1. Bhog Nomination Flow
- **Building Selection**: Users select their building (A-H)
- **Flat Selection**: Users select their specific flat
- **Bhog Details**: Users enter their name and Bhog name
- **Submission**: Bhog offering is saved to the database

### 2. Bhog List Page
- **Route**: `/bhog-list`
- **Features**:
  - View all Bhog offerings in a table format
  - Search by name, Bhog name, or flat number
  - Filter by building
  - Statistics showing total offers and active flats
  - Responsive design with animations

### 3. Updated Event Cards
- **Bhog Events**: Automatically detected by title containing "छप्पन भोग", "56", or "Bhog"
- **Button Changes**:
  - "Nominate" → "Offer Bhog"
  - "Nominations" → "Bhog List"
- **Navigation**: Clicking "Bhog List" redirects to `/bhog-list`

### 4. Navigation Updates
- Added "Bhog List" link to main navigation
- Available on both desktop and mobile navigation

## How It Works

### 1. User Flow
1. User sees an event card for "छप्पन भोग (56) Bhog and Sundarkand Puja"
2. User clicks "Offer Bhog" button
3. User goes through building selection → flat selection → Bhog details
4. User enters their name and Bhog name
5. User submits the Bhog offering
6. Success message is shown and user is redirected to home page

### 2. Viewing Bhog List
1. User clicks "Bhog List" button on any Bhog event card
2. User is redirected to `/bhog-list` page
3. User can see all Bhog offerings in a table format
4. User can search and filter the list

## Technical Implementation

### 1. Components Updated
- `EventNominationFlow.tsx`: Added Bhog name field and Bhog event detection
- `EventCard.tsx`: Updated button text for Bhog events
- `EventNominations.tsx`: Redirects Bhog events to Bhog List page
- `database-service.ts`: Added Bhog types and methods

### 2. New Components
- `app/bhog-list/page.tsx`: Bhog List page component

### 3. Database Methods
- `createBhogNomination()`: Creates new Bhog entries
- `getAllBhogNominations()`: Retrieves all Bhog entries
- `deleteBhogNomination()`: Deletes Bhog entries (admin use)

## Testing

### 1. Test Bhog Nomination
1. Go to the events page
2. Find the "छप्पन भोग (56) Bhog and Sundarkand Puja" event
3. Click "Offer Bhog"
4. Complete the nomination flow
5. Verify the entry appears in the Bhog List

### 2. Test Bhog List
1. Go to `/bhog-list`
2. Verify all Bhog entries are displayed
3. Test search functionality
4. Test building filter
5. Verify statistics are correct

## Customization

### 1. Adding More Bhog Events
To add more Bhog-related events, ensure the event title contains:
- "छप्पन भोग"
- "56"
- "Bhog"

### 2. Modifying Bhog Fields
To add more fields to the Bhog nomination:
1. Update the `BhogNomination` interface in `database-service.ts`
2. Update the `fiftysixbhog` table structure
3. Update the nomination form in `EventNominationFlow.tsx`
4. Update the Bhog List table in `bhog-list/page.tsx`

### 3. Changing Button Text
Button text can be customized in:
- `EventCard.tsx`: Main button text
- `EventNominationFlow.tsx`: Form submission button
- `bhog-list/page.tsx`: Page titles and labels

## Troubleshooting

### 1. Bhog Events Not Detected
- Ensure event title contains the required keywords
- Check the `isBhogEvent` logic in components

### 2. Database Errors
- Verify the `fiftysixbhog` table exists in Supabase
- Check RLS policies are properly configured
- Verify database connection in `supabase.ts`

### 3. Navigation Issues
- Ensure the `/bhog-list` route is accessible
- Check that navigation links are properly updated

## Future Enhancements

### 1. Admin Features
- Edit Bhog entries
- Delete Bhog entries
- Export Bhog data

### 2. User Features
- Edit own Bhog entries
- Multiple Bhog offerings per user
- Bhog categories or types

### 3. Analytics
- Bhog popularity statistics
- Building-wise Bhog distribution
- Time-based Bhog offering trends
