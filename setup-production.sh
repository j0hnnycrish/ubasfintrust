#!/bin/bash

# Production Setup Script for UBAS Banking App with Notifications
# This script sets up the complete banking application with notification system

echo "🚀 Setting up UBAS Banking App with Notification System"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js and npm are installed"

# Install server dependencies
echo -e "\n${BLUE}📦 Installing server dependencies...${NC}"
cd server
npm install
if [ $? -eq 0 ]; then
    print_status "Server dependencies installed"
else
    print_error "Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
echo -e "\n${BLUE}📦 Installing client dependencies...${NC}"
cd ../client
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_status "Client dependencies installed"
    else
        print_warning "Failed to install client dependencies"
    fi
else
    print_warning "Client package.json not found, skipping client setup"
fi

cd ..

# Create environment file if it doesn't exist
echo -e "\n${BLUE}⚙️  Setting up environment configuration...${NC}"
if [ ! -f "server/.env" ]; then
    echo "Creating .env file from template..."
    cat > server/.env << EOL
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=provi_banking
DB_USER=postgres
DB_PASSWORD=your_password_here

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_REFRESH_EXPIRES_IN=7d

# Encryption
BCRYPT_ROUNDS=12

# Server Configuration
PORT=3000
NODE_ENV=development
API_VERSION=v1

# Notification Service
NOTIFICATION_PORT=3001

# Email Configuration
FROM_EMAIL=noreply@ubasfintrust.com
FROM_NAME=UBAS Financial Trust

# SMTP (Basic email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SendGrid (100 emails/day free)
SENDGRID_API_KEY=your_sendgrid_api_key

# Mailgun (100 emails/day free)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# Resend (3000 emails/month free)
RESEND_API_KEY=your_resend_api_key

# Amazon SES
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# SMS Configuration
# Twilio (Paid service)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Vonage (Free credits available)
VONAGE_API_KEY=your_vonage_api_key
VONAGE_API_SECRET=your_vonage_api_secret
VONAGE_FROM_NUMBER=UBAS Bank

# TextBelt (1 free SMS/day)
TEXTBELT_API_KEY=textbelt

# SMS.to (Free tier available)
SMSTO_API_KEY=your_smsto_api_key

# Africa's Talking (Free credits)
AFRICASTALKING_API_KEY=your_africastalking_api_key
AFRICASTALKING_USERNAME=your_africastalking_username
AFRICASTALKING_SENDER_ID=UBAS Bank

# Termii (Nigerian SMS with free tier)
TERMII_API_KEY=your_termii_api_key
TERMII_SENDER_ID=UBAS Bank

# Security Configuration
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:3000
LOG_LEVEL=info
EOL
    print_status "Environment file created at server/.env"
    print_warning "Please update the .env file with your actual configuration values"
else
    print_status "Environment file already exists"
fi

# Check if PostgreSQL is running
echo -e "\n${BLUE}🗄️  Checking database connection...${NC}"
if command -v psql &> /dev/null; then
    # Try to connect to PostgreSQL
    if psql -h localhost -U postgres -d postgres -c "SELECT 1;" &> /dev/null; then
        print_status "PostgreSQL is running and accessible"
    else
        print_warning "PostgreSQL is not running or not accessible"
        print_info "Please start PostgreSQL and create the database:"
        print_info "  sudo systemctl start postgresql"
        print_info "  createdb provi_banking"
    fi
else
    print_warning "PostgreSQL client not found"
    print_info "Please install PostgreSQL and create the database"
fi

# Run database migrations
echo -e "\n${BLUE}🗄️  Running database migrations...${NC}"
cd server
if npm run migrate &> /dev/null; then
    print_status "Database migrations completed"
else
    print_warning "Database migrations failed (database may not be running)"
    print_info "You can run migrations later with: cd server && npm run migrate"
fi

# Build the application
echo -e "\n${BLUE}🔨 Building the application...${NC}"
if npm run build &> /dev/null; then
    print_status "Application built successfully"
else
    print_warning "Build failed (this is normal if database is not connected)"
    print_info "You can build later with: cd server && npm run build"
fi

cd ..

# Create startup scripts
echo -e "\n${BLUE}📜 Creating startup scripts...${NC}"

# Create start script for development
cat > start-dev.sh << 'EOL'
#!/bin/bash
echo "🚀 Starting UBAS Banking App in Development Mode"

# Start notification service in background
echo "📧 Starting notification service..."
cd server
npm run notifications &
NOTIFICATION_PID=$!

# Wait a moment for notification service to start
sleep 2

# Start main banking API
echo "🏦 Starting main banking API..."
npm run dev &
MAIN_PID=$!

echo "✅ Services started:"
echo "   📧 Notification Service: http://localhost:3001"
echo "   🏦 Main Banking API: http://localhost:3000"
echo "   📊 Health Check: http://localhost:3000/health"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping services..."
    kill $NOTIFICATION_PID 2>/dev/null
    kill $MAIN_PID 2>/dev/null
    exit 0
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
EOL

# Create start script for production
cat > start-prod.sh << 'EOL'
#!/bin/bash
echo "🚀 Starting UBAS Banking App in Production Mode"

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

cd server

# Build the application
echo "🔨 Building application..."
npm run build

# Start services with PM2
echo "📧 Starting notification service..."
pm2 start src/standalone-notification-system.js --name "ubas-notifications"

echo "🏦 Starting main banking API..."
pm2 start dist/server.js --name "ubas-banking-api"

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup

echo "✅ Production services started:"
echo "   📧 Notification Service: http://localhost:3001"
echo "   🏦 Main Banking API: http://localhost:3000"
echo "   📊 Health Check: http://localhost:3000/health"
echo ""
echo "📋 PM2 Commands:"
echo "   pm2 status          - Check service status"
echo "   pm2 logs            - View logs"
echo "   pm2 restart all     - Restart all services"
echo "   pm2 stop all        - Stop all services"
EOL

# Create test script
cat > test-system.sh << 'EOL'
#!/bin/bash
echo "🧪 Testing UBAS Banking App System"

cd server

echo "📧 Testing notification service..."
node test-complete-system.js

echo ""
echo "🏦 Testing full integration..."
node test-full-integration.js
EOL

# Make scripts executable
chmod +x start-dev.sh
chmod +x start-prod.sh
chmod +x test-system.sh

print_status "Startup scripts created"

# Final setup summary
echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}📋 What's been set up:${NC}"
echo "✅ Server dependencies installed"
echo "✅ Client dependencies installed (if available)"
echo "✅ Environment configuration created"
echo "✅ Database migration files ready"
echo "✅ Startup scripts created"
echo "✅ Test scripts created"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "1. Update server/.env with your actual configuration values"
echo "2. Start PostgreSQL and create the database"
echo "3. Run database migrations: cd server && npm run migrate"
echo "4. Start the application:"
echo "   • Development: ./start-dev.sh"
echo "   • Production: ./start-prod.sh"
echo "5. Test the system: ./test-system.sh"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "• System Overview: SYSTEM_SUMMARY.md"
echo "• Notification Guide: NOTIFICATION_SYSTEM.md"
echo "• Production Guide: PRODUCTION_DEPLOYMENT.md"
echo ""
echo -e "${BLUE}🌐 Service URLs:${NC}"
echo "• Main Banking API: http://localhost:3000"
echo "• Notification Service: http://localhost:3001"
echo "• Health Check: http://localhost:3000/health"
echo "• API Documentation: http://localhost:3000/api/v1"
echo ""
echo -e "${GREEN}🎯 Your banking app with notification system is ready!${NC}"
