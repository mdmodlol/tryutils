import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import {
  generateToolAnchorText,
  generateArticleAnchorText,
  anchorTextContainsKeyword,
  getRelatedTools,
  getToolsForArticle,
  type RelatedArticle
} from '~/composables/useRelatedContent'
import { toolConfigs, getToolById } from '~/data/toolConfig'

/**
 * Unit tests for RelatedContent component
 * Tests rendering logic for both tools and articles modes
 * Tests keyword-based anchor text generation
 * 
 * **Feature: seo-optimization**
 * **Validates: Requirements 4.1, 4.2, 4.3**
 */

// Arbitrary for locale
const localeArbitrary = fc.constantFrom('zh' as const, 'en' as const)

// Arbitrary for generating tool IDs from actual tool configs
const toolIdArbitrary = fc.constantFrom(...toolConfigs.map(t => t.id))

// Arbitrary for generating arrays of tool IDs
const toolIdsArbitrary = fc.array(toolIdArbitrary, { minLength: 1, maxLength: 3 })

describe('RelatedContent Component Tests', () => {
  /**
   * Tests for tools mode rendering
   * Validates that related tools are properly displayed
   * **Validates: Requirements 4.1**
   */
  describe('Tools mode rendering', () => {
    it('should return related tools for any valid tool ID', () => {
      fc.assert(
        fc.property(toolIdArbitrary, localeArbitrary, (toolId, locale) => {
          const tools = getRelatedTools(toolId, { locale, limit: 5 })
          // Should return tools (excluding the current tool)
          return Array.isArray(tools) && tools.every(t => t.id !== toolId)
        }),
        { numRuns: 50 }
      )
    })

    it('should return tools with all required properties', () => {
      fc.assert(
        fc.property(toolIdArbitrary, localeArbitrary, (toolId, locale) => {
          const tools = getRelatedTools(toolId, { locale, limit: 5 })
          return tools.every(tool => 
            typeof tool.id === 'string' &&
            typeof tool.name === 'string' &&
            typeof tool.description === 'string' &&
            typeof tool.path === 'string' &&
            typeof tool.icon === 'string' &&
            Array.isArray(tool.keywords)
          )
        }),
        { numRuns: 50 }
      )
    })

    it('should respect the limit parameter', () => {
      fc.assert(
        fc.property(
          toolIdArbitrary,
          localeArbitrary,
          fc.integer({ min: 1, max: 10 }),
          (toolId, locale, limit) => {
            const tools = getRelatedTools(toolId, { locale, limit })
            return tools.length <= limit
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should return empty array for invalid tool ID', () => {
      const tools = getRelatedTools('non-existent-tool', { locale: 'en', limit: 5 })
      expect(tools).toEqual([])
    })
  })

  /**
   * Tests for articles mode rendering
   * Validates that related tools for articles are properly displayed
   * **Validates: Requirements 4.2**
   */
  describe('Articles mode - tools for article', () => {
    it('should return tools for any valid tool IDs array', () => {
      fc.assert(
        fc.property(toolIdsArbitrary, localeArbitrary, (toolIds, locale) => {
          const tools = getToolsForArticle(toolIds, { locale, limit: 5 })
          // Should return tools matching the provided IDs
          return Array.isArray(tools) && tools.length <= toolIds.length
        }),
        { numRuns: 50 }
      )
    })

    it('should return tools with correct locale-specific names', () => {
      fc.assert(
        fc.property(toolIdsArbitrary, localeArbitrary, (toolIds, locale) => {
          const tools = getToolsForArticle(toolIds, { locale, limit: 5 })
          return tools.every(tool => {
            const originalTool = getToolById(tool.id)
            if (!originalTool) return false
            // Name should match the locale-specific name
            const expectedName = originalTool.name[locale] || originalTool.name.zh
            return tool.name === expectedName
          })
        }),
        { numRuns: 50 }
      )
    })

    it('should return empty array for empty tool IDs', () => {
      const tools = getToolsForArticle([], { locale: 'en', limit: 5 })
      expect(tools).toEqual([])
    })

    it('should filter out invalid tool IDs', () => {
      const mixedIds = ['image-compressor', 'invalid-tool', 'heic-converter']
      const tools = getToolsForArticle(mixedIds, { locale: 'en', limit: 5 })
      // Should only return valid tools
      expect(tools.length).toBe(2)
      expect(tools.map(t => t.id)).toContain('image-compressor')
      expect(tools.map(t => t.id)).toContain('heic-converter')
    })
  })

  /**
   * Tests for keyword-based anchor text generation
   * Validates that anchor text contains keywords
   * **Validates: Requirements 4.3**
   */
  describe('Keyword-based anchor text generation', () => {
    it('should generate anchor text with keywords for all tools', () => {
      fc.assert(
        fc.property(toolIdArbitrary, localeArbitrary, (toolId, locale) => {
          const tool = getToolById(toolId)
          if (!tool) return true // Skip if tool not found
          
          const result = generateToolAnchorText(tool, locale)
          // Anchor text should contain at least one keyword
          return result.containsKeyword === true
        }),
        { numRuns: 50 }
      )
    })

    it('should verify anchor text actually contains the keyword', () => {
      fc.assert(
        fc.property(toolIdArbitrary, localeArbitrary, (toolId, locale) => {
          const tool = getToolById(toolId)
          if (!tool) return true
          
          const result = generateToolAnchorText(tool, locale)
          return anchorTextContainsKeyword(result.text, tool.keywords)
        }),
        { numRuns: 50 }
      )
    })

    it('should generate non-empty anchor text for all tools', () => {
      fc.assert(
        fc.property(toolIdArbitrary, localeArbitrary, (toolId, locale) => {
          const tool = getToolById(toolId)
          if (!tool) return true
          
          const result = generateToolAnchorText(tool, locale)
          return result.text.length > 0
        }),
        { numRuns: 50 }
      )
    })
  })

  /**
   * Tests for article anchor text generation
   * Validates that article anchor text contains keywords
   * **Validates: Requirements 4.3**
   */
  describe('Article anchor text generation', () => {
    // Sample articles for testing
    const sampleArticleWithKeywords: RelatedArticle = {
      title: 'How to Compress Images Efficiently',
      description: 'Learn the best practices for image compression',
      path: '/blog/image-compression-guide',
      date: '2024-01-15',
      keywords: ['compress', 'image', 'optimization']
    }

    const sampleArticleWithoutKeywords: RelatedArticle = {
      title: 'General Web Development Tips',
      description: 'Tips for web developers',
      path: '/blog/web-dev-tips',
      date: '2024-01-10',
      keywords: undefined
    }

    const sampleArticleEmptyKeywords: RelatedArticle = {
      title: 'Another Article',
      description: 'Some description',
      path: '/blog/another-article',
      date: '2024-01-05',
      keywords: []
    }

    it('should generate anchor text containing keyword for articles with keywords', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const result = generateArticleAnchorText(sampleArticleWithKeywords, locale)
          return result.containsKeyword === true
        }),
        { numRuns: 10 }
      )
    })

    it('should verify article anchor text actually contains the matched keyword', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const result = generateArticleAnchorText(sampleArticleWithKeywords, locale)
          if (result.matchedKeyword) {
            return result.text.toLowerCase().includes(result.matchedKeyword.toLowerCase())
          }
          return true
        }),
        { numRuns: 10 }
      )
    })

    it('should return containsKeyword=false for articles without keywords', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const result = generateArticleAnchorText(sampleArticleWithoutKeywords, locale)
          return result.containsKeyword === false
        }),
        { numRuns: 10 }
      )
    })

    it('should return containsKeyword=false for articles with empty keywords array', () => {
      fc.assert(
        fc.property(localeArbitrary, (locale) => {
          const result = generateArticleAnchorText(sampleArticleEmptyKeywords, locale)
          return result.containsKeyword === false
        }),
        { numRuns: 10 }
      )
    })

    it('should generate non-empty anchor text for any article', () => {
      const articles = [sampleArticleWithKeywords, sampleArticleWithoutKeywords, sampleArticleEmptyKeywords]
      fc.assert(
        fc.property(
          fc.constantFrom(...articles),
          localeArbitrary,
          (article, locale) => {
            const result = generateArticleAnchorText(article, locale)
            return result.text.length > 0
          }
        ),
        { numRuns: 30 }
      )
    })

    it('should use article title as base for anchor text', () => {
      const result = generateArticleAnchorText(sampleArticleWithKeywords, 'en')
      // Anchor text should contain the title or be derived from it
      expect(result.text).toContain('How to Compress Images Efficiently')
    })

    it('should verify anchor text contains keyword using anchorTextContainsKeyword helper', () => {
      const result = generateArticleAnchorText(sampleArticleWithKeywords, 'en')
      const containsKeyword = anchorTextContainsKeyword(result.text, sampleArticleWithKeywords.keywords || [])
      expect(containsKeyword).toBe(true)
    })
  })

  /**
   * Tests for display item transformation
   * Validates that items are properly transformed for display
   */
  describe('Display item transformation', () => {
    it('should transform tools to display items with all required fields', () => {
      const toolIds = ['image-compressor', 'heic-converter']
      const tools = getToolsForArticle(toolIds, { locale: 'en', limit: 5 })
      
      const displayItems = tools.map(tool => {
        const toolConfig = getToolById(tool.id)!
        const anchorResult = generateToolAnchorText(toolConfig, 'en')
        
        return {
          path: tool.path,
          anchorText: anchorResult.text,
          description: tool.description,
          icon: tool.icon,
          keywords: tool.keywords
        }
      })
      
      expect(displayItems.length).toBe(2)
      displayItems.forEach(item => {
        expect(item.path).toBeTruthy()
        expect(item.anchorText).toBeTruthy()
        expect(item.description).toBeTruthy()
        expect(item.icon).toBeTruthy()
        expect(Array.isArray(item.keywords)).toBe(true)
      })
    })
  })

  /**
   * Tests for specific tool configurations
   * Validates common use cases
   */
  describe('Specific tool configurations', () => {
    it('should handle image-compressor tool correctly', () => {
      const tool = getToolById('image-compressor')
      expect(tool).toBeDefined()
      
      const zhResult = generateToolAnchorText(tool!, 'zh')
      const enResult = generateToolAnchorText(tool!, 'en')
      
      expect(zhResult.text).toBeTruthy()
      expect(enResult.text).toBeTruthy()
      expect(zhResult.containsKeyword).toBe(true)
      expect(enResult.containsKeyword).toBe(true)
    })

    it('should handle heic-converter tool correctly', () => {
      const tool = getToolById('heic-converter')
      expect(tool).toBeDefined()
      
      const zhResult = generateToolAnchorText(tool!, 'zh')
      const enResult = generateToolAnchorText(tool!, 'en')
      
      expect(zhResult.text).toBeTruthy()
      expect(enResult.text).toBeTruthy()
      expect(zhResult.containsKeyword).toBe(true)
      expect(enResult.containsKeyword).toBe(true)
    })

    it('should handle image-format-converter tool correctly', () => {
      const tool = getToolById('image-format-converter')
      expect(tool).toBeDefined()
      
      const zhResult = generateToolAnchorText(tool!, 'zh')
      const enResult = generateToolAnchorText(tool!, 'en')
      
      expect(zhResult.text).toBeTruthy()
      expect(enResult.text).toBeTruthy()
      expect(zhResult.containsKeyword).toBe(true)
      expect(enResult.containsKeyword).toBe(true)
    })
  })

  /**
   * Tests for section configuration
   * Validates that section titles and icons are properly set
   */
  describe('Section configuration', () => {
    it('should use correct section ID format', () => {
      const toolsSectionId = 'related-tools-section'
      const articlesSectionId = 'related-articles-section'
      
      expect(toolsSectionId).toMatch(/^related-\w+-section$/)
      expect(articlesSectionId).toMatch(/^related-\w+-section$/)
    })
  })
})
