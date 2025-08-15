# Free‑Tier Deployments Guide (UBAS Financial Trust)

This guide explains how to deploy your API (Node/Express) and frontend (Vite/React) using only free or nearly‑free services, step‑by‑step, in plain language—with the exact commands you can copy and paste.

If you can read, click, paste, and wait a little, you can ship a live app.

---

## What you’re deploying

- Backend API: Node.js (Express), lives in `server/`
- Health checks: `GET /health` (fast OK), `GET /health/readiness` (OK when DB ready)
- API base path: `/api/v1`
- Frontend: Vite + React (static site), lives at repo root, built into `dist/`
- Database: PostgreSQL via Knex (you can use Neon, Supabase, or Render PG)

Important environment variables:

- `NODE_ENV=production`
- `DATABASE_URL` (Postgres connection string)
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET` (long random strings)
- `ALLOWED_ORIGINS` (comma‑separated list of your frontend origins)

---

## The famous first‑deploy gotcha (TypeScript/migrations)

Many platforms don’t install devDependencies in production builds. If your deploy runs TypeScript at build time (tsc) or runs **.ts** migrations (ts-node) during deploy, the platform must have TypeScript available.

Fix it using ONE of these:

- Put `typescript` (and `ts-node` if you use it) in `dependencies` (not only `devDependencies`) in `server/package.json`.
- OR build with dev deps installed: `NPM_CONFIG_PRODUCTION=false npm ci && npm run build`
- OR precompile migrations to JavaScript and run the JS migrations in production.

We already moved `typescript` to runtime dependencies for you in `server/package.json` to make PaaS builds smoother.

---

## Quick verification commands (works everywhere)

- Health:

```bash
curl -fsS https://<api-host>/health
curl -fsS https://<api-host>/health/readiness
```

- End‑to‑end system check (uses your live API):

```bash
# You can use any of: api_url, API_BASE, or VITE_API_URL
export api_url="https://<api-host>/api/v1"
# Optional for deeper checks if you seeded an admin
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="SuperSecret123!"
node scripts/system-check.mjs
```

If a step fails, the script prints the reason. Use that and platform logs to fix quickly.

---

## Provider recipes (free or nearly‑free)

Choose one backend provider and one frontend provider. Databases can be separate.

### 1) Render (recommended for starters)

Why: Easy, free tier available, supports both API and static frontend.

- API (Web Service)
  - Root directory: `server`
  - Health Check Path: `/health`
  - Build Command (pick one):
    - Safer: `NPM_CONFIG_PRODUCTION=false npm ci && npm run build`
    - If `typescript` is in dependencies: `npm ci && npm run build`
  - Pre‑Deploy Command: `npm run migrate:prod`
  - Start Command: `npm start` (or `npm run start:deploy` if you want to run migrations there)
  - Env vars:
    - `NODE_ENV=production`
    - `DATABASE_URL=postgres://…` (Neon/Supabase or Render PG internal URL)
    - `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`
    - `ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com`

- Database
  - Easiest: Render PostgreSQL (free) or Neon (free). Copy the connection string to `DATABASE_URL`.
  - SSL: Your production config already sets `ssl: { rejectUnauthorized: false }` for hosted PG.

- Frontend (Static Site)
  - Root directory: repo root
  - Build Command: `npm ci && npm run build`
  - Publish Directory: `dist`
  - Env: `VITE_API_URL=https://<your-api-host>/api/v1`

- One‑shot via `render.yaml`
  - If you enable “Infrastructure as Code,” pushing to `main` provisions and deploys both services.

- Free tier notes
  - Free services may sleep; first request can be slow. Upgrade to Starter to reduce cold starts.

### 2) Railway

Why: Good DX, free starting credits.

- Create a project → Add PostgreSQL.
- Add service from GitHub; set root directory to `server`.
- Build: `NPM_CONFIG_PRODUCTION=false npm ci && npm run build` (or keep `typescript` in `dependencies`).
- Start: `node dist/server.js` (or `npm run start:deploy`).
- Variables: `DATABASE_URL`, `NODE_ENV`, `JWT_*`, `SESSION_SECRET`, `ALLOWED_ORIGINS`.
- Optional deploy hook: `npm run migrate:prod`.
- Frontend: Vercel/Netlify/Cloudflare Pages (free).

### 3) Fly.io (Docker; a bit more DIY)

Why: Free small VM + global edge; flexible.

```bash
# From the server/ folder
cd server
fly launch --no-deploy
# answer prompts; ensure internal port maps to process.env.PORT
fly secrets set \
  DATABASE_URL="postgres://..." \
  JWT_SECRET="..." \
  JWT_REFRESH_SECRET="..." \
  SESSION_SECRET="..." \
  ALLOWED_ORIGINS="https://your-frontend.vercel.app"
fly deploy

# Run migrations after deploy
fly ssh console
cd /app
npm run migrate:prod
exit
```

Frontend: Vercel/Netlify/Cloudflare Pages.

### 4) Zeet

Why: Nice UI; often credits/trial available.

- Import GitHub repo → set service root to `server`.
- Build: `NPM_CONFIG_PRODUCTION=false npm ci && npm run build` (or keep `typescript` in deps).
- Start: `node dist/server.js`.
- Health check: `/health`.
- DB: add Neon/Supabase/Render PG and set `DATABASE_URL`.
- Frontend: separate project here or on Vercel/Netlify/Pages.

### 5) Heroku (FYI: no true free tier now)

Why: Classic UX. Use if you have credits or student program.

```bash
heroku create
heroku addons:create heroku-postgresql:mini
heroku config:set \
  NODE_ENV=production \
  JWT_SECRET=... JWT_REFRESH_SECRET=... SESSION_SECRET=... \
  ALLOWED_ORIGINS="https://your-frontend.vercel.app"
# If you need devDeps to build TypeScript:
heroku config:set NPM_CONFIG_PRODUCTION=false
# Deploy your repo (ensure server/ is included)
git push heroku main
# Run migrations once
heroku run npm --prefix server run migrate:prod
```

Frontend: Netlify/Vercel/Pages.

---

## Frontend‑only free hosts

You can host the frontend anywhere that serves static files.

- Vercel
  - Import the repo → framework auto (Vite)
  - Build: `npm ci && npm run build`
  - Output: `dist`
  - Env: `VITE_API_URL=https://<api-host>/api/v1`

- Netlify
  - Use your existing `netlify.toml` or set:
    - Build command: `npm run build`
    - Publish directory: `dist`
  - Env: `VITE_API_URL=https://<api-host>/api/v1`

- Cloudflare Pages
  - Framework: Vite
  - Build: `npm run build`
  - Output: `dist`
  - Env: `VITE_API_URL=https://<api-host>/api/v1`

- GitHub Pages
  - Build locally and push `dist` to a gh-pages branch, or use an action.
  - Note: Pages is static only; your API must live elsewhere.

---

## Databases (free)

- Neon (Postgres): great free tier, serverless. Copy `DATABASE_URL` and use SSL.
- Supabase (Postgres + Auth + Storage): generous free tier, all‑in‑one.
- PlanetScale (MySQL): serverless, free dev; you’d need a MySQL client instead of Knex PG.
- MongoDB Atlas: free tier (if you move to Mongo later).
- Redis: Upstash (free).
- Object Storage: Cloudflare R2 (free egress to CF), Supabase Storage.

Tips:

- Prefer the provider’s “internal” or “direct” URL when API and DB are on the same platform.
- Otherwise, expect SSL and possibly IP allowlists.

---

## Security basics (still free)

- Never commit secrets to git—set them as environment variables on the platform.
- Use long random secrets for JWT and sessions.
- Only allow the exact origins you need in `ALLOWED_ORIGINS`.
- Keep rate limiting on (already enabled in `middleware/security.ts`).

---

## Free‑tier realities (cold starts & timeouts)

- Free services may “sleep” when idle. The first request after sleep will be slow.
- Some platforms limit CPU/RAM; heavy operations may crash. Keep startup light.
- Consider a tiny paid plan when demoing to real users for consistency.

---

## Common fixes (fast)

- PORT problems:
  - Always listen on `process.env.PORT`. Your server already does.

- Health check failing:
  - Ensure `/health` returns 200 quickly and isn’t rate‑limited. Your code already skips it.

- Migrations failing:
  - Ensure `DATABASE_URL` is correct and reachable.
  - Ensure TypeScript is present at build/deploy time (see “gotcha”).

- CORS blocked:
  - Add your exact frontend origin(s) to `ALLOWED_ORIGINS` (comma‑separated, no spaces).

- Free plan timeouts:
  - Expect cold starts. Consider upgrading the plan or reduce startup tasks.

---

## A zero‑dollar demo stack (copy/paste)

- Backend: Render free (API)
- DB: Neon free (Postgres)
- Frontend: Vercel free

Steps:

1. Create Neon DB → copy `DATABASE_URL`.
1. Render Web Service (root: `server`):

```bash
# Render UI settings
Build: NPM_CONFIG_PRODUCTION=false npm ci && npm run build
Pre‑Deploy: npm run migrate:prod
Start: npm start
Health: /health
Env:
  NODE_ENV=production
  DATABASE_URL=postgres://...
  JWT_SECRET=... JWT_REFRESH_SECRET=... SESSION_SECRET=...
  ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

1. Vercel frontend:

```bash
# Vercel project → Import GitHub
Build: npm ci && npm run build
Output: dist
Env:
  VITE_API_URL=https://<api-host>/api/v1
```

1. Verify:

```bash
curl -fsS https://<api-host>/health
curl -fsS https://<api-host>/health/readiness
export api_url="https://<api-host>/api/v1"
node scripts/system-check.mjs
```

---

## Related docs in this repo

- `GO_LIVE_ubasfintrust.md` – Render‑focused go‑live checklist
- `PRODUCTION_READINESS.md` – Preflight before switching real traffic
- `scripts/system-check.mjs` – Automated end‑to‑end tester (accepts `api_url` | `API_BASE` | `VITE_API_URL`)
- `render.yaml` – Optional Render IaC

---

You’re ready to deploy on any free platform. Pick one from the recipes above, plug in your secrets, and run the verification commands. If something fails, copy the error and I’ll pinpoint the fix.
