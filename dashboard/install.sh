#!/bin/bash

# ActivityWatch Dashboard Installation Script

echo "🚀 Installing ActivityWatch Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment configuration..."
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5600
VITE_WS_URL=ws://localhost:5600
VITE_APP_TITLE=ActivityWatch Dashboard
EOF
    echo "✅ Environment file created"
else
    echo "✅ Environment file already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

echo ""
echo "🎉 ActivityWatch Dashboard installation completed!"
echo ""
echo "📋 Next steps:"
echo "   1. Make sure ActivityWatch server is running on port 5600"
echo "   2. Start the development server: npm run dev"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "🔧 Available commands:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run preview - Preview production build"
echo "   npm run lint    - Run ESLint"
echo ""
