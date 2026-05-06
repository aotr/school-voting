@echo off
REM Voter App Setup Script for Windows

echo.
echo === Voter App - Electron Setup ===
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo + Node.js installed: %NODE_VERSION%
echo.

REM Install dependencies
echo Install dependencies...
call npm install

if errorlevel 1 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)

echo + Dependencies installed
echo.

REM Create database directory
if not exist "database" mkdir database

echo + Database directory created
echo.

echo === Setup Complete! ===
echo.
echo Commands:
echo   npm start    - Run development version
echo   npm run dev  - Run with developer tools
echo   npm run build:win - Build Windows installer
echo   npm run build:mac - Build for macOS
echo   npm run build:all - Build for both platforms
echo.
echo To get started, run: npm start
echo.
pause
