#!/bin/bash

# UBAS Financial Trust - cPanel Deployment Script
# Deploy frontend build files to shared hosting via cPanel

echo "🏠 Preparing UBAS Financial Trust for cPanel deployment..."

# Create production build
echo "Building application for production..."
npm run build

# Create deployment package
echo "Creating deployment package..."
cd dist
zip -r ../ubas-financial-trust-cpanel.zip .
cd ..

echo "📦 Deployment package created: ubas-financial-trust-cpanel.zip"
echo ""
echo "📋 cPanel Deployment Instructions:"
echo "=================================="
echo ""
echo "1. Login to your cPanel account"
echo "2. Go to File Manager"
echo "3. Navigate to public_html (or your domain folder)"
echo "4. Upload ubas-financial-trust-cpanel.zip"
echo "5. Extract the zip file"
echo "6. Delete the zip file after extraction"
echo ""
echo "⚠️  IMPORTANT LIMITATIONS:"
echo "- Frontend only (no backend/database)"
echo "- Limited functionality without API"
echo "- Consider upgrading to VPS hosting for full features"
echo ""
echo "🔧 Required cPanel Features:"
echo "- PHP 8.0+ (for any server-side scripts)"
echo "- SSL Certificate (for HTTPS)"
echo "- Custom error pages support"
echo ""
echo "📁 Files to upload to public_html:"
echo "- All files from the 'dist' folder"
echo "- .htaccess file for URL rewriting"

# Create .htaccess file for cPanel
cat > .htaccess << 'EOF'
# UBAS Financial Trust - Apache Configuration for cPanel
# Enable URL rewriting for Single Page Application

RewriteEngine On

# Security headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
</FilesMatch>

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Redirect HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Block access to sensitive files
<Files ".env*">
    Order allow,deny
    Deny from all
</Files>

<Files "*.config.*">
    Order allow,deny
    Deny from all
</Files>

# Custom error pages
ErrorDocument 404 /index.html
ErrorDocument 500 /index.html
EOF

echo ""
echo "✅ .htaccess file created for Apache/cPanel"
echo "📤 Upload this file along with your build files"
