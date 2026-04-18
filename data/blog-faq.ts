import type { FAQItem } from '~/composables/useFAQSchema'

export const BLOG_FAQ_CATEGORIES = [
  'imagecompression',
  'heicconverter',
] as const

export type BlogFaqCategory = typeof BLOG_FAQ_CATEGORIES[number]

type LocalizedFaqItem = {
  question: {
    zh: string
    en: string
  }
  answer: {
    zh: string
    en: string
  }
}

const blogFaqPools: Record<BlogFaqCategory, LocalizedFaqItem[]> = {
  imagecompression: [
    {
      question: {
        zh: '图片压缩一定会明显掉画质吗？',
        en: 'Does image compression always cause visible quality loss?',
      },
      answer: {
        zh: '不一定。大多数网页和博客场景里，合理压缩后的图片在肉眼上仍然足够清晰，关键是根据用途选择格式、尺寸和压缩强度。',
        en: 'Not necessarily. For most web and blog use cases, a properly compressed image still looks clear to the human eye. The real key is choosing the right format, dimensions, and compression strength for the job.',
      },
    },
    {
      question: {
        zh: 'JPG、PNG 和 WebP 该怎么选？',
        en: 'How should I choose between JPG, PNG, and WebP?',
      },
      answer: {
        zh: '照片通常更适合 JPG 或 WebP，透明背景图更适合 PNG 或支持透明的 WebP。追求网页体积时，WebP 往往是优先选项。',
        en: 'Photos usually work best as JPG or WebP, while transparent graphics are better as PNG or transparency-capable WebP. If page weight matters, WebP is often the best starting point.',
      },
    },
    {
      question: {
        zh: '在浏览器里压缩图片安全吗？',
        en: 'Is browser-based image compression safe?',
      },
      answer: {
        zh: '如果工具采用浏览器本地处理，图片不会默认上传到远端服务器，这对隐私和敏感图片场景更友好。',
        en: 'If the tool processes files locally in the browser, your images do not need to be uploaded by default. That is usually better for privacy-sensitive workflows.',
      },
    },
    {
      question: {
        zh: '怎么把图片压到更接近目标大小？',
        en: 'How can I compress an image closer to a target file size?',
      },
      answer: {
        zh: '通常要同时调整质量、尺寸和输出格式。单独降低质量不一定最稳，缩小尺寸或换成更高效的格式往往更有效。',
        en: 'You usually need to adjust quality, dimensions, and output format together. Lowering quality alone is not always the best approach; resizing or switching to a more efficient format is often more effective.',
      },
    },
    {
      question: {
        zh: '为什么大图通常更容易压出明显效果？',
        en: 'Why do larger images often compress more effectively?',
      },
      answer: {
        zh: '大图包含更多重复信息和可优化空间，尤其是网页实际展示尺寸远小于原图时，缩放和压缩叠加后通常能节省更多体积。',
        en: 'Large images often contain more repeated information and more room for optimization. When the display size is much smaller than the original, resizing plus compression can save much more data.',
      },
    },
  ],
  heicconverter: [
    {
      question: {
        zh: '为什么 iPhone 会默认拍成 HEIC？',
        en: 'Why do iPhones save photos as HEIC by default?',
      },
      answer: {
        zh: '因为 HEIC 往往能在保持较高画质的同时减少文件体积，适合手机存储和拍摄场景。',
        en: 'Because HEIC often keeps higher visual quality at a smaller file size, which is useful for mobile storage and day-to-day shooting.',
      },
    },
    {
      question: {
        zh: '把 HEIC 转成 JPG 会不会出问题？',
        en: 'Will converting HEIC to JPG cause problems?',
      },
      answer: {
        zh: '通常不会影响日常使用，但转成 JPG 后会失去 HEIC 的一部分压缩效率，也可能丢失某些高级特性或元数据表现形式。',
        en: 'Usually not for everyday use, but JPG loses some of HEIC’s compression efficiency and may not preserve every advanced feature or metadata representation in the same way.',
      },
    },
    {
      question: {
        zh: 'HEIC 转换支持批量处理吗？',
        en: 'Does HEIC conversion support batch processing?',
      },
      answer: {
        zh: '支持批量处理通常是 HEIC 工具的重要能力，特别适合导出一整批 iPhone 照片到网页、邮件或社交媒体场景。',
        en: 'Batch conversion is one of the most important HEIC workflow features, especially when exporting many iPhone photos for websites, email, or social sharing.',
      },
    },
    {
      question: {
        zh: '转换后能保留元数据吗？',
        en: 'Can metadata be preserved after conversion?',
      },
      answer: {
        zh: '这取决于具体工具和输出格式。有些转换流程会保留时间和基础信息，有些则更偏向生成兼容性更高的精简文件。',
        en: 'It depends on the tool and output format. Some workflows preserve timing and basic metadata, while others prioritize leaner, more compatible output files.',
      },
    },
    {
      question: {
        zh: 'HEIC、JPG、PNG 分别适合什么场景？',
        en: 'When should I use HEIC, JPG, or PNG?',
      },
      answer: {
        zh: 'HEIC 适合移动端原始拍摄存储，JPG 更适合分享与兼容，PNG 更适合透明背景和图形元素。',
        en: 'HEIC is great for original mobile photo storage, JPG is better for sharing and compatibility, and PNG is better for transparency and graphic-style assets.',
      },
    },
  ],
}

export function isBlogFaqCategory(value: unknown): value is BlogFaqCategory {
  return typeof value === 'string' && BLOG_FAQ_CATEGORIES.includes(value as BlogFaqCategory)
}

export function getBlogFaqItems(
  category: BlogFaqCategory,
  locale: 'zh' | 'en'
): FAQItem[] {
  return blogFaqPools[category].map((item) => ({
    question: item.question[locale],
    answer: item.answer[locale],
    category,
  }))
}

export function normalizeCustomFaqItems(items: unknown): FAQItem[] {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .filter((item): item is FAQItem => {
      return !!item
        && typeof item === 'object'
        && typeof item.question === 'string'
        && typeof item.answer === 'string'
    })
    .map((item) => ({
      question: item.question,
      answer: item.answer,
      category: item.category,
    }))
}

export function mergeBlogFaqItems(
  defaultItems: FAQItem[],
  customItems: FAQItem[],
): FAQItem[] {
  const merged = [...customItems, ...defaultItems]
  const seenQuestions = new Set<string>()

  return merged.filter((item) => {
    const key = item.question.trim().toLowerCase()

    if (!key || seenQuestions.has(key)) {
      return false
    }

    seenQuestions.add(key)
    return true
  })
}
