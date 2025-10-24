# 📝 Quick Reference Card - Deployment

## 🎯 Your Deployment Stack

```
Frontend (Vercel)  →  Backend (Render)  →  Database (Aiven)
    Static             Node.js + Express       MySQL 8
    Free Plan          Free 750hrs/mo          Free 5GB
```

---

## 🚀 Deployment Order

1. **Aiven** - Create MySQL database (5 min)
2. **Render** - Deploy backend (7 min)
3. **Update** - Frontend config (2 min)
4. **Vercel** - Deploy frontend (3 min)
5. **Link** - Update CORS (2 min)

**Total**: ~20 minutes

---

## 📋 Environment Variables Needed

### Render Backend (.env)
```bash
DB_HOST=mysql-xxxxx.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=your-password
DB_NAME=defaultdb
DB_SSL=true
JWT_SECRET=random-32-char-string
PORT=3000
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend Config (config.js)
```javascript
API_URL: 'https://notes-app-backend.onrender.com'
```

---

## 🔗 Service URLs

| Service | Dashboard | Docs |
|---------|-----------|------|
| **Aiven** | [console.aiven.io](https://console.aiven.io) | [docs.aiven.io](https://docs.aiven.io) |
| **Render** | [dashboard.render.com](https://dashboard.render.com) | [render.com/docs](https://render.com/docs) |
| **Vercel** | [vercel.com/dashboard](https://vercel.com/dashboard) | [vercel.com/docs](https://vercel.com/docs) |

---

## ⚡ Quick Commands

### Deploy Updates
```bash
git add .
git commit -m "Your message"
git push origin main
# Both Render & Vercel auto-deploy ✅
```

### View Logs
```bash
# Render: Dashboard → Service → Logs
# Vercel: Dashboard → Project → Deployments → Logs
```

### Rollback
```bash
# Render: Dashboard → Redeploy previous version
# Vercel: Dashboard → Deployments → Previous → Promote
```

---

## 🐛 Common Issues & Fixes

### Backend Sleeping (Render)
**Problem**: First request takes 30-60 seconds  
**Fix**: Use [UptimeRobot](https://uptimerobot.com) - ping every 14 min

### CORS Error
**Problem**: Frontend can't access backend  
**Fix**: Update `FRONTEND_URL` in Render to match Vercel URL exactly

### Database Connection
**Problem**: Backend can't connect to Aiven  
**Fix**: Verify `DB_SSL=true` and all credentials are correct

### 404 on Routes
**Problem**: Frontend routes not working  
**Fix**: Check `vercel.json` routes configuration

---

## 📊 Free Tier Limits

| Service | Limit | Notes |
|---------|-------|-------|
| **Render** | 750hrs/month | Sleeps after 15min idle |
| **Aiven** | 5GB storage | Powers off after 3mo idle |
| **Vercel** | 100GB bandwidth | No sleep, instant |

---

## 🎯 After Deployment Checklist

- [ ] All 3 services created
- [ ] Database schema imported
- [ ] Backend environment variables set
- [ ] Frontend config updated
- [ ] CORS configured
- [ ] App tested end-to-end
- [ ] UptimeRobot configured (optional)
- [ ] README updated with live URL
- [ ] GitHub repo description updated

---

## 📞 Support

- **Render Discord**: [discord.gg/render](https://discord.gg/render)
- **Aiven Support**: [help.aiven.io](https://help.aiven.io)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

---

## 🔒 Security Checklist

- [ ] Strong JWT_SECRET (32+ chars)
- [ ] Aiven credentials secured
- [ ] `.env` in `.gitignore`
- [ ] SSL enabled (`DB_SSL=true`)
- [ ] CORS restricted to your frontend URL
- [ ] Passwords hashed with bcrypt
- [ ] No secrets in frontend code

---

## 🎓 Your App Features

✅ User authentication (JWT)  
✅ CRUD notes operations  
✅ Real-time search  
✅ Profile management  
✅ Password encryption  
✅ SSL/TLS encryption  
✅ Production-ready database  
✅ Global CDN delivery  
✅ Auto-deployment  

---

**Save this for quick reference during deployment!** 📌
