import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  getImageLoadingAttribute,
  validateImageLazyLoading,
  generatePreloadHints,
  validatePreloadHintsPresence,
  validatePreloadHintStructure,
  type CriticalResource,
  type PreloadHint
} from './usePerformanceOptimization'

/**
 * Property-based tests for Performance Optimization
 * Tests image lazy loading and preload hints
 */

// Arbitrary for generating boolean values (isBelowFold)
const booleanArbitrary = fc.boolean()

// Arbitrary for generating valid loading attribute values
const loadingAttrArbitrary = fc.constantFrom('lazy', 'eager', null, undefined)

// Arbitrary for generating valid resource types
const resourceTypeArbitrary = fc.constantFrom('image', 'style', 'script', 'font') as fc.Arbitrary<'image' | 'style' | 'script' | 'font'>

// Arbitrary for generating valid URLs/paths
const urlArbitrary = fc.oneof(
  fc.constant('https://example.com/image.jpg'),
  fc.constant('https://fonts.googleapis.com/css2?family=Inter'),
  fc.constant('/assets/logo.png'),
  fc.constant('/scripts/main.js'),
  fc.webUrl()
)

// Arbitrary for generating critical resources
const criticalResourceArbitrary: fc.Arbitrary<CriticalResource> = fc.record({
  href: urlArbitrary,
  as: resourceTypeArbitrary,
  type: fc.option(fc.constantFrom('text/css', 'application/javascript', 'image/webp', 'font/woff2'), { nil: undefined }),
  crossorigin: fc.option(fc.constantFrom('', 'anonymous', 'use-credentials') as fc.Arbitrary<'' | 'anonymous' | 'use-credentials'>, { nil: undefined }),
  media: fc.option(fc.constantFrom('(max-width: 768px)', '(min-width: 1024px)', 'screen'), { nil: undefined })
})

// Arbitrary for generating arrays of critical resources
const criticalResourcesArbitrary = fc.array(criticalResourceArbitrary, { minLength: 1, maxLength: 10 })

describe('Performance Optimization Property Tests', () => {
  /**
   * **Feature: seo-optimization, Property 14: Image lazy loading**
   * **Validates: Requirements 7.2**
   * 
   * For any image element below the fold, the loading attribute should be set to "lazy".
   */
  describe('Property 14: Image lazy loading', () => {
    it('should return "lazy" for below-the-fold images', () => {
      fc.assert(
        fc.property(fc.constant(true), (isBelowFold) => {
          const loadingAttr = getImageLoadingAttribute(isBelowFold)
          return loadingAttr === 'lazy'
        }),
        { numRuns: 100 }
      )
    })

    it('should return "eager" for above-the-fold images', () => {
      fc.assert(
        fc.property(fc.constant(false), (isBelowFold) => {
          const loadingAttr = getImageLoadingAttribute(isBelowFold)
          return loadingAttr === 'eager'
        }),
        { numRuns: 100 }
      )
    })

    it('should always return either "lazy" or "eager"', () => {
      fc.assert(
        fc.property(booleanArbitrary, (isBelowFold) => {
          const loadingAttr = getImageLoadingAttribute(isBelowFold)
          return loadingAttr === 'lazy' || loadingAttr === 'eager'
        }),
        { numRuns: 100 }
      )
    })

    it('should validate that below-the-fold images have loading="lazy"', () => {
      fc.assert(
        fc.property(fc.constant(true), () => {
          // Below-the-fold image with loading="lazy" should be valid
          const isValid = validateImageLazyLoading('lazy', true)
          return isValid === true
        }),
        { numRuns: 100 }
      )
    })

    it('should invalidate below-the-fold images without loading="lazy"', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('eager', null, undefined),
          (loadingAttr) => {
            // Below-the-fold image without loading="lazy" should be invalid
            const isValid = validateImageLazyLoading(loadingAttr as string | null | undefined, true)
            return isValid === false
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should validate above-the-fold images with eager or no loading attribute', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('eager', null, undefined),
          (loadingAttr) => {
            // Above-the-fold image with eager or no loading attribute should be valid
            const isValid = validateImageLazyLoading(loadingAttr as string | null | undefined, false)
            return isValid === true
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should be consistent: getImageLoadingAttribute output validates correctly', () => {
      fc.assert(
        fc.property(booleanArbitrary, (isBelowFold) => {
          const loadingAttr = getImageLoadingAttribute(isBelowFold)
          const isValid = validateImageLazyLoading(loadingAttr, isBelowFold)
          return isValid === true
        }),
        { numRuns: 100 }
      )
    })

    it('should handle the loading attribute deterministically', () => {
      fc.assert(
        fc.property(booleanArbitrary, (isBelowFold) => {
          const attr1 = getImageLoadingAttribute(isBelowFold)
          const attr2 = getImageLoadingAttribute(isBelowFold)
          return attr1 === attr2
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * **Feature: seo-optimization, Property 15: Preload hints presence**
   * **Validates: Requirements 7.4**
   * 
   * For any page with critical resources, the head should contain 
   * preload link tags for those resources.
   */
  describe('Property 15: Preload hints presence', () => {
    it('should generate preload hints for all critical resources', () => {
      fc.assert(
        fc.property(criticalResourcesArbitrary, (resources) => {
          const hints = generatePreloadHints(resources)
          return hints.length === resources.length
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve href in generated preload hints', () => {
      fc.assert(
        fc.property(criticalResourcesArbitrary, (resources) => {
          const hints = generatePreloadHints(resources)
          return resources.every((resource, index) => 
            hints[index].href === resource.href
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve "as" attribute in generated preload hints', () => {
      fc.assert(
        fc.property(criticalResourcesArbitrary, (resources) => {
          const hints = generatePreloadHints(resources)
          return resources.every((resource, index) => 
            hints[index].as === resource.as
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should validate preload hints presence for critical resources', () => {
      fc.assert(
        fc.property(criticalResourcesArbitrary, (resources) => {
          const hints = generatePreloadHints(resources)
          const criticalUrls = resources.map(r => r.href)
          return validatePreloadHintsPresence(hints, criticalUrls)
        }),
        { numRuns: 100 }
      )
    })

    it('should fail validation when critical resources are missing preload hints', () => {
      fc.assert(
        fc.property(
          criticalResourcesArbitrary,
          fc.webUrl(),
          (resources, extraUrl) => {
            const hints = generatePreloadHints(resources)
            const criticalUrls = [...resources.map(r => r.href), extraUrl]
            // Should fail because extraUrl is not in hints
            return !validatePreloadHintsPresence(hints, criticalUrls)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should generate valid preload hint structure', () => {
      fc.assert(
        fc.property(criticalResourcesArbitrary, (resources) => {
          const hints = generatePreloadHints(resources)
          return hints.every(hint => validatePreloadHintStructure(hint))
        }),
        { numRuns: 100 }
      )
    })

    it('should handle empty resources array', () => {
      const hints = generatePreloadHints([])
      expect(hints).toEqual([])
      expect(validatePreloadHintsPresence(hints, [])).toBe(true)
    })

    it('should include optional properties when provided', () => {
      fc.assert(
        fc.property(criticalResourceArbitrary, (resource) => {
          const hints = generatePreloadHints([resource])
          const hint = hints[0]
          
          // Check that optional properties are included when provided
          if (resource.type !== undefined) {
            if (hint.type !== resource.type) return false
          }
          if (resource.crossorigin !== undefined) {
            if (hint.crossorigin !== resource.crossorigin) return false
          }
          if (resource.media !== undefined) {
            if (hint.media !== resource.media) return false
          }
          
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should validate that "as" attribute is one of valid values', () => {
      fc.assert(
        fc.property(criticalResourcesArbitrary, (resources) => {
          const hints = generatePreloadHints(resources)
          const validAsValues = ['image', 'style', 'script', 'font']
          return hints.every(hint => validAsValues.includes(hint.as))
        }),
        { numRuns: 100 }
      )
    })

    it('should reject invalid preload hint structures', () => {
      // Test with missing href
      const invalidHint1: PreloadHint = { href: '', as: 'style' }
      expect(validatePreloadHintStructure(invalidHint1)).toBe(false)
      
      // Test with invalid as value
      const invalidHint2 = { href: 'https://example.com', as: 'invalid' } as unknown as PreloadHint
      expect(validatePreloadHintStructure(invalidHint2)).toBe(false)
    })
  })

  describe('Integration: Lazy loading and preload hints work together', () => {
    it('should support both lazy loading for images and preload hints for critical resources', () => {
      fc.assert(
        fc.property(
          booleanArbitrary,
          criticalResourcesArbitrary,
          (isBelowFold, resources) => {
            // Get loading attribute for image
            const loadingAttr = getImageLoadingAttribute(isBelowFold)
            
            // Generate preload hints for critical resources
            const hints = generatePreloadHints(resources)
            
            // Both should work correctly
            const loadingValid = validateImageLazyLoading(loadingAttr, isBelowFold)
            const hintsValid = hints.every(hint => validatePreloadHintStructure(hint))
            
            return loadingValid && hintsValid
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
