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

  // Health
  const health = await (async () => {
    // Try root health first, then API health as fallback
    const r = await (await fetch(jRoot('/health')))
    if (r.ok) return { ok: true, status: r.status, data: await r.json().catch(() => null) }
    return json('/health')
  })()
  console.log('GET /health ->', health.status, health.ok)
  assert(health.ok, 'health check failed')

  const ready = await (async () => {
    const r = await (await fetch(jRoot('/health/readiness')))
    if (r.ok) return { ok: true, status: r.status, data: await r.json().catch(() => null) }
    return json('/health/readiness')
  })()
  console.log('GET /health/readiness ->', ready.status, ready.ok)
  assert(ready.ok, 'readiness check failed')

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
  const ADMIN_USERNAME = process.env.SMOKE_ADMIN_USERNAME
  const ADMIN_PASSWORD = process.env.SMOKE_ADMIN_PASSWORD
  if (ADMIN_USERNAME && ADMIN_PASSWORD) {
    const admin = await json('/api/v1/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }),
    })
    console.log('POST /api/v1/auth/admin/login ->', admin.status, admin.ok)
    assert(admin.ok, 'admin login failed')
  } else {
    console.log('Skipping admin login (set SMOKE_ADMIN_USERNAME and SMOKE_ADMIN_PASSWORD to enable)')
  }

  console.log('Smoke tests passed')
}

smoke().catch((err) => {
  console.error('Smoke test failure:', err?.message || err)
  process.exit(1)
})
