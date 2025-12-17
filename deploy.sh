#!/bin/bash

echo "🚀 Starting Deployment Process..."

# 1. Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Build the application
echo "🏗️  Building the application..."
npm run build

# 4. Restart Application (assuming PM2)
echo "🔄 Restarting application..."
if command -v pm2 &> /dev/null; then
    pm2 restart vet-os || pm2 start npm --name "vet-os" -- start
    echo "✅ Application restarted via PM2."
else
    echo "⚠️  PM2 not found. Please restart your application manually (e.g., npm start)."
fi

echo "✨ Deployment Complete!"
