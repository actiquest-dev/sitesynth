import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { email, fullName, chargeId, claimToken } = body

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
      // User already exists - try to claim conversation if token provided
      console.log(`User ${email} already exists in Supabase`)
      if (claimToken) {
        const claimResult = await claimConversation(supabase, claimToken, email)
        return {
          success: true,
          message: 'User already registered',
          userExists: true,
          conversationClaimed: claimResult.success,
          conversationId: claimResult.conversationId,
        }
      }
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

    // ✅ Claim anonymous conversation if claim_token provided
    let claimResult = { success: false, conversationId: null }
    if (claimToken) {
      claimResult = await claimConversation(supabase, claimToken, email)
      console.log(`[after-payment] Claim result: success=${claimResult.success}, conversationId=${claimResult.conversationId}`)
    }

    return {
      success: true,
      message: 'User registered successfully after payment',
      userId: data.user?.id,
      email: data.user?.email,
      conversationClaimed: claimResult.success,
      conversationId: claimResult.conversationId,
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

/**
 * Helper: Claim anonymous conversation
 * Links an anonymous conversation to a newly registered user email
 */
async function claimConversation(supabase: any, claimToken: string, userEmail: string) {
  try {
    // Find conversation by claim_token
    const { data: conversation, error: findError } = await supabase
      .from('conversations')
      .select('id, device_id, user_email, claim_token, claimed_at')
      .eq('claim_token', claimToken)
      .maybeSingle()

    if (findError) {
      console.error('[claim-conversation] Database error:', findError)
      return { success: false, conversationId: null }
    }

    if (!conversation) {
      console.log('[claim-conversation] Invalid or expired token:', claimToken)
      return { success: false, conversationId: null }
    }

    // Check if already claimed
    if (conversation.claimed_at) {
      console.log('[claim-conversation] Already claimed:', conversation.id)
      return { success: true, conversationId: conversation.id }
    }

    // Check if trying to claim with wrong email
    if (conversation.user_email && conversation.user_email !== userEmail) {
      console.log('[claim-conversation] Wrong email:', userEmail, 'expected:', conversation.user_email)
      return { success: false, conversationId: null }
    }

    // Update conversation: bind to user_email, mark as claimed
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        user_email: userEmail,
        claimed_at: new Date().toISOString(),
        claim_token: null, // Invalidate token (single use)
      })
      .eq('id', conversation.id)

    if (updateError) {
      console.error('[claim-conversation] Update error:', updateError)
      return { success: false, conversationId: null }
    }

    console.log(`[claim-conversation] Successfully claimed conversation ${conversation.id} for user ${userEmail}`)
    return { success: true, conversationId: conversation.id }
  } catch (error: any) {
    console.error('[claim-conversation] Error:', error)
    return { success: false, conversationId: null }
  }
}
