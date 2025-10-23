#!/bin/bash

echo "🚀 Notes App - Deployment Preparation"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not found. Initializing..."
    git init
    git add .
    git commit -m "Initial commit: Prepare for deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository exists"
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "⚠️  Uncommitted changes found. Committing..."
    git add .
    git commit -m "Prepare app for deployment"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Create accounts (if you haven't):"
echo "   - Railway: https://railway.app"
echo "   - Vercel: https://vercel.com"
echo ""
echo "2. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/notes-app.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy Backend (Railway):"
echo "   - Import your GitHub repo"
echo "   - Add MySQL database"
echo "   - Set environment variables (see DEPLOYMENT.md)"
echo "   - Deploy!"
echo ""
echo "4. Deploy Frontend (Vercel):"
echo "   - Import your GitHub repo"
echo "   - Set root directory to 'frontend'"
echo "   - Deploy!"
echo ""
echo "5. Update URLs:"
echo "   - Update FRONTEND_URL in Railway backend"
echo "   - Update API_URL in frontend/js/main.js and profile.js"
echo "   - Commit and push changes"
echo ""
echo "📖 Read DEPLOYMENT.md for detailed instructions"
echo ""
echo "✨ Your app is ready for deployment!"