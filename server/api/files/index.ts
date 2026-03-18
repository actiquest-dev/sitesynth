import { google } from 'googleapis'

const drive = google.drive('v3')

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
    scopes: ['https://www.googleapis.com/auth/drive'],
  })

  return google.drive({
    version: 'v3',
    auth,
  })
}

// Helper to get or create user folder in shared drive
async function getUserFolder(userEmail: string, driveClient: any) {
  if (!process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID) {
    throw new Error('GOOGLE_DRIVE_SHARED_DRIVE_ID environment variable is not set. Use a Shared Drive instead of Service Account Drive.')
  }

  const sharedDriveId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID

  try {
    // Search for existing folder in shared drive
    const res = await driveClient.files.list({
      q: `name = '${userEmail}_Files' and mimeType = 'application/vnd.google-apps.folder' and trashed = false and '${sharedDriveId}' in parents`,
      spaces: 'drive',
      fields: 'files(id, name)',
      pageSize: 1,
      corpora: 'drive',
      driveId: sharedDriveId,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    })

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id
    }

    // Create new folder in shared drive if doesn't exist
    const folderRes = await driveClient.files.create({
      requestBody: {
        name: `${userEmail}_Files`,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [sharedDriveId],
        fields: 'id',
      },
      supportsAllDrives: true,
    })

    return folderRes.data.id
  } catch (error) {
    console.error('Error managing user folder in shared drive:', error)
    throw error
  }
}

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email') || ''
  const method = event.node.req.method

  if (!userEmail) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const driveClient = await getDriveClient()

  // DELETE - Remove file from Google Drive (doesn't need user folder)
  if (method === 'DELETE') {
    try {
      const { fileId } = await readBody(event)

      if (!fileId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'File ID required',
        })
      }

      await driveClient.files.delete({
        fileId: fileId,
        supportsAllDrives: true,
      })

      return {
        success: true,
        message: 'File deleted',
      }
    } catch (error: any) {
      console.error('Error deleting file from Google Drive:', error?.message || error)
      throw createError({
        statusCode: 500,
        statusMessage: error?.message || 'Failed to delete file',
      })
    }
  }

  // GET - List user files from Google Drive
  if (method === 'GET') {
    try {
      const userFolderId = await getUserFolder(userEmail, driveClient)

      const res = await driveClient.files.list({
        q: `'${userFolderId}' in parents and trashed = false`,
        spaces: 'drive',
        fields: 'files(id, name, size, createdTime, mimeType, webViewLink)',
        pageSize: 100,
        orderBy: 'createdTime desc',
        includeItemsFromAllDrives: true,
        supportsAllDrives: true,
      })

      const files = (res.data.files || []).map((file: any) => ({
        id: file.id,
        name: file.name,
        size: file.size || 0,
        uploadedAt: file.createdTime,
        mimeType: file.mimeType,
        url: file.webViewLink,
      }))

      return {
        success: true,
        data: files,
      }
    } catch (error: any) {
      console.error('Error listing files from Google Drive:', error?.message || error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to list files',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
