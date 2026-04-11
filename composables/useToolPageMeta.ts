/**
 * Tool Page Meta Composable
 * Generates optimized meta tags for tool pages with action words
 *
 * @see Requirements 5.1, 5.2, 5.4
 * **Feature: seo-optimization, Property 7: Title length constraint**
 * **Feature: seo-optimization, Property 8: Meta description length constraint**
 * **Feature: seo-optimization, Property 10: Tool page action words**
 */

import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '~/composables/useSEOMetaConstants'

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

export const ACTION_WORDS = {
  zh: ['免费', '在线', '无需注册', '免费在线'],
  en: ['Free', 'Online', 'No Registration', 'Free Online']
}

function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str

  const truncated = str.slice(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace > maxLength * 0.6) {
    return truncated.slice(0, lastSpace) + '...'
  }

  return truncated + '...'
}

export function generateToolTitle(toolName: string, locale: 'zh' | 'en' = 'zh'): string {
  const actionWords = ACTION_WORDS[locale]
  const siteName = 'TryUtils'

  let title: string
  if (locale === 'zh') {
    title = `${actionWords[0]}${actionWords[1]}${toolName} | ${siteName}`
  } else {
    title = `${actionWords[0]} ${actionWords[1]} ${toolName} | ${siteName}`
  }

  if (title.length > MAX_TITLE_LENGTH) {
    if (locale === 'zh') {
      title = `${actionWords[0]}${toolName} | ${siteName}`
    } else {
      title = `${actionWords[0]} ${toolName} | ${siteName}`
    }
  }

  return truncateString(title, MAX_TITLE_LENGTH)
}

export function generateToolDescription(toolDescription: string, locale: 'zh' | 'en' = 'zh'): string {
  const actionWords = ACTION_WORDS[locale]

  let description: string
  if (locale === 'zh') {
    description = `${actionWords[0]}${actionWords[1]}${toolDescription}。完全在浏览器中处理，保护您的隐私。`
  } else {
    description = `${actionWords[0]} ${actionWords[1].toLowerCase()} ${toolDescription}. Processed entirely in your browser for privacy.`
  }

  return truncateString(description, MAX_DESCRIPTION_LENGTH)
}

export function generateToolPageMeta(config: ToolPageMetaConfig): GeneratedMeta {
  const locale = config.locale || 'zh'

  return {
    title: generateToolTitle(config.toolName, locale),
    description: generateToolDescription(config.toolDescription, locale)
  }
}

export function titleContainsActionWord(title: string, locale: 'zh' | 'en' = 'zh'): boolean {
  const actionWords = ACTION_WORDS[locale]
  return actionWords.some(word => title.includes(word))
}

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
