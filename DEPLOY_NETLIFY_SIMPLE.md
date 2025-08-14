Simplified Production Deployment (Netlify + Low/No-Cost Backend)
================================================================

Goal: Get the React (Vite) frontend live on your custom domain via Netlify and stand up the Express API + Postgres on a free / very low‑cost host (Render, Railway, or Neon + Fly.io) with only the minimum required environment settings. Grow later (notifications, S3, etc.).

--------------------------------------------------
High-Level Architecture (Phase 1 — Minimal Live)
--------------------------------------------------
Frontend: Netlify (static build from repo root `clean/`)
Backend API: Render (Free) OR Railway (Free credits) OR Fly.io
Database: Neon.tech (Free Postgres) OR Railway Postgres OR Render Postgres
File Uploads (KYC): Defer initially (stores locally). Later: Cloudflare R2 / S3.
Notifications (SMS/Email): Defer. Keep code dormant (env vars unset).
Domain: Apex + www → Netlify. Subdomain `api.` → backend service.

--------------------------------------------------
Step 0: Repo Layout Reminder
--------------------------------------------------
Frontend (Vite) root: `clean/`
Backend (Express/Knex) root: `clean/server/`

--------------------------------------------------
Step 1: Fork / Push & Clean Up
--------------------------------------------------
1. Ensure the GitHub repository has this structure intact.
2. (Optional) Move backend into its own repo later for cleaner CI; not required now.

--------------------------------------------------
Step 2: Provision Postgres (Neon Example)
--------------------------------------------------
1. Create a Neon project → copy the Postgres connection string (psql format or URI).
2. Note: Update to a pooled connection only if many connections/timeouts appear.
3. Save as `DATABASE_URL` (example: `postgresql://user:pass@host/db?sslmode=require`).

Alternative: Use Render Postgres or Railway “Add Postgres” and copy the URL.

--------------------------------------------------
Step 3: Deploy Backend (Render Example)
--------------------------------------------------
1. Go to render.com → New → Web Service → Connect the GitHub repo.
2. Root directory: set to `clean/server` (advanced setting) so it runs the backend only.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Instance Type: Free
6. Environment Variables (Minimum):
   - NODE_ENV=production
   - PORT=10000 (Render auto provides PORT; you can leave it blank – just ensure server uses `process.env.PORT || 3000`)
   - DATABASE_URL=Your Postgres URI
   - JWT_SECRET=generate a long random string
   - JWT_REFRESH_SECRET=another long random string
   - BCRYPT_ROUNDS=12
   - FRONTEND_URL=https://yourdomain.com
   - BACKEND_URL=https://api.yourdomain.com
   - ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   - ADMIN_EMAIL=you@yourdomain.com
   - ADMIN_PASSWORD=tempStrongPassword123!
7. Click Deploy. Wait for first build.
8. After deploy: Open Shell → run `npm run migrate` to create tables, then (optionally) `npm run seed` if seeds exist.

Railway Variant:
 - Create a new project → Add Service → Deploy from repo, set root to `clean/server`.
 - Add Postgres plugin; it injects `DATABASE_URL` automatically.
 - Add same remaining env vars.

Fly.io Variant (compact):
 - `fly launch` inside `clean/server` (requires `fly.toml` creation) → choose Node builder.
 - Provision a Neon DB externally, set env with `fly secrets set DATABASE_URL=...` etc.

--------------------------------------------------
Step 4: (Optional) Enable Health & Smoke Checks
--------------------------------------------------
Visit `https://<backend-host>/health` once live to confirm status JSON.

--------------------------------------------------
Step 5: Point API Subdomain
--------------------------------------------------
When backend URL stable (e.g., `ubas-api.onrender.com`):
1. In your DNS (same provider handling Netlify domain): create CNAME:
   - Name: `api`  Value: backend host domain  TTL: default
2. Wait for propagation (5–30 min). test: `curl -I https://api.yourdomain.com/health`

--------------------------------------------------
Step 6: Frontend (Netlify) Deploy
--------------------------------------------------
1. Netlify → New Site from Git → select repo.
2. Base directory: `clean` (because `package.json` is there).
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variables (override those in `netlify.toml` if needed):
   - VITE_API_URL=https://api.yourdomain.com
   - VITE_APP_NAME=UBAS Financial Trust
   - VITE_MINIMUM_DEPOSIT=100
   - VITE_MINIMUM_WITHDRAWAL=20
   - VITE_MAXIMUM_DAILY_TRANSFER=50000
6. Deploy.
7. After deploy, add your custom domain in Netlify dashboard (apex + www). Follow DNS instructions (ALIAS/ANAME for apex, CNAME for www).

--------------------------------------------------
Step 7: Update CORS / Origins (If Not Already)
--------------------------------------------------
Ensure backend env `ALLOWED_ORIGINS` includes ALL forms you’ll use:
`https://yourdomain.com,https://www.yourdomain.com,https://<netlify-temp-site>.netlify.app`
Then redeploy/restart backend.

--------------------------------------------------
Step 8: Verify End-to-End
--------------------------------------------------
1. Frontend loads over your domain.
2. Network tab shows API calls to `api.yourdomain.com` (200 OK / 401 where expected).
3. Registration / login flows complete (creates admin on first run if configured).
4. Check console: no CORS errors.

--------------------------------------------------
Minimal Backend Env Var Cheat Sheet
--------------------------------------------------
Required for Core Auth:
- DATABASE_URL
- JWT_SECRET
- JWT_REFRESH_SECRET
- BCRYPT_ROUNDS (default 12 acceptable)

Strongly Recommended:
- FRONTEND_URL
- BACKEND_URL
- ALLOWED_ORIGINS
- ADMIN_EMAIL / ADMIN_PASSWORD (bootstrap admin)

Optional / Advanced (leave unset now to save setup time):
- REDIS_* (if you add caching)
- S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, S3_ENDPOINT (for off-box file storage)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (email via SMTP)
- SENDGRID_API_KEY / MAILGUN_API_KEY / RESEND_API_KEY (transactional email)
- TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / VONAGE_API_KEY / MESSAGEBIRD_API_KEY etc. (SMS)
- LOG_LEVEL

--------------------------------------------------
Cost-Saving Tips
--------------------------------------------------
1. Avoid always-on dynos: Render free spins down; that’s OK for MVP.
2. Use Neon (serverless Postgres) to cut idle cost.
3. Postpone file storage + heavy notification providers until users exist.
4. Turn off verbose logging (LOG_LEVEL=warn) in production.
5. Weekly review: remove unused provider keys.

--------------------------------------------------
Zero-Downtime Env Changes
--------------------------------------------------
Change env vars in provider dashboard → redeploy. No code change needed unless adding a new feature flag.

--------------------------------------------------
Troubleshooting Quick Table
--------------------------------------------------
Issue: CORS errors → Check `ALLOWED_ORIGINS` & protocol (https vs http).
Issue: 500 on auth → Ensure JWT secrets set & not short length.
Issue: DB connection refused → SSL required? Append `?sslmode=require` for Neon/Render.
Issue: Admin not created → Confirm ADMIN_EMAIL + ADMIN_PASSWORD present first boot; then remove password variable if desired.
Issue: Stale frontend API URL → Clear browser cache or bump build (edit a file & redeploy).

--------------------------------------------------
Future Enhancements
--------------------------------------------------
- Add CI (GitHub Actions) to run `npm run build` + backend tests before deploy.
- Move secrets into Netlify + Render environment groups.
- Add S3-compatible storage (Cloudflare R2) for KYC docs with signed URLs.
- Introduce Redis for rate limiting, switch ephemeral features off until needed.

--------------------------------------------------
Fast Start Summary
--------------------------------------------------
1. Create Neon DB → copy URL.
2. Deploy backend on Render with minimal env vars → run migrations.
3. Point `api.` CNAME to Render host.
4. Deploy frontend to Netlify with `VITE_API_URL` set.
5. Add custom domain (apex + www) to Netlify, wait for DNS.
6. Test flows; iterate.

You’re live with minimal spend.
