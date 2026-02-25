import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, fullName, chargeId } = body

  if (!email || !fullName) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'Email and fullName are required',
    }
  }

  try {
    // Initialize Supabase admin client
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase credentials not configured')
      setResponseStatus(event, 500)
      return {
        success: false,
        error: 'Server configuration error',
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Check if user already exists
    const { data: existingUsers, error: getUserError } = await supabase.auth.admin.listUsers()

    if (getUserError) {
      console.error('Error checking existing users:', getUserError)
      setResponseStatus(event, 500)
      return {
        success: false,
        error: 'Failed to check user existence',
      }
    }

    const userExists = existingUsers?.users?.some((u) => u.email === email)

    if (userExists) {
      // User already exists - just return success
      console.log(`User ${email} already exists in Supabase`)
      return {
        success: true,
        message: 'User already registered',
        userExists: true,
      }
    }

    // Generate a temporary password (user will need to reset it)
    const tempPassword = Math.random().toString(36).slice(-12)

    // Create new user
    const { data, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        stripe_charge_id: chargeId,
        registered_from: 'payment',
        created_at: new Date().toISOString(),
      },
    })

    if (signUpError) {
      console.error('Error creating user:', signUpError)
      setResponseStatus(event, 400)
      return {
        success: false,
        error: signUpError.message || 'Failed to create user',
      }
    }

    console.log(`✅ User registered after payment: ${email}`)

    return {
      success: true,
      message: 'User registered successfully after payment',
      userId: data.user?.id,
      email: data.user?.email,
    }
  } catch (error: any) {
    console.error('Auth after payment error:', error)
    setResponseStatus(event, 500)

    return {
      success: false,
      error: error.message || 'Internal server error',
    }
  }
})
