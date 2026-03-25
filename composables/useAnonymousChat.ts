/**
 * useAnonymousChat
 *
 * Manages anonymous chat state and device identification.
 *
 * Features:
 * - Generates unique device_id on first browser visit (persists in localStorage)
 * - Tracks current conversation_id in localStorage
 * - Stores claim_token for later authentication
 * - Provides utilities to access/manage anonymous chat data
 *
 * Usage:
 * ```ts
 * const { deviceId, conversationId, setConversationId, getClaimToken } = useAnonymousChat()
 * ```
 */

export const useAnonymousChat = () => {
  const DEVICE_ID_KEY = 'sitesynth_device_id'
  const CONVERSATION_ID_KEY = 'sitesynth_conversation_id'
  const CLAIM_TOKEN_KEY = 'sitesynth_claim_token'

  /**
   * Get or create device ID
   * - First visit: generates new UUID, stores in localStorage
   * - Subsequent visits: returns stored UUID
   * - Persists across sessions in same browser
   */
  const getOrCreateDeviceId = (): string => {
    if (process.client) {
      let deviceId = localStorage.getItem(DEVICE_ID_KEY)

      if (!deviceId) {
        // Generate new UUIDv4 for this browser
        deviceId = crypto.randomUUID()
        localStorage.setItem(DEVICE_ID_KEY, deviceId)

        console.log('[useAnonymousChat] Generated new device_id:', deviceId.slice(0, 8) + '...')
      }

      return deviceId
    }

    return ''
  }

  /**
   * Get current conversation ID (if one is active)
   */
  const getConversationId = (): string | null => {
    if (process.client) {
      return localStorage.getItem(CONVERSATION_ID_KEY)
    }
    return null
  }

  /**
   * Set current conversation ID
   * Call this after creating a new conversation
   */
  const setConversationId = (id: string) => {
    if (process.client) {
      localStorage.setItem(CONVERSATION_ID_KEY, id)
      console.log('[useAnonymousChat] Set conversation_id:', id.slice(0, 8) + '...')
    }
  }

  /**
   * Clear current conversation (e.g., when switching to different chat)
   */
  const clearConversationId = () => {
    if (process.client) {
      localStorage.removeItem(CONVERSATION_ID_KEY)
      console.log('[useAnonymousChat] Cleared conversation_id')
    }
  }

  /**
   * Store claim token after conversation creation
   * Used during registration to claim this anonymous conversation
   */
  const setClaimToken = (token: string) => {
    if (process.client) {
      localStorage.setItem(CLAIM_TOKEN_KEY, token)
      console.log('[useAnonymousChat] Stored claim_token')
    }
  }

  /**
   * Retrieve claim token for registration
   */
  const getClaimToken = (): string | null => {
    if (process.client) {
      return localStorage.getItem(CLAIM_TOKEN_KEY)
    }
    return null
  }

  /**
   * Clear claim token after successful claim (conversion to authenticated)
   */
  const clearClaimToken = () => {
    if (process.client) {
      localStorage.removeItem(CLAIM_TOKEN_KEY)
      console.log('[useAnonymousChat] Cleared claim_token')
    }
  }

  /**
   * Check if user has an active anonymous conversation
   */
  const hasActiveConversation = (): boolean => {
    return getConversationId() !== null
  }

  /**
   * Reset all anonymous chat data (e.g., on logout)
   */
  const reset = () => {
    if (process.client) {
      localStorage.removeItem(CONVERSATION_ID_KEY)
      localStorage.removeItem(CLAIM_TOKEN_KEY)
      // Note: device_id is NOT cleared, as it represents the browser
      console.log('[useAnonymousChat] Reset chat state (kept device_id)')
    }
  }

  return {
    deviceId: getOrCreateDeviceId(),
    conversationId: getConversationId(),
    setConversationId,
    clearConversationId,
    setClaimToken,
    getClaimToken,
    clearClaimToken,
    hasActiveConversation,
    reset,
  }
}
