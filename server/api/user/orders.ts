import { defineEventHandler, readBody, getHeader } from 'h3'

/**
 * GET /api/user/orders
 * Returns orders for the authenticated user only
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
      }
    }

    if (!userEmail) {
      setResponseStatus(event, 401)
      return {
        success: false,
        error: 'Invalid token format',
      }
    }

    // Fetch all orders from NocoBase
    const NOCO_BASE_URL = process.env.NOCO_BASE_URL || 'http://138.2.134.17:20000'
    const NOCO_TOKEN = process.env.NOCO_TOKEN

    if (!NOCO_TOKEN) {
      console.error('NOCO_TOKEN not configured in environment')
      setResponseStatus(event, 500)
      return {
        success: false,
        error: 'Server configuration error',
      }
    }

    const response = await fetch(`${NOCO_BASE_URL}/api/orders:list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'xc-auth': NOCO_TOKEN,
      },
    })

    if (!response.ok) {
      console.error('NocoBase fetch error:', response.status)
      setResponseStatus(event, 500)
      return {
        success: false,
        error: 'Failed to fetch orders',
      }
    }

    const data = await response.json()
    const allOrders = data?.data || data || []

    // Filter orders by user email (server-side)
    const userOrders = allOrders.filter((order: any) => {
      const formData = typeof order.form_data === 'string'
        ? JSON.parse(order.form_data)
        : order.form_data
      return formData?.email === userEmail || order.email === userEmail
    })

    console.log(`📦 Fetched ${userOrders.length} orders for ${userEmail}`)

    return {
      success: true,
      data: userOrders,
    }
  } catch (error: any) {
    console.error('Error fetching user orders:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message || 'Failed to fetch orders',
    }
  }
})
