const BLOG_PREFIX = '/blog/'
const ENGLISH_LOCALE_PREFIX = '/en'

export function stripEnglishBlogSuffix(path: string): string {
  return path.replace(/\.en$/i, '')
}

export function getPublicBlogPathFromContentPath(
  contentPath: string,
  locale: 'zh' | 'en'
): string {
  const normalizedPath = stripEnglishBlogSuffix(contentPath)

  if (!normalizedPath.startsWith(BLOG_PREFIX)) {
    return normalizedPath
  }

  return locale === 'en' ? `${ENGLISH_LOCALE_PREFIX}${normalizedPath}` : normalizedPath
}

export function getContentBlogPathFromPublicPath(
  publicPath: string,
  locale: 'zh' | 'en'
): string {
  const normalizedPath = stripEnglishLocalePrefix(publicPath)

  if (!normalizedPath.startsWith(BLOG_PREFIX)) {
    return normalizedPath
  }

  return locale === 'en' ? `${normalizedPath}.en` : normalizedPath
}

export function getCanonicalPath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (/^\/en\/blog\/.+\.en$/i.test(normalizedPath)) {
    return stripEnglishBlogSuffix(normalizedPath)
  }

  if (/^\/blog\/.+\.en$/i.test(normalizedPath)) {
    return `${ENGLISH_LOCALE_PREFIX}${stripEnglishBlogSuffix(normalizedPath)}`
  }

  return normalizedPath
}

export function stripEnglishLocalePrefix(path: string): string {
  return path.replace(/^\/en(?=\/|$)/, '') || '/'
}

export function getCanonicalUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${getCanonicalPath(path)}`
}
