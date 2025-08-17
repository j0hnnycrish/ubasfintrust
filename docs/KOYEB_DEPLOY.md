# Deploy to Koyeb (Docker image)

This guide walks you through deploying the UBAS Financial Trust backend API to Koyeb using the existing Dockerfile, plus wiring the frontend to point at the new API.

## Why Koyeb

- Free-tier friendly and simple UI
- Builds from your `Dockerfile`
- Supports Node.js and HTTP health checks

## Prereqs

- Repo pushed to GitHub (public or private)
- Koyeb account: <https://www.koyeb.com/>

## 1) Backend API on Koyeb (from GitHub + Dockerfile)

1. In Koyeb Dashboard → Create Service → From GitHub repository
2. Select this repository
3. Build settings:
   - Build type: Dockerfile
   - Context: `server`
   - Dockerfile: `server/Dockerfile`
4. Runtime / Ports:
   - Expose port: `5000`
   - Protocol: HTTP
   - Route: `/` (root)
5. Health check:
   - Type: HTTP
   - Path: `/health` (fast liveness)
6. Environment variables (add these keys/values):

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

   Optional bootstrap
   - `ADMIN_EMAIL = admin@ubasfintrust.com`
   - `ADMIN_PASSWORD = AdminPass#123`
   - `DIAGNOSTICS_TOKEN = diagtoken`

7. Create the service and wait for it to boot.

## 2) Verify API health

Once deployed, find your Koyeb service URL, e.g. `https://ubasfintrust-api-xxxx.koyeb.app` and run:

```bash
curl -fsSL https://YOUR-KOYEB-URL/health | jq .
curl -fsSL https://YOUR-KOYEB-URL/health/readiness | jq .
```

If you don’t have native jq, install it:

```bash
sudo apt update && sudo apt install -y jq
```

## 3) Point the frontend to your Koyeb API

If using Netlify:

1. Set environment variables (Site settings → Build & deploy → Environment):
   - `VITE_API_URL = https://YOUR-KOYEB-URL/api/v1`
   - `VITE_SOCKET_URL = https://YOUR-KOYEB-URL`
2. Redeploy your site.

If using Render Static (from `render.yaml`), update the static site environment variables similarly and redeploy.

## Notes

- `server/Dockerfile` already exposes port `5000` and defines a HTTP health check on `/health`.
- Migrations: Our Fly flow runs migrations via a release command. On Koyeb, run migrations once from a one-off execution or during startup if needed:
  - Option A: Create a one-off “Run command” execution: `npm run migrate:prod` (working dir: `/app`)
  - Option B: Temporarily set a Deploy Hook/Command to run `npm run migrate:prod && node dist/server.js` and then revert to the normal command (default `node dist/server.js`).
- The API exposes `/health` (liveness) and `/health/readiness` (DB-dependent readiness). Koyeb’s health check should use `/health` to avoid false negatives during cold starts.
