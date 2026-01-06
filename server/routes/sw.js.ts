// Handle service worker requests to prevent 404 errors
export default defineEventHandler((event) => {
  return new Response('// Service worker disabled', {
    status: 200,
    headers: {
      'content-type': 'application/javascript',
      'cache-control': 'no-cache, no-store, must-revalidate'
    }
  })
})