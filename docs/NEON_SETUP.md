# Neon Database Setup (Edge Worker)

This guide helps you create a free Neon Postgres database, seed it with demo data, and connect it to the Cloudflare Worker.

## 1) Create a Neon project and database

1. Go to <https://neon.tech> and sign up (free tier is enough).
2. Click "New Project" → choose a region close to most users.
3. Create a database (the default `neondb` is fine) and a role/password.
4. Copy the Postgres connection string (it looks like `postgresql://USER:PASSWORD@HOST/db?sslmode=require`).

Notes:

- The Worker uses `@neondatabase/serverless` which works over HTTP and is edge-safe.
- No extra pooler is needed for this client, but Neon already provides a proxy/pooler under the hood.

## 2) Provide the connection string to the Worker

From the `edge-worker/` directory:

```zsh
wrangler secret put DATABASE_URL
# Paste the Neon connection string when prompted
wrangler secret put JWT_SECRET
# (Use a strong random secret; must match what your tokens are signed with)
```

Make sure `wrangler.toml` has:

```toml
[vars]
JWT_AUD = "ubas"  # must match your JWT audience
```

## 3) Seed the Neon database with demo tables and data

Run the included script:

```zsh
cd edge-worker
DATABASE_URL='postgresql://USER:PASSWORD@HOST/db?sslmode=require' npm run neon:setup
```

This creates tables `users`, `accounts`, and `transactions`, and inserts a demo user:

- user id: `demo-user-0001` (if you mint a token with this `id`, endpoints work immediately)

## 4) Local test

Start the Worker locally:

```zsh
cd edge-worker
npm run dev
```

Optional: mint a JWT via dev endpoint (only if you set `DEV_MINT=true` as a secret):

```zsh
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","id":"demo-user-0001","expiresIn":"7d"}' \
  http://127.0.0.1:8787/dev/mint-token
```

Use the token with the user endpoints:

```zsh
# Replace TOKEN with the value from the mint response
curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/users/profile
curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/users/accounts
curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/users/transactions
```

## 5) Deploy

```zsh
cd edge-worker
npm run deploy
```

Set the same secrets in production with `wrangler secret put` (run once in the project):

```zsh
wrangler secret put DATABASE_URL
wrangler secret put JWT_SECRET
```

If you’re using the included GitHub Actions workflow to deploy, add the same values to your repository secrets, e.g. `DATABASE_URL` and `JWT_SECRET`.

## Troubleshooting

- Missing types in the editor for Workers or Hono: run `npm ci` in `edge-worker/`.
- 401 Unauthorized: ensure your token is signed with the same `JWT_SECRET` and has audience `ubas` (or change `JWT_AUD`).
- Empty results: confirm the `neon:setup` script ran successfully and `DATABASE_URL` is correct.
- Rate limiting: default is 60 req / 60s per IP per path. Adjust `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_SEC` in `wrangler.toml`.
