import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { verifyCode } from './send-magic-link'

interface VerifyCodeRequest {
  email: string
  code: string
}

interface VerifyCodeResponse {
  success: boolean
  message: string
  error?: string
}

export default defineEventHandler(async (event): Promise<VerifyCodeResponse> => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { success: false, message: 'Method Not Allowed', error: 'Method Not Allowed' }
  }

  try {
    const body = await readBody<VerifyCodeRequest>(event)
    let { email, code } = body
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

    // Return success
    return {
      success: true,
      message: 'Code verified successfully',
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

