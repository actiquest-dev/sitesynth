import { defineEventHandler, readFormData, getHeader } from 'h3'
import { google } from 'googleapis'
import * as fs from 'fs'

interface ClientData {
  email: string
  name?: string
}

/**
 * POST /api/upload
 * Uploads a file to Google Drive in client's folder
 * Request: multipart/form-data with file, clientEmail, and clientName
 */
export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    
    const file = formData.get('file') as File
    const clientEmail = (formData.get('clientEmail') as string) || ''
    const clientName = (formData.get('clientName') as string) || 'Unknown'
    
    if (!file) {
      return {
        success: false,
        error: 'No file provided',
      }
    }

    if (!clientEmail) {
      return {
        success: false,
        error: 'Client email required',
      }
    }

    const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_EMAIL
    const PRIVATE_KEY = process.env.GOOGLE_DRIVE_PRIVATE_KEY

    if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
      console.error('❌ Google Drive credentials not configured')
      return {
        success: false,
        error: 'Server configuration error',
      }
    }

    // Initialize Google Drive API
    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive'],
    })

    const drive = google.drive({ version: 'v3', auth })

    console.log(`\n📤 Uploading to Google Drive:`)
    console.log(`  Client: ${clientEmail} (${clientName})`)
    console.log(`  File: ${file.name}`)
    console.log(`  Size: ${file.size} bytes`)

    // Find or create client folder
    const clientFolderName = `${clientName} (${clientEmail})`
    let clientFolderId: string

    try {
      // Search for existing folder
      const folderSearch = await drive.files.list({
        q: `name='${clientFolderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        spaces: 'drive',
        fields: 'files(id, name)',
        pageSize: 1,
      })

      if (folderSearch.data.files && folderSearch.data.files.length > 0) {
        clientFolderId = folderSearch.data.files[0].id!
        console.log(`  📁 Found existing folder: ${clientFolderId}`)
      } else {
        // Create new folder
        const folderRes = await drive.files.create({
          requestBody: {
            name: clientFolderName,
            mimeType: 'application/vnd.google-apps.folder',
            description: `Files for client ${clientEmail}`,
          },
          fields: 'id',
        })

        clientFolderId = folderRes.data.id!
        console.log(`  📁 Created new folder: ${clientFolderId}`)

        // Share folder with client email
        try {
          await drive.permissions.create({
            fileId: clientFolderId,
            requestBody: {
              role: 'reader',
              type: 'user',
              emailAddress: clientEmail,
            },
          })
          console.log(`  ✅ Shared folder with ${clientEmail}`)
        } catch (shareError: any) {
          console.log(`  ⚠️  Could not share folder (client might not accept): ${shareError.message}`)
        }
      }
    } catch (folderError: any) {
      console.error(`  ❌ Error creating/finding folder: ${folderError.message}`)
      return {
        success: false,
        error: 'Failed to create client folder',
      }
    }

    // Upload file to client folder
    try {
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(7)
      const originalName = file.name.split('.').slice(0, -1).join('.')
      const ext = file.name.split('.').pop()
      const fileName = `${originalName}-${timestamp}-${random}.${ext}`

      const buffer = await file.arrayBuffer()

      const uploadRes = await drive.files.create({
        requestBody: {
          name: fileName,
          mimeType: file.type,
          parents: [clientFolderId],
        },
        media: {
          mimeType: file.type,
          body: Buffer.from(buffer),
        },
        fields: 'id, webViewLink, webContentLink',
      })

      const fileId = uploadRes.data.id!
      const viewLink = uploadRes.data.webViewLink!
      const downloadLink = uploadRes.data.webContentLink!

      console.log(`  ✅ File uploaded: ${fileId}`)
      console.log(`  🔗 View: ${viewLink}`)

      return {
        success: true,
        fileId,
        fileName,
        folder: clientFolderId,
        viewLink,
        downloadLink,
        clientEmail,
      }
    } catch (uploadError: any) {
      console.error(`  ❌ Upload failed: ${uploadError.message}`)
      return {
        success: false,
        error: 'Failed to upload file',
      }
    }
  } catch (error: any) {
    console.error('❌ Upload error:', error)
    return {
      success: false,
      error: error.message || 'Upload failed',
    }
  }
})
