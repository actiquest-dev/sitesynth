import { defineEventHandler, setResponseStatus, getHeader } from 'h3'

/**
 * GET /api/user/orders
 * Returns orders for the authenticated user from Supabase
 * Filters by user email from auth token (server-side)
 */
export default defineEventHandler(async (event) => {
  try {
    // Get auth token from Authorization header
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

    // Decode the auth token to get user email
    // Token format: base64(email:timestamp)
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

    // Fetch orders from Supabase
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase credentials not configured')
      setResponseStatus(event, 500)
      return {
        success: false,
        error: 'Server configuration error',
        data: [],
      }
    }

    console.log(`\n📋 Fetching orders for user: ${userEmail}`)

    // First, get ALL orders to see what's in the database
    const allOrdersResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?limit=100`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    )

    if (allOrdersResponse.ok) {
      const allOrders = await allOrdersResponse.json()
      console.log(`🔍 Total orders in DB: ${allOrders.length}`)
      if (allOrders.length > 0) {
        console.log(`📊 Sample orders:`)
        allOrders.slice(0, 3).forEach((order: any, idx: number) => {
          console.log(`  [${idx}] email="${order.email}", title="${order.title}", amount=${order.amount}`)
        })
      }
    }

    // Now fetch orders filtered by email
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?email=eq.${encodeURIComponent(userEmail)}&order=payment_date.desc&limit=100`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Supabase fetch error:')
      console.error('  Status:', response.status)
      console.error('  URL:', `${SUPABASE_URL}/rest/v1/orders`)
      console.error('  Response:', errorText)
      setResponseStatus(event, 500)
      return {
        success: false,
        error: `Failed to fetch orders: ${response.status}`,
        data: [],
      }
    }

    const userOrders = await response.json()
    console.log(`✅ Fetched ${userOrders.length} orders for ${userEmail}`)
    if (userOrders.length > 0) {
      console.log(`📦 Your orders:`)
      userOrders.forEach((order: any, idx: number) => {
        console.log(`  [${idx}] ${order.title} - €${order.amount} (${order.status})`)
      })
    } else {
      console.log(`⚠️  No orders found for email: ${userEmail}`)
    }
    console.log(``)

    return {
      success: true,
      data: userOrders,
    }
  } catch (error: any) {
    console.error('❌ Error fetching user orders:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message || 'Failed to fetch orders',
      data: [],
    }
  }
})
