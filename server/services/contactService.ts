import type { H3Event } from 'h3'
import { readBody, setResponseStatus } from 'h3'
import { sendContactSubmission } from '../utils/email'

export interface ContactFormData {
  fullName: string
  company?: string
  email: string
  phone: string
  topic: string
  message: string
  consent: boolean
}

export interface ContactApiResponse {
  success: boolean
  message: string
  error?: string
  details?: any
}

export class ContactService {
  // Validate required fields
  static validateContactData(data: Partial<ContactFormData>): string | null {
    const { fullName, email, phone, topic, message, consent } = data

    if (!fullName || !email || !phone || !topic || !message || !consent) {
      return 'Missing required fields'
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Invalid email format'
    }

    // Validate consent
    if (!consent) {
      return 'Data processing consent is required'
    }

    return null
  }

  // Process contact form submission
  static async processContactSubmission(data: ContactFormData): Promise<ContactApiResponse> {
    try {
      await sendContactSubmission(data)
      
      return {
        success: true,
        message: "Contact form submitted successfully! We'll get back to you soon."
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error)
      
      return {
        success: false,
        message: 'Failed to send contact form',
        error: 'Failed to send contact form',
        details: error.data || error.message
      }
    }
  }

  // Handle contact API request
  static async handleContactRequest(event: H3Event): Promise<ContactApiResponse> {
    try {
      const body = await readBody(event)
      
      // Validate input
      const validationError = this.validateContactData(body)
      if (validationError) {
        setResponseStatus(event, 400)
        return {
          success: false,
          message: validationError,
          error: validationError
        }
      }

      // Process submission
      const result = await this.processContactSubmission(body as ContactFormData)
      
      if (!result.success) {
        setResponseStatus(event, 500)
      }

      return result
    } catch (error: any) {
      console.error('Contact API error:', error)
      setResponseStatus(event, 500)
      
      return {
        success: false,
        message: 'Internal server error',
        error: 'Internal server error',
        details: error.message
      }
    }
  }
}