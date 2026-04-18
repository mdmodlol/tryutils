import type { FAQItem } from '~/composables/useFAQSchema'
import {
  getDefaultCtaVariant,
  isBlogCtaVariant,
  isMainlineToolId,
  type BlogCtaVariant,
  type MainlineToolId,
} from '~/data/blog-cta'
import {
  getBlogFaqItems,
  isBlogFaqCategory,
  mergeBlogFaqItems,
  normalizeCustomFaqItems,
  type BlogFaqCategory,
} from '~/data/blog-faq'
import { getCanonicalUrl, getPublicBlogPathFromContentPath } from '~/utils/blog-paths'

export interface BlogLinkageSource {
  _path?: string
  relatedTools?: unknown
  primaryTool?: unknown
  ctaVariant?: unknown
  faqCategory?: unknown
  canonical?: unknown
  embedTool?: unknown
  faqItems?: unknown
}

export interface NormalizedBlogLinkage {
  contentDomain?: BlogFaqCategory
  primaryTool: MainlineToolId
  relatedTools: MainlineToolId[]
  ctaVariant: BlogCtaVariant
  faqCategory: BlogFaqCategory
  canonicalPath: string
  hasInlineEmbed: boolean
  customFaqItems: FAQItem[]
}

function inferBlogDomain(value: string | undefined): BlogFaqCategory | undefined {
  if (!value) {
    return undefined
  }

  const normalizedValue = value.toLowerCase()

  if (normalizedValue.includes('/imagecompression/')) {
    return 'imagecompression'
  }

  if (normalizedValue.includes('/heicconverter/')) {
    return 'heicconverter'
  }

  return undefined
}

function getDefaultPrimaryTool(domain: BlogFaqCategory): MainlineToolId {
  return domain === 'heicconverter' ? 'heic-converter' : 'image-compressor'
}

function normalizeRelatedTools(
  value: unknown,
  primaryTool: MainlineToolId,
): MainlineToolId[] {
  const normalizedTools = Array.isArray(value)
    ? value.filter(isMainlineToolId)
    : []

  const uniqueTools = Array.from(
    new Set<MainlineToolId>([primaryTool, ...normalizedTools]),
  )

  if (!uniqueTools.includes('image-format-converter')) {
    uniqueTools.push('image-format-converter')
  }

  return uniqueTools.slice(0, 3)
}

export function normalizeBlogLinkage(
  article: BlogLinkageSource,
  options: {
    locale: 'zh' | 'en'
    publicPath?: string
    baseUrl?: string
  },
): NormalizedBlogLinkage | null {
  const domain = inferBlogDomain(article._path || options.publicPath)

  if (!domain) {
    return null
  }

  const primaryTool = isMainlineToolId(article.primaryTool)
    ? article.primaryTool
    : getDefaultPrimaryTool(domain)

  const relatedTools = normalizeRelatedTools(article.relatedTools, primaryTool)
  const ctaVariant = isBlogCtaVariant(article.ctaVariant)
    ? article.ctaVariant
    : getDefaultCtaVariant(primaryTool)
  const faqCategory = isBlogFaqCategory(article.faqCategory)
    ? article.faqCategory
    : domain

  const publicPath = options.publicPath
    || getPublicBlogPathFromContentPath(article._path || '', options.locale)
  const canonicalPath = getCanonicalUrl(options.baseUrl || 'https://www.tryutils.com', publicPath)
  const customFaqItems = normalizeCustomFaqItems(article.faqItems)

  return {
    contentDomain: domain,
    primaryTool,
    relatedTools,
    ctaVariant,
    faqCategory,
    canonicalPath,
    hasInlineEmbed: typeof article.embedTool === 'string' && article.embedTool.length > 0,
    customFaqItems,
  }
}

export function resolveBlogFaqItems(
  linkage: Pick<NormalizedBlogLinkage, 'faqCategory' | 'customFaqItems'>,
  locale: 'zh' | 'en',
): FAQItem[] {
  const defaultFaqItems = getBlogFaqItems(linkage.faqCategory, locale)
  return mergeBlogFaqItems(defaultFaqItems, linkage.customFaqItems)
}
