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

