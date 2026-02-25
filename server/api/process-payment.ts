import { defineEventHandler, setResponseStatus, readBody } from 'h3'
import { StripeService } from '../services/stripeService'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { error: 'Method Not Allowed' }
  }

  return await StripeService.handlePaymentRequest(event)
})
