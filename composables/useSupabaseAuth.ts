import { ref, computed } from 'vue'
import { createClient } from '@supabase/supabase-js'

let supabase: any = null

const initSupabaseClient = () => {
  if (!supabase) {
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const supabaseAnonKey = config.public.supabaseAnonKey
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}

const user = ref<any>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export const useSupabaseAuth = () => {
  // Check if user is logged in
  const isAuthenticated = computed(() => !!user.value)

  // Initialize auth state
  const initAuth = async () => {
    try {
      const client = initSupabaseClient()
      const { data: { session } } = await client.auth.getSession()
      user.value = session?.user || null
    } catch (err: any) {
      console.error('Auth init error:', err)
    }
  }

  // Register new user
  const register = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const client = initSupabaseClient()
      const { data, error: authError } = await client.auth.signUp({
        email,
        password,
      })

      if (authError) {
        error.value = authError.message
        return false
      }

      user.value = data.user
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Login user
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const client = initSupabaseClient()
      const { data, error: authError } = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        error.value = authError.message
        return false
      }

      user.value = data.user
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout user
  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      const client = initSupabaseClient()
      const { error: authError } = await client.auth.signOut()

      if (authError) {
        error.value = authError.message
        return false
      }

      user.value = null
      return true
    } catch (err: any) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Get current user
  const getCurrentUser = async () => {
    try {
      const client = initSupabaseClient()
      const { data: { user } } = await client.auth.getUser()
      return user
    } catch (err) {
      return null
    }
  }

  // Watch auth state changes
  const watchAuthState = () => {
    const client = initSupabaseClient()
    client.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    initAuth,
    register,
    login,
    logout,
    getCurrentUser,
    watchAuthState,
    supabase,
  }
}
