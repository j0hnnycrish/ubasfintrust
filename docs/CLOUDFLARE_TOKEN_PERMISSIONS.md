# Cloudflare Build & Deploy Troubleshooting (repo: ubasfintrust)

This guide fixes the last errors you hit on Cloudflare Pages and CI.

## 1) "Unknown argument: json" with `wrangler pages project list --json`
- Cause: `wrangler` CLI doesn’t support `--json` for `pages project list` in the runner image used by Pages.
- Fix: Don’t rely on listing. Simply try to create the project and ignore the error if it already exists.

Example in GitHub Actions (already applied):
```
wrangler pages project create "$NAME" --production-branch=main || echo "Project may already exist"
```

## 2) "You have entered an invalid project name" (Pages)
- Cause: Project name violates rules.
- Rules: 1–58 chars, lowercase letters, numbers, dashes; cannot start/end with a dash.
- Fix: Choose a valid name (e.g., `ubasfintrust`, `ubasfintrust-site`) and set it as the GitHub secret `CLOUDFLARE_PAGES_PROJECT` or create it in the Cloudflare Dashboard under Workers & Pages → Pages → Create application.

## 3) Build settings for Cloudflare Pages
If you let Cloudflare build the frontend:
- Framework preset: None
- Build command: `npm ci && npm run build`
# Cloudflare Build & Deploy Troubleshooting (repo: ubasfintrust)

This guide fixes the last errors you hit on Cloudflare Pages and CI.

## 1) Unknown argument: json (wrangler)

- Cause: `wrangler` in the Pages runner doesn’t support `--json` for `pages project list`.
- Fix: Don’t list; just attempt create and ignore errors if it already exists.

Example (CI):

```bash
wrangler pages project create "$NAME" --production-branch=main || echo "Project may already exist"
```

## 2) Invalid Pages project name

- Rules: 1–58 chars, lowercase letters, numbers, dashes; cannot start/end with `-`.
- Fix: Pick a valid name (e.g., `ubasfintrust`, `ubasfintrust-site`) and set GitHub secret `CLOUDFLARE_PAGES_PROJECT`, or create in Cloudflare Dashboard → Workers & Pages → Pages → Create application.

## 3) Build settings for Pages

If Pages builds the frontend:

- Framework preset: None
- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Env vars:
  - `VITE_API_URL = https://<your-worker-or-domain>/api/v1`
  - `NODE_VERSION = 20.19.0`

If CI deploys (Wrangler):

- Leave Pages build config blank; CI runs `npm ci && npm run build` and `wrangler pages deploy dist`.

## 4) npm prefix error: `.npmrc` (prefix) and EACCES `/root/.npm-global`

- Cause: Build environment enforces a global npm prefix not writable by the runner.
- Fix options:
  - Prefer CI-based deploy (don’t run `npx wrangler` in Pages build command).
  - If you must run npm in Pages, unset prefix first:

    ```bash
npm config delete prefix || true
    export npm_config_prefix=
```

## 5) Node version mismatch with Vite 7

- Vite 7 requires Node `^20.19.0 || >=22.12.0`.
- Fix Pages: set `NODE_VERSION=20.19.0` in Pages → Settings → Environment variables (Production and Preview).
- Fix CI (optional): set actions/setup-node to `20.19.0`.

## 6) Where to configure

- Pages project name: Cloudflare Dashboard → Workers & Pages → Pages → Create application → Name
- Production branch: `main` (Pages project settings)
- Pages env vars: Cloudflare Dashboard → Pages → Your project → Settings → Environment variables
- GitHub secrets (CI): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PAGES_PROJECT`, `VITE_API_URL`, `JWT_SECRET`, `DATABASE_URL`

## 7) Recommended flow (simplest)

- CI builds and deploys with Wrangler
  - Pages Build settings: leave Build command and Output blank
  - CI: `npm ci && npm run build` then `wrangler pages deploy dist --project-name "$NAME"`
- Worker deploy: fill KV `id` in `edge-worker/wrangler.toml` (required), then CI runs `wrangler deploy`.

## 8) Quick checklist

- [ ] Valid Pages project name set in `CLOUDFLARE_PAGES_PROJECT`
- [ ] Pages `NODE_VERSION=20.19.0`
- [ ] Avoid `npx wrangler` in Pages build (or unset prefix)
- [ ] `VITE_API_URL` set (Pages env or CI env)
- [ ] KV `id` filled in `edge-worker/wrangler.toml`; push to deploy Worker
# Cloudflare API Token Permissions (What You Actually Need)

This explains the minimal and optional permissions for the GitHub Actions token used to deploy Pages and the Worker.

## TL;DR

- For this repo’s CI (build in GitHub, publish to Pages, deploy Worker) you only need:
  - Account: Workers Scripts — Edit
  - Account: Pages — Edit
  - Account: Account Settings — Read (often required by the API)

That’s it for the default flow we set up. Everything else is optional.

## Why not more?

- We already created KV, D1, and R2 resources locally with `wrangler`. CI does not create or mutate them.
- The Worker bindings (KV/D1/R2) are just IDs in `wrangler.toml`. Deploying the Worker does not need KV/R2/D1 "Edit" privileges.
- Routes (custom domains) are configured outside the workflow. If you do not programmatically change routes in CI, you don’t need Routes:Edit.

## Recommended minimal token (current workflow)

Grant these on your Cloudflare account:

- Account → Workers Scripts: Edit
- Account → Pages: Edit
- Account → Account Settings: Read

This is sufficient to:

- Upload and publish your Worker (`wrangler deploy`)
- Publish the built frontend to Cloudflare Pages (via `cloudflare/pages-action`)

## When to add more permissions

Add the following only if you will automate these actions in CI:

- Manage Worker routes (custom domain routing in CI)
  - Zone → Workers Routes: Edit

- Create or update KV namespaces/bindings in CI (not typical here)
  - Account → Workers KV Storage: Edit

- Create or manage R2 buckets in CI (not typical here)
  - Account → Workers R2 Storage: Edit

- Run D1 migrations in CI (we currently run locally; add only if you wire CI to do migrations)
  - Account → D1: Edit (Cloudflare may list this as a Workers/D1 or Database permission depending on UI)

- View logs/live tail in CI or automation
  - Account → Workers Tail: Read
  - Account → Workers Observability: Edit/Read (only if you need to configure/change observability)

- Advanced Workers features
  - Workers Builds Configuration: Edit, Workers Agents Configuration: Edit (only if you know you need them)

## About super-broad tokens

Statements like “All zones — Workers Routes:Edit” and many "Edit" capabilities across KV/R2/Observability are broadly permissive and not required for this workflow. Prefer least privilege:

- Start with the minimal three (Workers Scripts: Edit, Pages: Edit, Account Settings: Read)
- Add specific scopes only when you introduce CI steps that require them

## Where to put the token

- Put the token value in GitHub → Settings → Secrets and variables → Actions as `CLOUDFLARE_API_TOKEN`.
- The workflow already uses this token to deploy both Pages and the Worker.

## Quick checklist

- [ ] Create a token with: Workers Scripts: Edit, Pages: Edit, Account Settings: Read
- [ ] Save as GitHub secret: `CLOUDFLARE_API_TOKEN`
- [ ] Push to `main` and watch the CI deploy frontend + Worker

For the big picture on all secrets and where they go, see `docs/SECRETS_AND_ENV_VARS_SIMPLIFIED.md`. For end-to-end deployment steps, see `docs/CLOUDFLARE_CI_QUICK_START.md`.
