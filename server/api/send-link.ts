import { defineEventHandler, readBody, setResponseStatus } from 'h3'
import { sendLinkSubmission } from '../../utils/email'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { error: 'Method Not Allowed' }
  }

  const body = await readBody(event)
  const { link } = body

  if (!link) {
    setResponseStatus(event, 400)
    return { error: 'Link is required' }
  }

  try {
    const response = await sendLinkSubmission(link)
    return { success: true, message: 'Email sent successfully!' }
  } catch (error: any) {
    console.error('Email error:', error)
    setResponseStatus(event, 500)
    return { error: 'Failed to send email', details: error.data || error.message }
  }
})
