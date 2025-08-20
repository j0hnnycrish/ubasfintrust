#!/bin/bash

# Cloudflare Workers Secret Setup Script
# This script sets up all required secrets for the UbasFin Trust edge worker

echo "🔐 Setting up Cloudflare Workers secrets..."

# Generate a strong JWT secret if not provided
JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 64 | tr -d '\n')}

echo "Setting JWT_SECRET..."
echo "$JWT_SECRET" | npx wrangler secret put JWT_SECRET

# Database URL (Neon Postgres)
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set. Please provide your Neon database URL:"
    read -p "Enter DATABASE_URL: " DATABASE_URL
fi

if [ -n "$DATABASE_URL" ]; then
    echo "Setting DATABASE_URL..."
    echo "$DATABASE_URL" | npx wrangler secret put DATABASE_URL
fi

# Notification service secrets
echo ""
echo "📧 Setting up notification service secrets..."
echo "You can skip any service you don't want to use by pressing Enter"

# SendGrid
if [ -z "$SENDGRID_API_KEY" ]; then
    read -p "Enter SENDGRID_API_KEY (or press Enter to skip): " SENDGRID_API_KEY
fi
if [ -n "$SENDGRID_API_KEY" ]; then
    echo "$SENDGRID_API_KEY" | npx wrangler secret put SENDGRID_API_KEY
fi

# Mailgun
if [ -z "$MAILGUN_API_KEY" ]; then
    read -p "Enter MAILGUN_API_KEY (or press Enter to skip): " MAILGUN_API_KEY
fi
if [ -n "$MAILGUN_API_KEY" ]; then
    echo "$MAILGUN_API_KEY" | npx wrangler secret put MAILGUN_API_KEY
fi

if [ -z "$MAILGUN_DOMAIN" ]; then
    read -p "Enter MAILGUN_DOMAIN (or press Enter to skip): " MAILGUN_DOMAIN
fi
if [ -n "$MAILGUN_DOMAIN" ]; then
    echo "$MAILGUN_DOMAIN" | npx wrangler secret put MAILGUN_DOMAIN
fi

# Resend
if [ -z "$RESEND_API_KEY" ]; then
    read -p "Enter RESEND_API_KEY (or press Enter to skip): " RESEND_API_KEY
fi
if [ -n "$RESEND_API_KEY" ]; then
    echo "$RESEND_API_KEY" | npx wrangler secret put RESEND_API_KEY
fi

# Vonage (SMS)
if [ -z "$VONAGE_API_KEY" ]; then
    read -p "Enter VONAGE_API_KEY (or press Enter to skip): " VONAGE_API_KEY
fi
if [ -n "$VONAGE_API_KEY" ]; then
    echo "$VONAGE_API_KEY" | npx wrangler secret put VONAGE_API_KEY
fi

if [ -z "$VONAGE_API_SECRET" ]; then
    read -p "Enter VONAGE_API_SECRET (or press Enter to skip): " VONAGE_API_SECRET
fi
if [ -n "$VONAGE_API_SECRET" ]; then
    echo "$VONAGE_API_SECRET" | npx wrangler secret put VONAGE_API_SECRET
fi

# Textbelt (SMS)
if [ -z "$TEXTBELT_API_KEY" ]; then
    read -p "Enter TEXTBELT_API_KEY (or press Enter to skip): " TEXTBELT_API_KEY
fi
if [ -n "$TEXTBELT_API_KEY" ]; then
    echo "$TEXTBELT_API_KEY" | npx wrangler secret put TEXTBELT_API_KEY
fi

echo ""
echo "✅ Secret setup complete!"
echo ""
echo "📋 Secrets configured:"
echo "  - JWT_SECRET: ✅"
if [ -n "$DATABASE_URL" ]; then echo "  - DATABASE_URL: ✅"; fi
if [ -n "$SENDGRID_API_KEY" ]; then echo "  - SENDGRID_API_KEY: ✅"; fi
if [ -n "$MAILGUN_API_KEY" ]; then echo "  - MAILGUN_API_KEY: ✅"; fi
if [ -n "$MAILGUN_DOMAIN" ]; then echo "  - MAILGUN_DOMAIN: ✅"; fi
if [ -n "$RESEND_API_KEY" ]; then echo "  - RESEND_API_KEY: ✅"; fi
if [ -n "$VONAGE_API_KEY" ]; then echo "  - VONAGE_API_KEY: ✅"; fi
if [ -n "$VONAGE_API_SECRET" ]; then echo "  - VONAGE_API_SECRET: ✅"; fi
if [ -n "$TEXTBELT_API_KEY" ]; then echo "  - TEXTBELT_API_KEY: ✅"; fi

echo ""
echo "🚀 Your edge worker is now configured with secrets!"
echo "Next: Run 'npm run deploy' to deploy to production"
