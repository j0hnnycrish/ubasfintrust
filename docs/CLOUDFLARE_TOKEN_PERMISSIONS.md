# Cloudflare API Token Permissions (What You Actually Need)

This explains the minimal and optional permissions for the GitHub Actions token used to deploy Pages and the Worker.

## TL;DR

- For this repo’s CI (build in GitHub, publish to Pages, deploy Worker) you only need:
  - Account: Workers Scripts — Edit
  - Account: Pages — Edit
  - Account: Account Settings — Read (often required by the API)

That’s it for the default flow we set up. Everything else is optional.

## Why not more?

- We already created KV, D1, and R2 resources locally with `wrangler`. CI does not create or mutate them.
- The Worker bindings (KV/D1/R2) are just IDs in `wrangler.toml`. Deploying the Worker does not need KV/R2/D1 "Edit" privileges.
- Routes (custom domains) are configured outside the workflow. If you do not programmatically change routes in CI, you don’t need Routes:Edit.

## Recommended minimal token (current workflow)

Grant these on your Cloudflare account:

- Account → Workers Scripts: Edit
- Account → Pages: Edit
- Account → Account Settings: Read

This is sufficient to:

- Upload and publish your Worker (`wrangler deploy`)
- Publish the built frontend to Cloudflare Pages (via `cloudflare/pages-action`)

## When to add more permissions

Add the following only if you will automate these actions in CI:

- Manage Worker routes (custom domain routing in CI)
  - Zone → Workers Routes: Edit

- Create or update KV namespaces/bindings in CI (not typical here)
  - Account → Workers KV Storage: Edit

- Create or manage R2 buckets in CI (not typical here)
  - Account → Workers R2 Storage: Edit

- Run D1 migrations in CI (we currently run locally; add only if you wire CI to do migrations)
  - Account → D1: Edit (Cloudflare may list this as a Workers/D1 or Database permission depending on UI)

- View logs/live tail in CI or automation
  - Account → Workers Tail: Read
  - Account → Workers Observability: Edit/Read (only if you need to configure/change observability)

- Advanced Workers features
  - Workers Builds Configuration: Edit, Workers Agents Configuration: Edit (only if you know you need them)

## About super-broad tokens

Statements like “All zones — Workers Routes:Edit” and many "Edit" capabilities across KV/R2/Observability are broadly permissive and not required for this workflow. Prefer least privilege:

- Start with the minimal three (Workers Scripts: Edit, Pages: Edit, Account Settings: Read)
- Add specific scopes only when you introduce CI steps that require them

## Where to put the token

- Put the token value in GitHub → Settings → Secrets and variables → Actions as `CLOUDFLARE_API_TOKEN`.
- The workflow already uses this token to deploy both Pages and the Worker.

## Quick checklist

- [ ] Create a token with: Workers Scripts: Edit, Pages: Edit, Account Settings: Read
- [ ] Save as GitHub secret: `CLOUDFLARE_API_TOKEN`
- [ ] Push to `main` and watch the CI deploy frontend + Worker

For the big picture on all secrets and where they go, see `docs/SECRETS_AND_ENV_VARS_SIMPLIFIED.md`. For end-to-end deployment steps, see `docs/CLOUDFLARE_CI_QUICK_START.md`.
