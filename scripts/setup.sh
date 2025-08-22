#!/bin/bash

echo "🚀 Ganesh Pooja 2025 - Quick Setup Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file template
echo "🔧 Creating environment file template..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# Supabase Configuration
# Copy your values from SUPABASE_SETUP.md
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
NEXT_PUBLIC_APP_NAME="Ganesh Pooja 2025"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Analytics
# NEXT_PUBLIC_GA_ID=your-google-analytics-id
EOF
    echo "✅ Created .env.local template"
    echo "⚠️  Please update .env.local with your Supabase credentials"
else
    echo "ℹ️  .env.local already exists"
fi

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "🔒 Creating .gitignore file..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
EOF
    echo "✅ Created .gitignore file"
fi

# Check if development server can start
echo "🔍 Testing build process..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please check for errors above."
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Follow SUPABASE_SETUP.md to create your Supabase project"
echo "2. Update .env.local with your Supabase credentials"
echo "3. Run 'npm run dev' to start development server"
echo "4. Follow DEPLOYMENT.md when ready to deploy"
echo ""
echo "📚 Documentation:"
echo "• SUPABASE_SETUP.md - Complete Supabase setup guide"
echo "• DEPLOYMENT.md - Production deployment guide"
echo "• README.md - Project overview and features"
echo ""
echo "🚀 Happy coding! 🕉️"

