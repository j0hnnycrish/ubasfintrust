# One-Box Hosting (Self-Hosted) — Kid-Friendly Guide

Goal: Run everything on your own server (one place). You’ll have:
- Server (API) online
- Website (frontend) online
- Database (Postgres)
- Redis (sessions)

Two easy paths:
- Coolify (recommended): simple web UI, like your own Render/Netlify.
- Dokku (advanced): like a mini-Heroku on your server.

If you’re new, pick Coolify.

---

## What you need
- A Linux VPS (Ubuntu 22.04+). Example providers: Hetzner, DigitalOcean.
- A domain (optional but nice): ubasfintrust.com
- This repo on GitHub (for one-click deploys).

---

## A) Coolify (recommended)
Coolify gives you a dashboard to deploy apps easily.

### 1) Install Coolify on your server
SSH into your server, then run (copy/paste):

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

When it finishes, visit http://YOUR_SERVER_IP:8000 in your browser and create an admin account.

### 2) Add Postgres
- In Coolify, click New Resource → Database → PostgreSQL → Create
- Wait until it’s ready
- Copy the connection URL (postgres://user:pass@host:5432/db)

### 3) Add Redis
- New Resource → Redis → Create
- Copy the connection URL (rediss://:password@host:port)

### 4) Deploy the Server (API)
- New Resource → Application → Git Repository → connect your GitHub → pick this repo
- Name: ubasfintrust-api
- Build Pack: Node.js
- Root Directory: clean/server
- Build Command:
  - npm ci || npm install && npm run build && npm run migrate
- Start Command:
  - npm start
- Environment Variables (add):
  - NODE_ENV = production
  - API_VERSION = v1
  - DATABASE_URL = (paste Postgres URL)
  - REDIS_URL = (paste Redis URL)
  - JWT_SECRET = (long random)
  - JWT_REFRESH_SECRET = (long random)
  - SESSION_SECRET = (long random)
  - ADMIN_EMAIL = admin@ubasfintrust.com
  - ADMIN_PASSWORD = Strong#Password1 (change later)
- Click Deploy. When done, copy the API URL (looks like https://api-...your-domain...)
- Test in browser: https://YOUR-API/health (should be OK)

### 5) Deploy the Website (SPA)
- New Resource → Static Site (or Application with Node.js Build and static publish)
- Repo: same
- Name: ubasfintrust-web
- Root Directory: clean
- Build Command:
  - npm ci || npm install && npm run build
- Publish Directory:
  - dist
- Environment Variables:
  - VITE_API_URL = https://YOUR-API/api/v1
  - VITE_SOCKET_URL = https://YOUR-API
  - VITE_APP_NAME = UBAS Financial Trust
  - VITE_NODE_ENV = production
- Click Deploy. Copy the Website URL.

### 6) Allow Website → Server (CORS)
- Go back to the API app → Environment Variables → add/update:
  - ALLOWED_ORIGINS = https://YOUR-WEBSITE
  - SOCKET_IO_CORS_ORIGIN = https://YOUR-WEBSITE
- Redeploy the API if asked.

### 7) Try it!
- Open the Website URL
- Click Login → use the admin email/password you set
- You should see the dashboard and data

### 8) Add domains (optional)
- Website: add ubasfintrust.com → follow DNS steps
- API: add api.ubasfintrust.com → follow DNS steps
- Update envs after domains:
  - Website: VITE_API_URL = https://api.ubasfintrust.com/api/v1, VITE_SOCKET_URL = https://api.ubasfintrust.com
  - API: ALLOWED_ORIGINS, SOCKET_IO_CORS_ORIGIN = https://ubasfintrust.com

---

## B) Dokku (advanced)
Dokku uses the command line. It’s powerful, but a bit more hands-on.

### 1) Install Dokku on your server
SSH into your server, then run:

```bash
wget https://raw.githubusercontent.com/dokku/dokku/v0.33.7/bootstrap.sh
sudo DOKKU_TAG=v0.33.7 bash bootstrap.sh
```

Finish setup in the web UI or CLI. Add your SSH key so you can push code.

Install plugins for Postgres and Redis:

```bash
sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git
sudo dokku plugin:install https://github.com/dokku/dokku-redis.git
```

### 2) Create apps
```bash
# API app
sudo dokku apps:create ubasfintrust-api
# Website app (static)
sudo dokku apps:create ubasfintrust-web
```

### 3) Databases
```bash
# Postgres
sudo dokku postgres:create ubas-pg
sudo dokku postgres:link ubas-pg ubasfintrust-api

# Redis
sudo dokku redis:create ubas-redis
sudo dokku redis:link ubas-redis ubasfintrust-api
```

Dokku will inject DATABASE_URL and REDIS_URL into the API app.

### 4) Configure API env
```bash
sudo dokku config:set ubasfintrust-api \
  NODE_ENV=production API_VERSION=v1 \
  JWT_SECRET=$(openssl rand -base64 48) \
  JWT_REFRESH_SECRET=$(openssl rand -base64 48) \
  SESSION_SECRET=$(openssl rand -base64 48) \
  ADMIN_EMAIL=admin@ubasfintrust.com \
  ADMIN_PASSWORD='Strong#Password1'
```

### 5) Deploy API (monorepo push)
From your laptop in the repo root:

```bash
git remote add dokku-api dokku@YOUR_SERVER:ubasfintrust-api || true
# Push only the server subfolder using git subtree
git subtree push --prefix clean/server dokku-api main
```

Dokku auto-detects Node, runs build, and starts. If migrations don’t run automatically, run:

```bash
sudo dokku run ubasfintrust-api npm run migrate
```

### 6) Deploy Website (static)
Option A (simple): build locally and serve with a tiny Nginx container

```bash
# Build locally
cd clean
npm ci || npm install
npm run build
cd ..

# Create a simple Dockerfile to serve dist/ with Nginx (temporary approach)
cat > Dockerfile.web <<'EOF'
FROM nginx:alpine
COPY clean/dist /usr/share/nginx/html
# Basic security headers
RUN printf "server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri $uri/ /index.html; }\n}\n" > /etc/nginx/conf.d/default.conf
EOF

# Tell Dokku to use this Dockerfile for the web app
git add Dockerfile.web
git commit -m "Add temporary Dockerfile for static site" || true
sudo dokku builder:set ubasfintrust-web selected dockerfile
sudo dokku builder-dockerfile:set ubasfintrust-web dockerfile-path Dockerfile.web

# Push the Dockerfile to Dokku app
git remote add dokku-web dokku@YOUR_SERVER:ubasfintrust-web || true
git push dokku-web HEAD:main -f
```

Option B (cleaner long-term): I can add a proper static buildpack config (static.json) or a dedicated Dockerfile in the repo if you prefer.

### 7) Wire CORS
Set API CORS to the website URL:

```bash
sudo dokku config:set ubasfintrust-api \
  ALLOWED_ORIGINS=http://YOUR_SERVER \
  SOCKET_IO_CORS_ORIGIN=http://YOUR_SERVER
```

If you add domains later, update these to https://ubasfintrust.com

### 8) Domains (optional)
```bash
# API
dokku domains:add ubasfintrust-api api.ubasfintrust.com
# Website
dokku domains:add ubasfintrust-web ubasfintrust.com
```

Point DNS at your server (A records). Add free TLS with:

```bash
sudo dokku letsencrypt:enable ubasfintrust-api
sudo dokku letsencrypt:enable ubasfintrust-web
```

---

## Quick checklist
- [ ] API /health is OK
- [ ] Website loads
- [ ] Admin login works
- [ ] Data loads (accounts, transactions)

## Troubleshooting
- 401 or loop: VITE_API_URL must end with /api/v1; ALLOWED_ORIGINS must exactly match your website URL.
- Health red: Postgres/Redis not ready or env missing.
- Changes not visible: rebuild and redeploy the Website.

---

Done! If you want, I can add the tiny static.json/Dockerfile for Dokku to make the website deploy even smoother.
