export const getDemoBuildToken = () =>
  process.env.DEMO_BUILD_TOKEN || process.env.NUXT_SESSION_PASSWORD || 'local-demo-build-token'

