import { google } from 'googleapis'

async function getDriveClient() {
  let credentials

  if (process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON) {
    try {
      credentials = JSON.parse(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON)
    } catch (e) {
      console.error('Failed to parse GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON:', e)
      throw new Error('Invalid GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON format')
    }
  } else if (process.env.GOOGLE_DRIVE_PRIVATE_KEY && process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL) {
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
    throw new Error('Google Drive credentials not configured')
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })

  return { drive: google.drive({ version: 'v3', auth }), auth }
}

async function getUserFolder(userEmail: string, driveClient: any) {
  const sharedDriveId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID
  if (!sharedDriveId) {
    throw new Error('GOOGLE_DRIVE_SHARED_DRIVE_ID not set')
  }

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

  const folderRes = await driveClient.files.create({
    requestBody: {
      name: `${userEmail}_Files`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [sharedDriveId],
    },
    fields: 'id',
    supportsAllDrives: true,
  })

  return folderRes.data.id
}

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email') || ''
  if (!userEmail) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { fileName, mimeType, fileSize, briefMode } = body
  const origin = getHeader(event, 'origin') || getHeader(event, 'referer')?.replace(/\/[^/]*$/, '') || '*'

  if (!fileName) {
    throw createError({ statusCode: 400, statusMessage: 'fileName required' })
  }

  try {
    const { drive: driveClient, auth } = await getDriveClient()
    const userFolderId = await getUserFolder(userEmail, driveClient)

    let targetFolderId = userFolderId

    // If briefMode, create a brief subfolder
    if (briefMode) {
      const briefFolderRes = await driveClient.files.create({
        requestBody: {
          name: `Brief-${Date.now()}`,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [userFolderId],
        },
        fields: 'id',
        supportsAllDrives: true,
      })
      targetFolderId = briefFolderRes.data.id
    }

    // Get access token for direct API call
    const authClient = await auth.getClient()
    const tokenResponse = await authClient.getAccessToken()
    const accessToken = tokenResponse.token

    // Create resumable upload session via Google Drive API
    const metadata = JSON.stringify({
      name: fileName,
      parents: [targetFolderId],
    })

    const initResponse = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': mimeType || 'application/octet-stream',
          'Origin': origin,
          ...(fileSize ? { 'X-Upload-Content-Length': String(fileSize) } : {}),
        },
        body: metadata,
      }
    )

    if (!initResponse.ok) {
      const errorText = await initResponse.text()
      console.error('[Upload URL] Failed to create resumable session:', errorText)
      throw new Error(`Failed to create upload session: ${initResponse.status}`)
    }

    const uploadUrl = initResponse.headers.get('Location')
    if (!uploadUrl) {
      throw new Error('No upload URL returned from Google Drive')
    }

    console.log(`[Upload URL] Created for ${fileName} in folder ${targetFolderId}`)

    return {
      uploadUrl,
      folderId: targetFolderId,
    }
  } catch (error: any) {
    console.error('[Upload URL] Error:', error?.message || String(error))
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to create upload URL',
    })
  }
})
