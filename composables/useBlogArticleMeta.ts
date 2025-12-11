/**
 * Blog Article Meta Composable
 * Generates optimized meta tags for blog articles including date in description
 * 
 * @see Requirements 5.1, 5.2, 5.3
 * **Feature: seo-optimization, Property 9: Blog article date in description**
 */

export interface BlogArticleMetaConfig {
  title: string
  description: string
  date: string | Date
  author?: string
  keywords?: string[]
  locale?: 'zh' | 'en'
}

export interface GeneratedBlogMeta {
  title: string
  description: string
  publishedTime: string
}

// Maximum lengths for SEO compliance
export const MAX_TITLE_LENGTH = 60
export const MAX_DESCRIPTION_LENGTH = 160

/**
 * Formats a date to a localized string
 * @param date - Date string or Date object
 * @param locale - The locale for formatting
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, locale: 'zh' | 'en' = 'zh'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Handle invalid dates
  if (isNaN(dateObj.getTime())) {
    return locale === 'zh' ? '日期未知' : 'Date unknown'
  }
  
  if (locale === 'zh') {
    return dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Truncates a string to a maximum length, adding ellipsis if needed
 * Tries to break at word boundaries for cleaner truncation
 */
function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  
  // Try to find a good break point (space, punctuation)
  const truncated = str.slice(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.6) {
    return truncated.slice(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * Generates optimized title for blog articles
 * Ensures title stays under 60 characters
 * 
 * @param title - The article title
 * @returns Optimized title string
 */
export function generateBlogTitle(title: string): string {
  const siteName = 'TryUtils'
  const fullTitle = `${title} | ${siteName}`
  
  return truncateString(fullTitle, MAX_TITLE_LENGTH)
}

/**
 * Generates optimized meta description for blog articles
 * Includes the article date and ensures description stays under 160 characters
 * 
 * @param description - The article description
 * @param date - The article publication date
 * @param locale - The current locale (zh or en)
 * @returns Optimized description string with date
 */
export function generateBlogDescription(
  description: string,
  date: string | Date,
  locale: 'zh' | 'en' = 'zh'
): string {
  const formattedDate = formatDate(date, locale)
  
  // Build description with date prefix
  let fullDescription: string
  if (locale === 'zh') {
    fullDescription = `[${formattedDate}] ${description}`
  } else {
    fullDescription = `[${formattedDate}] ${description}`
  }
  
  // Ensure description is under max length
  return truncateString(fullDescription, MAX_DESCRIPTION_LENGTH)
}

/**
 * Checks if a description contains a date string
 * Looks for common date patterns
 * 
 * @param description - The description to check
 * @returns True if description contains a recognizable date
 */
export function descriptionContainsDate(description: string): boolean {
  // Check for bracketed date format [date]
  if (/\[.+\]/.test(description)) {
    return true
  }
  
  // Check for common date patterns
  // YYYY-MM-DD
  if (/\d{4}-\d{2}-\d{2}/.test(description)) {
    return true
  }
  
  // Month DD, YYYY (e.g., January 15, 2024)
  if (/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/i.test(description)) {
    return true
  }
  
  // Chinese date format (e.g., 2024年1月15日)
  if (/\d{4}年\d{1,2}月\d{1,2}日/.test(description)) {
    return true
  }
  
  // DD/MM/YYYY or MM/DD/YYYY
  if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(description)) {
    return true
  }
  
  return false
}

/**
 * Generates both title and description for blog articles
 * 
 * @param config - Blog article meta configuration
 * @returns Object with title, description, and publishedTime
 */
export function generateBlogArticleMeta(config: BlogArticleMetaConfig): GeneratedBlogMeta {
  const locale = config.locale || 'zh'
  const dateObj = typeof config.date === 'string' ? new Date(config.date) : config.date
  
  return {
    title: generateBlogTitle(config.title),
    description: generateBlogDescription(config.description, config.date, locale),
    publishedTime: isNaN(dateObj.getTime()) ? '' : dateObj.toISOString()
  }
}

/**
 * Composable for setting blog article meta tags
 * Uses Nuxt's useSeoMeta for reactive meta tag management
 * 
 * @param config - Blog article meta configuration (can be reactive)
 */
export function useBlogArticleMeta(config: BlogArticleMetaConfig | Ref<BlogArticleMetaConfig>) {
  const metaConfig = isRef(config) ? config : ref(config)
  
  const meta = computed(() => generateBlogArticleMeta(metaConfig.value))
  
  useSeoMeta({
    title: () => meta.value.title,
    description: () => meta.value.description,
    ogTitle: () => meta.value.title,
    ogDescription: () => meta.value.description,
    ogType: 'article',
    articlePublishedTime: () => meta.value.publishedTime,
    articleAuthor: () => [metaConfig.value.author || 'TryUtils']
  })
  
  return {
    meta
  }
}
