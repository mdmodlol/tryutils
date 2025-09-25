<script setup lang="ts">
// SEO 配置
const { t } = useI18n()
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
const {
  getOrganizationSchema,
  getWebsiteSchema,
  getWebPageSchema,
  getSoftwareApplicationSchema,
  setStructuredData
} = useStructuredData()

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

setStructuredData(schemas)
</script>

<template>
  <div class="min-h-screen" itemscope itemtype="https://schema.org/WebPage">
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
            <span class="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              {{ $t('imageFormatConverter.hero.title') }}
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed" itemprop="description">
            {{ $t('imageFormatConverter.hero.subtitle') }}
          </p>
          <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500" role="list" aria-label="产品特性">
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
      <section class="py-12 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50" role="region" aria-labelledby="features-title">
        <div class="max-w-6xl mx-auto">
          <h2 id="features-title" class="text-3xl font-bold text-center mb-12">
            <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {{ $t('imageFormatConverter.features.title') }}
            </span>
          </h2>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="功能特性列表">
            <!-- 多格式支持 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200" aria-hidden="true">
                <Icon name="heroicons:photo" class="w-8 h-8 text-purple-600" />
              </div>
              <h3 class="text-xl font-semibold mb-3" itemprop="name">{{ $t('imageFormatConverter.features.multiFormat.title') }}</h3>
              <p class="text-gray-600 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.multiFormat.description') }}</p>
            </article>

            <!-- 高质量转换 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200" aria-hidden="true">
                <Icon name="heroicons:sparkles" class="w-8 h-8 text-green-600" />
              </div>
              <h3 class="text-xl font-semibold mb-3" itemprop="name">{{ $t('imageFormatConverter.features.highQuality.title') }}</h3>
              <p class="text-gray-600 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.highQuality.description') }}</p>
            </article>

            <!-- 批量处理 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-blue-100 to-indigo-100 group-hover:from-blue-200 group-hover:to-indigo-200" aria-hidden="true">
                <Icon name="heroicons:queue-list" class="w-8 h-8 text-blue-600" />
              </div>
              <h3 class="text-xl font-semibold mb-3" itemprop="name">{{ $t('imageFormatConverter.features.batchProcessing.title') }}</h3>
              <p class="text-gray-600 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.batchProcessing.description') }}</p>
            </article>

            <!-- 隐私保护 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-orange-100 to-red-100 group-hover:from-orange-200 group-hover:to-red-200" aria-hidden="true">
                <Icon name="heroicons:shield-check" class="w-8 h-8 text-orange-600" />
              </div>
              <h3 class="text-xl font-semibold mb-3" itemprop="name">{{ $t('imageFormatConverter.features.privacy.title') }}</h3>
              <p class="text-gray-600 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.privacy.description') }}</p>
            </article>

            <!-- 快速处理 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-teal-100 to-cyan-100 group-hover:from-teal-200 group-hover:to-cyan-200" aria-hidden="true">
                <Icon name="heroicons:bolt" class="w-8 h-8 text-teal-600" />
              </div>
              <h3 class="text-xl font-semibold mb-3" itemprop="name">{{ $t('imageFormatConverter.features.fastProcessing.title') }}</h3>
              <p class="text-gray-600 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.fastProcessing.description') }}</p>
            </article>

            <!-- 免费使用 -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-pink-100 to-rose-100 group-hover:from-pink-200 group-hover:to-rose-200" aria-hidden="true">
                <Icon name="heroicons:heart" class="w-8 h-8 text-pink-600" />
              </div>
              <h3 class="text-xl font-semibold mb-3" itemprop="name">{{ $t('imageFormatConverter.features.free.title') }}</h3>
              <p class="text-gray-600 leading-relaxed" itemprop="description">{{ $t('imageFormatConverter.features.free.description') }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- 使用指南 -->
      <section class="py-12 px-6" role="region" aria-labelledby="guide-title">
        <div class="max-w-4xl mx-auto">
          <h2 id="guide-title" class="text-3xl font-bold text-center mb-8">
            <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {{ $t('imageFormatConverter.guide.title') }}
            </span>
          </h2>
          
          <ol class="space-y-8" role="list" aria-label="使用步骤">
            <!-- 步骤1 -->
            <li class="guide-step" role="listitem">
              <div class="guide-step-number" aria-hidden="true">1</div>
              <div class="guide-step-content">
                <h3 class="text-xl font-semibold mb-2">{{ $t('imageFormatConverter.guide.step1.title') }}</h3>
                <p class="text-gray-600">{{ $t('imageFormatConverter.guide.step1.description') }}</p>
              </div>
            </li>

            <!-- 步骤2 -->
            <li class="guide-step" role="listitem">
              <div class="guide-step-number" aria-hidden="true">2</div>
              <div class="guide-step-content">
                <h3 class="text-xl font-semibold mb-2">{{ $t('imageFormatConverter.guide.step2.title') }}</h3>
                <p class="text-gray-600">{{ $t('imageFormatConverter.guide.step2.description') }}</p>
              </div>
            </li>

            <!-- 步骤3 -->
            <li class="guide-step" role="listitem">
              <div class="guide-step-number" aria-hidden="true">3</div>
              <div class="guide-step-content">
                <h3 class="text-xl font-semibold mb-2">{{ $t('imageFormatConverter.guide.step3.title') }}</h3>
                <p class="text-gray-600">{{ $t('imageFormatConverter.guide.step3.description') }}</p>
              </div>
            </li>

            <!-- 步骤4 -->
            <li class="guide-step" role="listitem">
              <div class="guide-step-number" aria-hidden="true">4</div>
              <div class="guide-step-content">
                <h3 class="text-xl font-semibold mb-2">{{ $t('imageFormatConverter.guide.step4.title') }}</h3>
                <p class="text-gray-600">{{ $t('imageFormatConverter.guide.step4.description') }}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <!-- FAQ 部分 -->
      <section class="py-12 px-6 bg-gradient-to-br from-gray-50 to-purple-50" role="region" aria-labelledby="faq-title">
        <div class="max-w-4xl mx-auto">
          <h2 id="faq-title" class="text-3xl font-bold text-center mb-8">
            <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {{ $t('imageFormatConverter.faq.title') }}
            </span>
          </h2>
            
          <div class="space-y-6" role="list" aria-label="常见问题列表">
            <!-- FAQ 项目 -->
            <details class="faq-item group" role="listitem">
              <summary class="faq-question" role="button" aria-expanded="false">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-purple-600" aria-hidden="true" />
                <span>{{ $t('imageFormatConverter.faq.q1.question') }}</span>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div class="faq-answer">
                <p>{{ $t('imageFormatConverter.faq.q1.answer') }}</p>
              </div>
            </details>

            <details class="faq-item group" role="listitem">
              <summary class="faq-question" role="button" aria-expanded="false">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-purple-600" aria-hidden="true" />
                <span>{{ $t('imageFormatConverter.faq.q2.question') }}</span>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div class="faq-answer">
                <p>{{ $t('imageFormatConverter.faq.q2.answer') }}</p>
              </div>
            </details>

            <details class="faq-item group" role="listitem">
              <summary class="faq-question" role="button" aria-expanded="false">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-purple-600" aria-hidden="true" />
                <span>{{ $t('imageFormatConverter.faq.q3.question') }}</span>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div class="faq-answer">
                <p>{{ $t('imageFormatConverter.faq.q3.answer') }}</p>
              </div>
            </details>

            <details class="faq-item group" role="listitem">
              <summary class="faq-question" role="button" aria-expanded="false">
                <Icon name="heroicons:question-mark-circle" class="w-5 h-5 text-purple-600" aria-hidden="true" />
                <span>{{ $t('imageFormatConverter.faq.q4.question') }}</span>
                <Icon name="heroicons:chevron-down" class="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" aria-hidden="true" />
              </summary>
              <div class="faq-answer">
                <p>{{ $t('imageFormatConverter.faq.q4.answer') }}</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.feature-card {
  @apply bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-300;
}

.feature-card:hover {
  @apply shadow-lg border-purple-200;
  transform: translateY(-4px);
}

.feature-icon {
  @apply w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-all duration-300;
}

.guide-step {
  @apply flex items-start gap-6 p-6 bg-white rounded-xl shadow-sm border border-gray-100;
}

.guide-step-number {
  @apply w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold rounded-full flex items-center justify-center flex-shrink-0;
}

.guide-step-content {
  @apply flex-1;
}

.faq-item {
  @apply bg-white rounded-lg border border-gray-200 overflow-hidden;
}

.faq-question {
  @apply flex items-center gap-3 p-6 cursor-pointer hover:bg-gray-50 transition-colors;
  list-style: none;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-answer {
  @apply px-6 pb-6 text-gray-600 leading-relaxed;
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