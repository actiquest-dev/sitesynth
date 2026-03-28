import { google } from 'googleapis'
import { readFileSync } from 'fs'

function resolveCredentials() {
  // Highest priority: key file on disk (avoids all env var escaping issues)
  if (process.env.GOOGLE_DRIVE_KEY_FILE) {
    return JSON.parse(readFileSync(process.env.GOOGLE_DRIVE_KEY_FILE, 'utf8'))
  }

  if (process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON)
  }

  throw new Error('Google Drive credentials not configured: set GOOGLE_DRIVE_KEY_FILE or GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON')
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
