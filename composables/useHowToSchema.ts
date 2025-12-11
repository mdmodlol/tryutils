/**
 * HowTo Schema Composable
 * Generates HowTo structured data in JSON-LD format
 * 
 * @see https://schema.org/HowTo
 * **Feature: seo-optimization, Property 5: HowTo structured data format**
 * **Validates: Requirements 3.2**
 */

export interface HowToStep {
  name: string
  text: string
  image?: string
}

export interface HowToSchema {
  '@context': 'https://schema.org'
  '@type': 'HowTo'
  name: string
  step: Array<{
    '@type': 'HowToStep'
    position: number
    name: string
    text: string
    image?: string
  }>
}

/**
 * Generates HowTo structured data from a name and array of steps
 * @param name - The name/title of the HowTo guide
 * @param steps - Array of HowTo steps with name, text, and optional image
 * @returns HowToSchema object ready for JSON-LD injection
 */
export function generateHowToSchema(name: string, steps: HowToStep[]): HowToSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image })
    }))
  }
}

/**
 * Composable for injecting HowTo structured data into the page head
 * Uses nuxt-schema-org compatible approach with useHead
 * 
 * @param name - Reactive or static name of the HowTo guide
 * @param steps - Reactive or static array of HowTo steps
 */
export function useHowToSchema(name: string | Ref<string>, steps: HowToStep[] | Ref<HowToStep[]>) {
  const howToName = isRef(name) ? name : ref(name)
  const howToSteps = isRef(steps) ? steps : ref(steps)
  
  const schema = computed(() => generateHowToSchema(howToName.value, howToSteps.value))
  
  useHead({
    script: [
      {
        key: 'howto-schema',
        type: 'application/ld+json',
        innerHTML: computed(() => JSON.stringify(schema.value))
      }
    ]
  })
  
  return {
    schema
  }
}
