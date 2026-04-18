import { describe, expect, it } from 'vitest'

import { resolveSEOConfig } from '~/composables/useSEO'

const defaults = {
  title: 'TryUtils',
  description: 'default description',
  keywords: 'tryutils',
  ogTitle: 'TryUtils OG',
  ogDescription: 'TryUtils OG description',
  twitterTitle: 'TryUtils Twitter',
  twitterDescription: 'TryUtils Twitter description',
}

describe('resolveSEOConfig', () => {
  it('keeps canonical and og:url aligned for legacy English blog routes', () => {
    const seoConfig = resolveSEOConfig({}, {
      baseUrl: 'https://www.tryutils.com',
      routePath: '/blog/heicconverter/heic-technical-guide.en',
      defaults,
    })

    expect(seoConfig.canonical)
      .toBe('https://www.tryutils.com/en/blog/heicconverter/heic-technical-guide')
    expect(seoConfig.ogUrl).toBe(seoConfig.canonical)
  })

  it('keeps canonical and og:url aligned for canonical Chinese routes', () => {
    const seoConfig = resolveSEOConfig({ title: 'Image Compressor' }, {
      baseUrl: 'https://www.tryutils.com',
      routePath: '/image-compressor',
      defaults,
    })

    expect(seoConfig.canonical)
      .toBe('https://www.tryutils.com/image-compressor')
    expect(seoConfig.ogUrl).toBe(seoConfig.canonical)
    expect(seoConfig.title).toBe('Image Compressor')
  })
})
