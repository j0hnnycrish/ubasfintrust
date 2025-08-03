# 🚀 UBAS Financial Trust - Render Deployment Steps

## **STEP-BY-STEP DEPLOYMENT GUIDE**

### **STEP 1: ✅ COMPLETED - GitHub Authentication**
- You've signed in to GitHub
- Render is now connected to your GitHub account

### **STEP 2: CREATE NEW BLUEPRINT**

Once you're in the Render dashboard:

1. **Click "New"** (blue button in top right)
2. **Select "Blueprint"** from the dropdown menu
3. **Connect Repository**:
   - Choose "Connect GitHub repository"
   - Find and select your `ubasfintrust` repository
   - Click "Connect"

### **STEP 3: CONFIGURE BLUEPRINT**

Render will automatically detect the `render.yaml` file:

1. **Review the configuration** (should show):
   - ✅ Backend Web Service: `ubas-backend`
   - ✅ Frontend Static Site: `ubas-frontend` 
   - ✅ PostgreSQL Database: `ubas-database`

2. **Click "Apply"** to start deployment

### **STEP 4: DEPLOYMENT PROCESS**

Render will now automatically:

1. **Create PostgreSQL Database** (~2 minutes)
   - Database name: `ubas_financial_trust`
   - User: `ubas_admin`
   - Plan: Free tier

2. **Deploy Backend Service** (~5 minutes)
   - Build command: `npm install && npm run build`
   - Start command: `npm start`
   - Environment variables: Auto-configured

3. **Deploy Frontend Site** (~3 minutes)
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

### **STEP 5: VERIFY DEPLOYMENT**

After deployment completes:

1. **Check Service URLs**:
   - Backend: `https://ubas-backend.onrender.com`
   - Frontend: `https://ubas-frontend.onrender.com`

2. **Test Backend Health**:
   - Visit: `https://ubas-backend.onrender.com/api/v1/health`
   - Should return: `{"status": "ok"}`

3. **Test Frontend**:
   - Visit: `https://ubas-frontend.onrender.com`
   - Should load the banking application

### **STEP 6: RUN DATABASE MIGRATIONS**

After backend deployment:

1. **Go to Backend Service** in Render dashboard
2. **Click "Shell"** tab
3. **Run migration command**:
   ```bash
   npm run migrate
   ```

### **STEP 7: TEST COMPLETE APPLICATION**

1. **Visit your frontend URL**
2. **Register a new user**
3. **Test KYC document upload**
4. **Test account creation**
5. **Test transactions**

## **EXPECTED TIMELINE**

- **Total deployment time**: 8-12 minutes
- **Database creation**: 2 minutes
- **Backend deployment**: 5 minutes
- **Frontend deployment**: 3 minutes
- **Migration setup**: 2 minutes

## **TROUBLESHOOTING**

### **If deployment fails:**

1. **Check build logs** in Render dashboard
2. **Verify environment variables** are set correctly
3. **Check the `render.yaml` file** is in repository root

### **If database connection fails:**

1. **Verify DATABASE_URL** is set in backend service
2. **Check PostgreSQL service** is running
3. **Run migrations** via Shell tab

### **If frontend doesn't load:**

1. **Check build logs** for errors
2. **Verify API URL** environment variable
3. **Check CORS settings** in backend

## **SUCCESS INDICATORS**

✅ **Database**: Green status in Render dashboard
✅ **Backend**: Health check returns 200 OK
✅ **Frontend**: Application loads without errors
✅ **Integration**: Frontend can communicate with backend

## **FINAL URLS**

After successful deployment:

- **🌐 Banking Application**: `https://ubas-frontend.onrender.com`
- **🔧 API Backend**: `https://ubas-backend.onrender.com`
- **🗄️ Database**: Managed PostgreSQL (internal)

## **NEXT STEPS AFTER DEPLOYMENT**

1. **Set up custom domain** (optional)
2. **Configure real email/SMS services** with API keys
3. **Test complete user flows**
4. **Set up monitoring and alerts**
5. **Go live with real users!**

---

**Your UBAS Financial Trust banking application will be fully operational!** 🎉
