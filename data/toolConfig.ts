/**
 * Tool configuration data
 * Defines all available tools with metadata used by SEO and internal linking.
 */

export interface ToolConfig {
  id: string
  name: Record<string, string>
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
      zh: '智能压缩图片体积，在尽量保留画质的同时减少文件大小。',
      en: 'Intelligently compress image size while maintaining high quality and reducing file volume.'
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
      zh: '把 iPhone 和 iPad 的 HEIC 图片转换成 JPG、PNG 等更常见的格式。',
      en: 'Convert iPhone and iPad HEIC images to JPG, PNG, and other common formats.'
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
      zh: '支持 JPEG、PNG、WebP、GIF、AVIF、TIFF 等多种图片格式之间互转。',
      en: 'Convert between multiple image formats, including JPEG, PNG, WebP, GIF, AVIF, and TIFF.'
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
      zh: '在线生成二维码，支持颜色、尺寸、Logo 嵌入和批量生成。',
      en: 'Generate QR codes online with custom colors, sizes, logo embedding, and batch generation.'
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
      zh: '对 JSON 进行格式化、校验和压缩，并提供语法高亮与错误定位。',
      en: 'Format, validate, and minify JSON with syntax highlighting and error location.'
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
      zh: '支持文本和图片的 Base64 编码、解码与拖拽导入。',
      en: 'Encode and decode Base64 for text and images, with file drag-and-drop support.'
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
      zh: '在 HEX、RGB、HSL 等颜色格式之间快速转换，并提供可视化调色器。',
      en: 'Convert between HEX, RGB, and HSL color formats with a visual color picker.'
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
      zh: '比较两段文本的差异，高亮显示新增、删除和修改内容。',
      en: 'Compare two texts and highlight additions, deletions, and modifications.'
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
      zh: '用于 URL 和 URI 的编码与解码，支持 encodeURIComponent 和 encodeURI。',
      en: 'Encode and decode URLs with support for encodeURIComponent and encodeURI.'
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
      zh: '实时把 Markdown 转成 HTML 预览，支持 GFM 语法、代码高亮和导出。',
      en: 'Preview Markdown as HTML in real time with GFM syntax, code highlighting, and export.'
    },
    icon: 'heroicons:document-text',
    path: '/markdown-preview',
    category: 'DevTools',
    keywords: ['markdown', 'preview', 'html', 'convert', '预览', '转换', 'md', 'github', 'gfm', 'export']
  }
]

export function getToolById(id: string): ToolConfig | undefined {
  return toolConfigs.find(tool => tool.id === id)
}

export function getToolByPath(path: string): ToolConfig | undefined {
  return toolConfigs.find(tool => tool.path === path)
}

export function getToolsByCategory(category: string): ToolConfig[] {
  return toolConfigs.filter(tool => tool.category === category)
}

export function getAllToolIds(): string[] {
  return toolConfigs.map(tool => tool.id)
}
