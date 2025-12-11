<script setup lang="ts">
/**
 * Image Compressor Tool Page
 * Integrates SEO components: BreadcrumbNav, FAQ, RelatedContent, ToolPageContent
 * 
 * @see Requirements 2.4, 3.1, 3.2, 4.2, 5.1, 5.2, 5.4
 */
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Tool configuration
const toolId = 'image-compressor'

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.imageTools'), path: '/image-tools' },
  { name: t('nav.imageCompressor'), path: '/image-compressor' }
])

// FAQ items from data file
const faqItems = computed(() => getToolFAQs(toolId, locale.value))

// HowTo steps for ToolPageContent
const howToSteps = computed<HowToStep[]>(() => [
  { 
    name: t('imageCompressor.howTo.step1.name'), 
    text: t('imageCompressor.howTo.step1.text') 
  },
  { 
    name: t('imageCompressor.howTo.step2.name'), 
    text: t('imageCompressor.howTo.step2.text') 
  },
  { 
    name: t('imageCompressor.howTo.step3.name'), 
    text: t('imageCompressor.howTo.step3.text') 
  },
  { 
    name: t('imageCompressor.howTo.step4.name'), 
    text: t('imageCompressor.howTo.step4.text') 
  }
])

// Comparison table data
const comparisons = computed(() => [
  { 
    feature: t('imageCompressor.comparison.privacy'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: false 
  },
  { 
    feature: t('imageCompressor.comparison.batchProcessing'), 
    ourTool: true, 
    competitor1: true, 
    competitor2: false 
  },
  { 
    feature: t('imageCompressor.comparison.qualityControl'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: true 
  },
  { 
    feature: t('imageCompressor.comparison.noRegistration'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: false 
  },
  { 
    feature: t('imageCompressor.comparison.freeUnlimited'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: false 
  }
])

const competitorNames = ['TinyPNG', 'Squoosh']

// Usage statistics
const stats = {
  totalUsers: '50,000+',
  filesProcessed: '1,000,000+',
  avgRating: '4.8/5'
}

// SEO Meta using useToolPageMeta
const { useToolPageMeta } = await import('~/composables/useToolPageMeta')
useToolPageMeta({
  toolName: t('imageCompressor.title'),
  toolDescription: t('imageCompressor.description'),
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
    name: t('imageCompressor.meta.title'),
    description: t('imageCompressor.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('imageCompressor.title'),
    description: t('imageCompressor.description'),
    category: 'Image Compressor'
  })
]

const serviceSchema = getServiceSchema({
  name: t('imageCompressor.meta.title'),
  description: t('imageCompressor.meta.description'),
  rating: { value: '4.8', count: '1250' }
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

      <!-- Main Tool Section -->
      <section class="pb-12" aria-labelledby="tool-section-title">
        <h2 id="tool-section-title" class="sr-only">{{ t('imageCompressor.sections.toolTitle') }}</h2>
        <div class="max-w-4xl mx-auto px-6">
          <div class="slide-up">
            <ImageCompressor />
          </div>
        </div>
      </section>

      <!-- How To Use & Comparison Section -->
      <ToolPageContent
        :tool-name="t('imageCompressor.title')"
        :steps="howToSteps"
        :comparisons="comparisons"
        :competitor-names="competitorNames"
        :stats="stats"
      />

      <!-- Features Section -->
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
                <Icon name="heroicons:photo" class="w-8 h-8 text-white" />
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
                <Icon name="heroicons:shield-check" class="w-8 h-8 text-white" />
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
                <Icon name="heroicons:bolt" class="w-8 h-8 text-white" />
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

      <!-- FAQ Section -->
      <FAQ :items="faqItems" />

      <!-- Related Articles Section -->
      <div class="max-w-6xl mx-auto px-6 py-8">
        <RelatedContent type="articles" :tool-id="toolId" :limit="5" />
      </div>

      <!-- Related Tools Section -->
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

      <!-- Related Links -->
      <div class="max-w-6xl mx-auto px-6 pb-12">
        <RelatedLinks category="tools" />
      </div>
    </main>
  </div>
</template>
