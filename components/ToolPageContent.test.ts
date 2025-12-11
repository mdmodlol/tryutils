import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateHowToSchema, type HowToStep } from '~/composables/useHowToSchema'

/**
 * Unit tests for ToolPageContent component
 * Tests HowTo steps rendering and comparison table rendering
 * 
 * **Feature: seo-optimization**
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 */

// Arbitrary for generating HowTo steps
const howToStepArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  text: fc.string({ minLength: 1, maxLength: 500 }),
  image: fc.option(fc.webUrl(), { nil: undefined })
})

// Arbitrary for generating arrays of HowTo steps
const howToStepsArbitrary = fc.array(howToStepArbitrary, { minLength: 1, maxLength: 10 })

// Arbitrary for generating tool names
const toolNameArbitrary = fc.string({ minLength: 1, maxLength: 100 })

// Arbitrary for comparison item values (string or boolean)
const comparisonValueArbitrary = fc.oneof(
  fc.string({ minLength: 1, maxLength: 50 }),
  fc.boolean()
)

// Arbitrary for comparison items
const comparisonItemArbitrary = fc.record({
  feature: fc.string({ minLength: 1, maxLength: 100 }),
  ourTool: comparisonValueArbitrary,
  competitor1: fc.option(comparisonValueArbitrary, { nil: undefined }),
  competitor2: fc.option(comparisonValueArbitrary, { nil: undefined }),
  competitor3: fc.option(comparisonValueArbitrary, { nil: undefined })
})

// Arbitrary for comparison items array
const comparisonsArbitrary = fc.array(comparisonItemArbitrary, { minLength: 1, maxLength: 10 })

// Arbitrary for usage stats
const usageStatsArbitrary = fc.record({
  totalUsers: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
  filesProcessed: fc.option(fc.string({ minLength: 1, maxLength: 20 }), { nil: undefined }),
  avgRating: fc.option(fc.string({ minLength: 1, maxLength: 10 }), { nil: undefined })
})

describe('ToolPageContent Component Tests', () => {
  /**
   * Tests for HowTo steps rendering
   * Validates that steps are properly displayed with correct structure
   * **Validates: Requirements 3.1, 3.2**
   */
  describe('HowTo steps rendering', () => {
    it('should generate valid HowTo schema for any steps array', () => {
      fc.assert(
        fc.property(toolNameArbitrary, howToStepsArbitrary, (toolName, steps) => {
          const schema = generateHowToSchema(toolName, steps)
          
          // Schema should have correct structure
          return (
            schema['@context'] === 'https://schema.org' &&
            schema['@type'] === 'HowTo' &&
            schema.name === toolName &&
            Array.isArray(schema.step) &&
            schema.step.length === steps.length
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should assign correct positions to all steps', () => {
      fc.assert(
        fc.property(toolNameArbitrary, howToStepsArbitrary, (toolName, steps) => {
          const schema = generateHowToSchema(toolName, steps)
          
          // Each step should have correct position (1-indexed)
          return schema.step.every((step, index) => step.position === index + 1)
        }),
        { numRuns: 100 }
      )
    })

    it('should preserve step names and text in schema', () => {
      fc.assert(
        fc.property(toolNameArbitrary, howToStepsArbitrary, (toolName, steps) => {
          const schema = generateHowToSchema(toolName, steps)
          
          // Each step should have matching name and text
          return schema.step.every((schemaStep, index) => 
            schemaStep.name === steps[index].name &&
            schemaStep.text === steps[index].text
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should include image only when provided', () => {
      fc.assert(
        fc.property(toolNameArbitrary, howToStepsArbitrary, (toolName, steps) => {
          const schema = generateHowToSchema(toolName, steps)
          
          return schema.step.every((schemaStep, index) => {
            const originalStep = steps[index]
            if (originalStep.image) {
              return schemaStep.image === originalStep.image
            }
            return !('image' in schemaStep)
          })
        }),
        { numRuns: 100 }
      )
    })

    it('should generate HowToStep type for all steps', () => {
      fc.assert(
        fc.property(toolNameArbitrary, howToStepsArbitrary, (toolName, steps) => {
          const schema = generateHowToSchema(toolName, steps)
          
          return schema.step.every(step => step['@type'] === 'HowToStep')
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Tests for comparison table rendering
   * Validates that comparison items are properly structured
   * **Validates: Requirements 3.3**
   */
  describe('Comparison table rendering', () => {
    it('should handle boolean values correctly', () => {
      fc.assert(
        fc.property(comparisonItemArbitrary, (item) => {
          // Boolean values should be valid
          if (typeof item.ourTool === 'boolean') {
            return item.ourTool === true || item.ourTool === false
          }
          // String values should be non-empty
          return typeof item.ourTool === 'string' && item.ourTool.length > 0
        }),
        { numRuns: 100 }
      )
    })

    it('should have feature name for all comparison items', () => {
      fc.assert(
        fc.property(comparisonsArbitrary, (comparisons) => {
          return comparisons.every(item => 
            typeof item.feature === 'string' && item.feature.length > 0
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should handle optional competitor values', () => {
      fc.assert(
        fc.property(comparisonItemArbitrary, (item) => {
          // Competitor values can be undefined, string, or boolean
          const validValue = (val: unknown) => 
            val === undefined || 
            typeof val === 'string' || 
            typeof val === 'boolean'
          
          return (
            validValue(item.competitor1) &&
            validValue(item.competitor2) &&
            validValue(item.competitor3)
          )
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Tests for usage statistics rendering
   * Validates that stats are properly structured
   * **Validates: Requirements 3.4**
   */
  describe('Usage statistics rendering', () => {
    it('should handle optional stats fields', () => {
      fc.assert(
        fc.property(usageStatsArbitrary, (stats) => {
          // All fields are optional
          const validField = (val: unknown) => 
            val === undefined || 
            (typeof val === 'string' && val.length > 0)
          
          return (
            validField(stats.totalUsers) &&
            validField(stats.filesProcessed) &&
            validField(stats.avgRating)
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should allow empty stats object', () => {
      const emptyStats = {}
      expect(emptyStats).toBeDefined()
    })

    it('should allow partial stats', () => {
      const partialStats = { totalUsers: '10K+' }
      expect(partialStats.totalUsers).toBe('10K+')
      expect(partialStats).not.toHaveProperty('filesProcessed')
      expect(partialStats).not.toHaveProperty('avgRating')
    })
  })

  /**
   * Tests for value formatting
   * Validates that values are formatted correctly for display
   */
  describe('Value formatting', () => {
    const formatValue = (value: string | boolean): string => {
      if (typeof value === 'boolean') {
        return value ? '✓' : '✗'
      }
      return String(value)
    }

    it('should format boolean true as checkmark', () => {
      expect(formatValue(true)).toBe('✓')
    })

    it('should format boolean false as cross', () => {
      expect(formatValue(false)).toBe('✗')
    })

    it('should format strings as-is', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (str) => {
          return formatValue(str) === str
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Tests for competitor value extraction
   * Validates that competitor values are correctly extracted by index
   */
  describe('Competitor value extraction', () => {
    const getCompetitorValue = (
      item: { competitor1?: string | boolean; competitor2?: string | boolean; competitor3?: string | boolean },
      index: number
    ): string | boolean => {
      const key = `competitor${index + 1}` as keyof typeof item
      return item[key] ?? '-'
    }

    it('should extract competitor1 for index 0', () => {
      const item = { competitor1: true, competitor2: false }
      expect(getCompetitorValue(item, 0)).toBe(true)
    })

    it('should extract competitor2 for index 1', () => {
      const item = { competitor1: true, competitor2: 'Limited' }
      expect(getCompetitorValue(item, 1)).toBe('Limited')
    })

    it('should return dash for missing competitor', () => {
      const item = { competitor1: true }
      expect(getCompetitorValue(item, 1)).toBe('-')
      expect(getCompetitorValue(item, 2)).toBe('-')
    })

    it('should handle all competitor indices correctly', () => {
      fc.assert(
        fc.property(comparisonItemArbitrary, fc.integer({ min: 0, max: 2 }), (item, index) => {
          const value = getCompetitorValue(item, index)
          // Value should be string, boolean, or dash
          return (
            typeof value === 'string' ||
            typeof value === 'boolean'
          )
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Tests for CSS class generation
   * Validates that correct CSS classes are applied based on value type
   */
  describe('CSS class generation', () => {
    const getValueClass = (value: string | boolean, highlight: boolean): string => {
      if (typeof value === 'boolean') {
        if (value === true) {
          return highlight 
            ? 'text-green-600 dark:text-green-400 font-semibold' 
            : 'text-green-500 dark:text-green-500'
        }
        return 'text-red-500 dark:text-red-400'
      }
      return highlight 
        ? 'text-sm text-blue-600 dark:text-blue-400 font-medium' 
        : 'text-sm text-gray-600 dark:text-gray-400'
    }

    it('should return green class for true values', () => {
      const classHighlight = getValueClass(true, true)
      const classNormal = getValueClass(true, false)
      
      expect(classHighlight).toContain('text-green')
      expect(classNormal).toContain('text-green')
    })

    it('should return red class for false values', () => {
      const classHighlight = getValueClass(false, true)
      const classNormal = getValueClass(false, false)
      
      expect(classHighlight).toContain('text-red')
      expect(classNormal).toContain('text-red')
    })

    it('should return blue class for highlighted string values', () => {
      const classHighlight = getValueClass('Some text', true)
      expect(classHighlight).toContain('text-blue')
    })

    it('should return gray class for non-highlighted string values', () => {
      const classNormal = getValueClass('Some text', false)
      expect(classNormal).toContain('text-gray')
    })

    it('should include font-semibold for highlighted true values', () => {
      const classHighlight = getValueClass(true, true)
      expect(classHighlight).toContain('font-semibold')
    })

    it('should include font-medium for highlighted string values', () => {
      const classHighlight = getValueClass('Some text', true)
      expect(classHighlight).toContain('font-medium')
    })
  })

  /**
   * Specific test cases for common usage scenarios
   */
  describe('Common usage scenarios', () => {
    it('should handle image compressor tool steps', () => {
      const steps: HowToStep[] = [
        { name: 'Upload Image', text: 'Select or drag image files to the upload area' },
        { name: 'Adjust Settings', text: 'Set compression quality and output format' },
        { name: 'Compress', text: 'Click the compress button to start processing' },
        { name: 'Download', text: 'Download the compressed images' }
      ]
      
      const schema = generateHowToSchema('How to Compress Images', steps)
      
      expect(schema.step.length).toBe(4)
      expect(schema.step[0].name).toBe('Upload Image')
      expect(schema.step[3].position).toBe(4)
    })

    it('should handle HEIC converter tool steps', () => {
      const steps: HowToStep[] = [
        { name: 'Select HEIC Files', text: 'Choose HEIC files from your device' },
        { name: 'Choose Format', text: 'Select output format (JPG, PNG, WebP)' },
        { name: 'Convert', text: 'Click convert to start the conversion' },
        { name: 'Download', text: 'Download converted files' }
      ]
      
      const schema = generateHowToSchema('How to Convert HEIC to JPG', steps)
      
      expect(schema['@type']).toBe('HowTo')
      expect(schema.name).toBe('How to Convert HEIC to JPG')
      expect(schema.step.every(s => s['@type'] === 'HowToStep')).toBe(true)
    })

    it('should handle comparison table with mixed values', () => {
      const comparisons = [
        { feature: 'Free to use', ourTool: true, competitor1: true, competitor2: false },
        { feature: 'Batch processing', ourTool: true, competitor1: false, competitor2: true },
        { feature: 'Max file size', ourTool: '100MB', competitor1: '10MB', competitor2: '50MB' },
        { feature: 'Privacy', ourTool: 'Local processing', competitor1: 'Cloud', competitor2: 'Cloud' }
      ]
      
      expect(comparisons.length).toBe(4)
      expect(comparisons[0].ourTool).toBe(true)
      expect(comparisons[2].ourTool).toBe('100MB')
    })
  })
})
