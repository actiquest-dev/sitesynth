import { OAuth2Client } from 'google-auth-library'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { idToken } = body

  if (!idToken) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'ID token is required',
    }
  }

  try {
    // Get Google Client ID from runtime config
    const config = useRuntimeConfig()
    const googleClientId = config.public?.googleClientId

    if (!googleClientId) {
      console.error('Google Client ID not configured')
      setResponseStatus(event, 500)
      return {
        success: false,
        error: 'Server configuration error',
      }
    }

    // Verify the ID token with Google
    const client = new OAuth2Client(googleClientId)
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleClientId,
    })

    const payload = ticket.getPayload()

    if (!payload || !payload.email) {
      setResponseStatus(event, 400)
      return {
        success: false,
        error: 'Invalid token payload',
      }
    }

    // Extract user info from Google token
    const userEmail = payload.email
    const userName = payload.name || payload.email
    const userPhoto = payload.picture

    console.log(`🔐 Google Auth for: ${userEmail}`)

    // Create a simple auth token (in production, use JWT)
    const authToken = Buffer.from(`${userEmail}:${Date.now()}`).toString('base64')

    // Return user info and token
    return {
      success: true,
      token: authToken,
      user: {
        email: userEmail,
        name: userName,
        photo: userPhoto,
        provider: 'google',
        authenticatedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    console.error('Google auth error:', error)

    setResponseStatus(event, 401)
    return {
      success: false,
      error: error.message || 'Google authentication failed',
    }
  }
})
