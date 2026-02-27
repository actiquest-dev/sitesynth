import { defineEventHandler, setResponseStatus, getHeader } from 'h3'

/**
 * GET /api/user/projects
 * Returns projects for the authenticated user from Supabase
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

    // Fetch projects from Supabase
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

    console.log(`\n📁 Fetching projects for user: ${userEmail}`)

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/projects?email=eq.${encodeURIComponent(userEmail)}&order=created_at.desc&limit=100`,
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
      console.error('  URL:', `${SUPABASE_URL}/rest/v1/projects`)
      console.error('  Response:', errorText)
      setResponseStatus(event, 500)
      return {
        success: false,
        error: `Failed to fetch projects: ${response.status}`,
        data: [],
      }
    }

    const userProjects = await response.json()
    console.log(`✅ Fetched ${userProjects.length} projects for ${userEmail}\n`)

    return {
      success: true,
      data: userProjects,
    }
  } catch (error: any) {
    console.error('❌ Error fetching user projects:', error)
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message || 'Failed to fetch projects',
      data: [],
    }
  }
})
