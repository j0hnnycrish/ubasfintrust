# UBAS Financial Trust - Vercel Deployment Guide

This guide will help you deploy the UBAS Financial Trust banking application to Vercel.

## 🏗️ Architecture Overview

- **Frontend**: Deployed to Vercel (React + Vite)
- **Backend**: Deployed to Railway/Render/Heroku (Node.js + Express)
- **Database**: PostgreSQL (Railway/Render/Neon)
- **Cache**: Redis (Railway/Render/Upstash)

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Backend Deployment**: Deploy your backend first (see Backend Deployment section)

## 🚀 Quick Deployment

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
# Run the deployment script
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

### Option 2: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Deploy

## 🔧 Environment Variables Setup

### Required Environment Variables for Vercel:

```env
VITE_API_URL=https://your-backend-url.com/api/v1
VITE_SOCKET_URL=https://your-backend-url.com
VITE_APP_NAME=UBAS Financial Trust
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
VITE_ENABLE_2FA=true
VITE_ENABLE_BIOMETRIC_AUTH=false
VITE_ENABLE_PUSH_NOTIFICATIONS=true
VITE_MINIMUM_DEPOSIT=100
VITE_MINIMUM_WITHDRAWAL=20
VITE_MAXIMUM_DAILY_TRANSFER=50000
VITE_DEMO_MODE=true
VITE_DEMO_ACCOUNT_PREFIX=DEMO
```

### Setting Environment Variables in Vercel:

1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable with its value
5. Make sure to select "Production" environment

## 🗄️ Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **Create New Project**: Connect your GitHub repository
3. **Deploy Backend**: Select the `server` folder
4. **Add Database**: Add PostgreSQL and Redis services
5. **Set Environment Variables**: Use the backend environment variables
6. **Get URL**: Copy your Railway app URL

### Option 2: Render

1. **Sign up**: Go to [render.com](https://render.com)
2. **Create Web Service**: Connect your GitHub repository
3. **Configure**: Set root directory to `server`
4. **Add Database**: Create PostgreSQL and Redis instances
5. **Set Environment Variables**: Configure all backend variables
6. **Deploy**: Get your Render app URL

### Option 3: Heroku

1. **Install Heroku CLI**: Download from [heroku.com](https://heroku.com)
2. **Create App**: `heroku create ubas-backend`
3. **Add Addons**: 
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   heroku addons:create heroku-redis:hobby-dev
   ```
4. **Deploy**: Push your server code to Heroku
5. **Get URL**: Use your Heroku app URL

## 🔄 Update Backend URL

After deploying your backend, update the frontend configuration:

1. **Update vercel.json**:
```json
{
  "env": {
    "VITE_API_URL": "https://your-actual-backend-url.com/api/v1",
    "VITE_SOCKET_URL": "https://your-actual-backend-url.com"
  }
}
```

2. **Update Environment Variables in Vercel Dashboard**

3. **Redeploy**: Trigger a new deployment

## 🔒 Security Configuration

### CORS Setup (Backend)

Make sure your backend allows requests from your Vercel domain:

```javascript
// In your backend server
const corsOptions = {
  origin: [
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
};
```

### Environment Variables Security

- Never commit `.env` files to Git
- Use Vercel's environment variables for sensitive data
- Rotate secrets regularly

## 🌐 Custom Domain Setup

1. **Purchase Domain**: Buy a domain from any registrar
2. **Add to Vercel**: 
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions
3. **SSL Certificate**: Vercel automatically provides SSL

## 📊 Monitoring & Analytics

### Vercel Analytics

1. Go to your project dashboard
2. Click on "Analytics" tab
3. Enable Vercel Analytics for performance monitoring

### Error Tracking

Consider adding Sentry for error tracking:

```bash
npm install @sentry/react
```

## 🔧 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check environment variables are set correctly
   - Ensure all dependencies are in package.json
   - Check build logs in Vercel dashboard

2. **API Connection Issues**:
   - Verify backend URL is correct
   - Check CORS configuration
   - Ensure backend is deployed and running

3. **Environment Variable Issues**:
   - Variables must start with `VITE_` for Vite
   - Check spelling and case sensitivity
   - Redeploy after changing variables

### Debug Commands:

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check environment variables
echo $VITE_API_URL
```

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify backend is running
3. Test API endpoints directly
4. Check browser console for errors

## 🎉 Success!

Once deployed successfully:

- Your app will be available at: `https://your-project.vercel.app`
- Set up monitoring and alerts
- Configure custom domain if needed
- Test all functionality thoroughly

---

**Next Steps**: After successful deployment, consider setting up:
- Automated testing
- Staging environment
- Database backups
- Performance monitoring
