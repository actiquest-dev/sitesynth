import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { createClient } from '@supabase/supabase-js'
import { verifyCode } from './send-magic-link'

interface VerifyCodeRequest {
  email: string
  code: string
  claimToken?: string  // Optional: claim token from anonymous chat
}

interface VerifyCodeResponse {
  success: boolean
  message: string
  error?: string
  conversationClaimed?: boolean
  conversationId?: string
}

export default defineEventHandler(async (event): Promise<VerifyCodeResponse> => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { success: false, message: 'Method Not Allowed', error: 'Method Not Allowed' }
  }

  try {
    const body = await readBody<VerifyCodeRequest>(event)
    let { email, code, claimToken } = body
    email = email.trim().toLowerCase()
    code = code.trim()

    if (!email || !code) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Email and code are required',
        error: 'Email and code are required',
      }
    }

    console.log(`🔍 Verifying code: ${code} for email: ${email}`)
    // Verify the code
    const isValid = verifyCode(code, email)

    if (!isValid) {
      setResponseStatus(event, 401)
      return {
        success: false,
        message: 'Invalid or expired code',
        error: 'Invalid or expired code',
      }
    }

    console.log(`✅ Code verified for ${email}`)

    // ✅ If claim token provided, claim the anonymous conversation
    let claimResult = { success: false, conversationId: null }
    if (claimToken) {
      claimResult = await claimConversation(email, claimToken)
      console.log(`[verify-code] Claim result: success=${claimResult.success}, conversationId=${claimResult.conversationId}`)
    }

    // Return success
    return {
      success: true,
      message: 'Code verified successfully',
      conversationClaimed: claimResult.success,
      conversationId: claimResult.conversationId || undefined,
    }
  } catch (error: any) {
    console.error('❌ Verify code error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    }
  }
})

/**
 * Helper: Claim anonymous conversation
 * Links an anonymous conversation to a newly registered user email
 */
async function claimConversation(userEmail: string, claimToken: string) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[claim-conversation] Supabase credentials not configured')
      return { success: false, conversationId: null }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

