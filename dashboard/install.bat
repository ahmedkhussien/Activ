@echo off
echo 🚀 Installing ActivityWatch Dashboard...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Create environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating environment configuration...
    echo VITE_API_BASE_URL=http://localhost:5600 > .env
    echo VITE_WS_URL=ws://localhost:5600 >> .env
    echo VITE_APP_TITLE=ActivityWatch Dashboard >> .env
    echo ✅ Environment file created
) else (
    echo ✅ Environment file already exists
)

REM Build the project
echo 🔨 Building the project...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully

echo.
echo 🎉 ActivityWatch Dashboard installation completed!
echo.
echo 📋 Next steps:
echo    1. Make sure ActivityWatch server is running on port 5600
echo    2. Start the development server: npm run dev
echo    3. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
echo.
echo 🔧 Available commands:
echo    npm run dev     - Start development server
echo    npm run build   - Build for production
echo    npm run preview - Preview production build
echo    npm run lint    - Run ESLint
echo.
pause
