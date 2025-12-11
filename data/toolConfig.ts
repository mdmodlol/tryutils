/**
 * Tool Configuration Data
 * Defines all available tools with their metadata for SEO and internal linking
 * Requirements: 4.1, 4.2
 */

export interface ToolConfig {
  id: string
  name: Record<string, string>  // i18n
  description: Record<string, string>
  icon: string
  path: string
  category: string
  keywords: string[]
}

export const toolConfigs: ToolConfig[] = [
  {
    id: 'image-compressor',
    name: {
      zh: '图片压缩',
      en: 'Image Compressor'
    },
    description: {
      zh: '智能压缩图片大小，保持高质量的同时减少文件体积',
      en: 'Intelligently compress image size while maintaining high quality and reducing file volume'
    },
    icon: 'heroicons:photo',
    path: '/image-compressor',
    category: 'ImageCompression',
    keywords: ['compress', 'optimize', '压缩', '优化', 'jpg', 'png', 'webp', 'image', '图片']
  },
  {
    id: 'heic-converter',
    name: {
      zh: 'HEIC 转换器',
      en: 'HEIC Converter'
    },
    description: {
      zh: '将 iPhone/iPad 的 HEIC 图片转换为 JPG、PNG 等常用格式',
      en: 'Convert iPhone/iPad HEIC images to JPG, PNG and other common formats'
    },
    icon: 'heroicons:arrow-path',
    path: '/heic-converter',
    category: 'HeicConverter',
    keywords: ['heic', 'heif', 'convert', 'iphone', 'ipad', 'apple', '转换', 'jpg', 'png']
  },
  {
    id: 'image-format-converter',
    name: {
      zh: '格式转换',
      en: 'Format Converter'
    },
    description: {
      zh: '支持多种图片格式转换，包括 JPEG、PNG、WebP、GIF、AVIF、TIFF',
      en: 'Supports multiple image format conversions, including JPEG, PNG, WebP, GIF, AVIF, TIFF'
    },
    icon: 'heroicons:arrows-right-left',
    path: '/image-format-converter',
    category: 'FormatConverter',
    keywords: ['format', 'convert', 'jpeg', 'png', 'webp', 'gif', 'avif', 'tiff', '格式', '转换']
  }
]

/**
 * Get tool config by ID
 */
export function getToolById(id: string): ToolConfig | undefined {
  return toolConfigs.find(tool => tool.id === id)
}

/**
 * Get tool config by path
 */
export function getToolByPath(path: string): ToolConfig | undefined {
  return toolConfigs.find(tool => tool.path === path)
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): ToolConfig[] {
  return toolConfigs.filter(tool => tool.category === category)
}

/**
 * Get all tool IDs
 */
export function getAllToolIds(): string[] {
  return toolConfigs.map(tool => tool.id)
}
