import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { sendPaymentConfirmation } from '../../utils/email'

interface PaymentConfirmationRequest {
  email: string
  fullName?: string
  orderNumber: string
  amount: number
  currency: string
  paymentMethod?: string
  projectStartDate?: string
}

interface PaymentConfirmationResponse {
  success: boolean
  message: string
  error?: string
}

export default defineEventHandler(
  async (event): Promise<PaymentConfirmationResponse> => {
    if (event.method !== 'POST') {
      setResponseStatus(event, 405)
      return {
        success: false,
        message: 'Method Not Allowed',
        error: 'Method Not Allowed',
      }
    }

    try {
      const body = await readBody<PaymentConfirmationRequest>(event)
      const { email, fullName, orderNumber, amount, currency, paymentMethod, projectStartDate } =
        body

      if (!email || !orderNumber || !amount) {
        setResponseStatus(event, 400)
        return {
          success: false,
          message: 'Missing required fields',
          error: 'Email, order number, and amount are required',
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setResponseStatus(event, 400)
        return {
          success: false,
          message: 'Invalid email format',
          error: 'Invalid email format',
        }
      }

      // Send payment confirmation email
      try {
        await sendPaymentConfirmation({
          email,
          fullName: fullName || 'Valued Customer',
          orderNumber,
          amount,
          currency: currency || 'USD',
          paymentMethod: paymentMethod || 'Credit Card',
          projectStartDate: projectStartDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
            'en-US',
            {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }
          ),
        })

        console.log(`✅ Payment confirmation email sent to ${email}`)
        return {
          success: true,
          message: `Payment confirmation sent to ${email}`,
        }
      } catch (emailError: any) {
        console.error('❌ Failed to send payment confirmation:', emailError.message)
        setResponseStatus(event, 500)
        return {
          success: false,
          message: 'Failed to send confirmation email',
          error: emailError.message,
        }
      }
    } catch (error: any) {
      console.error('❌ Payment confirmation error:', error)
      setResponseStatus(event, 500)
      return {
        success: false,
        message: 'Internal server error',
        error: error.message,
      }
    }
  }
)
