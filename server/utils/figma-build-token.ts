import crypto from 'node:crypto'

const getSecret = () =>
  process.env.FIGMA_BUILD_TOKEN_SECRET || process.env.NUXT_SESSION_PASSWORD || 'local-figma-build-secret'

type BuildTokenPayload = {
  jobId: string
  exp: number
}

export const issueBuildToken = (jobId: string, ttlSeconds = 10 * 60) => {
  const payload: BuildTokenPayload = {
    jobId,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url')
  return `${body}.${sig}`
}

export const verifyBuildToken = (token: string) => {
  const [body, sig] = token.split('.')
  if (!body || !sig) throw new Error('Invalid token format')
  const expected = crypto.createHmac('sha256', getSecret()).update(body).digest('base64url')
  if (expected !== sig) throw new Error('Invalid token signature')
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as BuildTokenPayload
  if (!payload.jobId || !payload.exp) throw new Error('Invalid token payload')
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired')
  return payload
}
