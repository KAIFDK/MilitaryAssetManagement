# Quick Start - Vercel Deployment

## 5-Minute Setup

### Local Development
```bash
# 1. Install all dependencies
npm run install:all

# 2. Set up environment for local development
cp .env.local.example .env.local

# 3. Start development (client + server)
npm run dev
```
Client: http://localhost:3000  
Server: http://localhost:5000

### Deploy to Vercel

#### Step 1: Prepare
```bash
# Push code to GitHub
git add .
git commit -m "Vercel deployment ready"
git push origin main
```

#### Step 2: Create PostgreSQL Database
Choose one and create a database:
- **Neon**: https://neon.tech → Create project
- **Supabase**: https://supabase.com → Create project  
- **Railway**: https://railway.app → Add PostgreSQL

Copy your PostgreSQL connection string.

#### Step 3: Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Set these environment variables:
   - `DATABASE_PROVIDER`: `postgresql`
   - `DATABASE_URL`: Paste your PostgreSQL connection string
   - `JWT_SECRET`: Generate a random string with:
     ```bash
     # Unix/Mac
     openssl rand -base64 32
     
     # Windows PowerShell
     [Convert]::ToBase64String([byte[]][System.Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
     ```
   - `VITE_API_BASE_URL`: (Leave blank for now, Vercel will auto-populate after first deploy)

4. Click "Deploy"

#### Step 4: Initialize Database
After deployment succeeds:
```bash
# Connect to Vercel
npx vercel link

# Push database schema to PostgreSQL
npx prisma db push

# (Optional) Seed initial data
npx prisma db seed
```

## Project Structure
```
MilitaryAssetManagement/
├── client/          # React frontend (port 3000)
├── server/          # Express API (port 5000)
├── vercel.json      # Deployment config
├── .env.example     # Production env template
├── .env.local.example  # Development env template
└── VERCEL_DEPLOYMENT.md  # Detailed guide
```

## Available Commands

```bash
# Development
npm run dev              # Start both client & server
npm run install:all     # Install all dependencies
npm run build:all       # Build for production

# Client only
cd client && npm run dev      # Client dev server
cd client && npm run build    # Build client

# Server only
cd server && npm run dev      # Server dev with auto-reload
cd server && npm run build    # Build server
cd server && npm start        # Start built server
```

## Environment Variables

### Local (.env.local)
```env
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=dev_secret
VITE_API_BASE_URL=http://localhost:5000/api
PORT=5000
```

### Vercel (Set in Dashboard)
```env
DATABASE_PROVIDER=postgresql
DATABASE_URL=<your-postgres-connection>
JWT_SECRET=<your-generated-secret>
VITE_API_BASE_URL=https://<your-app>.vercel.app/api
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `PORT already in use` | Change PORT in .env.local or kill process on 5000 |
| `Database connection failed` | Check DATABASE_URL matches your PostgreSQL provider |
| `API calls return 404` | Verify VITE_API_BASE_URL is set correctly |
| `Failed to build` | Check `vercel logs` or look at Vercel dashboard build logs |
| `Slow first request` | Normal for serverless - first request initializes function (1-2s) |

## Next Steps

1. ✅ Set up local development environment
2. ✅ Deploy to Vercel
3. ✅ Test API health: `https://<your-app>.vercel.app/api/health`
4. ✅ Test frontend loads and can call API
5. ✅ Monitor Vercel dashboard for any errors

## More Information

- **Full Deployment Guide**: See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- **Pre-Deployment Checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Setup Details**: See [DEPLOYMENT_SETUP_SUMMARY.md](./DEPLOYMENT_SETUP_SUMMARY.md)
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs/
