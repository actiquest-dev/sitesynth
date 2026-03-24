/**
 * GET /api/figma/plugin-config
 *
 * Returns configuration for the Figma plugin.
 * Allows the plugin to work with any domain without hardcoding.
 */

import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // API base is the site URL (without trailing slash)
  const apiBase = (
    process.env.PUBLIC_APP_URL ||
    process.env.SITE_URL ||
    'https://www.sitesynth.com'
  ).replace(/\/+$/, '')

  // Plugin token from environment
  const pluginToken = process.env.FIGMA_PLUGIN_TOKEN

  if (!pluginToken) {
    return {
      success: false,
      error: 'FIGMA_PLUGIN_TOKEN not configured on server',
    }
  }

  return {
    success: true,
    data: {
      apiBase,
      pluginToken,
    },
  }
})
