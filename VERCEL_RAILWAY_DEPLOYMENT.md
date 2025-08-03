# 🚀 UBAS Financial Trust - Vercel + Railway Deployment

## 🎯 **OPTIMAL DEPLOYMENT STRATEGY**

**Frontend**: Vercel (React/Vite)
**Backend**: Railway (Node.js + PostgreSQL)
**Database**: Railway PostgreSQL (included)

This setup provides:
- ✅ **Automatic deployments** from GitHub
- ✅ **Built-in SSL certificates**
- ✅ **Global CDN** for frontend
- ✅ **Managed database** with backups
- ✅ **Environment variable management**
- ✅ **Free tiers available**

---

## 🗄️ **STEP 1: DATABASE SETUP (Railway)**

### **1.1 Create Railway Account & Database**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL service
railway add postgresql
```

### **1.2 Get Database Connection**
```bash
# Get database URL
railway variables

# Copy the DATABASE_URL (looks like):
# postgresql://postgres:password@host:port/railway
```

---

## 🔧 **STEP 2: BACKEND DEPLOYMENT (Railway)**

### **2.1 Configure Backend for Railway**

Create `server/railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **2.2 Set Environment Variables in Railway**

Go to Railway dashboard → Your project → Variables:

```bash
# Security (Generate new ones!)
JWT_SECRET=your_generated_jwt_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
ENCRYPTION_KEY=your_generated_encryption_key_here

# Database (Railway provides this automatically)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Application
NODE_ENV=production
PORT=3000
API_VERSION=v1

# CORS (Update with your Vercel domain)
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com

# Email Service (Choose one)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=noreply@yourdomain.com

# SMS Service (Choose one)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# File Upload
UPLOAD_PATH=uploads/kyc
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf

# Banking Configuration
MINIMUM_DEPOSIT=100
MINIMUM_WITHDRAWAL=20
MAXIMUM_DAILY_TRANSFER=50000
DEMO_MODE=false
```

### **2.3 Deploy Backend**
```bash
cd server

# Link to Railway project
railway link

# Deploy
railway up

# Run migrations
railway run npm run migrate

# Check deployment
railway logs
```

---

## 🌐 **STEP 3: FRONTEND DEPLOYMENT (Vercel)**

### **3.1 Configure Frontend for Vercel**

Update `vercel.json`:
```json
{
  "version": 2,
  "name": "ubas-financial-trust",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-railway-backend.up.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://your-railway-backend.up.railway.app/api/v1",
    "VITE_SOCKET_URL": "https://your-railway-backend.up.railway.app"
  }
}
```

### **3.2 Set Environment Variables in Vercel**

Go to Vercel dashboard → Your project → Settings → Environment Variables:

```bash
# API Configuration (Update with your Railway backend URL)
VITE_API_URL=https://your-railway-backend.up.railway.app/api/v1
VITE_SOCKET_URL=https://your-railway-backend.up.railway.app

# App Configuration
VITE_APP_NAME=UBAS Financial Trust
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production

# Feature Flags
VITE_ENABLE_2FA=true
VITE_ENABLE_BIOMETRIC_AUTH=false
VITE_ENABLE_PUSH_NOTIFICATIONS=true

# Banking Configuration
VITE_MINIMUM_DEPOSIT=100
VITE_MINIMUM_WITHDRAWAL=20
VITE_MAXIMUM_DAILY_TRANSFER=50000
VITE_DEMO_MODE=false

# Optional Services
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
VITE_SENTRY_DSN=your_sentry_dsn
```

### **3.3 Deploy Frontend**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from root directory
vercel --prod

# Or connect GitHub repo to Vercel dashboard for automatic deployments
```

---

## 🔄 **STEP 4: CONNECT FRONTEND TO BACKEND**

### **4.1 Update CORS in Backend**
After getting your Vercel URL, update Railway environment variables:
```bash
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-custom-domain.com
```

### **4.2 Update Frontend API URL**
Update Vercel environment variables with your Railway backend URL:
```bash
VITE_API_URL=https://your-railway-backend.up.railway.app/api/v1
VITE_SOCKET_URL=https://your-railway-backend.up.railway.app
```

---

## 🧪 **STEP 5: TESTING & VERIFICATION**

### **5.1 Test Backend Health**
```bash
curl https://your-railway-backend.up.railway.app/api/v1/health
```

### **5.2 Test Frontend**
Visit your Vercel URL and verify:
- ✅ Frontend loads correctly
- ✅ API calls work
- ✅ User registration works
- ✅ Login functionality works
- ✅ KYC upload works

### **5.3 Test Complete Flow**
1. Register new user
2. Upload KYC documents
3. Admin approval (if not auto-approved)
4. Create account
5. Make transaction
6. Verify notifications

---

## 🎯 **ALTERNATIVE DEPLOYMENT OPTIONS**

### **Option 2: Render (Full-Stack)**
```bash
# Deploy both frontend and backend to Render
# Render auto-detects your setup and provides PostgreSQL

# Backend: Web Service
# Frontend: Static Site
# Database: PostgreSQL (managed)
```

### **Option 3: Netlify + Railway**
```bash
# Frontend: Netlify (similar to Vercel)
# Backend: Railway
# Database: Railway PostgreSQL
```

### **Option 4: Full Vercel (Serverless)**
```bash
# Convert backend to Vercel serverless functions
# Use Supabase or PlanetScale for database
# Requires some code restructuring
```

---

## 🔒 **SECURITY CHECKLIST**

### **Production Security Setup**
- [ ] Generate new JWT secrets: `npm run generate:secrets`
- [ ] Set up real email service (SendGrid/Mailgun)
- [ ] Configure SMS service (Twilio)
- [ ] Set up custom domain with SSL
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and alerts

### **Database Security**
- [ ] Database connection encrypted (Railway default)
- [ ] Regular backups enabled (Railway default)
- [ ] Access controls configured
- [ ] Audit logging enabled

---

## 📊 **MONITORING & MAINTENANCE**

### **Railway Monitoring**
- Database metrics and logs
- Application performance monitoring
- Automatic scaling
- Health checks

### **Vercel Monitoring**
- Frontend performance analytics
- Build and deployment logs
- Edge function monitoring
- Real User Monitoring (RUM)

---

## 💰 **COST ESTIMATION**

### **Free Tier Limits**
**Railway**: 
- $5/month credit (enough for small apps)
- 500 hours execution time
- 1GB RAM, 1 vCPU

**Vercel**:
- 100GB bandwidth
- 6,000 build minutes
- Unlimited static deployments

### **Paid Plans** (if needed)
**Railway**: $5-20/month for production apps
**Vercel**: $20/month for Pro features

---

## 🎉 **DEPLOYMENT COMMANDS SUMMARY**

```bash
# 1. Generate secrets
cd server && npm run generate:secrets

# 2. Deploy backend to Railway
cd server
railway login
railway init
railway add postgresql
railway up
railway run npm run migrate

# 3. Deploy frontend to Vercel
cd ..
vercel --prod

# 4. Update environment variables in both platforms
# 5. Test everything works!
```

**Your UBAS Financial Trust banking application will be live and ready for users!** 🚀
