import { defineEventHandler, setResponseStatus, readRawBody, getHeader } from 'h3'
import { StripeService } from '../../services/stripeService'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { error: 'Method Not Allowed' }
  }

  try {
    // Get raw body for signature verification
    const body = await readRawBody(event)
    if (!body) {
      setResponseStatus(event, 400)
      return { error: 'Missing request body' }
    }

    const signature = getHeader(event, 'stripe-signature')
    if (!signature) {
      setResponseStatus(event, 400)
      return { error: 'Missing Stripe signature' }
    }

    // Verify webhook signature
    const stripeEvent = StripeService.verifyWebhookSignature(body, signature)

    // Handle the event
    const result = await StripeService.handleWebhookEvent(stripeEvent)

    // Always return 200 to acknowledge receipt
    setResponseStatus(event, 200)
    return result
  } catch (error: any) {
    console.error('Webhook error:', error)
    setResponseStatus(event, 400)
    return {
      error: error.message || 'Webhook processing failed',
    }
  }
})
