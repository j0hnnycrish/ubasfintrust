# Frontend Deploy — Quick Start

This is a lightweight, step-by-step for shipping the SPA (Vite/React) to production.

## Prereqs
- API is reachable over HTTPS and exposes /api/v1
- CORS on API includes your SPA origin in ALLOWED_ORIGINS

## Environment (required)
Set these in your hosting provider (Vercel/Netlify):

- VITE_API_URL=https://api.example.com/api/v1
- VITE_SOCKET_URL=https://api.example.com
- VITE_APP_NAME=UBAS Financial Trust
- VITE_NODE_ENV=production
- (optional) limits, analytics, feature flags

## Build
- Vercel: this repo already has vercel.json. Connect the repo → set env → Deploy
- Netlify: this repo already has netlify.toml. Connect the repo → set env → Deploy

## Smoke test
- Load the SPA
- Login/register → confirm API calls succeed (no CORS errors)
- Confirm token refresh works (no infinite 401s)

If you share your exact domains, I can fill the env blocks precisely.
