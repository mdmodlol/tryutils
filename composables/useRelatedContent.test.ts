import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateToolAnchorText,
  generateArticleAnchorText,
  anchorTextContainsKeyword,
  type RelatedArticle
} from './useRelatedContent'
import { type ToolConfig } from '~/data/toolConfig'

/**
 * Property-based tests for Related Content anchor text generation
 * **Feature: seo-optimization, Property 6: Related content anchor text**
 * **Validates: Requirements 4.3**
 */

// Arbitrary for generating keywords (non-empty strings)
const keywordArbitrary = fc.string({ minLength: 1, maxLength: 30 })
  .filter(s => s.trim().length > 0)

// Arbitrary for generating arrays of keywords
const keywordsArbitrary = fc.array(keywordArbitrary, { minLength: 1, maxLength: 10 })

// Arbitrary for locale
const localeArbitrary = fc.constantFrom('zh' as const, 'en' as const)

// Arbitrary for generating tool configs with keywords
const toolConfigArbitrary: fc.Arbitrary<ToolConfig> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 30 }),
  name: fc.record({
    zh: fc.string({ minLength: 1, maxLength: 50 }),
    en: fc.string({ minLength: 1, maxLength: 50 })
  }),
  description: fc.record({
    zh: fc.string({ minLength: 1, maxLength: 200 }),
    en: fc.string({ minLength: 1, maxLength: 200 })
  }),
  icon: fc.string({ minLength: 1, maxLength: 50 }),
  path: fc.string({ minLength: 1, maxLength: 50 }),
  category: fc.string({ minLength: 1, maxLength: 30 }),
  keywords: keywordsArbitrary
})

// Arbitrary for generating related articles with keywords
const relatedArticleWithKeywordsArbitrary: fc.Arbitrary<RelatedArticle> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  path: fc.string({ minLength: 1, maxLength: 100 }),
  date: fc.string({ minLength: 1, maxLength: 20 }),
  keywords: keywordsArbitrary
})

// Arbitrary for generating related articles without keywords
const relatedArticleWithoutKeywordsArbitrary: fc.Arbitrary<RelatedArticle> = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  path: fc.string({ minLength: 1, maxLength: 100 }),
  date: fc.string({ minLength: 1, maxLength: 20 }),
  keywords: fc.constant(undefined)
})

describe('Related Content Anchor Text Property Tests', () => {
  /**
   * **Feature: seo-optimization, Property 6: Related content anchor text**
   * **Validates: Requirements 4.3**
   * 
   * For any related content link, the anchor text should contain at least one keyword
   * from the target page's keyword list.
   */
  describe('Property 6: Related content anchor text', () => {
    describe('Tool anchor text generation', () => {
      it('should generate anchor text containing at least one keyword for any tool', () => {
        fc.assert(
          fc.property(toolConfigArbitrary, localeArbitrary, (tool, locale) => {
            const result = generateToolAnchorText(tool, locale)
            // The result should always contain a keyword since tools always have keywords
            return result.containsKeyword === true
          }),
          { numRuns: 100 }
        )
      })

      it('should have anchor text that actually contains the matched keyword', () => {
        fc.assert(
          fc.property(toolConfigArbitrary, localeArbitrary, (tool, locale) => {
            const result = generateToolAnchorText(tool, locale)
            if (result.matchedKeyword) {
              return result.text.toLowerCase().includes(result.matchedKeyword.toLowerCase())
            }
            return true
          }),
          { numRuns: 100 }
        )
      })

      it('should verify anchor text contains keyword using anchorTextContainsKeyword', () => {
        fc.assert(
          fc.property(toolConfigArbitrary, localeArbitrary, (tool, locale) => {
            const result = generateToolAnchorText(tool, locale)
            return anchorTextContainsKeyword(result.text, tool.keywords)
          }),
          { numRuns: 100 }
        )
      })

      it('should return non-empty anchor text for any tool', () => {
        fc.assert(
          fc.property(toolConfigArbitrary, localeArbitrary, (tool, locale) => {
            const result = generateToolAnchorText(tool, locale)
            return result.text.length > 0
          }),
          { numRuns: 100 }
        )
      })
    })

    describe('Article anchor text generation', () => {
      it('should generate anchor text containing keyword for articles with keywords', () => {
        fc.assert(
          fc.property(relatedArticleWithKeywordsArbitrary, localeArbitrary, (article, locale) => {
            const result = generateArticleAnchorText(article, locale)
            // Articles with keywords should have containsKeyword = true
            return result.containsKeyword === true
          }),
          { numRuns: 100 }
        )
      })

      it('should have anchor text that actually contains the matched keyword for articles', () => {
        fc.assert(
          fc.property(relatedArticleWithKeywordsArbitrary, localeArbitrary, (article, locale) => {
            const result = generateArticleAnchorText(article, locale)
            if (result.matchedKeyword) {
              return result.text.toLowerCase().includes(result.matchedKeyword.toLowerCase())
            }
            return true
          }),
          { numRuns: 100 }
        )
      })

      it('should verify article anchor text contains keyword using anchorTextContainsKeyword', () => {
        fc.assert(
          fc.property(relatedArticleWithKeywordsArbitrary, localeArbitrary, (article, locale) => {
            const result = generateArticleAnchorText(article, locale)
            return anchorTextContainsKeyword(result.text, article.keywords || [])
          }),
          { numRuns: 100 }
        )
      })

      it('should return containsKeyword=false for articles without keywords', () => {
        fc.assert(
          fc.property(relatedArticleWithoutKeywordsArbitrary, localeArbitrary, (article, locale) => {
            const result = generateArticleAnchorText(article, locale)
            // Articles without keywords should have containsKeyword = false
            return result.containsKeyword === false
          }),
          { numRuns: 100 }
        )
      })

      it('should return non-empty anchor text for any article', () => {
        fc.assert(
          fc.property(relatedArticleWithKeywordsArbitrary, localeArbitrary, (article, locale) => {
            const result = generateArticleAnchorText(article, locale)
            return result.text.length > 0
          }),
          { numRuns: 100 }
        )
      })
    })

    describe('anchorTextContainsKeyword helper', () => {
      it('should return true when anchor text contains any keyword', () => {
        fc.assert(
          fc.property(keywordsArbitrary, (keywords) => {
            // Create anchor text that definitely contains the first keyword
            const anchorText = `Some text with ${keywords[0]} in it`
            return anchorTextContainsKeyword(anchorText, keywords) === true
          }),
          { numRuns: 100 }
        )
      })

      it('should be case-insensitive when matching keywords', () => {
        fc.assert(
          fc.property(keywordArbitrary, (keyword) => {
            const upperAnchor = keyword.toUpperCase()
            const lowerKeywords = [keyword.toLowerCase()]
            return anchorTextContainsKeyword(upperAnchor, lowerKeywords) === true
          }),
          { numRuns: 100 }
        )
      })

      it('should return false for empty keywords array', () => {
        fc.assert(
          fc.property(fc.string({ minLength: 1 }), (anchorText) => {
            return anchorTextContainsKeyword(anchorText, []) === false
          }),
          { numRuns: 100 }
        )
      })

      it('should return false when anchor text contains no keywords', () => {
        // Use a fixed anchor text that won't match random keywords
        // anchorTextContainsKeyword is case-insensitive, so we need to filter out both cases
        const anchorText = 'ZZZZZZZZZ'
        fc.assert(
          fc.property(
            fc.array(
              fc.string({ minLength: 1, maxLength: 5 })
                .filter(s => !s.toLowerCase().includes('z')), // Case-insensitive filter
              { minLength: 1, maxLength: 5 }
            ),
            (keywords) => {
              return anchorTextContainsKeyword(anchorText, keywords) === false
            }
          ),
          { numRuns: 100 }
        )
      })
    })
  })
})
