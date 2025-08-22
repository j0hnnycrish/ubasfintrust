import { jwtVerify } from 'jose'

export type JwtPayload = {
  id?: string
  email?: string
  aud?: string | string[]
  [k: string]: unknown
}

export async function verifyBearer(token: string, secret: string, expectedAud?: string) {
  const key = new TextEncoder().encode(secret)
  const { payload } = await jwtVerify(token, key, expectedAud ? { audience: expectedAud } : undefined)
  return payload as JwtPayload
}

export function getBearer(req: Request): string | null {
  const auth = req.headers.get('authorization') || ''
  const m = auth.match(/^Bearer\s+(.+)$/i)
  return m ? m[1] ?? null : null
}
