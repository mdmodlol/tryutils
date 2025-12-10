<script setup lang="ts">
// SEO 配置
const { t } = useI18n()
const localePath = useLocalePath()
const seoConfig = computed(() => ({
  title: t('imageFormatConverter.meta.title'),
  description: t('imageFormatConverter.meta.description'),
  keywords: t('imageFormatConverter.meta.keywords'),
  ogTitle: t('imageFormatConverter.meta.title'),
  ogDescription: t('imageFormatConverter.meta.description'),
  twitterTitle: t('imageFormatConverter.meta.title'),
  twitterDescription: t('imageFormatConverter.meta.description'),
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

// 设置图片格式转换工具页面结构化数据
const schemas = [
  getOrganizationSchema(),
  getWebsiteSchema(),
  getWebPageSchema({
    name: t('imageFormatConverter.meta.title'),
    description: t('imageFormatConverter.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('imageFormatConverter.title'),
    description: t('imageFormatConverter.description'),
    category: 'Image Format Converter'
  })
]

// 添加服务和操作指南结构化数据
const serviceSchema = getServiceSchema({
  name: t('imageFormatConverter.meta.title'),
  description: t('imageFormatConverter.meta.description'),
  rating: { value: '4.7', count: '980' }
})

const howToSchema = getHowToSchema({
  name: '如何转换图片格式',
  description: '使用TryUtils在线图片格式转换工具轻松转换图片格式',
  steps: [
    { name: '上传图片', text: '选择需要转换格式的图片文件' },
    { name: '选择格式', text: '从下拉菜单中选择目标输出格式' },
    { name: '开始转换', text: '点击转换按钮开始格式转换' },
    { name: '下载文件', text: '转换完成后下载新格式的图片' }
  ],
  totalTime: 'PT1M',
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
          <h1 id="hero-title" class="text-4xl md:text-5xl font-bold mb-6" itemprop="name">
            <span class="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
              {{ $t('imageFormatConverter.hero.title') }}
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed" itemprop="description">
            {{ $t('imageFormatConverter.hero.subtitle') }}
          </p>
          <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400" role="list" aria-label="产品特性">
            <div class="flex items-center gap-2" role="listitem">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>{{ $t('imageFormatConverter.hero.feature1') }}</span>
            </div>
            <div class="flex items-center gap-2" role="listitem">
              <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>{{ $t('imageFormatConverter.hero.feature2') }}</span>
            </div>
            <div class="flex items-center gap-2" role="listitem">
              <Icon name="heroicons:bolt" class="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>{{ $t('imageFormatConverter.hero.feature3') }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 主要工具区域 -->
      <section class="pb-12 px-6" aria-labelledby="tool-section-title">
        <h2 id="tool-section-title" class="sr-only">图片格式转换工具</h2>
        <ImageFormatConverter />
      </section>

      <!-- 功能介绍 -->
      <section class="py-12 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300" role="region" aria-labelledby="features-title">
        <div class="max-w-6xl mx-auto">
          <h2 id="features-title" class="text-3xl font-bold text-center mb-12">
            <span class="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {{ $t('imageFormatConverter.features.title') }}
            </span>
          </h2>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="功能特性列表">
            <!-- 多格式支持 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 group-hover:from-purple-200 group-hover:to-pink-200 dark:group-hover:from-purple-800/50 dark:group-hover:to-pink-800/50" aria-hidden="true">
                <Icon name="heroicons:photo" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ $t('imageFormatConverter.features.multiFormat.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.multiFormat.description') }}</p>
            </article>

            <!-- 高质量转换 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 group-hover:from-green-200 group-hover:to-emerald-200 dark:group-hover:from-green-800/50 dark:group-hover:to-emerald-800/50" aria-hidden="true">
                <Icon name="heroicons:sparkles" class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ $t('imageFormatConverter.features.highQuality.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.highQuality.description') }}</p>
            </article>

            <!-- 批量处理 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-indigo-800/50" aria-hidden="true">
                <Icon name="heroicons:queue-list" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ $t('imageFormatConverter.features.batchProcessing.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.batchProcessing.description') }}</p>
            </article>

            <!-- 隐私保护 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 group-hover:from-orange-200 group-hover:to-red-200 dark:group-hover:from-orange-800/50 dark:group-hover:to-red-800/50" aria-hidden="true">
                <Icon name="heroicons:shield-check" class="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ $t('imageFormatConverter.features.privacy.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.privacy.description') }}</p>
            </article>

            <!-- 快速处理 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 group-hover:from-teal-200 group-hover:to-cyan-200 dark:group-hover:from-teal-800/50 dark:group-hover:to-cyan-800/50" aria-hidden="true">
                <Icon name="heroicons:bolt" class="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ $t('imageFormatConverter.features.fastProcessing.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.fastProcessing.description') }}</p>
            </article>

            <!-- 免费使用 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 group-hover:from-pink-200 group-hover:to-rose-200 dark:group-hover:from-pink-800/50 dark:group-hover:to-rose-800/50" aria-hidden="true">
                <Icon name="heroicons:heart" class="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ $t('imageFormatConverter.features.free.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.free.description') }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- 使用指南 -->
      <section class="py-12 px-6" role="region" aria-labelledby="guide-title">
        <div class="max-w-4xl mx-auto">
          <h2 id="guide-title" class="text-3xl font-bold text-center mb-8">
            <span class="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {{ $t('imageFormatConverter.guide.title') }}
            </span>
          </h2>
          
          <ol class="space-y-8" role="list" aria-label="使用步骤">
            <!-- 步骤1 -->
            <li class="guide-step" role="listitem">
              <div class="guide-step-number" aria-hidden="true">1</div>
              <div class="guide-step-content">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{{ $t('imageFormatConverter.guide.step1.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ $t('imageFormatConverter.guide.step1.description') }}</p>
              </div>
            </li>

            <!-- 步骤2 -->
            <li class="guide-step" role="listitem">
              <div class="guide-step-number" aria-hidden="true">2</div>
              <div class="guide-step-content">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{{ $t('imageFormatConverter.guide.step2.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ $t('imageFormatConverter.guide.step2.description') }}</p>
              </div>
            </li>

            <!-- 步骤3 -->
            <li class="guide-step" role="listitem">
              <div class="guide-step-number" aria-hidden="true">3</div>
              <div class="guide-step-content">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{{ $t('imageFormatConverter.guide.step3.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ $t('imageFormatConverter.guide.step3.description') }}</p>
              </div>
            </li>

            <!-- 步骤4 -->
            <li class="guide-step" role="listitem">
              <div class="guide-step-number" aria-hidden="true">4</div>
              <div class="guide-step-content">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{{ $t('imageFormatConverter.guide.step4.title') }}</h3>
                <p class="text-gray-600 dark:text-gray-300">{{ $t('imageFormatConverter.guide.step4.description') }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- FAQ 部分 -->
      <section class="py-12 px-6 bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300" role="region" aria-labelledby="faq-title">
        <div class="max-w-4xl mx-auto">
          <h2 id="faq-title" class="text-3xl font-bold text-center mb-8">
            <span class="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {{ $t('imageFormatConverter.faq.title') }}
            </span>
          </h2>
            
          <div class="space-y-6" role="list" aria-label="常见问题列表">
            <!-- FAQ 项目 -->
            <details class="faq-item group" role="listitem">
              <summary class="faq-question" role="button" aria-expanded="false">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <span class="text-gray-900 dark:text-gray-100">{{ $t('imageFormatConverter.faq.q1.question') }}</span>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div class="faq-answer">
                <p>{{ $t('imageFormatConverter.faq.q1.answer') }}</p>
              </div>
            </details>

            <details class="faq-item group" role="listitem">
              <summary class="faq-question" role="button" aria-expanded="false">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <span class="text-gray-900 dark:text-gray-100">{{ $t('imageFormatConverter.faq.q2.question') }}</span>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div class="faq-answer">
                <p>{{ $t('imageFormatConverter.faq.q2.answer') }}</p>
              </div>
            </details>

            <details class="faq-item group" role="listitem">
              <summary class="faq-question" role="button" aria-expanded="false">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <span class="text-gray-900 dark:text-gray-100">{{ $t('imageFormatConverter.faq.q3.question') }}</span>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div class="faq-answer">
                <p>{{ $t('imageFormatConverter.faq.q3.answer') }}</p>
              </div>
            </details>

            <details class="faq-item group" role="listitem">
              <summary class="faq-question" role="button" aria-expanded="false">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                <span class="text-gray-900 dark:text-gray-100">{{ $t('imageFormatConverter.faq.q4.question') }}</span>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 dark:text-gray-500 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div class="faq-answer">
                <p>{{ $t('imageFormatConverter.faq.q4.answer') }}</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <!-- 相关工具推荐 -->
      <section class="py-12 px-6" role="region" aria-labelledby="related-tools-title">
        <div class="max-w-6xl mx-auto">
          <h2 id="related-tools-title" class="text-3xl font-bold text-center mb-12">
            <span class="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {{ t('home.relatedTools.title') }}
            </span>
          </h2>
          <div class="grid md:grid-cols-2 gap-8" role="list" aria-label="相关工具列表">
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
                :aria-label="`使用 ${t('nav.imageCompressor')} 工具`"
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
                  {{ t('nav.heicConverter') }}
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed" itemprop="description">
                {{ t('home.categories.imageTools.heicConverter.description') }}
              </p>
              <NuxtLink 
                :to="localePath('/heic-converter')"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                :aria-label="`使用 ${t('nav.heicConverter')} 工具`"
              >
                {{ t('common.useNow') }}
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>
    </main>

    <!-- 相关链接 -->
    <div class="max-w-6xl mx-auto px-6 pb-12">
      <RelatedLinks category="tools" />
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  @apply bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-300;
}

.feature-card:hover {
  @apply shadow-lg border-purple-200 dark:border-purple-700;
  transform: translateY(-4px);
}

.feature-icon {
  @apply w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-all duration-300;
}

.guide-step {
  @apply flex items-start gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700;
}

.guide-step-number {
  @apply w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold rounded-full flex items-center justify-center flex-shrink-0;
}

.guide-step-content {
  @apply flex-1;
}

.faq-item {
  @apply bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden;
}

.faq-question {
  @apply flex items-center gap-3 p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors;
  list-style: none;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-answer {
  @apply px-6 pb-6 text-gray-600 dark:text-gray-300 leading-relaxed;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .guide-step {
    @apply flex-col gap-4 p-4;
  }
  
  .guide-step-number {
    @apply w-10 h-10 text-sm;
  }
}
</style>