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
