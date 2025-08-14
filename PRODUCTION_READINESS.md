# UBAS Financial Trust — Production Readiness Guide

This guide takes you from code to a secure, working production deployment. It consolidates infra requirements, environment variables, migrations, CORS, frontend API URL wiring, smoke tests, and platform notes.

## 🚀 Quick start (first run)

From the `clean/` folder, this will install CLIs locally (no sudo), then deploy the backend to Railway and the SPA to Vercel, and run smoke tests.

1) Install CLIs locally and ensure PATH

```bash
make install-cli
# If commands aren’t found in this shell, add to PATH:
export PATH="$HOME/.npm-global/bin:$HOME/.railway/bin:$PATH"
```

2) Log in to providers once

```bash
railway login
vercel login
```

3) One-command deploy (you can override DOMAIN/ADMIN_* if desired)

```bash
make deploy-railway
# or customize
DOMAIN=ubasfintrust.com ADMIN_EMAIL=admin@ubasfintrust.com ADMIN_PASSWORD='Strong#Password1' make deploy-railway
```

Outputs will include the API URL and the temporary Vercel URL. After verifying smoke tests, map your custom domains (api.ubasfintrust.com and ubasfintrust.com) in Railway and Vercel.

## ✅ Must-have checklist

- Postgres reachable by the API
  - Run server migrations before first traffic (users, accounts, transactions, loans, KYC, grants, audit, notifications).
- Redis reachable by the API
  - Required for sessions, rate limiting, and token blacklist.
- Server environment
  - JWT_SECRET, JWT_REFRESH_SECRET, SESSION_SECRET
  - DATABASE_URL (or DB_HOST/PORT/NAME/USER/PASSWORD)
  - REDIS_URL (or REDIS_HOST/PORT/PASSWORD)
  - ALLOWED_ORIGINS = your exact frontend origin(s)
  - SOCKET_IO_CORS_ORIGIN = your frontend origin
  - ADMIN_EMAIL and ADMIN_PASSWORD (one-time) to auto-seed corporate admin
- Frontend environment
  - VITE_API_URL = https://your-backend-domain/api/v1 (must match server path)
  - VITE_SOCKET_URL = https://your-backend-domain
- Networking/CORS
  - Ensure your exact frontend URL is in ALLOWED_ORIGINS; otherwise, browser calls are blocked.

## Server configuration (API)

Set these in your hosting provider (do not commit real secrets). Use `clean/server/.env.production.example` as structure.

- Required
  - NODE_ENV=production
  - PORT=5000 (or platform-provided port)
  - DATABASE_URL=postgres://user:pass@host:5432/db
  - REDIS_URL=redis://:password@host:6379/0 (or REDIS_HOST/PORT/PASSWORD/DB)
  - JWT_SECRET, JWT_REFRESH_SECRET, SESSION_SECRET (long, random, unique)
  - ALLOWED_ORIGINS=https://app.example.com[,https://admin.example.com]
  - SOCKET_IO_CORS_ORIGIN=https://app.example.com
  - API_VERSION=v1
- Optional but recommended
  - LOG_LEVEL=info
  - RATE_LIMIT_WINDOW_MS=900000, RATE_LIMIT_MAX_REQUESTS=100
  - SENTRY_DSN
  - Email/SMS provider keys if using notifications
- Admin bootstrap (first boot only)
  - ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME, ADMIN_PHONE

## Frontend configuration (SPA)

Set these in your SPA host (Vercel/Netlify). Use `clean/.env.production.example` as structure.

- VITE_API_URL=https://api.example.com/api/v1
- VITE_SOCKET_URL=https://api.example.com
- VITE_APP_NAME=UBAS Financial Trust
- VITE_NODE_ENV=production
- Limits, feature flags, analytics as needed

Only variables prefixed with VITE_ are exposed to the browser.

## Migrations and first boot

- Provision Postgres and Redis.
- Set ADMIN_EMAIL and ADMIN_PASSWORD before first boot to seed corporate admin.
- Run migrations on the API service before serving traffic.
- Verify health endpoints.

## CORS and sockets

- ALLOWED_ORIGINS must list the exact SPA origin(s) (comma-separated allowed).
- SOCKET_IO_CORS_ORIGIN must be a single origin matching where your SPA is hosted.

## Health and smoke tests

API exposes health routes (non-auth):

- GET https://api.example.com/health → 200 with database and redis statuses when healthy
- GET https://api.example.com/api/v1/templates/_health/providers → optional provider status (if notifications enabled)

Basic smoke test sequence:

1. Health returns healthy for database and redis.
2. Login from SPA (or API) returns access + refresh tokens; refresh works.
3. Admin login works only for account_type=corporate.
4. Customer can fetch accounts and transactions.
5. Admin endpoints require corporate role and return 200.

## Where to set env

- API (server): Railway/Render/Fly.io/Dokku → set env vars in service settings; then run build and migrations.
- SPA (frontend): Vercel/Netlify → set VITE_* vars in project/site settings.

## Domains and TLS

- api.example.com → API host with TLS.
- app.example.com → SPA host with TLS and HSTS.

## Security tips

- Do not commit secrets. Use *.example files as templates only.
- Generate 32+ byte random secrets for JWT and session keys.
- Restrict CORS to exact origins (avoid wildcards in production).
- Enforce HTTPS everywhere; keep security headers on the SPA (already configured in vercel.json/netlify.toml).

## Rollback

- Ensure DB backups with your Postgres provider.
- Use platform rollback/history to revert deploys.

## Troubleshooting

- 401 loops: VITE_API_URL mismatch or missing ALLOWED_ORIGINS.
- Health degraded: Postgres or Redis not reachable.
- Admin missing: seeding didn’t run; verify ADMIN_* and first-boot logs.

---

Need a tailored env block? Share your domains and I’ll fill them in precisely.
