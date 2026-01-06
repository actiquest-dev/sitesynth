import type { RouteLocationNormalized } from 'vue-router'

// Global Nuxt functions available in middleware
declare global {
  const defineNuxtRouteMiddleware: (middleware: (to: RouteLocationNormalized) => any) => any
  const navigateTo: (route: any, options?: { redirectCode?: number }) => any
}

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  // Skip if it's the root path
  if (to.path === '/') {
    return
  }

  // If the path has a trailing slash, redirect to the path without it
  if (to.path.endsWith('/')) {
    const { path, query, hash } = to
    const nextPath: string = path.replace(/\/+$/, '') || '/'
    const nextRoute = { path: nextPath, query, hash }
    
    return navigateTo(nextRoute, { redirectCode: 301 })
  }
})
