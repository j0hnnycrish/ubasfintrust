#!/bin/bash

# UBAS Financial Trust - Build Fix Script
# Fixes common build issues and updates dependencies

echo "🔧 Fixing build issues for UBAS Financial Trust..."

# Update browserslist data
echo "📊 Updating browserslist data..."
npx update-browserslist-db@latest

# Clear node modules and reinstall if needed
if [ "$1" = "--clean" ]; then
    echo "🧹 Cleaning node_modules..."
    rm -rf node_modules
    rm -f package-lock.json
    npm install
fi

# Clear Vite cache
echo "🗑️  Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf dist

# Check for TypeScript errors
echo "🔍 Checking TypeScript..."
npx tsc --noEmit

# Try to build
echo "🏗️  Building application..."
npm run build

echo "✅ Build fix completed!"
echo ""
echo "If you still have issues, try:"
echo "1. npm run dev --force"
echo "2. ./scripts/fix-build.sh --clean"
echo "3. Check for any remaining syntax errors"
