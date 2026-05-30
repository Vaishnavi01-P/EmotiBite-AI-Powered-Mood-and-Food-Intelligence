@echo off
echo 🧠 MoodFood AI - Starting Setup...
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python v3.9 or higher.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm run setup

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies. Please check the error messages above.
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

REM Copy environment files if they don't exist
if not exist "server\.env" (
    copy "server\env.example" "server\.env" >nul
    echo ✅ Created server\.env from template
)

if not exist "ai-service\.env" (
    copy "ai-service\env.example" "ai-service\.env" >nul
    echo ✅ Created ai-service\.env from template
)

echo.
echo 🚀 Setup complete! You can now start the application:
echo.
echo    npm run dev    # Start all services
echo.
echo    Or start individually:
echo    npm run server     # Backend API (port 5000)
echo    npm run client     # Frontend (port 3000)
echo    npm run ai-service # AI service (port 8000)
echo.
echo 📱 Open http://localhost:3000 in your browser
echo 🔗 API available at http://localhost:5000/api
echo 🤖 AI service at http://localhost:8000
echo.
echo Happy coding! 🎉
pause
