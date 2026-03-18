export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const userEmail = getHeader(event, 'x-user-email')

  if (!id || !userEmail) {
    return { success: false, error: 'Missing id or user email' }
  }

  if (event.method === 'GET') {
    // Get brief by ID
    try {
      const { data, error } = await useDatabaseClient()
        .from('briefs')
        .select('*')
        .eq('id', id)
        .eq('user_email', userEmail)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('[Briefs] Error fetching brief:', error)
      return { success: false, error: 'Failed to fetch brief' }
    }
  }

  if (event.method === 'PUT') {
    // Update brief
    try {
      const body = await readBody(event)
      const { content, name, description } = body

      const { data, error } = await useDatabaseClient()
        .from('briefs')
        .update({
          content: content || undefined,
          name: name || undefined,
          description: description || undefined,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_email', userEmail)
        .select()
        .single()

      if (error) throw error
      console.log(`[Briefs] Brief updated: ${id}`)
      return { success: true, data }
    } catch (error) {
      console.error('[Briefs] Error updating brief:', error)
      return { success: false, error: 'Failed to update brief' }
    }
  }

  if (event.method === 'DELETE') {
    // Delete brief
    try {
      const { error } = await useDatabaseClient()
        .from('briefs')
        .delete()
        .eq('id', id)
        .eq('user_email', userEmail)

      if (error) throw error
      console.log(`[Briefs] Brief deleted: ${id}`)
      return { success: true }
    } catch (error) {
      console.error('[Briefs] Error deleting brief:', error)
      return { success: false, error: 'Failed to delete brief' }
    }
  }

  return { success: false, error: 'Method not allowed' }
})
