import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateToolTitle,
  generateToolDescription,
  generateToolPageMeta,
  titleContainsActionWord,
  ACTION_WORDS,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  type ToolPageMetaConfig
} from './useToolPageMeta'

/**
 * Property-based tests for Tool Page Meta generation
 * **Feature: seo-optimization, Property 7: Title length constraint**
 * **Feature: seo-optimization, Property 8: Meta description length constraint**
 * **Feature: seo-optimization, Property 10: Tool page action words**
 * **Validates: Requirements 5.1, 5.2, 5.4**
 */

// Arbitrary for generating tool names (realistic lengths)
const toolNameArbitrary = fc.string({ minLength: 1, maxLength: 50 })

// Arbitrary for generating tool descriptions (realistic lengths)
const toolDescriptionArbitrary = fc.string({ minLength: 1, maxLength: 200 })

// Arbitrary for locale
const localeArbitrary = fc.constantFrom('zh' as const, 'en' as const)

// Arbitrary for complete tool page meta config
const toolPageMetaConfigArbitrary: fc.Arbitrary<ToolPageMetaConfig> = fc.record({
  toolName: toolNameArbitrary,
  toolDescription: toolDescriptionArbitrary,
  locale: fc.option(localeArbitrary, { nil: undefined }),
  keywords: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 10 }), { nil: undefined })
})

describe('Tool Page Meta Property Tests', () => {
  /**
   * **Feature: seo-optimization, Property 7: Title length constraint**
   * **Validates: Requirements 5.1**
   * 
   * For any page, the generated title should be under 60 characters in length.
   */
  describe('Property 7: Title length constraint', () => {
    it('should generate titles under 60 characters for any tool name in zh locale', () => {
      fc.assert(
        fc.property(toolNameArbitrary, (toolName) => {
          const title = generateToolTitle(toolName, 'zh')
          return title.length <= MAX_TITLE_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should generate titles under 60 characters for any tool name in en locale', () => {
      fc.assert(
        fc.property(toolNameArbitrary, (toolName) => {
          const title = generateToolTitle(toolName, 'en')
          return title.length <= MAX_TITLE_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should generate titles under 60 characters for any locale', () => {
      fc.assert(
        fc.property(toolNameArbitrary, localeArbitrary, (toolName, locale) => {
          const title = generateToolTitle(toolName, locale)
          return title.length <= MAX_TITLE_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should generate titles under 60 characters via generateToolPageMeta', () => {
      fc.assert(
        fc.property(toolPageMetaConfigArbitrary, (config) => {
          const meta = generateToolPageMeta(config)
          return meta.title.length <= MAX_TITLE_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should handle very long tool names by truncating', () => {
      const veryLongName = 'A'.repeat(100)
      const title = generateToolTitle(veryLongName, 'en')
      expect(title.length).toBeLessThanOrEqual(MAX_TITLE_LENGTH)
    })

    it('should handle empty tool name gracefully', () => {
      const title = generateToolTitle('', 'en')
      expect(title.length).toBeLessThanOrEqual(MAX_TITLE_LENGTH)
    })
  })

  /**
   * **Feature: seo-optimization, Property 8: Meta description length constraint**
   * **Validates: Requirements 5.2**
   * 
   * For any page, the generated meta description should be under 160 characters in length.
   */
  describe('Property 8: Meta description length constraint', () => {
    it('should generate descriptions under 160 characters for any tool description in zh locale', () => {
      fc.assert(
        fc.property(toolDescriptionArbitrary, (toolDescription) => {
          const description = generateToolDescription(toolDescription, 'zh')
          return description.length <= MAX_DESCRIPTION_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should generate descriptions under 160 characters for any tool description in en locale', () => {
      fc.assert(
        fc.property(toolDescriptionArbitrary, (toolDescription) => {
          const description = generateToolDescription(toolDescription, 'en')
          return description.length <= MAX_DESCRIPTION_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should generate descriptions under 160 characters for any locale', () => {
      fc.assert(
        fc.property(toolDescriptionArbitrary, localeArbitrary, (toolDescription, locale) => {
          const description = generateToolDescription(toolDescription, locale)
          return description.length <= MAX_DESCRIPTION_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should generate descriptions under 160 characters via generateToolPageMeta', () => {
      fc.assert(
        fc.property(toolPageMetaConfigArbitrary, (config) => {
          const meta = generateToolPageMeta(config)
          return meta.description.length <= MAX_DESCRIPTION_LENGTH
        }),
        { numRuns: 100 }
      )
    })

    it('should handle very long descriptions by truncating', () => {
      const veryLongDescription = 'B'.repeat(300)
      const description = generateToolDescription(veryLongDescription, 'en')
      expect(description.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH)
    })

    it('should handle empty description gracefully', () => {
      const description = generateToolDescription('', 'en')
      expect(description.length).toBeLessThanOrEqual(MAX_DESCRIPTION_LENGTH)
    })
  })

  /**
   * **Feature: seo-optimization, Property 10: Tool page action words**
   * **Validates: Requirements 5.4**
   * 
   * For any tool page, the title should contain at least one action word
   * from the predefined list (Free, Online, 免费, 在线, etc.).
   */
  describe('Property 10: Tool page action words', () => {
    it('should include action words in zh locale titles', () => {
      fc.assert(
        fc.property(toolNameArbitrary, (toolName) => {
          const title = generateToolTitle(toolName, 'zh')
          return titleContainsActionWord(title, 'zh')
        }),
        { numRuns: 100 }
      )
    })

    it('should include action words in en locale titles', () => {
      fc.assert(
        fc.property(toolNameArbitrary, (toolName) => {
          const title = generateToolTitle(toolName, 'en')
          return titleContainsActionWord(title, 'en')
        }),
        { numRuns: 100 }
      )
    })

    it('should include action words for any locale', () => {
      fc.assert(
        fc.property(toolNameArbitrary, localeArbitrary, (toolName, locale) => {
          const title = generateToolTitle(toolName, locale)
          return titleContainsActionWord(title, locale)
        }),
        { numRuns: 100 }
      )
    })

    it('should include action words via generateToolPageMeta', () => {
      fc.assert(
        fc.property(toolPageMetaConfigArbitrary, (config) => {
          const meta = generateToolPageMeta(config)
          const locale = config.locale || 'zh'
          return titleContainsActionWord(meta.title, locale)
        }),
        { numRuns: 100 }
      )
    })

    it('should have correct action words defined for zh locale', () => {
      expect(ACTION_WORDS.zh).toContain('免费')
      expect(ACTION_WORDS.zh).toContain('在线')
    })

    it('should have correct action words defined for en locale', () => {
      expect(ACTION_WORDS.en).toContain('Free')
      expect(ACTION_WORDS.en).toContain('Online')
    })

    it('titleContainsActionWord should correctly identify action words', () => {
      expect(titleContainsActionWord('免费在线图片压缩', 'zh')).toBe(true)
      expect(titleContainsActionWord('Free Online Image Compressor', 'en')).toBe(true)
      expect(titleContainsActionWord('Some Random Title', 'en')).toBe(false)
      expect(titleContainsActionWord('随机标题', 'zh')).toBe(false)
    })
  })
})
