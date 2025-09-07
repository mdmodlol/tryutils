export interface OrganizationSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
  contactPoint: {
    '@type': string
    contactType: string
    url: string
  }
}

export interface WebsiteSchema {
  '@context': string
  '@type': string
  name: string
  url: string
  description: string
  publisher: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
  }
  potentialAction: {
    '@type': string
    target: string
    'query-input': string
  }
}

export interface WebPageSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  mainEntity?: any
  breadcrumb?: BreadcrumbSchema
  publisher: {
    '@type': string
    name: string
  }
}

export interface BreadcrumbSchema {
  '@context': string
  '@type': string
  itemListElement: Array<{
    '@type': string
    position: number
    name: string
    item: string
  }>
}

export interface ArticleSchema {
  '@context': string
  '@type': string
  headline: string
  description: string
  image: string
  author: {
    '@type': string
    name: string
  }
  publisher: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
  }
  datePublished: string
  dateModified: string
  mainEntityOfPage: {
    '@type': string
    '@id': string
  }
}

export interface SoftwareApplicationSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  applicationCategory: string
  operatingSystem: string
  offers: {
    '@type': string
    price: string
    priceCurrency: string
  }
  aggregateRating?: {
    '@type': string
    ratingValue: string
    ratingCount: string
  }
}

export const useStructuredData = () => {
  const route = useRoute()
  const { t, locale } = useI18n()
  const baseUrl = 'https://www.tryutils.com'
  
  // 组织信息结构化数据
  const getOrganizationSchema = (): OrganizationSchema => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TryUtils',
      url: baseUrl,
      logo: `${baseUrl}/android-chrome-512x512.png`,
      description: t('app.seo.description'),
      sameAs: [
        'https://github.com/tryutils',
        'https://twitter.com/tryutils'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        url: `${baseUrl}/contact`
      }
    }
  }
  
  // 网站结构化数据
  const getWebsiteSchema = (): WebsiteSchema => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'TryUtils',
      url: baseUrl,
      description: t('app.seo.description'),
      publisher: {
        '@type': 'Organization',
        name: 'TryUtils',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/android-chrome-512x512.png`
        }
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/blog?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  }
  
  // 网页结构化数据
  const getWebPageSchema = (config: {
    name: string
    description: string
    breadcrumb?: Array<{ name: string; url: string }>
  }): WebPageSchema => {
    const currentLocale = locale.value
    const localePath = currentLocale === 'zh' ? '' : `/${currentLocale}`
    const fullUrl = `${baseUrl}${localePath}${route.path}`
    
    const schema: WebPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: config.name,
      description: config.description,
      url: fullUrl,
      publisher: {
        '@type': 'Organization',
        name: 'TryUtils'
      }
    }
    
    // 添加面包屑导航
    if (config.breadcrumb && config.breadcrumb.length > 0) {
      schema.breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: config.breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      }
    }
    
    return schema
  }
  
  // 文章结构化数据
  const getArticleSchema = (config: {
    headline: string
    description: string
    image?: string
    author?: string
    datePublished: string
    dateModified?: string
  }): ArticleSchema => {
    const currentLocale = locale.value
    const localePath = currentLocale === 'zh' ? '' : `/${currentLocale}`
    const fullUrl = `${baseUrl}${localePath}${route.path}`
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.headline,
      description: config.description,
      image: config.image || `${baseUrl}/android-chrome-512x512.png`,
      author: {
        '@type': 'Person',
        name: config.author || 'TryUtils Team'
      },
      publisher: {
        '@type': 'Organization',
        name: 'TryUtils',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/android-chrome-512x512.png`
        }
      },
      datePublished: config.datePublished,
      dateModified: config.dateModified || config.datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl
      }
    }
  }
  
  // 软件应用结构化数据（用于工具页面）
  const getSoftwareApplicationSchema = (config: {
    name: string
    description: string
    category?: string
  }): SoftwareApplicationSchema => {
    const currentLocale = locale.value
    const localePath = currentLocale === 'zh' ? '' : `/${currentLocale}`
    const fullUrl = `${baseUrl}${localePath}${route.path}`
    
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: config.name,
      description: config.description,
      url: fullUrl,
      applicationCategory: config.category || 'Utility',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }
  }
  
  // 设置结构化数据到页面
  const setStructuredData = (schemas: any[]) => {
    useHead({
      script: schemas.map(schema => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema)
      }))
    })
  }
  
  return {
    getOrganizationSchema,
    getWebsiteSchema,
    getWebPageSchema,
    getArticleSchema,
    getSoftwareApplicationSchema,
    setStructuredData
  }
}