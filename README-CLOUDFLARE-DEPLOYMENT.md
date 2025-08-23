# Cloudflare Pages Deployment Guide

This guide explains how to deploy your UBAS Financial Trust frontend to Cloudflare Pages without building locally.

## Prerequisites

1. Install Node.js (v18 or higher)
2. Install Wrangler CLI: `npm install -g wrangler`
3. Login to Cloudflare: `wrangler login`

## Deployment Steps

### Method 1: Using the Deployment Script (Recommended)

1. Run the deployment script:
   ```bash
   ./deploy-cloudflare-pages.sh
   ```

### Method 2: Manual Deployment

1. Install dependencies:
   ```bash
   npm install
   ```

2. Deploy to Cloudflare Pages (no build step needed):
   ```bash
   npx wrangler pages deploy .
   ```

## Configuration Files

The deployment uses the following configuration files:

- `cloudflare-pages.toml`: Build configuration for Cloudflare Pages
- `wrangler.toml`: Wrangler configuration for Cloudflare Workers
- `vite.config.ts`: Vite build configuration
- `package.json`: Project dependencies and scripts

## Important Notes

- **No Build Step**: The deployment happens directly from source code
- **Cloudflare Builds**: Cloudflare Pages handles the build process
- **No Static Folder**: We don't use a pre-built `/dist` folder
- **Environment Variables**: Set in Cloudflare dashboard, not in config files

## Troubleshooting

### Build Issues

If you encounter build errors:

1. Check your Cloudflare account and login status
2. Verify you have the correct permissions for Cloudflare Pages
3. Check the Wrangler CLI logs for detailed error messages

### Frontend Not Displaying Properly

If the frontend doesn't display correctly:

1. Check the browser console for JavaScript errors
2. Verify all assets are loading correctly
3. Ensure the Content Security Policy (CSP) is not blocking resources
4. Check that all environment variables are set correctly in Cloudflare dashboard

## Environment Variables

Environment variables should be set in the Cloudflare dashboard:
1. Go to your Cloudflare Pages project
2. Navigate to "Environment variables"
3. Add required variables like:
   - `VITE_API_URL`
   - `VITE_SOCKET_URL`
   - `VITE_APP_NAME`

## Custom Domain

To use a custom domain:

1. Add your domain in the Cloudflare dashboard
2. Configure DNS settings as instructed by Cloudflare
3. Update any hardcoded URLs in your application

## Monitoring

After deployment:

1. Monitor performance using Cloudflare Analytics
2. Set up error tracking if needed
3. Regularly check for security updates

## Rollback

If issues occur after deployment:

1. Go to the Cloudflare Pages dashboard
2. Select your project
3. Use the rollback feature to revert to a previous deployment