# 🚀 Supabase Setup Guide for Mobile Authentication

This guide will walk you through setting up Supabase for production mobile number authentication in your Ganesh Pooja Festival website.

## 📋 Prerequisites

- A Supabase account (free tier available)
- A phone number verification service (Twilio recommended)
- Basic understanding of databases

## 🎯 Step-by-Step Setup

### 1. Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Sign up/Login** with your GitHub account
3. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project name: `ganesh-pooja-2025`
   - Enter database password (save this!)
   - Choose region closest to your users
   - Click "Create new project"

### 2. Set Up Database Tables

Once your project is created, go to the **SQL Editor** and run these commands:

#### Users Table
```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  flat_number VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Create policy for users to insert their own data
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create policy for users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);
```

#### Events Table (Optional - for dynamic event management)
```sql
-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date VARCHAR(100) NOT NULL,
  time VARCHAR(100),
  description TEXT,
  organizers VARCHAR(255),
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default events
INSERT INTO events (title, date, time, description, organizers, category) VALUES
('Idol Making', 'Saturday, 23rd August', 'After 7 PM', 'Creative idol making session where participants can showcase their artistic skills in creating beautiful Ganpati idols.', 'Society Committee', 'competition'),
('Ganapati Sthapana', 'Wednesday, 27th August', 'Morning', 'Sacred ceremony to install and consecrate the Ganpati idol with traditional rituals and prayers.', 'Religious Committee', 'ceremony'),
('Karaoke & Modak Making Competition', 'Wednesday, 27th August', 'Evening (After 7 PM)', 'Fun-filled evening with karaoke performances and traditional modak making competition.', 'Sneha, Nitin', 'competition'),
('Group & Solo Performances', 'Thursday, 28th August', 'After 7 PM', 'Cultural evening featuring group and solo performances including dance, music, and drama.', 'Bhagyashree, Shraddha', 'performance'),
('Fancy Dress & Fashion Show', 'Friday, 29th August', 'After 7 PM', 'Exciting fancy dress competition for kids and adults, followed by a glamorous fashion show.', 'Bharati, Rohini', 'competition'),
('Couple Games & Team Building', 'Saturday, 30th August', 'After 7 PM', 'Fun couple games, team building activities, and classic musical chair competition.', 'Priya, Pooja', 'game'),
('Antakshari & Cooking Competition', 'Sunday, 31st August', 'After 7 PM', 'Musical antakshari competition and cooking competition for both male and female participants.', 'Society Committee', 'competition'),
('Tambola & Stalls', 'Monday, 1st September', 'After 7 PM', 'Exciting tambola game with various stalls including in-house and outside vendors.', 'Society Committee', 'game'),
('Sundarkand & 56 Bhog', 'Tuesday, 2nd September', 'After 7 PM', 'Sacred recitation of Sundarkand and preparation of 56 different types of offerings.', 'Deepika, Swati', 'ceremony'),
('Best Out of Waste & Recitation', 'Wednesday, 3rd September', 'After 7 PM', 'Creative competition using waste materials and recitation competitions.', 'Society Committee', 'competition'),
('Anandmela & Drawing Competition', 'Thursday, 4th September', 'After 7 PM', 'Joyful celebration with drawing competition for all age groups.', 'Society Committee', 'competition'),
('Prize Distribution & Mahaprasad', 'Friday, 5th September', 'After 7 PM', 'Grand finale with prize distribution, mahaprasad, Atharvshirsh recitation, and Ganapati Naam Pathan.', 'Society Committee', 'ceremony'),
('Ganapati Visarjan', 'Saturday, 6th September', 'Evening', 'Emotional farewell ceremony to bid goodbye to Lord Ganapati with traditional visarjan rituals.', 'Religious Committee', 'ceremony');
```

### 3. Configure Authentication

#### Enable Phone Auth
1. Go to **Authentication** → **Settings**
2. Scroll to **Phone Auth**
3. Enable **Enable phone confirmations**
4. Set **Message template** (optional customization)

#### Set Up SMS Provider (Twilio Recommended)
1. Go to **Authentication** → **SMS Provider**
2. Choose **Twilio**
3. Get your Twilio credentials:
   - **Account SID**: From [Twilio Console](https://console.twilio.com/)
   - **Auth Token**: From [Twilio Console](https://console.twilio.com/)
   - **Message Service ID**: Create a new Messaging Service in Twilio

#### Twilio Setup Steps:
1. **Sign up at [twilio.com](https://twilio.com)**
2. **Get a phone number** for SMS
3. **Create Messaging Service**:
   - Go to Messaging → Services
   - Create new service
   - Add your phone number
   - Copy the Service ID

### 4. Get Project Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**
   - **Anon/Public Key**
   - **Service Role Key** (keep secret!)

### 5. Environment Variables

Create `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Twilio Configuration (if using custom SMS)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_MESSAGING_SERVICE_ID=your-service-id

# App Configuration
NEXT_PUBLIC_APP_NAME="Ganesh Pooja 2025"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Update Supabase Client

The `lib/supabase.ts` file is already configured. Make sure your environment variables are set correctly.

### 7. Test Authentication

1. **Start your development server**: `npm run dev`
2. **Navigate to the website**
3. **Select a flat number**
4. **Enter your phone number**
5. **Check your phone for OTP**
6. **Verify OTP**

## 🔧 Customization Options

### Custom SMS Templates
In Supabase Auth Settings, you can customize:
- **Message template**: "Your Ganesh Pooja verification code is: {{ .Code }}"
- **SMS provider settings**
- **Rate limiting**

### Database Policies
Modify the SQL policies to:
- Allow admin access
- Restrict certain operations
- Add audit logging

## 🚨 Production Considerations

### Security
- **Never expose Service Role Key** in client-side code
- **Use Row Level Security** (already configured)
- **Enable HTTPS** in production
- **Set up proper CORS** if needed

### Performance
- **Enable database indexes** for phone numbers
- **Set up connection pooling** for high traffic
- **Monitor query performance**

### Monitoring
- **Set up Supabase alerts** for:
  - Failed authentication attempts
  - High error rates
  - Database performance issues

## 🐛 Troubleshooting

### Common Issues

#### OTP Not Received
1. Check Twilio account balance
2. Verify phone number format
3. Check SMS provider configuration
4. Review Twilio logs

#### Authentication Errors
1. Verify environment variables
2. Check Supabase project status
3. Review browser console errors
4. Check Supabase logs

#### Database Connection Issues
1. Verify database password
2. Check project status
3. Review connection limits
4. Check IP restrictions

### Debug Mode
Enable debug logging in development:

```typescript
// In lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: process.env.NODE_ENV === 'development'
  }
})
```

## 📱 Mobile App Integration

If you want to create a mobile app later:
1. **Use the same Supabase project**
2. **Share authentication tokens**
3. **Use React Native Supabase client**
4. **Implement push notifications**

## 🔄 Backup & Recovery

### Database Backup
1. **Enable Point-in-Time Recovery** in Supabase
2. **Set up automated backups**
3. **Test restore procedures**

### Code Backup
1. **Use Git for version control**
2. **Backup environment variables**
3. **Document configuration changes**

## 📞 Support Resources

- **Supabase Documentation**: [docs.supabase.com](https://docs.supabase.com)
- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
- **Twilio Support**: [support.twilio.com](https://support.twilio.com)
- **Community Forums**: [github.com/supabase/supabase](https://github.com/supabase/supabase)

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database tables created
- [ ] Authentication enabled
- [ ] SMS provider configured
- [ ] Environment variables set
- [ ] Authentication tested
- [ ] Production deployment ready
- [ ] Monitoring configured
- [ ] Backup strategy in place

---

**Need Help?** Create an issue in your repository or reach out to the development team!

