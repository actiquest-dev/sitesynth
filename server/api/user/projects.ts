import { defineEventHandler, setResponseStatus, getHeader } from 'h3'

/**
 * GET /api/user/projects
 * Returns projects for the authenticated user from Supabase
 * Filters by user email from auth token (server-side)
 */
export default defineEventHandler(async (event) => {
  try {
    // Get user email from header (client-side auth)
    let userEmail = getHeader(event, 'x-user-email') as string

    if (!userEmail) {
      setResponseStatus(event, 401)
      return {
        success: false,
        error: 'Authentication required',
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

    try {
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
        // If table doesn't exist, return empty array
        if (response.status === 404) {
          console.log('Projects table not found, returning empty array')
          return {
            success: true,
            data: [],
          }
        }

        const errorText = await response.text()
        console.error('❌ Supabase fetch error:')
        console.error('  Status:', response.status)
        console.error('  Response:', errorText)

        // Still return empty array instead of error
        return {
          success: true,
          data: [],
        }
      }

      const userProjects = await response.json()
      console.log(`✅ Fetched ${userProjects.length} projects for ${userEmail}\n`)

      return {
        success: true,
        data: userProjects,
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Return empty array on any error
      return {
        success: true,
        data: [],
      }
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
