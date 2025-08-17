# Deployment Options, Free Tiers, and Hosting Patterns

This document compares viable platforms and patterns to deploy a modern web app like UBAS Financial Trust (Vite + React frontend, Node/Express + Socket.IO backend, Postgres DB, file uploads, emails/SMS), including free-tier realities, cPanel/shared hosting, VPS/dedicated, and “edge/serverless” stacks.

Contents

- Hosting archetypes (what fits where)
- Frontend hosting options (free tiers, notes)
- Backend/API hosting options (free tiers, WebSockets)
- Databases, caches, object storage (free tiers)
- Middleware/services (email, SMS, auth, logging, cron, queues)
- DNS, TLS, domains
- cPanel/shared hosting vs VPS/dedicated
- “Truly free” deployment strategies (after buying only a domain)
- Recommended blueprints (copyable)

## Hosting archetypes

- Static hosting (CDN + SPA): Best for Vite/React build output. No server code. Examples: Netlify, Vercel, Cloudflare Pages, GitHub Pages, Render Static, Firebase Hosting, S3+CloudFront.
- PaaS (container or buildpack) for APIs: Run Node/Express as a long-lived process (supports Socket.IO). Examples: Render, Railway, Koyeb, Fly.io, Clever Cloud, Google Cloud Run.
- Serverless/functions (FaaS/Edge): Great for stateless APIs; long-lived WebSockets can be difficult. Examples: Netlify Functions, Vercel Functions/Edge, Cloudflare Workers/Pages Functions, AWS Lambda.
- VPS/dedicated/bare metal: Full control (Docker, Nginx/Caddy, systemd). Examples: Hetzner, DigitalOcean, Vultr, Linode/Akamai, OVH, Oracle Cloud Free Tier.
- Shared hosting (cPanel/WHM): Optimized for PHP/MySQL. Node support is limited or via Passenger; long-lived processes and websockets are often constrained.

## Frontend (static) hosting

- Netlify (Free)
  - Pros: Simple, fast builds, SPA rewrites, forms, redirects, generous free tier.
  - Cons: Functions are serverless (not for websockets).
- Vercel (Hobby/Free)
  - Pros: Excellent DX, preview deployments, edge runtime.
  - Cons: Functions/Edge are not ideal for persistent Socket.IO.
- Cloudflare Pages (Free)
  - Pros: Very fast global CDN, integrates with Workers/Pages Functions; unlimited bandwidth; SSL.
  - Cons: SSR/features require Workers; Node APIs must run elsewhere or on Workers.
- GitHub Pages (Free)
  - Pros: Simple and free.
  - Cons: Basic; no server-side features.
- Render Static Sites (Free)
  - Pros: Ties into Render services; SPA rewrites.
  - Cons: Build minutes/bandwidth limits.
- Firebase Hosting (Free tier)
  - Pros: Global CDN, custom domains, easy.
  - Cons: Server-side needs Cloud Functions (fees at scale).
- S3 + CloudFront (AWS Free Tier for 12 months)
  - Pros: Enterprise-grade CDN.
  - Cons: Not perpetually free; setup overhead.

## Backend/API hosting (Node/Express + Socket.IO)

- Render (Free Web Service)
  - Pros: Easy, long-lived Node, health checks, deploy hooks; WebSockets supported; Postgres add-on.
  - Cons: Free dyno sleeps; cold starts, monthly limits.
- Railway (Free/Starter often limited; check current pricing)
  - Pros: Great DX, logs, variables, one-click Postgres.
  - Cons: Free limits change frequently; projects may require paid plan.
- Koyeb (Free tier)
  - Pros: Docker from repo, HTTP health checks, good free tier for a small service.
  - Cons: Features limited compared to paid.
- Fly.io (Requires billing to create app; has “free allowances”)
  - Pros: Global deploys, Machines, volumes, good for websockets.
  - Cons: Needs card; learning curve.
- Google Cloud Run (Always Free)
  - Pros: Container-based, scales to zero, generous free quota (region-dependent).
  - Cons: Cold starts; websockets supported via HTTP/2/GRPC proxying is tricky.
- Cloudflare Workers (Free)
  - Pros: Edge performance, 100k req/day free; supports WebSockets and Durable Objects.
  - Cons: Not a Node VM; Express/Socket.IO need refactor (Hono/itty-router; native WS API).
- Deta Space (Free)
  - Pros: Simple micro deployments.
  - Cons: Runtime constraints; websockets/long-lived Node not ideal.
- Clever Cloud / Zeet / Render Paid / Heroku (No longer free classic dynos)
  - Pros: Mature PaaS.
  - Cons: Paid for sustained apps.

## Databases (managed)

- Postgres
  - Supabase (Free): generous free, includes Auth/Storage/Realtime.
  - Neon (Free): serverless Postgres, branching; generous developer free tier.
  - Render Postgres (Free dev): small instance; may auto-suspend.
  - Railway Postgres (Free/limited): subject to changes; often requires paid.
  - ElephantSQL (Free tiny): very limited.
- MySQL
  - PlanetScale (Free dev): generous per-branch storage/conn; no FK constraints.
- MongoDB Atlas (Free M0)
  - Free small cluster for dev/testing.
- Caches/Queues
  - Upstash Redis (Free): generous free; serverless Redis/REST.
  - Redis Cloud (Free): small free tier.

## Middleware/services (operational building blocks)

- Email (transactional)
  - Resend (Free dev tier): generous for development; simple API, great DX.
  - SendGrid (Free): limited emails/month; widely supported.
  - Mailgun (Trial/Free): limited; paid for production reliability.
  - Postmark (Free trial): excellent deliverability; paid for prod.
- SMS/Voice
  - Twilio (Trial credit): good ecosystem; trial requires verified numbers.
  - Vonage/Nexmo (Trial): similar constraints.
- Auth
  - Supabase Auth (Free): email OTP, magic links, social providers.
  - Clerk (Free dev): generous dev tier; paid for prod at scale.
  - Auth0 (Free): limited MAUs; quick integration; paid scales.
- Logging/Tracing/Monitoring
  - Sentry (Free): error reporting and performance for small projects.
  - Logtail (Free tier): structured logs; good with Logflare/ClickHouse.
  - Grafana Cloud (Free): metrics/logs/traces small free tier.
- Cron/Scheduling
  - Cloudflare Cron Triggers (Free): schedule Workers/Pages Functions.
  - GitHub Actions (Free minutes): run periodic jobs; mindful of limits.
  - Render Cron Jobs (Free dev): periodic HTTP/command jobs (limits apply).
- Queues/Streams
  - Upstash Kafka (Free): serverless Kafka; generous dev tier.
  - CloudAMQP (Free Little/Lemur): small RabbitMQ instance for dev/testing.
- Search/Geo
  - Meilisearch (Self-host free): fast open-source search engine.
  - Algolia (Free dev tier): quick to integrate; paid for production.
  - Mapbox (Free dev): map tiles/geocoding within monthly free limits.

## Object storage (KYC docs, images)

- Cloudflare R2 (Free tier + egress to Cloudflare)
- Supabase Storage (Free as part of project)
- AWS S3 (12-month Free Tier)

## DNS, TLS, domains

- DNS: Cloudflare DNS (Free), Route 53 (paid), your registrar DNS (often free).
- TLS: Let’s Encrypt (Free) via platform auto-cert or certbot on VPS; Cloudflare proxy provides certs too.
- Domains: Typically not free; buy from Namecheap, Cloudflare Registrar, Google Domains (migrated), Porkbun, etc.

Nameservers and pointing

- You can use your registrar’s nameservers or switch to Cloudflare’s free DNS for advanced features and fast propagation.
- Point A/AAAA to a VPS IP, or use CNAME to platform-provided domains (e.g., `yourapp.netlify.app`).
- Apex/root domain often needs ALIAS/ANAME on some DNS providers for CNAME-like behavior.
- Platforms with auto TLS + custom domains: Netlify, Vercel, Render, Koyeb, Railway, Cloudflare Pages/Workers.

## cPanel/shared hosting vs VPS/dedicated

- Shared hosting (cPanel/WHM)
  - Designed for PHP/MySQL; static sites are fine.
  - Node/Express: Some hosts support Node via Passenger (cPanel “Setup Node.js App”), often with limits; websockets may not be stable; background processes may be killed.
  - DB: MySQL/MariaDB; Postgres sometimes available; external Postgres (Supabase/Neon) is often a better fit.
  - Best for: Marketing site, landing SPA, or PHP apps; not ideal for long-lived Node APIs with Socket.IO.
- VPS/dedicated (root access, dedicated IP)
  - Full control: Docker, systemd, Nginx/Caddy, UFW, monitoring. WebSockets fully supported.
  - Providers: Hetzner (€4–6/mo), Oracle Cloud Always Free (Arm VMs), DigitalOcean ($5/mo), Vultr ($5), Linode/Akamai ($5), OVH, Scaleway.
  - You manage updates, backups, security hardening.

Server stack specifics (VPS/dedicated)

- Reverse proxy: Nginx (ubiquitous), Caddy (auto TLS), Traefik (Docker-native).
- Process management: systemd (units) or PM2 (Node apps) if not using Docker.
- Containerization: Docker + Compose (simple), or k8s (k3s/microk8s) if you need orchestration.
- TLS: Caddy auto-HTTPS or Nginx + certbot; renewals automated.
- Firewall: UFW to allow 80/443 and SSH; fail2ban for brute-force protection.

## Can you deploy “truly free” after buying just a domain?

Short answer: Yes, with constraints. Here are workable zero-cost (or nearly) patterns:

1. Cloudflare-first (fully free if within quotas)

- Frontend: Cloudflare Pages (Free)
- API: Cloudflare Workers/Pages Functions (Free 100k req/day) using Hono/itty-router; use native WebSocket if needed; for Socket.IO you’d refactor to WS or Durable Objects.
- DB: Cloudflare D1 (Free beta quotas) or Neon/Supabase Free.
- Storage: Cloudflare R2 Free tier.
- Pros: All-in Cloudflare; great performance; no sleeping.
- Cons: Requires adapting Express/Socket.IO to Workers runtime.

1. Netlify + Koyeb + Neon (free)

- Frontend: Netlify Free (SPA)
- Backend: Koyeb Free (Docker from `server/Dockerfile`)
- DB: Neon (Free) or Supabase (Free)
- Storage: Supabase Storage (Free) or R2 (Free)
- Pros: Minimal code changes; closest to your current architecture.
- Cons: Free quotas; may sleep; watch monthly limits.

1. Render Static + Render Web + Supabase (free tier)

- Frontend: Render Static (Free)
- Backend: Render Web Service (Free; may sleep)
- DB: Supabase Free
- Pros: One provider for hosting; easy health checks/migrations.
- Cons: Sleeping/cold starts on free tier.

1. Oracle Cloud Always Free VPS (nearly free infra)

- Frontend: Serve static via Nginx
- Backend: Node container or PM2/systemd
- DB: Neon/Supabase Free (managed), or local Postgres on the VPS
- TLS: Let’s Encrypt (certbot)
- Pros: Full control; no sleeping; dedicated IP.
- Cons: Setup/ops overhead; capacity limited; availability varies by region.

## Recommended blueprints

Blueprint A: Zero-cost with minimal changes (Netlify + Koyeb + Neon)

- Steps:
  1. Deploy backend on Koyeb from GitHub using `server/Dockerfile`, expose 5000, health `/health`, set shared env.
  2. Run `npm run migrate:prod` once (Koyeb one-off).
  3. Point Netlify `VITE_API_URL`/`VITE_SOCKET_URL` to Koyeb URL and redeploy.
  4. Use Neon/Supabase as DB.

Blueprint B: Fully Cloudflare (Edge-native, refactor Express)

- Steps:
  1. Migrate Express routes to Hono/itty-router for Workers.
  2. Use native WebSocket/Durable Objects for realtime.
  3. Pages for frontend, D1 for SQL or Neon/Supabase; R2 for storage.
  4. Keep system check endpoints; adapt to Workers.

Blueprint C: VPS + Docker Compose (self-host)

- Stack:
  - Nginx (reverse proxy) + Let’s Encrypt (certbot or Caddy for auto-TLS)
  - api: Node container (built from `server/Dockerfile`)
  - postgres: optional local container or use Neon/Supabase externally
  - watchtower (optional auto-updates)
- Notes:
  - Open ports 80/443 only; use UFW.
  - Use separate non-root user; volumes for data; regular backups.
  - System monitoring: fail2ban, logrotate, uptime checks.

## Providers list (not exhaustive)

Static/Frontend

- Netlify, Vercel, Cloudflare Pages, GitHub Pages, Render Static, Firebase Hosting, S3+CloudFront, Surge.

Backend/PaaS

- Render, Railway, Koyeb, Fly.io, Google Cloud Run, Clever Cloud, Zeet, Deta Space, Heroku (paid), Azure Container Apps, AWS App Runner (paid), DigitalOcean App Platform (paid).

Serverless/Edge

- Cloudflare Workers/Pages Functions, Vercel Functions/Edge, Netlify Functions, AWS Lambda/API Gateway, Azure Functions, GCP Cloud Functions.

Databases

- Supabase, Neon, Render Postgres, Railway Postgres, PlanetScale, MongoDB Atlas, ElephantSQL.

Storage

- Cloudflare R2, Supabase Storage, AWS S3, Backblaze B2.

VPS/Dedicated

- Hetzner, OVH, DigitalOcean, Vultr, Linode/Akamai, Scaleway, Oracle Cloud Free.

Shared hosting (cPanel/WHM)

- HostGator, BlueHost, A2 Hosting, Namecheap, SiteGround, GreenGeeks (Node via Passenger varies by plan).

## Practical notes for this project

- WebSockets: Prefer PaaS/VPS/container platforms (Render/Railway/Koyeb/Fly/VPS). Serverless functions are not ideal unless using Cloudflare Workers with native WS.
- Health checks: We expose `/health` (liveness) and `/health/readiness` (DB). Point platform healthchecks to `/health` to avoid false negatives at cold start.
- Migrations: Run `npm run migrate:prod` at release (Render preDeploy, Fly release_command, or one-off on Koyeb/Railway).
- SPA rewrites: Frontend needs “all routes to `/index.html`” (already configured in `netlify.toml` and Render static config).

## TL;DR answers

- Can you deploy “truly free” after buying just a domain? Yes, if you stay within free quotas: e.g., Netlify (frontend) + Koyeb (backend) + Neon/Supabase (DB) or a fully Cloudflare stack. Expect sleeping/cold starts on many free PaaS; workers/edge avoid sleeping but may require code refactors.
- Want everything “in-house” on a control plane you own? Buy a low-cost VPS (Hetzner/DO/Vultr), use Docker Compose with Nginx + Node API + managed DB (Neon/Supabase) + Let’s Encrypt, and you’re set (non-free but cheap, with dedicated IP).
