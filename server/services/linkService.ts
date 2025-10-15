import type { H3Event } from 'h3'
import { readBody, setResponseStatus } from 'h3'
import { sendLinkSubmission } from '../utils/email'

export interface LinkFormData {
  link: string
}

export interface LinkApiResponse {
  success: boolean
  message: string
  error?: string
  details?: any
}

export class LinkService {
  // Validate link data
  static validateLinkData(data: Partial<LinkFormData>): string | null {
    if (!data.link) {
      return 'Link is required'
    }

    // Basic URL validation
    try {
      new URL(data.link)
    } catch {
      return 'Invalid URL format'
    }

    return null
  }

  // Process link submission
  static async processLinkSubmission(data: LinkFormData): Promise<LinkApiResponse> {
    try {
      await sendLinkSubmission(data.link)
      
      return {
        success: true,
        message: 'Link submitted successfully!'
      }
    } catch (error: any) {
      console.error('Link submission error:', error)
      
      return {
        success: false,
        message: 'Failed to submit link',
        error: 'Failed to submit link',
        details: error.data || error.message
      }
    }
  }

  // Handle link API request
  static async handleLinkRequest(event: H3Event): Promise<LinkApiResponse> {
    try {
      const body = await readBody(event)
      
      // Validate input
      const validationError = this.validateLinkData(body)
      if (validationError) {
        setResponseStatus(event, 400)
        return {
          success: false,
          message: validationError,
          error: validationError
        }
      }

      // Process submission
      const result = await this.processLinkSubmission(body as LinkFormData)
      
      if (!result.success) {
        setResponseStatus(event, 500)
      }

      return result
    } catch (error: any) {
      console.error('Link API error:', error)
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