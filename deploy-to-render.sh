#!/bin/bash

# UBAS Financial Trust - Render Deployment Script
# Deploys both frontend and backend to Render with PostgreSQL

set -e

echo "🚀 UBAS Financial Trust - Render Deployment"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create render.yaml for automatic deployment
create_render_config() {
    print_status "Creating Render configuration..."
    
    cat > render.yaml << 'EOF'
services:
  # Backend API Service
  - type: web
    name: ubas-backend
    env: node
    plan: free
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && npm start
    healthCheckPath: /api/v1/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: API_VERSION
        value: v1
      - key: DATABASE_URL
        fromDatabase:
          name: ubas-database
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: ENCRYPTION_KEY
        generateValue: true
      - key: ALLOWED_ORIGINS
        value: https://ubas-frontend.onrender.com
      - key: UPLOAD_PATH
        value: /opt/render/project/src/uploads
      - key: MAX_FILE_SIZE
        value: 5242880
      - key: ALLOWED_FILE_TYPES
        value: jpg,jpeg,png,pdf
      - key: MINIMUM_DEPOSIT
        value: 100
      - key: MINIMUM_WITHDRAWAL
        value: 20
      - key: MAXIMUM_DAILY_TRANSFER
        value: 50000
      - key: DEMO_MODE
        value: false

  # Frontend Static Site
  - type: static
    name: ubas-frontend
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    pullRequestPreviewsEnabled: false
    envVars:
      - key: VITE_API_URL
        value: https://ubas-backend.onrender.com/api/v1
      - key: VITE_SOCKET_URL
        value: https://ubas-backend.onrender.com
      - key: VITE_APP_NAME
        value: UBAS Financial Trust
      - key: VITE_NODE_ENV
        value: production
      - key: VITE_DEMO_MODE
        value: false
      - key: VITE_ENABLE_2FA
        value: true
      - key: VITE_MINIMUM_DEPOSIT
        value: 100
      - key: VITE_MINIMUM_WITHDRAWAL
        value: 20
      - key: VITE_MAXIMUM_DAILY_TRANSFER
        value: 50000

# Database
databases:
  - name: ubas-database
    databaseName: ubas_financial_trust
    user: ubas_admin
    plan: free
EOF

    print_success "Render configuration created!"
}

# Generate security keys
generate_secrets() {
    print_status "Generating security keys..."
    cd server
    npm run generate:secrets
    cd ..
    print_success "Security keys generated. Check server/generated-secrets.txt"
}

# Create deployment instructions
create_instructions() {
    cat > RENDER_DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# 🚀 UBAS Financial Trust - Render Deployment Instructions

## ✅ **AUTOMATIC DEPLOYMENT SETUP**

Your `render.yaml` file has been created! Follow these steps:

### **Step 1: Push to GitHub**
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### **Step 2: Deploy to Render**
1. Go to [render.com](https://render.com)
2. Sign up/login with your GitHub account
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Select this repository
6. Click "Apply"

### **Step 3: Wait for Deployment**
- Backend will deploy to: `https://ubas-backend.onrender.com`
- Frontend will deploy to: `https://ubas-frontend.onrender.com`
- Database will be created automatically

### **Step 4: Run Database Migrations**
After backend deployment:
1. Go to Render dashboard
2. Click on "ubas-backend" service
3. Go to "Shell" tab
4. Run: `npm run migrate`

### **Step 5: Test Your Application**
- Visit: `https://ubas-frontend.onrender.com`
- Register a new user
- Test KYC upload
- Test transactions

## 🔧 **MANUAL ENVIRONMENT VARIABLES**

If you need to add custom environment variables:

### **Backend Service:**
- `SENDGRID_API_KEY` - For email notifications
- `TWILIO_ACCOUNT_SID` - For SMS notifications
- `TWILIO_AUTH_TOKEN` - For SMS notifications
- `TWILIO_PHONE_NUMBER` - For SMS notifications

### **Frontend Service:**
- `VITE_GOOGLE_ANALYTICS_ID` - For analytics
- `VITE_SENTRY_DSN` - For error tracking

## 🎉 **DEPLOYMENT COMPLETE!**

Your banking application will be live at:
- **Frontend**: https://ubas-frontend.onrender.com
- **Backend**: https://ubas-backend.onrender.com
- **Database**: Managed PostgreSQL (automatic)

**Free tier includes:**
- ✅ 750 hours/month (enough for 24/7 operation)
- ✅ Automatic SSL certificates
- ✅ PostgreSQL database with 1GB storage
- ✅ Automatic deployments from GitHub
- ✅ Built-in monitoring and logs

EOF

    print_success "Deployment instructions created!"
}

main() {
    print_status "Setting up Render deployment for UBAS Financial Trust..."
    
    # Generate security keys
    generate_secrets
    
    # Create Render configuration
    create_render_config
    
    # Create instructions
    create_instructions
    
    echo ""
    print_success "🎉 Render deployment setup complete!"
    echo ""
    print_status "Next steps:"
    echo "1. Review the generated render.yaml file"
    echo "2. Commit and push to GitHub: git add . && git commit -m 'Add Render config' && git push"
    echo "3. Go to render.com and deploy using Blueprint"
    echo "4. Follow instructions in RENDER_DEPLOYMENT_INSTRUCTIONS.md"
    echo ""
    print_success "Your banking app will be live in ~5-10 minutes!"
}

main "$@"
