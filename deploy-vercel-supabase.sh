#!/bin/bash

# UBAS Financial Trust - Vercel + Supabase Deployment
# Deploys frontend to Vercel and uses Supabase for backend database

set -e

echo "🚀 UBAS Financial Trust - Vercel + Supabase Deployment"
echo "======================================================"
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

# Check if Vercel CLI is installed
check_vercel() {
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    print_success "Vercel CLI is ready"
}

# Generate security keys
generate_secrets() {
    print_status "Generating security keys..."
    cd server
    npm run generate:secrets
    cd ..
    print_success "Security keys generated"
}

# Create Supabase setup instructions
create_supabase_instructions() {
    cat > SUPABASE_SETUP.md << 'EOF'
# 🗄️ Supabase Database Setup

## **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Choose organization: "Personal"
5. Project name: "ubas-financial-trust"
6. Database password: (generate strong password)
7. Region: Choose closest to your users
8. Click "Create new project"

## **Step 2: Get Database URL**
1. Go to Settings → Database
2. Copy the connection string (URI format)
3. Replace `[YOUR-PASSWORD]` with your actual password
4. Save this URL - you'll need it for deployment

## **Step 3: Run Database Migrations**
```bash
# Set the database URL temporarily
export DATABASE_URL="your_supabase_connection_string_here"

# Run migrations
cd server
npm run migrate

# Verify tables were created
# Go to Supabase dashboard → Table Editor
```

## **Step 4: Create Admin User (Optional)**
```sql
-- Run this in Supabase SQL Editor
INSERT INTO users (
  id, email, password_hash, first_name, last_name, 
  account_type, kyc_status, is_active, created_at
) VALUES (
  gen_random_uuid(),
  'admin@ubasfintrust.com',
  '$2b$12$LQv3c1yqBwEHxv03kBum2uPhcs2TdsL0SBnbI1.LekFwWKImcHXzK', -- password: admin123
  'Admin',
  'User',
  'admin',
  'approved',
  true,
  NOW()
);
```

Your Supabase database is ready! 🎉
EOF

    print_success "Supabase setup instructions created"
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    # Update environment variables for production
    cat > .env.production << 'EOF'
# Production Environment Variables
VITE_API_URL=https://your-backend-url.com/api/v1
VITE_SOCKET_URL=https://your-backend-url.com
VITE_APP_NAME=UBAS Financial Trust
VITE_NODE_ENV=production
VITE_DEMO_MODE=false
VITE_ENABLE_2FA=true
VITE_MINIMUM_DEPOSIT=100
VITE_MINIMUM_WITHDRAWAL=20
VITE_MAXIMUM_DAILY_TRANSFER=50000
EOF

    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    vercel --prod
    
    print_success "Frontend deployed to Vercel!"
}

# Create backend deployment options
create_backend_options() {
    cat > BACKEND_DEPLOYMENT_OPTIONS.md << 'EOF'
# 🔧 Backend Deployment Options

Since Railway has limitations, here are your best options:

## **Option 1: Render (Recommended)**
- ✅ Free tier: 750 hours/month
- ✅ Automatic deployments
- ✅ Built-in PostgreSQL
- ✅ Easy setup

**Steps:**
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create Web Service
4. Build Command: `cd server && npm install && npm run build`
5. Start Command: `cd server && npm start`
6. Add environment variables (see below)

## **Option 2: Heroku**
- ✅ Well-documented
- ✅ Add-ons available
- ❌ No free tier (starts at $5/month)

**Steps:**
```bash
# Install Heroku CLI
npm install -g heroku

# Create app
heroku create ubas-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Deploy
git subtree push --prefix server heroku main
```

## **Option 3: DigitalOcean App Platform**
- ✅ $5/month for basic app
- ✅ Managed database included
- ✅ Good performance

## **Required Environment Variables:**
```bash
NODE_ENV=production
PORT=10000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_generated_jwt_secret
JWT_REFRESH_SECRET=your_generated_refresh_secret
ENCRYPTION_KEY=your_generated_encryption_key
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

## **Optional Environment Variables:**
```bash
# Email notifications
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com

# SMS notifications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```
EOF

    print_success "Backend deployment options created"
}

# Create complete deployment guide
create_deployment_guide() {
    cat > COMPLETE_DEPLOYMENT_GUIDE.md << 'EOF'
# 🚀 Complete Deployment Guide

## **Current Status:**
- ✅ Frontend deployed to Vercel
- ✅ Security keys generated
- ✅ Database setup instructions ready
- ⏳ Backend needs deployment

## **Next Steps:**

### **1. Set up Database (5 minutes)**
Follow instructions in `SUPABASE_SETUP.md`

### **2. Deploy Backend (10 minutes)**
Choose one option from `BACKEND_DEPLOYMENT_OPTIONS.md`

### **3. Connect Frontend to Backend**
Update Vercel environment variables:
- `VITE_API_URL` = your backend URL + `/api/v1`
- `VITE_SOCKET_URL` = your backend URL

### **4. Test Everything**
1. Visit your Vercel URL
2. Register a new user
3. Upload KYC documents
4. Create account and test transactions

## **Recommended Deployment Path:**
1. **Database**: Supabase (free, managed PostgreSQL)
2. **Backend**: Render (free tier, 750 hours/month)
3. **Frontend**: Vercel (already deployed)

## **Total Cost: $0/month** (all free tiers)

## **Support:**
- Check logs in deployment platform dashboards
- Use health check endpoints: `/api/v1/health`
- Test with: `npm run test:simple`

Your banking application will be fully operational! 🎉
EOF

    print_success "Complete deployment guide created"
}

main() {
    print_status "Setting up Vercel + Supabase deployment..."
    
    # Check dependencies
    check_vercel
    
    # Generate security keys
    generate_secrets
    
    # Create Supabase instructions
    create_supabase_instructions
    
    # Deploy frontend
    deploy_frontend
    
    # Create backend options
    create_backend_options
    
    # Create deployment guide
    create_deployment_guide
    
    echo ""
    print_success "🎉 Deployment setup complete!"
    echo ""
    print_status "What's been done:"
    echo "✅ Frontend deployed to Vercel"
    echo "✅ Security keys generated"
    echo "✅ Database setup guide created"
    echo "✅ Backend deployment options provided"
    echo ""
    print_status "Next steps:"
    echo "1. Set up Supabase database (follow SUPABASE_SETUP.md)"
    echo "2. Deploy backend to Render (follow BACKEND_DEPLOYMENT_OPTIONS.md)"
    echo "3. Update Vercel environment variables"
    echo "4. Test your live banking application!"
    echo ""
    print_success "Your banking app will be live soon! 🚀"
}

main "$@"
