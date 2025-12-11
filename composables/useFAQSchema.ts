/**
 * FAQ Schema Composable
 * Generates FAQPage structured data in JSON-LD format
 * 
 * @see https://schema.org/FAQPage
 * **Feature: seo-optimization, Property 3: FAQ structured data format**
 * **Validates: Requirements 2.1, 2.2**
 */

export interface FAQItem {
  question: string
  answer: string
  category?: string
}

export interface FAQPageSchema {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}

/**
 * Generates FAQPage structured data from an array of FAQ items
 * @param items - Array of FAQ items with question and answer
 * @returns FAQPageSchema object ready for JSON-LD injection
 */
export function generateFAQSchema(items: FAQItem[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>/g, '') // Remove HTML tags for clean text
      }
    }))
  }
}

/**
 * Composable for injecting FAQ structured data into the page head
 * Uses nuxt-schema-org compatible approach with useHead
 * 
 * @param items - Reactive or static array of FAQ items
 */
export function useFAQSchema(items: FAQItem[] | Ref<FAQItem[]>) {
  const faqItems = isRef(items) ? items : ref(items)
  
  const schema = computed(() => generateFAQSchema(faqItems.value))
  
  useHead({
    script: [
      {
        key: 'faq-schema',
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify(schema.value))
      }
    ]
  })
  
  return {
    schema
  }
}
