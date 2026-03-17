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
  },
  'json-formatter': {
    zh: [
      {
        question: 'JSON 格式化工具支持哪些功能？',
        answer: '支持 JSON 格式化（美化）、压缩（Minify）、语法校验、错误定位和语法高亮。可以一键将紧凑的 JSON 转为可读格式，或将格式化的 JSON 压缩为单行。',
        category: 'features'
      },
      {
        question: 'JSON 格式化后数据会上传到服务器吗？',
        answer: '不会。所有 JSON 处理都在您的浏览器本地完成，数据不会发送到任何服务器，完全保护您的隐私和数据安全。',
        category: 'privacy'
      },
      {
        question: '可以处理多大的 JSON 数据？',
        answer: '工具可以处理大多数常见大小的 JSON 数据。对于超大文件（超过 10MB），建议使用命令行工具如 jq 进行处理。',
        category: 'limits'
      },
      {
        question: 'JSON 格式化支持哪些缩进方式？',
        answer: '默认使用 2 个空格缩进，这是业界最常用的标准。格式化后的 JSON 结构清晰，便于阅读和调试。',
        category: 'formatting'
      },
      {
        question: '如何快速定位 JSON 语法错误？',
        answer: '粘贴 JSON 数据后，工具会自动检测语法错误并高亮显示错误位置，同时给出错误描述，帮助您快速定位和修复问题。',
        category: 'validation'
      }
    ],
    en: [
      {
        question: 'What features does the JSON Formatter support?',
        answer: 'It supports JSON formatting (beautify), minification, syntax validation, error location, and syntax highlighting. One-click conversion between compact and readable JSON formats.',
        category: 'features'
      },
      {
        question: 'Is my JSON data uploaded to servers?',
        answer: 'No. All JSON processing is done locally in your browser. Data is never sent to any server, ensuring complete privacy and data security.',
        category: 'privacy'
      },
      {
        question: 'How large of a JSON file can it handle?',
        answer: 'The tool can handle most common-sized JSON data. For very large files (over 10MB), we recommend using command-line tools like jq.',
        category: 'limits'
      },
      {
        question: 'What indentation styles are supported?',
        answer: 'The default is 2-space indentation, which is the most common industry standard. The formatted JSON has a clear structure for easy reading and debugging.',
        category: 'formatting'
      },
      {
        question: 'How do I quickly locate JSON syntax errors?',
        answer: 'After pasting JSON data, the tool automatically detects syntax errors, highlights the error location, and provides error descriptions to help you quickly find and fix issues.',
        category: 'validation'
      }
    ]
  },
  'base64-codec': {
    zh: [
      {
        question: 'Base64 编码和加密有什么区别？',
        answer: 'Base64 是编码方式，不是加密。任何人都可以解码 Base64 数据，它不提供任何安全保护。Base64 的目的是将二进制数据转换为文本格式，方便在文本协议中传输。',
        category: 'basics'
      },
      {
        question: '支持哪些类型的数据编解码？',
        answer: '支持文本的 Base64 编码和解码，以及图片文件的 Base64 转换。可以将图片转为 Data URI 格式，直接用于 HTML 和 CSS。',
        category: 'features'
      },
      {
        question: 'Base64 编码后数据会变大吗？',
        answer: '是的，Base64 编码会使数据体积增加约 33%。这是因为每 3 个字节的二进制数据会被编码为 4 个 ASCII 字符。',
        category: 'size'
      },
      {
        question: '可以处理中文等非 ASCII 字符吗？',
        answer: '可以。工具会自动使用 UTF-8 编码处理中文、日文、韩文等多字节字符，确保编解码结果正确。',
        category: 'encoding'
      },
      {
        question: '数据会上传到服务器吗？',
        answer: '不会。所有编解码操作都在浏览器本地完成，您的数据不会离开您的设备，完全保护隐私安全。',
        category: 'privacy'
      }
    ],
    en: [
      {
        question: 'What is the difference between Base64 encoding and encryption?',
        answer: 'Base64 is an encoding scheme, not encryption. Anyone can decode Base64 data — it provides no security protection. Its purpose is to convert binary data into text format for transmission through text-based protocols.',
        category: 'basics'
      },
      {
        question: 'What types of data can be encoded/decoded?',
        answer: 'Supports text Base64 encoding/decoding and image file Base64 conversion. You can convert images to Data URI format for direct use in HTML and CSS.',
        category: 'features'
      },
      {
        question: 'Does Base64 encoding increase data size?',
        answer: 'Yes, Base64 encoding increases data size by approximately 33%. This is because every 3 bytes of binary data are encoded into 4 ASCII characters.',
        category: 'size'
      },
      {
        question: 'Can it handle non-ASCII characters like Chinese?',
        answer: 'Yes. The tool automatically uses UTF-8 encoding to handle multi-byte characters including Chinese, Japanese, and Korean, ensuring correct encoding/decoding results.',
        category: 'encoding'
      },
      {
        question: 'Is my data uploaded to servers?',
        answer: 'No. All encoding/decoding operations are performed locally in your browser. Your data never leaves your device, ensuring complete privacy.',
        category: 'privacy'
      }
    ]
  },
  'color-converter': {
    zh: [
      {
        question: '支持哪些颜色格式转换？',
        answer: '支持 HEX、RGB、HSL 三种主流颜色格式之间的互相转换。输入任意一种格式，即可自动获得其他格式的对应值。',
        category: 'formats'
      },
      {
        question: '如何使用可视化调色板？',
        answer: '工具提供直观的可视化调色板，您可以通过拖动色相、饱和度和亮度滑块来选择颜色，实时预览颜色效果并获取对应的颜色代码。',
        category: 'usage'
      },
      {
        question: 'HEX、RGB、HSL 有什么区别？',
        answer: 'HEX 是十六进制颜色码（如 #FF5733），最常用于 CSS。RGB 用红绿蓝三个通道值表示颜色（如 rgb(255, 87, 51)）。HSL 用色相、饱和度、亮度表示（如 hsl(14, 100%, 60%)），更直观易理解。',
        category: 'basics'
      },
      {
        question: '可以复制颜色代码吗？',
        answer: '可以！每种格式的颜色值旁边都有一键复制按钮，方便您直接粘贴到代码中使用。',
        category: 'features'
      },
      {
        question: '颜色数据会上传到服务器吗？',
        answer: '不会。所有颜色转换都在浏览器本地完成，不涉及任何网络请求。',
        category: 'privacy'
      }
    ],
    en: [
      {
        question: 'What color formats are supported?',
        answer: 'Supports conversion between HEX, RGB, and HSL — three mainstream color formats. Enter any format and automatically get the corresponding values in other formats.',
        category: 'formats'
      },
      {
        question: 'How do I use the visual color picker?',
        answer: 'The tool provides an intuitive visual color picker. You can drag hue, saturation, and lightness sliders to select colors, preview in real-time, and get the corresponding color codes.',
        category: 'usage'
      },
      {
        question: 'What are the differences between HEX, RGB, and HSL?',
        answer: 'HEX is hexadecimal color code (e.g., #FF5733), most commonly used in CSS. RGB uses red, green, blue channel values (e.g., rgb(255, 87, 51)). HSL uses hue, saturation, lightness (e.g., hsl(14, 100%, 60%)), which is more intuitive.',
        category: 'basics'
      },
      {
        question: 'Can I copy color codes?',
        answer: 'Yes! Each color format value has a one-click copy button, making it easy to paste directly into your code.',
        category: 'features'
      },
      {
        question: 'Is color data uploaded to servers?',
        answer: 'No. All color conversions are performed locally in your browser with no network requests involved.',
        category: 'privacy'
      }
    ]
  },
  'text-diff': {
    zh: [
      {
        question: '文本对比工具支持哪些功能？',
        answer: '支持逐行对比和逐字对比两种模式，高亮显示新增、删除和修改的内容。可以快速找出两段文本之间的所有差异。',
        category: 'features'
      },
      {
        question: '可以对比代码文件吗？',
        answer: '可以！工具适用于任何文本内容的对比，包括代码、配置文件、文档等。对比结果会清晰地标记出每一处变更。',
        category: 'usage'
      },
      {
        question: '对比的文本长度有限制吗？',
        answer: '工具可以处理大多数常见长度的文本。对于超长文本（超过 100KB），可能会有轻微的性能延迟，但仍然可以正常使用。',
        category: 'limits'
      },
      {
        question: '文本数据会上传到服务器吗？',
        answer: '不会。所有文本对比都在您的浏览器本地完成，您的文本内容不会发送到任何服务器，完全保护隐私。',
        category: 'privacy'
      },
      {
        question: '如何理解对比结果中的颜色标记？',
        answer: '绿色背景表示新增的内容，红色背景表示删除的内容。通过颜色标记可以直观地看出两段文本之间的差异。',
        category: 'results'
      }
    ],
    en: [
      {
        question: 'What features does the Text Diff tool support?',
        answer: 'Supports line-by-line and character-by-character comparison modes, highlighting additions, deletions, and modifications. Quickly find all differences between two texts.',
        category: 'features'
      },
      {
        question: 'Can I compare code files?',
        answer: 'Yes! The tool works for comparing any text content, including code, configuration files, and documents. Results clearly mark every change.',
        category: 'usage'
      },
      {
        question: 'Is there a text length limit?',
        answer: 'The tool handles most common text lengths. For very long texts (over 100KB), there may be slight performance delays, but it still works correctly.',
        category: 'limits'
      },
      {
        question: 'Is my text data uploaded to servers?',
        answer: 'No. All text comparison is done locally in your browser. Your text content is never sent to any server, ensuring complete privacy.',
        category: 'privacy'
      },
      {
        question: 'How do I understand the color coding in results?',
        answer: 'Green background indicates added content, red background indicates deleted content. The color coding provides an intuitive view of differences between two texts.',
        category: 'results'
      }
    ]
  },
  'url-codec': {
    zh: [
      {
        question: 'encodeURIComponent 和 encodeURI 有什么区别？',
        answer: 'encodeURIComponent 会编码所有特殊字符（包括 /、?、#、& 等），适合编码 URL 参数值。encodeURI 会保留 URL 结构字符，适合编码完整的 URL。',
        category: 'encoding'
      },
      {
        question: 'URL 编码是什么？为什么需要 URL 编码？',
        answer: 'URL 编码（也叫百分号编码）是将 URL 中的特殊字符转换为 %XX 格式的过程。因为 URL 只能包含 ASCII 字符，中文、空格等特殊字符必须经过编码才能在 URL 中正确传输。',
        category: 'basics'
      },
      {
        question: '我的数据会上传到服务器吗？',
        answer: '不会。所有编码和解码操作都在您的浏览器本地完成，数据不会发送到任何服务器，完全保护您的隐私。',
        category: 'privacy'
      },
      {
        question: '支持解码中文 URL 吗？',
        answer: '支持！工具可以正确处理包含中文字符的 URL 编码和解码，使用 UTF-8 编码确保中文字符的正确转换。',
        category: 'chinese'
      },
      {
        question: '什么时候应该使用 URL 编码？',
        answer: '在构建 URL 查询参数、处理表单数据、API 请求传参、以及在 URL 中包含特殊字符（如空格、中文、&、= 等）时，都需要进行 URL 编码。',
        category: 'usage'
      }
    ],
    en: [
      {
        question: 'What is the difference between encodeURIComponent and encodeURI?',
        answer: 'encodeURIComponent encodes all special characters (including /, ?, #, & etc.), suitable for encoding URL parameter values. encodeURI preserves URL structure characters, suitable for encoding complete URLs.',
        category: 'encoding'
      },
      {
        question: 'What is URL encoding and why is it needed?',
        answer: 'URL encoding (also called percent-encoding) converts special characters in URLs to %XX format. Since URLs can only contain ASCII characters, special characters like spaces and non-Latin characters must be encoded for correct transmission.',
        category: 'basics'
      },
      {
        question: 'Is my data uploaded to servers?',
        answer: 'No. All encoding and decoding operations are performed locally in your browser. Data is never sent to any server, ensuring complete privacy.',
        category: 'privacy'
      },
      {
        question: 'Can it handle Unicode characters?',
        answer: 'Yes! The tool correctly handles URL encoding and decoding of Unicode characters including Chinese, Japanese, Korean, and emoji, using UTF-8 encoding for accurate conversion.',
        category: 'unicode'
      },
      {
        question: 'When should I use URL encoding?',
        answer: 'URL encoding is needed when building URL query parameters, handling form data, making API requests with special characters, and including spaces, ampersands, equals signs, or non-ASCII characters in URLs.',
        category: 'usage'
      }
    ]
  },
  'markdown-preview': {
    zh: [
      {
        question: 'Markdown 是什么？',
        answer: 'Markdown 是一种轻量级标记语言，用简单的符号来格式化文本。它易于学习和使用，广泛应用于文档、博客、README 文件等。',
        category: 'basics'
      },
      {
        question: '支持哪些 Markdown 语法？',
        answer: '支持标准 Markdown 语法，包括标题、列表、代码块、链接、图片、表格、引用等。同时支持 GFM（GitHub Flavored Markdown）扩展语法。',
        category: 'syntax'
      },
      {
        question: '可以导出为哪些格式？',
        answer: '支持导出为 HTML 文件和 Markdown 文件。导出的 HTML 包含完整的样式，可以直接在浏览器中打开。',
        category: 'export'
      },
      {
        question: '我的内容会被保存吗？',
        answer: '不会。所有处理都在您的浏览器本地完成，内容不会上传到任何服务器，完全保护您的隐私。',
        category: 'privacy'
      },
      {
        question: '支持代码高亮吗？',
        answer: '是的。代码块会根据指定的编程语言进行语法高亮，支持 JavaScript、Python、Java、CSS 等多种语言。',
        category: 'features'
      }
    ],
    en: [
      {
        question: 'What is Markdown?',
        answer: 'Markdown is a lightweight markup language that uses simple symbols to format text. It is easy to learn and widely used for documentation, blogs, README files, and more.',
        category: 'basics'
      },
      {
        question: 'What Markdown syntax is supported?',
        answer: 'Supports standard Markdown syntax including headings, lists, code blocks, links, images, tables, and blockquotes. Also supports GFM (GitHub Flavored Markdown) extended syntax.',
        category: 'syntax'
      },
      {
        question: 'What formats can I export to?',
        answer: 'You can export to HTML and Markdown files. The exported HTML includes complete styling and can be opened directly in a browser.',
        category: 'export'
      },
      {
        question: 'Will my content be saved?',
        answer: 'No. All processing is done locally in your browser. Content is never uploaded to any server, completely protecting your privacy.',
        category: 'privacy'
      },
      {
        question: 'Is code highlighting supported?',
        answer: 'Yes. Code blocks are syntax highlighted based on the specified programming language, supporting JavaScript, Python, Java, CSS, and many others.',
        category: 'features'
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
