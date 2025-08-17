# Deployment Steps (Cloudflare + GitHub) for ubasfintrust

This is a repo-specific, step-by-step checklist to get your frontend and Worker live. It explains exactly what to edit in Cloudflare and GitHub, with values from this repo.

## What you’ll deploy

- Frontend: Vite build served by Cloudflare Pages
- API: Cloudflare Worker in `edge-worker` (Hono + Neon + KV + optional D1 + R2)

## 0) Prereqs

- Cloudflare account (Account ID handy)
- Cloudflare API Token with least-privilege:
  - Account → Workers Scripts: Edit
  - Account → Pages: Edit
  - Account → Account Settings: Read
-- GitHub repository secrets access

See `docs/CLOUDFLARE_TOKEN_PERMISSIONS.md` for details.

## 1) Create Cloudflare resources

1. Pages project
   - Cloudflare Dashboard → Workers & Pages → Pages → Create application
   - Project name: pick a valid, lowercase name (e.g., `ubasfintrust`)
   - Production branch: `main`
   - If you plan to deploy from CI (recommended), you don’t need to connect Git here.

2. KV namespace (required)
   - Cloudflare Dashboard → Workers & Pages → KV → Create namespace
   - Name suggestion: `ubasfintrust-app-kv`
   - Copy the Namespace ID for later

3. R2 bucket (optional but used by `/api/upload`)
   - Workers & Pages → R2 → Create bucket
   - Name: `app-uploads` (or your chosen)

4. D1 database (optional; Neon is primary DB)
   - Workers & Pages → D1 → Create database
   - Name: `app-db`
   - You can run migrations later; not required if you use Neon only.

## 2) Edit `edge-worker/wrangler.toml`

File: `edge-worker/wrangler.toml`

- Fill the KV namespace:
  - `[[kv_namespaces]]` → `binding = "APP_KV"` → set `id` to your KV Namespace ID
- Optional: D1 (only if you want D1 fallback)
  - `[[d1_databases]]` → set `database_id` to your D1 Database ID
- Optional: R2
  - `[[r2_buckets]]` → ensure `bucket_name` matches the R2 bucket you created (default `app-uploads`)
- Do not commit secrets in this file; they’re set via CI as Worker secrets.

Reference (from your repo):

```toml
[[d1_databases]]
binding = "DB"
database_name = "app-db"
database_id = "REPLACE_WITH_D1_ID"

[[r2_buckets]]
binding = "R2"
bucket_name = "app-uploads"

[[kv_namespaces]]
binding = "APP_KV"
id = "REPLACE_WITH_KV_ID"
```

## 3) Set GitHub repository secrets

GitHub → Settings → Secrets and variables → Actions (Repository secrets):

Required

- `CLOUDFLARE_API_TOKEN` — token with Workers Scripts: Edit, Pages: Edit, Account Settings: Read
- `CLOUDFLARE_ACCOUNT_ID` — from Cloudflare Dashboard (Account settings)
- `CLOUDFLARE_PAGES_PROJECT` — your Pages project name (e.g., `ubasfintrust`)
- `VITE_API_URL` — your Worker base URL (e.g., `https://<your-worker-domain>`)
- `JWT_SECRET` — any strong HS256 secret for JWT verification

Optional (enables Neon Postgres in Worker)

- `DATABASE_URL` — Neon connection string (postgresql://...)

## 4) Configure Cloudflare Pages (if building on Pages)

If you let Pages perform the build:

- Framework preset: None
- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Environment variables:
  - `VITE_API_URL = https://<your-worker-or-domain>/api/v1`
  - `NODE_VERSION = 20.19.0`

If using CI-driven deploy (recommended), you can leave Build command/output empty.

## 5) Pipeline overview (what our CI does)

Workflow: `.github/workflows/cloudflare-deploy.yml`

- Uses Node `20.19.0`
- Builds frontend: `npm ci && npm run build`
- Installs Wrangler and creates Pages project if missing, then deploys `dist` to Pages
- Worker deploy:
  - Skips if `wrangler.toml` still has placeholders for KV/D1 IDs
  - Otherwise: installs deps, injects `JWT_SECRET` and `DATABASE_URL` as Worker secrets, runs `wrangler deploy`

## 6) First deploy (manual checklist)

- [ ] Fill `APP_KV` id in `edge-worker/wrangler.toml`
- [ ] (Optional) Add D1 `database_id` in `edge-worker/wrangler.toml`
- [ ] Ensure GitHub secrets are set (see Section 3)
- [ ] Push to `main` to trigger the workflow
- [ ] Watch GitHub Actions → Deploy Frontend (Pages) and Worker
- [ ] Find your Pages URL in the logs / dashboard

## 7) Post-deploy quick tests

Frontend

- Load the Pages URL
- Confirm the frontend hits `VITE_API_URL` (check Network tab)

Worker

- GET `<worker-url>/health` → `{ ok: true }`
- GET `<worker-url>/health/readiness` → `{ ok: true }` (KV reachable)
- Auth endpoints require a valid JWT (`JWT_SECRET` must match tokens you mint)

## 8) Common errors and fixes

- Project not found / Invalid project name
  - Check `CLOUDFLARE_PAGES_PROJECT` matches a valid name (lowercase, 1–58 chars, no leading/trailing dash)
- `Unknown argument: json` in wrangler
  - Don’t list Pages projects in CI; the workflow creates if missing
- npm prefix / EACCES in Pages
  - Avoid global `npx wrangler` in Pages build; prefer CI deploy or unset npm prefix before use
- Node version EBADENGINE (Vite 7)
  - Ensure Pages `NODE_VERSION=20.19.0`; CI is already pinned
- Worker deploy skipped: placeholders
  - Fill KV `id` (required) and D1 `database_id` (optional) and push

## 9) Optional improvements

- Add a smoke test step in CI to curl Pages and Worker `/health`
- Add D1 migrations and seeds if you want to demo without Neon
- Configure custom domain for Pages and Workers Routes (if needed)

## 10) Where to change things later

- Pages env vars: Cloudflare Dashboard → Pages → Your project → Settings → Environment variables
- Worker secrets: handled by CI via `wrangler secret put` during deploy
- Bindings (KV/D1/R2): `edge-worker/wrangler.toml` (commit and push changes)

---
For more context, see:

- `docs/CLOUDFLARE_BUILD_AND_DEPLOY_TROUBLESHOOTING.md`
- `docs/CLOUDFLARE_CI_QUICK_START.md`
- `docs/CLOUDFLARE_FREE_DEPLOY_CHECKLIST.md`
- `docs/CLOUDFLARE_TOKEN_PERMISSIONS.md`
- `docs/SECRETS_AND_ENV_VARS_SIMPLIFIED.md`
