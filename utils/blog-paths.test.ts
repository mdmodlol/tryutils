import { describe, expect, it } from 'vitest'

import { blogLegacyAliasMap, blogPublicRoutes } from '~/data/blog-route-manifest'
import {
  getCanonicalPath,
  getContentBlogPathFromPublicPath,
  getPublicBlogPathFromContentPath
} from '~/utils/blog-paths'

describe('blog path helpers', () => {
  it('normalizes mixed-case Chinese blog categories', () => {
    expect(getCanonicalPath('/blog/HeicConverter/what-is-heic-format'))
      .toBe('/blog/heicconverter/what-is-heic-format')
  })

  it('normalizes legacy .en blog URLs to English public routes', () => {
    expect(getCanonicalPath('/en/blog/ImageCompression/browser-image-compression-libraries.en'))
      .toBe('/en/blog/imagecompression/browser-image-compression-libraries')
  })

  it('normalizes legacy -en slugs to English public routes', () => {
    expect(getCanonicalPath('/blog/markdownpreview/markdown-complete-guide-en'))
      .toBe('/en/blog/markdownpreview/markdown-complete-guide')
  })

  it('maps English public routes back to content paths', () => {
    expect(getContentBlogPathFromPublicPath('/en/blog/imagecompression/browser-image-compression-libraries'))
      .toBe('/blog/imagecompression/browser-image-compression-libraries.en')
  })

  it('maps content paths to canonical public routes', () => {
    expect(getPublicBlogPathFromContentPath('/blog/urlcodec/url-encoding-explained'))
      .toBe('/blog/urlcodec/url-encoding-explained')
    expect(getPublicBlogPathFromContentPath('/blog/heicconverter/what-is-heic-format.en'))
      .toBe('/en/blog/heicconverter/what-is-heic-format')
  })
})

describe('blog route manifest', () => {
  it('keeps canonical public routes lowercase', () => {
    expect(blogPublicRoutes.every((route) => route === route.toLowerCase())).toBe(true)
  })

  it('contains long-term aliases for historical mixed-case paths', () => {
    expect(blogLegacyAliasMap.get('/blog/Base64Codec/base64-encoding-explained'))
      .toBe('/blog/base64codec/base64-encoding-explained')
    expect(blogLegacyAliasMap.get('/en/blog/MarkdownPreview/markdown-complete-guide'))
      .toBe('/en/blog/markdownpreview/markdown-complete-guide')
  })

  it('contains long-term aliases for historical English -en slugs', () => {
    expect(blogLegacyAliasMap.get('/blog/MarkdownPreview/markdown-complete-guide-en'))
      .toBe('/en/blog/markdownpreview/markdown-complete-guide')
    expect(blogLegacyAliasMap.get('/en/blog/HeicConverter/what-is-heic-format-en'))
      .toBe('/en/blog/heicconverter/what-is-heic-format')
  })
})
