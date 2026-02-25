import { defineEventHandler, setResponseStatus } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    // Get the session from URL parameters (Supabase redirects with #access_token, #refresh_token, etc)
    const config = useRuntimeConfig()
    const supabaseUrl = config.public?.supabaseUrl
    const supabaseAnonKey = config.public?.supabaseAnonKey

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase not configured')
      setResponseStatus(event, 500)
      return { success: false, error: 'Authentication service not configured' }
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Get the session from the hash (Supabase OTP flow)
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) {
      console.error('❌ Session verification error:', error)
      setResponseStatus(event, 401)
      return {
        success: false,
        error: error?.message || 'Session verification failed',
      }
    }

    const user = session.user

    console.log('✅ Session verified for user:', user.email)

    return {
      success: true,
      message: 'Session verified',
      user: {
        id: user.id,
        email: user.email,
        provider: 'supabase',
        authenticatedAt: new Date().toISOString(),
      },
      session: {
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      },
    }
  } catch (error: any) {
    console.error('❌ Session verification API error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message || 'Internal server error',
    }
  }
})
