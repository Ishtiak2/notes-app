# 🚀 Deployment Guide - Notes App

This guide will help you deploy the Notes App using **100% FREE** hosting services.

## 📋 Overview

We'll use:
- **Railway.app** - Backend + MySQL Database (Free tier: $5 monthly credit)
- **Vercel** or **Netlify** - Frontend hosting (Free tier: unlimited)

**Alternative**: Use **Render.com** for both backend and database (Free tier available)

---

## 🎯 Option 1: Railway (Backend) + Vercel (Frontend) [RECOMMENDED]

### Part A: Deploy Backend to Railway

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify your account

#### Step 2: Create New Project
1. Click "**New Project**"
2. Select "**Deploy from GitHub repo**"
3. Choose your `notes-app` repository
4. Railway will detect it's a Node.js project

#### Step 3: Add MySQL Database
1. In your Railway project, click "**+ New**"
2. Select "**Database**" → "**Add MySQL**"
3. Railway will create a MySQL database instance

#### Step 4: Configure Environment Variables
1. Click on your backend service
2. Go to "**Variables**" tab
3. Add these variables:
   ```
   DATABASE_URL=${MYSQL_URL}
   JWT_SECRET=your-super-secret-key-here-make-it-long-and-random
   FRONTEND_URL=https://your-app.vercel.app
   PORT=3000
   NODE_ENV=production
   ```
   
   **Note**: `${MYSQL_URL}` will be auto-populated by Railway

#### Step 5: Set Root Directory
1. Go to "**Settings**" tab
2. Under "**Root Directory**", enter: `backend`
3. Under "**Start Command**", enter: `npm start`
4. Click "**Deploy**"

#### Step 6: Get Your Backend URL
1. Go to "**Settings**" → "**Networking**"
2. Click "**Generate Domain**"
3. Copy your backend URL (e.g., `https://notes-app-production.railway.app`)

#### Step 7: Import Database Schema
1. In Railway, click on your MySQL database
2. Go to "**Data**" tab or use "**Connect**" to get credentials
3. Use a MySQL client or Railway's CLI to run the schema:
   ```bash
   # Using Railway CLI
   railway connect
   # Then paste the contents of database/schema.sql
   ```

---

### Part B: Deploy Frontend to Vercel

#### Step 1: Update API URL in Frontend
1. Open `frontend/js/main.js`
2. Update the production URL:
   ```javascript
   const API_URL = window.location.hostname === 'localhost' 
       ? 'http://localhost:3000'
       : 'https://your-backend-url.railway.app'; // Your Railway URL here
   ```
3. Do the same in `frontend/js/profile.js`
4. Commit and push changes to GitHub

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "**Add New**" → "**Project**"
4. Import your `notes-app` repository
5. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Output Directory**: `.`
6. Click "**Deploy**"

#### Step 3: Update CORS in Railway
1. Go back to Railway
2. Update `FRONTEND_URL` variable to your Vercel URL
3. Redeploy if needed

---

## 🎯 Option 2: Render.com (Full Stack) [ALL-IN-ONE]

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub

#### Step 2: Create MySQL Database
1. Click "**New**" → "**PostgreSQL**" or use "**MySQL**" (via Docker)
2. Name it `notes-db`
3. Free tier available
4. Copy the **Internal Connection String**

#### Step 3: Deploy Backend
1. Click "**New**" → "**Web Service**"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `notes-app-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables:
   ```
   DATABASE_URL=<your-mysql-connection-string>
   JWT_SECRET=your-secret-key
   FRONTEND_URL=https://your-app.onrender.com
   PORT=3000
   ```
5. Click "**Create Web Service**"

#### Step 4: Deploy Frontend
1. Click "**New**" → "**Static Site**"
2. Connect same repository
3. Configure:
   - **Name**: `notes-app-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: (leave empty)
   - **Publish Directory**: `.`
4. Click "**Create Static Site**"

#### Step 5: Update URLs
1. Update backend `FRONTEND_URL` with your frontend URL
2. Update frontend `API_URL` with your backend URL
3. Push changes to GitHub (auto-deploys)

---

## 🎯 Option 3: Netlify (Frontend Alternative)

#### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "**Add new site**" → "**Import existing project**"
4. Choose your repository
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: (leave empty)
   - **Publish directory**: `frontend`
6. Click "**Deploy**"

#### Step 2: Configure Environment
1. Go to "**Site settings**" → "**Environment variables**"
2. Add: `BACKEND_URL` = your Railway backend URL
3. Redeploy if needed

---

## 🔑 Environment Variables Reference

### Backend (.env)
```bash
DATABASE_URL=mysql://user:pass@host:3306/dbname
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=https://your-frontend-url.vercel.app
PORT=3000
NODE_ENV=production
```

### Frontend
Update in `main.js` and `profile.js`:
```javascript
const API_URL = 'https://your-backend-url.railway.app';
```

---

## ✅ Post-Deployment Checklist

- [ ] Backend is running (check health endpoint: `https://your-backend.railway.app/health`)
- [ ] Database is connected and schema is imported
- [ ] Frontend can reach backend API
- [ ] User registration works
- [ ] Login works
- [ ] Notes CRUD operations work
- [ ] Profile management works
- [ ] Search functionality works
- [ ] CORS is properly configured

---

## 🐛 Troubleshooting

### Database Connection Issues
- Check `DATABASE_URL` format is correct
- Ensure database schema is imported
- Check Railway/Render database logs

### CORS Errors
- Verify `FRONTEND_URL` in backend matches actual frontend URL
- Check backend CORS configuration in `server.js`

### API Not Found (404)
- Verify backend URL is correct in frontend
- Check Railway deployment logs
- Ensure `/api` prefix is used in all endpoints

### Database Schema Not Applied
**Railway**:
```bash
railway connect
# Then paste schema contents
```

**Render**: Use the SQL editor in dashboard or connect via MySQL client

---

## 💰 Free Tier Limits

### Railway
- $5 monthly credit (free)
- ~500 hours runtime
- Sleeps after inactivity (wakes on request)

### Vercel
- Unlimited sites
- 100GB bandwidth/month
- No sleep mode

### Netlify
- 100GB bandwidth/month
- 300 build minutes/month
- No sleep mode

### Render
- 750 hours/month free
- Services sleep after 15 min inactivity
- Database persistent storage limited

---

## 🎉 You're Live!

Once deployed, your app will be accessible at:
- **Frontend**: `https://your-app.vercel.app` (or Netlify/Render)
- **Backend**: `https://your-backend.railway.app` (or Render)

Share your live app URL! 🚀

---

## 📝 Maintenance

### Update Application
1. Push changes to GitHub
2. Services auto-deploy (if enabled)
3. Or manually redeploy from dashboard

### Monitor Usage
- Check Railway/Render dashboard for usage stats
- Monitor logs for errors
- Set up uptime monitoring (uptimerobot.com - free)

---

## 🆘 Need Help?

- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Vercel Support: [vercel.com/support](https://vercel.com/support)
- Render Community: [community.render.com](https://community.render.com)

**Happy Deploying! 🎊**