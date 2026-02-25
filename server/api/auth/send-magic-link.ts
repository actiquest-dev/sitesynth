import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { success: false, error: 'Method not allowed' }
  }

  try {
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      setResponseStatus(event, 400)
      return { success: false, error: 'Email is required' }
    }

    // Get Supabase config from runtimeConfig
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

    // Send magic link
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${config.public?.siteUrl || 'http://localhost:3000'}/confirmation`,
      },
    })

    if (error) {
      console.error('❌ Magic link error:', error)
      setResponseStatus(event, 400)
      return {
        success: false,
        error: error.message || 'Failed to send magic link',
      }
    }

    console.log('✅ Magic link sent to:', email)

    return {
      success: true,
      message: 'Magic link sent to your email. Please check your inbox.',
      email,
    }
  } catch (error: any) {
    console.error('❌ Magic link API error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message || 'Internal server error',
    }
  }
})
