/**
 * Tool Page Meta Composable
 * Generates optimized meta tags for tool pages with action words
 * 
 * @see Requirements 5.1, 5.2, 5.4
 * **Feature: seo-optimization, Property 7: Title length constraint**
 * **Feature: seo-optimization, Property 8: Meta description length constraint**
 * **Feature: seo-optimization, Property 10: Tool page action words**
 */

export interface ToolPageMetaConfig {
  toolName: string
  toolDescription: string
  keywords?: string[]
  locale?: 'zh' | 'en'
}

export interface GeneratedMeta {
  title: string
  description: string
}

// Action words that should appear in tool page titles
export const ACTION_WORDS = {
  zh: ['免费', '在线', '无需注册', '免费在线'],
  en: ['Free', 'Online', 'No Registration', 'Free Online']
}

// Maximum lengths for SEO compliance
export const MAX_TITLE_LENGTH = 60
export const MAX_DESCRIPTION_LENGTH = 160

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
 * Generates optimized title for tool pages
 * Ensures title contains action words and stays under 60 characters
 * 
 * @param toolName - The name of the tool
 * @param locale - The current locale (zh or en)
 * @returns Optimized title string
 */
export function generateToolTitle(toolName: string, locale: 'zh' | 'en' = 'zh'): string {
  const actionWords = ACTION_WORDS[locale]
  const siteName = 'TryUtils'
  
  // Build title with action word prefix
  let title: string
  if (locale === 'zh') {
    title = `${actionWords[0]}${actionWords[1]}${toolName} | ${siteName}`
  } else {
    title = `${actionWords[0]} ${actionWords[1]} ${toolName} | ${siteName}`
  }
  
  // Ensure title is under max length
  if (title.length > MAX_TITLE_LENGTH) {
    // Try shorter format
    if (locale === 'zh') {
      title = `${actionWords[0]}${toolName} | ${siteName}`
    } else {
      title = `${actionWords[0]} ${toolName} | ${siteName}`
    }
  }
  
  // Final truncation if still too long
  return truncateString(title, MAX_TITLE_LENGTH)
}

/**
 * Generates optimized meta description for tool pages
 * Ensures description stays under 160 characters with clear value proposition
 * 
 * @param toolDescription - The description of the tool
 * @param locale - The current locale (zh or en)
 * @returns Optimized description string
 */
export function generateToolDescription(toolDescription: string, locale: 'zh' | 'en' = 'zh'): string {
  const actionWords = ACTION_WORDS[locale]
  
  // Add action word prefix to description
  let description: string
  if (locale === 'zh') {
    description = `${actionWords[0]}${actionWords[1]}${toolDescription}。完全在浏览器中处理，保护您的隐私。`
  } else {
    description = `${actionWords[0]} ${actionWords[1].toLowerCase()} ${toolDescription}. Processed entirely in your browser for privacy.`
  }
  
  // Ensure description is under max length
  return truncateString(description, MAX_DESCRIPTION_LENGTH)
}

/**
 * Generates both title and description for tool pages
 * 
 * @param config - Tool page meta configuration
 * @returns Object with title and description
 */
export function generateToolPageMeta(config: ToolPageMetaConfig): GeneratedMeta {
  const locale = config.locale || 'zh'
  
  return {
    title: generateToolTitle(config.toolName, locale),
    description: generateToolDescription(config.toolDescription, locale)
  }
}

/**
 * Checks if a title contains at least one action word
 * 
 * @param title - The title to check
 * @param locale - The locale to check against
 * @returns True if title contains an action word
 */
export function titleContainsActionWord(title: string, locale: 'zh' | 'en' = 'zh'): boolean {
  const actionWords = ACTION_WORDS[locale]
  return actionWords.some(word => title.includes(word))
}

/**
 * Composable for setting tool page meta tags
 * Uses Nuxt's useSeoMeta for reactive meta tag management
 * 
 * @param config - Tool page meta configuration (can be reactive)
 */
export function useToolPageMeta(config: ToolPageMetaConfig | Ref<ToolPageMetaConfig>) {
  const metaConfig = isRef(config) ? config : ref(config)
  
  const meta = computed(() => generateToolPageMeta(metaConfig.value))
  
  useSeoMeta({
    title: () => meta.value.title,
    description: () => meta.value.description,
    ogTitle: () => meta.value.title,
    ogDescription: () => meta.value.description
  })
  
  return {
    meta
  }
}
