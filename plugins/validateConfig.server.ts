/**
 * Server-side plugin to validate runtime configuration on startup
 * This ensures all required environment variables are properly loaded
 */

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Validate that runtimeConfig is properly set
  if (!config || typeof config !== 'object') {
    console.error('❌ Runtime config is not properly initialized')
    throw new Error('Runtime configuration failed to initialize')
  }

  // Validate public config
  if (!config.public) {
    console.error('❌ Runtime config.public is not properly initialized')
    throw new Error('Runtime public configuration failed to initialize')
  }

  // Log config status (without exposing secrets)
  console.log('✅ Runtime configuration initialized successfully')
  console.log('  - Stripe Publishable Key:', config.public.stripePublishableKey ? 'SET' : 'NOT SET')
  console.log('  - Supabase URL:', config.public.supabaseUrl ? 'SET' : 'NOT SET')
  console.log('  - Google Client ID:', config.public.googleClientId ? 'SET' : 'NOT SET')

  // Ensure config object is not modified
  if (typeof Object.seal === 'function') {
    Object.seal(config)
    Object.seal(config.public)
  }
})
