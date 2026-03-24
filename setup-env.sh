#!/bin/bash
# This script helps set up environment variables for local development

echo "=== Military Asset Management - Environment Setup ===="
echo ""
echo "Select environment setup:"
echo "1) Local Development (SQLite)"
echo "2) Production (PostgreSQL - Neon)"
echo "3) Production (PostgreSQL - Supabase)"
echo "4) Production (PostgreSQL - Railway)"
echo ""
read -p "Enter option (1-4): " choice

case $choice in
  1)
    echo "Setting up local development environment..."
    cp .env.local.example .env.local
    echo "✓ Created .env.local for local development"
    echo ""
    echo "To start development:"
    echo "  npm run install:all  # Install dependencies"
    echo "  npm run dev          # Start client and server"
    ;;
  2|3|4)
    echo "For production deployment:"
    echo ""
    echo "1. Create a PostgreSQL database from:"
    if [ $choice -eq 2 ]; then
      echo "   https://neon.tech (click 'Create a project')"
    elif [ $choice -eq 3 ]; then
      echo "   https://supabase.com (create new project)"
    else
      echo "   https://railway.app (create new project)"
    fi
    echo ""
    echo "2. Copy the PostgreSQL connection string"
    echo ""
    echo "3. Set environment variables in .env.production:"
    echo "   DATABASE_PROVIDER=postgresql"
    echo "   DATABASE_URL=<your-connection-string>"
    echo "   JWT_SECRET=<generate-with-openssl-rand-base64-32>"
    echo "   VITE_API_BASE_URL=<your-vercel-url>/api"
    echo ""
    echo "4. Deploy to Vercel:"
    echo "   vercel"
    ;;
  *)
    echo "Invalid option"
    ;;
esac
