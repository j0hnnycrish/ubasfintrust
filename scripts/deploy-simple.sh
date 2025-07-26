#!/bin/bash

# UBAS Financial Trust - Simple Deployment Script
# Multiple deployment options without global npm installs

echo "🏦 UBAS Financial Trust - Simple Deployment Options"
echo "=================================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Clear npm cache first
echo "🧹 Clearing npm cache..."
npm cache clean --force

echo ""
echo "Choose your deployment method:"
echo "1. Vercel (using npx - no global install)"
echo "2. Netlify (using npx - no global install)"
echo "3. Build for manual upload (cPanel/FTP)"
echo "4. GitHub Pages"
echo "5. Surge.sh (simple static hosting)"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        
        # Build the application
        echo "Building application..."
        npm run build
        
        # Deploy using npx (no global install needed)
        echo "Deploying to Vercel..."
        npx vercel --prod
        
        echo "✅ Deployment complete!"
        echo "🔗 Your app will be available at the URL shown above"
        ;;
        
    2)
        echo "🌊 Deploying to Netlify..."
        
        # Build the application
        echo "Building application..."
        npm run build
        
        # Deploy using npx
        echo "Deploying to Netlify..."
        npx netlify-cli deploy --prod --dir=dist
        
        echo "✅ Deployment complete!"
        ;;
        
    3)
        echo "📦 Building for manual upload..."
        
        # Build the application
        npm run build
        
        # Create deployment package
        cd dist
        zip -r ../ubas-financial-trust-static.zip .
        cd ..
        
        # Create .htaccess for Apache servers
        cat > dist/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
EOF
        
        echo "✅ Build complete!"
        echo "📁 Files ready in 'dist' folder"
        echo "📦 Zip package: ubas-financial-trust-static.zip"
        echo ""
        echo "📋 Upload Instructions:"
        echo "1. Upload all files from 'dist' folder to your web server"
        echo "2. Make sure .htaccess is uploaded (for Apache servers)"
        echo "3. Point your domain to the uploaded files"
        ;;
        
    4)
        echo "📚 Deploying to GitHub Pages..."
        
        # Check if gh-pages is installed
        if ! npm list gh-pages >/dev/null 2>&1; then
            echo "Installing gh-pages..."
            npm install --save-dev gh-pages
        fi
        
        # Build and deploy
        npm run build
        npx gh-pages -d dist
        
        echo "✅ Deployment complete!"
        echo "🔗 Your app will be available at: https://yourusername.github.io/repository-name"
        ;;
        
    5)
        echo "⚡ Deploying to Surge.sh..."
        
        # Build the application
        npm run build
        
        # Deploy using npx
        cd dist
        npx surge . --domain ubas-financial-trust.surge.sh
        cd ..
        
        echo "✅ Deployment complete!"
        echo "🔗 Your app is available at: https://ubas-financial-trust.surge.sh"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Test your deployed application"
echo "2. Set up a custom domain (optional)"
echo "3. Configure SSL certificate (if not automatic)"
echo "4. Create demo accounts for clients"
echo ""
echo "⚠️  Note: This is frontend-only deployment."
echo "For full banking features, you'll need backend hosting too."
