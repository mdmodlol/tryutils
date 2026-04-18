import type { ComputedRef } from 'vue'
import { getCanonicalUrl } from '~/utils/blog-paths'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  twitterCard?: string
  canonical?: string
  robots?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export interface SEOTextDefaults {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  twitterTitle: string
  twitterDescription: string
}

export interface ResolvedSEOConfig {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogType: string
  ogUrl: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  twitterCard: string
  canonical: string
  robots: string
  author: string
  publishedTime?: string
  modifiedTime?: string
}

export function resolveSEOConfig(
  config: SEOConfig,
  options: {
    baseUrl: string
    routePath: string
    defaults: SEOTextDefaults
  }
): ResolvedSEOConfig {
  const fullUrl = getCanonicalUrl(options.baseUrl, options.routePath)

  return {
    title: config.title || options.defaults.title,
    description: config.description || options.defaults.description,
    keywords: config.keywords || options.defaults.keywords,
    ogTitle: config.ogTitle || config.title || options.defaults.ogTitle,
    ogDescription: config.ogDescription || config.description || options.defaults.ogDescription,
    ogImage: config.ogImage || `${options.baseUrl}/android-chrome-512x512.png`,
    ogType: config.ogType || 'website',
    ogUrl: fullUrl,
    twitterTitle: config.twitterTitle || config.title || options.defaults.twitterTitle,
    twitterDescription: config.twitterDescription || config.description || options.defaults.twitterDescription,
    twitterImage: config.twitterImage || config.ogImage || `${options.baseUrl}/android-chrome-512x512.png`,
    twitterCard: config.twitterCard || 'summary_large_image',
    canonical: fullUrl,
    robots: config.robots || 'index, follow',
    author: config.author || 'TryUtils',
    publishedTime: config.publishedTime,
    modifiedTime: config.modifiedTime,
  }
}

export const useSEO = (config: SEOConfig | ComputedRef<SEOConfig>) => {
  const { t, locale } = useI18n()
  const route = useRoute()
  
  const seoConfig = computed(() => {
    return resolveSEOConfig(unref(config), {
      baseUrl: 'https://www.tryutils.com',
      routePath: route.path,
      defaults: {
        title: t('app.seo.ogTitle'),
        description: t('app.seo.description'),
        keywords: t('app.seo.keywords'),
        ogTitle: t('app.seo.ogTitle'),
        ogDescription: t('app.seo.ogDescription'),
        twitterTitle: t('app.seo.twitterTitle'),
        twitterDescription: t('app.seo.twitterDescription'),
      },
    })
  })
  
  // 设置页面SEO
  useSeoMeta({
    title: () => seoConfig.value.title,
    description: () => seoConfig.value.description,
    keywords: () => seoConfig.value.keywords,
    author: () => seoConfig.value.author,
    robots: () => seoConfig.value.robots,
    
    // Open Graph
    ogTitle: () => seoConfig.value.ogTitle,
    ogDescription: () => seoConfig.value.ogDescription,
    ogImage: () => seoConfig.value.ogImage,
    ogType: () => seoConfig.value.ogType,
    ogUrl: () => seoConfig.value.ogUrl,
    ogSiteName: 'TryUtils',
    ogLocale: () => locale.value === 'zh' ? 'zh_CN' : 'en_US',
    
    // Twitter Card
    twitterCard: () => seoConfig.value.twitterCard,
    twitterTitle: () => seoConfig.value.twitterTitle,
    twitterDescription: () => seoConfig.value.twitterDescription,
    twitterImage: () => seoConfig.value.twitterImage,
    twitterSite: '@tryutils',
    twitterCreator: '@tryutils',
    
    // Article specific (if applicable)
    articlePublishedTime: () => seoConfig.value.publishedTime,
    articleModifiedTime: () => seoConfig.value.modifiedTime,
    articleAuthor: () => seoConfig.value.author
  })
  
  // 设置规范链接
  return {
    seoConfig: readonly(seoConfig)
  }
}

// 预定义的SEO配置
export const defaultSEOConfig: SEOConfig = {
  title: 'TryUtils - 简单实用的在线工具集合',
  description: 'TryUtils 提供简单实用的在线工具，包括 HEIC 图片转换等功能，完全在浏览器中处理，保护您的隐私安全。',
  keywords: 'TryUtils,在线工具,HEIC转换,图片处理,文件转换,在线转换器',
  ogType: 'website',
  twitterCard: 'summary_large_image'
}

export const blogSEOConfig: SEOConfig = {
  title: 'TryUtils 博客 - 实用工具使用技巧和教程',
  description: '分享实用的在线工具使用技巧、教程和最佳实践，帮助您更高效地完成日常工作。',
  keywords: 'TryUtils博客,工具教程,使用技巧,在线工具指南,效率提升',
  ogType: 'website'
}

export const aboutSEOConfig: SEOConfig = {
  title: '关于 TryUtils - 专注实用在线工具开发',
  description: '了解 TryUtils 的使命和愿景，我们致力于为用户提供简单、安全、高效的在线工具解决方案。',
  keywords: 'TryUtils关于,在线工具开发,隐私保护,用户体验',
  ogType: 'website'
}

export const contactSEOConfig: SEOConfig = {
  title: '联系我们 - TryUtils 客服支持',
  description: '有问题或建议？联系 TryUtils 团队，我们将竭诚为您提供帮助和支持。',
  keywords: 'TryUtils联系,客服支持,用户反馈,技术支持',
  ogType: 'website'
}
