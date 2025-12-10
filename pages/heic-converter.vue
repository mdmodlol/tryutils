<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300" itemscope itemtype="https://schema.org/WebPage">
    <!-- Skip to main content link for accessibility -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      tabindex="0"
    >
      {{ t('common.accessibility.skipToMain') }}
    </a>

    <!-- SEO Head -->
    <Head>
      <Title>{{ t('heicConverter.meta.title') }}</Title>
      <Meta name="description" :content="t('heicConverter.meta.description')" />
      <Meta name="keywords" :content="t('heicConverter.meta.keywords')" />
    </Head>

    <main id="main-content" role="main">
      <!-- Hero Section -->
      <section class="py-12 px-6" aria-labelledby="hero-title">
        <div class="max-w-4xl mx-auto text-center">
          <div class="fade-in">
            <h1 id="hero-title" class="text-5xl md:text-6xl font-bold text-gradient mb-6" itemprop="headline">
              {{ t('heicConverter.hero.title') }}
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed" itemprop="description">
              {{ t('heicConverter.hero.subtitle') }}
            </p>
            <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400" role="list" :aria-label="t('heicConverter.features.ariaLabel')">
              <div class="flex items-center gap-2" role="listitem">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500" aria-hidden="true" />
                <span>{{ t('heicConverter.features.free') }}</span>
              </div>
              <div class="flex items-center gap-2" role="listitem">
                <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-500" aria-hidden="true" />
                <span>{{ t('heicConverter.features.privacy') }}</span>
              </div>
              <div class="flex items-center gap-2" role="listitem">
                <Icon name="heroicons:bolt" class="w-5 h-5 text-green-500" aria-hidden="true" />
                <span>{{ t('heicConverter.features.fast') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 主要工具区域 -->
      <section class="pb-12" aria-labelledby="tool-section-title">
        <h2 id="tool-section-title" class="sr-only">{{ t('heicConverter.sections.toolTitle') }}</h2>
        <div class="max-w-4xl mx-auto px-6">
          <div class="slide-up">
            <HeicConverter />
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
        <div class="grid md:grid-cols-3 gap-8" role="list" :aria-label="t('heicConverter.features.listAriaLabel')">
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
                <title>{{ t('heicConverter.features.icons.heicConversion') }}</title>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3" itemprop="name">
              {{ t('home.features.online.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300" itemprop="description">
              {{ t('heicConverter.features.onlineDescription') }}
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
                <title>{{ t('heicConverter.features.icons.privacy') }}</title>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3" itemprop="name">
              {{ t('home.features.privacy.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300" itemprop="description">
              {{ t('home.features.privacy.description') }}
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
                <title>{{ t('heicConverter.features.icons.fast') }}</title>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3" itemprop="name">
              {{ t('home.features.fast.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300" itemprop="description">
              {{ t('home.features.fast.description') }}
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
        <div class="grid md:grid-cols-2 gap-8" role="list" :aria-label="t('heicConverter.sections.relatedToolsAriaLabel')">
          <article class="card p-8 group hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:photo" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100" itemprop="name">
                {{ t('nav.imageCompressor') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed" itemprop="description">
              {{ t('home.categories.imageTools.compressor.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/image-compressor')"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`${t('common.useNow')} ${t('nav.imageCompressor')} ${t('common.startUsing')}`"
            >
              {{ t('common.useNow') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

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
              :aria-label="`${t('common.useNow')} ${t('nav.formatConverter')} ${t('common.startUsing')}`"
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

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// SEO
useHead({
    title: computed(() => t('heicConverter.meta.title')),
    meta: [
      {
        name: 'description',
        content: computed(() => t('heicConverter.meta.description'))
      },
      {
        name: 'keywords',
        content: computed(() => t('heicConverter.meta.keywords'))
      }
    ]
  })

// 结构化数据
const { useStructuredData } = await import('~/composables/useStructuredData')
const { useEnhancedStructuredData } = await import('~/composables/useEnhancedStructuredData')
const {
  getOrganizationSchema,
  getWebPageSchema,
  getSoftwareApplicationSchema,
  setStructuredData
} = useStructuredData()

const {
  getServiceSchema,
  getHowToSchema,
  setEnhancedStructuredData
} = useEnhancedStructuredData()

// 设置HEIC转换工具结构化数据
const schemas = [
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('heicConverter.seo.title'),
    description: t('heicConverter.seo.description')
  }),
  getSoftwareApplicationSchema({
    name: t('heicConverter.seo.title'),
    description: t('heicConverter.seo.description'),
    category: 'Multimedia'
  })
]

// 添加服务和操作指南结构化数据
const serviceSchema = getServiceSchema({
  name: t('heicConverter.seo.title'),
  description: t('heicConverter.seo.description'),
  rating: { value: '4.9', count: '1580' }
})

const howToSchema = getHowToSchema({
  name: '如何转换HEIC格式',
  description: '使用TryUtils在线HEIC转换工具将苹果HEIC格式转换为通用格式',
  steps: [
    { name: '上传HEIC文件', text: '选择iPhone或iPad拍摄的HEIC格式图片' },
    { name: '选择输出格式', text: '选择JPEG、PNG或WebP作为输出格式' },
    { name: '开始转换', text: '点击转换按钮开始处理HEIC文件' },
    { name: '下载转换结果', text: '转换完成后下载兼容性更好的图片格式' }
  ],
  totalTime: 'PT1M30S',
  tools: ['网页浏览器'],
  supplies: ['HEIC格式图片文件']
})

setStructuredData(schemas)
setEnhancedStructuredData([serviceSchema, howToSchema])
</script>