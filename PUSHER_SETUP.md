# 🚀 Pusher Integration Setup Guide

## 📋 Prerequisites

1. **Pusher Account**: Sign up at [pusher.com](https://pusher.com)
2. **Node.js**: Version 16 or higher
3. **Next.js**: Version 13 or higher

## 🔧 Step 1: Create Pusher App

1. Go to [pusher.com](https://pusher.com) and sign up/login
2. Click "Create App"
3. Choose "Channels" as the app type
4. Fill in app details:
   - **App name**: `Ganesh Pooja 2025`
   - **Cluster**: Choose closest to your users (e.g., `ap1` for Asia Pacific)
5. Click "Create app"
6. Note down your credentials from the "Keys" tab:
   - **App ID**
   - **Key**
   - **Secret**
   - **Cluster**

## ⚙️ Step 2: Environment Configuration

1. **Copy** `.env.local.example` to `.env.local`
2. **Replace** placeholder values with your actual Pusher credentials:

```env
# Pusher Configuration
NEXT_PUBLIC_PUSHER_APP_KEY=your_actual_app_key_here
NEXT_PUBLIC_PUSHER_CLUSTER=your_actual_cluster_here
PUSHER_APP_ID=your_actual_app_id_here
PUSHER_APP_SECRET=your_actual_app_secret_here
```

## 📦 Step 3: Install Dependencies

```bash
npm install pusher pusher-js
```

## 🎯 Step 4: How It Works

### **Real-time Notifications Flow:**

1. **User Books Slot**: When someone submits a booking
2. **API Call**: Frontend calls `/api/notify` endpoint
3. **Pusher Trigger**: Backend sends notification via Pusher
4. **Real-time Update**: All connected users receive notification instantly
5. **UI Update**: Notification toast appears with booking details

### **Notification Content:**
- **User Name**: Who booked the slot
- **Aarti Time**: Morning/Evening session
- **Date**: Specific date of booking
- **Building**: Which building (A, B, C, etc.)
- **Flat Number**: Specific flat number
- **Timestamp**: When the booking was made

## 🔍 Step 5: Testing

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Open Multiple Browser Tabs**:
   - Tab 1: `http://localhost:3000`
   - Tab 2: `http://localhost:3000` (different browser/incognito)

3. **Test Booking Flow**:
   - Select an aarti slot
   - Choose building and flat
   - Enter name and submit
   - Watch for real-time notification in other tab

## 🚨 Troubleshooting

### **Common Issues:**

1. **"Pusher is not defined"**:
   - Check environment variables are loaded
   - Restart development server after adding `.env.local`

2. **Notifications not appearing**:
   - Verify Pusher credentials in `.env.local`
   - Check browser console for errors
   - Ensure both tabs are on the same domain

3. **Build Errors**:
   - Run `npm run build` to check for compilation issues
   - Verify all imports are correct

### **Debug Steps:**

1. **Check Environment Variables**:
   ```bash
   echo $NEXT_PUBLIC_PUSHER_APP_KEY
   ```

2. **Verify API Endpoint**:
   - Check Network tab in browser dev tools
   - Ensure `/api/notify` returns 200 status

3. **Pusher Dashboard**:
   - Monitor events in Pusher dashboard
   - Check for successful message delivery

## 📱 Features

### **Real-time Updates:**
- ✅ **Instant Notifications**: All users see bookings in real-time
- ✅ **Live Slot Updates**: Slots marked as booked immediately
- ✅ **Cross-device Sync**: Works across multiple devices/browsers
- ✅ **Persistent Storage**: Bookings saved to localStorage

### **User Experience:**
- ✅ **Beautiful Toasts**: Animated notification cards
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Auto-dismiss**: Notifications auto-remove after viewing
- ✅ **Manual Control**: Users can dismiss notifications manually

## 🔒 Security Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Keys**: Keep Pusher secret keys secure on server side
3. **Rate Limiting**: Consider implementing rate limiting for production
4. **Validation**: Always validate user input before sending notifications

## 🚀 Production Deployment

1. **Set Environment Variables** in your hosting platform
2. **Update Cluster** if needed for better performance
3. **Monitor Usage** in Pusher dashboard
4. **Enable SSL** for secure connections

## 📞 Support

- **Pusher Documentation**: [pusher.com/docs](https://pusher.com/docs)
- **Next.js API Routes**: [nextjs.org/docs/api-routes](https://nextjs.org/docs/api-routes)
- **Project Issues**: Check GitHub repository for known issues

---

**🎉 Congratulations!** Your Ganesh Pooja booking system now has real-time notifications!
