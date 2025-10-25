# 🚀 Deployment Guide - Optimized Setup

**Stack**: Vercel (Frontend) + Azure Container Instances (Backend) + Aiven (Database)

**Estimated Cost**: ~$6-8/month (Azure credits last 12-16+ months)

---

## 📋 Prerequisites

- [x] GitHub account (already have - Ishtiak2)
- [x] Azure Student Pack ($100 credits)
- [ ] Vercel account (free)
- [ ] Aiven account (free)
- [ ] Docker installed locally (for testing)

---

## 🗄️ STEP 1: Deploy Database (Aiven MySQL)

### 1.1 Create Aiven Account
1. Go to https://aiven.io
2. Click "Sign Up" → Use GitHub or email
3. Select **Free Plan** (no credit card required)

### 1.2 Create MySQL Database
1. Click **"Create Service"**
2. Select **MySQL**
3. Choose **Free Plan**
   - Cloud: AWS (or any region close to you)
   - Region: Choose closest to your location (e.g., US East, EU West)
4. Service name: `notes-app-db`
5. Click **"Create Service"**
6. Wait 2-3 minutes for provisioning

### 1.3 Get Database Credentials
1. Once running, go to **"Overview"** tab
2. Note down:
   ```
   Host: <your-service>.aivencloud.com
   Port: <port-number>
   User: avnadmin
   Password: <shown-in-dashboard>
   Database: defaultdb
   ```

### 1.4 Create Database Schema
1. Click **"Connect"** → Choose **MySQL CLI** or use any MySQL client
2. Or use Aiven Console's **Query Editor**
3. Run your schema:

```sql
CREATE DATABASE IF NOT EXISTS notes_app;
USE notes_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 1.5 Enable SSL (Aiven provides free SSL)
1. Download SSL certificate from Aiven dashboard (if needed)
2. Keep connection string ready

✅ **Database Ready!**

---

## 🐳 STEP 2: Prepare Backend for Azure Container Instances

### 2.1 Create Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
```

### 2.2 Create .dockerignore

Create `backend/.dockerignore`:

```
node_modules
npm-debug.log
.env
.git
.gitignore
*.md
```

### 2.3 Update Backend for Production

Update `backend/server.js` - make sure it uses environment variables:

```javascript
const PORT = process.env.PORT || 3000;

// Update CORS to allow your Vercel frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true
}));
```

### 2.4 Test Docker Build Locally (Optional)

```bash
cd backend
docker build -t notes-app-backend .
docker run -p 3000:3000 --env-file .env notes-app-backend
```

✅ **Backend Docker Ready!**

---

## ☁️ STEP 3: Deploy Backend to Azure Container Instances

### 3.1 Install Azure CLI

```bash
# macOS
brew install azure-cli

# Or download from: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
```

### 3.2 Login to Azure

```bash
az login
```

This will open a browser - login with your student account.

### 3.3 Create Resource Group

```bash
az group create \
  --name notes-app-rg \
  --location eastus
```

### 3.4 Create Azure Container Registry (ACR)

```bash
# Create registry
az acr create \
  --resource-group notes-app-rg \
  --name notesappregistry \
  --sku Basic \
  --admin-enabled true

# Login to registry
az acr login --name notesappregistry
```

### 3.5 Build and Push Docker Image

```bash
cd backend

# Tag your image
docker build -t notesappregistry.azurecr.io/notes-backend:latest .

# Push to ACR
docker push notesappregistry.azurecr.io/notes-backend:latest
```

**OR** build directly in Azure:

```bash
cd backend

az acr build \
  --registry notesappregistry \
  --image notes-backend:latest \
  --file Dockerfile .
```

### 3.6 Get ACR Credentials

```bash
az acr credential show --name notesappregistry
```

Note down: `username` and `password`

### 3.7 Create Container Instance with Environment Variables

```bash
az container create \
  --resource-group notes-app-rg \
  --name notes-backend \
  --image notesappregistry.azurecr.io/notes-backend:latest \
  --registry-login-server notesappregistry.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password> \
  --dns-name-label notes-app-backend-unique \
  --ports 3000 \
  --cpu 1 \
  --memory 1.5 \
  --environment-variables \
    DB_HOST='<aiven-host>.aivencloud.com' \
    DB_USER='avnadmin' \
    DB_PASSWORD='<aiven-password>' \
    DB_NAME='notes_app' \
    DB_PORT='<aiven-port>' \
    JWT_SECRET='your-super-secret-jwt-key-change-this' \
    PORT='3000' \
    NODE_ENV='production'
```

### 3.8 Get Backend URL

```bash
az container show \
  --resource-group notes-app-rg \
  --name notes-backend \
  --query ipAddress.fqdn \
  --output tsv
```

Your backend URL will be: `http://<dns-name>.eastus.azurecontainer.io:3000`

### 3.9 Test Backend

```bash
curl http://<your-backend-url>.eastus.azurecontainer.io:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'
```

✅ **Backend Deployed on Azure!**

---

## 🌐 STEP 4: Deploy Frontend to Vercel

### 4.1 Prepare Frontend for Deployment

Create `frontend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 4.2 Update API URL in Frontend

Update `frontend/js/main.js`:

```javascript
// Update this line
const API_URL = 'http://<your-backend-url>.eastus.azurecontainer.io:3000';
```

Update `frontend/js/profile.js`:

```javascript
// Update all fetch calls to use your Azure backend URL
const API_BASE_URL = 'http://<your-backend-url>.eastus.azurecontainer.io:3000';
```

### 4.3 Push Changes to GitHub

```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

### 4.4 Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"** → Use GitHub
3. Click **"Import Project"**
4. Select your repository: `Ishtiak2/notes-app`
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Output Directory**: `.` (current directory)
6. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL = http://<your-backend-url>.eastus.azurecontainer.io:3000
   ```
7. Click **"Deploy"**

### 4.5 Update Backend CORS

After getting Vercel URL (e.g., `https://notes-app-xxx.vercel.app`), update Azure Container:

```bash
az container create \
  --resource-group notes-app-rg \
  --name notes-backend \
  --image notesappregistry.azurecr.io/notes-backend:latest \
  --registry-login-server notesappregistry.azurecr.io \
  --registry-username <acr-username> \
  --registry-password <acr-password> \
  --dns-name-label notes-app-backend-unique \
  --ports 3000 \
  --cpu 1 \
  --memory 1.5 \
  --environment-variables \
    DB_HOST='<aiven-host>.aivencloud.com' \
    DB_USER='avnadmin' \
    DB_PASSWORD='<aiven-password>' \
    DB_NAME='notes_app' \
    DB_PORT='<aiven-port>' \
    JWT_SECRET='your-super-secret-jwt-key-change-this' \
    PORT='3000' \
    NODE_ENV='production' \
    FRONTEND_URL='https://notes-app-xxx.vercel.app'
```

✅ **Frontend Deployed on Vercel!**

---

## 🔐 STEP 5: Configure CORS and Security

### 5.1 Update Backend CORS Configuration

Edit `backend/server.js`:

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://notes-app-xxx.vercel.app', // Your Vercel URL
  'http://localhost:8000' // For local development
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 5.2 Rebuild and Redeploy Backend

```bash
cd backend
az acr build \
  --registry notesappregistry \
  --image notes-backend:latest \
  --file Dockerfile .

# Restart container
az container restart \
  --resource-group notes-app-rg \
  --name notes-backend
```

✅ **Security Configured!**

---

## 🧪 STEP 6: Testing

### 6.1 Test Database Connection

```bash
# From your local machine
mysql -h <aiven-host>.aivencloud.com \
      -P <port> \
      -u avnadmin \
      -p \
      notes_app
```

### 6.2 Test Backend API

```bash
# Health check
curl http://<your-backend-url>.eastus.azurecontainer.io:3000

# Register test user
curl -X POST http://<your-backend-url>.eastus.azurecontainer.io:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 6.3 Test Frontend

1. Open your Vercel URL: `https://notes-app-xxx.vercel.app`
2. Test registration
3. Test login
4. Create a note
5. Test search
6. Test profile management

✅ **All Systems Go!**

---

## 📊 Monitor and Manage

### Monitor Azure Container

```bash
# View logs
az container logs \
  --resource-group notes-app-rg \
  --name notes-backend

# Check status
az container show \
  --resource-group notes-app-rg \
  --name notes-backend \
  --query "{Status:instanceView.state,IP:ipAddress.ip}" \
  --output table
```

### Monitor Aiven Database

1. Go to Aiven dashboard
2. View metrics, queries, and performance
3. Check storage usage (5GB limit on free tier)

### Monitor Vercel

1. Go to Vercel dashboard
2. View analytics, deployments, and logs
3. Check bandwidth usage (100GB/month on free tier)

---

## 💰 Cost Tracking

### Azure Container Instances Cost

```bash
# Check current month usage
az consumption usage list \
  --output table
```

**Estimated**: ~$6-8/month
- 1 vCPU: ~$0.0000125/second
- 1.5GB Memory: ~$0.00000125/second
- ~$5-8/month if running 24/7

### Check Remaining Credits

1. Go to Azure Portal
2. Navigate to Cost Management
3. View current spending

**Your $100 will last**: 12-16+ months

---

## 🔄 Updates and Redeployment

### Update Backend Code

```bash
# 1. Make changes locally
# 2. Commit to git
git add .
git commit -m "Update backend"
git push

# 3. Rebuild Docker image
cd backend
az acr build \
  --registry notesappregistry \
  --image notes-backend:latest \
  --file Dockerfile .

# 4. Restart container (it will pull the new image)
az container restart \
  --resource-group notes-app-rg \
  --name notes-backend
```

### Update Frontend Code

```bash
# 1. Make changes locally
# 2. Commit and push to GitHub
git add .
git commit -m "Update frontend"
git push

# 3. Vercel auto-deploys on push (no manual step needed!)
```

---

## 🛠️ Troubleshooting

### Backend Not Responding

```bash
# Check container status
az container show \
  --resource-group notes-app-rg \
  --name notes-backend

# View logs
az container logs \
  --resource-group notes-app-rg \
  --name notes-backend

# Restart container
az container restart \
  --resource-group notes-app-rg \
  --name notes-backend
```

### Database Connection Issues

1. Check Aiven dashboard for service status
2. Verify credentials in Azure environment variables
3. Check firewall rules (Aiven free tier allows all IPs by default)

### CORS Errors

1. Verify FRONTEND_URL environment variable in Azure
2. Check backend CORS configuration
3. Ensure Vercel URL is correct

---

## 📝 Important URLs

Save these for reference:

```
Database (Aiven): https://console.aiven.io
Backend (Azure): http://<dns-name>.eastus.azurecontainer.io:3000
Frontend (Vercel): https://notes-app-xxx.vercel.app
Azure Portal: https://portal.azure.com
```

---

## ✅ Deployment Checklist

- [ ] Aiven MySQL database created and schema loaded
- [ ] Backend Dockerfile created
- [ ] Azure CLI installed and logged in
- [ ] Azure Container Registry created
- [ ] Docker image built and pushed to ACR
- [ ] Container instance created with environment variables
- [ ] Backend URL obtained and tested
- [ ] Frontend API URL updated with backend URL
- [ ] Changes committed to GitHub
- [ ] Vercel account created and connected to GitHub
- [ ] Frontend deployed to Vercel
- [ ] Backend CORS updated with Vercel URL
- [ ] Full app tested end-to-end
- [ ] Monitoring set up

---

## 🎉 Congratulations!

Your app is now live with:
- ⚡ Fast frontend on Vercel CDN
- 🚀 Always-on backend on Azure
- 🗄️ Reliable database on Aiven
- 💰 Cost: ~$6-8/month (16+ months with your credits)

**Live URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `http://your-backend.eastus.azurecontainer.io:3000`
- Database: Managed by Aiven

---

## 🆘 Need Help?

Common commands quick reference:

```bash
# View all resources
az resource list --resource-group notes-app-rg --output table

# Delete everything (if needed)
az group delete --name notes-app-rg --yes --no-wait

# View container logs in real-time
az container attach \
  --resource-group notes-app-rg \
  --name notes-backend
```

Ready to deploy? Start with **STEP 1**! 🚀
