# 🚀 Deploy Backend to Azure App Service from GitHub

## ✅ What You Have:
- ✅ Database: Aiven MySQL (deployed)
- ✅ Frontend: Vercel (deployed at https://notes-app-virid-psi.vercel.app/)
- ⏳ Backend: Ready to deploy to Azure

---

## 📋 Your Configuration Details

```
Database:
  Host: notes-app-db-ishtiakrahman13579-2cca.f.aivencloud.com
  Port: 24692
  User: avnadmin
  Password: <YOUR_AIVEN_PASSWORD>  # Keep this secret!
  Database: defaultdb
  SSL: REQUIRED

Frontend:
  URL: https://notes-app-virid-psi.vercel.app/

Backend Environment:
  JWT_SECRET: <YOUR_JWT_SECRET>  # Keep this secret!
  NODE_ENV: production
```

---

## 🎯 Deployment Method: Azure App Service with GitHub

Azure App Service can automatically deploy from your GitHub repository. Here's how:

---

## 📝 STEP-BY-STEP GUIDE

### **Step 1: Prepare Your Backend for Azure**

#### 1.1 Update Backend Database Configuration

The backend needs to connect to Aiven with SSL. Let's update `backend/db.js`:

**Current Issue**: Your Aiven requires SSL, so we need to update the connection.

**Update `backend/db.js`:**

```javascript
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // SSL configuration for Aiven
    ssl: {
        rejectUnauthorized: false // Aiven uses self-signed certificates
    }
});

module.exports = pool.promise();
```

#### 1.2 Create Azure-specific Configuration Files

**Create `backend/package.json` scripts for Azure** (update if needed):

Make sure your `backend/package.json` has:

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

#### 1.3 Update CORS for Your Vercel Frontend

**Update `backend/server.js`** - Already done, but verify:

```javascript
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://notes-app-virid-psi.vercel.app',
    'http://localhost:8000'
].filter(Boolean);
```

#### 1.4 Commit and Push Changes

```bash
cd /Users/ishtiakrahman/Desktop/notes-app

git add .
git commit -m "Configure backend for Azure deployment with SSL"
git push origin main
```

---

### **Step 2: Deploy to Azure App Service (via Azure Portal)**

#### 2.1 Login to Azure Portal

1. Go to https://portal.azure.com
2. Sign in with your student account

#### 2.2 Create a Web App

1. Click **"Create a resource"** (+ icon in top left)
2. Search for **"Web App"** and select it
3. Click **"Create"**

#### 2.3 Configure Basic Settings

**Basics Tab:**
```
Subscription: Azure for Students
Resource Group: Click "Create new" → Name: "notes-app-rg"

Instance Details:
  Name: notes-app-backend-unique  (must be globally unique!)
        This will be: notes-app-backend-unique.azurewebsites.net
  
  Publish: Code
  
  Runtime stack: Node 18 LTS
  
  Operating System: Linux
  
  Region: East US (or closest to you)

Pricing Plan:
  Linux Plan: Click "Create new" → Name: "notes-app-plan"
  Sku and size: Free F1 (Click "Change size" → Dev/Test → F1)
                 OR
                 Basic B1 (~$13/month for always-on, no cold starts)
```

**Recommendation**: Start with **Free F1** to test, then upgrade to **Basic B1** if needed.

Click **"Next: Deployment >"**

#### 2.4 Configure Deployment (GitHub Integration)

**Deployment Tab:**
```
GitHub Actions settings:
  Continuous deployment: Enable
  
  GitHub account: Click "Authorize" and login to your GitHub (Ishtiak2)
  
  Organization: Ishtiak2
  
  Repository: notes-app
  
  Branch: main
```

This will automatically create a GitHub Actions workflow!

Click **"Next: Networking >"** → Skip (leave defaults)

Click **"Next: Monitoring >"** → Skip (leave defaults)

Click **"Next: Tags >"** → Skip

Click **"Review + create"**

#### 2.5 Review and Create

1. Review all settings
2. Click **"Create"**
3. Wait 2-3 minutes for deployment

---

### **Step 3: Configure Environment Variables**

After the Web App is created:

#### 3.1 Go to Configuration

1. In Azure Portal, go to your Web App: **notes-app-backend-unique**
2. In left sidebar, click **"Configuration"** (under Settings)

#### 3.2 Add Application Settings (Environment Variables)

Click **"+ New application setting"** for each:

```
Name: DB_HOST
Value: notes-app-db-ishtiakrahman13579-2cca.f.aivencloud.com

Name: DB_PORT
Value: 24692

Name: DB_USER
Value: avnadmin

Name: DB_PASSWORD
Value: <YOUR_AIVEN_PASSWORD>

Name: DB_NAME
Value: defaultdb

Name: JWT_SECRET
Value: <YOUR_JWT_SECRET>

Name: PORT
Value: 8080

Name: NODE_ENV
Value: production

Name: FRONTEND_URL
Value: https://notes-app-virid-psi.vercel.app

Name: WEBSITE_NODE_DEFAULT_VERSION
Value: 18-lts
```

#### 3.3 Save Configuration

1. Click **"Save"** at the top
2. Click **"Continue"** when prompted (app will restart)

---

### **Step 4: Configure Deployment Settings**

#### 4.1 Set Startup Command (Important!)

1. Still in **Configuration**
2. Go to **"General settings"** tab
3. Find **"Startup Command"**
4. Enter: `node server.js`
5. Click **"Save"**

#### 4.2 Configure App Service Path (if using /backend folder)

Since your backend code is in `/backend` folder:

**Option A: Update GitHub Actions Workflow (Automatic)**

Azure already created `.github/workflows/main_notes-app-backend-unique.yml`

Edit it to point to `/backend` folder:

```yaml
# Find the "npm install" section and update paths:
- name: npm install, build, and test
  run: |
    cd backend
    npm install
    npm run build --if-present
```

**Option B: Use Azure Configuration**

1. In Azure Portal → Your Web App
2. Configuration → General settings
3. **Startup Command**: `cd backend && node server.js`

---

### **Step 5: Test Deployment**

#### 5.1 Check Deployment Status

1. In Azure Portal → Your Web App
2. Click **"Deployment Center"** (left sidebar)
3. You'll see GitHub Actions deployment logs
4. Wait for deployment to complete (green checkmark)

#### 5.2 Get Your Backend URL

Your backend will be at:
```
https://notes-app-backend-unique.azurewebsites.net
```

(Replace "unique" with your actual app name)

#### 5.3 Test the API

**Test in browser or curl:**

```bash
# Health check
curl https://notes-app-backend-unique.azurewebsites.net

# Test register endpoint
curl -X POST https://notes-app-backend-unique.azurewebsites.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

---

### **Step 6: Update Frontend with Backend URL**

#### 6.1 Update Frontend API URLs

**Update `frontend/js/main.js`** (line 2):

```javascript
const API_URL = 'https://notes-app-backend-unique.azurewebsites.net';
```

**Update `frontend/js/profile.js`** (all fetch calls):

```javascript
// Replace localhost:3000 with your Azure backend URL
const API_BASE_URL = 'https://notes-app-backend-unique.azurewebsites.net';

// Update all fetch calls, for example:
const response = await fetch(`${API_BASE_URL}/api/profile`, {
```

Or create a config file:

**Create `frontend/js/config.js`:**

```javascript
const API_URL = 'https://notes-app-backend-unique.azurewebsites.net';
```

Then import it in your HTML before other scripts:

```html
<script src="js/config.js"></script>
<script src="js/main.js"></script>
```

#### 6.2 Commit and Push

```bash
git add .
git commit -m "Update API URL to Azure backend"
git push origin main
```

Vercel will auto-deploy the frontend!

---

## 🎯 Alternative: Quick Deploy Using Azure CLI

If you prefer CLI (requires Azure CLI installation):

```bash
# Install Azure CLI
brew install azure-cli

# Login
az login

# Create resource group
az group create --name notes-app-rg --location eastus

# Create App Service plan
az appservice plan create \
  --name notes-app-plan \
  --resource-group notes-app-rg \
  --sku F1 \
  --is-linux

# Create Web App with Node 18
az webapp create \
  --name notes-app-backend-unique \
  --resource-group notes-app-rg \
  --plan notes-app-plan \
  --runtime "NODE:18-lts"

# Configure deployment from GitHub
az webapp deployment source config \
  --name notes-app-backend-unique \
  --resource-group notes-app-rg \
  --repo-url https://github.com/Ishtiak2/notes-app \
  --branch main \
  --manual-integration

# Set environment variables
az webapp config appsettings set \
  --name notes-app-backend-unique \
  --resource-group notes-app-rg \
  --settings \
    DB_HOST="notes-app-db-ishtiakrahman13579-2cca.f.aivencloud.com" \
    DB_PORT="24692" \
    DB_USER="avnadmin" \
    DB_PASSWORD="<YOUR_AIVEN_PASSWORD>" \
    DB_NAME="defaultdb" \
    JWT_SECRET="<YOUR_JWT_SECRET>" \
    PORT="8080" \
    NODE_ENV="production" \
    FRONTEND_URL="https://notes-app-virid-psi.vercel.app"

# Set startup command
az webapp config set \
  --name notes-app-backend-unique \
  --resource-group notes-app-rg \
  --startup-file "cd backend && node server.js"
```

---

## 🔍 Troubleshooting

### Backend not starting?

**Check logs:**
```bash
# Via Azure Portal
1. Go to your Web App
2. Click "Log stream" (left sidebar)
3. Watch for errors

# Via CLI
az webapp log tail \
  --name notes-app-backend-unique \
  --resource-group notes-app-rg
```

### Database connection issues?

**Test connection:**
1. Check if SSL is properly configured in `backend/db.js`
2. Verify environment variables in Azure Portal → Configuration
3. Check Aiven dashboard for connection limits

### CORS errors?

1. Verify `FRONTEND_URL` environment variable matches Vercel URL exactly
2. Check that `backend/server.js` CORS configuration includes your Vercel URL
3. Restart the Web App: Azure Portal → Overview → Restart

---

## 💰 Cost Summary

| Tier | Monthly Cost | Features |
|------|--------------|----------|
| **Free F1** | **$0** | 60 CPU minutes/day, 1GB RAM, stops after inactivity |
| **Basic B1** | **~$13** | Always-on, 1.75GB RAM, custom domains |

**Recommendation**: 
- Start with **Free F1** (saves your credits)
- Upgrade to **Basic B1** if you need always-on (better performance)

---

## ✅ Final Checklist

- [ ] Update `backend/db.js` with SSL configuration
- [ ] Commit and push changes to GitHub
- [ ] Create Azure Web App via Portal or CLI
- [ ] Configure GitHub deployment
- [ ] Add environment variables in Azure
- [ ] Set startup command
- [ ] Wait for deployment to complete
- [ ] Test backend API endpoints
- [ ] Update frontend with backend URL
- [ ] Test full app end-to-end

---

## 🎉 After Deployment

Your app will be:

```
Frontend: https://notes-app-virid-psi.vercel.app/
Backend:  https://notes-app-backend-unique.azurewebsites.net
Database: notes-app-db-ishtiakrahman13579-2cca.f.aivencloud.com:24692

Full Stack: Live and working! 🚀
```

---

## 📞 Quick Commands Reference

```bash
# View logs
az webapp log tail -n notes-app-backend-unique -g notes-app-rg

# Restart app
az webapp restart -n notes-app-backend-unique -g notes-app-rg

# View settings
az webapp config appsettings list -n notes-app-backend-unique -g notes-app-rg

# Delete if needed
az group delete -n notes-app-rg --yes
```

---

**Ready to deploy? Start with Step 1!** 🚀

Let me know if you encounter any issues during deployment!
