#!/bin/bash

# UBAS Financial Trust - Netlify Deployment Script
# Deploy frontend to Netlify with proper configuration

echo "🌊 Deploying UBAS Financial Trust to Netlify..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login to Netlify (if not already logged in)
echo "Please ensure you're logged into Netlify..."
netlify login

# Build the application
echo "Building application..."
npm run build

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod --dir=dist

# Set up environment variables
echo "Setting up environment variables..."
netlify env:set VITE_API_URL "https://ubas-backend.herokuapp.com"
netlify env:set VITE_APP_NAME "UBAS Financial Trust"
netlify env:set VITE_MINIMUM_DEPOSIT "100"
netlify env:set VITE_MINIMUM_WITHDRAWAL "20"
netlify env:set VITE_MAXIMUM_DAILY_TRANSFER "50000"

# Set up custom domain (optional)
echo "To set up a custom domain:"
echo "1. Go to your Netlify dashboard"
echo "2. Select your site"
echo "3. Go to Site settings > Domain management"
echo "4. Add your custom domain (e.g., demo.ubasfintrust.com)"
echo "5. Configure DNS records as instructed"

echo "✅ Frontend deployed to Netlify successfully!"
echo "🔗 Your app will be available at: https://your-site.netlify.app"
