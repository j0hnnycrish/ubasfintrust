# Cloudflare CI Quick Start (Pages + Worker)

Use this 1-page guide to deploy the frontend (Pages) and the API (Worker) on every push to `main` using GitHub Actions.

## 1) One-time local setup

- Install tools (on your dev machine):

  ```zsh
npm i -g wrangler
```
- Log in and create/bind resources (IDs will be printed):

  ```zsh
cd edge-worker
  wrangler login
  wrangler r2 bucket create app-uploads
  wrangler d1 create app-db
  wrangler kv namespace create APP_KV
```
- Update `edge-worker/wrangler.toml` with the printed IDs for D1 and KV.
- Set Worker secrets locally (so you can test dev and also document values for CI):

  ```zsh
wrangler secret put JWT_SECRET
  # Optional if using Neon (preferred DB)
  wrangler secret put DATABASE_URL
```
- (Optional) Seed Neon once:

  ```zsh
DATABASE_URL='postgresql://USER:PASSWORD@HOST/db?sslmode=require' npm run neon:setup
```
- (Optional) Apply D1 migrations once (for demo fallback and /api/items):

  ```zsh
npm run deploy:d1:migrate
```

## 2) Add GitHub repository secrets

GitHub → repo → Settings → Secrets and variables → Actions → "New repository secret":

- `CLOUDFLARE_API_TOKEN` (deploy token for Pages + Workers)
- `CLOUDFLARE_ACCOUNT_ID` (your CF account ID)
- `CLOUDFLARE_PAGES_PROJECT` (exact Pages project name)
- `VITE_API_URL` (your Worker API base, e.g., <https://your-worker.your-account.workers.dev>)
- `JWT_SECRET` (same value used to sign your JWTs)
- `DATABASE_URL` (optional, Neon connection string)

Notes:

- The CI workflow will push `JWT_SECRET` and `DATABASE_URL` into the Worker using `wrangler secret put` before deploying.

## 3) Push to main

- Ensure the workflow file exists: `.github/workflows/cloudflare-deploy.yml`
- Commit and push to `main`:

  ```zsh
git add -A
  git commit -m "ci: deploy to Cloudflare via GitHub Actions"
  git push origin main
```

The workflow will:

- Build the frontend and publish to Pages (using `VITE_API_URL`).
- Install `edge-worker` deps, set Worker secrets, and deploy the Worker.

## 4) Quick verification

- Frontend: Open your Pages URL from the dashboard.
- API health:

  ```zsh
curl -s https://<your-worker>/health
  curl -s https://<your-worker>/health/readiness
```
- (Optional) WhoAmI: with a valid token

  ```zsh
curl -s -H "Authorization: Bearer TOKEN" https://<your-worker>/api/v1/auth/whoami
```

You’re done. Future pushes to `main` will auto-deploy both the Pages site and the Worker.

# Cloudflare Free Deployment Checklist (Frontend + Edge API)

This checklist gets your entire app live on Cloudflare’s free tiers: Pages for the frontend, Workers for the API, and KV/D1/R2 for data and storage. Follow top-to-bottom.

Status legend: [ ] todo, [x] done

## 0) Prereqs
- [ ] Cloudflare account (free)
- [ ] GitHub repo connected (optional but recommended)
- [ ] Node 18+ installed locally
- [ ] Installed globally: `wrangler` (`npm i -g wrangler`)

## 1) Frontend (Cloudflare Pages)
- [ ] Build locally once to verify
  ```zsh
  npm ci
  npm run build
  ```
- [ ] Decide your API base URL
  - If using your Worker subdomain, example: `https://<worker-name>.<account>.workers.dev`
  - If using a custom domain/subdomain, example: `https://api.example.com`
- [ ] Configure frontend to call your API
  - Set `VITE_API_URL` to the Worker base URL (no trailing slash)
  - In Cloudflare Pages dashboard → Project → Settings → Environment Variables: add `VITE_API_URL`
- [ ] Create a Pages project (dashboard)
  - Connect GitHub repository and select this repo
  - Build command: `npm ci && npm run build`
  - Output directory: `dist`
  - Add environment variable `VITE_API_URL` (same as above)
- [ ] Trigger a deployment (push to main or click Deploy)
- [ ] Verify: Your Pages site loads and network calls target your Worker `VITE_API_URL`

## 2) API (Cloudflare Worker)
Project path: `edge-worker/`

- [ ] Install deps and login
  ```zsh
  cd edge-worker
  npm ci
  wrangler login
  ```
- [ ] Create/bind resources (IDs will be output)
  ```zsh
  wrangler r2 bucket create app-uploads
  wrangler d1 create app-db
  wrangler kv namespace create APP_KV
  ```
- [ ] Update `edge-worker/wrangler.toml`
  - [ ] Set D1 `database_id`
  - [ ] Set KV `id`
  - [ ] Confirm these vars (adjust if needed):
    ```toml
    [vars]
    NODE_ENV = "production"
    JWT_AUD = "ubas"
    RATE_LIMIT_WINDOW_SEC = "60"
    RATE_LIMIT_MAX = "60"
    ```
- [ ] Set secrets
  ```zsh
  wrangler secret put JWT_SECRET      # choose a strong secret
  # Optional for Neon (preferred DB):
  wrangler secret put DATABASE_URL    # paste your Neon connection string
  # Optional: enable dev token mint endpoint
  wrangler secret put DEV_MINT        # set to: true
  ```
- [ ] Apply D1 migrations (for demo fallback and /api/items)
  ```zsh
  npm run deploy:d1:migrate
  ```
- [ ] (Optional) Seed Neon with demo tables/data (recommended)
  ```zsh
  DATABASE_URL='postgresql://USER:PASSWORD@HOST/db?sslmode=require' npm run neon:setup
  ```
- [ ] Local smoke test
  ```zsh
  npm run dev
  # Optional (if DEV_MINT=true): mint a token for demo-user-0001
  curl -s -X POST -H "Content-Type: application/json" \
    -d '{"email":"demo@example.com","id":"demo-user-0001","expiresIn":"7d"}' \
    http://127.0.0.1:8787/dev/mint-token
  ```
- [ ] Verify key endpoints
  ```zsh
  # Replace TOKEN if you minted one
  curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/auth/whoami
  curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/users/profile
  curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/users/accounts
  curl -H "Authorization: Bearer TOKEN" 'http://127.0.0.1:8787/api/v1/users/transactions?page=1&limit=10'
  ```
- [ ] Transfer endpoint idempotency check
  ```zsh
  API_BASE=http://127.0.0.1:8787 \
  TOKEN="YOUR_JWT" \
  FROM=demo-acct-0001 \
  TO=demo-acct-0001 \
  AMOUNT=5 \
  npm run smoke:transfer
  ```
- [ ] Deploy Worker
  ```zsh
  npm run deploy
  ```

## 3) Optional DNS and custom domains
- [ ] Add your domain to Cloudflare (free)
- [ ] Set DNS records (A/AAAA/CNAME) to Cloudflare’s provided values
- [ ] Map custom domain to Pages site (Pages → Custom domains)
- [ ] Map custom domain/subdomain to Worker (Workers → Triggers → Routes)
  - Example for API: `api.example.com/*` routed to your Worker

## 4) CI/CD (optional but recommended)
- [ ] Add Cloudflare API token, account id, and project info to GitHub secrets if using the included CI workflow
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_PAGES_PROJECT`
  - `VITE_API_URL` (Pages build time var)
  - (and your Worker secrets if deploying via CI): `JWT_SECRET`, `DATABASE_URL`
- [ ] Verify the workflow runs on push to `main`

Secrets reference (GitHub → Settings → Secrets and variables → Actions → New repository secret):

- `CLOUDFLARE_API_TOKEN`: API token with permissions for Pages and Workers deploys
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_PAGES_PROJECT`: The Pages project name (exact)
- `VITE_API_URL`: The base URL of your Worker API (e.g., <https://your-worker.your-account.workers.dev>)
- `JWT_SECRET`: The exact JWT signing secret your tokens use
- `DATABASE_URL` (optional): Neon Postgres connection string for production

 
## 5) Security and limits
 
- [ ] JWT audience aligned: `JWT_AUD` in `wrangler.toml` matches your tokens
- [ ] Strong `JWT_SECRET` set in Worker secrets
- [ ] Rate limits tuned for your case (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SEC`)
- [ ] Idempotency enabled (already in `/api/v1/transfers` via KV)
- [ ] CORS: included via Hono; restrict origins if needed

 
## 6) Observability and readiness
 
- [ ] Health: `GET /health`
- [ ] Readiness: `GET /health/readiness` (KV ping)
- [ ] Consider adding basic logs or analytics (Cloudflare includes request logs)

 
## 7) Troubleshooting
 
- Missing types in editor → run `npm ci` in `edge-worker/` and at repo root
- 401 Unauthorized → token’s audience must match `JWT_AUD`; token must be signed with the same `JWT_SECRET`
- Neon not used → ensure `DATABASE_URL` secret is set; Worker will fallback to D1 if absent
- D1 errors on initial queries → run `npm run deploy:d1:migrate`
- Rate limit hits during tests → increase `RATE_LIMIT_MAX` temporarily in `wrangler.toml`

---

References
 
- Worker: `edge-worker/src/worker.ts`
- Neon setup: `docs/NEON_SETUP.md`
- Pages wiring: `FRONTEND_DEPLOY.md`
- Always-on free guide: `docs/ALWAYS_ON_FULLY_FREE_DEPLOYMENTS_2025.md`
