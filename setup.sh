#!/bin/bash

echo "🚀 Setting up Notes App..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install

echo "✅ Setup complete!"
echo ""
echo "🌟 Quick start commands:"
echo "  npm start     - Start both frontend and backend servers"
echo "  npm run dev   - Start in development mode with auto-reload"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:8000"
echo "  Backend:  http://localhost:3000"