# Where Do My Secrets Go? (Super Simple Guide)

This explains, in plain language, where to put each value so your push-to-main deployments work. Think of it like labeled boxes: put each thing in the box I tell you.
Repository secrets

## TL;DR — Put these in GitHub "Repository secrets"

Add these in GitHub → your repo → Settings → Secrets and variables → Actions → New repository secret.

- `CLOUDFLARE_API_TOKEN`: Your deploy token (lets CI publish Pages + Worker)
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_PAGES_PROJECT`: Your Pages project name (exact)
- `VITE_API_URL`: The URL your frontend uses to call the API (e.g., <https://your-worker.your-account.workers.dev>)
- `JWT_SECRET`: Secret used to sign/verify your JWT tokens
- `DATABASE_URL` (optional): Neon Postgres connection string (only if you use Neon in prod)

Why GitHub repository secrets? Because our GitHub Actions workflow reads them on every push to build the frontend and deploy the Worker automatically. Easy box to put stuff in.

## What about GitHub "Environment" secrets?

Those are for advanced setups with multiple environments like `staging` and `production` that need different values and approval gates. If you’re just starting, use "Repository secrets". Later, if you add staging/prod branches and protections, we can move secrets into per-environment boxes.

## What about Cloudflare Pages "Environment Variables"?

Pages also has its own variables UI (in the dashboard). Use that only if Cloudflare is doing your build in Pages.

- In THIS repo, the build happens inside GitHub Actions, then we upload the built `dist` to Pages. That means `VITE_API_URL` is needed during the GitHub workflow build — so it belongs in GitHub repository secrets (not Pages UI).

If you later switch to a Pages-connected build (build in Cloudflare), then set `VITE_API_URL` in the Pages project settings instead.

## What about Cloudflare Worker secrets?

Workers keep their own secrets too. You can set them two ways:

- From your laptop (local dev):

  ```zsh
cd edge-worker
  wrangler secret put JWT_SECRET
  wrangler secret put DATABASE_URL   # optional
```

- From CI (GitHub Actions): we already wired the workflow to do this automatically using your GitHub repository secrets:

  ```bash
echo $JWT_SECRET | wrangler secret put JWT_SECRET
  echo $DATABASE_URL | wrangler secret put DATABASE_URL
```

So: put the values in GitHub repository secrets, and the workflow will copy them into the Worker at deploy time.

## Things that are NOT secrets (keep in wrangler.toml)

Put these in `edge-worker/wrangler.toml`. They are IDs/names, not secrets:

- D1 `database_id`
- KV `id`
- R2 bucket `bucket_name`

Example in `wrangler.toml`:

```toml
[[d1_databases]]
# ...
database_id = "YOUR_D1_ID"

[[kv_namespaces]]
# ...
id = "YOUR_KV_ID"

[[r2_buckets]]
# ...
bucket_name = "app-uploads"
```

## Step-by-step (like I’m sitting next to you)

1. Make the Cloudflare token and find your account ID

 - Go to <https://dash.cloudflare.com/>
 - Right top: your profile → "My Profile" → API Tokens → Create Token (use the Pages+Workers template or permissions suggested in the checklist)
 - Copy the token (this goes into `CLOUDFLARE_API_TOKEN`)
 - Your Account ID: left sidebar → Workers or Overview; it’s shown there (goes into `CLOUDFLARE_ACCOUNT_ID`)

1. Find your Pages project name

 - Go to Pages in Cloudflare → open your project → copy the name (goes into `CLOUDFLARE_PAGES_PROJECT`)

1. Pick your API URL for the frontend

 - If you’re using the default Worker URL, it looks like: `https://<worker-name>.<your-account>.workers.dev`
 - Put that into `VITE_API_URL`
 - If you map a custom domain later (like `https://api.example.com`), update `VITE_API_URL` accordingly

1. Choose a strong JWT secret

 - Make a random string (at least 32 characters); this is `JWT_SECRET`
 - Your tokens must be signed with this same secret or they won’t verify

1. (Optional) Use Neon for the database

 - Create a free Neon project at <https://neon.tech>, get the connection string
 - That full URL goes into `DATABASE_URL`

1. Put them in GitHub

 - GitHub → repo → Settings → Secrets and variables → Actions → New repository secret
 - Add each item above exactly as named

1. Push to main

 - Our workflow builds the frontend with `VITE_API_URL`, deploys Pages, and deploys the Worker after setting its secrets

1. Check it’s alive

  ```zsh
curl -s https://<your-worker>/health
  curl -s https://<your-worker>/health/readiness
```

  Optional (with a valid token):

  ```zsh
curl -s -H "Authorization: Bearer TOKEN" https://<your-worker>/api/v1/auth/whoami
```

## FAQ (short answers)

- Do I use GitHub repository secrets or environment secrets? → Repository secrets (simple). Use environment secrets later if you add staging/prod.
- Do I put `VITE_API_URL` in Pages variables? → Not for this setup — build happens in GitHub, so put it in GitHub repository secrets.
- Do I need to set Worker secrets in the Cloudflare dashboard? → Optional. CI already sets them before deploy using your GitHub secrets.
- Are D1/KV/R2 values secrets? → No. They’re resource IDs/names and belong in `wrangler.toml`.
- I changed a secret — do I redeploy? → Push to `main` again to let CI run, or manually redeploy the Worker with Wrangler so the new secret is in effect.
# Where Do My Secrets Go? (Super Simple Guide)

This explains, in plain language, where to put each value so your push-to-main deployments work. Think of it like labeled boxes: put each thing in the box I tell you.
Repository secrets

## TL;DR — Put these in GitHub "Repository secrets"

Add these in GitHub → your repo → Settings → Secrets and variables → Actions → New repository secret.

- `CLOUDFLARE_API_TOKEN`: Your deploy token (lets CI publish Pages + Worker)
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_PAGES_PROJECT`: Your Pages project name (exact)
- `VITE_API_URL`: The URL your frontend uses to call the API (e.g., <https://your-worker.your-account.workers.dev>)
- `JWT_SECRET`: Secret used to sign/verify your JWT tokens
- `DATABASE_URL` (optional): Neon Postgres connection string (only if you use Neon in prod)

Why GitHub repository secrets? Because our GitHub Actions workflow reads them on every push to build the frontend and deploy the Worker automatically. Easy box to put stuff in.

## What about GitHub "Environment" secrets?

Those are for advanced setups with multiple environments like `staging` and `production` that need different values and approval gates. If you’re just starting, use "Repository secrets". Later, if you add staging/prod branches and protections, we can move secrets into per-environment boxes.

## What about Cloudflare Pages "Environment Variables"?

Pages also has its own variables UI (in the dashboard). Use that only if Cloudflare is doing your build in Pages.

- In THIS repo, the build happens inside GitHub Actions, then we upload the built `dist` to Pages. That means `VITE_API_URL` is needed during the GitHub workflow build — so it belongs in GitHub repository secrets (not Pages UI).

If you later switch to a Pages-connected build (build in Cloudflare), then set `VITE_API_URL` in the Pages project settings instead.

## What about Cloudflare Worker secrets?

Workers keep their own secrets too. You can set them two ways:

- From your laptop (local dev):

  ```zsh
  cd edge-worker
  wrangler secret put JWT_SECRET
  wrangler secret put DATABASE_URL   # optional
  ```

- From CI (GitHub Actions): we already wired the workflow to do this automatically using your GitHub repository secrets:

  ```bash
  echo $JWT_SECRET | wrangler secret put JWT_SECRET
  echo $DATABASE_URL | wrangler secret put DATABASE_URL
  ```

So: put the values in GitHub repository secrets, and the workflow will copy them into the Worker at deploy time.

## Things that are NOT secrets (keep in wrangler.toml)

Put these in `edge-worker/wrangler.toml`. They are IDs/names, not secrets:

- D1 `database_id`
- KV `id`
- R2 bucket `bucket_name`

Example in `wrangler.toml`:

```toml
[[d1_databases]]
# ...
database_id = "YOUR_D1_ID"

[[kv_namespaces]]
# ...
id = "YOUR_KV_ID"

[[r2_buckets]]
# ...
bucket_name = "app-uploads"
```

## Step-by-step (like I’m sitting next to you)

1. Make the Cloudflare token and find your account ID

 - Go to <https://dash.cloudflare.com/>
 - Right top: your profile → "My Profile" → API Tokens → Create Token (use the Pages+Workers template or permissions suggested in the checklist)
 - Copy the token (this goes into `CLOUDFLARE_API_TOKEN`)
 - Your Account ID: left sidebar → Workers or Overview; it’s shown there (goes into `CLOUDFLARE_ACCOUNT_ID`)

1. Find your Pages project name

 - Go to Pages in Cloudflare → open your project → copy the name (goes into `CLOUDFLARE_PAGES_PROJECT`)

1. Pick your API URL for the frontend

 - If you’re using the default Worker URL, it looks like: `https://<worker-name>.<your-account>.workers.dev`
 - Put that into `VITE_API_URL`
 - If you map a custom domain later (like `https://api.example.com`), update `VITE_API_URL` accordingly

1. Choose a strong JWT secret

 - Make a random string (at least 32 characters); this is `JWT_SECRET`
 - Your tokens must be signed with this same secret or they won’t verify

1. (Optional) Use Neon for the database

 - Create a free Neon project at <https://neon.tech>, get the connection string
 - That full URL goes into `DATABASE_URL`

1. Put them in GitHub

 - GitHub → repo → Settings → Secrets and variables → Actions → New repository secret
 - Add each item above exactly as named

1. Push to main

 - Our workflow builds the frontend with `VITE_API_URL`, deploys Pages, and deploys the Worker after setting its secrets

1. Check it’s alive

  ```zsh
  curl -s https://<your-worker>/health
  curl -s https://<your-worker>/health/readiness
  ```

  Optional (with a valid token):

  ```zsh
  curl -s -H "Authorization: Bearer TOKEN" https://<your-worker>/api/v1/auth/whoami
  ```

## FAQ (short answers)

- Do I use GitHub repository secrets or environment secrets? → Repository secrets (simple). Use environment secrets later if you add staging/prod.
- Do I put `VITE_API_URL` in Pages variables? → Not for this setup — build happens in GitHub, so put it in GitHub repository secrets.
- Do I need to set Worker secrets in the Cloudflare dashboard? → Optional. CI already sets them before deploy using your GitHub secrets.
- Are D1/KV/R2 values secrets? → No. They’re resource IDs/names and belong in `wrangler.toml`.
- I changed a secret — do I redeploy? → Push to `main` again to let CI run, or manually redeploy the Worker with Wrangler so the new secret is in effect.
