import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const req = event.node.req as any
  const userEmail = req.headers['x-user-email']

  if (!userEmail) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  try {
    // Parse form data
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file provided',
      })
    }

    const fileField = formData.find((f) => f.name === 'file')
    if (!fileField) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file found',
      })
    }

    const fileName = fileField.filename || `upload_${Date.now()}`
    const fileBuffer = fileField.data
    const filePath = `${userEmail}/${Date.now()}_${fileName}`

    // Upload to Supabase
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase credentials missing',
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('brief-files')
      .upload(filePath, fileBuffer, {
        contentType: fileField.type || 'application/octet-stream',
      })

    if (error) {
      console.error('Supabase upload error:', JSON.stringify(error))
      throw createError({
        statusCode: 500,
        statusMessage: `File upload failed: ${error.message || 'Unknown error'}`,
      })
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from('brief-files')
      .getPublicUrl(filePath)

    return {
      success: true,
      file: {
        id: data?.path,
        name: fileName,
        path: filePath,
        url: publicUrl?.publicUrl,
        uploadedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    console.error('Upload error:', error?.message || String(error))
    if (!error?.statusCode) {
      throw createError({
        statusCode: 500,
        statusMessage: error?.message || 'File upload failed',
      })
    }
    throw error
  }
})
