# 🔧 Environment Variables Setup

## 📝 **Create `.env.local` File**

Create a new file called `.env.local` in your project root directory and add the following content:

```bash
# Supabase Configuration
# Replace these placeholder values with your actual Supabase credentials

# Your Supabase project URL (looks like: https://abcdefghijklmnop.supabase.co)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase anon/public key (starts with eyJ...)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Your Supabase service role key (starts with eyJ..., keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_NAME="Konark Exotica - Ganesh Pooja 2025"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🎯 **How to Get Your Supabase Values**

### **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Create new organization (free)
4. Create new project: "ganesh-pooja-2025"

### **Step 2: Get Your Credentials**
1. Once project is created, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: Copy the "Project URL" field
   - **anon key**: Copy the "anon public" key (starts with `eyJ...`)
   - **service role key**: Copy the "service_role" key (starts with `eyJ...`)

### **Step 3: Update .env.local**
1. Replace the placeholder values in your `.env.local` file
2. Save the file
3. **Restart your development server** (`npm run dev`)

## ⚠️ **Important Notes**

- **Never commit** `.env.local` to Git (it's already in `.gitignore`)
- **Keep service role key secret** - don't share it publicly
- **Restart dev server** after changing environment variables
- **Check terminal** for any configuration warnings

## 🧪 **Test Your Setup**

After setting up `.env.local`:

1. **Start your app**: `npm run dev`
2. **Check terminal** - should see no Supabase warnings
3. **Make a test booking** to verify database connection
4. **Check Supabase dashboard** - should see your booking

## 🚨 **Troubleshooting**

### **"Supabase not configured" Error**
- Check `.env.local` file exists
- Verify variable names are exactly as shown
- Restart development server

### **Database Connection Failed**
- Verify Supabase project is active
- Check API keys are correct
- Ensure tables are created with correct schema

---

**🎉 Once you've set up `.env.local`, your app will be fully connected to Supabase!**
