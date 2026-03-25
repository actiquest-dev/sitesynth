/**
 * POST /api/auth/claim-conversation
 *
 * Claim an anonymous conversation after user registration.
 *
 * When a user registers, they provide a claim_token (obtained from anonymous chat).
 * This endpoint links the anonymous conversation history to their authenticated account.
 *
 * After claiming:
 * - conversation.user_email is populated (was NULL)
 * - conversation.claimed_at is set (timestamp)
 * - conversation.claim_token is cleared (single-use)
 * - User can now access conversation from any device by authenticating
 *
 * Flow:
 * 1. User opens anonymous chat → conversation created with device_id + claim_token
 * 2. User registers with claim_token
 * 3. POST /api/auth/claim-conversation with { claim_token, user_email }
 * 4. Conversation is now tied to user_email, device_id role removed
 * 5. User logs in on different device → sees same conversation history
 */

import { defineEventHandler, readBody, createError } from 'h3'
import { useDatabaseClient } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { claim_token, user_email } = body

  if (!claim_token || !user_email) {
    return createError({
      statusCode: 400,
      statusMessage: 'claim_token and user_email required',
    })
  }

  try {
    const db = useDatabaseClient()

    // 1. Find conversation by claim_token
    const { data: conversation, error: findError } = await db
      .from('conversations')
      .select('id, device_id, user_email, claim_token, claimed_at')
      .eq('claim_token', claim_token)
      .maybeSingle()

    if (findError) {
      console.error('[claim-conversation] Database error:', findError)
      return createError({
        statusCode: 500,
        statusMessage: 'Database error',
      })
    }

    if (!conversation) {
      return createError({
        statusCode: 404,
        statusMessage: 'Invalid or expired claim token',
      })
    }

    // 2. Check if already claimed
    if (conversation.claimed_at) {
      return createError({
        statusCode: 400,
        statusMessage: 'This conversation has already been claimed',
      })
    }

    // 3. Check if trying to claim with wrong email
    if (conversation.user_email && conversation.user_email !== user_email) {
      return createError({
        statusCode: 400,
        statusMessage: 'This conversation belongs to a different user',
      })
    }

    // 4. Update conversation: bind to user_email, mark as claimed
    const { error: updateError } = await db
      .from('conversations')
      .update({
        user_email,
        claimed_at: new Date().toISOString(),
        claim_token: null, // Invalidate token (single use)
      })
      .eq('id', conversation.id)

    if (updateError) {
      console.error('[claim-conversation] Update error:', updateError)
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to claim conversation',
      })
    }

    // 5. Log success
    console.log(
      `[claim-conversation] Successfully claimed conversation ${conversation.id} for user ${user_email}`
    )

    return {
      success: true,
      message: 'Conversation claimed successfully',
      conversationId: conversation.id,
      userEmail: user_email,
    }
  } catch (error: any) {
    console.error('[claim-conversation] Error:', error)
    return createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to claim conversation',
    })
  }
})
