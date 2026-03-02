import { defineEventHandler, readBody, createError, setResponseStatus } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  try {
    const body = await readBody(event)

    if (!body.email || !body.orderNumber || !body.amount) {
      return createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    // Save order to Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          email: body.email,
          full_name: body.fullName,
          order_number: body.orderNumber,
          charge_id: body.chargeId,
          amount: body.amount,
          currency: body.currency || 'USD',
          payment_method: body.paymentMethod,
          status: 'completed',
          form_data: body.formData || {},
        },
      ])
      .select()

    if (error) {
      console.error('❌ Error saving order to Supabase:', error)
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    console.log('✅ Order saved to Supabase:', data)

    return {
      success: true,
      order: data?.[0],
    }
  } catch (err: any) {
    console.error('❌ Error in save-order endpoint:', err)
    return createError({ statusCode: 500, statusMessage: err.message })
  }
})
