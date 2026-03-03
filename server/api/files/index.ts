import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const req = event.node.req
  const userEmail = req.headers['x-user-email'] || ''
  const method = event.node.req.method

  if (!userEmail) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase credentials missing',
    })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // GET - List user files
  if (method === 'GET') {
    try {
      const { data, error } = await supabase.storage
        .from('brief-files')
        .list(userEmail, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'updated_at', order: 'desc' },
        })

      if (error) {
        console.error('Supabase list error:', error)
        throw error
      }

      const files = (data || []).map((file) => {
        const { data: publicData } = supabase.storage
          .from('brief-files')
          .getPublicUrl(`${userEmail}/${file.name}`)

        return {
          id: file.id,
          name: file.name,
          path: `${userEmail}/${file.name}`,
          url: publicData?.publicUrl,
          size: file.metadata?.size || 0,
          uploadedAt: file.created_at,
        }
      })

      return {
        success: true,
        data: files,
      }
    } catch (error) {
      console.error('Error listing files:', error)
      throw error
    }
  }

  // DELETE - Remove file
  if (method === 'DELETE') {
    try {
      const { fileId } = await readBody(event)

      if (!fileId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'File ID required',
        })
      }

      const { error } = await supabase.storage
        .from('brief-files')
        .remove([fileId])

      if (error) {
        throw error
      }

      return {
        success: true,
        message: 'File deleted',
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
