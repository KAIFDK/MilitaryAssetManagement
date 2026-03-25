# Vercel Deployment - Setup Summary

This document summarizes all the changes made to prepare MilitaryAssetManagement for Vercel deployment.

## Changes Made

### 1. **Client Configuration**

#### File: `client/src/lib/api.ts`
- Updated API base URL to use environment variable `VITE_API_BASE_URL`
- Falls back to `http://localhost:5000/api` for local development
- Allows dynamic API configuration based on deployment environment

#### File: `client/vite.config.ts`
- Added production build optimization settings
- Configured Terser minification
- Set output directory to `dist`
- Added proxy configuration for local development API calls

#### File: `client/vercel.json`
- Created Vercel-specific configuration for the client
- Set Vite as the framework with proper build command

#### File: `client/package.json`
- No changes needed - already has proper build scripts

### 2. **Server Configuration**

#### File: `server/src/index.ts`
- Added module export of the Express `app` for Vercel compatibility
- Kept local server startup logic for development
- Uses `require.main === module` check to distinguish local vs. Vercel environments

#### File: `server/package.json`
- Added `build` script: `tsc` (TypeScript compilation)
- Added `start` script: `node dist/index.js` (production startup)
- Added `@vercel/node` types to devDependencies for serverless function support

#### File: `server/vercel.json`
- Created Vercel configuration for the server
- Sets Express as framework with TypeScript build

#### File: `server/prisma/schema.prisma`
- Updated to use environment variables for database provider and URL
- Changed from hardcoded SQLite to dynamic configuration:
  - `provider = env("DATABASE_PROVIDER")`
  - `url = env("DATABASE_URL")`
- Allows SQLite for development and PostgreSQL for production

#### File: `server/api/index.ts`
- Created Vercel serverless function handler for API routes
- Provides compatibility with Vercel's function-based architecture

### 3. **Root Project Configuration**

#### File: `package.json`
- Restructured as proper monorepo configuration
- Added `scripts` section with:
  - `dev`: Concurrently run client and server
  - `build:all`: Build both projects
  - `build:client` and `build:server`: Individual build commands
  - `install:all`: Install dependencies for all projects
- Added `concurrently` to devDependencies for parallel task execution

#### File: `vercel.json`
- Comprehensive Vercel deployment configuration
- Defined builds for both client (Vite) and server (Node.js)
- Set up API routes to use Express backend
- Configured environment variables with `@` references
- Proper route handling for SPA and API endpoints

### 4. **Environment Variables**

#### File: `.env.example`
- Production environment template
- Documented all required environment variables:
  - `DATABASE_PROVIDER`: PostgreSQL for production
  - `DATABASE_URL`: PostgreSQL connection string
  - `JWT_SECRET`: Authentication secret
  - `VITE_API_BASE_URL`: Frontend API endpoint

#### File: `.env.local.example`
- Development environment template
- Uses SQLite for local database
- Localhost configuration for API calls
- Easy copy to `.env.local` for local development

### 5. **Project Documentation**

#### File: `VERCEL_DEPLOYMENT.md`
Comprehensive deployment guide including:
- Prerequisites (Vercel account, GitHub, PostgreSQL)
- Step-by-step deployment instructions
- Environment variable setup
- Database initialization
- Troubleshooting guide
- Useful commands reference

#### File: `DEPLOYMENT_CHECKLIST.md`
Pre-deployment verification checklist:
- Code setup requirements
- Client and server configuration checks
- Database setup verification
- Dependencies audit
- Vercel configuration review
- Local testing procedures
- Environment variables list
- Post-deployment testing
- Troubleshooting tips

#### File: `.gitignore`
- Root-level .gitignore to exclude:
  - Dependencies and build outputs
  - Environment files
  - IDE configurations
  - Vercel artifacts
  - Database files

#### File: `setup-env.sh` and `setup-env.bat`
- Automation scripts for environment setup
- Available for both Unix/Linux/Mac and Windows
- Interactive menu for selecting environment type
- Quick reference for PostgreSQL provider URLs

## Key Features Enabled

### ✅ Environment-Based Configuration
- Different database configurations for development and production
- Dynamic API endpoint configuration
- Secure secret management via Vercel environment variables

### ✅ Production-Ready Build
- TypeScript compilation for server
- Vite optimization for client
- Proper output directory structure

### ✅ Monorepo Support
- Root-level package.json manages dependencies
- Concurrent development with client and server
- Coordinated builds for production

### ✅ Serverless Compatibility
- Express app exports for Vercel Functions
- Proper handling of serverless environment
- API routes separated from static content

### ✅ Database Flexibility
- SQLite for local development (lightweight, no setup)
- PostgreSQL for production (scalable, managed)
- Environment-driven provider selection

## How to Use

### For Local Development
```bash
# One-time setup
npm run install:all

# Run local environment setup
./setup-env.sh  # or setup-env.bat on Windows

# Start development (client on port 3000, server on port 5000)
npm run dev
```

### For Vercel Deployment
```bash
# 1. Ensure all changes are pushed to GitHub
git push origin main

# 2. Go to vercel.com/new and import repository
# 3. Add environment variables in Vercel dashboard
#    - DATABASE_PROVIDER=postgresql
#    - DATABASE_URL=<postgres-connection-string>
#    - JWT_SECRET=<generated-secret>
#    - VITE_API_BASE_URL=https://<vercel-url>/api

# 4. Deploy (automatic or manual via vercel CLI)
vercel
```

## Environment Variables Summary

### Development (.env.local)
- `DATABASE_PROVIDER=sqlite`
- `DATABASE_URL=file:./prisma/dev.db`
- `JWT_SECRET=local_dev_secret_key`
- `VITE_API_BASE_URL=http://localhost:5000/api`
- `PORT=5000`

### Production (Vercel)
- `DATABASE_PROVIDER=postgresql`
- `DATABASE_URL=<postgres-connection-string>`
- `JWT_SECRET=<secure-random-string>`
- `VITE_API_BASE_URL=https://<vercel-url>/api`

## Database Setup

### Development
- SQLite (automatic, no setup required)
- Database file: `server/prisma/dev.db`

### Production (Choose One)
- **Neon** (Recommended): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **CockroachDB**: https://cockroachlabs.com

## Next Steps

1. **Review Configuration**: Check all files match your project structure
2. **Test Locally**: Run `npm run install:all && npm run dev`
3. **Set Up Database**: Choose PostgreSQL provider for production
4. **Push to GitHub**: Ensure all code is in a GitHub repository
5. **Deploy to Vercel**: 
   - Visit vercel.com/new
   - Import your GitHub repository
   - Add environment variables
   - Deploy
6. **Verify Deployment**: Test API endpoints and frontend

## Support

Refer to these files for detailed information:
- `VERCEL_DEPLOYMENT.md` - Complete deployment walkthrough
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment verification
- `setup-env.sh` / `setup-env.bat` - Environment setup helpers

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Authentication**: JWT
- **Deployment**: Vercel (Serverless Functions)
