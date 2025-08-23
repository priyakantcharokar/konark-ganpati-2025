@echo off
echo 🚀 Starting Ganesh Pooja Development Server...

echo 🔧 Checking if port 3000 is free...

REM Kill any process using port 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo ⚠️  Port 3000 is busy. Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
)

REM Kill any process using port 3001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo ⚠️  Port 3001 is busy. Killing process %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo ✅ Ports are now free!

echo 🚀 Starting server on port 3000...
set PORT=3000
npm run dev
