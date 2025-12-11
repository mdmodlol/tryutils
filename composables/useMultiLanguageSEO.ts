/**
 * Multi-language SEO composable
 * Handles hreflang tags, HTML lang attribute, and canonical URL management
 * 
 * @see Requirements 6.1, 6.2, 6.4
 */

export interface LocaleConfig {
  code: string
  iso: string
}

export interface HreflangTag {
  rel: 'alternate'
  hreflang: string
  href: string
}

export interface MultiLanguageSEOConfig {
  baseUrl: string
  locales: LocaleConfig[]
  defaultLocale: string
  currentLocale: string
  currentPath: string
}

/**
 * Generate hreflang tags for all configured locales
 * 
 * @param config - Multi-language SEO configuration
 * @returns Array of hreflang link tags
 */
export function generateHreflangTags(config: MultiLanguageSEOConfig): HreflangTag[] {
  const { baseUrl, locales, defaultLocale, currentPath } = config
  const tags: HreflangTag[] = []
  
  // Normalize path - remove locale prefix if present
  const normalizedPath = normalizePathForLocale(currentPath, locales, defaultLocale)
  
  for (const locale of locales) {
    const localePath = getLocaleSpecificPath(normalizedPath, locale.code, defaultLocale)
    tags.push({
      rel: 'alternate',
      hreflang: locale.code,
      href: `${baseUrl}${localePath}`
    })
  }
  
  // Add x-default pointing to default locale
  const defaultPath = getLocaleSpecificPath(normalizedPath, defaultLocale, defaultLocale)
  tags.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${baseUrl}${defaultPath}`
  })
  
  return tags
}

/**
 * Normalize path by removing locale prefix
 */
function normalizePathForLocale(
  path: string, 
  locales: LocaleConfig[], 
  defaultLocale: string
): string {
  // Remove leading slash for processing
  let normalizedPath = path.startsWith('/') ? path.slice(1) : path
  
  // Check if path starts with a locale code
  for (const locale of locales) {
    if (locale.code !== defaultLocale) {
      if (normalizedPath === locale.code) {
        return '/'
      }
      if (normalizedPath.startsWith(`${locale.code}/`)) {
        return '/' + normalizedPath.slice(locale.code.length + 1)
      }
    }
  }
  
  return path.startsWith('/') ? path : '/' + path
}

/**
 * Get locale-specific path
 */
function getLocaleSpecificPath(
  basePath: string, 
  locale: string, 
  defaultLocale: string
): string {
  // Ensure basePath starts with /
  const normalizedBase = basePath.startsWith('/') ? basePath : '/' + basePath
  
  if (locale === defaultLocale) {
    return normalizedBase
  }
  
  // For non-default locales, prefix with locale code
  if (normalizedBase === '/') {
    return `/${locale}`
  }
  
  return `/${locale}${normalizedBase}`
}

/**
 * Get the correct HTML lang attribute value for a locale
 * 
 * @param locale - Locale code (e.g., 'zh', 'en')
 * @returns ISO language code (e.g., 'zh-CN', 'en-US')
 */
export function getHtmlLangAttribute(locale: string): string {
  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'en': 'en-US'
  }
  return langMap[locale] || locale
}

/**
 * Generate canonical URL for the current page
 * 
 * @param baseUrl - Base URL of the site
 * @param currentPath - Current route path
 * @returns Canonical URL
 */
export function generateCanonicalUrl(baseUrl: string, currentPath: string): string {
  // Ensure path starts with /
  const normalizedPath = currentPath.startsWith('/') ? currentPath : '/' + currentPath
  return `${baseUrl}${normalizedPath}`
}

/**
 * Validate that hreflang tags are complete for all locales
 * 
 * @param tags - Array of hreflang tags
 * @param expectedLocales - Array of expected locale codes
 * @returns true if all locales are covered plus x-default
 */
export function validateHreflangCompleteness(
  tags: HreflangTag[], 
  expectedLocales: string[]
): boolean {
  const hreflangValues = tags.map(tag => tag.hreflang)
  
  // Check all expected locales are present
  for (const locale of expectedLocales) {
    if (!hreflangValues.includes(locale)) {
      return false
    }
  }
  
  // Check x-default is present
  if (!hreflangValues.includes('x-default')) {
    return false
  }
  
  return true
}

/**
 * Validate that canonical URL matches the current locale
 * 
 * @param canonicalUrl - The canonical URL
 * @param currentLocale - Current locale code
 * @param defaultLocale - Default locale code
 * @param baseUrl - Base URL of the site
 * @returns true if canonical URL is consistent with current locale
 */
export function validateCanonicalUrlConsistency(
  canonicalUrl: string,
  currentLocale: string,
  defaultLocale: string,
  baseUrl: string
): boolean {
  // Remove base URL to get path
  const path = canonicalUrl.replace(baseUrl, '')
  
  if (currentLocale === defaultLocale) {
    // Default locale should not have locale prefix (except for root)
    // Path should not start with /en/ or similar non-default locale
    const nonDefaultPattern = /^\/(?!zh)[a-z]{2}(\/|$)/
    return !nonDefaultPattern.test(path) || path === '/'
  } else {
    // Non-default locale should have locale prefix
    return path.startsWith(`/${currentLocale}`) || path === `/${currentLocale}`
  }
}

/**
 * Composable for multi-language SEO
 * Sets up hreflang tags, HTML lang attribute, and canonical URL
 */
export function useMultiLanguageSEO() {
  const { locale } = useI18n()
  const route = useRoute()
  const switchLocalePath = useSwitchLocalePath()
  const runtimeConfig = useRuntimeConfig()
  
  const baseUrl = runtimeConfig.public.siteUrl || 'https://www.tryutils.com'
  
  const locales: LocaleConfig[] = [
    { code: 'zh', iso: 'zh-CN' },
    { code: 'en', iso: 'en-US' }
  ]
  
  const defaultLocale = 'zh'
  
  // Generate hreflang tags
  const hreflangTags = computed(() => {
    return generateHreflangTags({
      baseUrl,
      locales,
      defaultLocale,
      currentLocale: locale.value,
      currentPath: route.path
    })
  })
  
  // Get HTML lang attribute
  const htmlLang = computed(() => getHtmlLangAttribute(locale.value))
  
  // Generate canonical URL
  const canonicalUrl = computed(() => generateCanonicalUrl(baseUrl, route.path))
  
  // Set head with SEO tags
  useHead({
    htmlAttrs: {
      lang: htmlLang
    },
    link: [
      ...hreflangTags.value,
      { rel: 'canonical', href: canonicalUrl }
    ]
  })
  
  return {
    hreflangTags,
    htmlLang,
    canonicalUrl,
    locales,
    defaultLocale
  }
}
