import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateHreflangTags,
  getHtmlLangAttribute,
  generateCanonicalUrl,
  validateHreflangCompleteness,
  validateCanonicalUrlConsistency,
  type LocaleConfig,
  type MultiLanguageSEOConfig
} from './useMultiLanguageSEO'

/**
 * Property-based tests for Multi-language SEO
 * Tests hreflang tags, HTML lang attribute, and canonical URL
 */

// Standard locale configuration used in the application
const standardLocales: LocaleConfig[] = [
  { code: 'zh', iso: 'zh-CN' },
  { code: 'en', iso: 'en-US' }
]

const defaultLocale = 'zh'
const baseUrl = 'https://www.tryutils.com'

// Arbitrary for generating valid URL paths
const pathArbitrary = fc.oneof(
  fc.constant('/'),
  fc.constant('/image-compressor'),
  fc.constant('/heic-converter'),
  fc.constant('/image-format-converter'),
  fc.constant('/blog'),
  fc.constant('/about'),
  fc.constant('/contact'),
  fc.constant('/privacy'),
  fc.constant('/en'),
  fc.constant('/en/image-compressor'),
  fc.constant('/en/heic-converter'),
  fc.constant('/en/blog'),
  fc.constant('/en/about')
)

// Arbitrary for generating locale codes
const localeArbitrary = fc.constantFrom('zh', 'en')

// Helper to create config
function createConfig(currentPath: string, currentLocale: string): MultiLanguageSEOConfig {
  return {
    baseUrl,
    locales: standardLocales,
    defaultLocale,
    currentLocale,
    currentPath
  }
}

describe('Multi-language SEO Property Tests', () => {
  /**
   * **Feature: seo-optimization, Property 11: Hreflang tags completeness**
   * **Validates: Requirements 6.1**
   * 
   * For any page, the rendered HTML should include hreflang link tags 
   * for all configured locales (zh, en).
   */
  describe('Property 11: Hreflang tags completeness', () => {
    it('should generate hreflang tags for all configured locales', () => {
      fc.assert(
        fc.property(pathArbitrary, localeArbitrary, (path, locale) => {
          const config = createConfig(path, locale)
          const tags = generateHreflangTags(config)
          
          // Should have tags for zh, en, and x-default
          const hreflangValues = tags.map(t => t.hreflang)
          return (
            hreflangValues.includes('zh') &&
            hreflangValues.includes('en') &&
            hreflangValues.includes('x-default')
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should always include x-default hreflang tag', () => {
      fc.assert(
        fc.property(pathArbitrary, localeArbitrary, (path, locale) => {
          const config = createConfig(path, locale)
          const tags = generateHreflangTags(config)
          
          return tags.some(tag => tag.hreflang === 'x-default')
        }),
        { numRuns: 100 }
      )
    })

    it('should have exactly locales.length + 1 tags (locales + x-default)', () => {
      fc.assert(
        fc.property(pathArbitrary, localeArbitrary, (path, locale) => {
          const config = createConfig(path, locale)
          const tags = generateHreflangTags(config)
          
          // 2 locales + 1 x-default = 3 tags
          return tags.length === standardLocales.length + 1
        }),
        { numRuns: 100 }
      )
    })

    it('should have all tags with rel="alternate"', () => {
      fc.assert(
        fc.property(pathArbitrary, localeArbitrary, (path, locale) => {
          const config = createConfig(path, locale)
          const tags = generateHreflangTags(config)
          
          return tags.every(tag => tag.rel === 'alternate')
        }),
        { numRuns: 100 }
      )
    })

    it('should have all tags with valid href starting with baseUrl', () => {
      fc.assert(
        fc.property(pathArbitrary, localeArbitrary, (path, locale) => {
          const config = createConfig(path, locale)
          const tags = generateHreflangTags(config)
          
          return tags.every(tag => tag.href.startsWith(baseUrl))
        }),
        { numRuns: 100 }
      )
    })

    it('should pass validateHreflangCompleteness check', () => {
      fc.assert(
        fc.property(pathArbitrary, localeArbitrary, (path, locale) => {
          const config = createConfig(path, locale)
          const tags = generateHreflangTags(config)
          
          return validateHreflangCompleteness(tags, ['zh', 'en'])
        }),
        { numRuns: 100 }
      )
    })

    it('should have unique hreflang values (no duplicates)', () => {
      fc.assert(
        fc.property(pathArbitrary, localeArbitrary, (path, locale) => {
          const config = createConfig(path, locale)
          const tags = generateHreflangTags(config)
          
          const hreflangValues = tags.map(t => t.hreflang)
          const uniqueValues = new Set(hreflangValues)
          return hreflangValues.length === uniqueValues.size
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * **Feature: seo-optimization, Property 12: HTML lang attribute correctness**
   * **Validates: Requirements 6.2**
   * 
   * For any page render, the html lang attribute should match the current locale value.
   */
  describe('Property 12: HTML lang attribute correctness', () => {
    it('should return correct ISO code for zh locale', () => {
      expect(getHtmlLangAttribute('zh')).toBe('zh-CN')
    })

    it('should return correct ISO code for en locale', () => {
      expect(getHtmlLangAttribute('en')).toBe('en-US')
    })

    it('should return a valid lang attribute for any configured locale', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const langAttr = getHtmlLangAttribute(locale)
          
          // Should be a non-empty string
          if (typeof langAttr !== 'string' || langAttr.length === 0) {
            return false
          }
          
          // Should match expected format (xx or xx-XX)
          const langPattern = /^[a-z]{2}(-[A-Z]{2})?$/
          return langPattern.test(langAttr)
        }),
        { numRuns: 100 }
      )
    })

    it('should return consistent lang attribute for same locale', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const lang1 = getHtmlLangAttribute(locale)
          const lang2 = getHtmlLangAttribute(locale)
          return lang1 === lang2
        }),
        { numRuns: 100 }
      )
    })

    it('should return different lang attributes for different locales', () => {
      const zhLang = getHtmlLangAttribute('zh')
      const enLang = getHtmlLangAttribute('en')
      expect(zhLang).not.toBe(enLang)
    })

    it('should start with the locale code', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const langAttr = getHtmlLangAttribute(locale)
          return langAttr.startsWith(locale)
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * **Feature: seo-optimization, Property 13: Canonical URL language consistency**
   * **Validates: Requirements 6.4**
   * 
   * For any language switch action, the canonical URL should update 
   * to reflect the new language path.
   */
  describe('Property 13: Canonical URL language consistency', () => {
    it('should generate canonical URL starting with baseUrl', () => {
      fc.assert(
        fc.property(pathArbitrary, (path) => {
          const canonical = generateCanonicalUrl(baseUrl, path)
          return canonical.startsWith(baseUrl)
        }),
        { numRuns: 100 }
      )
    })

    it('should include the current path in canonical URL', () => {
      fc.assert(
        fc.property(pathArbitrary, (path) => {
          const canonical = generateCanonicalUrl(baseUrl, path)
          const normalizedPath = path.startsWith('/') ? path : '/' + path
          return canonical.includes(normalizedPath)
        }),
        { numRuns: 100 }
      )
    })

    it('should generate valid URL format', () => {
      fc.assert(
        fc.property(pathArbitrary, (path) => {
          const canonical = generateCanonicalUrl(baseUrl, path)
          
          try {
            new URL(canonical)
            return true
          } catch {
            return false
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should have canonical URL consistent with default locale (no prefix)', () => {
      // For default locale (zh), paths should not have /zh prefix
      const zhPaths = ['/', '/image-compressor', '/blog', '/about']
      
      for (const path of zhPaths) {
        const canonical = generateCanonicalUrl(baseUrl, path)
        const isConsistent = validateCanonicalUrlConsistency(
          canonical, 
          'zh', 
          defaultLocale, 
          baseUrl
        )
        expect(isConsistent).toBe(true)
      }
    })

    it('should have canonical URL consistent with non-default locale (with prefix)', () => {
      // For non-default locale (en), paths should have /en prefix
      const enPaths = ['/en', '/en/image-compressor', '/en/blog', '/en/about']
      
      for (const path of enPaths) {
        const canonical = generateCanonicalUrl(baseUrl, path)
        const isConsistent = validateCanonicalUrlConsistency(
          canonical, 
          'en', 
          defaultLocale, 
          baseUrl
        )
        expect(isConsistent).toBe(true)
      }
    })

    it('should update canonical URL when path changes', () => {
      const path1 = '/image-compressor'
      const path2 = '/heic-converter'
      
      const canonical1 = generateCanonicalUrl(baseUrl, path1)
      const canonical2 = generateCanonicalUrl(baseUrl, path2)
      
      expect(canonical1).not.toBe(canonical2)
      expect(canonical1).toContain('image-compressor')
      expect(canonical2).toContain('heic-converter')
    })

    it('should handle root path correctly', () => {
      const canonical = generateCanonicalUrl(baseUrl, '/')
      expect(canonical).toBe(`${baseUrl}/`)
    })

    it('should normalize paths without leading slash', () => {
      const withSlash = generateCanonicalUrl(baseUrl, '/about')
      const withoutSlash = generateCanonicalUrl(baseUrl, 'about')
      
      // Both should produce valid URLs with the path
      expect(withSlash).toContain('/about')
      expect(withoutSlash).toContain('/about')
    })
  })

  describe('Integration: Hreflang and Canonical URL consistency', () => {
    it('should have matching paths between hreflang tags for same page', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/', '/image-compressor', '/blog', '/about'),
          (basePath) => {
            // Test for default locale page
            const config = createConfig(basePath, 'zh')
            const tags = generateHreflangTags(config)
            
            // Find zh and en tags
            const zhTag = tags.find(t => t.hreflang === 'zh')
            const enTag = tags.find(t => t.hreflang === 'en')
            
            if (!zhTag || !enTag) return false
            
            // zh path should be the base path
            // en path should be /en + base path
            const zhPath = zhTag.href.replace(baseUrl, '')
            const enPath = enTag.href.replace(baseUrl, '')
            
            if (basePath === '/') {
              return zhPath === '/' && enPath === '/en'
            }
            
            return zhPath === basePath && enPath === `/en${basePath}`
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
