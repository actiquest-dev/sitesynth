import { ref, reactive } from 'vue'

const NOCO_BASE_URL = 'http://138.2.134.17:20000'
const NOCO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJpYXQiOjE3NzIwMzU1NzcsImV4cCI6MzMzMjk2MzU1Nzd9.C1TJacEJ-qy4EVlL0r94l7anWSPhWsQwlOYzLsqooNk'

interface NocoBaseRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

interface NocoBaseError {
  status: number
  message: string
  error?: any
}

/**
 * NocoBase API Client Composable
 * Handles all communication with NocoBase API
 */
export const useNocoBase = () => {
  const isLoading = ref(false)
  const error = ref<NocoBaseError | null>(null)

  /**
   * Make request to NocoBase API
   * @param path API path (e.g., 'projects:list')
   * @param options Request options
   */
  const request = async (
    path: string,
    options: NocoBaseRequestOptions = {}
  ): Promise<any> => {
    isLoading.value = true
    error.value = null

    try {
      const url = `${NOCO_BASE_URL}/api/${path}`
      const method = options.method || 'GET'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'xc-auth': NOCO_TOKEN,
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          status: response.status,
          message: errorData.message || `HTTP ${response.status}`,
          error: errorData,
        }
      }

      const data = await response.json()
      return data
    } catch (err: any) {
      error.value = {
        status: err.status || 500,
        message: err.message || 'Unknown error',
        error: err,
      }
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get list of records from collection
   * @param collectionName Collection name (e.g., 'projects')
   * @param filters Optional filters
   */
  const getList = async (
    collectionName: string,
    filters?: Record<string, any>
  ): Promise<any[]> => {
    try {
      const result = await request(`${collectionName}:list`, {
        method: 'GET',
      })
      return result?.data || result || []
    } catch (err) {
      console.error(`Error fetching ${collectionName} list:`, err)
      return []
    }
  }

  /**
   * Get single record by ID
   * @param collectionName Collection name
   * @param id Record ID
   */
  const getRecord = async (
    collectionName: string,
    id: string | number
  ): Promise<any> => {
    return request(`${collectionName}:get?id=${id}`, {
      method: 'GET',
    })
  }

  /**
   * Create new record
   * @param collectionName Collection name
   * @param data Record data
   */
  const createRecord = async (
    collectionName: string,
    data: Record<string, any>
  ): Promise<any> => {
    return request(`${collectionName}:create`, {
      method: 'POST',
      body: data,
    })
  }

  /**
   * Update record
   * @param collectionName Collection name
   * @param id Record ID
   * @param data Updated data
   */
  const updateRecord = async (
    collectionName: string,
    id: string | number,
    data: Record<string, any>
  ): Promise<any> => {
    return request(`${collectionName}:update?id=${id}`, {
      method: 'POST',
      body: data,
    })
  }

  /**
   * Delete record
   * @param collectionName Collection name
   * @param id Record ID
   */
  const deleteRecord = async (
    collectionName: string,
    id: string | number
  ): Promise<any> => {
    return request(`${collectionName}:destroy?id=${id}`, {
      method: 'POST',
    })
  }

  /**
   * Get associated records (one-to-many)
   * @param collectionName Parent collection
   * @param id Parent ID
   * @param associationName Association name
   */
  const getAssociated = async (
    collectionName: string,
    id: string | number,
    associationName: string
  ): Promise<any[]> => {
    try {
      const result = await request(
        `${collectionName}/${id}/${associationName}:list`,
        {
          method: 'GET',
        }
      )
      return result?.data || result || []
    } catch (err) {
      console.error(`Error fetching ${associationName}:`, err)
      return []
    }
  }

  /**
   * Create associated record
   * @param collectionName Parent collection
   * @param id Parent ID
   * @param associationName Association name
   * @param data Record data
   */
  const createAssociated = async (
    collectionName: string,
    id: string | number,
    associationName: string,
    data: Record<string, any>
  ): Promise<any> => {
    return request(
      `${collectionName}/${id}/${associationName}:create`,
      {
        method: 'POST',
        body: data,
      }
    )
  }

  /**
   * Update associated record
   * @param collectionName Parent collection
   * @param id Parent ID
   * @param associationName Association name
   * @param associatedId Associated record ID
   * @param data Updated data
   */
  const updateAssociated = async (
    collectionName: string,
    id: string | number,
    associationName: string,
    associatedId: string | number,
    data: Record<string, any>
  ): Promise<any> => {
    return request(
      `${collectionName}/${id}/${associationName}:update?id=${associatedId}`,
      {
        method: 'POST',
        body: data,
      }
    )
  }

  /**
   * Delete associated record
   * @param collectionName Parent collection
   * @param id Parent ID
   * @param associationName Association name
   * @param associatedId Associated record ID
   */
  const deleteAssociated = async (
    collectionName: string,
    id: string | number,
    associationName: string,
    associatedId: string | number
  ): Promise<any> => {
    return request(
      `${collectionName}/${id}/${associationName}:destroy?id=${associatedId}`,
      {
        method: 'POST',
      }
    )
  }

  return {
    isLoading,
    error,
    request,
    getList,
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord,
    getAssociated,
    createAssociated,
    updateAssociated,
    deleteAssociated,
  }
}
