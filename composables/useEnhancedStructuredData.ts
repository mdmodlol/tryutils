import type { FAQPageSchema } from '~/composables/useFAQSchema'
import type { HowToSchema as BaseHowToSchema } from '~/composables/useHowToSchema'
import { getCanonicalUrl } from '~/utils/blog-paths'

type HowToSchema = BaseHowToSchema & {
  description: string
  image?: string
  totalTime?: string
  estimatedCost?: {
    '@type': string
    currency: string
    value: string
  }
  supply?: Array<{
    '@type': string
    name: string
  }>
  tool?: Array<{
    '@type': string
    name: string
  }>
  step: Array<{
    '@type': string
    position?: number
    name: string
    text: string
    image?: string
    url?: string
  }>
}

export interface ServiceSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  provider: {
    '@type': string
    name: string
    url: string
  }
  areaServed: string
  availableChannel: {
    '@type': string
    serviceUrl: string
  }
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

export interface ProductSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  image?: string
  brand: {
    '@type': string
    name: string
  }
  offers: {
    '@type': string
    price: string
    priceCurrency: string
    availability: string
  }
  aggregateRating?: {
    '@type': string
    ratingValue: string
    ratingCount: string
  }
}

export const useEnhancedStructuredData = () => {
  const route = useRoute()
  const baseUrl = 'https://www.tryutils.com'
  
  // FAQ页面结构化数据
  const getFAQPageSchema = (faqs: Array<{ question: string; answer: string }>): FAQPageSchema => {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer.replace(/<[^>]*>/g, '') // 移除HTML标签
        }
      }))
    }
  }

  // 操作指南结构化数据
  const getHowToSchema = (config: {
    name: string
    description: string
    steps: Array<{ name: string; text: string; image?: string }>
    totalTime?: string
    tools?: string[]
    supplies?: string[]
  }): HowToSchema => {
    const fullUrl = getCanonicalUrl(baseUrl, route.path)

    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: config.name,
      description: config.description,
      image: `${baseUrl}/android-chrome-512x512.png`,
      totalTime: config.totalTime || 'PT5M',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'USD',
        value: '0'
      },
      supply: config.supplies?.map(supply => ({
        '@type': 'HowToSupply',
        name: supply
      })) || [],
      tool: config.tools?.map(tool => ({
        '@type': 'HowToTool',
        name: tool
      })) || [],
      step: config.steps.map((step, index) => ({
        '@type': 'HowToStep',
        name: step.name,
        text: step.text,
        image: step.image,
        url: `${fullUrl}#step-${index + 1}`
      }))
    }
  }

  // 服务结构化数据
  const getServiceSchema = (config: {
    name: string
    description: string
    serviceUrl?: string
    rating?: { value: string; count: string }
  }): ServiceSchema => {
    const fullUrl = getCanonicalUrl(baseUrl, route.path)

    const schema: ServiceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: config.name,
      description: config.description,
      provider: {
        '@type': 'Organization',
        name: 'TryUtils',
        url: baseUrl
      },
      areaServed: 'Worldwide',
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: config.serviceUrl || fullUrl
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    }

    if (config.rating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: config.rating.value,
        ratingCount: config.rating.count
      }
    }

    return schema
  }

  // 产品结构化数据
  const getProductSchema = (config: {
    name: string
    description: string
    image?: string
    rating?: { value: string; count: string }
  }): ProductSchema => {
    const schema: ProductSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: config.name,
      description: config.description,
      image: config.image || `${baseUrl}/android-chrome-512x512.png`,
      brand: {
        '@type': 'Brand',
        name: 'TryUtils'
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      }
    }

    if (config.rating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: config.rating.value,
        ratingCount: config.rating.count
      }
    }

    return schema
  }

  // 设置增强结构化数据到页面
  // 使用 key 来避免重复添加相同类型的结构化数据
  const setEnhancedStructuredData = (schemas: any[]) => {
    useHead({
      script: schemas.map(schema => ({
        key: `structured-data-${schema['@type']}`,
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema)
      }))
    })
  }

  return {
    getFAQPageSchema,
    getHowToSchema,
    getServiceSchema,
    getProductSchema,
    setEnhancedStructuredData
  }
}
