import type { H3Event } from 'h3'
import { setResponseStatus } from 'h3'

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  details?: any
}

export class ApiHandler {
  // Generic method validator
  static validateMethod(event: H3Event, allowedMethods: string[]): ApiResponse | null {
    if (!allowedMethods.includes(event.method || '')) {
      setResponseStatus(event, 405)
      return {
        success: false,
        message: 'Method Not Allowed',
        error: 'Method Not Allowed'
      }
    }
    return null
  }

  // Generic success response
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data
    }
  }

  // Generic error response
  static error(event: H3Event, status: number, message: string, details?: any): ApiResponse {
    setResponseStatus(event, status)
    return {
      success: false,
      message,
      error: message,
      details
    }
  }

  // Handle async operations with error catching
  static async handleAsync<T>(
    event: H3Event,
    operation: () => Promise<T>
  ): Promise<ApiResponse<T>> {
    try {
      const result = await operation()
      return this.success('Operation completed successfully', result)
    } catch (error: any) {
      console.error('API operation failed:', error)
      return this.error(event, 500, 'Internal server error', error.message)
    }
  }
}