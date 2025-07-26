# 🚀 UBAS Financial Trust - Complete Deployment Guide

## 🎯 **Recommended Hosting Solutions**

### **🥇 Best Option: Vercel + Railway**
**Cost**: ~$20-50/month | **Difficulty**: Easy | **Features**: Full-stack

**Frontend (Vercel)**:
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domains
- ✅ Excellent performance

**Backend + Database (Railway)**:
- ✅ PostgreSQL included
- ✅ Easy deployment
- ✅ Environment variables
- ✅ Automatic scaling

### **🥈 Alternative: Netlify + Heroku**
**Cost**: ~$25-75/month | **Difficulty**: Easy | **Features**: Full-stack

**Frontend (Netlify)**:
- ✅ Free tier available
- ✅ Form handling
- ✅ Edge functions
- ✅ Split testing

**Backend + Database (Heroku)**:
- ✅ PostgreSQL add-on
- ✅ Easy scaling
- ✅ Add-ons ecosystem
- ✅ Established platform

### **🥉 Budget Option: DigitalOcean**
**Cost**: ~$12-25/month | **Difficulty**: Medium | **Features**: Full-stack

- ✅ App Platform (PaaS)
- ✅ Managed database
- ✅ Predictable pricing
- ✅ Good performance

## 📋 **Step-by-Step Deployment**

### **Option 1: Vercel + Railway (Recommended)**

#### **Step 1: Deploy Backend to Railway**
```bash
# 1. Create Railway account at railway.app
# 2. Install Railway CLI
npm install -g @railway/cli

# 3. Login and deploy
railway login
cd server
railway deploy

# 4. Add PostgreSQL database
railway add postgresql

# 5. Set environment variables in Railway dashboard
```

#### **Step 2: Deploy Frontend to Vercel**
```bash
# 1. Create Vercel account at vercel.com
# 2. Install Vercel CLI
npm install -g vercel

# 3. Update API URL in vercel.json
# Replace "your-backend-url" with Railway URL

# 4. Deploy
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

### **Option 2: Netlify + Heroku**

#### **Step 1: Deploy Backend to Heroku**
```bash
# 1. Create Heroku account
# 2. Install Heroku CLI
# 3. Create app
heroku create ubas-backend

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Deploy
git subtree push --prefix server heroku main
```

#### **Step 2: Deploy Frontend to Netlify**
```bash
# 1. Update netlify.toml with Heroku URL
# 2. Deploy
chmod +x scripts/deploy-netlify.sh
./scripts/deploy-netlify.sh
```

### **Option 3: DigitalOcean App Platform**
```bash
# 1. Create DigitalOcean account
# 2. Go to App Platform
# 3. Connect GitHub repository
# 4. Use .do/app.yaml configuration
# 5. Deploy automatically
```

## 🏠 **cPanel Shared Hosting (Limited)**

### **What Works:**
- ✅ Frontend static files
- ✅ Basic routing with .htaccess
- ✅ SSL certificates
- ✅ Custom domains

### **What Doesn't Work:**
- ❌ Node.js backend
- ❌ PostgreSQL database
- ❌ Real-time features
- ❌ File uploads
- ❌ Admin dashboard

### **cPanel Deployment:**
```bash
# Build and package
chmod +x scripts/deploy-cpanel.sh
./scripts/deploy-cpanel.sh

# Upload to cPanel:
# 1. Login to cPanel
# 2. File Manager → public_html
# 3. Upload ubas-financial-trust-cpanel.zip
# 4. Extract files
# 5. Upload .htaccess file
```

## 🔧 **Environment Configuration**

### **Required Environment Variables:**

**Frontend (.env.production):**
```bash
VITE_API_URL=https://your-backend-url.com
VITE_APP_NAME=UBAS Financial Trust
VITE_MINIMUM_DEPOSIT=100
VITE_MINIMUM_WITHDRAWAL=20
VITE_MAXIMUM_DAILY_TRANSFER=50000
```

**Backend (.env):**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
CORS_ORIGIN=https://your-frontend-url.com
```

## 🌐 **Custom Domain Setup**

### **For Vercel:**
1. Go to Vercel dashboard
2. Select project → Settings → Domains
3. Add custom domain
4. Update DNS records as instructed

### **For Netlify:**
1. Go to Netlify dashboard
2. Site settings → Domain management
3. Add custom domain
4. Configure DNS records

### **For Railway:**
1. Go to Railway dashboard
2. Select service → Settings → Domains
3. Add custom domain
4. Update DNS records

## 📊 **Hosting Comparison**

| Feature | Vercel+Railway | Netlify+Heroku | DigitalOcean | cPanel |
|---------|----------------|----------------|--------------|--------|
| **Cost/Month** | $20-50 | $25-75 | $12-25 | $5-15 |
| **Setup Difficulty** | Easy | Easy | Medium | Hard |
| **Full-Stack Support** | ✅ | ✅ | ✅ | ❌ |
| **Database Included** | ✅ | ✅ | ✅ | ❌ |
| **Auto Scaling** | ✅ | ✅ | ✅ | ❌ |
| **SSL Certificate** | ✅ | ✅ | ✅ | ✅ |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ |
| **Performance** | Excellent | Excellent | Good | Fair |
| **Support** | Good | Good | Good | Varies |

## 🎯 **Recommended Choice**

### **For Professional Demos: Vercel + Railway**
- **Best performance** for client demonstrations
- **Easiest setup** and maintenance
- **Professional URLs** and SSL
- **Reliable uptime** for client meetings
- **Scalable** as your business grows

### **For Budget Conscious: DigitalOcean**
- **Predictable pricing** with no surprises
- **Good performance** for the cost
- **Full control** over the environment
- **Managed database** included

### **For Static Demo Only: Netlify**
- **Free tier** for basic demonstrations
- **Fast global CDN** for quick loading
- **Easy custom domains** for branding
- **Limited to frontend only**

## 🚀 **Quick Start Commands**

### **Deploy to Vercel + Railway:**
```bash
# Backend to Railway
cd server && railway deploy

# Frontend to Vercel
chmod +x scripts/deploy-vercel.sh && ./scripts/deploy-vercel.sh
```

### **Deploy to Netlify + Heroku:**
```bash
# Backend to Heroku
git subtree push --prefix server heroku main

# Frontend to Netlify
chmod +x scripts/deploy-netlify.sh && ./scripts/deploy-netlify.sh
```

### **Deploy to cPanel (Frontend Only):**
```bash
chmod +x scripts/deploy-cpanel.sh && ./scripts/deploy-cpanel.sh
```

## 📞 **Support & Troubleshooting**

### **Common Issues:**
1. **CORS Errors**: Update CORS_ORIGIN in backend
2. **API Not Found**: Check API URL in frontend config
3. **Database Connection**: Verify DATABASE_URL
4. **SSL Issues**: Ensure HTTPS for both frontend/backend

### **Getting Help:**
- Check deployment logs in hosting dashboard
- Verify environment variables are set
- Test API endpoints independently
- Contact hosting support if needed

---

**🎉 Your UBAS Financial Trust platform will be live and ready for client demonstrations!**
