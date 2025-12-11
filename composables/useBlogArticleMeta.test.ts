import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateBlogTitle,
  generateBlogDescription,
  generateBlogArticleMeta,
  descriptionContainsDate,
  formatDate,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  type BlogArticleMetaConfig
} from './useBlogArticleMeta'

/**
 * Property-based tests for Blog Article Meta generation
 * **Feature: seo-optimization, Property 9: Blog article date in description**
 * **Validates: Requirements 5.1, 5.2, 5.3**
 */

// Arbitrary for generating article titles (realistic lengths)
const articleTitleArbitrary = fc.string({ minLength: 1, maxLength: 100 })

// Arbitrary for generating article descriptions (realistic lengths)
const articleDescriptionArbitrary = fc.string({ minLength: 1, maxLength: 300 })

// Arbitrary for generating valid dates
const dateArbitrary = fc.date({
  min: new Date('2020-01-01'),
  max: new Date('2030-12-31')
})

// Arbitrary for locale
const localeArbitrary = fc.constantFrom('zh' as const, 'en' as const)

// Arbitrary for complete blog article meta config
const blogArticleMetaConfigArbitrary: fc.Arbitrary<BlogArticleMetaConfig> = fc.record({
  title: articleTitleArbitrary,
  description: articleDescriptionArbitrary,
  date: dateArbitrary,
  author: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  locale: fc.option(localeArbitrary, { nil: undefined }),
  keywords: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 10 }), { nil: undefined })
})

describe('Blog Article Meta Property Tests', () => {
  /**
   * **Feature: seo-optimization, Property 9: Blog article date in description**
   * **Validates: Requirements 5.3**
   * 
   * For any blog article, the meta description should contain a date string
   * in recognizable format.
   */
  describe('Property 9: Blog article date in description', () => {
    it('should include date in description for any valid date in zh locale', () => {
      fc.assert(
        fc.property(articleDescriptionArbitrary, dateArbitrary, (description, date) => {
          const result = generateBlogDescription(description, date, 'zh')
          return descriptionContainsDate(result)
        }),
        { numRuns: 100 }
      )
    })

    it('should include date in description for any valid date in en locale', () => {
      fc.assert(
        fc.property(articleDescriptionArbitrary, dateArbitrary, (description, date) => {
          const result = generateBlogDescription(description, date, 'en')
          return descriptionContainsDate(result)
        }),
        { numRuns: 100 }
      )
    })

    it('should include date in description for any locale', () => {
      fc.assert(
        fc.property(articleDescriptionArbitrary, dateArbitrary, localeArbitrary, (description, date, locale) => {
          const result = generateBlogDescription(description, date, locale)
          return descriptionContainsDate(result)
        }),
        { numRuns: 100 }
      )
    })

    it('should include date in description via generateBlogArticleMeta', () => {
      fc.assert(
        fc.property(blogArticleMetaConfigArbitrary, (config) => {
          const meta = generateBlogArticleMeta(config)
          return descriptionContainsDate(meta.description)
        }),
        { numRuns: 100 }
      )
    })

    it('should handle date string input', () => {
      const description = generateBlogDescription('Test article', '2024-06-15', 'en')
      expect(descriptionContainsDate(description)).toBe(true)
    })

    it('should handle Date object input', () => {
      const description = generateBlogDescription('Test article', new Date('2024-06-15'), 'en')
      expect(descriptionContainsDate(description)).toBe(true)
    })

    it('should handle invalid date gracefully', () => {
      const description = generateBlogDescription('Test article', 'invalid-date', 'en')
      // Should still contain some date indicator (even if "Date unknown")
      expect(description.length).toBeGreaterThan(0)
    })
  })

  describe('Title length constraint for blog articles', () => {
    it('should generate titles under 60 characters for any article title', () => {
      fc.assert(
        fc.property(articleTitleArbitrary, (title) => {
          const result = generateBlogTitle(title)
          return result.length <= MAX_TITLE_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should generate titles under 60 characters via generateBlogArticleMeta', () => {
      fc.assert(
        fc.property(blogArticleMetaConfigArbitrary, (config) => {
          const meta = generateBlogArticleMeta(config)
          return meta.title.length <= MAX_TITLE_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should handle very long titles by truncating', () => {
      const veryLongTitle = 'A'.repeat(100)
      const title = generateBlogTitle(veryLongTitle)
      expect(title.length).toBeLessThanOrEqual(MAX_TITLE_LENGTH)
    })
  })

  describe('Description length constraint for blog articles', () => {
    it('should generate descriptions under 160 characters for any article', () => {
      fc.assert(
        fc.property(articleDescriptionArbitrary, dateArbitrary, localeArbitrary, (description, date, locale) => {
          const result = generateBlogDescription(description, date, locale)
          return result.length <= MAX_DESCRIPTION_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should generate descriptions under 160 characters via generateBlogArticleMeta', () => {
      fc.assert(
        fc.property(blogArticleMetaConfigArbitrary, (config) => {
          const meta = generateBlogArticleMeta(config)
          return meta.description.length <= MAX_DESCRIPTION_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should handle very long descriptions by truncating', () => {
      const veryLongDescription = 'B'.repeat(300)
      const description = generateBlogDescription(veryLongDescription, new Date(), 'en')
      expect(description.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH)
    })
  })

  describe('formatDate helper', () => {
    it('should format dates correctly for zh locale', () => {
      const date = new Date('2024-06-15')
      const formatted = formatDate(date, 'zh')
      expect(formatted).toContain('2024')
      expect(formatted).toContain('6')
      expect(formatted).toContain('15')
    })

    it('should format dates correctly for en locale', () => {
      const date = new Date('2024-06-15')
      const formatted = formatDate(date, 'en')
      expect(formatted).toContain('2024')
      expect(formatted).toContain('June')
      expect(formatted).toContain('15')
    })

    it('should handle invalid date strings', () => {
      const formatted = formatDate('invalid', 'en')
      expect(formatted).toBe('Date unknown')
    })

    it('should handle invalid date strings in zh locale', () => {
      const formatted = formatDate('invalid', 'zh')
      expect(formatted).toBe('日期未知')
    })
  })

  describe('descriptionContainsDate helper', () => {
    it('should detect bracketed date format', () => {
      expect(descriptionContainsDate('[June 15, 2024] Article content')).toBe(true)
      expect(descriptionContainsDate('[2024年6月15日] 文章内容')).toBe(true)
    })

    it('should detect ISO date format', () => {
      expect(descriptionContainsDate('Published on 2024-06-15')).toBe(true)
    })

    it('should detect English date format', () => {
      expect(descriptionContainsDate('Published on January 15, 2024')).toBe(true)
      expect(descriptionContainsDate('Published on December 1 2024')).toBe(true)
    })

    it('should detect Chinese date format', () => {
      expect(descriptionContainsDate('发布于2024年6月15日')).toBe(true)
    })

    it('should detect slash date format', () => {
      expect(descriptionContainsDate('Published on 06/15/2024')).toBe(true)
      expect(descriptionContainsDate('Published on 15/06/2024')).toBe(true)
    })

    it('should return false for descriptions without dates', () => {
      expect(descriptionContainsDate('Just some random text')).toBe(false)
      expect(descriptionContainsDate('没有日期的文本')).toBe(false)
    })
  })

  describe('generateBlogArticleMeta', () => {
    it('should generate valid publishedTime ISO string', () => {
      fc.assert(
        fc.property(blogArticleMetaConfigArbitrary, (config) => {
          const meta = generateBlogArticleMeta(config)
          if (meta.publishedTime) {
            // Should be valid ISO string
            const parsed = new Date(meta.publishedTime)
            return !isNaN(parsed.getTime())
          }
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should handle invalid date in config', () => {
      const config: BlogArticleMetaConfig = {
        title: 'Test Article',
        description: 'Test description',
        date: 'invalid-date'
      }
      const meta = generateBlogArticleMeta(config)
      expect(meta.publishedTime).toBe('')
    })
  })
})
