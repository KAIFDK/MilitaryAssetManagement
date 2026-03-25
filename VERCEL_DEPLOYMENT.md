# Vercel Deployment Guide

This project is configured for deployment to Vercel with both frontend (React) and backend (Express API) hosted together.

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Push your code to GitHub
3. **PostgreSQL Database** - Set up a PostgreSQL database (Neon, Supabase, Railway, etc.)

## Setup Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Vercel deployment ready"
git remote add origin <your-github-repo>
git branch -M main
git push -u origin main
```

### 2. Create PostgreSQL Database

Choose one of these providers:
- **Neon** (recommended): https://neon.tech
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app
- **CockroachDB**: https://www.cockroachlabs.com/

Copy your PostgreSQL connection string.

### 3. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select "Other" as the framework
4. Configure project settings:
   - **Root Directory**: Leave as `.` (root)
   - **Build Command**: `npm run build:all`
   - **Install Command**: `npm install`
   - **Output Directory**: `client/dist`

5. Add Environment Variables:
   ```
   DATABASE_PROVIDER=postgresql
   DATABASE_URL=<your-postgres-connection-string>
   JWT_SECRET=<generate-a-random-string>
   VITE_API_BASE_URL=https://<your-vercel-deployment-url>/api
   ```

6. Click "Deploy"

### 4. Set Up Database Schema

After deployment, run migrations:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Link your local project to Vercel
vercel link

# Run database migration (Prisma)
vercel env pull  # Pull environment variables
npx prisma db push  # Push schema to database
npx prisma db seed  # (Optional) Seed initial data
```

## Environment Variables

### Production (Vercel)
- `DATABASE_PROVIDER`: `postgresql`
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A random string for JWT signing
- `VITE_API_BASE_URL`: Your Vercel deployment URL + `/api`

### Local Development
Create a `.env.local` file:

```env
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=local_dev_secret
VITE_API_BASE_URL=http://localhost:5000/api
PORT=5000
```

## Development

### Local Development
```bash
npm install:all
npm run dev
```

This runs both the client and server concurrently.

### Building Locally
```bash
npm run build:all
```

## Troubleshooting

### Database Migration Errors
If you get database migration errors during deployment:

1. Ensure `DATABASE_PROVIDER` is set to `postgresql`
2. Verify the `DATABASE_URL` is correct
3. Run: `npx prisma db push` after connecting

### API Connection Issues
- Ensure `VITE_API_BASE_URL` matches your Vercel URL
- Check that the Express server is properly configured
- Verify CORS settings if using different domains

### Cold Start Issues
If experiencing slow initial loads:
- This is normal for serverless functions
- First request may take 1-2 seconds
- Subsequent requests will be faster

## Useful Commands

```bash
# View Vercel logs
vercel logs

# Pull environment variables locally
vercel env pull

# View deployment status
vercel status

# Redeploy
vercel deploy
```

## Project Structure

```
.
├── client/              # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/              # Express backend
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
├── vercel.json          # Vercel configuration
└── package.json         # Root monorepo configuration
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Express on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions/node-js)
