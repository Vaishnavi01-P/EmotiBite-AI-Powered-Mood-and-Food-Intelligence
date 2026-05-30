#!/bin/bash

echo "🧠 MoodFood AI - Starting Setup..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python v3.9 or higher."
    exit 1
fi

# Check if MongoDB is running (optional)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. Make sure you have MongoDB running or use MongoDB Atlas."
fi

echo "✅ Prerequisites check passed!"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm run setup

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi

echo ""
echo "🔧 Setting up environment files..."

# Copy environment files if they don't exist
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✅ Created server/.env from template"
fi

if [ ! -f "ai-service/.env" ]; then
    cp ai-service/env.example ai-service/.env
    echo "✅ Created ai-service/.env from template"
fi

echo ""
echo "🚀 Setup complete! You can now start the application:"
echo ""
echo "   npm run dev    # Start all services"
echo ""
echo "   Or start individually:"
echo "   npm run server     # Backend API (port 5000)"
echo "   npm run client     # Frontend (port 3000)"
echo "   npm run ai-service # AI service (port 8000)"
echo ""
echo "📱 Open http://localhost:3000 in your browser"
echo "🔗 API available at http://localhost:5000/api"
echo "🤖 AI service at http://localhost:8000"
echo ""
echo "Happy coding! 🎉"
