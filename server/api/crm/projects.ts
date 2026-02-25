import { useNocoBase } from '~/composables/useNocoBase'

/**
 * Get all projects for current user
 * GET /api/crm/projects
 */
export default defineEventHandler(async (event) => {
  try {
    const { getList } = useNocoBase()

    // Get all projects
    // TODO: Filter by current user ID when auth is implemented
    const projects = await getList('projects')

    return {
      success: true,
      data: projects,
      count: projects.length,
    }
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return {
      success: false,
      error: error.message || 'Failed to fetch projects',
    }
  }
})
