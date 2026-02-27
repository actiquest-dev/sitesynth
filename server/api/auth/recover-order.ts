import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { createClient } from '@supabase/supabase-js'

interface RecoverOrderRequest {
  email: string
}

interface RecoverOrderResponse {
  success: boolean
  message: string
  data?: {
    email: string
    chargeId: string
    amount: number
    currency: string
    createdAt: string
    billingInfo?: any
  }
  error?: string
}

export default defineEventHandler(async (event): Promise<RecoverOrderResponse> => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { success: false, message: 'Method Not Allowed', error: 'Method Not Allowed' }
  }

  try {
    const body = await readBody<RecoverOrderRequest>(event)
    let { email } = body
    email = email.trim().toLowerCase()

    if (!email) {
      setResponseStatus(event, 400)
      return {
        success: false,
        message: 'Email is required',
        error: 'Email is required',
      }
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )

    console.log(`🔍 Recovering order for email: ${email}`)

    // Find user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single()

    if (userError || !userData) {
      console.log(`⚠️  No user found for email: ${email}`)
      setResponseStatus(event, 404)
      return {
        success: false,
        message: `No account found for ${email}. Please sign up first.`,
        error: 'User not found',
      }
    }

    // Get the latest order for this user
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select(
        `
        id,
        stripe_charge_id,
        amount,
        currency,
        status,
        created_at,
        billing_info (
          full_name,
          street,
          city,
          postal,
          country,
          company
        )
      `
      )
      .eq('user_id', userData.id)
      .eq('status', 'succeeded')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (orderError || !orderData) {
      console.log(`⚠️  No completed orders found for ${email}`)
      setResponseStatus(event, 404)
      return {
        success: false,
        message: `No completed orders found for ${email}. Please check your email or contact support.`,
        error: 'No orders found',
      }
    }

    console.log(`✅ Order recovered for ${email}: ${orderData.stripe_charge_id}`)

    return {
      success: true,
      message: `Order found! Welcome back, ${email}`,
      data: {
        email: userData.email,
        chargeId: orderData.stripe_charge_id,
        amount: orderData.amount,
        currency: orderData.currency,
        createdAt: orderData.created_at,
        billingInfo: orderData.billing_info?.[0],
      },
    }
  } catch (error: any) {
    console.error('❌ Recover order error:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      message: 'Failed to recover order',
      error: error.message,
    }
  }
})
