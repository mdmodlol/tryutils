import { getCanonicalPath } from '~/utils/blog-paths'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  if (!url.pathname.includes('/blog/')) {
    return
  }

  const canonicalPath = getCanonicalPath(url.pathname)

  if (canonicalPath === url.pathname) {
    return
  }

  return sendRedirect(event, `${canonicalPath}${url.search}`, 301)
})
