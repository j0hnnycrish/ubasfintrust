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

