import type { H3Event } from 'h3'
import { readBody, setResponseStatus } from 'h3'
import Stripe from 'stripe'

export interface PaymentData {
  token: string
  amount: number
  email: string
  billingData: {
    fullName: string
    street: string
    apartment?: string
    city: string
    postal: string
    country: string
    company?: string
  }
}

export interface PaymentResponse {
  success: boolean
  message: string
  chargeId?: string
  error?: string
  details?: any
}

export class StripeService {
  private static stripe: Stripe | null = null

  static getStripeClient(): Stripe {
    if (!this.stripe) {
      const secretKey = process.env.STRIPE_SECRET_KEY
      if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not configured')
      }
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2024-11-20',
      })
    }
    return this.stripe
  }

  // Validate payment data
  static validatePaymentData(data: any): string | null {
    const { token, amount, email, billingData } = data

    if (!token) {
      return 'Payment token is required'
    }

    if (!amount || amount <= 0) {
      return 'Valid amount is required'
    }

    if (!email) {
      return 'Email is required'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Invalid email format'
    }

    if (!billingData || !billingData.fullName || !billingData.street || !billingData.city || !billingData.postal || !billingData.country) {
      return 'Complete billing information is required'
    }

    return null
  }

  // Create payment intent
  static async createPaymentIntent(
    amount: number,
    email: string,
    description: string = 'SiteSynth Payment'
  ): Promise<any> {
    const stripe = this.getStripeClient()

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'eur',
        description,
        receipt_email: email,
        metadata: {
          email,
          service: 'Growth Plan',
        },
      })

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        intentId: paymentIntent.id,
      }
    } catch (error: any) {
      console.error('Error creating payment intent:', error)
      return {
        success: false,
        error: error.message || 'Failed to create payment intent',
      }
    }
  }

  // Confirm and process payment
  static async processPayment(data: PaymentData): Promise<PaymentResponse> {
    const stripe = this.getStripeClient()

    try {
      // Create charge with token
      const charge = await stripe.charges.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: 'eur',
        source: data.token,
        description: `Payment for ${data.billingData.fullName}`,
        receipt_email: data.email,
        metadata: {
          fullName: data.billingData.fullName,
          email: data.email,
          street: data.billingData.street,
          city: data.billingData.city,
          postal: data.billingData.postal,
          country: data.billingData.country,
          company: data.billingData.company || 'N/A',
        },
      })

      if (charge.status === 'succeeded') {
        return {
          success: true,
          message: 'Payment processed successfully',
          chargeId: charge.id,
        }
      } else {
        return {
          success: false,
          message: 'Payment failed',
          error: `Charge status: ${charge.status}`,
        }
      }
    } catch (error: any) {
      console.error('Stripe payment error:', error)

      return {
        success: false,
        message: 'Payment processing failed',
        error: error.message || 'Unknown error',
        details: error.type,
      }
    }
  }

  // Handle payment API request
  static async handlePaymentRequest(event: H3Event): Promise<PaymentResponse> {
    try {
      const body = await readBody(event)

      // Validate input
      const validationError = this.validatePaymentData(body)
      if (validationError) {
        setResponseStatus(event, 400)
        return {
          success: false,
          message: validationError,
          error: validationError,
        }
      }

      // Process payment
      const result = await this.processPayment(body as PaymentData)

      if (!result.success) {
        setResponseStatus(event, 400)
      }

      return result
    } catch (error: any) {
      console.error('Payment API error:', error)
      setResponseStatus(event, 500)

      return {
        success: false,
        message: 'Internal server error',
        error: 'Internal server error',
        details: error.message,
      }
    }
  }

  // Create setup intent for recurring payments
  static async createSetupIntent(email: string): Promise<any> {
    const stripe = this.getStripeClient()

    try {
      const setupIntent = await stripe.setupIntents.create({
        confirm: false,
        payment_method_types: ['card'],
        metadata: {
          email,
        },
      })

      return {
        success: true,
        clientSecret: setupIntent.client_secret,
      }
    } catch (error: any) {
      console.error('Error creating setup intent:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  // Verify webhook signature
  static verifyWebhookSignature(body: string, signature: string): any {
    const stripe = this.getStripeClient()
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
    }

    try {
      const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      return event
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error)
      throw error
    }
  }

  // Handle webhook events
  static async handleWebhookEvent(event: any): Promise<any> {
    const stripe = this.getStripeClient()

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('✅ Payment succeeded:', event.data.object.id)
        return {
          success: true,
          message: 'Payment confirmed',
          intentId: event.data.object.id,
        }

      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id)
        return {
          success: false,
          message: 'Payment failed',
          intentId: event.data.object.id,
        }

      case 'charge.refunded':
        console.log('💰 Charge refunded:', event.data.object.id)
        return {
          success: true,
          message: 'Charge refunded',
          chargeId: event.data.object.id,
        }

      default:
        console.log('⚠️ Unhandled event type:', event.type)
        return { message: 'Event received but not processed' }
    }
  }
}
