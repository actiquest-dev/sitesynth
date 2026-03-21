import { defineEventHandler, getHeader, readBody, createError } from 'h3'
import { ensureFileChunks } from '~~/server/utils/file-rag'

export default defineEventHandler(async (event) => {
  const userEmail = getHeader(event, 'x-user-email') || ''

  if (!userEmail) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  }

  const body = await readBody(event)
  const fileIds = Array.isArray(body?.fileIds) ? body.fileIds : []

  if (fileIds.length === 0) {
    return { success: true, ingested: 0 }
  }

  await ensureFileChunks(fileIds, userEmail)

  return {
    success: true,
    ingested: fileIds.length,
  }
})
