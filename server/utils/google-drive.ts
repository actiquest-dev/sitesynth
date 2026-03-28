import { google } from 'googleapis'

function resolveCredentials() {
  if (process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON)
  }

  if (process.env.GOOGLE_DRIVE_PRIVATE_KEY && process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL) {
    return {
      type: 'service_account',
      project_id: 'sitesynth-llm',
      private_key_id: 'key',
      private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL,
      client_id: '1234567890',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
    }
  }

  throw new Error('Google Drive credentials not configured')
}

export async function getDriveClient(scope: string[] = ['https://www.googleapis.com/auth/drive']) {
  const auth = new google.auth.GoogleAuth({
    credentials: resolveCredentials(),
    scopes: scope,
  })

  return google.drive({
    version: 'v3',
    auth,
  })
}

export async function getOrCreateChildFolder(params: {
  driveClient: any
  parentId: string
  folderName: string
}) {
  const { driveClient, parentId, folderName } = params
  const escapedName = folderName.replace(/'/g, "\\'")

  const res = await driveClient.files.list({
    q: `name = '${escapedName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false and '${parentId}' in parents`,
    spaces: 'drive',
    fields: 'files(id, name)',
    pageSize: 1,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    corpora: 'allDrives',
  })

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id
  }

  const folderRes = await driveClient.files.create({
    requestBody: {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
    supportsAllDrives: true,
  })

  return folderRes.data.id
}

export async function getOrCreateUserRootFolder(userEmail: string, driveClient: any) {
  const sharedDriveId = process.env.GOOGLE_DRIVE_SHARED_DRIVE_ID
  if (!sharedDriveId) {
    throw new Error('GOOGLE_DRIVE_SHARED_DRIVE_ID environment variable is not set')
  }

  return getOrCreateChildFolder({
    driveClient,
    parentId: sharedDriveId,
    folderName: `${userEmail}_Files`,
  })
}
