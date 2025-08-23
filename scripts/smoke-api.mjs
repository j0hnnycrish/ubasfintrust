#!/usr/bin/env node
import assert from 'node:assert'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'

const base = process.env.VITE_API_URL || process.env.API_BASE || ''
if (!base) {
  console.error('VITE_API_URL (or API_BASE) is not set. Set it to your Worker base URL, e.g., https://your-worker.workers.dev')
  process.exit(2)
}
const j = (u) => (u.startsWith('http') ? u : base.replace(/\/$/, '') + (u.startsWith('/') ? u : '/' + u))
// If base ends with /api or /api/v1, use a rootBase for platform health endpoints
const rootBase = base.replace(/\/$/, '').replace(/\/(api|api\/v1)$/,'')
const jRoot = (u) => (u.startsWith('http') ? u : rootBase + (u.startsWith('/') ? u : '/' + u))

async function json(url, init) {
  const r = await fetch(j(url), init)
  const text = await r.text()
  try {
    return { ok: r.ok, status: r.status, data: text ? JSON.parse(text) : null }
  } catch {
    return { ok: r.ok, status: r.status, data: text }
  }
}

async function smoke() {
  console.log(`Base: ${base}`)

  // Health (optional on Worker; skip asserts if not present)
  try {
    const r = await fetch(jRoot('/health'))
    console.log('GET /health ->', r.status, r.ok)
  } catch {}
  try {
    const r2 = await fetch(jRoot('/health/readiness'))
    console.log('GET /health/readiness ->', r2.status, r2.ok)
  } catch {}

  // Anonymous whoami should be 401 or ok:false
  const whoAnon = await fetch(j('/api/v1/auth/whoami'))
  console.log('GET /api/v1/auth/whoami (anon) ->', whoAnon.status)
  assert([401, 403].includes(whoAnon.status) || whoAnon.status === 200, 'unexpected whoami anon status')

  // Optional: user login
  const USERNAME = process.env.SMOKE_USERNAME
  const PASSWORD = process.env.SMOKE_PASSWORD
  if (USERNAME && PASSWORD) {
    const login = await json('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
    })
    console.log('POST /api/v1/auth/login ->', login.status, login.ok)
    assert(login.ok, 'user login failed')
    const token = login.data?.token || login.data?.accessToken
    assert(token, 'no token returned from user login')

    const who = await fetch(j('/api/v1/auth/whoami'), { headers: { Authorization: `Bearer ${token}` } })
    console.log('GET /api/v1/auth/whoami (user) ->', who.status)
    assert(who.ok, 'whoami with user token failed')
  } else {
    console.log('Skipping user login (set SMOKE_USERNAME and SMOKE_PASSWORD to enable)')
  }

  // Optional: admin login
  const ADMIN_IDENTIFIER = process.env.SMOKE_ADMIN_IDENTIFIER
  const ADMIN_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD
  if (ADMIN_IDENTIFIER && ADMIN_PASSWORD) {
    const admin = await json('/api/v1/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: ADMIN_IDENTIFIER, password: ADMIN_PASSWORD }),
    })
    console.log('POST /api/v1/auth/admin/login ->', admin.status, admin.ok)
    assert(admin.ok, 'admin login failed')
    const adminToken = admin.data?.token
    assert(adminToken, 'no token from admin login')

    // Call notifications provider health with admin token
    const prov = await fetch(j('/api/v1/notifications/providers/health'), { headers: { Authorization: `Bearer ${adminToken}` } })
    console.log('GET /api/v1/notifications/providers/health ->', prov.status)

    // Call users profile with admin token
    const prof = await fetch(j('/api/v1/users/profile'), { headers: { Authorization: `Bearer ${adminToken}` } })
    console.log('GET /api/v1/users/profile ->', prof.status)
  } else {
    console.log('Skipping admin login (set SMOKE_ADMIN_IDENTIFIER and SMOKE_ADMIN_PASSWORD to enable)')
  }

  console.log('Smoke tests passed')
}

smoke().catch((err) => {
  console.error('Smoke test failure:', err?.message || err)
  process.exit(1)
})
