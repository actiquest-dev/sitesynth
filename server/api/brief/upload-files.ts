import { google } from 'googleapis'

const drive = google.drive('v3')

export default defineEventHandler(async (event) => {
  try {
    const files = await readMultipartFormData(event)

    if (!files || files.length === 0) {
      throw new Error('No files provided')
    }

    // Initialize Google Drive client with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: 'sitesynth-llm',
        private_key_id: 'key',
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
        client_id: '1234567890',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    })

    const driveClient = google.drive({
      version: 'v3',
      auth,
    })

    // Create a folder for this brief if it doesn't exist
    let briefFolderId: string | null = null
    try {
      const folderRes = await driveClient.files.create({
        requestBody: {
          name: `Brief-${Date.now()}`,
          mimeType: 'application/vnd.google-apps.folder',
          fields: 'id',
        },
      })
      briefFolderId = folderRes.data.id || null
    } catch (e) {
      console.warn('Could not create Drive folder:', e)
    }

    // Upload files
    const uploadedFiles = []
    for (const file of files) {
      if (file.data) {
        try {
          const res = await driveClient.files.create({
            requestBody: {
              name: file.filename || 'file',
              parents: briefFolderId ? [briefFolderId] : undefined,
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

    return {
      success: true,
      folderId: briefFolderId,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s) to Google Drive`,
    }
  } catch (error) {
    console.error('Error in file upload:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})
