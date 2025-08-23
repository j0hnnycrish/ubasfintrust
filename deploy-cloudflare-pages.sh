#!/bin/bash

# Cloudflare Pages Deployment Script
# This script builds and deploys the frontend to Cloudflare Pages

set -e

echo "🚀 Starting Cloudflare Pages deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project for production..."
npm run build

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found."
    exit 1
fi

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name ubas-financial-trust --compatibility-date 2024-01-01

echo "🎉 Deployment completed!"
echo "📝 Your site should be available at: https://ubas-financial-trust.pages.dev"
echo "💡 To set environment variables, visit: https://dash.cloudflare.com/pages"