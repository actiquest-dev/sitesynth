import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const req = event.node.req
  const userEmail = req.headers['x-user-email'] || ''

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

  try {
    // Get all files for user
    const { data: files, error: listError } = await supabase.storage
      .from('brief-files')
      .list(userEmail, {
        limit: 100,
        offset: 0,
      })

    if (listError) {
      throw listError
    }

    const filesWithContent: any[] = []

    // Read content of each file
    for (const file of files || []) {
      try {
        const { data: fileContent, error: readError } = await supabase.storage
          .from('brief-files')
          .download(`${userEmail}/${file.name}`)

        if (!readError && fileContent) {
          const text = await fileContent.text()
          filesWithContent.push({
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'unknown',
            content: text.substring(0, 5000), // Limit to 5000 chars to avoid huge payload
            uploadedAt: file.created_at,
          })
        }
      } catch (err) {
        console.warn(`Could not read file ${file.name}:`, err)
        // Continue with other files
      }
    }

    return {
      success: true,
      files: filesWithContent,
    }
  } catch (error) {
    console.error('Error fetching file contents:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch file contents',
    })
  }
})
