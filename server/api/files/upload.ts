import { google } from 'googleapis'

// Helper to get authenticated Drive client
async function getDriveClient() {
  let credentials

  // Try to use JSON if available (preferred method)
  if (process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON) {
    try {
      credentials = JSON.parse(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON)
    } catch (e) {
      console.error('Failed to parse GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON:', e)
      throw new Error('Invalid GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON format')
    }
  } else if (process.env.GOOGLE_DRIVE_PRIVATE_KEY && process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL) {
    // Fallback to separate environment variables
    credentials = {
      type: 'service_account',
      project_id: 'sitesynth-llm',
      private_key_id: 'key',
      private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY,
      client_email: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
      client_id: '1234567890',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    }
  } else {
    throw new Error('Google Drive credentials not configured. Set GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON or GOOGLE_DRIVE_PRIVATE_KEY + GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL')
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })

  return google.drive({
    version: 'v3',
    auth,
  })
}

// Helper to get or create user folder in Google Drive
async function getUserFolder(userEmail: string, driveClient: any) {
  try {
    // Search for existing folder
    const res = await driveClient.files.list({
      q: `name = '${userEmail}_Files' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      spaces: 'drive',
      fields: 'files(id, name)',
      pageSize: 1,
    })

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id
    }

    // Create new folder if doesn't exist
    const folderRes = await driveClient.files.create({
      requestBody: {
        name: `${userEmail}_Files`,
        mimeType: 'application/vnd.google-apps.folder',
        fields: 'id',
      },
    })

    return folderRes.data.id
  } catch (error) {
    console.error('Error managing user folder:', error)
    throw error
  }
}

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email') || ''

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

    const driveClient = await getDriveClient()
    const userFolderId = await getUserFolder(userEmail, driveClient)

    // Upload file to Google Drive in user folder
    const response = await driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileField.type || 'application/octet-stream',
        parents: [userFolderId],
        fields: 'id, name, size, webViewLink, mimeType',
      },
      media: {
        mimeType: fileField.type || 'application/octet-stream',
        body: fileBuffer,
      },
    })

    console.log(`[Files] Uploaded: ${fileName} (${fileBuffer.length} bytes)`)

    return {
      success: true,
      file: {
        id: response.data.id,
        name: response.data.name,
        size: response.data.size,
        url: response.data.webViewLink,
        mimeType: response.data.mimeType,
        uploadedAt: new Date().toISOString(),
      },
    }
  } catch (error: any) {
    console.error('Upload error:', error?.message || String(error))
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'File upload failed',
    })
  }
})
