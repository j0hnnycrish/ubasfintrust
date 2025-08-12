# UBAS Financial Trust – Complete Operations & Deployment Manual

Version: 1.0  
Last Updated: 2025-08-11

---
## 1. Executive Overview
UBAS Financial Trust is a full‑stack digital banking simulation platform featuring:
- Secure user authentication (JWT + refresh, optional 2FA)
- Admin (corporate) control panel for customer/accounts/notifications
- Dynamic onboarding (template + locale driven)
- Multi‑channel notification system (Email + SMS + In‑App) with provider fallback
- Message template CRUD with variable substitution
- Accounts, transactions, transfers, loans, grants (simulated funding), and seeding utilities
- Modular architecture (React + Vite frontend, Express + Knex backend, PostgreSQL, Redis)

Use this manual to: develop locally, operate in production, deploy across providers, configure DNS & email, manage data, and perform routine ops.

---
## 2. High-Level Architecture
Component | Tech | Notes
----------|------|------
Frontend | React (Vite, TS, Tailwind) | Static deployed to Vercel/Netlify or served via Nginx
Backend API | Express (TypeScript) | REST under /api/v1
Database | PostgreSQL | Knex migrations; can use Neon, Supabase, RDS, Render, Railway
Cache / Queues | Redis | Rate limiting, future caching, ephemeral session tasks
Notifications | Pluggable services | Resend primary (email), Twilio primary (SMS) + fallbacks
Templates | DB table message_templates | Locale + type + version + variable substitution
Realtime | Socket.IO | User rooms (notifications/security events)
Static Edge | CDN of hosting provider | Optimized Vite build

---
## 3. Prerequisites
- Node.js 20+
- pnpm or npm (project uses bun/ npm lock—choose npm for consistency)
- PostgreSQL 14+ (or hosted)
- Redis (local or hosted Upstash/Redis Cloud)
- Git, OpenSSL (for manual TLS if self‑hosting)
- Domain registrar (Cloudflare, Namecheap, Porkbun, etc.)

---
## 4. Repository Structure (Key)
```
server/           Backend API
src/              Frontend application
server/migrations Knex migrations (schema evolution)
server/seeds      Seed scripts (incl. admin user)
scripts/          Deployment helper scripts
```

---
## 5. Environment Configuration
### 5.1 Backend .env (Core Variables)
Category | Variable | Purpose
---------|----------|--------
Core | PORT | API port (default 5000)
Core | API_VERSION | Path versioning (v1)
Database | DATABASE_URL OR (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD) | Postgres connection
Redis | REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_DB | Caching / rate limit
Auth | JWT_SECRET, JWT_REFRESH_SECRET | Token signing
Auth | JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN | Token lifetimes
Security | BCRYPT_ROUNDS | Password hashing cost
Admin Seed | ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_PHONE | Default corporate admin
Email | FROM_EMAIL, FROM_NAME | Outbound branding
Resend | RESEND_API_KEY | Primary email provider
Fallback Email | SENDGRID_API_KEY / MAILGUN_API_KEY / etc. | Fallback chain
SES (opt) | AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION | SES fallback
SMS | TWILIO_* (primary) | SMS sending
Optional SMS | VONAGE_*, TERMII_*, AFRICASTALKING_* | Fallback/expansion
Websocket | SOCKET_IO_CORS_ORIGIN | Allowed origin
Flags | ENABLE_* toggles | Feature gating

### 5.2 Frontend Env (.env.local)
```
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_WS_URL=wss://api.yourdomain.com
```

### 5.3 Secrets Management
- Local dev: plain .env (DO NOT COMMIT)
- Production: platform secret manager (Render / Railway / Vercel / Fly)
- Rotate: quarterly or on exposure

---
## 6. Local Development Setup
1. Clone repo: `git clone <repo>`
2. Install deps (root & server)
3. Copy `server/.env.example` → `server/.env` and fill DB + JWT + ADMIN_* + provider keys
4. Start Postgres & Redis: `docker compose up -d db redis`
5. Run migrations: `npm run knex -- migrate:latest` (in server dir)
6. Run seeds: `npm run knex -- seed:run`
7. Start backend: `npm run dev`
8. Start frontend: root `npm run dev`
9. Open http://localhost:5173

Admin login with ADMIN_EMAIL / ADMIN_PASSWORD.

---
## 7. Database Management
- Migrate: `npm run knex -- migrate:latest`
- Rollback: `npm run knex -- migrate:rollback`
- Seed: `npm run knex -- seed:run`
- Backup: `pg_dump -Fc $DB_NAME > backup.dump`
- Restore: `pg_restore --clean --create -d postgres backup.dump`

---
## 8. Redis Usage
Rate limiting, future caching (templates, provider health). Dev flush: `redis-cli FLUSHALL`.

---
## 9. Authentication & Security
Password complexity enforced, lockout after repeated failures, refresh tokens, optional TOTP 2FA. Admin == corporate account_type. Change password via /users/password.

---
## 10. Admin Portal Usage
Feature | Endpoint(s) | Notes
--------|-------------|------
Create Customer | POST /admin/users | Optional welcome notifications
Extra Account | POST /admin/users/:id/accounts | Account provisioning
Seed Transactions | POST /admin/accounts/:accountId/transactions/seed | Demo history
List Users | GET /admin/users | Pagination & search
KYC Review | PATCH /admin/users/:id/kyc | Status change
Loans Moderation | /admin/loans endpoints | Approve / reject
Templates | /templates CRUD | Locale aware
Provider Health | /templates/_health/providers | JSON status

---
## 11. Customer Features
Onboarding modal (template-driven), additional accounts (POST /accounts), transfers, apply for loans, grants (apply credit), change password, notifications.

---
## 12. Notifications & Templates
Variable substitution: {{firstName}}, {{lastName}}, {{email}} (extendable). Fallback chain for providers. Health endpoint available.

---
## 13. Transaction Seeding
Synthetic generation via admin endpoint; adjusts balances.

---
## 14. Grants Feature
Simple grant credit to account; stored under grants table.

---
## 15. Loans Feature
User applies; pending; admin decision; repayments via payment endpoint reduce outstanding.

---
## 16. Deployment Scenarios
### Split (Recommended)
Frontend (Vercel), Backend (Render/Railway/Fly), Postgres (Neon/Railway), Redis (Upstash). DNS points api.yourdomain.com & app.yourdomain.com.

### Single VPS (Docker Compose)
Use docker-compose.production.yml; reverse proxy with Nginx + certbot.

### Email DNS
SPF include providers, DKIM CNAMEs from providers, DMARC policy record.

### SSL
Managed by provider or certbot for self-host.

### Scaling
Stateless backend replication, managed DB with pooling, Redis for caching, queue for heavy notifications (future).

---
## 17. DNS Example (Cloudflare)
A @ → backend IP or CNAME provider  
CNAME api → backend host  
CNAME app (or www) → Vercel  
TXT SPF, DKIM, DMARC  
Proxy on for caching (except if websockets issues – then disable for api if needed).

---
## 18. Operations Runbook
Task | Command / Action
-----|-----------------
Migrate | migrate:latest
Rollback | migrate:rollback
Seed | seed:run
Rotate admin password | Login → change /users/password
Check health | /health & /templates/_health/providers
Clear rate limits | Redis FLUSHALL (dev only)
Update | Pull → backup → migrate → redeploy

---
## 19. Updating & Rollback
Upgrade: backup DB → migrate → deploy. Rollback: restore dump + redeploy previous image.

---
## 20. Backups & DR
DB nightly + retention. Secrets exported. Redis ephemeral. Frontend build artifacts versioned.

---
## 21. Security Hardening
HSTS, strict CORS, rotate keys, enforce 2FA for corporate, principle of least privilege for DB user, monitor audit logs.

---
## 22. Future Enhancements
Provider badges UI, template preview sandbox, redis caching layer, job queue, audit viewer, richer variable set.

---
## 23. Troubleshooting
Issue | Fix
------|----
401 responses | Re-auth; validate JWT secrets
Cannot seed admin | Change ADMIN_EMAIL or delete existing row
Emails fail | Set RESEND_API_KEY + domain verify
SMS fail | Validate Twilio credentials
Migrations error uuid | CREATE EXTENSION IF NOT EXISTS pgcrypto;
WebSocket blocked | Adjust SOCKET_IO_CORS_ORIGIN

---
## 24. Glossary
Corporate Account: Admin privileges.  
Grant: Simulated credited funds.  
Seed Transactions: Synthetic data generator.  
Template: DB-driven message content.  

---
## 25. Quick Start TL;DR
```
cp server/.env.example server/.env
# Fill DB + JWT + ADMIN_* + provider keys
docker compose up -d db redis
cd server && npm install && npm run knex -- migrate:latest && npm run knex -- seed:run && npm run dev
npm install && npm run dev  # frontend
```

---
End of Manual.
