# ubasfintrust-edge-worker

Edge-native API scaffold for Cloudflare Workers + Hono. Zero-sleep, always-on at the edge.

## Prereqs

- Node 18+
- Cloudflare account
- `npm i -g wrangler`

## Setup

```bash
cd edge-worker
npm ci
wrangler login
# Create or bind resources (update wrangler.toml with real IDs):
wrangler r2 bucket create app-uploads
wrangler d1 create app-db
wrangler kv namespace create APP_KV
# Secrets
wrangler secret put JWT_SECRET
wrangler secret put DATABASE_URL   # Neon Postgres URL (optional if using only D1)
```

Update `wrangler.toml` with the generated IDs.

Neon setup: see `docs/NEON_SETUP.md` for step-by-step instructions to create the database and seed demo data.

## Dev

```bash
npm run dev
```

## Deploy

```bash
npm run deploy
```

## D1 Migration (example)

```bash
npm run deploy:d1:migrate
```

## Routes

- Health:
  - `GET /health`
  - `GET /health/readiness`
- Demo:
  - `GET /api/items`
  - `POST /api/items`
  - `POST /api/upload`
- Auth:
  - `GET /api/v1/auth/whoami` (Bearer token optional; decodes JWT if present)
- Users (JWT required):
  - `GET /api/v1/users/profile`
  - `GET /api/v1/users/accounts`
  - `GET /api/v1/users/transactions?page=1&limit=20&type=&status=`

Neon (Postgres) is preferred for Users endpoints when `DATABASE_URL` is set. D1 fallback is provided for demos.

See `docs/ALWAYS_ON_FULLY_FREE_DEPLOYMENTS_2025.md` for the full guide.
