import { blogLegacyAliasMap, blogPublicRoutes, blogRouteManifest } from '~/data/blog-route-manifest'

const BLOG_PREFIX = '/blog/'
const ENGLISH_LOCALE_PREFIX = '/en'
const blogCanonicalPathMap = new Map<string, string>(
  blogRouteManifest.flatMap((entry) => [
    [entry.publicPath, entry.publicPath] as const,
    ...entry.aliases.map((alias) => [alias, entry.publicPath] as const)
  ])
)
const blogContentPathMap = new Map<string, string>(
  blogRouteManifest.map((entry) => [entry.publicPath, entry.contentPath] as const)
)
const blogPublicPathMap = new Map<string, string>(
  blogRouteManifest.map((entry) => [entry.contentPath, entry.publicPath] as const)
)

function ensureLeadingSlash(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function stripTrailingSlash(path: string): string {
  return path === '/' ? path : path.replace(/\/+$/, '')
}

function stripEnglishBlogSuffix(value: string): string {
  return value.replace(/\.en$/i, '')
}

function stripLegacyEnglishSlugSuffix(slug: string): string {
  return slug.replace(/-en$/i, '')
}

function isBlogPath(path: string): boolean {
  return /^\/(?:en\/)?blog\//i.test(path)
}

function normalizeBlogCategory(category: string): string {
  return category.toLowerCase()
}

export function stripEnglishLocalePrefix(path: string): string {
  return ensureLeadingSlash(path).replace(/^\/en(?=\/|$)/i, '') || '/'
}

export function hasLegacyEnglishBlogSignal(path: string): boolean {
  return /^\/en\/blog\//i.test(path) || /\.en$/i.test(path) || /-en$/i.test(path)
}

export function normalizeBlogPublicPath(
  path: string,
  locale?: 'zh' | 'en'
): string {
  const normalizedPath = stripTrailingSlash(ensureLeadingSlash(path))

  if (!isBlogPath(normalizedPath)) {
    return normalizedPath
  }

  const manifestResolvedPath = blogCanonicalPathMap.get(normalizedPath)
  if (manifestResolvedPath) {
    return manifestResolvedPath
  }

  const strippedPath = stripEnglishLocalePrefix(normalizedPath)
  const segments = strippedPath.split('/')

  if (segments.length < 4) {
    return strippedPath
  }

  const category = normalizeBlogCategory(segments[2] || '')
  const slug = stripLegacyEnglishSlugSuffix(stripEnglishBlogSuffix(segments[3] || ''))
  const isEnglish = locale ? locale === 'en' : hasLegacyEnglishBlogSignal(normalizedPath)
  const blogPath = `/blog/${category}/${slug}`
  const computedPath = isEnglish ? `${ENGLISH_LOCALE_PREFIX}${blogPath}` : blogPath

  return blogCanonicalPathMap.get(computedPath) || computedPath
}

export function getPublicBlogPathFromContentPath(
  contentPath: string,
  locale?: 'zh' | 'en'
): string {
  const normalizedPath = stripTrailingSlash(ensureLeadingSlash(contentPath))

  const manifestResolvedPath = blogPublicPathMap.get(normalizedPath)
  if (manifestResolvedPath) {
    return manifestResolvedPath
  }

  if (!normalizedPath.startsWith(BLOG_PREFIX)) {
    return normalizedPath
  }

  const contentSegments = normalizedPath.split('/')
  const category = normalizeBlogCategory(contentSegments[2] || '')
  const slug = stripEnglishBlogSuffix(contentSegments[3] || '')
  const resolvedLocale = locale || (normalizedPath.endsWith('.en') ? 'en' : 'zh')
  const blogPath = `/blog/${category}/${slug}`
  const computedPath = resolvedLocale === 'en' ? `${ENGLISH_LOCALE_PREFIX}${blogPath}` : blogPath

  return blogCanonicalPathMap.get(computedPath) || computedPath
}

export function getContentBlogPathFromPublicPath(
  publicPath: string,
  locale?: 'zh' | 'en'
): string {
  const canonicalPublicPath = normalizeBlogPublicPath(publicPath, locale)
  const manifestResolvedPath = blogContentPathMap.get(canonicalPublicPath)

  if (manifestResolvedPath) {
    return manifestResolvedPath
  }

  if (!canonicalPublicPath.startsWith('/blog/') && !canonicalPublicPath.startsWith('/en/blog/')) {
    return canonicalPublicPath
  }

  const strippedPath = stripEnglishLocalePrefix(canonicalPublicPath)
  const resolvedLocale = locale || (canonicalPublicPath.startsWith('/en/blog/') ? 'en' : 'zh')

  return resolvedLocale === 'en' ? `${strippedPath}.en` : strippedPath
}

export function getCanonicalPath(path: string): string {
  const normalizedPath = stripTrailingSlash(ensureLeadingSlash(path))
  return isBlogPath(normalizedPath) ? normalizeBlogPublicPath(normalizedPath) : normalizedPath
}

export function getCanonicalUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${getCanonicalPath(path)}`
}

export function resolveLegacyBlogPath(path: string): string | undefined {
  const normalizedPath = stripTrailingSlash(ensureLeadingSlash(path))
  return blogLegacyAliasMap.get(normalizedPath)
}

export function getAllBlogPublicRoutes(): string[] {
  return [...blogPublicRoutes]
}
