# Cloudflare CI Quick Start (Pages + Worker)

Use this 1-page guide to deploy the frontend (Pages) and the API (Worker) on every push to `main` using GitHub Actions.

## 1) One-time local setup

- Install tools (on your dev machine):

  ```zsh
npm i -g wrangler
```
- Log in and create/bind resources (IDs will be printed):

  ```zsh
cd edge-worker
  wrangler login
  wrangler r2 bucket create app-uploads
  wrangler d1 create app-db
  wrangler kv namespace create APP_KV
```
- Update `edge-worker/wrangler.toml` with the printed IDs for D1 and KV.
- Set Worker secrets locally (so you can test dev and also document values for CI):

  ```zsh
wrangler secret put JWT_SECRET
  # Optional if using Neon (preferred DB)
  wrangler secret put DATABASE_URL
```
- (Optional) Seed Neon once:

  ```zsh
DATABASE_URL='postgresql://USER:PASSWORD@HOST/db?sslmode=require' npm run neon:setup
```
- (Optional) Apply D1 migrations once (for demo fallback and /api/items):

  ```zsh
npm run deploy:d1:migrate
```

## 2) Add GitHub repository secrets

GitHub → repo → Settings → Secrets and variables → Actions → "New repository secret":

- `CLOUDFLARE_API_TOKEN` (deploy token for Pages + Workers)
- `CLOUDFLARE_ACCOUNT_ID` (your CF account ID)
- `CLOUDFLARE_PAGES_PROJECT` (exact Pages project name)
- `VITE_API_URL` (your Worker API base, e.g., <https://your-worker.your-account.workers.dev>)
- `JWT_SECRET` (same value used to sign your JWTs)
- `DATABASE_URL` (optional, Neon connection string)

Notes:

- The CI workflow will push `JWT_SECRET` and `DATABASE_URL` into the Worker using `wrangler secret put` before deploying.

## 3) Push to main

- Ensure the workflow file exists: `.github/workflows/cloudflare-deploy.yml`
- Commit and push to `main`:

  ```zsh
git add -A
  git commit -m "ci: deploy to Cloudflare via GitHub Actions"
  git push origin main
```

The workflow will:

- Build the frontend and publish to Pages (using `VITE_API_URL`).
- Install `edge-worker` deps, set Worker secrets, and deploy the Worker.

## 4) Quick verification

- Frontend: Open your Pages URL from the dashboard.
- API health:

  ```zsh
curl -s https://<your-worker>/health
  curl -s https://<your-worker>/health/readiness
```
- (Optional) WhoAmI: with a valid token

  ```zsh
curl -s -H "Authorization: Bearer TOKEN" https://<your-worker>/api/v1/auth/whoami
```

You’re done. Future pushes to `main` will auto-deploy both the Pages site and the Worker.

# Cloudflare Free Deployment Checklist (Frontend + Edge API)

This checklist gets your entire app live on Cloudflare’s free tiers: Pages for the frontend, Workers for the API, and KV/D1/R2 for data and storage. Follow top-to-bottom.

Status legend: [ ] todo, [x] done

## 0) Prereqs
- [ ] Cloudflare account (free)
- [ ] GitHub repo connected (optional but recommended)
- [ ] Node 18+ installed locally
- [ ] Installed globally: `wrangler` (`npm i -g wrangler`)

## 1) Frontend (Cloudflare Pages)
- [ ] Build locally once to verify
  ```zsh
npm ci
  npm run build
```
- [ ] Decide your API base URL
  - If using your Worker subdomain, example: `https://<worker-name>.<account>.workers.dev`
  - If using a custom domain/subdomain, example: `https://api.example.com`
- [ ] Configure frontend to call your API
  - Set `VITE_API_URL` to the Worker base URL (no trailing slash)
  - In Cloudflare Pages dashboard → Project → Settings → Environment Variables: add `VITE_API_URL`
- [ ] Create a Pages project (dashboard)
  - Connect GitHub repository and select this repo
  - Build command: `npm ci && npm run build`
  - Output directory: `dist`
  - Add environment variable `VITE_API_URL` (same as above)
- [ ] Trigger a deployment (push to main or click Deploy)
- [ ] Verify: Your Pages site loads and network calls target your Worker `VITE_API_URL`

## 2) API (Cloudflare Worker)
Project path: `edge-worker/`

- [ ] Install deps and login
  ```zsh
cd edge-worker
  npm ci
  wrangler login
```
- [ ] Create/bind resources (IDs will be output)
  ```zsh
wrangler r2 bucket create app-uploads
  wrangler d1 create app-db
  wrangler kv namespace create APP_KV
```
- [ ] Update `edge-worker/wrangler.toml`
  - [ ] Set D1 `database_id`
  - [ ] Set KV `id`
  - [ ] Confirm these vars (adjust if needed):
    ```toml
[vars]
    NODE_ENV = "production"
    JWT_AUD = "ubas"
    RATE_LIMIT_WINDOW_SEC = "60"
    RATE_LIMIT_MAX = "60"
```
- [ ] Set secrets
  ```zsh
wrangler secret put JWT_SECRET      # choose a strong secret
  # Optional for Neon (preferred DB):
  wrangler secret put DATABASE_URL    # paste your Neon connection string
  # Optional: enable dev token mint endpoint
  wrangler secret put DEV_MINT        # set to: true
```
- [ ] Apply D1 migrations (for demo fallback and /api/items)
  ```zsh
npm run deploy:d1:migrate
```
- [ ] (Optional) Seed Neon with demo tables/data (recommended)
  ```zsh
DATABASE_URL='postgresql://USER:PASSWORD@HOST/db?sslmode=require' npm run neon:setup
```
- [ ] Local smoke test
  ```zsh
npm run dev
  # Optional (if DEV_MINT=true): mint a token for demo-user-0001
  curl -s -X POST -H "Content-Type: application/json" \
    -d '{"email":"demo@example.com","id":"demo-user-0001","expiresIn":"7d"}' \
    http://127.0.0.1:8787/dev/mint-token
```
- [ ] Verify key endpoints
  ```zsh
# Replace TOKEN if you minted one
  curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/auth/whoami
  curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/users/profile
  curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8787/api/v1/users/accounts
  curl -H "Authorization: Bearer TOKEN" 'http://127.0.0.1:8787/api/v1/users/transactions?page=1&limit=10'
```
- [ ] Transfer endpoint idempotency check
  ```zsh
API_BASE=http://127.0.0.1:8787 \
  TOKEN="YOUR_JWT" \
  FROM=demo-acct-0001 \
  TO=demo-acct-0001 \
  AMOUNT=5 \
  npm run smoke:transfer
```
- [ ] Deploy Worker
  ```zsh
npm run deploy
```

## 3) Optional DNS and custom domains
- [ ] Add your domain to Cloudflare (free)
- [ ] Set DNS records (A/AAAA/CNAME) to Cloudflare’s provided values
- [ ] Map custom domain to Pages site (Pages → Custom domains)
- [ ] Map custom domain/subdomain to Worker (Workers → Triggers → Routes)
  - Example for API: `api.example.com/*` routed to your Worker

## 4) CI/CD (optional but recommended)
- [ ] Add Cloudflare API token, account id, and project info to GitHub secrets if using the included CI workflow
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_PAGES_PROJECT`
  - `VITE_API_URL` (Pages build time var)
  - (and your Worker secrets if deploying via CI): `JWT_SECRET`, `DATABASE_URL`
- [ ] Verify the workflow runs on push to `main`

Secrets reference (GitHub → Settings → Secrets and variables → Actions → New repository secret):

- `CLOUDFLARE_API_TOKEN`: API token with permissions for Pages and Workers deploys
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
- `CLOUDFLARE_PAGES_PROJECT`: The Pages project name (exact)
- `VITE_API_URL`: The base URL of your Worker API (e.g., <https://your-worker.your-account.workers.dev>)
- `JWT_SECRET`: The exact JWT signing secret your tokens use
- `DATABASE_URL` (optional): Neon Postgres connection string for production

 
## 5) Security and limits
 
- [ ] JWT audience aligned: `JWT_AUD` in `wrangler.toml` matches your tokens
- [ ] Strong `JWT_SECRET` set in Worker secrets
- [ ] Rate limits tuned for your case (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_SEC`)
- [ ] Idempotency enabled (already in `/api/v1/transfers` via KV)
- [ ] CORS: included via Hono; restrict origins if needed

 
## 6) Observability and readiness
 
- [ ] Health: `GET /health`
- [ ] Readiness: `GET /health/readiness` (KV ping)
- [ ] Consider adding basic logs or analytics (Cloudflare includes request logs)

 
## 7) Troubleshooting
 
- Missing types in editor → run `npm ci` in `edge-worker/` and at repo root
- 401 Unauthorized → token’s audience must match `JWT_AUD`; token must be signed with the same `JWT_SECRET`
- Neon not used → ensure `DATABASE_URL` secret is set; Worker will fallback to D1 if absent
- D1 errors on initial queries → run `npm run deploy:d1:migrate`
- Rate limit hits during tests → increase `RATE_LIMIT_MAX` temporarily in `wrangler.toml`

---

References
 
- Worker: `edge-worker/src/worker.ts`
- Neon setup: `docs/NEON_SETUP.md`
- Pages wiring: `FRONTEND_DEPLOY.md`
- Always-on free guide: `docs/ALWAYS_ON_FULLY_FREE_DEPLOYMENTS_2025.md`
    `).bind(amount, amount, accountId).run()
    
    // Record transaction
  await env.DB.prepare(`
      INSERT INTO transactions (id, to_account_id, amount, currency, type, status, created_at)
      VALUES (?, ?, ?, ?, 'deposit', 'completed', datetime('now'))
    `).bind(txId, accountId, amount, (account as any).currency).run()
    
    return c.json({ 
      success: true, 
      transaction_id: txId,
      new_balance: Number((account as any).balance) + Number(amount)
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to deposit', error }, 500)
  }
});

// Withdraw money (simulated)
app.post('/api/v1/accounts/:id/withdraw', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
  const env = c.env as Env;
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    const accountId = c.req.param('id')

    const { amount, description = 'Withdrawal' } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount <= 0) {
      return c.json({ success: false, message: 'Valid amount required' }, 400)
    }

    // Verify user owns the account and has sufficient balance
  const account = await env.DB.prepare(`
      SELECT * FROM accounts WHERE id = ? AND user_id = ?
    `).bind(accountId, userId).first()
    
    if (!account) {
      return c.json({ success: false, message: 'Account not found' }, 404)
    }

    if (Number((account as any).available_balance) < amount) {
      return c.json({ success: false, message: 'Insufficient funds' }, 400)
    }

    const txId = crypto.randomUUID()
    
    // Update account balance
  await env.DB.prepare(`
      UPDATE accounts 
      SET balance = balance - ?, available_balance = available_balance - ?
      WHERE id = ?
    `).bind(amount, amount, accountId).run()
    
    // Record transaction
  await env.DB.prepare(`
      INSERT INTO transactions (id, from_account_id, amount, currency, type, status, created_at)
      VALUES (?, ?, ?, ?, 'withdrawal', 'completed', datetime('now'))
    `).bind(txId, accountId, amount, (account as any).currency).run()
    
    return c.json({ 
      success: true, 
      transaction_id: txId,
      new_balance: Number((account as any).balance) - Number(amount)
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to withdraw', error }, 500)
  }
});

// ===== USER PROFILE MANAGEMENT =====

// Update user profile
app.put('/api/v1/users/profile', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
  const env = c.env as Env;
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { first_name, last_name, phone, date_of_birth } = await c.req.json().catch(() => ({}))
    
    // Build update query dynamically
    const updates: string[] = []
    const params: any[] = []
    
    if (first_name !== undefined) { updates.push('first_name = ?'); params.push(first_name) }
    if (last_name !== undefined) { updates.push('last_name = ?'); params.push(last_name) }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone) }
    if (date_of_birth !== undefined) { updates.push('date_of_birth = ?'); params.push(date_of_birth) }
    
    if (updates.length === 0) {
      return c.json({ success: false, message: 'No fields to update' }, 400)
    }
    
  await env.DB.prepare(`
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `).bind(...params, userId).run()
    
    return c.json({ success: true, message: 'Profile updated successfully' })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to update profile', error }, 500)
  }
});

// Get KYC status
app.get('/api/v1/kyc/status', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

  const kycApplication = await env.DB.prepare(`
      SELECT status, submitted_at, reviewed_at, rejection_reason
      FROM kyc_applications 
      WHERE user_id = ? 
      ORDER BY submitted_at DESC 
      LIMIT 1
    `).bind(userId).first()
    
  const documents = await env.DB.prepare(`
      SELECT document_type, verification_status, file_name
      FROM kyc_documents 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all()
    
    return c.json({ 
      success: true, 
      kyc_status: kycApplication ? (kycApplication as any).status : 'not_submitted',
      application: kycApplication,
      documents: documents.results
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to get KYC status', error }, 500)
  }
});

// Admin: Update KYC status
app.put('/api/v1/admin/kyc/:id/status', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
  { const role = (payload as any).role; if (role !== 'admin' && role !== 'super_admin') return c.json({ success: false, message: 'Forbidden' }, 403) }

    const kycId = c.req.param('id')
    const { status, rejection_reason } = await c.req.json().catch(() => ({}))
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return c.json({ success: false, message: 'Invalid status' }, 400)
    }

    const updates = ['status = ?', 'reviewed_at = datetime(\'now\')', 'reviewed_by = ?']
    const params = [status, (payload as any).id]
    
    if (status === 'rejected' && rejection_reason) {
      updates.push('rejection_reason = ?')
      params.push(rejection_reason)
    }
    
  const result = await env.DB.prepare(`
      UPDATE kyc_applications 
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params, kycId).run()
    
    if (result.meta.changes === 0) {
      return c.json({ success: false, message: 'KYC application not found' }, 404)
    }
    
    // Update user KYC status
    if (status === 'approved') {
  const kycApp = await env.DB.prepare('SELECT user_id FROM kyc_applications WHERE id = ?').bind(kycId).first()
      if (kycApp) {
  await env.DB.prepare(`
          UPDATE users SET kyc_status = 'verified' WHERE id = ?
        `).bind((kycApp as any).user_id).run()
      }
    }
    
    return c.json({ success: true, message: 'KYC status updated successfully' })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to update KYC status', error }, 500)
  }
});

// Admin: Get all KYC applications
app.get('/api/v1/admin/kyc', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const status = url.searchParams.get('status')
    const offset = (page - 1) * limit

    let whereClause = ''
    let params: string[] = []
    if (status) {
      whereClause = 'WHERE k.status = ?'
      params = [status]
    }

  const applications = await env.DB.prepare(`
      SELECT k.*, u.email, u.first_name, u.last_name
      FROM kyc_applications k
      JOIN users u ON k.user_id = u.id
      ${whereClause}
      ORDER BY k.submitted_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

  const totalResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM kyc_applications k ${whereClause}
    `).bind(...params).first()
    
    const total = Number((totalResult as any)?.count || 0)
    
    return c.json({
      success: true,
      data: applications.results,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to get KYC applications', error }, 500)
  }
});

// ===== TRANSFERS AND TRANSACTIONS =====

// Users: transactions with pagination and optional type/status filters
app.get('/api/v1/users/transactions', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload.id as string) || ''
    if (!userId) return c.json({ success: false, message: 'Invalid token' }, 401)

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const type = url.searchParams.get('type') || undefined
    const status = url.searchParams.get('status') || undefined
    const offset = (page - 1) * limit

  // Neon/Postgres logic removed. Only D1 logic remains.
    // Neon/Postgres logic removed. Only D1 logic remains.

    // D1 fallback
    try {
  const accRes = await c.env.ubasfintrust.prepare(`SELECT id FROM accounts WHERE user_id = ?`).bind(userId).all()
      const ids = (accRes.results || []).map((r: any) => r.id)
      if (ids.length === 0) return c.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
      // dynamic IN clause
      const placeholders = ids.map(() => '?').join(',')
      let q = `SELECT id, from_account_id, to_account_id, amount, currency, type, status, created_at FROM transactions
               WHERE (from_account_id IN (${placeholders}) OR to_account_id IN (${placeholders}))`
      const binds: any[] = [...ids, ...ids]
      if (type) { q += ` AND type = ?`; binds.push(type) }
      if (status) { q += ` AND status = ?`; binds.push(status) }
      q += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
      binds.push(limit, offset)
  const rows = await c.env.ubasfintrust.prepare(q).bind(...binds).all()
      // For total count (approximate): omit for simplicity in D1 sample
      return c.json({ success: true, data: rows.results || [], pagination: { page, limit, total: 0, totalPages: 0 } })
    } catch {
      return c.json({ success: true, data: [], pagination: { page, limit, total: 0, totalPages: 0 } })
    }
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
});

// Transfers: create transfer with idempotency

// ===== EXTERNAL BANKING =====

// Get supported banks for external transfers
app.get('/api/v1/banking/external-banks', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)

  const banks = externalBankingService.getSupportedBanks()
    
    return c.json({
      success: true,
      data: banks
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get supported banks'
    }, 500)
  }
})

// Verify external bank account
app.post('/api/v1/banking/external-banks/verify', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)

    const { accountNumber, bankCode } = await c.req.json().catch(() => ({}))
    
    if (!accountNumber || !bankCode) {
      return c.json({ 
        success: false, 
        message: 'Account number and bank code are required' 
      }, 400)
    }
    
  const result = await externalBankingService.verifyBankAccount(accountNumber, bankCode)
    
    return c.json({
      success: result.success,
      message: result.success ? 'Bank account verified successfully' : result.message || 'Verification failed',
      data: result.success ? {
        accountName: result.accountName,
        bankName: result.bankName,
        status: result.status
      } : undefined
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to verify bank account'
    }, 500)
  }
});

// External bank transfer
app.post('/api/v1/banking/external-transfer', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { fromAccountId, toAccountNumber, toBankCode, amount, description, recipientName } = await c.req.json().catch(() => ({}))
    
    if (!fromAccountId || !toAccountNumber || !toBankCode || !amount || !description || !recipientName) {
      return c.json({
        success: false,
        message: 'Missing required fields'
      }, 400)
    }
    
    // Verify the destination account first
  const verification = await externalBankingService.verifyBankAccount(toAccountNumber, toBankCode)
    if (!verification.success) {
      return c.json({
        success: false,
        message: verification.message || 'Account verification failed'
      }, 400)
    }
    
    // Calculate transfer fee
  const fee = externalBankingService.calculateTransferFee(amount, toBankCode, 'USD')
    
    // Initiate the transfer
    const transferData = {
      fromAccount: fromAccountId,
      toAccount: {
        accountNumber: toAccountNumber,
        accountName: verification.accountName || '',
        bankCode: toBankCode,
        bankName: verification.bankName || ''
      },
      amount,
      currency: 'USD',
      reference: externalBankingService.generateTransactionReference(),
      narration: description
    }
    
  const result = await externalBankingService.initiateTransfer(transferData)
    
    if (result.status === 'pending') {
      // Send notification
      const notificationService = initializeNotificationServices(c.env);
      if (notificationService) {
        await notificationService.sendNotification({
          userId,
          type: 'transaction',
          priority: 'medium',
          title: 'External Transfer Initiated',
          message: `External transfer of $${amount.toLocaleString()} to ${verification.bankName} has been initiated. Reference: ${result.reference}`,
          channels: ['email', 'sms', 'in_app'],
          data: {
            reference: result.reference,
            amount,
            toBank: verification.bankName,
            toAccount: toAccountNumber,
            fee: result.fee
          }
        })
      }
    }
    
    return c.json({
      success: result.status === 'pending',
      message: result.status === 'pending' ? 'External transfer initiated successfully' : 'Transfer failed',
      data: {
        reference: result.reference,
        status: result.status,
        fee: result.fee,
        externalReference: result.externalReference
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to process external transfer'
    }, 500)
  }
});

// ===== CREDIT SCORE AND BANKING SERVICES =====

// Get credit score
app.get('/api/v1/banking/credit-score', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    
  const creditScore = await creditScoreService.calculateCreditScore(userId)
    
    return c.json({
      success: true,
      data: creditScore
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get credit score'
    }, 500)
  }
})

// Assess loan eligibility
app.post('/api/v1/banking/loan-eligibility', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { amount } = await c.req.json().catch(() => ({}))
    
    if (!amount || amount < 1000) {
      return c.json({
        success: false,
        message: 'Minimum loan amount is $1,000'
      }, 400)
    }
    
  const eligibility = await creditScoreService.assessLoanEligibility(userId, amount)
    
    return c.json({
      success: true,
      data: eligibility
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to assess loan eligibility'
    }, 500)
  }
});

// ===== INVESTMENT SERVICES =====

// Get investment options
app.get('/api/v1/banking/investments/options', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)
    
  const options = investmentService.getInvestmentOptions()
    
    return c.json({
      success: true,
      data: options
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get investment options'
    }, 500)
  }
})

// Create investment
app.post('/api/v1/banking/investments', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { optionId, amount, accountId } = await c.req.json().catch(() => ({}))
    
    if (!optionId || !amount || !accountId) {
      return c.json({
        success: false,
        message: 'Investment option, amount, and account ID are required'
      }, 400)
    }
    
    if (amount < 100) {
      return c.json({
        success: false,
        message: 'Minimum investment amount is $100'
      }, 400)
    }
    
  const result = await investmentService.createInvestment(userId, optionId, amount, accountId)
    
    if (result.investmentId) {
      // Send notification
      const notificationService = initializeNotificationServices(c.env);
      if (notificationService) {
        await notificationService.sendNotification({
          userId,
          type: 'account',
          priority: 'medium',
          title: 'Investment Created',
          message: `Your investment of $${amount.toLocaleString()} has been created successfully.`,
          channels: ['email', 'in_app'],
          data: {
            investmentId: result.investmentId,
            optionId,
            amount
          }
        })
      }
    }
    
    return c.json({
      success: !!result.investmentId,
      message: result.investmentId ? 'Investment created successfully' : 'Failed to create investment',
      data: result
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to create investment'
    }, 500)
  }
});

// Get user investment portfolio
app.get('/api/v1/banking/investments/portfolio', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

  const portfolio = await investmentService.getUserPortfolio(userId)
    
    return c.json({
      success: true,
      data: portfolio
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get investment portfolio'
    }, 500)
  }
});

// Get market summary
app.get('/api/v1/banking/investments/market', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)

  const marketSummary = investmentService.getMarketSummary()
    
    return c.json({
      success: true,
      data: marketSummary
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get market summary'
    }, 500)
  }
});

// ===== NOTIFICATIONS =====

// Get user notifications (in-app)
app.get('/api/v1/notifications', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const type = url.searchParams.get('type')
    const read = url.searchParams.get('read')
    const offset = (page - 1) * limit

    let query = `
      SELECT * FROM notifications
      WHERE user_id = ?
    `
    const params: any[] = [userId]

    if (type) {
      query += ` AND type = ?`
      params.push(type)
    }

    if (read !== null) {
      query += ` AND read = ?`
      params.push(read === 'true')
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

  const notifications = await env.DB.prepare(query).bind(...params).all()

  const totalResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ?
      ${type ? 'AND type = ?' : ''}
      ${read !== null ? 'AND read = ?' : ''}
    `).bind(userId, ...(type ? [type] : []), ...(read !== null ? [read === 'true'] : [])).first()

  const unreadResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = false
    `).bind(userId).first()

    return c.json({
      success: true,
      data: {
        notifications: notifications.results,
        pagination: {
          page,
          limit,
          total: Number((totalResult as any)?.count || 0),
          pages: Math.ceil(Number((totalResult as any)?.count || 0) / limit)
        },
        unreadCount: Number((unreadResult as any)?.count || 0)
      }
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get notifications'
    }, 500)
  }
});

// Mark notification as read
app.patch('/api/v1/notifications/:id/read', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string
    const notificationId = c.req.param('id')

  const notification = await env.DB.prepare(`
      SELECT id FROM notifications WHERE id = ? AND user_id = ?
    `).bind(notificationId, userId).first()

    if (!notification) {
      return c.json({
        success: false,
        message: 'Notification not found'
      }, 404)
    }

  await env.DB.prepare(`
      UPDATE notifications 
      SET read = true, read_at = datetime('now')
      WHERE id = ?
    `).bind(notificationId).run()

    return c.json({
      success: true,
      message: 'Notification marked as read'
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to mark notification as read'
    }, 500)
  }
});

// Mark all notifications as read
app.patch('/api/v1/notifications/read-all', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

  await env.DB.prepare(`
      UPDATE notifications 
      SET read = true, read_at = datetime('now')
      WHERE user_id = ? AND read = false
    `).bind(userId).run()

    return c.json({
      success: true,
      message: 'All notifications marked as read'
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to mark all notifications as read'
    }, 500)
  }
});

// Test notification endpoint (for testing purposes)
app.post('/api/v1/notifications/test', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    const userId = (payload as any).id as string

    const { type, priority, title, message, channels, data } = await c.req.json().catch(() => ({}))

    if (!type || !priority || !title || !message || !channels) {
      return c.json({
        success: false,
        message: 'Missing required fields'
      }, 400)
    }

    // Send test notification
  const notificationService = initializeNotificationServices(c.env);
  await notificationService.sendNotification({
      userId,
      type,
      priority,
      title,
      message,
      channels,
      data
    })

    return c.json({
      success: true,
      message: 'Test notification sent'
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to send test notification'
    }, 500)
  }
});

// Get notification provider health status
app.get('/api/v1/notifications/providers/health', async (c: Context<{ Bindings: Env }>) => {
  try {
  // Removed initializeServices
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  await verifyBearer(token, jwtSecret, env.JWT_AUD)

  const notificationService = initializeNotificationServices(c.env);
  const providerStatus = notificationService.getProviderStatus()

    return c.json({
      success: true,
      data: providerStatus
    })
  } catch (error) {
    return c.json({
      success: false,
      message: 'Failed to get provider health status'
    }, 500)
  }
});

// ===== ADMIN ENDPOINTS =====
// Admin login endpoint
app.post('/api/v1/auth/admin/login', async (c: Context<{ Bindings: Env }>) => {
  try {
    const { identifier, password } = await c.req.json().catch(() => ({}))
    if (!identifier || !password) {
      return c.json({ success: false, message: 'Identifier and password required' }, 400)
    }

    // Find user by username or phone, must be admin/super_admin
  const env = c.env as Env;
  const user = await env.DB.prepare(
      `SELECT * FROM admin_users WHERE (username = ? OR email = ?) AND (role = 'admin' OR role = 'super_admin') LIMIT 1`
    ).bind(identifier, identifier).first()
    if (!user) {
      return c.json({ success: false, message: 'Admin user not found or not authorized' }, 404)
    }

    // Verify password
    const ok = await bcryptjs.compare(password, (user as any).password_hash)
    if (!ok) {
      return c.json({ success: false, message: 'Invalid password' }, 401)
    }

    // Issue JWT
  const jwtSecret = env.JWT_SECRET as string | undefined
    if (!jwtSecret) {
      return c.json({ success: false, message: 'JWT secret not configured' }, 500)
    }
    const { SignJWT } = await import('jose')
    const key = new TextEncoder().encode(jwtSecret)
    const token = await new SignJWT({
      id: (user as any).id,
      role: (user as any).role,
      username: (user as any).username,
      phone: (user as any).phone,
  aud: env.JWT_AUD
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(key)

    return c.json({
      success: true,
      token,
      user: {
        id: (user as any).id,
        username: (user as any).username,
        phone: (user as any).phone,
        role: (user as any).role,
        first_name: (user as any).first_name,
        last_name: (user as any).last_name
      }
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Admin login failed', error }, 500)
  }
});

// Admin: reset another user's password
app.post('/api/v1/auth/admin/reset-password', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const { userId, newPassword } = await c.req.json().catch(() => ({}))
    if (!userId || !newPassword) return c.json({ success: false, message: 'userId and newPassword required' }, 400)

    const databaseUrl = (c.env as any).DATABASE_URL as string | undefined
  // Neon/Postgres logic removed. Only D1 logic remains.
  } catch (e) {
    return c.json({ success: false, message: 'Reset failed' }, 500)
  }
})

// Admin-only example route
app.get('/api/v1/admin/ping', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)
    return c.json({ success: true, message: 'admin-ok' })
  } catch {
    return c.json({ success: false, message: 'Unauthorized' }, 401)
  }
})

// Admin: list users with optional search and pagination
app.get('/api/v1/admin/users', async (c: Context<{ Bindings: Env }>) => {
  try {
    const token = getBearer(c.req.raw)
    if (!token) return c.json({ success: false, message: 'Unauthorized' }, 401)
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined
    if (!jwtSecret) return c.json({ success: false, message: 'JWT secret not configured' }, 500)
  const env = c.env as Env;
  const payload = await verifyBearer(token, jwtSecret, env.JWT_AUD)
    if ((payload as any).role !== 'admin') return c.json({ success: false, message: 'Forbidden' }, 403)

    const url = new URL(c.req.url)
    const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || '20')))
    const q = (url.searchParams.get('q') || '').trim()
    const offset = (page - 1) * limit

    // Use D1 database for admin operations
    let whereClause = ''
    let params: string[] = []
    if (q) {
      whereClause = `WHERE email LIKE ? OR first_name LIKE ? OR last_name LIKE ?`
      params = [`%${q}%`, `%${q}%`, `%${q}%`]
    }

  const rows = await env.DB.prepare(`
      SELECT id, email, first_name, last_name, account_type, kyc_status, is_verified, created_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all()

  const totalResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM users ${whereClause}
    `).bind(...params).first()
    
    const total = Number((totalResult as any)?.count || 0)
    return c.json({ 
      success: true, 
      data: rows.results, 
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } 
    })
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    return c.json({ success: false, message: 'Failed to list users', error }, 500)
  }
});

// Dev-only: mint token (guard with DEV_MINT)
app.post('/dev/mint-token', async (c: Context<{ Bindings: Env }>) => {
  const allow = (c.env as any).DEV_MINT === 'true';
  if (!allow) {
    return c.json({ error: 'disabled' }, 403);
  }
  try {
    const { email = 'demo@example.com', id = crypto.randomUUID(), expiresIn = '7d' } = await c.req.json().catch(() => ({}));
    const jwtSecret = (c.env as any).JWT_SECRET as string | undefined;
    if (!jwtSecret) {
      return c.json({ error: 'JWT secret not configured' }, 500);
    }
    const key = new TextEncoder().encode(jwtSecret);
    // dynamic import to avoid increasing cold path if unused
    const { SignJWT } = await import('jose');
    const env = c.env as Env;
    const token = await new SignJWT({ id, email, aud: env.JWT_AUD })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(key);
    return c.json({ token, id, email });
  } catch (e) {
    return c.json({ error: 'failed to mint' }, 500);
  }
});

// Admin seed endpoint: ensures default admin user exists
app.post('/api/v1/auth/admin/seed', async (c: Context<{ Bindings: Env }>) => {
  try {
    const env = c.env as Env;
    const email = 'admin@ubasfintrust.com';
    const username = 'admin';
    const password = 'Admin25@@';
    const salt = bcryptjs.genSaltSync(12);
    const password_hash = bcryptjs.hashSync(password, salt);
    const role = 'super_admin';
    const first_name = 'System';
    const last_name = 'Administrator';
    // Check if admin user exists
    const existing = await env.DB.prepare(
      `SELECT id FROM admin_users WHERE email = ? LIMIT 1`
    ).bind(email).first();
    if (existing) {
      // Update password and role if needed
      await env.DB.prepare(
        `UPDATE admin_users SET password_hash = ?, role = ?, status = 'active' WHERE email = ?`
      ).bind(password_hash, role, email).run();
      return c.json({ success: true, message: 'Admin user updated.' });
    } else {
      // Insert new admin user
      await env.DB.prepare(
        `INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role, status) VALUES (?, ?, ?, ?, ?, ?, 'active')`
      ).bind(username, email, password_hash, first_name, last_name, role).run();
      return c.json({ success: true, message: 'Admin user created.' });
    }
  } catch (e) {
    return c.json({ success: false, message: 'Admin seed failed', error: (e as Error).message }, 500);
  }
});
// END: admin seed endpoint

export default app;
