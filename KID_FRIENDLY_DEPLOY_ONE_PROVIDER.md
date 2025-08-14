# Host Everything in One Place (Simple Guide)

Goal: Put the website (frontend) and the server (backend) online in ONE place so the whole app works.

Recommended options (Vercel alternatives):
- Easiest: Render (simple UI, free tier; server may sleep when idle).
- Also good: Fly.io (fast, global; needs a CLI; slightly more advanced).
- Also works: DigitalOcean App Platform (clear pricing; simple UI; paid for always-on).

This page shows Render step-by-step (kid-friendly), with quick notes for Fly.io and DigitalOcean at the end.

---

## Part A — Render (one place, simple)

You need:
- A GitHub account with this project in it.
- A Render account: https://render.com

We’ll create 4 things: Database (Postgres), Redis, Server (API), Website (Static Site).

### 1) Make the Database (Postgres)
1. Sign in to Render → Databases → New Database.
2. Name: ubasfintrust-db (any name works).
3. Create. Wait until it says “Available”.
4. Open it → copy the “Internal Connection” URL (looks like postgres://user:pass@host:5432/dbname).

### 2) Make Redis (for sessions)
Option A: In Render, Add-Ons → Upstash Redis → Create free Redis → copy the connection string (rediss://...)

Option B: Use https://upstash.com directly → create Redis → copy the URL.

### 3) Put the Server (API) online
1. Render → New → Web Service.
2. Connect GitHub → pick this repo.
3. Root directory: clean/server
4. Environment: Node
5. Build Command:  npm install && npm run build && npm run migrate
6. Start Command:  npm start
7. Instance type: Free (OK for testing; sleeps when idle).
8. Create Web Service.
9. Open the service → Environment → add these variables:
   - NODE_ENV = production
   - API_VERSION = v1
   - DATABASE_URL = (paste Postgres URL)
   - REDIS_URL = (paste Redis URL)
   - JWT_SECRET = (long random string)
   - JWT_REFRESH_SECRET = (long random string)
   - SESSION_SECRET = (long random string)
   - ADMIN_EMAIL = admin@ubasfintrust.com (or your email)
   - ADMIN_PASSWORD = Strong#Password1 (change later)

When deploy finishes, copy the Server URL (example: https://your-api.onrender.com).
Test: open https://your-api.onrender.com/health → should be OK.

### 4) Put the Website online
1. Render → New → Static Site.
2. Pick this repo.
3. Root directory: clean
4. Build Command: npm install && npm run build
5. Publish Directory: dist
6. Environment variables:
   - VITE_API_URL = https://your-api.onrender.com/api/v1
   - VITE_SOCKET_URL = https://your-api.onrender.com
   - VITE_APP_NAME = UBAS Financial Trust
   - VITE_NODE_ENV = production

After deploy, copy the Website URL (example: https://your-web.onrender.com).

### 5) Allow the Website to talk to the Server (CORS)
Back to the Server (Web Service) → Environment → add/update:
- ALLOWED_ORIGINS = https://your-web.onrender.com
- SOCKET_IO_CORS_ORIGIN = https://your-web.onrender.com
Save and redeploy the Server if asked.

### 6) Try it!
- Open the Website URL.
- Click Login.
- Use ADMIN_EMAIL and ADMIN_PASSWORD you set above.
- You should see the dashboard. Try viewing accounts/transactions.

If login fails or spins:
- Make sure VITE_API_URL ends with /api/v1.
- Make sure ALLOWED_ORIGINS exactly matches your Website URL.
- Wait 1–2 minutes (free plans may be slow to wake up).

### 7) Custom domains (optional but nice)
- Website → Settings → Custom Domains → add ubasfintrust.com
- Server → Settings → Custom Domains → add api.ubasfintrust.com
- Follow Render’s DNS steps (add CNAME records at your domain registrar).
- Update env after domains:
  - Website: VITE_API_URL = https://api.ubasfintrust.com/api/v1; VITE_SOCKET_URL = https://api.ubasfintrust.com
  - Server: ALLOWED_ORIGINS, SOCKET_IO_CORS_ORIGIN = https://ubasfintrust.com

### 8) Quick checklist
- [ ] Server /health is OK
- [ ] Website loads
- [ ] Admin login works
- [ ] Data loads (accounts, transactions)
- [ ] Admin-only pages blocked for normal users

---

## Part B — Fly.io (also one place)
- Install flyctl → login.
- From the clean/ folder in this repo you can use the helper:

```zsh
make install-cli
flyctl auth login
make deploy-fly
```

It will deploy the backend and the frontend and print two URLs.
You still need to set proper secrets and possibly Postgres/Redis (Fly has Launch templates for these). See scripts/deploy-flyio.sh for details.

---

## Part C — DigitalOcean App Platform (simple UI)
- Create an App → connect GitHub.
- Add one “Web Service” from clean/server (Node). Build: npm install && npm run build && npm run migrate. Start: npm start. Set the same env vars as above.
- Add one “Static Site” from clean. Build: npm install && npm run build. Publish: dist. Set VITE_* env vars as above.
- Add a managed Postgres (DO Database) and a Redis (use Upstash or DO’s Redis), paste DATABASE_URL and REDIS_URL.
- Add domains (ubasfintrust.com, api.ubasfintrust.com) and update envs accordingly.

---

## You’re done!
For a one-command alternative (Railway+Vercel, two providers), see the Quick start in PRODUCTION_READINESS.md or run:

```zsh
cd clean
make install-cli
railway login && vercel login
make deploy-railway
```
