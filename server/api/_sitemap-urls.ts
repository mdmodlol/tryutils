import { blogPublicRoutes } from '~/data/blog-route-manifest'

const staticRoutes = [
  '/',
  '/en',
  '/about',
  '/en/about',
  '/contact',
  '/en/contact',
  '/blog',
  '/en/blog',
  '/image-compressor',
  '/en/image-compressor',
  '/image-format-converter',
  '/en/image-format-converter',
  '/heic-converter',
  '/en/heic-converter',
  '/qr-code-generator',
  '/en/qr-code-generator',
  '/privacy',
  '/en/privacy',
  '/image-tools',
  '/en/image-tools',
  '/json-formatter',
  '/en/json-formatter',
  '/base64-codec',
  '/en/base64-codec',
  '/color-converter',
  '/en/color-converter',
  '/text-diff',
  '/en/text-diff',
  '/url-codec',
  '/en/url-codec',
  '/dev-tools',
  '/en/dev-tools'
]

export default defineSitemapEventHandler(() => {
  const uniqueRoutes = [...new Set([...staticRoutes, ...blogPublicRoutes])]
  return uniqueRoutes.map((loc) => asSitemapUrl({ loc }))
})
