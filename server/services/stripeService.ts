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
      const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY

      // Debug logging
      console.log('🔍 Stripe Key Debug:')
      console.log('  STRIPE_SECRET_KEY exists:', !!secretKey)
      console.log('  STRIPE_SECRET_KEY starts with sk_test:', secretKey?.startsWith('sk_test'))
      console.log('  STRIPE_PUBLISHABLE_KEY exists:', !!publishableKey)
      console.log('  STRIPE_PUBLISHABLE_KEY starts with pk_test:', publishableKey?.startsWith('pk_test'))

      if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not configured')
      }

      if (!secretKey.startsWith('sk_test') && !secretKey.startsWith('sk_live')) {
        console.error('❌ ERROR: STRIPE_SECRET_KEY does not look like a real Stripe secret key!')
        console.error('❌ Value:', secretKey)
        throw new Error('STRIPE_SECRET_KEY appears to be invalid (should start with sk_test or sk_live)')
      }

      this.stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16',
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
        // Save to Supabase after successful payment
        await this.savePaymentToSupabase(data, charge.id)

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

  // Save payment to Supabase
  static async savePaymentToSupabase(data: PaymentData, chargeId: string): Promise<void> {
    try {
      const SUPABASE_URL = process.env.SUPABASE_URL
      const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Supabase credentials not configured')
        return
      }

      console.log(`💾 Saving payment for ${data.email} to Supabase`)

      // 1. Create client record
      const clientRes = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          name: data.billingData.fullName,
          email: data.email,
          company: data.billingData.company || '',
          country: data.billingData.country,
          phone: '',
          notes: `Created on ${new Date().toISOString()}`,
        }),
      })

      let clientId: number | null = null
      if (clientRes.ok) {
        const clientData = await clientRes.json()
        clientId = clientData[0]?.id
        console.log('✅ Client saved to Supabase:', clientId)
      } else {
        const errorText = await clientRes.text()
        console.warn('⚠️ Failed to save client:', clientRes.status, errorText)
      }

      // 2. Create order record
      const orderRes = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          client_id: clientId,
          email: data.email,
          title: `Order from ${data.billingData.fullName}`,
          status: 'paid',
          amount: data.amount,
          currency: 'eur',
          stripe_charge_id: chargeId,
          payment_date: new Date().toISOString(),
          form_data: {
            intakeFormData: (data as any).intakeFormData,
            billingData: data.billingData,
            email: data.email,
            amount: data.amount,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (orderRes.ok) {
        const orderData = await orderRes.json()
        console.log('✅ Order saved to Supabase:', orderData[0]?.id)
      } else {
        const errorText = await orderRes.text()
        console.error('❌ Failed to save order to Supabase:', errorText)
      }
    } catch (error: any) {
      console.error('❌ Error saving payment to Supabase:', error.message)
    }
  }

  // Save payment to NocoBase (deprecated)
  static async savePaymentToNocoBase(data: PaymentData, chargeId: string): Promise<void> {
    try {
      const NOCO_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
      const NOCO_TOKEN = process.env.NOCO_TOKEN

      if (!NOCO_TOKEN) {
        console.error('❌ NOCO_TOKEN not configured - cannot save payment to NocoBase')
        return
      }

      console.log(`💾 Saving payment for ${data.email} to NocoBase at ${NOCO_URL}`)

      // 1. Create client record
      const clientPayload = {
        name: data.billingData.fullName,
        email: data.email,
        company: data.billingData.company || '',
        country: data.billingData.country,
        phone: '',
        notes: `Created on ${new Date().toISOString()}`,
      }

      let clientId: number | null = null
      try {
        const clientRes = await fetch(`${NOCO_URL}/api/clients:create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOCO_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientPayload),
        })

        if (clientRes.ok) {
          const clientData = await clientRes.json()
          clientId = clientData.data?.id
          console.log('✅ Client saved to NocoBase:', clientId)
        } else {
          const errorText = await clientRes.text()
          console.warn('⚠️ Failed to save client to NocoBase:', clientRes.status, errorText)
        }
      } catch (error: any) {
        console.warn('⚠️ Failed to save client to NocoBase:', error.message)
      }

      // 2. Create order record (with only fields that NocoBase knows about)
      // Note: client_id and form_data might not be available yet in NocoBase schema
      const orderPayload: any = {
        title: `Order from ${data.billingData.fullName}`,
        status: 'paid',
        amount: data.amount,
        currency: 'eur',
        stripe_charge_id: chargeId,
        payment_date: new Date().toISOString(),
      }

      // Try to add the advanced fields if available
      if (clientId) {
        orderPayload.client_id = clientId
      }
      
      // Store form_data as JSON string if possible
      // (might fail if field doesn't exist yet)
      const formDataJson = {
        intakeFormData: (data as any).intakeFormData,
        billingData: data.billingData,
        email: data.email,
        amount: data.amount,
        timestamp: new Date().toISOString(),
      }
      
      try {
        orderPayload.form_data = formDataJson
      } catch (e) {
        // field might not exist, that's ok
        console.warn('⚠️ form_data field not available')
      }

      const orderRes = await fetch(`${NOCO_URL}/api/orders:create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOCO_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      if (orderRes.ok) {
        const orderData = await orderRes.json()
        const orderId = orderData.data?.id
        console.log('✅ Order saved to NocoBase:', orderId)
        
        // If order was created successfully, try to update it with form_data
        if (orderId && formDataJson) {
          try {
            const updateRes = await fetch(`${NOCO_URL}/api/orders/${orderId}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${NOCO_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ form_data: formDataJson }),
            })
            
            if (updateRes.ok) {
              console.log('✅ Form data saved to order:', orderId)
            } else {
              console.warn('⚠️ Could not save form_data:', await updateRes.text())
              // As backup, log the form data for manual recovery
              console.log('💾 Form data backup:', JSON.stringify(formDataJson))
            }
          } catch (e: any) {
            console.warn('⚠️ Could not update order with form_data:', e.message)
            console.log('💾 Form data backup:', JSON.stringify(formDataJson))
          }
        }
      } else {
        const errorText = await orderRes.text()
        console.error('❌ Failed to save order to NocoBase:')
        console.error('  Status:', orderRes.status)
        console.error('  URL:', `${NOCO_URL}/api/orders:create`)
        console.error('  Response:', errorText)
        console.error('  Payload was:', JSON.stringify(orderPayload))
      }
    } catch (error: any) {
      console.error('❌ Error saving payment to NocoBase:', error.message)
      // Don't throw - payment was already processed in Stripe
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
      case 'charge.succeeded':
        console.log('✅ Charge succeeded:', event.data.object.id)
        // Update order status in NocoBase
        await this.updateOrderStatusInNocoBase(event.data.object.id, 'paid')
        return {
          success: true,
          message: 'Charge confirmed',
          chargeId: event.data.object.id,
        }

      case 'payment_intent.succeeded':
        console.log('✅ Payment succeeded:', event.data.object.id)
        return {
          success: true,
          message: 'Payment confirmed',
          intentId: event.data.object.id,
        }

      case 'charge.failed':
        console.log('❌ Charge failed:', event.data.object.id)
        // Update order status in NocoBase
        await this.updateOrderStatusInNocoBase(event.data.object.id, 'failed')
        return {
          success: false,
          message: 'Charge failed',
          chargeId: event.data.object.id,
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
        // Update order status in NocoBase
        await this.updateOrderStatusInNocoBase(event.data.object.id, 'refunded')
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

  // Update order status in NocoBase
  static async updateOrderStatusInNocoBase(chargeId: string, status: string): Promise<void> {
    try {
      const NOCO_URL = 'http://138.2.134.17:20000'
      const NOCO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJpYXQiOjE3NzIwMzU1NzcsImV4cCI6MzMzMjk2MzU1Nzd9.C1TJacEJ-qy4EVlL0r94l7anWSPhWsQwlOYzLsqooNk'

      // First, find order by stripe_charge_id
      const listRes = await fetch(`${NOCO_URL}/api/orders:list`, {
        headers: {
          'xc-auth': NOCO_TOKEN,
        },
      })

      if (!listRes.ok) {
        console.warn('Failed to fetch orders from NocoBase')
        return
      }

      const listData = await listRes.json()
      const orders = Array.isArray(listData.data) ? listData.data : listData
      const order = orders.find((o: any) => o.stripe_charge_id === chargeId)

      if (!order) {
        console.warn(`Order not found for charge ${chargeId}`)
        return
      }

      // Update order status
      const updateRes = await fetch(`${NOCO_URL}/api/orders:update?id=${order.id}`, {
        method: 'POST',
        headers: {
          'xc-auth': NOCO_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
        }),
      })

      if (updateRes.ok) {
        console.log(`✅ Order ${order.id} status updated to ${status}`)
      } else {
        console.warn(`Failed to update order ${order.id}:`, await updateRes.text())
      }
    } catch (error: any) {
      console.error('Error updating order status in NocoBase:', error.message)
    }
  }
}
