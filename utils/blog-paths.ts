const BLOG_PREFIX = '/blog/'
const ENGLISH_LOCALE_PREFIX = '/en'

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function normalizeBlogCategorySegment(path: string): string {
  const normalizedPath = ensureLeadingSlash(path)

  if (!normalizedPath.startsWith(BLOG_PREFIX)) {
    return normalizedPath
  }

  const segments = normalizedPath.split('/')

  if (segments.length > 2 && segments[2]) {
    segments[2] = segments[2].toLowerCase()
  }

  return segments.join('/')
}

export function stripEnglishBlogSuffix(path: string): string {
  return path.replace(/\.en(?=\/?$)/i, '')
}

export function getPublicBlogPathFromContentPath(
  contentPath: string,
  locale: 'zh' | 'en'
): string {
  const normalizedPath = normalizeBlogCategorySegment(
    stripEnglishBlogSuffix(ensureLeadingSlash(contentPath))
  )

  if (!normalizedPath.startsWith(BLOG_PREFIX)) {
    return normalizedPath
  }

  return locale === 'en' ? `${ENGLISH_LOCALE_PREFIX}${normalizedPath}` : normalizedPath
}

export function getContentBlogPathFromPublicPath(
  publicPath: string,
  locale: 'zh' | 'en'
): string {
  const normalizedPath = normalizeBlogCategorySegment(
    stripEnglishLocalePrefix(stripEnglishBlogSuffix(ensureLeadingSlash(publicPath)))
  )

  if (!normalizedPath.startsWith(BLOG_PREFIX)) {
    return normalizedPath
  }

  return locale === 'en' ? `${normalizedPath}.en` : normalizedPath
}

export function getCanonicalPath(path: string): string {
  let normalizedPath = ensureLeadingSlash(path)

  if (/^\/en\/blog\/.+\.en$/i.test(normalizedPath)) {
    normalizedPath = stripEnglishBlogSuffix(normalizedPath)
  } else if (/^\/blog\/.+\.en$/i.test(normalizedPath)) {
    normalizedPath = `${ENGLISH_LOCALE_PREFIX}${stripEnglishBlogSuffix(normalizedPath)}`
  }

  if (/^\/(?:en\/)?blog\//i.test(normalizedPath)) {
    const isEnglish = /^\/en(?=\/|$)/i.test(normalizedPath)
    const canonicalBlogPath = normalizeBlogCategorySegment(
      stripEnglishLocalePrefix(normalizedPath)
    )

    return isEnglish ? `${ENGLISH_LOCALE_PREFIX}${canonicalBlogPath}` : canonicalBlogPath
  }

  return normalizedPath
}

export function stripEnglishLocalePrefix(path: string): string {
  return ensureLeadingSlash(path).replace(/^\/en(?=\/|$)/i, '') || '/'
}

export function getCanonicalUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${getCanonicalPath(path)}`
}
