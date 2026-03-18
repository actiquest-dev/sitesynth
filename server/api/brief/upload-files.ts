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

// Helper to get or create user folder
async function getUserFolder(userEmail: string, driveClient: any) {
  try {
    const res = await driveClient.files.list({
      q: `name = '${userEmail}_Files' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      spaces: 'drive',
      fields: 'files(id, name)',
      pageSize: 1,
    })

    if (res.data.files && res.data.files.length > 0) {
      return res.data.files[0].id
    }

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
    const files = await readMultipartFormData(event)

    if (!files || files.length === 0) {
      throw new Error('No files provided')
    }

    const driveClient = await getDriveClient()
    const userFolderId = await getUserFolder(userEmail, driveClient)

    // Create a brief subfolder with timestamp
    const briefFolderRes = await driveClient.files.create({
      requestBody: {
        name: `Brief-${Date.now()}`,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [userFolderId],
        fields: 'id',
      },
    })
    const briefFolderId = briefFolderRes.data.id

    // Upload all files to the brief folder
    const uploadedFiles = []
    for (const file of files) {
      if (file.data) {
        try {
          const res = await driveClient.files.create({
            requestBody: {
              name: file.filename || 'file',
              parents: [briefFolderId],
              mimeType: file.type,
              fields: 'id, webViewLink, name',
            },
            media: {
              mimeType: file.type,
              body: file.data,
            },
          })

          uploadedFiles.push({
            id: res.data.id,
            name: res.data.name,
            url: res.data.webViewLink,
            mimeType: file.type,
          })
        } catch (e) {
          console.error(`Error uploading file ${file.filename}:`, e)
        }
      }
    }

    console.log(`[Brief Upload] Uploaded ${uploadedFiles.length} files for ${userEmail}`)

    return {
      success: true,
      folderId: briefFolderId,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    }
  } catch (error) {
    console.error('Error in file upload:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
