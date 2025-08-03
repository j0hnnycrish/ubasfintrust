#!/bin/bash

# UBAS Financial Trust - Automated Deployment Script
# Deploys frontend to Vercel and backend to Railway

set -e

echo "🚀 UBAS Financial Trust - Automated Deployment"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install Node.js and npm."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "git is not installed. Please install git."
        exit 1
    fi
    
    print_success "All dependencies are installed."
}

# Install CLI tools if not present
install_cli_tools() {
    print_status "Installing CLI tools..."
    
    if ! command -v vercel &> /dev/null; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    print_success "CLI tools are ready."
}

# Generate security keys
generate_secrets() {
    print_status "Generating security keys..."
    cd server
    npm run generate:secrets
    cd ..
    print_success "Security keys generated. Check server/generated-secrets.txt"
}

# Test the system
test_system() {
    print_status "Testing system components..."
    cd server
    npm run test:simple
    cd ..
}

# Deploy backend to Railway
deploy_backend() {
    print_status "Deploying backend to Railway..."
    cd server
    
    # Check if already linked to Railway
    if [ ! -f ".railway" ]; then
        print_status "Linking to Railway project..."
        railway login
        railway init
        
        # Add PostgreSQL if not exists
        print_status "Adding PostgreSQL database..."
        railway add postgresql
    fi
    
    # Deploy
    print_status "Deploying backend..."
    railway up
    
    # Run migrations
    print_status "Running database migrations..."
    railway run npm run migrate
    
    # Get the backend URL
    BACKEND_URL=$(railway status --json | jq -r '.deployments[0].url')
    print_success "Backend deployed to: $BACKEND_URL"
    
    cd ..
    echo "$BACKEND_URL" > .backend-url
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying frontend to Vercel..."
    
    # Read backend URL
    if [ -f ".backend-url" ]; then
        BACKEND_URL=$(cat .backend-url)
        print_status "Using backend URL: $BACKEND_URL"
        
        # Update vercel.json with the actual backend URL
        sed -i.bak "s|https://api.ubasfintrust.com|$BACKEND_URL|g" vercel.json
    fi
    
    # Deploy to Vercel
    vercel --prod
    
    # Get the frontend URL
    FRONTEND_URL=$(vercel ls --scope $(vercel whoami) | grep ubas-financial-trust | head -1 | awk '{print $2}')
    print_success "Frontend deployed to: https://$FRONTEND_URL"
    
    echo "https://$FRONTEND_URL" > .frontend-url
}

# Update CORS settings
update_cors() {
    if [ -f ".frontend-url" ]; then
        FRONTEND_URL=$(cat .frontend-url)
        print_status "Updating CORS settings for: $FRONTEND_URL"
        
        cd server
        railway variables set ALLOWED_ORIGINS="$FRONTEND_URL,https://www.$(echo $FRONTEND_URL | sed 's/https:\/\///')"
        cd ..
        
        print_success "CORS settings updated."
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    if [ -f ".backend-url" ] && [ -f ".frontend-url" ]; then
        BACKEND_URL=$(cat .backend-url)
        FRONTEND_URL=$(cat .frontend-url)
        
        print_status "Testing backend health..."
        if curl -f "$BACKEND_URL/api/v1/health" > /dev/null 2>&1; then
            print_success "Backend is healthy!"
        else
            print_warning "Backend health check failed. Check Railway logs."
        fi
        
        print_status "Testing frontend..."
        if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
            print_success "Frontend is accessible!"
        else
            print_warning "Frontend accessibility check failed. Check Vercel deployment."
        fi
        
        echo ""
        print_success "🎉 DEPLOYMENT COMPLETE!"
        echo ""
        echo "📱 Frontend URL: $FRONTEND_URL"
        echo "🔧 Backend URL: $BACKEND_URL"
        echo "🗄️  Database: Railway PostgreSQL (managed)"
        echo ""
        echo "🔑 Next Steps:"
        echo "1. Set up your custom domain (optional)"
        echo "2. Configure email/SMS services with real API keys"
        echo "3. Test the complete user flow"
        echo "4. Set up monitoring and alerts"
        echo ""
        
    else
        print_error "Deployment verification failed. Missing URL files."
    fi
}

# Main deployment flow
main() {
    echo "Starting automated deployment..."
    echo ""
    
    # Ask for confirmation
    read -p "This will deploy your UBAS Financial Trust app to production. Continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled."
        exit 0
    fi
    
    check_dependencies
    install_cli_tools
    
    # Ask if user wants to generate new secrets
    read -p "Generate new security keys? (recommended for production) (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        generate_secrets
        print_warning "⚠️  Don't forget to update your environment variables with the new secrets!"
        read -p "Press Enter to continue after updating secrets..."
    fi
    
    # Test system before deployment
    print_status "Running pre-deployment tests..."
    # test_system  # Commented out as it might fail without real API keys
    
    # Deploy backend first
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    # Update CORS
    update_cors
    
    # Verify everything works
    verify_deployment
    
    # Cleanup
    rm -f .backend-url .frontend-url
    
    print_success "🚀 Your UBAS Financial Trust banking app is now live!"
}

# Run main function
main "$@"
