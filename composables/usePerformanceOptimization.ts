/**
 * Performance Optimization Composable
 * Provides utilities for image lazy loading and preload hints
 * 
 * @see Requirements 7.2, 7.4
 */

export interface ImageLazyLoadConfig {
  /** Whether to apply lazy loading (default: true for below-the-fold) */
  lazy?: boolean
  /** Threshold for intersection observer (default: 0.1) */
  threshold?: number
  /** Root margin for intersection observer */
  rootMargin?: string
}

export interface PreloadHint {
  /** URL of the resource to preload */
  href: string
  /** Type of resource: 'image', 'style', 'script', 'font' */
  as: 'image' | 'style' | 'script' | 'font'
  /** MIME type of the resource */
  type?: string
  /** Crossorigin attribute */
  crossorigin?: '' | 'anonymous' | 'use-credentials'
  /** Media query for responsive preloading */
  media?: string
}

export interface CriticalResource {
  href: string
  as: PreloadHint['as']
  type?: string
  crossorigin?: PreloadHint['crossorigin']
  media?: string
}

/**
 * Determines if an image should use lazy loading based on its position
 * Below-the-fold images should have loading="lazy"
 * 
 * @param isBelowFold - Whether the image is below the fold
 * @returns The loading attribute value
 */
export function getImageLoadingAttribute(isBelowFold: boolean): 'lazy' | 'eager' {
  return isBelowFold ? 'lazy' : 'eager'
}

/**
 * Validates that an image element has the correct loading attribute
 * for its position (below-the-fold images should have loading="lazy")
 * 
 * @param loadingAttr - The loading attribute value
 * @param isBelowFold - Whether the image is below the fold
 * @returns Whether the loading attribute is correct
 */
export function validateImageLazyLoading(
  loadingAttr: string | null | undefined,
  isBelowFold: boolean
): boolean {
  if (isBelowFold) {
    return loadingAttr === 'lazy'
  }
  // Above-the-fold images can be either 'eager' or not set (defaults to eager)
  return loadingAttr === 'eager' || loadingAttr === null || loadingAttr === undefined
}

/**
 * Generates preload link tags for critical resources
 * 
 * @param resources - Array of critical resources to preload
 * @returns Array of link tag objects for useHead
 */
export function generatePreloadHints(resources: CriticalResource[]): PreloadHint[] {
  return resources.map(resource => ({
    href: resource.href,
    as: resource.as,
    ...(resource.type && { type: resource.type }),
    ...(resource.crossorigin !== undefined && { crossorigin: resource.crossorigin }),
    ...(resource.media && { media: resource.media })
  }))
}

/**
 * Validates that preload hints are present for critical resources
 * 
 * @param preloadHints - Array of preload hints
 * @param criticalResources - Array of critical resource URLs
 * @returns Whether all critical resources have preload hints
 */
export function validatePreloadHintsPresence(
  preloadHints: PreloadHint[],
  criticalResources: string[]
): boolean {
  const preloadedUrls = new Set(preloadHints.map(hint => hint.href))
  return criticalResources.every(url => preloadedUrls.has(url))
}

/**
 * Validates that a preload hint has the correct structure
 * 
 * @param hint - The preload hint to validate
 * @returns Whether the hint is valid
 */
export function validatePreloadHintStructure(hint: PreloadHint): boolean {
  // Must have href and as
  if (!hint.href || !hint.as) {
    return false
  }
  
  // as must be a valid value
  const validAsValues = ['image', 'style', 'script', 'font']
  if (!validAsValues.includes(hint.as)) {
    return false
  }
  
  // href must be a valid URL or path
  if (typeof hint.href !== 'string' || hint.href.length === 0) {
    return false
  }
  
  return true
}

/**
 * Default critical resources for the application
 * These are above-the-fold resources that should be preloaded
 */
export const defaultCriticalResources: CriticalResource[] = [
  {
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    as: 'style'
  }
]

/**
 * Composable for performance optimization
 * Provides reactive utilities for lazy loading and preload hints
 */
export function usePerformanceOptimization() {
  /**
   * Applies preload hints to the document head
   * 
   * @param resources - Critical resources to preload
   */
  const applyPreloadHints = (resources: CriticalResource[] = defaultCriticalResources) => {
    const hints = generatePreloadHints(resources)
    
    // Use Nuxt's useHead to add preload links
    useHead({
      link: hints.map(hint => ({
        rel: 'preload',
        href: hint.href,
        as: hint.as,
        ...(hint.type && { type: hint.type }),
        ...(hint.crossorigin !== undefined && { crossorigin: hint.crossorigin }),
        ...(hint.media && { media: hint.media })
      }))
    })
    
    return hints
  }

  /**
   * Gets the appropriate loading attribute for an image
   * 
   * @param isBelowFold - Whether the image is below the fold
   * @returns The loading attribute value
   */
  const getLoadingAttribute = (isBelowFold: boolean = true): 'lazy' | 'eager' => {
    return getImageLoadingAttribute(isBelowFold)
  }

  return {
    applyPreloadHints,
    getLoadingAttribute,
    generatePreloadHints,
    validateImageLazyLoading,
    validatePreloadHintsPresence
  }
}

export default usePerformanceOptimization
