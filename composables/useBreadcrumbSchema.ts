/**
 * Breadcrumb Schema Composable
 * Generates BreadcrumbList structured data in JSON-LD format
 * 
 * @see https://schema.org/BreadcrumbList
 * **Feature: seo-optimization, Property 16: BreadcrumbList structured data format**
 * **Validates: Requirements 3.2**
 */

export interface BreadcrumbItem {
  name: string
  path: string
}

export interface BreadcrumbListSchema {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

/**
 * Generates BreadcrumbList structured data from an array of breadcrumb items
 * @param items - Array of breadcrumb items with name and path
 * @param baseUrl - Optional base URL to prepend to paths (defaults to empty string)
 * @returns BreadcrumbListSchema object ready for JSON-LD injection
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string = ''): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: baseUrl + item.path
    }))
  }
}

/**
 * Composable for injecting BreadcrumbList structured data into the page head
 * Uses nuxt-schema-org compatible approach with useHead
 * 
 * @param items - Reactive or static array of breadcrumb items
 * @param baseUrl - Optional base URL to prepend to paths
 */
export function useBreadcrumbSchema(items: BreadcrumbItem[] | Ref<BreadcrumbItem[]>, baseUrl?: string) {
  const breadcrumbItems = isRef(items) ? items : ref(items)
  const siteUrl = baseUrl ?? ''
  
  const schema = computed(() => generateBreadcrumbSchema(breadcrumbItems.value, siteUrl))
  
  useHead({
    script: [
      {
        key: 'breadcrumb-schema',
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify(schema.value))
      }
    ]
  })
  
  return {
    schema
  }
}
