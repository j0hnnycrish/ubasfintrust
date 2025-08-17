import { neon } from '@neondatabase/serverless'

let cached: ReturnType<typeof neon> | null = null

export function getNeonClient(databaseUrl?: string) {
  const url = databaseUrl || (globalThis as any).DATABASE_URL
  if (!url) return null
  if (!cached) cached = neon(url)
  return cached
}
