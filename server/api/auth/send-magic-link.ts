import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { sendMagicLinkCode } from '../../utils/email'

interface SendCodeRequest {
  email: string
}

interface SendCodeResponse {
  success: boolean
  message: string
  error?: string
}

// In-memory storage for codes (in production use Redis or database)
const verificationCodes = new Map<string, { code: string; email: string; expiresAt: number }>()

export default defineEventHandler(async (event): Promise<SendCodeResponse> => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { success: false, message: 'Method Not Allowed', error: 'Method Not Allowed' }
  }

  try {
    const body = await readBody<SendCodeRequest>(event)
    let { email } = body
    email = email.trim().toLowerCase()

    if (!email) {
      setResponseStatus(event, 400)
      return { success: false, message: 'Email is required', error: 'Email is required' }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setResponseStatus(event, 400)
      return { success: false, message: 'Invalid email format', error: 'Invalid email format' }
    }

    // Generate random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

    // Store code in memory
    verificationCodes.set(code, { code, email, expiresAt })

    // Clean up expired codes
    for (const [key, value] of verificationCodes.entries()) {
      if (value.expiresAt < Date.now()) {
        verificationCodes.delete(key)
      }
    }

    // Send email with code
    try {
      await sendMagicLinkCode(email, code)
      console.log(`✅ Verification code sent to ${email}`)
      
      return {
        success: true,
        message: `Verification code sent to ${email}. Check your inbox!`,
      }
    } catch (emailError: any) {
      console.error('❌ Failed to send email:', emailError.message)
      setResponseStatus(event, 500)
      return {
        success: false,
        message: 'Failed to send verification code email',
        error: emailError.message,
      }
    }
  } catch (error: any) {
    console.error('❌ Send code error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Internal server error',
      error: error.message,
    }
  }
})

// Export for external verification
export function verifyCode(code: string, email: string): boolean {
  const stored = verificationCodes.get(code)

  if (!stored) {
    return false
  }

  // Check if expired
  if (stored.expiresAt < Date.now()) {
    verificationCodes.delete(code)
    return false
  }

  // Check if email matches
  if (stored.email !== email) {
    return false
  }

  // Valid - delete the code so it can't be reused
  verificationCodes.delete(code)
  return true
}

