# Render Deployment Instructions (Walkthrough)

This walkthrough shows the minimal steps on Render using either the UI or the included `render.yaml` file.

## Option A: Use the UI (quick start)

1. Database
   - Create a Render PostgreSQL instance (free) or use Neon/Supabase.
   - Copy the connection string as `DATABASE_URL`.

2. Backend API (Web Service)
   - New Web Service → Connect your GitHub repo.
   - Root directory: `server`
   - Build Command (choose one):
     - `NPM_CONFIG_PRODUCTION=false npm ci && npm run build` (safest)
     - or, if `typescript` is in dependencies: `npm ci && npm run build`
   - Pre-Deploy Command: `npm run migrate:prod`
   - Start Command: `npm start`
   - Health Check Path: `/health`
   - Environment Variables:
     - `NODE_ENV=production`
     - `DATABASE_URL=postgres://...`
     - `JWT_SECRET` / `JWT_REFRESH_SECRET` / `SESSION_SECRET`
     - `ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com`

3. Frontend (Static Site)
   - New Static Site → Connect repo
   - Root directory: repo root
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`
   - Environment Variables: `VITE_API_URL=https://<your-api-host>/api/v1`

4. Verify (after deploy)
   - `curl -fsS https://<api-host>/health`
   - `curl -fsS https://<api-host>/health/readiness`
   - `export api_url="https://<api-host>/api/v1" && node scripts/system-check.mjs`

## Option B: Use render.yaml (IaC)

- The repo includes `render.yaml`. Enable "Infrastructure as Code" on Render to let pushes to `main` provision and deploy.
- Key items to check in `render.yaml`:
  - One service for the backend (type: web, root: `server`) with health path `/health`.
  - One static site for the frontend (root: repo root, publish: `dist`).
  - A managed PostgreSQL database resource.
  - Environment variables for the backend as listed above.

If anything fails, check Render logs and run the local system check script against your live `api_url` for immediate feedback.
