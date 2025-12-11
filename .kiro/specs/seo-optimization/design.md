# Design Document: SEO Optimization

## Overview

本设计文档描述 TryUtils 网站 SEO 优化功能的技术实现方案。主要目标是：
1. 提升博客到工具的转化率（通过内嵌工具组件）
2. 增强搜索结果展示（通过 FAQ 结构化数据）
3. 提升工具页 SEO 竞争力（通过内容增强）
4. 优化内部链接结构
5. 完善多语言 SEO 支持

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                           SEO System                                  │
├──────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │
│  │  Blog Tool      │  │  Schema         │  │  Meta           │       │
│  │  Integration    │  │  Generator      │  │  Optimizer      │       │
│  │  (Lazy Load)    │  │  (FAQ/HowTo/    │  │                 │       │
│  │                 │  │   Breadcrumb)   │  │                 │       │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘       │
│           │                    │                    │                │
│  ┌────────▼────────────────────▼────────────────────▼─────────────┐  │
│  │                    Composables Layer                            │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │  │
│  │  │useBlogTool │ │useFAQSchema│ │useSEOMeta  │ │useBreadcrumb│  │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                  │  │
│  │  │useHowTo    │ │useRelated  │ │useHreflang │                  │  │
│  │  │Schema      │ │Content     │ │            │                  │  │
│  │  └────────────┘ └────────────┘ └────────────┘                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Components Layer                             │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐   │  │
│  │  │BlogTool    │ │FAQSection  │ │Related     │ │Breadcrumb  │   │  │
│  │  │Embed       │ │            │ │Content     │ │Nav         │   │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘   │  │
│  │  ┌────────────┐                                                │  │
│  │  │ToolPage    │                                                │  │
│  │  │Content     │                                                │  │
│  │  └────────────┘                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Data Layer (Frontmatter-based)               │  │
│  │  ┌────────────────────────┐  ┌────────────────────────┐        │  │
│  │  │ Blog Frontmatter       │  │ Tool Config            │        │  │
│  │  │ (relatedTools, embed)  │  │ (keywords, category)   │        │  │
│  │  └────────────────────────┘  └────────────────────────┘        │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. BlogToolEmbed Component (使用 MDC)

利用 Nuxt Content 的 MDC (Markdown Components) 功能，在 Markdown 文章中直接嵌入 Vue 组件。

**MDC 语法示例（在 .md 文件中使用）：**

```markdown
# 现代浏览器图片压缩库对比

在了解了各种压缩库之后，不妨直接体验一下：

::blog-tool-embed{tool="image-compressor" compact}
立即体验图片压缩功能
::

继续阅读下面的详细对比...
```

**组件实现：**

```typescript
// components/content/BlogToolEmbed.vue
interface BlogToolEmbedProps {
  tool: 'image-compressor' | 'heic-converter' | 'format-converter'
  compact?: boolean  // 是否使用紧凑模式（默认 true）
  showCta?: boolean  // 是否显示 CTA（默认 true）
}

// 组件结构
<template>
  <div class="blog-tool-embed my-8 rounded-xl border-2 border-blue-200 dark:border-blue-800 overflow-hidden">
    <div class="tool-header bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Icon :name="toolIcon" class="text-2xl text-blue-600" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ toolTitle }}</h3>
      </div>
      <span class="px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
        🎯 在线体验
      </span>
    </div>
    <div class="tool-container p-6">
      <component :is="toolComponent" :compact="compact" />
    </div>
    <div v-if="showCta" class="tool-cta bg-gray-50 dark:bg-gray-800/50 px-6 py-4 text-center">
      <NuxtLink 
        :to="localePath(toolPagePath)"
        class="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
      >
        <slot>查看完整功能</slot>
        <Icon name="heroicons:arrow-right" />
      </NuxtLink>
    </div>
  </div>
</template>
```

**注意：** 组件必须放在 `components/content/` 目录下才能被 MDC 识别。

**性能优化：懒加载策略**

为避免重型工具组件影响博客页面 LCP，采用懒加载 + 占位符策略：

```typescript
// components/content/BlogToolEmbed.vue
<template>
  <div class="blog-tool-embed ...">
    <!-- 骨架屏占位符 -->
    <div v-if="!isVisible && !isLoaded" class="tool-placeholder">
      <div class="animate-pulse bg-gray-200 dark:bg-gray-700 h-48 rounded-lg flex items-center justify-center">
        <span class="text-gray-500">{{ $t('seo.clickToLoad') }}</span>
      </div>
      <button @click="loadTool" class="mt-4 btn-primary">
        {{ $t('seo.tryOnline') }}
      </button>
    </div>
    
    <!-- 实际工具组件（懒加载） -->
    <Suspense v-else>
      <template #default>
        <component :is="toolComponent" :compact="compact" />
      </template>
      <template #fallback>
        <div class="animate-pulse bg-gray-200 h-48 rounded-lg" />
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
const isVisible = ref(false)
const isLoaded = ref(false)

// 使用 Intersection Observer 检测可见性
const { stop } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      isVisible.value = true
      stop()
    }
  },
  { threshold: 0.1 }
)

// 或者用户主动点击加载
const loadTool = () => {
  isLoaded.value = true
}

// 动态导入重型组件
const toolComponent = computed(() => {
  if (!isVisible.value && !isLoaded.value) return null
  return defineAsyncComponent(() => {
    switch (props.tool) {
      case 'image-compressor': return import('~/components/ImageCompressor.vue')
      case 'heic-converter': return import('~/components/HeicConverter.vue')
      case 'format-converter': return import('~/components/ImageFormatConverter.vue')
    }
  })
})
</script>
```

### 2. BreadcrumbNav Component

面包屑导航组件，提升搜索结果中的 URL 展示效果。

```typescript
// components/BreadcrumbNav.vue
interface BreadcrumbItem {
  name: string
  path: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  generateSchema?: boolean  // 是否生成结构化数据（默认 true）
}

// 结构化数据输出格式
interface BreadcrumbListSchema {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}
```

**组件实现：**

```vue
<template>
  <nav aria-label="Breadcrumb" class="text-sm text-gray-500 dark:text-gray-400 mb-4">
    <ol class="flex items-center space-x-2">
      <li v-for="(item, index) in items" :key="item.path" class="flex items-center">
        <NuxtLink 
          v-if="index < items.length - 1"
          :to="localePath(item.path)"
          class="hover:text-blue-600 dark:hover:text-blue-400"
        >
          {{ item.name }}
        </NuxtLink>
        <span v-else class="text-gray-900 dark:text-gray-100 font-medium">
          {{ item.name }}
        </span>
        <Icon v-if="index < items.length - 1" name="heroicons:chevron-right" class="mx-2 w-4 h-4" />
      </li>
    </ol>
  </nav>
</template>
```

**搜索结果展示效果：**
- 无面包屑: `tryutils.com > blog > heic...`
- 有面包屑: `TryUtils > Blog > Image Tools > HEIC Converter`

### 3. FAQSection Component (增强版)

增强现有 FAQ 组件，添加结构化数据支持。

```typescript
// components/FAQSection.vue
interface FAQItem {
  question: string
  answer: string
  category?: string
}

interface FAQSectionProps {
  items: FAQItem[]
  category?: string
  generateSchema?: boolean  // 是否生成结构化数据
}

// 结构化数据输出格式
interface FAQPageSchema {
  '@context': 'https://schema.org'
  '@type': 'FAQPage'
  mainEntity: Array<{
    '@type': 'Question'
    name: string
    acceptedAnswer: {
      '@type': 'Answer'
      text: string
    }
  }>
}
```

### 4. RelatedContent Component

显示相关工具或文章的组件。

```typescript
// components/RelatedContent.vue
interface RelatedContentProps {
  type: 'tools' | 'articles'
  currentPath: string
  category?: string
  limit?: number
}

interface RelatedItem {
  title: string
  description: string
  path: string
  icon?: string
  keywords?: string[]
}
```

### 5. ToolPageContent Component

工具页内容增强组件，包含使用步骤、对比表格等。

```typescript
// components/ToolPageContent.vue
interface ToolPageContentProps {
  toolName: string
  steps: HowToStep[]
  comparisons: ComparisonItem[]
  stats: UsageStats
}

interface HowToStep {
  name: string
  text: string
  image?: string
}

interface ComparisonItem {
  feature: string
  ourTool: string | boolean
  competitor1: string | boolean
  competitor2: string | boolean
}

interface UsageStats {
  totalUsers: string
  filesProcessed: string
  avgRating: string
}
```

## Data Models

### Tool-Blog Mapping (基于 Frontmatter)

利用 Nuxt Content 的 Frontmatter 功能，在 Markdown 文件中直接定义关联关系，避免硬编码维护问题。

**博客文章 Frontmatter 示例：**

```yaml
# content/blog/ImageCompression/browser-image-compression-libraries.md
---
title: 现代浏览器图片压缩库对比
description: 深入对比 browser-image-compression、Compressor.js 等主流库
date: 2024-01-15
category: ImageCompression
relatedTools:
  - image-compressor
  - image-format-converter
embedTool: image-compressor  # 文章中嵌入的工具
keywords:
  - 图片压缩
  - browser-image-compression
  - JavaScript
---
```

**工具页数据配置：**

```typescript
// data/toolConfig.ts
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
    name: { zh: '图片压缩', en: 'Image Compressor' },
    description: { zh: '在线压缩图片，减小文件大小', en: 'Compress images online' },
    icon: 'heroicons:photo',
    path: '/image-compressor',
    category: 'ImageCompression',
    keywords: ['compress', 'optimize', '压缩', '优化']
  },
  // ...
]
```

**动态查询相关内容：**

```typescript
// composables/useRelatedContent.ts
export async function useRelatedContent(toolId: string) {
  // 查询所有关联此工具的博客文章
  const { data: articles } = await useAsyncData(
    `related-articles-${toolId}`,
    () => queryContent('blog')
      .where({ relatedTools: { $contains: toolId } })
      .only(['title', 'description', '_path', 'date'])
      .sort({ date: -1 })
      .limit(5)
      .find()
  )
  return { articles }
}
```

**优势：**
- 文章作者可直接在 Frontmatter 中维护关联关系
- 无需修改代码即可添加新的关联
- 支持双向查询（工具→文章，文章→工具）
```

### FAQ Data Structure

```typescript
// data/faqData.ts
export const toolFAQs: Record<string, FAQItem[]> = {
  'image-compressor': [
    {
      question: '图片压缩会损失画质吗？',
      answer: '我们的智能压缩算法会在文件大小和画质之间取得最佳平衡。您可以通过质量滑块自定义压缩程度。'
    },
    {
      question: '支持哪些图片格式？',
      answer: '支持 JPEG、PNG、WebP、GIF 等常见格式，最大支持 100MB 的图片文件。'
    },
    {
      question: '图片会上传到服务器吗？',
      answer: '不会。所有处理都在您的浏览器本地完成，图片不会上传到任何服务器，完全保护您的隐私。'
    }
  ],
  'heic-converter': [
    {
      question: '什么是 HEIC 格式？',
      answer: 'HEIC 是苹果设备使用的高效图片格式，相比 JPEG 可以在相同画质下减少约 50% 的文件大小。'
    },
    {
      question: '为什么需要转换 HEIC？',
      answer: 'HEIC 格式在 Windows 和部分网站上兼容性较差，转换为 JPEG 或 PNG 可以确保在所有设备上正常查看。'
    }
  ]
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, the following properties have been identified:

### Property 1: Blog tool component rendering
*For any* blog article with a tool reference in its metadata, the system should render the corresponding tool component matching the specified tool type.
**Validates: Requirements 1.1**

### Property 2: Embedded tool functionality equivalence
*For any* tool component rendered in embedded mode, the component should expose the same public methods and produce the same output as the standalone version given identical inputs.
**Validates: Requirements 1.3**

### Property 3: FAQ structured data format
*For any* array of FAQ items, the generated JSON-LD should be valid FAQPage schema with mainEntity array containing Question objects with acceptedAnswer properties.
**Validates: Requirements 2.1, 2.2**

### Property 4: FAQ ARIA attributes
*For any* rendered FAQ item, the component should include proper ARIA attributes (aria-expanded, aria-controls) for accessibility.
**Validates: Requirements 2.3**

### Property 5: HowTo structured data format
*For any* tool page with usage steps, the generated JSON-LD should be valid HowTo schema with step array containing HowToStep objects.
**Validates: Requirements 3.2**

### Property 6: Related content anchor text
*For any* related content link, the anchor text should contain at least one keyword from the target page's keyword list.
**Validates: Requirements 4.3**

### Property 7: Title length constraint
*For any* page, the generated title should be under 60 characters in length.
**Validates: Requirements 5.1**

### Property 8: Meta description length constraint
*For any* page, the generated meta description should be under 160 characters in length.
**Validates: Requirements 5.2**

### Property 9: Blog article date in description
*For any* blog article, the meta description should contain a date string in recognizable format.
**Validates: Requirements 5.3**

### Property 10: Tool page action words
*For any* tool page, the title should contain at least one action word from the predefined list (Free, Online, 免费, 在线, etc.).
**Validates: Requirements 5.4**

### Property 11: Hreflang tags completeness
*For any* page, the rendered HTML should include hreflang link tags for all configured locales (zh, en).
**Validates: Requirements 6.1**

### Property 12: HTML lang attribute correctness
*For any* page render, the html lang attribute should match the current locale value.
**Validates: Requirements 6.2**

### Property 13: Canonical URL language consistency
*For any* language switch action, the canonical URL should update to reflect the new language path.
**Validates: Requirements 6.4**

### Property 14: Image lazy loading
*For any* image element below the fold, the loading attribute should be set to "lazy".
**Validates: Requirements 7.2**

### Property 15: Preload hints presence
*For any* page with critical resources, the head should contain preload link tags for those resources.
**Validates: Requirements 7.4**

### Property 16: BreadcrumbList structured data format
*For any* page with breadcrumb navigation, the generated JSON-LD should be valid BreadcrumbList schema with itemListElement array containing ListItem objects with position, name, and item properties.
**Validates: Requirements 3.2 (enhanced navigation)**

### Property 17: Lazy loading placeholder presence
*For any* embedded tool component before user interaction, the component should render a placeholder with loading trigger (intersection observer or click handler).
**Validates: Requirements 7.1, 7.2 (LCP optimization)**

## Error Handling

### Component Loading Errors
- 如果工具组件加载失败，显示降级的静态内容和工具页链接
- 使用 `<Suspense>` 和 `<ErrorBoundary>` 处理异步组件错误

### Schema Generation Errors
- 如果结构化数据生成失败，记录错误但不影响页面渲染
- 提供默认的 fallback schema

### Data Fetching Errors
- 相关内容获取失败时显示空状态或缓存数据
- 使用 `useAsyncData` 的 error 处理机制

## Testing Strategy

### Unit Testing
- 使用 Vitest 测试各个 composable 函数
- 测试结构化数据生成的正确性
- 测试 meta 标签生成逻辑

### Property-Based Testing
- 使用 fast-check 库进行属性测试
- 测试标题/描述长度约束
- 测试结构化数据格式正确性
- 测试 hreflang 标签完整性

### Integration Testing
- 测试博客页面工具组件渲染
- 测试工具页面相关文章显示
- 测试语言切换后的 SEO 标签更新

### E2E Testing (Manual)
- 使用 Google Rich Results Test 验证结构化数据
- 使用 Lighthouse 验证 SEO 分数
- 使用 GSC 监控搜索表现变化

### Test File Organization

```
tests/
├── unit/
│   ├── composables/
│   │   ├── useFAQSchema.test.ts
│   │   ├── useSEOMeta.test.ts
│   │   └── useRelatedContent.test.ts
│   └── utils/
│       └── seoHelpers.test.ts
├── property/
│   ├── faqSchema.property.test.ts
│   ├── metaTags.property.test.ts
│   └── hreflang.property.test.ts
└── integration/
    ├── blogToolEmbed.test.ts
    └── toolPageContent.test.ts
```

## Implementation Notes

### MDC Component Registration

为了让 BlogToolEmbed 组件在 Markdown 中可用，需要：

1. 将组件放在 `components/content/` 目录下
2. 组件名使用 PascalCase，在 Markdown 中使用 kebab-case 调用
3. Props 通过 `{prop="value"}` 语法传递

### Structured Data Injection

**方案选择：使用 nuxt-schema-org**

项目已安装 `@nuxtjs/seo` 套件（包含 nuxt-schema-org），推荐使用其提供的类型安全 API：

```typescript
// composables/useFAQSchema.ts
import { defineWebPage, useSeoMeta } from '#imports'

export function useFAQSchema(items: FAQItem[]) {
  // 使用 nuxt-schema-org 的 defineWebPage
  useSchemaOrg([
    defineWebPage({
      '@type': 'FAQPage'
    }),
    ...items.map(item => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer
      }
    }))
  ])
}

// HowTo Schema
export function useHowToSchema(name: string, steps: HowToStep[]) {
  useSchemaOrg([
    {
      '@type': 'HowTo',
      name,
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        ...(step.image && { image: step.image })
      }))
    }
  ])
}

// Breadcrumb Schema
export function useBreadcrumbSchema(items: BreadcrumbItem[]) {
  useSchemaOrg([
    {
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.path
      }))
    }
  ])
}
```

**优势：**
- 类型安全，避免 JSON 格式错误
- 自动处理字符转义，防止 XSS 风险
- 与 Nuxt SEO 生态集成，自动合并多个 Schema
- 无需手动 `JSON.stringify`

**备选方案（如不使用 nuxt-schema-org）：**

```typescript
// 使用 useHead 的对象格式（更安全）
useHead({
  script: [
    {
      type: 'application/ld+json',
      // 使用 key 确保唯一性，避免重复注入
      key: 'faq-schema',
      // Nuxt 会自动处理序列化
      innerHTML: schema.value
    }
  ]
})
```
```

### i18n Integration

所有 SEO 相关文本需要支持多语言：

```typescript
// i18n/locales/zh.json 新增
{
  "seo": {
    "tryOnline": "在线体验",
    "viewFullFeatures": "查看完整功能",
    "relatedTools": "相关工具",
    "relatedArticles": "相关文章",
    "faq": "常见问题"
  }
}
```

## Dependencies

**已安装（项目现有）：**
- `@nuxt/content` - MDC 组件支持
- `@nuxtjs/i18n` - 多语言支持
- `@nuxtjs/seo` - SEO 套件（包含 nuxt-schema-org, nuxt-sitemap, nuxt-robots）
- `@vueuse/nuxt` - useIntersectionObserver 等工具函数（懒加载）

**测试依赖：**
- `fast-check` - 属性测试库
- `vitest` - 单元测试框架（已安装）
