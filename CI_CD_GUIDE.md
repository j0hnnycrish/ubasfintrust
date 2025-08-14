Advanced CI/CD Overview
=======================

Workflows Added / Updated:
1. CI (.github/workflows/ci.yml): Lint, type-check, backend integration + jest, frontend build, security audit, summary.
2. Deploy Production (.github/workflows/deploy-production.yml): Preflight quality gates, conditional Render backend deploy, Netlify frontend deploy, smoke checks.
3. Deploy Staging (.github/workflows/deploy-staging.yml): Staging branch automated deploy with alias build + backend health capture + PR comment.
4. CodeQL (.github/workflows/codeql.yml): Static analysis security scanning (weekly + push + PR).
5. Dependabot (.github/dependabot.yml): Weekly dependency update PRs.
6. Semgrep (.github/workflows/semgrep.yml): OWASP + security-audit rule scanning.
7. Lighthouse (.github/workflows/lighthouse.yml): Performance reporting (scheduled / on main).

Secrets to Configure (GitHub → Settings → Secrets and variables → Actions):
- JWT_SECRET
- JWT_REFRESH_SECRET
- ADMIN_EMAIL / ADMIN_PASSWORD
- ALLOWED_ORIGINS
- SOCKET_IO_CORS_ORIGIN
- RENDER_BACKEND_DEPLOY_HOOK_URL (if using Render deploy hook)
- NETLIFY_AUTH_TOKEN
- NETLIFY_SITE_ID
- VITE_API_URL_PROD (e.g. https://api.ubasfintrust.com/api/v1)
- PROD_API_HEALTH_URL (https://api.ubasfintrust.com/health)
- PROD_FRONTEND_URL (https://ubasfintrust.com)

Optional Secrets:
- DIAGNOSTICS_TOKEN
- S3_* (object storage)
- SENDGRID_API_KEY / MAILGUN_API_KEY / RESEND_API_KEY
- TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN etc.

Flow Summary:
1. Push / PR → CI pipeline must pass.
2. Push to main → Deploy Production pipeline runs: build validation, trigger backend deploy, deploy frontend, smoke tests.

Rollback Strategy:
- Frontend Production: Netlify UI → select previous deploy.
- Frontend Staging: Re-run staging workflow or select previous alias.
- Backend: Re-trigger earlier commit via appropriate Render service deploy hook.

Local Setup Recap:
1. Copy server/.env.example → server/.env and adjust.
2. Copy .env.example → .env for frontend.
3. Install deps and run both services.

Enhancement Ideas:
- Lighthouse CI performance budgets (fail build if Lighthouse scores drop below thresholds).
- Semgrep additional static analysis & custom rules (possible SARIF severity gating).
- Database migration approval via GitHub Environment protection (production) – placeholder job present.
- Backend health snapshot comment on PR (already implemented for staging; can expand).
- (Optional future switch to Renovate if you later want dependency grouping logic instead of Dependabot.)

Migration Approval:
- Configure Environment protection for 'production' to require reviewers before Render deploy job executes (uses placeholder job for visibility).

Staging PR Comments:
- Staging workflow posts a comment with the Netlify alias preview when secrets are configured; custom domain mapping can be substituted later.

See also: DEPLOY_NETLIFY_SIMPLE.md for simplified non-CI deployment steps.
