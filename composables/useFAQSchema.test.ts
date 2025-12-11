import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateFAQSchema, type FAQItem, type FAQPageSchema } from './useFAQSchema'

/**
 * Property-based tests for FAQ Schema generation
 * **Feature: seo-optimization, Property 3: FAQ structured data format**
 * **Validates: Requirements 2.1, 2.2**
 */

// Arbitrary for generating valid FAQ items
const faqItemArbitrary = fc.record({
  question: fc.string({ minLength: 1, maxLength: 200 }),
  answer: fc.string({ minLength: 1, maxLength: 1000 }),
  category: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined })
})

// Arbitrary for generating arrays of FAQ items
const faqItemsArbitrary = fc.array(faqItemArbitrary, { minLength: 1, maxLength: 20 })

// Helper to validate FAQPage schema structure
function isValidFAQPageSchema(schema: FAQPageSchema): boolean {
  return (
    schema['@context'] === 'https://schema.org' &&
    schema['@type'] === 'FAQPage' &&
    Array.isArray(schema.mainEntity)
  )
}

// Helper to validate Question schema structure
function isValidQuestionSchema(question: FAQPageSchema['mainEntity'][number]): boolean {
  return (
    question['@type'] === 'Question' &&
    typeof question.name === 'string' &&
    question.acceptedAnswer !== undefined &&
    question.acceptedAnswer['@type'] === 'Answer' &&
    typeof question.acceptedAnswer.text === 'string'
  )
}

describe('FAQ Schema Property Tests', () => {
  /**
   * **Feature: seo-optimization, Property 3: FAQ structured data format**
   * **Validates: Requirements 2.1, 2.2**
   * 
   * For any array of FAQ items, the generated JSON-LD should be valid FAQPage schema
   * with mainEntity array containing Question objects with acceptedAnswer properties.
   */
  describe('Property 3: FAQ structured data format', () => {
    it('should generate valid FAQPage schema structure for any FAQ items', () => {
      fc.assert(
        fc.property(faqItemsArbitrary, (items) => {
          const schema = generateFAQSchema(items)
          return isValidFAQPageSchema(schema)
        }),
        { numRuns: 100 }
      )
    })

    it('should have @context set to https://schema.org', () => {
      fc.assert(
        fc.property(faqItemsArbitrary, (items) => {
          const schema = generateFAQSchema(items)
          return schema['@context'] === 'https://schema.org'
        }),
        { numRuns: 100 }
      )
    })

    it('should have @type set to FAQPage', () => {
      fc.assert(
        fc.property(faqItemsArbitrary, (items) => {
          const schema = generateFAQSchema(items)
          return schema['@type'] === 'FAQPage'
        }),
        { numRuns: 100 }
      )
    })

    it('should have mainEntity array with same length as input items', () => {
      fc.assert(
        fc.property(faqItemsArbitrary, (items) => {
          const schema = generateFAQSchema(items)
          return schema.mainEntity.length === items.length
        }),
        { numRuns: 100 }
      )
    })

    it('should generate valid Question schema for each FAQ item', () => {
      fc.assert(
        fc.property(faqItemsArbitrary, (items) => {
          const schema = generateFAQSchema(items)
          return schema.mainEntity.every(isValidQuestionSchema)
        }),
        { numRuns: 100 }
      )
    })

    it('should map question text to Question name property', () => {
      fc.assert(
        fc.property(faqItemsArbitrary, (items) => {
          const schema = generateFAQSchema(items)
          return items.every((item, index) => 
            schema.mainEntity[index].name === item.question
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should include acceptedAnswer with Answer type for each question', () => {
      fc.assert(
        fc.property(faqItemsArbitrary, (items) => {
          const schema = generateFAQSchema(items)
          return schema.mainEntity.every(q => 
            q.acceptedAnswer['@type'] === 'Answer'
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should strip HTML tags from answer text', () => {
      const htmlAnswerArbitrary = fc.record({
        question: fc.string({ minLength: 1, maxLength: 100 }),
        answer: fc.constantFrom(
          '<p>Simple paragraph</p>',
          '<strong>Bold</strong> text',
          '<a href="test">Link</a>',
          '<div><span>Nested</span></div>'
        )
      })

      fc.assert(
        fc.property(fc.array(htmlAnswerArbitrary, { minLength: 1, maxLength: 5 }), (items) => {
          const schema = generateFAQSchema(items)
          return schema.mainEntity.every(q => 
            !/<[^>]*>/.test(q.acceptedAnswer.text)
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should handle empty array gracefully', () => {
      const schema = generateFAQSchema([])
      expect(isValidFAQPageSchema(schema)).toBe(true)
      expect(schema.mainEntity).toHaveLength(0)
    })

    it('should produce valid JSON when stringified', () => {
      fc.assert(
        fc.property(faqItemsArbitrary, (items) => {
          const schema = generateFAQSchema(items)
          try {
            const json = JSON.stringify(schema)
            const parsed = JSON.parse(json)
            return parsed['@type'] === 'FAQPage'
          } catch {
            return false
          }
        }),
        { numRuns: 100 }
      )
    })
  })
})
