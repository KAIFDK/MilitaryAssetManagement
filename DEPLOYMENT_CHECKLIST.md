# Pre-Deployment Checklist

Use this checklist to ensure your project is ready for Vercel deployment.

## Code Setup

- [ ] All source code is committed to Git
- [ ] `.env` file is NOT committed (only `.env.example` exists)
- [ ] `.gitignore` is properly configured
- [ ] No hardcoded secrets or API keys in code

## Client Configuration

- [ ] `VITE_API_BASE_URL` environment variable is used in API calls
- [ ] Client can build successfully (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Vite configuration is production-ready

## Server Configuration

- [ ] Server can build successfully (`npm run build`)
- [ ] `src/index.ts` exports the Express `app`
- [ ] All environment variables are documented in `.env.example`
- [ ] Prisma schema supports both SQLite (dev) and PostgreSQL (prod)
- [ ] JWT_SECRET is not hardcoded

## Database Setup

- [ ] PostgreSQL database is provisioned (Neon, Supabase, Railway, etc.)
- [ ] PostgreSQL connection string is ready
- [ ] `DATABASE_PROVIDER=postgresql` is set for production
- [ ] `DATABASE_URL` is ready for Vercel deployment
- [ ] Prisma migrations are tested locally

## Dependencies

- [ ] Root `package.json` has proper build scripts
- [ ] `npm run build:all` works locally
- [ ] All required packages are listed in package.json
- [ ] No peer dependency warnings
- [ ] `concurrently` is installed in root for development

## Vercel Configuration

- [ ] `vercel.json` is properly configured at root
- [ ] Environment variables are documented
- [ ] Build commands are correct
- [ ] Routes are properly configured
- [ ] All required environment variables are ready

## Testing Locally

```bash
# Install all dependencies
npm run install:all

# Build both client and server
npm run build:all

# Test server start (if needed)
cd server && npm start
```

## GitHub Repository

- [ ] Repository is public or Vercel has access
- [ ] All code is pushed to main branch
- [ ] No uncommitted changes

## Environment Variables to Set in Vercel

When deploying to Vercel, set these environment variables in the Project Settings:

1. **DATABASE_PROVIDER** - `postgresql`
2. **DATABASE_URL** - Your PostgreSQL connection string
3. **JWT_SECRET** - A random secure string (generate with `openssl rand -base64 32`)
4. **VITE_API_BASE_URL** - Your Vercel deployment URL (e.g., `https://your-proj.vercel.app/api`)

## Deployment Steps

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select root directory as `.`
4. Configure build settings:
   - Build Command: `npm run build:all`
   - Output Directory: Leave blank
5. Add environment variables
6. Deploy

## Post-Deployment

- [ ] Test API endpoints work (`https://your-url/api/health`)
- [ ] Frontend loads and can access API
- [ ] Authentication works
- [ ] Database operations work
- [ ] Check Vercel logs for errors
- [ ] Monitor initial performance

## Troubleshooting

If deployment fails, check:
1. Vercel build logs in the dashboard
2. Environment variables are set correctly
3. Database connection is working
4. PostgreSQL database is accessible from Vercel
5. All required packages are listed in package.json

For more help, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
