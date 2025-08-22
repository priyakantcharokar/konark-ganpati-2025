# 🚀 Deployment Guide - Ganesh Pooja Festival 2025

This guide will walk you through deploying your festival website to production with proper configuration and best practices.

## 📋 Prerequisites

- ✅ Supabase project set up (follow SUPABASE_SETUP.md)
- ✅ Environment variables configured
- ✅ Database tables created
- ✅ Authentication working locally

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Free & Easy)

#### Step 1: Prepare Your Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Ganesh Pooja Festival 2025"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/ganesh-pooja-2025.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel
1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Import Project** from your GitHub repository
4. **Configure Project**:
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

#### Step 3: Environment Variables
In Vercel project settings, add these environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_NAME="Ganesh Pooja 2025"
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

#### Step 4: Deploy
- Click **Deploy**
- Wait for build to complete
- Your site is live! 🎉

### Option 2: Netlify

#### Step 1: Build Locally
```bash
npm run build
```

#### Step 2: Deploy to Netlify
1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login**
3. **Drag & Drop** your `.next` folder
4. **Configure** environment variables
5. **Deploy**

### Option 3: Railway

#### Step 1: Prepare for Railway
```bash
# Add railway.json configuration
echo '{
  "build": {
    "builder": "NIXPACKS"
  }
}' > railway.json
```

#### Step 2: Deploy
1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub repository**
3. **Configure** environment variables
4. **Deploy**

## 🔧 Production Configuration

### 1. Update Environment Variables

Create `.env.production` file:
```env
# Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_NAME="Ganesh Pooja Festival 2025"
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 2. Update Supabase Settings

#### Production URL Configuration
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Add your production domain to **Additional Redirect URLs**:
   ```
   https://your-domain.com/auth/callback
   https://your-domain.com/auth/confirm
   ```

#### CORS Configuration
1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Add your production domain to **CORS Origins**:
   ```
   https://your-domain.com
   ```

### 3. Custom Domain Setup

#### Vercel Custom Domain
1. Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for DNS propagation (up to 48 hours)

#### SSL Certificate
- Vercel provides free SSL automatically
- Other platforms may require manual SSL setup

## 📱 Mobile Optimization

### PWA Configuration
Add to `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // PWA Configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### Mobile Testing
- Test on various devices
- Use Chrome DevTools Device Simulation
- Test touch interactions
- Verify responsive breakpoints

## 🔒 Security Configuration

### 1. Content Security Policy
Add to `next.config.js`:
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;"
          }
        ]
      }
    ]
  }
}
```

### 2. Environment Variable Security
- ✅ Never commit `.env.local` to git
- ✅ Use different keys for development/production
- ✅ Rotate keys regularly
- ✅ Monitor for unauthorized access

### 3. Supabase Security
- Enable Row Level Security (already done)
- Monitor authentication logs
- Set up alerts for suspicious activity
- Regular security audits

## 📊 Analytics & Monitoring

### 1. Google Analytics
Add to `app/layout.tsx`:
```typescript
// Add Google Analytics script
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### 2. Supabase Monitoring
- Set up alerts for:
  - High error rates
  - Failed authentication attempts
  - Database performance issues
  - Storage usage

### 3. Performance Monitoring
- Use Vercel Analytics (if on Vercel)
- Monitor Core Web Vitals
- Track user engagement
- Monitor load times

## 🚀 Performance Optimization

### 1. Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/ganpati-idol.jpg"
  alt="Ganpati Idol"
  width={400}
  height={300}
  priority
/>
```

### 2. Code Splitting
- Components are already optimized
- Lazy load non-critical components
- Use dynamic imports for heavy libraries

### 3. Caching Strategy
```typescript
// Add caching headers
export async function generateStaticParams() {
  return []
}

export const revalidate = 3600 // Revalidate every hour
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📱 Post-Deployment Checklist

### ✅ Technical Checks
- [ ] Website loads correctly
- [ ] Authentication works
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] SSL certificate active
- [ ] DNS propagated

### ✅ User Experience Checks
- [ ] Flat selection works
- [ ] Phone verification functional
- [ ] Event schedule displays
- [ ] Search and filters work
- [ ] Logout functions properly
- [ ] Error handling graceful

### ✅ Security Checks
- [ ] Environment variables secure
- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Authentication logs monitored
- [ ] Database access restricted

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

#### Environment Variables
- Verify all required variables are set
- Check for typos in variable names
- Ensure variables are accessible in build

#### Supabase Connection
- Verify project URL and keys
- Check CORS configuration
- Monitor authentication logs

#### Performance Issues
- Enable Next.js analytics
- Monitor Core Web Vitals
- Optimize images and assets
- Use CDN for static assets

## 📞 Support & Maintenance

### Regular Maintenance
- **Weekly**: Check error logs
- **Monthly**: Update dependencies
- **Quarterly**: Security audit
- **Annually**: Performance review

### Monitoring Tools
- **Vercel Analytics** (if on Vercel)
- **Supabase Dashboard**
- **Google Analytics**
- **Browser DevTools**

### Backup Strategy
- **Code**: GitHub repository
- **Database**: Supabase backups
- **Environment**: Document all variables
- **Configuration**: Version control

---

## 🎉 Congratulations!

Your Ganesh Pooja Festival 2025 website is now live in production! 

**Next Steps:**
1. Share the website with your community
2. Monitor user engagement
3. Gather feedback for improvements
4. Plan for future festivals

**Need Help?** 
- Check the troubleshooting section
- Review Supabase documentation
- Contact the development team
- Create GitHub issues for bugs

**Happy Festival! 🕉️🎉**

