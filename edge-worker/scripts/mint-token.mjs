#!/usr/bin/env node
import { SignJWT } from 'jose'

const secret = process.env.JWT_SECRET
if (!secret) {
  console.error('JWT_SECRET is required')
  process.exit(1)
}
const AUD = process.env.JWT_AUD || 'ubas'
const id = process.env.USER_ID || crypto.randomUUID()
const email = process.env.USER_EMAIL || 'demo@example.com'

const key = new TextEncoder().encode(secret)
const token = await new SignJWT({ id, email, aud: AUD })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('7d')
  .sign(key)

console.log(token)
