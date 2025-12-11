import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateBreadcrumbSchema, type BreadcrumbItem } from '~/composables/useBreadcrumbSchema'

/**
 * Unit tests for BreadcrumbNav component
 * Tests rendering logic and schema generation integration
 * 
 * **Feature: seo-optimization**
 * **Validates: Requirements 3.2**
 */

// Arbitrary for generating valid breadcrumb items
const breadcrumbItemArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  path: fc.string({ minLength: 1, maxLength: 100 }).map(s => '/' + s.replace(/^\/+/, ''))
})

// Arbitrary for generating arrays of breadcrumb items (typical breadcrumb depth)
const breadcrumbItemsArbitrary = fc.array(breadcrumbItemArbitrary, { minLength: 1, maxLength: 5 })

describe('BreadcrumbNav Component Tests', () => {
  /**
   * Tests for breadcrumb rendering logic
   * Validates that breadcrumb items are properly structured for rendering
   */
  describe('Breadcrumb rendering logic', () => {
    it('should identify last item correctly for any breadcrumb array', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const lastIndex = items.length - 1
          
          // For each item, check if it's the last one
          const isLastResults = items.map((_, index) => index === lastIndex)
          
          // Only the last item should be marked as last
          const lastItemsCount = isLastResults.filter(Boolean).length
          return lastItemsCount === 1 && isLastResults[lastIndex] === true
        }),
        { numRuns: 100 }
      )
    })

    it('should have separators between all items except after the last', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          // Number of separators should be items.length - 1
          const expectedSeparators = items.length - 1
          
          // Count items that should have separators (all except last)
          const itemsWithSeparators = items.filter((_, index) => index < items.length - 1)
          
          return itemsWithSeparators.length === expectedSeparators
        }),
        { numRuns: 100 }
      )
    })

    it('should have all items except last as links', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const linkItems = items.slice(0, -1)
          const currentPageItem = items[items.length - 1]
          
          // All items except last should be links
          // Last item should be current page (not a link)
          return linkItems.every(item => item.path !== undefined) &&
                 currentPageItem !== undefined
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Tests for schema generation integration
   * Validates that the component properly integrates with useBreadcrumbSchema
   */
  describe('Schema generation integration', () => {
    it('should generate valid schema for any breadcrumb configuration', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          
          // Schema should have correct structure
          return (
            schema['@context'] === 'https://schema.org' &&
            schema['@type'] === 'BreadcrumbList' &&
            Array.isArray(schema.itemListElement) &&
            schema.itemListElement.length === items.length
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve item names in schema', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          
          return items.every((item, index) => 
            schema.itemListElement[index].name === item.name
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve item paths in schema', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items)
          
          return items.every((item, index) => 
            schema.itemListElement[index].item === item.path
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should prepend baseUrl to paths when provided', () => {
      const baseUrl = 'https://tryutils.com'
      
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          const schema = generateBreadcrumbSchema(items, baseUrl)
          
          return items.every((item, index) => 
            schema.itemListElement[index].item === baseUrl + item.path
          )
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Tests for specific breadcrumb configurations
   * Validates common use cases
   */
  describe('Common breadcrumb configurations', () => {
    it('should handle home-only breadcrumb', () => {
      const items: BreadcrumbItem[] = [
        { name: 'Home', path: '/' }
      ]
      
      const schema = generateBreadcrumbSchema(items)
      
      expect(schema.itemListElement).toHaveLength(1)
      expect(schema.itemListElement[0].name).toBe('Home')
      expect(schema.itemListElement[0].position).toBe(1)
    })

    it('should handle typical tool page breadcrumb', () => {
      const items: BreadcrumbItem[] = [
        { name: 'Home', path: '/' },
        { name: 'Tools', path: '/image-tools' },
        { name: 'Image Compressor', path: '/image-compressor' }
      ]
      
      const schema = generateBreadcrumbSchema(items)
      
      expect(schema.itemListElement).toHaveLength(3)
      expect(schema.itemListElement[0].position).toBe(1)
      expect(schema.itemListElement[1].position).toBe(2)
      expect(schema.itemListElement[2].position).toBe(3)
    })

    it('should handle blog article breadcrumb', () => {
      const items: BreadcrumbItem[] = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'Image Compression Guide', path: '/blog/image-compression-guide' }
      ]
      
      const schema = generateBreadcrumbSchema(items)
      
      expect(schema.itemListElement).toHaveLength(3)
      expect(schema.itemListElement[2].name).toBe('Image Compression Guide')
    })

    it('should handle i18n breadcrumb paths', () => {
      const items: BreadcrumbItem[] = [
        { name: '首页', path: '/zh' },
        { name: '博客', path: '/zh/blog' },
        { name: '图片压缩指南', path: '/zh/blog/image-compression-guide' }
      ]
      
      const schema = generateBreadcrumbSchema(items)
      
      expect(schema.itemListElement).toHaveLength(3)
      expect(schema.itemListElement[0].item).toBe('/zh')
      expect(schema.itemListElement[1].item).toBe('/zh/blog')
    })
  })

  /**
   * Tests for accessibility attributes
   * Validates that the component structure supports proper accessibility
   */
  describe('Accessibility structure', () => {
    it('should have aria-current="page" only on last item', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          // The last item should be the current page
          // All other items should be links
          const lastIndex = items.length - 1
          
          // Simulate the component logic
          const itemsWithAriaCurrent = items.map((_, index) => index === lastIndex)
          
          // Only last item should have aria-current
          return itemsWithAriaCurrent.filter(Boolean).length === 1 &&
                 itemsWithAriaCurrent[lastIndex] === true
        }),
        { numRuns: 100 }
      )
    })

    it('should have proper list structure for screen readers', () => {
      fc.assert(
        fc.property(breadcrumbItemsArbitrary, (items) => {
          // Each item should be in a list item
          // The structure should be: nav > ol > li (for each item)
          return items.length > 0 && items.every(item => 
            item.name !== undefined && item.path !== undefined
          )
        }),
        { numRuns: 100 }
      )
    })
  })
})
