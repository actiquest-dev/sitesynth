import { defineEventHandler, setResponseStatus } from 'h3'
import { ContactService } from '../services/contactService'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    setResponseStatus(event, 405)
    return { error: 'Method Not Allowed' }
  }

  return await ContactService.handleContactRequest(event)
})