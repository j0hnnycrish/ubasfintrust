#!/bin/bash

# UBAS Financial Trust - Production Deployment Script
# This script deploys the application to production environment

set -e

echo "🏦 UBAS Financial Trust - Production Deployment"
echo "=============================================="

# Configuration
DOMAIN="demo.ubasfintrust.com"
BACKUP_DIR="/backups/$(date +%Y%m%d_%H%M%S)"
LOG_FILE="/var/log/ubas_deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check prerequisites
log "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Please install Docker first."
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose is not installed. Please install Docker Compose first."
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    error ".env.production file not found. Please create it from .env.production.example"
fi

# Create necessary directories
log "Creating necessary directories..."
mkdir -p uploads logs backups ssl nginx

# Generate SSL certificates if they don't exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    log "Generating self-signed SSL certificates..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=US/ST=NY/L=New York/O=UBAS Financial Trust/CN=$DOMAIN"
fi

# Create backup of existing deployment
if [ -d "postgres_data" ]; then
    log "Creating backup of existing data..."
    mkdir -p $BACKUP_DIR
    sudo cp -r postgres_data $BACKUP_DIR/
    sudo cp -r uploads $BACKUP_DIR/
    log "Backup created at $BACKUP_DIR"
fi

# Pull latest images
log "Pulling latest Docker images..."
docker-compose -f docker-compose.production.yml pull

# Build application images
log "Building application images..."
docker-compose -f docker-compose.production.yml build --no-cache

# Stop existing containers
log "Stopping existing containers..."
docker-compose -f docker-compose.production.yml down

# Start new deployment
log "Starting new deployment..."
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
log "Waiting for services to be healthy..."
sleep 30

# Check service health
log "Checking service health..."
for service in postgres redis backend frontend; do
    if docker-compose -f docker-compose.production.yml ps $service | grep -q "Up (healthy)"; then
        log "✅ $service is healthy"
    else
        warning "⚠️  $service may not be healthy, checking logs..."
        docker-compose -f docker-compose.production.yml logs --tail=20 $service
    fi
done

# Run database migrations
log "Running database migrations..."
docker-compose -f docker-compose.production.yml exec -T backend npm run migrate

# Create default admin user if it doesn't exist
log "Setting up admin user..."
docker-compose -f docker-compose.production.yml exec -T backend npm run setup:admin

# Set up log rotation
log "Setting up log rotation..."
cat > /tmp/ubas-logrotate << EOF
/var/log/ubas_deploy.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $(whoami) $(whoami)
}
EOF

sudo mv /tmp/ubas-logrotate /etc/logrotate.d/ubas

# Set up backup cron job
log "Setting up automated backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$(whoami)/ubas-financial-trust/scripts/backup.sh") | crontab -

# Display deployment information
log "Deployment completed successfully! 🎉"
echo ""
echo "=============================================="
echo "🏦 UBAS Financial Trust - Deployment Info"
echo "=============================================="
echo "Frontend URL: https://$DOMAIN"
echo "Admin Panel: https://$DOMAIN/admin"
echo "API URL: https://api.$DOMAIN"
echo ""
echo "Default Admin Credentials:"
echo "Email: admin@ubasfintrust.com"
echo "Password: Check .env.production file"
echo ""
echo "Services Status:"
docker-compose -f docker-compose.production.yml ps
echo ""
echo "To view logs: docker-compose -f docker-compose.production.yml logs -f"
echo "To stop: docker-compose -f docker-compose.production.yml down"
echo "=============================================="

# Send deployment notification (if configured)
if [ ! -z "$SLACK_WEBHOOK" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data '{"text":"🏦 UBAS Financial Trust deployed successfully to production!"}' \
        $SLACK_WEBHOOK
fi

log "Deployment script completed successfully!"
