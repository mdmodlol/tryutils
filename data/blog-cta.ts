import { getToolById } from '~/data/toolConfig'

export const MAINLINE_TOOL_IDS = [
  'image-compressor',
  'heic-converter',
  'image-format-converter',
] as const

export type MainlineToolId = typeof MAINLINE_TOOL_IDS[number]

export const BLOG_CTA_VARIANTS = [
  'compress-now',
  'convert-heic-now',
  'convert-format-now',
] as const

export type BlogCtaVariant = typeof BLOG_CTA_VARIANTS[number]

type LocalizedText = {
  zh: string
  en: string
}

type BlogCtaDefinition = {
  toolId: MainlineToolId
  eyebrow: LocalizedText
  title: LocalizedText
  description: LocalizedText
  buttonLabel: LocalizedText
}

const blogCtaDefinitions: Record<BlogCtaVariant, BlogCtaDefinition> = {
  'compress-now': {
    toolId: 'image-compressor',
    eyebrow: {
      zh: '继续动手',
      en: 'Try the tool',
    },
    title: {
      zh: '直接在浏览器里压缩图片',
      en: 'Compress images directly in your browser',
    },
    description: {
      zh: '上传图片后就能快速减小体积，适合网站上传、博客配图和日常图片优化。',
      en: 'Reduce image size right away for website uploads, blog publishing, and quick day-to-day optimization.',
    },
    buttonLabel: {
      zh: '打开图片压缩器',
      en: 'Open Image Compressor',
    },
  },
  'convert-heic-now': {
    toolId: 'heic-converter',
    eyebrow: {
      zh: '立即转换',
      en: 'Convert now',
    },
    title: {
      zh: '把 HEIC 照片快速转成常见格式',
      en: 'Convert HEIC photos into common formats',
    },
    description: {
      zh: '适合处理 iPhone 照片、分享图片和兼容不支持 HEIC 的网站或设备。',
      en: 'Great for iPhone photos, file sharing, and any workflow that still needs JPG or PNG compatibility.',
    },
    buttonLabel: {
      zh: '打开 HEIC 转换器',
      en: 'Open HEIC Converter',
    },
  },
  'convert-format-now': {
    toolId: 'image-format-converter',
    eyebrow: {
      zh: '继续处理',
      en: 'Keep going',
    },
    title: {
      zh: '继续转换成更适合的图片格式',
      en: 'Convert images into the format you actually need',
    },
    description: {
      zh: '在 JPG、PNG、WebP、AVIF 等常见格式之间切换，方便继续压缩、兼容和发布。',
      en: 'Switch between JPG, PNG, WebP, AVIF, and other common formats for easier publishing and compatibility.',
    },
    buttonLabel: {
      zh: '打开格式转换器',
      en: 'Open Format Converter',
    },
  },
}

export function isMainlineToolId(value: unknown): value is MainlineToolId {
  return typeof value === 'string' && MAINLINE_TOOL_IDS.includes(value as MainlineToolId)
}

export function isBlogCtaVariant(value: unknown): value is BlogCtaVariant {
  return typeof value === 'string' && BLOG_CTA_VARIANTS.includes(value as BlogCtaVariant)
}

export function getDefaultCtaVariant(toolId: MainlineToolId): BlogCtaVariant {
  switch (toolId) {
    case 'heic-converter':
      return 'convert-heic-now'
    case 'image-format-converter':
      return 'convert-format-now'
    case 'image-compressor':
    default:
      return 'compress-now'
  }
}

export function getBlogCtaDefinition(
  variant: BlogCtaVariant,
  locale: 'zh' | 'en'
) {
  const definition = blogCtaDefinitions[variant]
  const tool = getToolById(definition.toolId)

  return {
    variant,
    toolId: definition.toolId,
    eyebrow: definition.eyebrow[locale],
    title: definition.title[locale],
    description: definition.description[locale],
    buttonLabel: definition.buttonLabel[locale],
    toolName: tool?.name[locale] || tool?.name.zh || definition.toolId,
    toolPath: tool?.path || `/${definition.toolId}`,
  }
}
