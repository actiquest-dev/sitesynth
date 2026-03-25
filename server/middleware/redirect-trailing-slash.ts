export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Redirect any non-root path ending with a trailing slash.
  // Keeps canonical URLs consistent and avoids duplicate content.
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    const target = url.pathname.replace(/\/+$/, '') + url.search
    return sendRedirect(event, target, 301)
  }
})
