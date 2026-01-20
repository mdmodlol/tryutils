/**
 * FAQ Data for Tool Pages
 * Provides FAQ items for each tool to generate structured data
 * Requirements: 2.4
 */

export interface FAQItem {
  question: string
  answer: string
  category?: string
}

export interface ToolFAQs {
  zh: FAQItem[]
  en: FAQItem[]
}

export const toolFAQs: Record<string, ToolFAQs> = {
  'image-compressor': {
    zh: [
      {
        question: '图片压缩会损失画质吗？',
        answer: '我们的智能压缩算法会在文件大小和画质之间取得最佳平衡。您可以通过质量滑块自定义压缩程度，在保持高质量的同时大幅减小文件大小。',
        category: 'quality'
      },
      {
        question: '支持哪些图片格式？',
        answer: '支持 JPEG、PNG、WebP、BMP、TIFF 等主流图片格式，最大支持 100MB 的图片文件。',
        category: 'formats'
      },
      {
        question: '图片会上传到服务器吗？',
        answer: '不会。所有处理都在您的浏览器本地完成，图片不会上传到任何服务器，完全保护您的隐私。',
        category: 'privacy'
      },
      {
        question: '可以批量压缩图片吗？',
        answer: '是的！支持批量上传和压缩，一次最多可处理 20 个文件，大大提高工作效率。',
        category: 'batch'
      },
      {
        question: '压缩后的图片可以用于网站吗？',
        answer: '当然可以！压缩后的图片非常适合网站使用，可以显著提升页面加载速度，改善用户体验和 SEO 表现。',
        category: 'usage'
      }
    ],
    en: [
      {
        question: 'Will image compression affect quality?',
        answer: 'Our smart compression algorithm achieves the best balance between file size and image quality. You can customize the compression level using the quality slider to significantly reduce file size while maintaining high quality.',
        category: 'quality'
      },
      {
        question: 'What image formats are supported?',
        answer: 'Supports JPEG, PNG, WebP, BMP, TIFF and other mainstream image formats, with a maximum file size of 100MB.',
        category: 'formats'
      },
      {
        question: 'Will images be uploaded to servers?',
        answer: 'No. All processing is done locally in your browser. Images are never uploaded to any server, completely protecting your privacy.',
        category: 'privacy'
      },
      {
        question: 'Can I compress multiple images at once?',
        answer: 'Yes! Batch upload and compression is supported, processing up to 20 files at once, greatly improving work efficiency.',
        category: 'batch'
      },
      {
        question: 'Can compressed images be used for websites?',
        answer: 'Absolutely! Compressed images are perfect for websites, significantly improving page load speed, user experience and SEO performance.',
        category: 'usage'
      }
    ]
  },
  'heic-converter': {
    zh: [
      {
        question: '什么是 HEIC 格式？',
        answer: 'HEIC（High Efficiency Image Container）是苹果设备使用的高效图片格式，从 iOS 11 开始作为默认相机格式。相比 JPEG 可以在相同画质下减少约 50% 的文件大小。',
        category: 'format'
      },
      {
        question: '为什么需要转换 HEIC？',
        answer: 'HEIC 格式在 Windows 和部分网站上兼容性较差，转换为 JPEG 或 PNG 可以确保在所有设备和平台上正常查看和使用。',
        category: 'compatibility'
      },
      {
        question: '转换后画质会下降吗？',
        answer: '我们提供高质量转换选项，您可以选择 90% 以上的质量设置来保持接近原图的画质。转换过程中会尽可能保留原始图片的细节。',
        category: 'quality'
      },
      {
        question: '支持批量转换吗？',
        answer: '是的！支持一次选择多个 HEIC 文件进行批量转换，最多可同时处理 10 个文件，转换完成后可以一键下载全部。',
        category: 'batch'
      },
      {
        question: '转换需要多长时间？',
        answer: '转换速度取决于文件大小和您的设备性能。一般来说，单个文件转换只需几秒钟，批量转换会稍长一些。',
        category: 'performance'
      }
    ],
    en: [
      {
        question: 'What is HEIC format?',
        answer: 'HEIC (High Efficiency Image Container) is a high-efficiency image format used by Apple devices, serving as the default camera format since iOS 11. It can reduce file size by about 50% compared to JPEG at the same quality.',
        category: 'format'
      },
      {
        question: 'Why do I need to convert HEIC?',
        answer: 'HEIC format has poor compatibility on Windows and some websites. Converting to JPEG or PNG ensures normal viewing and use on all devices and platforms.',
        category: 'compatibility'
      },
      {
        question: 'Will conversion reduce image quality?',
        answer: 'We provide high-quality conversion options. You can choose quality settings above 90% to maintain quality close to the original. The conversion process preserves as much detail as possible.',
        category: 'quality'
      },
      {
        question: 'Is batch conversion supported?',
        answer: 'Yes! You can select multiple HEIC files for batch conversion, processing up to 10 files at once. After conversion, you can download all files with one click.',
        category: 'batch'
      },
      {
        question: 'How long does conversion take?',
        answer: 'Conversion speed depends on file size and your device performance. Generally, a single file conversion takes only a few seconds, while batch conversion takes slightly longer.',
        category: 'performance'
      }
    ]
  },
  'image-format-converter': {
    zh: [
      {
        question: '支持哪些图片格式转换？',
        answer: '支持 JPEG、PNG、WebP、GIF、AVIF、TIFF 格式之间的相互转换。您可以从任何支持的格式转换为任何其他支持的格式。',
        category: 'formats'
      },
      {
        question: '不同格式有什么区别？',
        answer: 'JPEG 最适合照片，PNG 适合有透明度的图片，WebP 适合网页优化，GIF 适合动画，AVIF 是下一代压缩格式，TIFF 适合专业用途。',
        category: 'comparison'
      },
      {
        question: '转换会改变图片尺寸吗？',
        answer: '默认情况下不会改变图片尺寸，只转换格式。如果需要调整尺寸，可以配合我们的图片压缩工具使用。',
        category: 'size'
      },
      {
        question: '文件大小有限制吗？',
        answer: '最大支持 100MB 的文件。为了获得最佳性能，我们建议使用 50MB 以下的文件。',
        category: 'limits'
      },
      {
        question: '转换后的文件安全吗？',
        answer: '所有文件都在您的浏览器中本地处理，不会上传到我们的服务器，确保完全的隐私和安全。',
        category: 'privacy'
      }
    ],
    en: [
      {
        question: 'What image formats are supported for conversion?',
        answer: 'Supports conversion between JPEG, PNG, WebP, GIF, AVIF, and TIFF formats. You can convert from any supported format to any other supported format.',
        category: 'formats'
      },
      {
        question: 'What are the differences between formats?',
        answer: 'JPEG is best for photos, PNG for images with transparency, WebP for web optimization, GIF for animations, AVIF is a next-generation compression format, and TIFF is for professional use.',
        category: 'comparison'
      },
      {
        question: 'Will conversion change image dimensions?',
        answer: 'By default, image dimensions are not changed, only the format is converted. If you need to resize, you can use our image compression tool.',
        category: 'size'
      },
      {
        question: 'Is there a file size limit?',
        answer: 'Maximum file size is 100MB. For best performance, we recommend using files under 50MB.',
        category: 'limits'
      },
      {
        question: 'Are converted files secure?',
        answer: 'All files are processed locally in your browser and are not uploaded to our servers, ensuring complete privacy and security.',
        category: 'privacy'
      }
    ]
  },
  'qr-code-generator': {
    zh: [
      {
        question: '什么是二维码？',
        answer: '二维码（QR Code）是一种二维条形码，可以存储文本、URL、电话号码、电子邮件等信息。用户可以通过手机扫描二维码快速获取信息。',
        category: 'basics'
      },
      {
        question: '可以自定义二维码的颜色吗？',
        answer: '是的！我们支持自定义前景色和背景色，还提供多种颜色预设。系统会自动检查颜色对比度，确保二维码可以被正常扫描。',
        category: 'customization'
      },
      {
        question: '如何在二维码中添加 Logo？',
        answer: '点击"上传 Logo"按钮，选择 PNG、JPG 或 SVG 格式的图片文件（最大 2MB）。您可以调整 Logo 的大小，系统会自动在 Logo 周围添加白色边距以确保可扫描性。',
        category: 'logo'
      },
      {
        question: '支持批量生成二维码吗？',
        answer: '支持！切换到批量模式，每行输入一个内容，或导入 CSV 文件。一次最多可以生成 50 个二维码，完成后可以打包下载为 ZIP 文件。',
        category: 'batch'
      },
      {
        question: '生成的二维码数据会被上传吗？',
        answer: '不会。所有二维码生成都在您的浏览器本地完成，输入的数据和上传的 Logo 都不会发送到服务器，完全保护您的隐私。',
        category: 'privacy'
      }
    ],
    en: [
      {
        question: 'What is a QR code?',
        answer: 'A QR Code (Quick Response Code) is a two-dimensional barcode that can store text, URLs, phone numbers, emails, and other information. Users can quickly access information by scanning the QR code with their phone.',
        category: 'basics'
      },
      {
        question: 'Can I customize QR code colors?',
        answer: 'Yes! We support custom foreground and background colors, and provide multiple color presets. The system automatically checks color contrast to ensure the QR code can be scanned properly.',
        category: 'customization'
      },
      {
        question: 'How do I add a logo to the QR code?',
        answer: 'Click the "Upload Logo" button and select a PNG, JPG, or SVG image file (max 2MB). You can adjust the logo size, and the system will automatically add white margins around the logo to ensure scannability.',
        category: 'logo'
      },
      {
        question: 'Does it support batch QR code generation?',
        answer: 'Yes! Switch to batch mode, enter one item per line, or import a CSV file. You can generate up to 50 QR codes at once, and download them as a ZIP file when complete.',
        category: 'batch'
      },
      {
        question: 'Is my QR code data uploaded?',
        answer: 'No. All QR code generation is done locally in your browser. Input data and uploaded logos are never sent to servers, completely protecting your privacy.',
        category: 'privacy'
      }
    ]
  }
}

/**
 * Get FAQ items for a specific tool and locale
 */
export function getToolFAQs(toolId: string, locale: string): FAQItem[] {
  const faqs = toolFAQs[toolId]
  if (!faqs) return []
  return faqs[locale as keyof ToolFAQs] || faqs.en || []
}

/**
 * Get all FAQ items for a locale
 */
export function getAllFAQs(locale: string): Record<string, FAQItem[]> {
  const result: Record<string, FAQItem[]> = {}
  for (const [toolId, faqs] of Object.entries(toolFAQs)) {
    result[toolId] = faqs[locale as keyof ToolFAQs] || faqs.en || []
  }
  return result
}
