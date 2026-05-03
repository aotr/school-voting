#!/bin/bash

# Voter App Setup Script for macOS/Linux

echo "=== Voter App - Electron Setup ==="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js installed: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Create database directory
mkdir -p database

echo "✓ Database directory created"
echo ""

echo "=== Setup Complete! ==="
echo ""
echo "Commands:"
echo "  npm start    - Run development version"
echo "  npm run dev  - Run with developer tools"
echo "  npm run build:mac - Build for macOS"
echo "  npm run build:win - Build for Windows"
echo "  npm run build:all - Build for both platforms"
echo ""
echo "To get started, run: npm start"
