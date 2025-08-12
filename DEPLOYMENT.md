# Deployment Scripts Quick Reference

Central place to understand automation scripts and workflows for UBAS Financial Trust.

## Scripts (in `scripts/`)

| Script | Purpose | Typical Use |
| ------ | ------- | ----------- |
| `deploy-railway-vercel.sh` | End-to-end deploy: backend (Railway) + frontend (Vercel) + readiness wait + system check | Standard full stack deploy when both platforms used |
| `deploy-render.sh` | Deploy backend to Render using render.yaml, wait for readiness | Render-only backend or eval |
| `deploy-flyio.sh` | Deploy (or create) Fly.io apps for backend + optional static assets, sets secrets, runs health gates | Fly.io infra experiment |
| `deploy-netlify.sh` | Build & deploy frontend to Netlify (expects Netlify CLI + auth token) | Alternate static frontend hosting |
| `deploy-cpanel.sh` | Package static frontend into zip with .htaccess for legacy cPanel hosting | Low-end static demo |
| `deploy-vercel-supabase.sh` | Frontend deploy to Vercel + guidance + Supabase DB setup docs generation | Vercel + Supabase path |
| `post-deploy-smoke.sh` | Lightweight smoke tests: health, diagnostics, key endpoints after deploy | Run manually or CI post step |
| `rollback.sh` | Roll back a platform (Railway/Render/Fly) to previous deployment (uses platform CLIs) | Emergency revert |
| `system-check.mjs` | Deep integration test: auth, admin ops, accounts, KYC, loans, templates, email | CI and pre-prod validation |

## GitHub Workflows (`.github/workflows/`)

| Workflow | File | Purpose |
| -------- | ---- | ------- |
| CI | `ci.yml` | Build, migrate DB, run integration `system-check.mjs` to ensure quality | 
| Deploy | `deploy.yml` | Trigger scripted deploy (Railway+Vercel) on tag or main push (config dependent) |

## Environment Variables (Key For Scripts)

Set these as appropriate in platform dashboards or CI secrets:

Backend core:
- `DATABASE_URL`, `REDIS_URL` (or host/port), `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET`
- `ALLOWED_ORIGINS`, `SOCKET_IO_CORS_ORIGIN`
- `ENCRYPTION_KEY` (32 chars), `DIAGNOSTICS_TOKEN`

Optional provider keys:
- Email: `RESEND_API_KEY` or `SENDGRID_API_KEY`, `FROM_EMAIL`
- SMS: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` (or MessageBird / Plivo tokens)

Frontend build:
- `VITE_API_URL`, `VITE_SOCKET_URL`, `VITE_APP_NAME`

## Typical Deployment Flows

### Railway + Vercel (Automated)
1. Export or ensure CLI auth: `railway login`, `vercel login`.
2. Run: `./scripts/deploy-railway-vercel.sh`.
3. Observe readiness + integration output.

### Render Backend + Existing Frontend
1. Ensure `render.yaml` matches service name.
2. Run: `./scripts/deploy-render.sh`.
3. Update frontend `VITE_API_URL` if endpoint changed.

### Fly.io
1. `fly auth login`.
2. `./scripts/deploy-flyio.sh` (first run creates apps if absent).

### Netlify + Heroku (Legacy Option)
Use `deploy-netlify.sh` and Heroku subtree push (see `DEPLOYMENT_GUIDE.md`).

### Vercel + Supabase
1. Provision Supabase (see generated `SUPABASE_SETUP.md`).
2. Run `./deploy-vercel-supabase.sh` (from repo root) to deploy frontend and create docs.
3. Deploy backend separately (Render/Heroku/Fly).

## Validation & Testing

- Quick smoke: `./scripts/post-deploy-smoke.sh --base <URL>`
- Full integration: `npm run system:test` (ensure backend running & env vars set)

Export admin creds before full test:
```
export API_BASE=https://your-api/api/v1
export ADMIN_EMAIL=admin@ubasfintrust.com
export ADMIN_PASSWORD='AdminPass#123'
node scripts/system-check.mjs
```

## Rollback Guidance

1. Identify last healthy deployment ID (platform UI or CLI).
2. Run `./scripts/rollback.sh --platform railway --to <deploy-id>` (syntax differs per platform; see script help).

## Adding New Platforms

Create `deploy-<platform>.sh` with:
- Validation of required CLIs
- Build steps (backend + migrations)
- Deployment invocation
- Health/readiness polling
- Optional `system-check.mjs` invocation

## Security Notes

Never commit real secrets. Use platform secret managers. Protect diagnostics with `DIAGNOSTICS_TOKEN`. Rotate keys after incidents.

## Future Enhancements (Ideas)
- Add GitHub Action for Fly.io deploy on tag.
- Add Blue/Green strategy script (Render/Fly).
- Add canary system-check hitting new version only.

---
This file centralizes deployment automation knowledge for rapid onboarding and stable releases.
