import { OAuth2Client } from 'google-auth-library'
import { createError, getHeader, H3Event } from 'h3'
import { isAdminEmail } from '~~/server/utils/admin'

const getGoogleClientId = () => {
  const config = useRuntimeConfig()
  const googleClientId = config.public?.googleClientId
  if (!googleClientId) {
    throw createError({ statusCode: 500, statusMessage: 'Google Client ID not configured' })
  }
  return googleClientId
}

export const requireAdminSession = async (event: H3Event) => {
  const idToken =
    getHeader(event, 'x-google-id-token') ||
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '')

  if (!idToken) {
    throw createError({ statusCode: 401, statusMessage: 'Google admin token required' })
  }

  const client = new OAuth2Client(getGoogleClientId())
  let payload
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: getGoogleClientId(),
    })
    payload = ticket.getPayload()
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Google admin token' })
  }

  const email = payload?.email || null
  if (!isAdminEmail(email)) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  return {
    email,
    name: payload?.name || email,
  }
}
