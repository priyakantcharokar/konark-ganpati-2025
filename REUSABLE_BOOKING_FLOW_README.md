# Reusable Booking Flow System

This document explains the new reusable booking flow system that handles both Aarti bookings and Event nominations using the same interface.

## Overview

The system now uses a single, reusable component (`ReusableBookingFlow`) that can handle:
1. **Aarti Bookings**: Time slot → Building → Flat → User Details
2. **Event Nominations**: Building → Flat → User Details

## How It Works

### For Aarti Bookings:
1. User clicks on an Aarti slot (Morning/Evening)
2. Opens `ReusableBookingFlow` with `type="aarti"`
3. Shows time slot selection first, then building → flat → details
4. Saves to `bookings` table in Supabase

### For Event Nominations:
1. User clicks "Nominate" button on any event card
2. Opens `ReusableBookingFlow` with `type="event"`
3. Skips time slot selection, goes directly to building → flat → details
4. Saves to `event_nominations` table in Supabase

## Components

### 1. ReusableBookingFlow.tsx
- **Purpose**: Single component handling all booking flows
- **Props**:
  - `type`: 'aarti' | 'event'
  - `title`: Modal title
  - `subtitle`: Additional information
  - `selectedSlot`: For aarti bookings (date + time)
  - `eventData`: For event nominations (title + date)
  - `onClose`: Function to close modal
  - `onSuccess`: Function called on successful submission

### 2. Updated EventCard.tsx
- Now uses `ReusableBookingFlow` instead of separate nomination form
- Maintains "Nominations" button for viewing existing nominations
- "Nominate" button opens the reusable flow

### 3. Updated EventSchedule.tsx
- Simplified to remove old booking logic
- Uses `ReusableBookingFlow` for Aarti bookings
- Cleaner, more maintainable code

## Flow Steps

### Aarti Booking Flow:
1. **Slot Selection**: Choose Morning/Evening aarti time
2. **Building Selection**: Select from A-H buildings
3. **Flat Selection**: Choose specific flat number
4. **User Details**: Enter name and mobile number
5. **Submit**: Creates booking in `bookings` table

### Event Nomination Flow:
1. **Building Selection**: Select from A-H buildings (skips slot selection)
2. **Flat Selection**: Choose specific flat number
3. **User Details**: Enter name and mobile number
4. **Submit**: Creates nomination in `event_nominations` table

## Database Integration

### Aarti Bookings:
- Uses existing `bookings` table
- Calls `databaseService.createBooking()`
- Integrates with existing submission system

### Event Nominations:
- Uses new `event_nominations` table
- Calls `databaseService.createEventNomination()`
- Separate table for event participation tracking

## Benefits

1. **Code Reusability**: Single component handles multiple booking types
2. **Consistent UX**: Same interface for all booking flows
3. **Easier Maintenance**: One component to update instead of multiple
4. **Mobile Responsive**: Works perfectly on all devices
5. **Validation**: Consistent validation across all flows
6. **Error Handling**: Unified error handling and success messages

## Usage Examples

### Aarti Booking:
```tsx
<ReusableBookingFlow
  type="aarti"
  title="Book Aarti Slot"
  subtitle={`${selectedAarti.date} - ${selectedAarti.time}`}
  selectedSlot={selectedAarti}
  onClose={() => setShowReusableBooking(false)}
  onSuccess={(message) => {
    setShowReusableBooking(false)
    showToastMessage(message, 'success')
    loadSubmissions()
  }}
/>
```

### Event Nomination:
```tsx
<ReusableBookingFlow
  type="event"
  title={`Nominate for ${event.title}`}
  subtitle={`Date: ${event.date}`}
  eventData={{ title: event.title, date: event.date }}
  onClose={() => setShowNominationForm(false)}
  onSuccess={(message) => {
    setShowNominationForm(false)
    // Handle success
  }}
/>
```

## Mobile Experience

- **Breadcrumb Navigation**: Shows current step and back button
- **Responsive Design**: Adapts to all screen sizes
- **Touch Friendly**: Large buttons and touch targets
- **Step Indicators**: Clear visual feedback on current step

## Validation

Both flows use the same validation rules:
- **Name**: Letters and spaces only, minimum 2 characters
- **Mobile**: Exactly 10 digits, numbers only
- **Real-time Feedback**: Shows validation status as user types

## Future Enhancements

The reusable system makes it easy to add new booking types:
1. **Workshop Registration**: Building → Flat → User Details
2. **Competition Entry**: Building → Flat → User Details
3. **Volunteer Signup**: Building → Flat → User Details

Simply add new `type` values and corresponding database tables.

## Technical Details

### State Management:
- Uses React hooks for local state
- Step-based navigation with `useState`
- Form validation with real-time feedback

### Data Loading:
- Loads flats data from `/flats.json`
- Loads aarti schedule from `/aarti.json` (for aarti type)
- Fetches existing submissions for conflict checking

### Database Operations:
- Supabase integration for all operations
- Proper error handling and user feedback
- Transaction-like behavior for data consistency

The system is now production-ready and provides a seamless, consistent experience for all types of bookings and nominations in the Ganesh Pooja Festival application.
