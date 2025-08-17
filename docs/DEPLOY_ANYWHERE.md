# Deploy Anywhere: Render, Railway, Koyeb, Fly, Netlify

This repo is prepared to deploy on multiple platforms with minimal changes. Pick a path and follow the links.

## Shared environment values

Use the same environment across providers:

Required

- `NODE_ENV = production`
- `API_VERSION = v1`
- `DATABASE_URL = postgres://postgres:H6%237LWfQg6w6Sw.@db.advuydpaumugyorissgt.supabase.co:5432/postgres?sslmode=require`
- `JWT_SECRET = KwLEUp13CT5Dxm7+LQZP2Lf6lII+hBMojwd/pAozJmEqWcDK7UnxE9tOE22Rlid8GFTDz7079FBmg+mqePF57w==`
- `JWT_REFRESH_SECRET = LkZ430ZUBjgsbJlVAqEJuJ/MN63WaWXSZ+yLld4/FDvDt6TtfvusBk2neV3MvsxJC3/NMAnPdX9nJqTe6n+vcQ==`
- `SESSION_SECRET = tG+Vsf+RvVxGoC/eZxvMBlScryrAO9st+7d34pG712s=`
- `ENCRYPTION_KEY = 6d787ba21d8c33f445dc96c112e5bec8474804548a17450b144e2d4d2244a34f`

CORS / Socket

- `ALLOWED_ORIGINS = https://*.netlify.app,https://*.vercel.app,https://*.onrender.com,https://*.fly.dev,https://ubasfintrust.netlify.app,https://ubasfintrust.com`
- `SOCKET_IO_CORS_ORIGIN = https://*.netlify.app,https://*.vercel.app,https://*.onrender.com,https://ubasfintrust.netlify.app`

Optional

- `ADMIN_EMAIL = admin@ubasfintrust.com`
- `ADMIN_PASSWORD = AdminPass#123`
- `DIAGNOSTICS_TOKEN = diagtoken`

Frontend

- `VITE_API_URL = https://YOUR-API-URL/api/v1`
- `VITE_SOCKET_URL = https://YOUR-API-URL`

## Render (Blueprint)

- Uses `render.yaml` in the repo.
- Backend web service under `server/`, static frontend under root.
- Health checks: `/health/liveness` and `/health/readiness`.
- Guide: open `render.yaml` and the UI will walk you through. Set your env.

## Railway (CLI)

1. `npm i -g @railway/cli && railway login`
2. `cd server && railway init`
3. `railway variables set ...` (use values from Shared env)
4. `railway up`
5. Run migrations once if needed: `npm run migrate:prod`

## Koyeb (Docker)

- See `docs/KOYEB_DEPLOY.md` for a full, step-by-step guide.
- Build from `server/Dockerfile`, expose port `5000`, health path `/health`.

## Fly.io (Docker)

- Prepped with `server/fly.toml` and `server/Dockerfile`.
- Requires billing to create the app.
- After `flyctl auth login`: create app, set secrets, `flyctl deploy --remote-only`.

## Netlify (Frontend)

- Set `VITE_API_URL` and `VITE_SOCKET_URL` to your chosen backend URL.
- SPA rewrites and security headers are in `netlify.toml`.

## Health & validation

- Backend liveness: `GET /health`
- Backend readiness: `GET /health/readiness`
- Repo smoke tester: `node scripts/system-check.mjs` with `API_BASE` and admin creds.
