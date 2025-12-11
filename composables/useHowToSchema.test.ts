import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateHowToSchema, type HowToStep, type HowToSchema } from './useHowToSchema'

/**
 * Property-based tests for HowTo Schema generation
 * **Feature: seo-optimization, Property 5: HowTo structured data format**
 * **Validates: Requirements 3.2**
 */

// Arbitrary for generating valid HowTo steps
const howToStepArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  text: fc.string({ minLength: 1, maxLength: 500 }),
  image: fc.option(fc.webUrl(), { nil: undefined })
})

// Arbitrary for generating arrays of HowTo steps
const howToStepsArbitrary = fc.array(howToStepArbitrary, { minLength: 1, maxLength: 10 })

// Arbitrary for generating HowTo name
const howToNameArbitrary = fc.string({ minLength: 1, maxLength: 100 })

// Helper to validate HowTo schema structure
function isValidHowToSchema(schema: HowToSchema): boolean {
  return (
    schema['@context'] === 'https://schema.org' &&
    schema['@type'] === 'HowTo' &&
    typeof schema.name === 'string' &&
    Array.isArray(schema.step)
  )
}

// Helper to validate HowToStep schema structure
function isValidHowToStepSchema(step: HowToSchema['step'][number]): boolean {
  return (
    step['@type'] === 'HowToStep' &&
    typeof step.position === 'number' &&
    step.position > 0 &&
    typeof step.name === 'string' &&
    typeof step.text === 'string'
  )
}

describe('HowTo Schema Property Tests', () => {
  /**
   * **Feature: seo-optimization, Property 5: HowTo structured data format**
   * **Validates: Requirements 3.2**
   * 
   * For any tool page with usage steps, the generated JSON-LD should be valid HowTo schema
   * with step array containing HowToStep objects.
   */
  describe('Property 5: HowTo structured data format', () => {
    it('should generate valid HowTo schema structure for any steps', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return isValidHowToSchema(schema)
        }),
        { numRuns: 100 }
      )
    })

    it('should have @context set to https://schema.org', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return schema['@context'] === 'https://schema.org'
        }),
        { numRuns: 100 }
      )
    })

    it('should have @type set to HowTo', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return schema['@type'] === 'HowTo'
        }),
        { numRuns: 100 }
      )
    })

    it('should set name property from input', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return schema.name === name
        }),
        { numRuns: 100 }
      )
    })

    it('should have step array with same length as input steps', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return schema.step.length === steps.length
        }),
        { numRuns: 100 }
      )
    })

    it('should generate valid HowToStep schema for each step', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return schema.step.every(isValidHowToStepSchema)
        }),
        { numRuns: 100 }
      )
    })

    it('should assign sequential position numbers starting from 1', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return schema.step.every((step, index) => step.position === index + 1)
        }),
        { numRuns: 100 }
      )
    })

    it('should map step name and text properties correctly', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return steps.every((inputStep, index) => 
            schema.step[index].name === inputStep.name &&
            schema.step[index].text === inputStep.text
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should include image property only when provided', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          return steps.every((inputStep, index) => {
            const schemaStep = schema.step[index]
            if (inputStep.image) {
              return schemaStep.image === inputStep.image
            } else {
              return !('image' in schemaStep)
            }
          })
        }),
        { numRuns: 100 }
      )
    })

    it('should handle empty steps array gracefully', () => {
      const schema = generateHowToSchema('Test HowTo', [])
      expect(isValidHowToSchema(schema)).toBe(true)
      expect(schema.step).toHaveLength(0)
    })

    it('should produce valid JSON when stringified', () => {
      fc.assert(
        fc.property(howToNameArbitrary, howToStepsArbitrary, (name, steps) => {
          const schema = generateHowToSchema(name, steps)
          try {
            const json = JSON.stringify(schema)
            const parsed = JSON.parse(json)
            return parsed['@type'] === 'HowTo'
          } catch {
            return false
          }
        }),
        { numRuns: 100 }
      )
    })
  })
})
