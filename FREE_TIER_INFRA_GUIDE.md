Free Tier Infrastructure & Services Guide
=======================================

Goal
----
Build and operate the project (frontend + backend + database + security + monitoring) almost entirely on permanently free or sustainable starter tiers (NOT one‑time 12‑month promos) while keeping an easy upgrade path.

Current Core Choices (Baseline)
--------------------------------
- Database / Auth / Storage: Supabase (chosen) – Free tier with Postgres, Auth, Row Level Security, Storage buckets, Edge Functions, Realtime, limited quotas.
- Frontend Hosting: Netlify (free tier) – Static + serverless functions (if needed), preview deploys.
- Backend Hosting: Options:
  1. Render (free web service) – Sleep on inactivity, limited RAM/CPU.
  2. Railway (free monthly usage credits; may need card; hours reset monthly, can sleep).
  3. Fly.io (usage-based; generous but metered; requires some config). 
  4. Supabase Edge Functions (alternative for some endpoints; good for light stateless tasks).
- CI/CD: GitHub Actions free (within minutes quota for your account type). 
- Security Scans: CodeQL & Dependabot & Semgrep (free for public repos; Semgrep OSS free; Dependabot free on any repos).

Philosophy
----------
Pick one provider per pillar first; avoid premature multi-cloud complexity. Upgrade only when you consistently approach 70–80% of a quota.

Legend
------
Category table columns: Provider | Core Use | Free Tier Highlights | Limits / Gotchas | When To Upgrade.

Core Data & Auth
----------------
| Provider | Core Use | Free Tier Highlights | Limits / Gotchas | When To Upgrade |
|----------|----------|---------------------|------------------|-----------------|
| Supabase | Postgres + Auth + Storage + Realtime | 500MB DB, generous monthly bandwidth, built-in RLS, OAuth, Storage 1GB | Hard storage & row limits; compute becomes bottleneck with high TPS | Outgrow DB size or sustained > 100 req/sec |
| Neon.tech | Serverless Postgres | Autosuspend, branching, generous free | Cold starts add latency | Need consistent high performance / larger storage |
| PlanetScale | MySQL serverless | Branching, schema change safety | MySQL not Postgres; row/table limits | Need advanced features or large data |

Object / File Storage & Media
-----------------------------
| Provider | Core Use | Free Tier Highlights | Limits / Gotchas | When To Upgrade |
|----------|----------|---------------------|------------------|-----------------|
| Supabase Storage | App file uploads (KYC docs) | Integrated auth & policies | Aggregate storage limit | Big media library; need CDN transforms |
| Cloudflare R2 | Cheap S3-compatible storage | Free egress to Cloudflare Workers/Images | Slight eventual consistency | Large volume or advanced lifecycle needs |
| Backblaze B2 | Backup/archival | 10GB free storage | Download bandwidth costs after free quota | Heavy hot access patterns |

Frontend Hosting / CDN
----------------------
| Provider | Core Use | Free Tier Highlights | Limits / Gotchas | When To Upgrade |
|----------|----------|---------------------|------------------|-----------------|
| Netlify | Static frontend + preview deploys | Generous build minutes & bandwidth for small apps | Build minutes can exhaust if many PRs per day | Exceed build/time/BW quotas |
| Vercel | Alternative static hosting | Fast edge network; preview for each PR | Serverless cold start if using API routes | Bandwidth/serverless invocation growth |
| Cloudflare Pages | Static hosting | Unlimited requests, global CDN | Build runtime caps; functions memory limits | Need advanced SSR features |

Backend Hosting / Compute
-------------------------
| Provider | Core Use | Free Tier Highlights | Limits / Gotchas | When To Upgrade |
|----------|----------|---------------------|------------------|-----------------|
| Render Web Service | Express API | Auto deploys, simple dashboard | Sleeps after 15m idle; cold start ~30s | Need always-on latency sensitive API |
| Railway | Container/Node service | Usage credits reset monthly | May require verification; usage caps | Persistent load + hitting credit ceiling |
| Fly.io | Region-flexible VMs | Scale to zero patterns; global | Slightly steeper learning curve | More memory/CPU or multi-region complexity |
| Supabase Edge Functions | Offload light endpoints | JS/TS functions at edge; identity integration | Not suited for long-running or heavy compute | Heavy multi-step transactions |
| Cloudflare Workers | Ultra low-latency serverless | 100k/day free requests | Memory/duration limits; KV eventual consistency | Need more reqs/duration/storage |

Email (Transactional)
---------------------
| Provider | Use | Free Tier Highlights | Limits / Gotchas | Upgrade Trigger |
|----------|-----|---------------------|------------------|------------------|
| Resend | Transactional + simple APIs | 3k emails/mo (check current) | Newer ecosystem | Higher monthly emails |
| SendGrid | Password resets, notices | 100/day free | Strict reputation rules | Need higher volume / dedicated IP |
| Mailgun | Transactional | Trial includes limited emails | Some features locked behind paid | Volume or advanced analytics |
| Postmark | High deliverability | Limited test sandbox only | No real production in free | Need production sending |
| AWS SES | Cheap scalable | 62k/mo if from EC2 / limited otherwise | Setup complexity (DKIM/SPF) | Sustained volume + bounce mgmt |

SMS / Phone
-----------
| Provider | Use | Free Tier / Trial | Limits | Upgrade Trigger |
|----------|-----|-------------------|--------|------------------|
| Twilio | OTP / alerts | Trial credit + single verified number | Needs verified numbers; trial watermark | Production multi-user messaging |
| Vonage | SMS/Voice | Trial credit | Country pricing complexity | Scaling regions |
| MessageBird | SMS | Trial balance | Per-country coverage varies | Volume/cost efficiency |

Authentication Extras (If Not Using Supabase Auth)
-------------------------------------------------
| Provider | Use | Free Tier | Limits | Upgrade |
|----------|-----|----------|--------|---------|
| Clerk | Hosted auth UI | MAU based free tier | Lock-in to provider style | Higher MAUs |
| Auth0 | Enterprise-like auth | 7k MAU free | Rate limiting; complexity | MAU scale/security needs |
| Firebase Auth | Basic auth | Unlimited MAUs | Vendor tie-in | Need self-hosted flexibility |

Caching / Edge / Queues
-----------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| Upstash Redis | Caching, rate limits, queues | Global, pay per request with free tier allowance | Size & throughput caps | High TPS or dataset size |
| Redis Cloud Free | Basic caching | Small memory cap | Persistence + bigger mem need | Need > free memory/throughput |
| Cloudflare Queues + Workers | Background tasks | Integrated with Workers | Execution time constraints | Heavy processing / long jobs |

Logging & Monitoring
--------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| Better Stack (Logs/Uptime) | Central logs + uptime | Basic retention & monitors | Short retention | Need longer retention / more sources |
| Axiom | Structured logs & metrics | Generous ingest for small apps | Retention based on plan | Higher ingest | 
| Grafana Cloud | Metrics, logs, traces | 10k series, Loki logs | Setup complexity | More metrics/traces |
| UptimeRobot | Basic external uptime | 5-min checks, limited monitors | Interval not sub-minute | Need faster detection |
| Healthchecks.io | Cron / background job watchdog | Limited checks | Team features locked | Many jobs or notifications |

Error & Performance Tracking
----------------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| Sentry | Error + performance traces | Generous events/day starter | Quotas on events, retention | Need more events or advanced retention |
| Highlight.io | Session replay + errors | Free for OSS | Need private plan for closed source | Private app scaling |
| LogRocket (Alt) | Session replay | Trial only effectively | Pricing after trial | Consistent replay needs |

Analytics & Product Insights
----------------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| Umami (self-host) | Privacy analytics | Free self-host | Hosting resource cost | High traffic + scaling |
| Plausible (self-host) | Simple analytics | Self-host or paid SaaS trial | Self-host maintenance | Need managed simplicity |
| Cloudflare Web Analytics | Passive analytics | Free with DNS proxied | Less detailed event data | Need custom funnels |
| PostHog (Open Source) | Product analytics | Free self-host; cloud free tier | Infra overhead | Large event volumes |

CI/CD & Code Quality
--------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| GitHub Actions | CI pipeline | Minutes per month free (public unlimited) | Private repo minutes limited | Large test matrix or long builds |
| CodeQL | Static security analysis | Free for public repos | Private requires GH Advanced Sec | Private code + security need |
| Semgrep | Security & SAST | OSS free scanning | Team features gated | Policy enforcement at scale |
| Dependabot | Dependency updates | Unlimited | PR noise if many ecosystems | Need grouping (then switch to Renovate) |

Domains, DNS, Certificates
--------------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| Cloudflare DNS | Managed DNS + CDN | Free DNS, SSL, CDN caching | Some enterprise features gated | Advanced WAF, logs depth |
| Let's Encrypt | TLS certificates | Free 90-day certs auto-renew | Need automation or hosting integration | Need EV/OV certs |

Secrets Management
------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| GitHub Actions Secrets | CI/CD secrets | Integrated, easy | Manual rotation | Complex secret versioning |
| Doppler (Starter) | Centralized secrets | Free developer plan | Seat & project limits | Team collaboration scale |
| 1Password Secrets Automation | Secure storage | Trial/limited | Paid for larger scale | Need advanced automation |

Backups & Disaster Recovery
---------------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| Supabase | Point-in-time backup (plan dependent) | Basic backups on free | Retention limited | Need longer retention / PITR depth |
| pg_dump (manual) | Manual Postgres dump | Free tool | Manual scheduling | Need automation / retention mgmt |
| GitHub Repo | Infra-as-code backup | History and versioning | Not DB content | Store large generated binaries |

Feature Flags & Config
----------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| ConfigCat | Toggle features | Free tier MAUs | MAU/flag count caps | Many flags / more users |
| GrowthBook | Experimentation & flags | Self-host (free) | Requires hosting costs | Scale or hosted convenience |
| Unleash | Self-host flags | OSS core free | Setup complexity | Enterprise features |

Search (If Needed Later)
------------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| Meilisearch (self-host) | In-app search | Fast, lightweight | You host infra | Large dataset / clustering |
| Algolia | Hosted search | Small operations quota free | Hard caps & cost jumps | Higher search volume |

Geolocation / IP Intelligence (Optional)
----------------------------------------
| Provider | Use | Free Tier Highlights | Limits | Upgrade |
|----------|-----|---------------------|--------|---------|
| ipinfo.io | Location / ASN | 50k req/mo (check current) | Rate limits | Higher volume |
| ipapi.co | IP enrichment | Daily free limit | Accuracy variations | Higher daily calls |

Recommended Minimal Free Stack (Practical)
------------------------------------------
1. Frontend: Netlify (what you have) + Cloudflare DNS for your domain (set A/CNAME + proxy for CDN/SSL if desired). 
2. Backend: Render free service (Express) – Accept sleep for cost $0; if sleep is unacceptable later move to Fly.io / paid Render.
3. Database + Auth + Storage: Supabase (leveraging its Auth to reduce custom code surface). 
4. Object/File Storage: Start with Supabase Storage; move heavy assets later to Cloudflare R2 + public bucket.
5. Caching / Rate Limits: Upstash Redis (only when needed – implement lazy, not day 1). 
6. Email: Resend (simple) OR SendGrid (if higher daily small sends). 
7. SMS: Only enable when feature truly required; start with Twilio trial for development flows. 
8. Monitoring: UptimeRobot (external), Sentry (errors), health endpoint already in staging comment. 
9. Security: Continue CodeQL, Semgrep, Dependabot. 
10. Analytics: Cloudflare Web Analytics (if using Cloudflare DNS) or defer until needed. 

Quotas To Watch (Early Warning)
-------------------------------
- Supabase DB size hitting ~80%.
- Netlify build minutes nearing quota (many PRs?).
- Render cold starts causing user friction (metrics from logs). 
- Dependabot PR backlog > 10 (indicates update fatigue). 
- Sentry error event spikes (indicates regression). 

Migration Path When Growing
---------------------------
| Pain | First Symptom | Mitigation (Free) | Upgrade Path |
|------|---------------|-------------------|--------------|
| Cold starts backend | Users wait first hit | Ping every 10m with cron (UptimeRobot) | Paid always-on instance |
| DB storage limit | Migration fails / writes rejected | Prune old logs/data | Upgrade Supabase tier / move to dedicated Postgres |
| Build timeouts | CI minutes deplete | Cache deps, smaller test matrix | Paid GH Actions / external CI (CircleCI, etc.) |
| File storage cost | Upload blocked | Compress & purge stale files | R2 + CDN + lifecycle rules |
| High email volume | Rate limited | Batch & queue | Paid email plan + dedicated IP |
| Latency global users | Complaints from far regions | Add CDN caching for static API responses | Multi-region deploy (Fly.io, edge functions) |
| Logs missing context | Hard debugging | Structured logging (JSON) | Centralized paid log platform |

Step-By-Step Setup (10-Year-Old Friendly)
-----------------------------------------
1. Set Domain DNS at Cloudflare (optional but recommended) for fast, free CDN and SSL.
2. Netlify site already connected → confirm build settings.
3. Create Supabase project → copy the DATABASE_URL (anon/public keys used only on frontend where needed with RLS rules).
4. Add secrets to GitHub (JWT secrets, DATABASE_URL, deploy hook if using Render, Netlify tokens, allowed origins, VITE_API_URL_PROD).
5. Create Render backend (or Railway) → environment variables replicate GitHub secrets.
6. Push feature branch → staging workflow gives preview link & backend health snippet.
7. Merge to main → production deploy pipeline runs → smoke test passes.
8. Add UptimeRobot monitor (https://your-api/health) and optionally ping the staging alias.
9. Add Sentry SDK later (frontend & backend) once you want visibility (still free tier).
10. Watch Semgrep/CodeQL alerts on PRs; fix early.

Security Hardening (Still Free)
-------------------------------
- Enforce HTTPS via Cloudflare + Netlify (auto). 
- Add Helmet middleware on Express (if not included). 
- Enable RLS policies in Supabase for each table (principle of least privilege). 
- Rotate JWT secrets if compromised (invalidate old tokens). 
- Use rate limiting middleware (express-rate-limit or built-in if present). 
- Add dependency audit gating (already have). 

Cost Guardrails Checklist
-------------------------
- [ ] Limit image sizes client-side before upload. 
- [ ] Purge temporary uploads older than X days (cron). 
- [ ] Do not store large binary blobs in Postgres; use object storage. 
- [ ] Avoid unbounded logs—rotate or sample. 
- [ ] Only enable heavy background tasks when feature is live. 

Upgrade Signals (Green → Yellow → Red)
--------------------------------------
| Signal | Green | Yellow | Red |
|--------|-------|--------|-----|
| API p95 latency | < 300ms | 300–800ms | > 800ms |
| DB disk usage | < 60% | 60–85% | > 85% |
| Error rate (%) | < 0.5% | 0.5–2% | > 2% |
| Build minutes left | > 50% | 20–50% | < 20% |
| Dependabot PR backlog | < 5 | 5–10 | > 10 |

Decision Matrix (When Money First Appears)
-----------------------------------------
| Need | First Paid Spend Suggested |
|------|----------------------------|
| Reliability (no sleep) | Paid backend instance (Render / Fly) |
| Performance / global | Add CDN caching; multi-region compute |
| Data growth | Upgrade Supabase or managed Postgres on Render / Neon pro |
| Error insight | Increase Sentry plan for retention |
| Email deliverability | Paid SendGrid/Postmark dedicated IP |
| Logs & metrics | Paid Better Stack / Axiom / Grafana Cloud upgrade |

Minimal Daily / Weekly Ops Routine
----------------------------------
Daily:
- Check PR security scans (Semgrep, CodeQL) → fix or triage.
- Glance at Sentry (after added) / backend logs for spikes.
Weekly:
- Merge Dependabot updates (batch test locally if many).
- Review Supabase DB size & row count.
- Review Netlify & Render usage dashboards.
Monthly:
- Validate backup restore (run a test pg_restore on a scratch DB).
- Rotate any high-sensitivity secrets if policy requires.

Quick Provider Selection Cheat Sheet
------------------------------------
| Category | Start With | Second Option | Avoid Early Because |
|----------|-----------|---------------|---------------------|
| Backend Hosting | Render | Fly.io | Complexity before need |
| DB/Auth/Storage | Supabase | Neon + custom auth | More moving parts |
| Email | Resend | SendGrid | Complexity of deliverability setup |
| SMS | None (defer) | Twilio | Cost; only add w/ real need |
| Analytics | Cloudflare Web Analytics | Umami self-host | Hosting overhead |
| Caching | None until slow | Upstash Redis | Adds state complexity |

Fast Start (Ultra Short)
------------------------
Supabase (DB/Auth) + Render (API) + Netlify (UI) + Cloudflare (DNS/CDN) + GitHub Actions (CI) + Dependabot/Semgrep/CodeQL (security) + UptimeRobot (monitor) + Sentry (errors later). All free to start.

Appendix: Helpful Free Tools (Misc)
-----------------------------------
| Tool | Use |
|------|-----|
| Excalidraw | Architecture diagrams |
| Swagger UI / Redocly (OSS) | API docs |
| EditorConfig | Consistent formatting |
| Husky + lint-staged | Pre-commit quality |
| Prettier | Code style |
| ESLint | Linting |

License & Compliance Note
-------------------------
Always check updated free-tier limits before depending on them in production. Providers may adjust quotas; have a quick readiness plan to pay or switch.

One-Line Summary
----------------
Use a lean set of free providers (Supabase + Render + Netlify + Cloudflare + GitHub security tooling) and only add more services when a measurable bottleneck or reliability gap appears.
