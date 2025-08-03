#!/bin/bash

# UBAS Financial Trust - Clean Build for cPanel
# Creates a deployment package without problematic .htaccess

echo "🏗️  Building clean package for cPanel deployment..."

# Build the application
echo "Building React application..."
npm run build

# Remove problematic .htaccess if it exists
if [ -f "dist/.htaccess" ]; then
    echo "Removing problematic .htaccess..."
    rm dist/.htaccess
fi

# Create minimal .htaccess for React Router
echo "Creating safe .htaccess..."
cat > dist/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
AddDefaultCharset UTF-8
ErrorDocument 404 /index.html
EOF

# Create deployment package
echo "Creating deployment package..."
cd dist
zip -r ../ubas-cpanel-clean.zip .
cd ..

echo "✅ Clean deployment package created!"
echo ""
echo "📦 Package: ubas-cpanel-clean.zip"
echo ""
echo "📋 Upload Instructions:"
echo "1. Login to your cPanel"
echo "2. Go to File Manager"
echo "3. Navigate to public_html (or your domain folder)"
echo "4. DELETE any existing files from previous upload"
echo "5. Upload ubas-cpanel-clean.zip"
echo "6. Extract the zip file"
echo "7. Delete the zip file after extraction"
echo ""
echo "🔧 If you still get errors:"
echo "1. Delete the .htaccess file and test"
echo "2. Check if mod_rewrite is enabled on your hosting"
echo "3. Contact your hosting provider about the error"
echo ""
echo "📁 Files in package:"
ls -la dist/
