# Separate Flows for Aarti Booking and Event Nominations

This document explains the current implementation with separate, dedicated flows for Aarti bookings and Event nominations.

## Overview

The system now uses **two separate, dedicated components** instead of a single reusable one:

1. **AartiBookingFlow**: Handles only aarti bookings
2. **EventNominationFlow**: Handles only event nominations

## Flow Details

### 1. Aarti Booking Flow (AartiBookingFlow)
**Path**: Morning/Evening slot → Building → Flat → Name/Mobile → saves to `bookings` table

**Steps**:
1. User clicks on Morning/Evening aarti slot
2. Opens `AartiBookingFlow` modal
3. **Building Selection**: Choose from A-H buildings
4. **Flat Selection**: Choose specific flat number
5. **User Details**: Enter name and mobile number
6. **Submit**: Creates booking in `bookings` table

**Features**:
- Shows already booked flats with red X indicator
- Displays booking details for occupied slots
- Orange/red color scheme for aarti theme
- Validates flat availability for specific date/time

### 2. Event Nomination Flow (EventNominationFlow)
**Path**: Building → Flat → Name/Mobile → saves to `event_nominations` table

**Steps**:
1. User clicks "Nominate" button on any event card
2. Opens `EventNominationFlow` modal
3. **Building Selection**: Choose from A-H buildings
4. **Flat Selection**: Choose specific flat number
5. **User Details**: Enter name and mobile number
6. **Submit**: Creates nomination in `event_nominations` table

**Features**:
- Green color scheme for event theme
- No slot availability checking (multiple people can nominate)
- Simpler flow without time slot selection

## Components

### 1. AartiBookingFlow.tsx
- **Purpose**: Dedicated component for aarti bookings only
- **Props**:
  - `selectedSlot`: Selected aarti slot (date + time)
  - `onClose`: Function to close modal
  - `onSuccess`: Function called on successful submission
- **Database**: Saves to `bookings` table

### 2. EventNominationFlow.tsx
- **Purpose**: Dedicated component for event nominations only
- **Props**:
  - `eventData`: Event information (title + date)
  - `onClose`: Function to close modal
  - `onSuccess`: Function called on successful submission
- **Database**: Saves to `event_nominations` table

### 3. Updated EventSchedule.tsx
- Uses `AartiBookingFlow` for aarti bookings
- Maintains existing aarti booking functionality
- No changes to the aarti slot display or interaction

### 4. Updated EventCard.tsx
- Uses `EventNominationFlow` for event nominations
- Maintains "Nominations" button for viewing existing nominations
- "Nominate" button opens the dedicated event nomination flow

## Key Benefits

1. **Separation of Concerns**: Each flow has its own dedicated component
2. **Maintainability**: Easier to modify one flow without affecting the other
3. **User Experience**: Clear visual distinction between aarti and event flows
4. **Data Integrity**: Each flow saves to its appropriate database table
5. **No Breaking Changes**: Existing aarti booking flow remains unchanged

## Database Tables

### Bookings Table
- Stores aarti slot bookings
- Fields: aarti_date, aarti_time, building, flat, user_name, mobile_number
- One booking per slot (date + time combination)

### Event Nominations Table
- Stores event nominations
- Fields: event_title, event_date, building, flat, user_name, mobile_number
- Multiple nominations per event allowed

## Usage Examples

### Aarti Booking
```tsx
<AartiBookingFlow
  selectedSlot={{ date: "Wednesday, 27th August", time: "Morning" }}
  onClose={() => setShowAartiBooking(false)}
  onSuccess={(message) => {
    console.log(message);
    // Handle success
  }}
/>
```

### Event Nomination
```tsx
<EventNominationFlow
  eventData={{ title: "Ganesha Idol Making", date: "August 25, 2025" }}
  onClose={() => setShowNomination(false)}
  onSuccess={(message) => {
    console.log(message);
    // Handle success
  }}
/>
```

## Migration Notes

- **ReusableBookingFlow.tsx** is no longer used in the main application
- All aarti bookings now use **AartiBookingFlow**
- All event nominations now use **EventNominationFlow**
- Database structure remains the same
- No changes to existing data or API endpoints
