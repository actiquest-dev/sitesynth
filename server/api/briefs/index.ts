export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email')

  if (!userEmail) {
    return { success: false, error: 'Missing user email' }
  }

  if (event.method === 'GET') {
    // Get all briefs for user
    try {
      const { data, error } = await useDatabaseClient()
        .from('briefs')
        .select('*')
        .eq('user_email', userEmail)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('[Briefs] Error fetching briefs:', error)
      return { success: true, data: [] } // Return empty array on error
    }
  }

  if (event.method === 'POST') {
    // Create new brief
    try {
      const body = await readBody(event)
      const { name, description, content } = body

      const { data, error } = await useDatabaseClient()
        .from('briefs')
        .insert([{
          user_email: userEmail,
          name: name || 'Untitled Brief',
          description: description || '',
          content: content || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()

      if (error) throw error
      console.log(`[Briefs] Brief created for ${userEmail}`)
      return { success: true, data: data?.[0] || null }
    } catch (error) {
      console.error('[Briefs] Error creating brief:', error)
      return { success: false, error: 'Failed to create brief' }
    }
  }

  return { success: false, error: 'Method not allowed' }
})
