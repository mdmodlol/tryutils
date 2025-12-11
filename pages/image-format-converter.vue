<script setup lang="ts">
/**
 * Image Format Converter Tool Page
 * Integrates SEO components: BreadcrumbNav, FAQ, RelatedContent, ToolPageContent
 * 
 * @see Requirements 2.4, 3.1, 3.2, 4.2, 5.1, 5.2, 5.4
 */
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Tool configuration
const toolId = 'image-format-converter'

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.imageTools'), path: '/image-tools' },
  { name: t('nav.formatConverter'), path: '/image-format-converter' }
])

// FAQ items from data file
const faqItems = computed(() => getToolFAQs(toolId, locale.value))

// HowTo steps for ToolPageContent
const howToSteps = computed<HowToStep[]>(() => [
  { 
    name: t('imageFormatConverter.howTo.step1.name'), 
    text: t('imageFormatConverter.howTo.step1.text') 
  },
  { 
    name: t('imageFormatConverter.howTo.step2.name'), 
    text: t('imageFormatConverter.howTo.step2.text') 
  },
  { 
    name: t('imageFormatConverter.howTo.step3.name'), 
    text: t('imageFormatConverter.howTo.step3.text') 
  },
  { 
    name: t('imageFormatConverter.howTo.step4.name'), 
    text: t('imageFormatConverter.howTo.step4.text') 
  }
])

// Comparison table data
const comparisons = computed(() => [
  { 
    feature: t('imageFormatConverter.comparison.privacy'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: false 
  },
  { 
    feature: t('imageFormatConverter.comparison.formatSupport'), 
    ourTool: '6+', 
    competitor1: '4', 
    competitor2: '5' 
  },
  { 
    feature: t('imageFormatConverter.comparison.qualityControl'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: true 
  },
  { 
    feature: t('imageFormatConverter.comparison.noRegistration'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: false 
  },
  { 
    feature: t('imageFormatConverter.comparison.batchProcessing'), 
    ourTool: true, 
    competitor1: true, 
    competitor2: false 
  }
])

const competitorNames = ['Online-Convert', 'Zamzar']

// Usage statistics
const stats = {
  totalUsers: '40,000+',
  filesProcessed: '800,000+',
  avgRating: '4.7/5'
}

// SEO Meta using useToolPageMeta
const { useToolPageMeta } = await import('~/composables/useToolPageMeta')
useToolPageMeta({
  toolName: t('imageFormatConverter.hero.title'),
  toolDescription: t('imageFormatConverter.hero.subtitle'),
  locale: locale.value as 'zh' | 'en'
})

// Additional structured data
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
  setEnhancedStructuredData
} = useEnhancedStructuredData()

// Set structured data
const schemas = [
  getOrganizationSchema(),
  getWebsiteSchema(),
  getWebPageSchema({
    name: t('imageFormatConverter.meta.title'),
    description: t('imageFormatConverter.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('imageFormatConverter.hero.title'),
    description: t('imageFormatConverter.hero.subtitle'),
    category: 'Image Format Converter'
  })
]

const serviceSchema = getServiceSchema({
  name: t('imageFormatConverter.meta.title'),
  description: t('imageFormatConverter.meta.description'),
  rating: { value: '4.7', count: '980' }
})

setStructuredData(schemas)
setEnhancedStructuredData([serviceSchema])
</script>

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

    <main id="main-content" role="main">
      <!-- Breadcrumb Navigation -->
      <div class="max-w-4xl mx-auto px-6 pt-6">
        <BreadcrumbNav :items="breadcrumbItems" />
      </div>

      <!-- Hero Section -->
      <section class="py-12 px-6" aria-labelledby="hero-title">
        <div class="max-w-4xl mx-auto text-center">
          <h1 id="hero-title" class="text-4xl md:text-5xl font-bold mb-6" itemprop="name">
            <span class="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
              {{ t('imageFormatConverter.hero.title') }}
            </span>
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed" itemprop="description">
            {{ t('imageFormatConverter.hero.subtitle') }}
          </p>
          <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400" role="list" aria-label="产品特性">
            <div class="flex items-center gap-2" role="listitem">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>{{ t('imageFormatConverter.hero.feature1') }}</span>
            </div>
            <div class="flex items-center gap-2" role="listitem">
              <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>{{ t('imageFormatConverter.hero.feature2') }}</span>
            </div>
            <div class="flex items-center gap-2" role="listitem">
              <Icon name="heroicons:bolt" class="w-5 h-5 text-green-500" aria-hidden="true" />
              <span>{{ t('imageFormatConverter.hero.feature3') }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Tool Section -->
      <section class="pb-12 px-6" aria-labelledby="tool-section-title">
        <h2 id="tool-section-title" class="sr-only">{{ t('imageFormatConverter.sections.toolTitle') }}</h2>
        <ImageFormatConverter />
      </section>

      <!-- How To Use & Comparison Section -->
      <ToolPageContent
        :tool-name="t('imageFormatConverter.hero.title')"
        :steps="howToSteps"
        :comparisons="comparisons"
        :competitor-names="competitorNames"
        :stats="stats"
      />

      <!-- Features Section -->
      <section class="py-12 px-6 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300" role="region" aria-labelledby="features-title">
        <div class="max-w-6xl mx-auto">
          <h2 id="features-title" class="text-3xl font-bold text-center mb-12">
            <span class="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {{ t('imageFormatConverter.features.title') }}
            </span>
          </h2>
          
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="功能特性列表">
            <!-- Multi-format support -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 group-hover:from-purple-200 group-hover:to-pink-200 dark:group-hover:from-purple-800/50 dark:group-hover:to-pink-800/50" aria-hidden="true">
                <Icon name="heroicons:photo" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ t('imageFormatConverter.features.multiFormat.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ t('imageFormatConverter.features.multiFormat.description') }}</p>
            </article>

            <!-- High quality -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 group-hover:from-green-200 group-hover:to-emerald-200 dark:group-hover:from-green-800/50 dark:group-hover:to-emerald-800/50" aria-hidden="true">
                <Icon name="heroicons:sparkles" class="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ t('imageFormatConverter.features.highQuality.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ t('imageFormatConverter.features.highQuality.description') }}</p>
            </article>

            <!-- Batch processing -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 group-hover:from-blue-200 group-hover:to-indigo-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-indigo-800/50" aria-hidden="true">
                <Icon name="heroicons:queue-list" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ t('imageFormatConverter.features.batchProcessing.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ t('imageFormatConverter.features.batchProcessing.description') }}</p>
            </article>

            <!-- Privacy -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 group-hover:from-orange-200 group-hover:to-red-200 dark:group-hover:from-orange-800/50 dark:group-hover:to-red-800/50" aria-hidden="true">
                <Icon name="heroicons:shield-check" class="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ t('imageFormatConverter.features.privacy.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ t('imageFormatConverter.features.privacy.description') }}</p>
            </article>

            <!-- Fast processing -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50 group-hover:from-teal-200 group-hover:to-cyan-200 dark:group-hover:from-teal-800/50 dark:group-hover:to-cyan-800/50" aria-hidden="true">
                <Icon name="heroicons:bolt" class="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ t('imageFormatConverter.features.fastProcessing.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ t('imageFormatConverter.features.fastProcessing.description') }}</p>
            </article>

            <!-- Free -->
            <article class="feature-card group" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="feature-icon bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 group-hover:from-pink-200 group-hover:to-rose-200 dark:group-hover:from-pink-800/50 dark:group-hover:to-rose-800/50" aria-hidden="true">
                <Icon name="heroicons:heart" class="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100" itemprop="name">{{ t('imageFormatConverter.features.free.title') }}</h3>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed" itemprop="description">{{ t('imageFormatConverter.features.free.description') }}</p>
            </article>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <FAQ :items="faqItems" />

      <!-- Related Articles Section -->
      <div class="max-w-6xl mx-auto px-6 py-8">
        <RelatedContent type="articles" :tool-id="toolId" :limit="5" />
      </div>

      <!-- Related Tools Section -->
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
                :aria-label="`${t('common.useNow')} ${t('nav.imageCompressor')}`"
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
                :aria-label="`${t('common.useNow')} ${t('nav.heicConverter')}`"
              >
                {{ t('common.useNow') }}
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>

      <!-- Related Links -->
      <div class="max-w-6xl mx-auto px-6 pb-12">
        <RelatedLinks category="tools" />
      </div>
    </main>
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
</style>
