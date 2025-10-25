# ⚡ Quick Deployment Reference

## 🎯 Step-by-Step Checklist

### 1️⃣ Database (Aiven) - 10 minutes
```bash
1. Go to https://aiven.io
2. Sign up (free, no credit card)
3. Create MySQL service (Free plan)
4. Wait 2-3 minutes
5. Copy credentials from dashboard
6. Run schema from database/schema.sql
```

**Save these:**
```
Host: _____________________.aivencloud.com
Port: _____
User: avnadmin
Password: _____________________
Database: notes_app
```

---

### 2️⃣ Backend (Azure Container Instances) - 20 minutes

**Prerequisites:**
```bash
# Install Azure CLI
brew install azure-cli

# Login
az login
```

**Option A: Automated Script** ✨
```bash
cd backend

# 1. Edit deploy-azure.sh and update:
#    - DB_HOST, DB_USER, DB_PASSWORD, DB_PORT (from Aiven)
#    - JWT_SECRET (generate random string)
#    - DNS_NAME (must be globally unique)

# 2. Run deployment
./deploy-azure.sh
```

**Option B: Manual Commands**
```bash
cd backend

# 1. Create Resource Group
az group create --name notes-app-rg --location eastus

# 2. Create Container Registry
az acr create --resource-group notes-app-rg --name notesappregistry --sku Basic --admin-enabled true

# 3. Build & Push Image
az acr build --registry notesappregistry --image notes-backend:latest --file Dockerfile .

# 4. Get ACR credentials
az acr credential show --name notesappregistry

# 5. Deploy Container (update environment variables!)
az container create \
  --resource-group notes-app-rg \
  --name notes-backend \
  --image notesappregistry.azurecr.io/notes-backend:latest \
  --registry-login-server notesappregistry.azurecr.io \
  --registry-username <from-step-4> \
  --registry-password <from-step-4> \
  --dns-name-label notes-app-backend-unique \
  --ports 3000 \
  --cpu 1 \
  --memory 1.5 \
  --environment-variables \
    DB_HOST='<your-aiven-host>' \
    DB_USER='avnadmin' \
    DB_PASSWORD='<your-aiven-password>' \
    DB_NAME='notes_app' \
    DB_PORT='<your-aiven-port>' \
    JWT_SECRET='<random-secret-string>' \
    PORT='3000' \
    NODE_ENV='production'

# 6. Get Backend URL
az container show --resource-group notes-app-rg --name notes-backend --query ipAddress.fqdn --output tsv
```

**Save this:**
```
Backend URL: http://__________________.eastus.azurecontainer.io:3000
```

---

### 3️⃣ Frontend (Vercel) - 5 minutes

**Before deploying:**
```bash
# Update API URLs in your code
# Edit frontend/js/main.js line 2:
const API_URL = 'http://<your-backend-url>.eastus.azurecontainer.io:3000';

# Edit frontend/js/profile.js (multiple fetch calls):
# Replace all 'http://localhost:3000' with your backend URL

# Commit changes
git add .
git commit -m "Update API URLs for production"
git push origin main
```

**Deploy to Vercel:**
```bash
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select "Ishtiak2/notes-app"
5. Configure:
   - Root Directory: frontend
   - Framework: Other
   - Build Command: (leave empty)
   - Output Directory: .
6. Click "Deploy"
```

**Save this:**
```
Frontend URL: https://__________________.vercel.app
```

---

### 4️⃣ Update CORS (Final Step) - 5 minutes

After getting Vercel URL, update backend:

```bash
# Edit backend/deploy-azure.sh
# Update this line:
FRONTEND_URL="https://your-actual-app.vercel.app"

# Redeploy
cd backend
./deploy-azure.sh
```

**OR manually:**
```bash
az container delete --resource-group notes-app-rg --name notes-backend --yes

# Then run the create command again with updated FRONTEND_URL
```

---

## 🧪 Testing

### Test Database
```bash
mysql -h <aiven-host>.aivencloud.com -P <port> -u avnadmin -p notes_app
```

### Test Backend
```bash
# Health check
curl http://<backend-url>:3000

# Register
curl -X POST http://<backend-url>:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://<backend-url>:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### Test Frontend
```
Open: https://your-app.vercel.app
1. Register new account
2. Login
3. Create note
4. Search notes
5. Edit profile
```

---

## 🔄 Updates & Redeployment

### Update Backend Code
```bash
git add .
git commit -m "Update backend"
git push

cd backend
az acr build --registry notesappregistry --image notes-backend:latest --file Dockerfile .
az container restart --resource-group notes-app-rg --name notes-backend
```

### Update Frontend Code
```bash
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys!
```

---

## 📊 Monitoring

### View Backend Logs
```bash
az container logs --resource-group notes-app-rg --name notes-backend

# Live logs
az container attach --resource-group notes-app-rg --name notes-backend
```

### Check Costs
```bash
az consumption usage list --output table
```

### View Resources
```bash
az resource list --resource-group notes-app-rg --output table
```

---

## 🆘 Troubleshooting

### Backend not responding
```bash
# Check status
az container show --resource-group notes-app-rg --name notes-backend --query instanceView.state

# Restart
az container restart --resource-group notes-app-rg --name notes-backend

# View logs
az container logs --resource-group notes-app-rg --name notes-backend
```

### CORS errors
1. Check FRONTEND_URL environment variable
2. Verify Vercel URL is correct
3. Redeploy container with updated URL

### Database connection failed
1. Check Aiven service status
2. Verify credentials in Azure environment variables
3. Test connection manually with mysql client

---

## 💰 Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| Aiven MySQL | $0 | Free tier (5GB storage) |
| Vercel | $0 | Free tier (100GB bandwidth) |
| Azure Container | ~$6-8/month | 1 vCPU, 1.5GB RAM |
| **Total** | **~$6-8/month** | **12-16+ months with $100 credits** |

---

## 🎯 Production URLs

Once deployed, save these:

```
Frontend: https://__________________.vercel.app
Backend:  http://__________________.eastus.azurecontainer.io:3000
Database: __________________.aivencloud.com

GitHub:   https://github.com/Ishtiak2/notes-app
```

---

## ⚡ One-Line Commands

```bash
# Full backend deployment
cd backend && ./deploy-azure.sh

# View logs
az container logs -g notes-app-rg -n notes-backend

# Restart backend
az container restart -g notes-app-rg -n notes-backend

# Delete all (if needed)
az group delete -n notes-app-rg --yes
```

---

## 📚 Useful Links

- **Aiven Console**: https://console.aiven.io
- **Azure Portal**: https://portal.azure.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Full Guide**: See DEPLOYMENT-GUIDE-OPTIMIZED.md

---

**🚀 Ready? Start with Step 1 (Aiven Database)!**
