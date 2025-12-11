import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateBreadcrumbSchema, type BreadcrumbItem, type BreadcrumbListSchema } from './useBreadcrumbSchema'

/**
 * Property-based tests for BreadcrumbList Schema generation
 * **Feature: seo-optimization, Property 16: BreadcrumbList structured data format**
 * **Validates: Requirements 3.2**
 */

// Arbitrary for generating valid breadcrumb items
const breadcrumbItemArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  path: fc.string({ minLength: 1, maxLength: 100 }).map(s => '/' + s.replace(/^\/+/, ''))
})

// Arbitrary for generating arrays of breadcrumb items
const breadcrumbItemsArbitrary = fc.array(breadcrumbItemArbitrary, { minLength: 1, maxLength: 10 })

// Arbitrary for generating base URLs
const baseUrlArbitrary = fc.constantFrom(
  'https://example.com',
  'https://tryutils.com',
  'http://localhost:3000',
  ''
)

// Helper to validate BreadcrumbList schema structure
function isValidBreadcrumbListSchema(schema: BreadcrumbListSchema): boolean {
  return (
    schema['@context'] === 'https://schema.org' &&
    schema['@type'] === 'BreadcrumbList' &&
    Array.isArray(schema.itemListElement)
  )
}

// Helper to validate ListItem schema structure
function isValidListItemSchema(item: BreadcrumbListSchema['itemListElement'][number]): boolean {
  return (
    item['@type'] === 'ListItem' &&
    typeof item.position === 'number' &&
    item.position > 0 &&
    typeof item.name === 'string' &&
    typeof item.item === 'string'
  )
}

describe('BreadcrumbList Schema Property Tests', () => {
  /**
   * **Feature: seo-optimization, Property 16: BreadcrumbList structured data format**
   * **Validates: Requirements 3.2**
   * 
   * For any page with breadcrumb navigation, the generated JSON-LD should be valid
   * BreadcrumbList schema with itemListElement array containing ListItem objects
   * with position, name, and item properties.
   */
  describe('Property 16: BreadcrumbList structured data format', () => {
    it('should generate valid BreadcrumbList schema structure for any items', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          return isValidBreadcrumbListSchema(schema)
        }),
        { numRuns: 100 }
      )
    })

    it('should have @context set to https://schema.org', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          return schema['@context'] === 'https://schema.org'
        }),
        { numRuns: 100 }
      )
    })

    it('should have @type set to BreadcrumbList', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          return schema['@type'] === 'BreadcrumbList'
        }),
        { numRuns: 100 }
      )
    })

    it('should have itemListElement array with same length as input items', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          return schema.itemListElement.length === items.length
        }),
        { numRuns: 100 }
      )
    })

    it('should generate valid ListItem schema for each breadcrumb', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          return schema.itemListElement.every(isValidListItemSchema)
        }),
        { numRuns: 100 }
      )
    })

    it('should assign sequential position numbers starting from 1', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          return schema.itemListElement.every((item, index) => item.position === index + 1)
        }),
        { numRuns: 100 }
      )
    })

    it('should map name property correctly from input', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          return items.every((inputItem, index) => 
            schema.itemListElement[index].name === inputItem.name
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should set item property to path when no baseUrl provided', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          return items.every((inputItem, index) => 
            schema.itemListElement[index].item === inputItem.path
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should prepend baseUrl to item property when provided', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, baseUrlArbitrary, (items, baseUrl) => {
          const schema = generateBreadcrumbSchema(items, baseUrl)
          return items.every((inputItem, index) => 
            schema.itemListElement[index].item === baseUrl + inputItem.path
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should handle empty items array gracefully', () => {
      const schema = generateBreadcrumbSchema([])
      expect(isValidBreadcrumbListSchema(schema)).toBe(true)
      expect(schema.itemListElement).toHaveLength(0)
    })

    it('should produce valid JSON when stringified', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          try {
            const json = JSON.stringify(schema)
            const parsed = JSON.parse(json)
            return parsed['@type'] === 'BreadcrumbList'
          } catch {
            return false
          }
        }),
        { numRuns: 100 }
      )
    })
  })
})
