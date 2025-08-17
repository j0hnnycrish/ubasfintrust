# Always-On "Fully Free" Deployment Guide (2025)

As of August 2025, you can run a production-like stack "truly free" after buying a domain—if you accept constraints and design for the edge. This guide explains fully-free vs. free-tier, zero-sleep/always-on options, costs, and concrete blueprints tailored to this repository (frontend: Vite/React; backend: Node/Express + Knex; Postgres-style migrations).

## Table of Contents
- Definitions at a Glance
- TL;DR Recommendations by Stage
- Decision Matrix (Qualitative)
- Cost Model (Rule of Thumb)
- Blueprint A: Fully Free, Edge-Native (Refactor Required)
- Blueprint B: Mostly-Free, Minimal Refactor (Zero Sleep via Small Instance)
- Blueprint C: Serverless Functions + Serverless Postgres
- Free vs Free-Tier: What Sleeps?
- Realtime, Jobs, and Cron (Free-Friendly)
- Security & Compliance Notes (Enterprise/Gov)
- Tailoring to This Repository
- Step-By-Step: Neon Postgres (Free Tier) + Workers API
- Object Storage: R2 (Free-Friendly)
- Email / Notifications (Free Options)
- Observability on $0
- Hard Limits and Gotchas
- Quick Checklists
- Link Map (This Repo)
- Next Steps for You
- Appendix: Express → Hono Mapping Cheatsheet

> Pricing and quotas change frequently. Treat this as directional guidance. Always verify current limits before launch.

---

## Definitions at a Glance

- "Fully free": $0 monthly cloud bill at steady state (domain cost excluded). Usually requires architecture choices (edge/runtime limits), tight quotas, and refactors.
- "Free tier": Provider offers a free plan with hard/soft caps; can exceed to paid. Some are "always on"; others "sleep".
- "Zero sleeping" / "Always up": No cold start due to sleeping dynos/containers. Edge/serverless can still have cold starts per region, but no idle sleep shutdowns.
- "Edge-native": Deployed on workers/functions close to users; prefers stateless, short-CPU, event-driven patterns; durable state in managed storage.

---

## TL;DR Recommendations by Stage

- Solo dev / MVP (zero sleep, no backend containers):
  - Frontend: Cloudflare Pages (free) or Netlify (free tier)
  - API: Cloudflare Workers / Pages Functions via Hono or itty-router (requires refactor from Express)
  - DB: Cloudflare D1 (SQLite-compatible; free beta quotas) or Neon (Postgres, generous free)
  - Storage: Cloudflare R2 (free egress to Cloudflare)
- Early startup (more headroom, still low cost):
  - Keep edge API as above; move DB to Neon/Supabase (Postgres), storage R2/B2; add Cloudflare Queues/KV/DOs for jobs/realtime.
- SMB (moderate workloads, minimal refactor):
  - Frontend: Cloudflare Pages/Vercel/Netlify
  - Backend: Koyeb micro-instance free tier or Fly Machines free allowance (verify availability), or Render paid "starter" to avoid sleep; DB Neon/Supabase
- Enterprise/Gov proto (compliance considerations):
  - "Fully free" is unrealistic beyond prototypes. Use the same edge pattern but plan for paid enterprise tiers, VPC peering, regional/sovereign clouds.

---

## Decision Matrix (Qualitative)

- Need zero sleep without backend refactor? Use a small always-on instance (Koyeb free micro if available) or lowest paid tier on Render/Fly. Not fully free.
- Need fully free and always-on? Go edge-native: Cloudflare Pages + Workers, D1/Neon, R2. Requires code changes.
- Need Postgres semantics and migrations with minimal code churn? Prefer Neon (serverless Postgres) over D1; use serverless drivers.
- Heavy background jobs or long CPU? Use queues + short workers; avoid long-running containers on free plans.

---

## Cost Model (Rule of Thumb)

Let monthly cost C be:

C = domain + egress_over_free + DB_overages + build_minutes_over_free + queue_ops_over_free + observability_over_free

- Domain: ~$10–15/yr (not covered here)
- Egress: Cloudflare R2 to Cloudflare Workers/Pages is free; public egress may incur costs above free quotas.
- DB: D1 beta free includes modest reads/writes/storage; Neon/Supabase include generous free tiers. Exceed -> paid.
- Build minutes: Pages/Vercel/Netlify include free builds; frequent CI or monorepos may hit caps.
- Queues/Jobs: Cloudflare Queues offer free ops allowances; spikes can bill.
- Observability: Sentry/Logtail/Better Stack free tiers exist; paid beyond.

"Truly $0" is feasible for light traffic and edge-native designs. Expect to move to paid as usage grows.

---

## Blueprint A: Fully Free, Edge-Native (Refactor Required)

- Frontend: Cloudflare Pages
- API: Cloudflare Workers or Pages Functions (Hono/itty-router)
- DB: Cloudflare D1 (or Neon/Supabase for Postgres-compat)
- Storage: Cloudflare R2 (S3-compatible)
- Realtime: Durable Objects or WebSockets (Workers), or Supabase Realtime (if using Supabase)

Pros: Always-on, global edge, $0 viable; no container sleep.
Cons: Requires refactoring from Express; short CPU/timeouts; file system is ephemeral; DB quotas.

### Steps

1) Install & auth tooling

```bash
npm i -g wrangler
wrangler login
```

2) Create R2, D1, KV (as needed)

```bash
# R2 bucket
wrangler r2 bucket create app-uploads

# D1 database (SQLite-compatible)
wrangler d1 create app-db

# KV for sessions/flags (optional)
wrangler kv namespace create APP_KV
```

3) Add `wrangler.toml` (example)

```toml
name = "ubasfintrust-api"
main = "src/worker.ts"
compatibility_date = "2025-08-16"

[[d1_databases]]
binding = "DB"
database_name = "app-db"
database_id = "<filled-by-wrangler>"

[[r2_buckets]]
binding = "R2"
bucket_name = "app-uploads"

[[kv_namespaces]]
binding = "APP_KV"
id = "<filled-by-wrangler>"

[vars]
NODE_ENV = "production"
JWT_AUD = "ubas"
```

4) Refactor Express routes to Hono (example)

```ts
// src/worker.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'

export interface Env { DB: D1Database; R2: R2Bucket; APP_KV: KVNamespace }

const app = new Hono<{ Bindings: Env }>()
app.use('*', cors())

app.get('/health/readiness', (c) => c.json({ ok: true }))

app.get('/api/items', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM items ORDER BY id DESC').all()
  return c.json(results)
})

app.post('/api/items', async (c) => {
  const body = await c.req.json<{ name: string }>()
  await c.env.DB.prepare('INSERT INTO items (name) VALUES (?)').bind(body.name).run()
  return c.json({ ok: true })
})

export default app
```

5) Port migrations to D1

- Convert Postgres SQL (`database/migrations/*.sql`) to SQLite dialect for D1, or
- Keep Postgres on Neon and use HTTP/serverless driver from the Worker.

Run D1 migrations:

```bash
wrangler d1 execute app-db --local --file=./database/migrations/001_initial_schema.sql
```

6) Uploads to R2 (example)

```ts
app.post('/api/upload', async (c) => {
  const form = await c.req.parseBody()
  const file = form['file'] as File
  const key = `u/${crypto.randomUUID()}-${file.name}`
  await c.env.R2.put(key, await file.arrayBuffer())
  return c.json({ key })
})
```

7) Deploy

```bash
wrangler deploy
```

8) Frontend on Cloudflare Pages

- Set project to build with `npm ci && npm run build`
- Output dir: `dist`
- Set environment variables/Tokens used by the frontend

### When to pick Neon/Supabase over D1

- You rely on Postgres features (JSONB, CTEs, extensions) or existing Knex/SQL migrations.
- You want serverless Postgres with generous free tier and easy scale-up.

Use Neon from Workers via serverless driver or HTTP fetcher to a small Koyeb/Fly adapter if needed.

---

## Blueprint B: Mostly-Free, Minimal Refactor (Zero Sleep via Small Instance)

- Frontend: Cloudflare Pages, Vercel, or Netlify (free tiers)
- Backend: Single small always-on instance:
  - Koyeb: free micro instance(s) may be available; verify current offer
  - Fly.io: free Machines allowance fluctuates; may require payment method
  - Render: free services usually sleep; use low paid tier to avoid sleep
- DB: Neon/Supabase free tier
- Storage: Cloudflare R2 or Backblaze B2 (free egress to Cloudflare CDN)

Pros: Minimal code changes; keep Express/Knex.
Cons: "Fully free" not guaranteed if always-on requires paid plan; provider free tiers change frequently.

### Steps (example: Koyeb)

1) Containerize backend (this repo already has `server/Dockerfile`)
2) Push to GitHub, connect Koyeb, deploy service using Dockerfile
3) Set env vars and bind to Neon DB URL
4) Point frontend to the Koyeb API URL

---

## Blueprint C: Serverless Functions + Serverless Postgres

- Frontend: Vercel or Netlify free tier
- API: Vercel Functions/Edge Functions or Netlify Functions (Express adapter or Hono)
- DB: Neon/Supabase (Postgres)
- Storage: R2 or provider storage

Pros: Good DX, mostly free at small scale, lots of templates.
Cons: Per-request cold starts, regional latency; limits on CPU/memory.

---

## Free vs Free-Tier: What Sleeps?

- Cloudflare Workers/Pages: No sleep; short CPU/timeouts per request. Always-on edge.
- Vercel/Netlify Functions: No sleep, but can cold start and have exec limits; cron/schedules exist.
- Render free web services: Historically sleep on idle. Check current plans for "always on".
- Railway/Fly/Koyeb: Free offerings change; some require card; "always on" may need paid.

Always confirm current policy before promising "zero sleeping."

---

## Realtime, Jobs, and Cron (Free-Friendly)

- Realtime:
  - Workers Durable Objects (stateful coordinator, WebSockets)
  - Supabase Realtime (Postgres logical replication)
- Background jobs / queues:
  - Cloudflare Queues + Workers Consumers
  - Scheduled Cron Triggers (Cloudflare, Vercel, Netlify) 
- Caution: Long tasks must be chunked; use idempotency and backoff.

---

## Security & Compliance Notes (Enterprise/Gov)

- "Fully free" is unsuitable for compliance-bound production (PII, FIPS, FedRAMP). Use it for prototypes only.
- For serious workloads: plan paid tiers, regional isolation, data residency, private networking, per-tenant encryption, WAF and DDoS controls.
- Cloudflare has enterprise and regional services; Neon/Supabase offer org plans; adjust accordingly.

---

## Tailoring to This Repository

This repo includes:

- Frontend: Vite/React (`src/`, `client/`)
- Backend: Node/Express with Knex (`server/`) and SQL migrations (`database/migrations/`)

Choose one path:

### Path 1: Edge-native (Hono on Workers)

- Replace Express routes with Hono handlers in `src/worker.ts` (example above)
- Migrations: Convert to D1 (SQLite) or keep Postgres on Neon
- File uploads: Move to R2; serve via Cloudflare (private/public as needed)
- Env/Secrets: `wrangler.toml` [vars], Pages project env vars
- Health endpoints: Keep `/health/readiness` for probes
- Observability: Add Sentry SDK for Workers; use Cloudflare analytics

### Path 2: Minimal changes (Koyeb/Fly instance)

- Use `server/Dockerfile` and `server/Procfile`
- Pick Neon for Postgres, update `server/knexfile.*` connection URL
- Deploy container on Koyeb/Fly; ensure "no sleep" (may be paid)
- Keep current SQL migrations

---

## Step-By-Step: Neon Postgres (Free Tier) + Workers API

1) Create Neon project (free), get connection URL
2) Use a serverless Postgres client compatible with Workers (e.g., fetch-based drivers)
3) Store connection string in Workers secret

```bash
wrangler secret put DATABASE_URL
```

4) Query example (pseudo)

```ts
const res = await fetch(NEON_HTTP_SQL_ENDPOINT, { method: 'POST', body: JSON.stringify({ sql: 'select 1' }) })
```

Note: Traditional Node drivers (e.g., `pg` sockets) don’t run in Workers; use HTTP or edge-compatible drivers.

---

## Object Storage: R2 (Free-Friendly)

- Use presigned URLs for uploads/downloads when accessing from the browser
- Free egress from R2 to Cloudflare services; public egress counts against free quota
- Consider Backblaze B2 with Cloudflare CDN to keep egress free

---

## Email / Notifications (Free Options)

- Email: Resend, Mailersend, Brevo have developer/free tiers
- SMS/Voice: True free is rare; prefer email/Push for free tiers
- Push: Web Push is free via VAPID; store subscriptions in DB

---

## Observability on $0

- Sentry free plan for small projects
- Cloudflare Analytics (Requests, Cache, RUM)
- Logtail/Better Stack free for small ingest; or R2 logs + Athena-like tools (paid beyond)

---

## Hard Limits and Gotchas

- No filesystem on Workers; use R2/KV/DOs
- Short CPU limits; avoid large zips/PDF generation in-worker (use queues or lightweight libs)
- DB connection limits on free Postgres; pool via serverless drivers
- Cold starts on some serverless platforms, but not "sleep" on Workers
- Inbound concurrency spikes can hit per-second caps; apply backpressure and retries

---

## Quick Checklists

Edge-native (fully free candidate):
- [ ] Frontend on Cloudflare Pages
- [ ] API on Workers/Pages Functions using Hono
- [ ] DB on D1 or Neon with edge driver
- [ ] Storage on R2
- [ ] Cron via Cloudflare Schedules; Queues for background jobs
- [ ] Sentry + Analytics

Minimal-refactor (mostly free):
- [ ] Frontend on Pages/Netlify/Vercel
- [ ] Backend on Koyeb/Fly/Render (ensure no sleep; may be paid)
- [ ] DB on Neon/Supabase
- [ ] Storage on R2/B2

---

## Link Map (This Repo)

- General deploy guides:
  - `FREE_TIER_DEPLOYMENT_GUIDE.md`
  - `FRONTEND_DEPLOY.md`
  - `RENDER_DEPLOYMENT_INSTRUCTIONS.md`
  - `KOYEB_DEPLOY.md`
  - `DEPLOY_ANYWHERE.md`, `DEPLOYMENT_COMPARISON.md`, `QUICK_DEPLOY_VISUAL_GUIDE.md`
- Scripts you can reuse:
  - `scripts/deploy-all*.sh`, `scripts/deploy-*.sh`
  - `scripts/post-deploy-smoke.sh`, `scripts/test-components.sh`
- Config examples:
  - `server/Dockerfile`, `server/Procfile`, `server/knexfile.*`
  - `vercel.json`, `netlify.toml`, `render.yaml`

---

## Next Steps for You

1) Decide: Edge-native refactor (fully free, zero sleep) vs. minimal refactor (mostly free, possibly small cost for always-on)
2) If edge-native: set up Cloudflare (Pages, Workers, R2, D1/KV); start by porting one route to Hono and deploy a thin slice
3) If minimal: stand up Neon DB, deploy backend container on Koyeb/Fly, front on Pages/Vercel/Netlify
4) Add smoke tests and budgets (fail CI if approaching quotas)
5) Monitor and plan a paid upgrade path when you outgrow free limits

---

## Appendix: Express → Hono Mapping Cheatsheet

- `app.use(cors())` → `app.use('*', cors())`
- `req.body` → `await c.req.json()`
- `res.json(x)` → `c.json(x)`
- `req.params.id` → `c.req.param('id')`
- `multer` uploads → `await c.req.parseBody()` or presigned URL to R2
- `fs` → R2/KV/DOs (no disk)
- DB: Knex (Node) → D1 SQL or serverless Postgres driver

---

Remember: design for the edge, keep requests short, push state to durable stores, and you can be "always-on" for $0—until success forces you to scale.
