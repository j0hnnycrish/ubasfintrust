Kid Friendly Project Guide (Localized Style)
===========================================

(Adjust wording or translate lines below as needed.)

Project As A Town:
- Web Frontend = Market Square (people visit here)  
- Backend API = Town Hall (handles rules & paperwork)  
- Database = Archive Room (stores records safely)  
- CI/CD Robots = Delivery Vans (move safe new versions)  
- Netlify = Display Board (public site hosting)  
- Render = Power Station (runs server brains)  

Core Powers Ready:
- Automatic code checks & tests on push.
- Staging preview site per pull request.
- Production deploy pipeline for main branch.
- Security scans (CodeQL, Semgrep).
- Performance audit schedule (Lighthouse).
- Dependency update bot (Dependabot).
- Health snapshot in PR comment.

Still Needs Your Input Before “Full Live”:
- Real deploy hook for backend.
- Real DATABASE_URL.
- Real JWT secrets.
- Domain + allowed origins.
- Any email/SMS/storage provider keys you plan to use.

Quick Launch Recipe:
1. Create database & set DATABASE_URL.
2. Add secrets (JWTs, origins, Netlify, deploy hook).
3. Create backend service (Render) and copy deploy hook.
4. Create Netlify site and connect repo.
5. Push to main; wait for green pipeline.
6. Open site URL + test API health.

Typical Problems & Fixes:
- CORS error → Add site URL to ALLOWED_ORIGINS.
- 502 backend → Check logs; missing env var or DB blocked.
- Auth broken → Verify JWT secrets and token issuance path.
- Build failed → Ensure correct working directory & dependencies installed.
- Security alert → Patch code; avoid ignoring unless documented justification.

Safety Reminders:
- Never commit real secrets.
- Rotate leaked keys fast.
- Merge dependency updates regularly.
- Consider production environment approval.

Growing Later:
- Add performance thresholds.
- Add uptime checks.
- Add error tracking (Sentry, etc.).
- Add analytics & feature flags.

One-Line Summary:
Provide secrets + DB + backend service + Netlify site, then your automated robots handle building, testing, & deploying.
