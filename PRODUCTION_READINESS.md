# Production Readiness – UBAS

Use this checklist before flipping real traffic.

## Configuration

- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (internal/private connection string)
- [ ] `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SESSION_SECRET` are long random strings
- [ ] `ALLOWED_ORIGINS` includes all frontend domains
- [ ] Optional: `REDIS_URL` (or host/port) if using Redis

## Build & Deploy

- [ ] Backend compiles: `cd server && npm ci && npm run build`
- [ ] Migrations up: `npm run migrate:prod`
- [ ] Start: `npm start` binds to `PORT`
- [ ] Health check: `/health` returns 200

## Security

- [ ] HTTPS enforced at the edge (Render/Domain)
- [ ] Admin seed credentials rotated and stored in secret manager only
- [ ] Rate limits enabled (configured in `middleware/security.ts`)
- [ ] CORS origins limited to required domains only

## Observability

- [ ] Logs accessible in Render (error and combined)
- [ ] `/_diagnostics` reachable (optionally with token)
- [ ] Alerting configured (Render notifications or external)

## Post-Deploy Verification

- [ ] Run `node scripts/system-check.mjs` against the live API
- [ ] Create a user, create accounts, seed transactions, apply/approve loan
- [ ] KYC flow submit and approve
- [ ] Email test via admin route

If any item fails, consult GO_LIVE_ubasfintrust.md for troubleshooting.
