# UBAS FinTrust — Go‑Live Guide (ubasfintrust.com)

This walks you through deploying the API and SPA using your domain.

## Domains
- SPA (frontend): https://ubasfintrust.com
- API (backend): https://api.ubasfintrust.com

## Option A — Easier for most clients (Free-ish cloud)
- API: Deploy on Railway or Render (managed Postgres + Redis available)
- SPA: Deploy on Vercel or Netlify (global CDN)

Steps (Railway + Vercel example)
1) Provision Postgres + Redis on Railway. Copy DATABASE_URL and REDIS_URL.
2) Create a Railway service from clean/server.
3) In Railway → Variables, set:
   - NODE_ENV=production
   - DATABASE_URL=…
   - REDIS_URL=…
   - JWT_SECRET, JWT_REFRESH_SECRET, SESSION_SECRET (long random)
   - ALLOWED_ORIGINS=https://ubasfintrust.com,https://www.ubasfintrust.com
   - SOCKET_IO_CORS_ORIGIN=https://ubasfintrust.com
   - ADMIN_EMAIL=admin@ubasfintrust.com, ADMIN_PASSWORD=Strong#Password1
4) Build server then run migrations (Railway Shell → npm run build; npm run migrate).
5) Add a custom domain to Railway service: api.ubasfintrust.com → set DNS A/CNAME as instructed.
6) Confirm API health: https://api.ubasfintrust.com/health.
7) Deploy SPA on Vercel from clean/ (root). Set Project Env:
   - VITE_API_URL=https://api.ubasfintrust.com/api/v1
   - VITE_SOCKET_URL=https://api.ubasfintrust.com
   - VITE_NODE_ENV=production
8) Add custom domain: ubasfintrust.com (and www.ubasfintrust.com) → follow Vercel DNS steps.
9) Open ubasfintrust.com and test login/register.

## Option B — cPanel hosting
- Best for SPA only; API needs Node app support and an external Postgres + Redis (often not available on shared cPanel).

Steps
1) API: Use an external host (Railway/Render/Fly.io) for Node + Postgres + Redis.
2) SPA: Build locally (npm run build in clean/) and upload dist/ via cPanel’s File Manager.
3) In cPanel → Domains, point ubasfintrust.com to the folder serving the SPA (dist/ on the server).
4) Set SPA env at build time: ensure .env.production has API pointing to https://api.ubasfintrust.com.
5) Verify CORS: ALLOWED_ORIGINS must include https://ubasfintrust.com.

## Exact env blocks

Server (Railway/Render)
- NODE_ENV=production
- DATABASE_URL=postgres://… (from your provider)
- REDIS_URL=redis://… (from your provider)
- JWT_SECRET=…
- JWT_REFRESH_SECRET=…
- SESSION_SECRET=…
- ALLOWED_ORIGINS=https://ubasfintrust.com,https://www.ubasfintrust.com
- SOCKET_IO_CORS_ORIGIN=https://ubasfintrust.com
- ADMIN_EMAIL=admin@ubasfintrust.com
- ADMIN_PASSWORD=Strong#Password1

Frontend (Vercel/Netlify)
- VITE_API_URL=https://api.ubasfintrust.com/api/v1
- VITE_SOCKET_URL=https://api.ubasfintrust.com
- VITE_NODE_ENV=production

## DNS
- api.ubasfintrust.com → CNAME to your API host (Railway/Render subdomain) or A record as instructed.
- ubasfintrust.com, www.ubasfintrust.com → CNAME/A to your SPA host (Vercel/Netlify) per provider docs.

## Smoke tests
- https://api.ubasfintrust.com/health → healthy
- SPA → login/register; admin login; account/transactions list

## Tips
- Keep ALLOWED_ORIGINS exact (no wildcards)
- Use HTTPS everywhere
- Rotate secrets periodically

If you want, I can fill the API host’s environment UI with these values and prepare a one-click migration step list.
