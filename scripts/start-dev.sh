#!/bin/bash

echo "🚀 Starting Ganesh Pooja Development Server..."

# Kill any process using port 3000
echo "🔧 Checking if port 3000 is free..."
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is busy. Killing existing process..."
    lsof -ti:3000 | xargs kill -9
    sleep 2
fi

# Kill any process using port 3001 (in case it was used before)
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "⚠️  Port 3001 is busy. Killing existing process..."
    lsof -ti:3001 | xargs kill -9
    sleep 1
fi

# Verify port 3000 is free
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "❌ Failed to free port 3000. Please check manually."
    exit 1
fi

echo "✅ Port 3000 is now free!"

# Start the development server on port 3000
echo "🚀 Starting server on port 3000..."
PORT=3000 npm run dev
