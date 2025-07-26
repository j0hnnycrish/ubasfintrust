#!/bin/bash

# UBAS Financial Trust - Vercel Deployment Script
# Deploy frontend to Vercel with proper configuration

echo "🚀 Deploying UBAS Financial Trust to Vercel..."

# Clear npm cache to avoid workspace issues
echo "Clearing npm cache..."
npm cache clean --force

# Try different methods to get Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."

    # Method 1: Try with yarn if available
    if command -v yarn &> /dev/null; then
        echo "Using yarn to install Vercel CLI..."
        yarn global add vercel
    else
        # Method 2: Use npx (no global install needed)
        echo "Using npx for Vercel CLI..."
        alias vercel="npx vercel"
    fi
fi

# Login to Vercel (if not already logged in)
echo "Please ensure you're logged into Vercel..."
npx vercel login

# Set environment variables for production
echo "Setting up environment variables..."

# Create .env.local for Vercel
cat > .env.local << EOF
VITE_API_URL=https://ubas-backend.herokuapp.com
VITE_APP_NAME=UBAS Financial Trust
VITE_MINIMUM_DEPOSIT=100
VITE_MINIMUM_WITHDRAWAL=20
VITE_MAXIMUM_DAILY_TRANSFER=50000
EOF

# Build the application
echo "Building application..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel --prod

# Set up custom domain (optional)
echo "To set up a custom domain:"
echo "1. Go to your Vercel dashboard"
echo "2. Select your project"
echo "3. Go to Settings > Domains"
echo "4. Add your custom domain (e.g., demo.ubasfintrust.com)"

echo "✅ Frontend deployed to Vercel successfully!"
echo "🔗 Your app will be available at: https://your-project.vercel.app"
