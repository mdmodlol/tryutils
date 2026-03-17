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
  },
  {
    id: 'qr-code-generator',
    name: {
      zh: '二维码生成器',
      en: 'QR Code Generator'
    },
    description: {
      zh: '在线生成二维码，支持自定义颜色、尺寸、Logo 嵌入和批量生成',
      en: 'Generate QR codes online with custom colors, sizes, logo embedding and batch generation'
    },
    icon: 'heroicons:qr-code',
    path: '/qr-code-generator',
    category: 'QRCodeGenerator',
    keywords: ['qr', 'qrcode', 'barcode', 'generate', '二维码', '生成', 'url', 'link', 'batch', '批量']
  },
  {
    id: 'json-formatter',
    name: {
      zh: 'JSON 格式化',
      en: 'JSON Formatter'
    },
    description: {
      zh: 'JSON 格式化、校验、压缩，支持语法高亮和错误定位',
      en: 'JSON formatting, validation, and minification with syntax highlighting and error location'
    },
    icon: 'heroicons:code-bracket',
    path: '/json-formatter',
    category: 'DevTools',
    keywords: ['json', 'format', 'validate', 'minify', '格式化', '校验', '压缩', 'beautify']
  },
  {
    id: 'base64-codec',
    name: {
      zh: 'Base64 编解码',
      en: 'Base64 Codec'
    },
    description: {
      zh: '文本和图片的 Base64 编码/解码，支持文件拖拽',
      en: 'Base64 encoding/decoding for text and images, with file drag & drop support'
    },
    icon: 'heroicons:lock-closed',
    path: '/base64-codec',
    category: 'DevTools',
    keywords: ['base64', 'encode', 'decode', '编码', '解码', 'text', 'image', '文本', '图片']
  },
  {
    id: 'color-converter',
    name: {
      zh: '颜色转换',
      en: 'Color Converter'
    },
    description: {
      zh: 'HEX、RGB、HSL 颜色格式互转，可视化调色板',
      en: 'Convert between HEX, RGB, HSL color formats with visual color picker'
    },
    icon: 'heroicons:swatch',
    path: '/color-converter',
    category: 'DevTools',
    keywords: ['color', 'hex', 'rgb', 'hsl', '颜色', '转换', 'picker', '调色板']
  },
  {
    id: 'text-diff',
    name: {
      zh: '文本对比',
      en: 'Text Diff'
    },
    description: {
      zh: '对比两段文本的差异，高亮显示增删改内容',
      en: 'Compare two texts and highlight additions, deletions, and modifications'
    },
    icon: 'heroicons:document-duplicate',
    path: '/text-diff',
    category: 'DevTools',
    keywords: ['diff', 'compare', 'text', '对比', '差异', '文本', 'merge']
  },
  {
    id: 'url-codec',
    name: {
      zh: 'URL 编解码',
      en: 'URL Codec'
    },
    description: {
      zh: 'URL 编码/解码工具，支持 encodeURIComponent 和 encodeURI',
      en: 'URL encoding/decoding tool with encodeURIComponent and encodeURI support'
    },
    icon: 'heroicons:link',
    path: '/url-codec',
    category: 'DevTools',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent', '编码', '解码', 'encodeURIComponent', 'encodeURI']
  },
  {
    id: 'markdown-preview',
    name: {
      zh: 'Markdown 预览',
      en: 'Markdown Preview'
    },
    description: {
      zh: '实时 Markdown 转 HTML 预览，支持 GFM 语法、代码高亮和导出功能',
      en: 'Real-time Markdown to HTML preview with GFM syntax, code highlighting and export'
    },
    icon: 'heroicons:document-text',
    path: '/markdown-preview',
    category: 'DevTools',
    keywords: ['markdown', 'preview', 'html', 'convert', '预览', '转换', 'md', 'github', 'gfm', 'export']
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
