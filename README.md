# 🕉️ Ganesh Pooja 2025 - Festival Schedule

A beautiful, responsive website for the Ganesh Pooja Festival 2025, featuring a complete event schedule with mobile authentication and flat number selection.

## ✨ Features

- **Beautiful UI/UX**: Modern, responsive design that works on web, tablet, and mobile
- **Flat Selection**: Interactive flat number selection for society residents
- **Phone Authentication**: OTP-based phone number verification using Supabase
- **Event Schedule**: Complete festival schedule with 13 events
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Optimized for all device sizes
- **Animations**: Smooth animations and transitions using Framer Motion
- **Supabase Integration**: Production-ready backend with authentication

## 🎯 Event Line-up

- **Saturday, 23rd August** – Idol Making
- **Wednesday, 27th August** – Ganapati Sthapana (Morning) & Karaoke & Modak Making Competition (Evening)
- **Thursday, 28th August** – Group & Solo Performances
- **Friday, 29th August** – Fancy Dress & Fashion Show
- **Saturday, 30th August** – Couple Games, Team Building Games, Musical Chair
- **Sunday, 31st August** – Antakshari & Cooking Competition
- **Monday, 1st September** – Tambola & Stalls
- **Tuesday, 2nd September** – Sundarkand & 56 Bhog
- **Wednesday, 3rd September** – Best Out of Waste & Recitation
- **Thursday, 4th September** – Anandmela & Drawing Competition
- **Friday, 5th September** – Prize Distribution, Mahaprasad, Atharvshirsh, Ganapati Naam Pathan
- **Saturday, 6th September** – Ganapati Visarjan

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd pooja-booking-form

# Run the automated setup script
./scripts/setup.sh
```

The setup script will:
- ✅ Check Node.js version
- ✅ Install dependencies
- ✅ Create environment file template
- ✅ Set up .gitignore
- ✅ Test the build process

### Option 2: Manual Setup

#### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

#### Installation Steps

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd pooja-booking-form
   npm install
   ```

2. **Set up Supabase** (follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
   - Create Supabase project
   - Set up database tables
   - Configure authentication
   - Get API credentials

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Complete Setup Guides

### 🔐 [Supabase Setup Guide](./SUPABASE_SETUP.md)
Complete step-by-step guide for setting up Supabase with mobile authentication:
- Creating Supabase project
- Setting up database tables
- Configuring phone authentication
- Setting up Twilio for SMS
- Security and monitoring

### 🚀 [Deployment Guide](./DEPLOYMENT.md)
Production deployment guide with:
- Vercel deployment (recommended)
- Environment configuration
- Security setup
- Performance optimization
- CI/CD pipeline

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Backend**: Supabase (PostgreSQL + Auth)
- **SMS**: Twilio integration ready

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: Full-featured experience with large cards and detailed information
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with mobile-first design

## 🔐 Authentication Flow

1. **Flat Selection**: Users select their flat number from the society
2. **Phone Verification**: Enter phone number and receive OTP via SMS
3. **OTP Verification**: Verify the 6-digit OTP with Supabase
4. **Access Granted**: View complete festival schedule with search/filter

## 🎨 Design Features

- **Color Scheme**: Festival-themed colors with gold, orange, and red accents
- **Typography**: Modern fonts (Inter + Poppins) for excellent readability
- **Animations**: Smooth hover effects, page transitions, and micro-interactions
- **Cards**: Beautiful event cards with category-based color coding
- **Gradients**: Subtle gradients for visual appeal

## 📊 Event Categories

- **Competition** 🏆: Competitive events and contests
- **Performance** 🎭: Cultural performances and shows
- **Ceremony** 🕉️: Religious and traditional ceremonies
- **Game** 🎮: Fun games and activities

## 🔧 Customization

### Adding New Events
Edit the `events` array in `components/EventSchedule.tsx` to add or modify events.

### Changing Colors
Modify the color scheme in `tailwind.config.js` and `app/globals.css`.

### Updating Content
All event information is stored in the component files for easy updates.

## 🚀 Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

## 🧪 Testing

### Development Testing
```bash
# Start development server
npm run dev

# Test authentication flow
# Use any 10-digit phone number
# OTP will be sent via Supabase (requires setup)
```

### Production Testing
- Test on multiple devices
- Verify authentication flow
- Check responsive design
- Test search and filtering

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

#### Authentication Issues
- Verify Supabase credentials in `.env.local`
- Check Supabase project status
- Verify phone number format
- Check browser console for errors

#### Styling Issues
- Clear browser cache
- Verify Tailwind CSS is working
- Check for CSS conflicts

### Getting Help
1. Check the troubleshooting sections in setup guides
2. Review browser console for errors
3. Check Supabase dashboard for authentication logs
4. Create an issue in your repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ for the Ganesh Pooja Festival 2025
- Special thanks to all event organizers and committee members
- Community-driven development for community celebrations

## 📞 Support

For support or questions:
- Check the setup guides first
- Review Supabase documentation
- Contact the development team
- Create an issue in the repository

## 🎯 Project Status

- ✅ **Frontend**: Complete with beautiful UI/UX
- ✅ **Authentication**: Supabase integration ready
- ✅ **Database**: Schema and tables defined
- ✅ **Responsive**: Mobile-first design
- ✅ **Documentation**: Comprehensive guides
- 🔄 **Deployment**: Ready for production

---

## 🚀 Ready to Deploy?

Your Ganesh Pooja Festival 2025 website is production-ready! Follow these steps:

1. **Complete Supabase setup** → [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. **Deploy to production** → [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Share with your community** → 🎉

**Note**: This is a tentative plan and may change if required. Most events will be held after 7 PM to ensure maximum participation.

---

**Happy Festival! 🕉️🎉**
