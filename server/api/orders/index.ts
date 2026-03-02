import { defineEventHandler, getHeader, createError, setResponseStatus } from 'h3'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials')
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'GET') {
    return createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  try {
    // Get email from Authorization header
    const authHeader = getHeader(event, 'authorization')
    const authToken = authHeader?.replace('Bearer ', '')

    if (!authToken) {
      setResponseStatus(event, 401)
      return {
        success: false,
        error: 'Authentication required',
        data: [],
      }
    }

    // Decode auth token to get user email
    let userEmail: string
    try {
      const decoded = Buffer.from(authToken, 'base64').toString('utf-8')
      userEmail = decoded.split(':')[0]
    } catch (e) {
      setResponseStatus(event, 401)
      return {
        success: false,
        error: 'Invalid auth token',
        data: [],
      }
    }

    if (!userEmail) {
      setResponseStatus(event, 401)
      return {
        success: false,
        error: 'Invalid token format',
        data: [],
      }
    }

    // Fetch user's orders from Supabase
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('email', userEmail)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching orders:', error)
      return createError({ statusCode: 500, statusMessage: error.message })
    }

    console.log(`✅ Fetched ${data?.length || 0} orders for ${userEmail}`)

    return {
      success: true,
      data: data || [],
    }
  } catch (error: any) {
    console.error('❌ Error in get-orders endpoint:', error)
    return createError({ statusCode: 500, statusMessage: error.message })
  }
})
