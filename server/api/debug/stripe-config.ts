import { defineEventHandler } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  return {
    stripePublishableKey: config.public?.stripePublishableKey ? 'SET' : 'NOT SET',
    stripePublishableKeyLength: config.public?.stripePublishableKey?.length || 0,
    stripePublishableKeyPrefix: config.public?.stripePublishableKey?.substring(0, 10) || 'N/A',
    envVarExists: !!process.env.STRIPE_PUBLISHABLE_KEY,
    envVarLength: process.env.STRIPE_PUBLISHABLE_KEY?.length || 0,
    envVarPrefix: process.env.STRIPE_PUBLISHABLE_KEY?.substring(0, 10) || 'N/A',
  }
})
