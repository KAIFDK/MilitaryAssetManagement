@echo off
REM This script helps set up environment variables for local development

echo.
echo === Military Asset Management - Environment Setup ===
echo.
echo Select environment setup:
echo 1) Local Development (SQLite)
echo 2) Production (PostgreSQL - Neon)
echo 3) Production (PostgreSQL - Supabase)
echo 4) Production (PostgreSQL - Railway)
echo.
set /p choice="Enter option (1-4): "

if "%choice%"=="1" (
    echo Setting up local development environment...
    copy .env.local.example .env.local >nul
    echo.
    echo Updated .env.local for local development
    echo.
    echo To start development:
    echo   npm run install:all  # Install dependencies
    echo   npm run dev          # Start client and server
) else if "%choice%"=="2" (
    echo For production deployment with Neon:
    echo.
    echo 1. Create a PostgreSQL database at: https://neon.tech
    echo    - Click "Create a project"
    echo.
    echo 2. Copy the PostgreSQL connection string
    echo.
    echo 3. Set environment variables in Vercel dashboard:
    echo    - DATABASE_PROVIDER: postgresql
    echo    - DATABASE_URL: ^<your-connection-string^>
    echo    - JWT_SECRET: ^<generate with: powershell [Convert]::ToBase64String([byte[]][System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))^>
    echo    - VITE_API_BASE_URL: ^<your-vercel-url^>/api
    echo.
    echo 4. Deploy to Vercel: vercel
) else if "%choice%"=="3" (
    echo For production deployment with Supabase:
    echo.
    echo 1. Create a PostgreSQL database at: https://supabase.com
    echo    - Click "New project"
    echo.
    echo 2. Get the connection string from Project Settings ^> Database
    echo.
    echo 3. Set environment variables in Vercel dashboard:
    echo    - DATABASE_PROVIDER: postgresql
    echo    - DATABASE_URL: ^<your-connection-string^>
    echo    - JWT_SECRET: ^<generate with: powershell [Convert]::ToBase64String([byte[]][System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))^>
    echo    - VITE_API_BASE_URL: ^<your-vercel-url^>/api
    echo.
    echo 4. Deploy to Vercel: vercel
) else if "%choice%"=="4" (
    echo For production deployment with Railway:
    echo.
    echo 1. Create a PostgreSQL database at: https://railway.app
    echo    - Add PostgreSQL plugin
    echo.
    echo 2. Copy the DATABASE_URL from variables
    echo.
    echo 3. Set environment variables in Vercel dashboard:
    echo    - DATABASE_PROVIDER: postgresql
    echo    - DATABASE_URL: ^<your-connection-string^>
    echo    - JWT_SECRET: ^<generate with: powershell [Convert]::ToBase64String([byte[]][System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))^>
    echo    - VITE_API_BASE_URL: ^<your-vercel-url^>/api
    echo.
    echo 4. Deploy to Vercel: vercel
) else (
    echo Invalid option
)

pause
