Kid Friendly Cheat Sheet (Super Short)
=====================================

Goal: Get the app live with backend + frontend safely.

1. Must-Have Secrets (GitHub + hosting):
   - JWT_SECRET, JWT_REFRESH_SECRET (long random)
   - DATABASE_URL (Postgres)
   - NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID
   - RENDER_BACKEND_DEPLOY_HOOK_URL (if using deploy hook)
   - ALLOWED_ORIGINS (comma list of site URLs)
   - VITE_API_URL_PROD (points to backend /api/v1)

2. Order of Setup:
   1) Create Postgres → set DATABASE_URL.
   2) Fill secrets above.
   3) Create backend service (Render) → copy deploy hook.
   4) Create Netlify site → connect repo.
   5) Push to main → check CI green.
   6) Production deploy workflow runs → visit site.

3. Staging Flow (feature branches):
   - Open PR → staging workflow builds & posts preview link.
   - Backend health snapshot appears in PR comment.

4. Rollback:
   - Frontend: Netlify → pick older deploy.
   - Backend: Re-trigger deploy on earlier commit (Render dashboard).

5. Common Issues + Quick Fix:
   - CORS error: Add frontend URL to ALLOWED_ORIGINS.
   - 502 backend: Missing env var or DB unreachable.
   - Auth failing: Check JWT secrets + Authorization header.
   - Build fail: Missing dependency or wrong working directory.

6. Security Tools:
   - CodeQL & Semgrep run on every PR → read annotations.

7. Performance:
   - Lighthouse workflow produces report artifact (scores only for now).

8. Keep It Healthy Weekly:
   - Merge Dependabot PRs after CI passes.
   - Watch security scan alerts.
   - Verify DB backups (provider dashboard).

9. Optional Next Steps:
   - Add performance budgets (Lighthouse thresholds).
   - Add uptime monitor hitting /health.
   - Protect production environment with manual approval.

Ultra-Mini Flow:
   Clone → install → set envs → create DB → backend service → Netlify → secrets → push main → live.

Done.
