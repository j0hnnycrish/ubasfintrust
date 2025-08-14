Kid Friendly Project Guide
==========================

Imagine This Project Like A Mini Digital City
---------------------------------------------
Think of the app as a city:
- Frontend = The shop fronts and streets people see (React site built with Vite + Tailwind).
- Backend = The city services (Node/Express server doing logic, talking to the database, sending emails/SMS, etc.).
- Database = The library where long-term records are stored (PostgreSQL).
- CI/CD = Little delivery robots (GitHub Actions) that check, build, test, and ship new versions safely.
- Netlify = The parking lot where the frontend lives.
- Render (or similar) = The power plant where the backend runs.

What You Can Already Do Today
-----------------------------
1. Run checks automatically when you push code (lint, type-check, tests).
2. Build and deploy a STAGING preview of the website (Netlify alias) for pull requests.
3. Deploy PRODUCTION frontend automatically from `main` (Netlify) once set up.
4. Trigger backend deploys via a Render deploy hook (if you add the secret URL).
5. See a health snapshot of the backend in PR comments (staging workflow).
6. Scan code for security issues (CodeQL + Semgrep).
7. Track website performance (Lighthouse workflow schedule).
8. Get weekly dependency update pull requests (Dependabot).
9. Roll back quickly (Netlify keeps older builds; backend redeploy old commit).
10. Follow clear env variable examples (`.env.example` files) to configure things.

What Is NOT Working Yet (Until You Add Stuff)
---------------------------------------------
| Thing | Why It Matters | What Blocks It | Quick Fix |
|------|----------------|----------------|-----------|
| Real Backend Deploy | Needed so API is live | Missing RENDER_BACKEND_DEPLOY_HOOK_URL | Create backend service in Render → copy deploy hook → add GitHub secret |
| Database Migrations | Sets up tables | No DB URL or migrations not run | Get Postgres (Neon/Render), set DATABASE_URL secret, run migrations locally once or let server run them |
| Auth (Login/JWT) | Lets users sign in | JWT secrets not set | Set JWT_SECRET + JWT_REFRESH_SECRET (long random strings) in secrets and server `.env` |
| Email Sending | Password resets, alerts | No provider key | Pick SendGrid/Mailgun/Resend → add API key env var |
| SMS/Phone | OTP or alerts | No Twilio/Vonage setup | Create account → add SID & token env vars |
| File Uploads | KYC docs, images | No S3 bucket or local path | Either keep local (dev) or set S3_* env vars |
| CORS/API Access | Frontend talking to backend | Missing ALLOWED_ORIGINS / wrong URL | Set ALLOWED_ORIGINS to frontend prod + staging URLs |
| Staging Preview Domain | Friendly PR links | Using generated alias only | (Optional) Configure Netlify subdomain pattern |
| Performance Budgets | Prevent slow site | Budgets not defined | Add thresholds to Lighthouse workflow later |
| Manual Production Approval | Prevent accidents | Env protection not enabled | In GitHub: Settings → Environments → production → require reviewers |
| Backups | Disaster recovery | No automated dumps | Schedule DB backups in provider dashboard |
| Monitoring/Alerts | Know when it breaks | No uptime tool | Add StatusCake, Pingdom, or healthcheck cron |

Simple Setup Checklist (Print This!)
-----------------------------------
Frontend (Netlify):
- [ ] Create Netlify site & connect repo.
- [ ] Add build command: `npm run build` in the frontend root (or `clean/` depending on where package.json lives) and publish directory (e.g. `dist`).
- [ ] Add environment vars (those starting with `VITE_` if used).
- [ ] Note the site ID and create token → add as GitHub secrets: NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID.

Backend (Render example):
- [ ] Create new Web Service → link repo or simple Node service.
- [ ] Set start command (e.g. `node dist/index.js` after build) or add a build command (`npm run build`).
- [ ] Add all server env vars (see `server/.env.example`).
- [ ] Enable Auto Deploy on main (optional) OR use Deploy Hook.
- [ ] Copy deploy hook URL → add as GitHub secret RENDER_BACKEND_DEPLOY_HOOK_URL.

Database:
- [ ] Create PostgreSQL (Neon/Render/ElephantSQL).
- [ ] Copy connection string → set as DATABASE_URL (server env + GitHub secret).
- [ ] Run migrations: from `server/` run `npm run migrate` (if such script exists) OR confirm startup performs them.

Secrets (Minimum):
- [ ] JWT_SECRET (long random 64+ chars).
- [ ] JWT_REFRESH_SECRET (different long random string).
- [ ] ALLOWED_ORIGINS = https://your-site.netlify.app,https://your-domain.com.
- [ ] SOCKET_IO_CORS_ORIGIN = same as above.
- [ ] VITE_API_URL_PROD = https://api.your-domain.com/api/v1 (adjust path if different).

Optional Extras (Add Later):
- [ ] EMAIL API key.
- [ ] SMS provider credentials.
- [ ] S3 bucket keys.
- [ ] DIAGNOSTICS_TOKEN for internal status endpoints.

How To Read A Failure (Like Solving A Puzzle)
--------------------------------------------
1. CI Lint Fails → Read error message, fix code style/types, re-commit.
2. Tests Fail → Open failing test output, reproduce locally with `npm test` (or server test script), fix logic.
3. Deploy Staging Fails → Check which step turned red: build, deploy hook, or Netlify. Usually missing secret.
4. Backend 502 / Crash → Look at Render logs (likely missing env var or DB not reachable).
5. Frontend Can't Reach API → Inspect browser console; check VITE_API_URL_PROD and CORS envs.
6. Security Scan Flags Something → Open CodeQL/Semgrep PR annotations; patch code or suppress with comment (only if safe and documented).
7. Lighthouse Dropped (later with budgets) → Review report artifact; fix bundle size, images, or unused scripts.

Step-By-Step: From Zero To Live (Story Mode)
-------------------------------------------
Day 0: "I Just Cloned It"
- Install dependencies (frontend & server folders) → `npm install`.
- Copy `.env.example` files → fill in simple values (dev database, dummy secrets).
- Start backend → `npm run dev` (or equivalent). Start frontend → `npm run dev`.
- Open site locally; confirm API health at `/health`.

Day 1: "I Want A Staging Preview"
- Set up Netlify site & secrets.
- Push a feature branch; staging workflow posts a preview link → click it.
- Add any missing secrets until preview builds.

Day 2: "I Want Production"
- Create production database & set DATABASE_URL.
- Add real JWT secrets & allowed origins.
- Create Render backend service & deploy hook.
- Add deploy hook secret to GitHub.
- Push to `main` → production deploy workflow runs.
- Visit production frontend URL → test login / sample API call.

Common Fix Recipes (Tiny Cookbook)
---------------------------------
Problem: "Build failed: cannot find module"
Fix: Install missing package or ensure you ran install in correct folder.

Problem: "CORS error" in browser
Fix: Add the frontend URL to ALLOWED_ORIGINS and redeploy backend.

Problem: "Database connection refused"
Fix: Check DATABASE_URL formatting; verify DB is running and accessible to backend host.

Problem: "Unauthorized" every request
Fix: Ensure Authorization header is set in frontend fetch and JWT secrets match issued tokens.

Problem: "Security scan warnings"
Fix: Read the rule details; sanitize inputs, avoid eval/dangerous patterns.

Problem: "Preview link 404"
Fix: Wait for Netlify build to finish; confirm correct build output folder.

Safety Tips
-----------
- Never commit real secrets; only use `.env` locally and GitHub/hosting secret managers.
- Rotate keys if you accidentally leak them (regenerate, update, redeploy).
- Keep dependencies updated (merge Dependabot PRs after CI green).
- Add manual approval for production if multiple contributors join.

Next Power-Ups (When Comfortable)
---------------------------------
- Add performance budget thresholds to Lighthouse workflow.
- Add uptime monitoring ping (cron hitting /health).
- Add semantic release versioning.
- Add coverage reporting badge.
- Introduce feature flags for risky changes.

Ultra Short Summary
-------------------
You already have: automatic checks, preview deploys, production pipeline, security scans. To go fully live: supply secrets, create backend + database, run migrations, set domains, test endpoints. Then keep an eye on scans and performance.

You Got This 🚀
