<script setup lang="ts">
// SEO 配置
const { t } = useI18n()
const localePath = useLocalePath()
const seoConfig = computed(() => ({
  title: t('imageCompressor.meta.title'),
  description: t('imageCompressor.meta.description'),
  keywords: t('imageCompressor.meta.keywords'),
  ogTitle: t('imageCompressor.meta.title'),
  ogDescription: t('imageCompressor.meta.description'),
  twitterTitle: t('imageCompressor.meta.title'),
  twitterDescription: t('imageCompressor.meta.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

// 结构化数据
const { useStructuredData } = await import('~/composables/useStructuredData')
const { useEnhancedStructuredData } = await import('~/composables/useEnhancedStructuredData')
const {
  getOrganizationSchema,
  getWebsiteSchema,
  getWebPageSchema,
  getSoftwareApplicationSchema,
  setStructuredData
} = useStructuredData()

const {
  getServiceSchema,
  getHowToSchema,
  setEnhancedStructuredData
} = useEnhancedStructuredData()

// 设置图片压缩工具页面结构化数据
const schemas = [
  getOrganizationSchema(),
  getWebsiteSchema(),
  getWebPageSchema({
    name: t('imageCompressor.meta.title'),
    description: t('imageCompressor.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('imageCompressor.title'),
    description: t('imageCompressor.description'),
    category: 'Image Compressor'
  })
]

// 添加服务和操作指南结构化数据
const serviceSchema = getServiceSchema({
  name: t('imageCompressor.meta.title'),
  description: t('imageCompressor.meta.description'),
  rating: { value: '4.8', count: '1250' }
})

const howToSchema = getHowToSchema({
  name: '如何压缩图片',
  description: '使用TryUtils在线图片压缩工具快速减小图片文件大小',
  steps: [
    { name: '选择图片', text: '点击上传区域或拖拽图片文件到页面' },
    { name: '调整设置', text: '选择压缩质量和输出格式' },
    { name: '开始压缩', text: '点击压缩按钮开始处理' },
    { name: '下载结果', text: '压缩完成后下载优化后的图片' }
  ],
  totalTime: 'PT2M',
  tools: ['网页浏览器'],
  supplies: ['图片文件']
})

setStructuredData(schemas)
setEnhancedStructuredData([serviceSchema, howToSchema])
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300" itemscope itemtype="https://schema.org/WebPage">
    <!-- Skip to main content link for accessibility -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      tabindex="0"
    >
      跳转到主要内容
    </a>

    <main id="main-content" role="main">
      <!-- Hero Section -->
      <section class="py-12 px-6" aria-labelledby="hero-title">
        <div class="max-w-4xl mx-auto text-center">
          <div class="fade-in">
            <h1 id="hero-title" class="text-5xl md:text-6xl font-bold text-gradient mb-6" itemprop="headline">
              {{ t('imageCompressor.title') }}
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed" itemprop="description">
              {{ t('imageCompressor.subtitle') }}
            </p>
          </div>
        </div>
      </section>

      <!-- 主要内容 -->
      <section class="pb-12" aria-labelledby="tool-section-title">
        <h2 id="tool-section-title" class="sr-only">图片压缩工具</h2>
        <div class="max-w-4xl mx-auto px-6">
          <div class="slide-up">
            <ImageCompressor />
          </div>
        </div>
      </section>
    </main>

    <!-- 特性介绍 -->
    <section class="py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-colors duration-300" role="region" aria-labelledby="features-title">
      <div class="max-w-6xl mx-auto px-6">
        <h2 id="features-title" class="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          {{ t('home.features.title') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8" role="list" aria-label="产品特性列表">
          <article class="card p-8 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" role="listitem" itemscope itemtype="https://schema.org/Thing">
            <div 
              class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4" 
              aria-hidden="true"
            >
              <svg 
                class="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
                role="img"
              >
                <title>在线处理图标</title>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3" itemprop="name">
              {{ t('home.features.online.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300" itemprop="description">
              {{ t('imageCompressor.instructions.support') }}
            </p>
          </article>

          <article class="card p-8 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" role="listitem" itemscope itemtype="https://schema.org/Thing">
            <div 
              class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4" 
              aria-hidden="true"
            >
              <svg 
                class="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
                role="img"
              >
                <title>隐私保护图标</title>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3" itemprop="name">
              {{ t('home.features.privacy.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300" itemprop="description">
              {{ t('imageCompressor.instructions.privacy') }}
            </p>
          </article>

          <article class="card p-8 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" role="listitem" itemscope itemtype="https://schema.org/Thing">
            <div 
              class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4" 
              aria-hidden="true"
            >
              <svg 
                class="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
                role="img"
              >
                <title>快速处理图标</title>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3" itemprop="name">
              {{ t('home.features.fast.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300" itemprop="description">
              {{ t('imageCompressor.instructions.compression') }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- 相关工具推荐 -->
    <section class="py-12 px-6" role="region" aria-labelledby="related-tools-title">
      <div class="max-w-6xl mx-auto">
        <h2 id="related-tools-title" class="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          {{ t('home.relatedTools.title') }}
        </h2>
        <div class="grid md:grid-cols-2 gap-8" role="list" aria-label="相关工具列表">
          <article class="card p-8 group hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:arrow-path" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100" itemprop="name">
                {{ t('nav.formatConverter') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed" itemprop="description">
              {{ t('home.categories.imageTools.converter.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/image-format-converter')"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`使用 ${t('nav.formatConverter')} 工具`"
            >
              {{ t('common.useNow') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <article class="card p-8 group hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:photo" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100" itemprop="name">
                {{ t('nav.heicConverter') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed" itemprop="description">
              {{ t('home.categories.imageTools.heicConverter.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/heic-converter')"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`使用 ${t('nav.heicConverter')} 工具`"
            >
              {{ t('common.useNow') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- 相关链接 -->
    <div class="max-w-6xl mx-auto px-6 pb-12">
      <RelatedLinks category="tools" />
    </div>
  </div>
</template>