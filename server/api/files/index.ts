import { google } from 'googleapis'

const drive = google.drive('v3')

// Helper to get authenticated Drive client
async function getDriveClient() {
  if (!process.env.GOOGLE_DRIVE_PRIVATE_KEY) {
    throw new Error('GOOGLE_DRIVE_PRIVATE_KEY environment variable is not set')
  }
  if (!process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL environment variable is not set')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: 'sitesynth-llm',
      private_key_id: 'key',
      private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
      client_id: '1234567890',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    },
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
  const method = event.node.req.method

  if (!userEmail) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const driveClient = await getDriveClient()
  const userFolderId = await getUserFolder(userEmail, driveClient)

  // GET - List user files from Google Drive
  if (method === 'GET') {
    try {
      const res = await driveClient.files.list({
        q: `'${userFolderId}' in parents and trashed = false`,
        spaces: 'drive',
        fields: 'files(id, name, size, createdTime, mimeType, webViewLink)',
        pageSize: 100,
        orderBy: 'createdTime desc',
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
    } catch (error) {
      console.error('Error listing files from Google Drive:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to list files',
      })
    }
  }

  // DELETE - Remove file from Google Drive
  if (method === 'DELETE') {
    try {
      const { fileId } = await readBody(event)

      if (!fileId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'File ID required',
        })
      }

      // Delete the file from Google Drive
      await driveClient.files.delete({
        fileId: fileId,
      })

      return {
        success: true,
        message: 'File deleted',
      }
    } catch (error) {
      console.error('Error deleting file from Google Drive:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete file',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
