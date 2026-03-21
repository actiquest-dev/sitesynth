import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#app'

const user = ref<any>(null)
const token = ref<string | null>(null)
const googleIdToken = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

declare global {
  interface Window {
    google: any
  }
}

export const useGoogleAuth = () => {
  const isAuthenticated = computed(() => !!user.value && !!token.value)

  // Initialize Google Sign-In
  const initGoogle = async () => {
    try {
      const config = useRuntimeConfig()
      const googleClientId = config.public?.googleClientId

      if (!googleClientId) {
        console.error('Google Client ID not configured')
        return false
      }

      return true
    } catch (err: any) {
      console.error('Google init error:', err)
      error.value = err.message
      return false
    }
  }

  // Handle Google Sign-In response
  const handleGoogleSignIn = async (response: any) => {
    isLoading.value = true
    error.value = null

    try {
      // Get the ID token from Google response
      const idToken = response.credential || response.id_token

      if (!idToken) {
        throw new Error('No ID token received from Google')
      }

      // Send token to backend for processing
      const authResponse = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken,
        }),
      })

      const result = await authResponse.json()

      if (!result.success) {
        throw new Error(result.error || 'Google authentication failed')
      }

      // Store token and user data
      token.value = result.token
      user.value = result.user
      googleIdToken.value = idToken

      // Save token to localStorage for persistence
      localStorage.setItem('authToken', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('googleIdToken', idToken)

      console.log('✅ Google Sign-In successful:', result.user.email)
      return true
    } catch (err: any) {
      console.error('Google sign-in error:', err)
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Load stored user from localStorage
  const loadStoredAuth = () => {
    try {
      const storedToken = localStorage.getItem('authToken')
      const storedUser = localStorage.getItem('user')
      const storedGoogleIdToken = localStorage.getItem('googleIdToken')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        googleIdToken.value = storedGoogleIdToken
        return true
      }

      return false
    } catch (err) {
      console.error('Error loading stored auth:', err)
      return false
    }
  }

  // Logout user
  const logout = async () => {
    try {
      // Sign out from Google if available
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect()
      }

      // Clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      localStorage.removeItem('googleIdToken')

      // Clear state
      user.value = null
      token.value = null
      googleIdToken.value = null

      console.log('✅ Logged out successfully')
      return true
    } catch (err: any) {
      console.error('Logout error:', err)
      error.value = err.message
      return false
    }
  }

  // Get current user
  const getCurrentUser = () => {
    return user.value
  }

  // Get auth token
  const getToken = () => {
    return token.value
  }

  const getGoogleIdToken = () => {
    return googleIdToken.value
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    initGoogle,
    handleGoogleSignIn,
    loadStoredAuth,
    logout,
    getCurrentUser,
    getToken,
    getGoogleIdToken,
  }
}
