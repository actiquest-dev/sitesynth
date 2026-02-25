import { defineEventHandler, setResponseStatus, readBody } from 'h3'
import { StripeService } from '../services/stripeService'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { error: 'Method Not Allowed' }
  }

  try {
    const body = await readBody(event)
    const { amount, email, description } = body

    if (!amount || !email) {
      setResponseStatus(event, 400)
      return {
        error: 'Amount and email are required',
      }
    }

    const result = await StripeService.createPaymentIntent(amount, email, description)

    if (!result.success) {
      setResponseStatus(event, 400)
    }

    return result
  } catch (error: any) {
    console.error('Create payment intent error:', error)
    setResponseStatus(event, 500)
    return {
      error: error.message || 'Failed to create payment intent',
    }
  }
})
