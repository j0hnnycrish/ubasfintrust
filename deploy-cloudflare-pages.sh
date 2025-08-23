#!/bin/bash

# Cloudflare Pages Deployment Script
# This script deploys the frontend to Cloudflare Pages without building

set -e

echo "🚀 Starting Cloudflare Pages deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies (skip if already installed)
echo "📦 Installing dependencies..."
npm install

# Deploy to Cloudflare Pages without building
echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy .

echo "🎉 Deployment completed!"
echo "📝 Your site should be available at: https://pages.cloudflare.com/$(basename $(pwd))"