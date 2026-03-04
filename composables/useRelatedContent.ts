/**
 * Related Content Composable
 * Queries and returns related articles and tools based on frontmatter metadata
 * 
 * @see Requirements 4.1, 4.2, 4.3
 * **Feature: seo-optimization, Property 6: Related content anchor text**
 */

import { toolConfigs, getToolById, type ToolConfig } from '~/data/toolConfig'

export interface RelatedArticle {
  title: string
  description: string
  path: string
  date: string
  keywords?: string[]
}

export interface RelatedTool {
  id: string
  name: string
  description: string
  path: string
  icon: string
  keywords: string[]
}

export interface RelatedContentOptions {
  /** Current locale for i18n */
  locale?: 'zh' | 'en'
  /** Maximum number of items to return */
  limit?: number
}

export interface AnchorTextResult {
  text: string
  containsKeyword: boolean
  matchedKeyword?: string
}

/**
 * Generates descriptive anchor text for a related tool
 * Ensures anchor text contains at least one keyword from the tool's keyword list
 * 
 * @param tool - The tool configuration
 * @param locale - Current locale
 * @returns Anchor text result with keyword match info
 */
export function generateToolAnchorText(
  tool: ToolConfig,
  locale: 'zh' | 'en' = 'zh'
): AnchorTextResult {
  const name = tool.name[locale] || tool.name.zh
  const keywords = Array.isArray(tool.keywords) ? tool.keywords : []
  
  // If no keywords available, return name as-is
  if (keywords.length === 0) {
    return {
      text: name,
      containsKeyword: false
    }
  }
  
  // The tool name itself often contains keywords
  const matchedKeyword = keywords.find(keyword =>
    name.toLowerCase().includes(keyword.toLowerCase())
  )
  
  if (matchedKeyword) {
    return {
      text: name,
      containsKeyword: true,
      matchedKeyword
    }
  }
  
  // If name doesn't contain keyword, append the first relevant keyword
  const primaryKeyword = keywords[0]
  const enhancedText = locale === 'zh'
    ? `${name} - ${primaryKeyword}`
    : `${name} - ${primaryKeyword}`
  
  return {
    text: enhancedText,
    containsKeyword: true,
    matchedKeyword: primaryKeyword
  }
}

/**
 * Generates descriptive anchor text for a related article
 * Ensures anchor text contains at least one keyword from the article's keyword list
 * 
 * @param article - The article data
 * @param locale - Current locale
 * @returns Anchor text result with keyword match info
 */
export function generateArticleAnchorText(
  article: RelatedArticle,
  locale: 'zh' | 'en' = 'zh'
): AnchorTextResult {
  const title = article.title
  const keywords = Array.isArray(article.keywords) ? article.keywords : []
  
  // If no keywords or title doesn't contain keyword, return title as-is
  // (articles without keywords will have containsKeyword: false)
  if (keywords.length === 0) {
    return {
      text: title,
      containsKeyword: false
    }
  }
  
  // Check if title already contains a keyword
  const matchedKeyword = keywords.find(keyword =>
    title.toLowerCase().includes(keyword.toLowerCase())
  )
  
  if (matchedKeyword) {
    return {
      text: title,
      containsKeyword: true,
      matchedKeyword
    }
  }
  
  // Append first keyword to enhance anchor text
  const primaryKeyword = keywords[0]
  const enhancedText = `${title} - ${primaryKeyword}`
  
  return {
    text: enhancedText,
    containsKeyword: true,
    matchedKeyword: primaryKeyword
  }
}

/**
 * Checks if anchor text contains at least one keyword from the provided list
 * 
 * @param anchorText - The anchor text to check
 * @param keywords - List of keywords to check against
 * @returns True if anchor text contains at least one keyword
 */
export function anchorTextContainsKeyword(
  anchorText: string,
  keywords: string[]
): boolean {
  if (!keywords || keywords.length === 0) {
    return false
  }
  
  const lowerAnchorText = anchorText.toLowerCase()
  return keywords.some(keyword => 
    lowerAnchorText.includes(keyword.toLowerCase())
  )
}

/**
 * Gets related tools for a given tool ID
 * Returns tools from the same category, excluding the current tool
 * 
 * @param currentToolId - The current tool's ID
 * @param options - Query options
 * @returns Array of related tools
 */
export function getRelatedTools(
  currentToolId: string,
  options: RelatedContentOptions = {}
): RelatedTool[] {
  const { locale = 'zh', limit = 5 } = options
  
  const currentTool = getToolById(currentToolId)
  if (!currentTool) {
    return []
  }
  
  // Get tools from the same category or with overlapping keywords
  const relatedTools = toolConfigs
    .filter(tool => tool.id !== currentToolId)
    .map(tool => ({
      id: tool.id,
      name: tool.name[locale] || tool.name.zh,
      description: tool.description[locale] || tool.description.zh,
      path: tool.path,
      icon: tool.icon,
      keywords: tool.keywords
    }))
    .slice(0, limit)
  
  return relatedTools
}

/**
 * Gets related tools for a blog article based on its relatedTools frontmatter
 * 
 * @param toolIds - Array of tool IDs from article frontmatter
 * @param options - Query options
 * @returns Array of related tools
 */
export function getToolsForArticle(
  toolIds: string[],
  options: RelatedContentOptions = {}
): RelatedTool[] {
  const { locale = 'zh', limit = 5 } = options
  
  if (!toolIds || toolIds.length === 0) {
    return []
  }
  
  const tools = toolIds
    .map(id => getToolById(id))
    .filter((tool): tool is ToolConfig => tool !== undefined)
    .map(tool => ({
      id: tool.id,
      name: tool.name[locale] || tool.name.zh,
      description: tool.description[locale] || tool.description.zh,
      path: tool.path,
      icon: tool.icon,
      keywords: tool.keywords
    }))
    .slice(0, limit)
  
  return tools
}

/**
 * Composable for fetching related articles for a tool page
 * Uses Nuxt Content queryContent with frontmatter-based filtering
 * 
 * @param toolId - The tool ID to find related articles for
 * @param options - Query options
 * @returns Reactive related articles data
 */
export function useRelatedArticles(
  toolId: string | Ref<string>,
  options: RelatedContentOptions = {}
) {
  const { limit = 5 } = options
  const toolIdRef = isRef(toolId) ? toolId : ref(toolId)
  
  const { data: articles, pending, error } = useAsyncData(
    `related-articles-${toolIdRef.value}`,
    () => queryContent('blog')
      .where({ relatedTools: { $contains: toolIdRef.value } })
      .only(['title', 'description', '_path', 'date', 'keywords'])
      .sort({ date: -1 })
      .limit(limit)
      .find(),
    {
      watch: [toolIdRef]
    }
  )
  
  const relatedArticles = computed<RelatedArticle[]>(() => {
    if (!articles.value) return []
    
    return articles.value.map(article => ({
      title: article.title || '',
      description: article.description || '',
      path: article._path || '',
      date: article.date || '',
      keywords: article.keywords || []
    }))
  })
  
  return {
    articles: relatedArticles,
    pending,
    error
  }
}

/**
 * Composable for fetching related tools for a blog article
 * 
 * @param toolIds - Array of tool IDs from article frontmatter
 * @param options - Query options
 * @returns Reactive related tools data
 */
export function useRelatedTools(
  toolIds: string[] | Ref<string[]>,
  options: RelatedContentOptions = {}
) {
  const toolIdsRef = isRef(toolIds) ? toolIds : ref(toolIds)
  const { locale = 'zh', limit = 5 } = options
  
  const relatedTools = computed<RelatedTool[]>(() => {
    return getToolsForArticle(toolIdsRef.value, { locale, limit })
  })

  return {
    tools: relatedTools
  }
}

/**
 * Main composable for related content
 * Provides both related articles (for tool pages) and related tools (for blog articles)
 * 
 * @param config - Configuration for related content queries
 * @returns Object with related articles and tools
 */
export function useRelatedContent(config: {
  /** Tool ID for finding related articles (used on tool pages) */
  toolId?: string | Ref<string>
  /** Tool IDs from article frontmatter (used on blog pages) */
  relatedToolIds?: string[] | Ref<string[]>
  /** Query options */
  options?: RelatedContentOptions
}) {
  const { toolId, relatedToolIds, options = {} } = config
  
  // Related articles for tool pages
  const articlesResult = toolId 
    ? useRelatedArticles(toolId, options)
    : { articles: ref<RelatedArticle[]>([]), pending: ref(false), error: ref(null) }
  
  // Related tools for blog articles
  const toolsResult = relatedToolIds
    ? useRelatedTools(relatedToolIds, options)
    : { tools: ref<RelatedTool[]>([]) }
  
  return {
    articles: articlesResult.articles,
    articlesPending: articlesResult.pending,
    articlesError: articlesResult.error,
    tools: toolsResult.tools
  }
}
