# छप्पन भोग (56) Bhog Functionality - Complete Guide

## 🎯 **Overview**
The Bhog functionality is now fully implemented and allows users to offer Bhog (food offerings) for the "छप्पन भोग (56) Bhog and Sundarkand Puja" event. Users can add Bhog from the event details page and view all Bhog offerings in a dedicated list page.

## 🚀 **How It Works**

### **1. User Flow for Adding Bhog**
1. **Find Bhog Event**: User sees the "छप्पन भोग (56) Bhog and Sundarkand Puja" event card
2. **Click "Offer Bhog"**: User clicks the "Offer Bhog" button on the event card
3. **Navigate to Event Details**: User is taken to the dedicated event page (`/events/[eventId]`)
4. **Complete Bhog Form**: User goes through the building selection → flat selection → Bhog details form
5. **Submit Bhog**: User enters their name, mobile number (optional), and Bhog name
6. **Success**: Bhog is saved to database and user sees success message

### **2. User Flow for Viewing Bhog List**
1. **Access Bhog List**: User can access the Bhog List page by navigating directly to `/bhog-list`
2. **View All Offerings**: User sees all Bhog offerings in a table format
3. **Search & Filter**: User can search by name, Bhog name, or flat number, and filter by building

## 🏗️ **Database Setup Required**

### **Create the `fiftysixbhog` table in Supabase**

Run this SQL script in your Supabase SQL editor:

```sql
-- Create the fiftysixbhog table for storing Bhog nominations
CREATE TABLE IF NOT EXISTS fiftysixbhog (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  mobile_number TEXT,
  building TEXT NOT NULL,
  flat TEXT NOT NULL,
  bhog_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on building and flat for faster queries
CREATE INDEX IF NOT EXISTS idx_fiftysixbhog_building_flat ON fiftysixbhog(building, flat);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_fiftysixbhog_created_at ON fiftysixbhog(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE fiftysixbhog ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can restrict this based on your needs)
CREATE POLICY "Allow all operations on fiftysixbhog" ON fiftysixbhog
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_fiftysixbhog_updated_at 
  BEFORE UPDATE ON fiftysixbhog 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔧 **Technical Implementation**

### **Components Updated**
- **`EventCard.tsx`**: 
  - Shows "Offer Bhog" button for Bhog events
  - Redirects to event details page (not directly to Bhog List)

- **`EventNominationFlow.tsx`**: 
  - Handles Bhog event detection
  - Shows Bhog name input field for Bhog events
  - Submits to `fiftysixbhog` table

- **`app/events/[eventId]/page.tsx`**: 
  - Shows "Offer Bhog" button for Bhog events
  - Displays Bhog offerings in the nominations section

- **`app/bhog-list/page.tsx`**: 
  - Complete Bhog List page with search, filters, and table view
  - Shows statistics (Total Bhog Offers, Active Flats)

### **Database Service Methods**
- **`createBhogNomination()`**: Creates new Bhog entries
- **`getAllBhogNominations()`**: Retrieves all Bhog entries
- **`deleteBhogNomination()`**: Deletes Bhog entries (admin use)

## 📱 **User Interface Features**

### **Event Cards**
- **Bhog Events**: Automatically detected by title containing "छप्पन भोग", "56", or "Bhog"
- **Buttons**: 
  - "Offer Bhog" - Takes user to event details page

### **Event Details Page**
- **Left Side**: Event flyer and details
- **Right Side**: 
  - "Offer Bhog" button - Opens Bhog nomination form
  - List of current Bhog offerings

### **Bhog Nomination Form**
- **Step 1**: Building selection (A-H)
- **Step 2**: Flat selection from selected building
- **Step 3**: User details (Name, Mobile, Bhog Name)

### **Bhog List Page**
- **Header**: Page title with back navigation
- **Statistics**: Total Bhog Offers and Active Flats
- **Search & Filters**: Search by name/Bhog/flat, filter by building
- **Table**: Serial No., Name, Flat Number, Bhog Name

## 🎨 **Styling & Design**
- **Color Scheme**: Green gradient theme for Bhog-related elements
- **Icons**: 🙏 for religious activities, 🕉️ for Bhog offerings
- **Responsive**: Mobile-first design with responsive breakpoints
- **Animations**: Smooth transitions and hover effects using Framer Motion

## 🔍 **Event Detection Logic**
Bhog events are automatically detected if the event title contains:
- "छप्पन भोग"
- "56"
- "Bhog"

## 📍 **Navigation Structure**
```
Landing Page (Events)
    ↓
Event Card (छप्पन भोग)
    ↓
Event Details Page (/events/[eventId])
    ↓
Bhog Nomination Form (Modal)
    ↓
Success → Redirect to Home

OR

Direct Navigation
    ↓
Bhog List Page (/bhog-list)
    ↓
View All Bhog Offerings
```

## ✅ **Testing Checklist**
1. **Database Setup**: Ensure `fiftysixbhog` table exists in Supabase
2. **Event Detection**: Verify Bhog event is detected correctly
3. **Navigation**: Test "Offer Bhog" button takes user to event details
4. **Form Flow**: Test building → flat → details flow
5. **Submission**: Test Bhog nomination submission
6. **Bhog List**: Test viewing all Bhog offerings
7. **Search & Filter**: Test search and building filter functionality

## 🚨 **Important Notes**
- **Bhog can ONLY be added from the event details page** (as requested)
- **Bhog List is accessible from multiple entry points** for convenience
- **Mobile number is optional** for Bhog nominations
- **Bhog name is required** for Bhog events
- **All Bhog offerings are stored in the `fiftysixbhog` table**

## 🔗 **File Locations**
- **Bhog List Page**: `app/bhog-list/page.tsx`
- **Event Details Page**: `app/events/[eventId]/page.tsx`
- **Event Nomination Flow**: `components/EventNominationFlow.tsx`
- **Event Cards**: `components/EventCard.tsx`
- **Database Service**: `lib/database-service.ts`
- **Database Setup Script**: `scripts/create-bhog-table.sql`

The Bhog functionality is now complete and ready to use! 🎉
