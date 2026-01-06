import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'

// Global Nuxt function
declare global {
  const useRuntimeConfig: () => { public?: { siteUrl?: string } }
}

/**
 * Composable to get the canonical URL for the current page
 * Ensures trailing slashes are removed for consistency
 */
export const useCanonicalUrl = (path?: string): ComputedRef<string> => {
  const config = useRuntimeConfig()
  const route = useRoute()
  const baseUrl: string = config.public?.siteUrl || ''

  return computed(() => {
    const currentPath: string = path || route.path
    // Remove trailing slash except for root path
    const cleanPath: string = currentPath === '/' ? '' : currentPath.replace(/\/+$/, '')
    return `${baseUrl}${cleanPath}`
  })
}
