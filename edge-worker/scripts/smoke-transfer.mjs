#!/usr/bin/env node
// Tiny CLI to smoke test POST /api/v1/transfers with idempotency
// Env: API_BASE (e.g., https://your-worker.example.workers.dev),
//      TOKEN (Bearer JWT), FROM, TO, AMOUNT, CURRENCY (optional, default USD)
import { randomUUID } from 'crypto'

const API_BASE = process.env.API_BASE || 'http://127.0.0.1:8787'
const TOKEN = process.env.TOKEN
const FROM = process.env.FROM
const TO = process.env.TO
const AMOUNT = process.env.AMOUNT || '5'
const CURRENCY = (process.env.CURRENCY || 'USD').toUpperCase()

if (!TOKEN) {
  console.error('TOKEN env is required')
  process.exit(1)
}
if (!FROM || !TO) {
  console.error('FROM and TO env are required')
  process.exit(1)
}

const idem = randomUUID()

async function callOnce(idemKey) {
  const res = await fetch(`${API_BASE}/api/v1/transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      'Idempotency-Key': idemKey,
    },
    body: JSON.stringify({ fromAccountId: FROM, toAccountId: TO, amount: Number(AMOUNT), currency: CURRENCY }),
  })
  const json = await res.json().catch(() => ({}))
  return { status: res.status, json }
}

;(async () => {
  console.log('Idempotency-Key:', idem)
  const first = await callOnce(idem)
  console.log('First call:', first.status, first.json)
  const second = await callOnce(idem)
  console.log('Second call (should be identical):', second.status, second.json)
  process.exit(0)
})().catch((e) => { console.error(e); process.exit(1) })
