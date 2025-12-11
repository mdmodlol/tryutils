<script setup lang="ts">
/**
 * HEIC Converter Tool Page
 * Integrates SEO components: BreadcrumbNav, FAQ, RelatedContent, ToolPageContent
 * 
 * @see Requirements 2.4, 3.1, 3.2, 4.2, 5.1, 5.2, 5.4
 */
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Tool configuration
const toolId = 'heic-converter'

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.imageTools'), path: '/image-tools' },
  { name: t('nav.heicConverter'), path: '/heic-converter' }
])

// FAQ items from data file
const faqItems = computed(() => getToolFAQs(toolId, locale.value))

// HowTo steps for ToolPageContent
const howToSteps = computed<HowToStep[]>(() => [
  { 
    name: t('heicConverter.howTo.step1.name'), 
    text: t('heicConverter.howTo.step1.text') 
  },
  { 
    name: t('heicConverter.howTo.step2.name'), 
    text: t('heicConverter.howTo.step2.text') 
  },
  { 
    name: t('heicConverter.howTo.step3.name'), 
    text: t('heicConverter.howTo.step3.text') 
  },
  { 
    name: t('heicConverter.howTo.step4.name'), 
    text: t('heicConverter.howTo.step4.text') 
  }
])

// Comparison table data
const comparisons = computed(() => [
  { 
    feature: t('heicConverter.comparison.privacy'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: false 
  },
  { 
    feature: t('heicConverter.comparison.batchProcessing'), 
    ourTool: true, 
    competitor1: true, 
    competitor2: false 
  },
  { 
    feature: t('heicConverter.comparison.qualityControl'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: true 
  },
  { 
    feature: t('heicConverter.comparison.noRegistration'), 
    ourTool: true, 
    competitor1: false, 
    competitor2: false 
  },
  { 
    feature: t('heicConverter.comparison.multiFormat'), 
    ourTool: true, 
    competitor1: true, 
    competitor2: false 
  }
])

const competitorNames = ['Convertio', 'CloudConvert']

// Usage statistics
const stats = {
  totalUsers: '80,000+',
  filesProcessed: '2,000,000+',
  avgRating: '4.9/5'
}

// SEO Meta using useToolPageMeta
const { useToolPageMeta } = await import('~/composables/useToolPageMeta')
useToolPageMeta({
  toolName: t('heicConverter.hero.title'),
  toolDescription: t('heicConverter.hero.subtitle'),
  locale: locale.value as 'zh' | 'en'
})

// Additional structured data
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
  setEnhancedStructuredData
} = useEnhancedStructuredData()

// Set structured data
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

const serviceSchema = getServiceSchema({
  name: t('heicConverter.seo.title'),
  description: t('heicConverter.seo.description'),
  rating: { value: '4.9', count: '1580' }
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

      <!-- Main Tool Section -->
      <section class="pb-12" aria-labelledby="tool-section-title">
        <h2 id="tool-section-title" class="sr-only">{{ t('heicConverter.sections.toolTitle') }}</h2>
        <div class="max-w-4xl mx-auto px-6">
          <div class="slide-up">
            <HeicConverter />
          </div>
        </div>
      </section>

      <!-- How To Use & Comparison Section -->
      <ToolPageContent
        :tool-name="t('heicConverter.hero.title')"
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
          <div class="grid md:grid-cols-3 gap-8" role="list" :aria-label="t('heicConverter.features.listAriaLabel')">
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
                {{ t('heicConverter.features.onlineDescription') }}
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
                {{ t('home.features.privacy.description') }}
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
                {{ t('home.features.fast.description') }}
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
                  {{ t('nav.formatConverter') }}
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed" itemprop="description">
                {{ t('home.categories.imageTools.converter.description') }}
              </p>
              <NuxtLink 
                :to="localePath('/image-format-converter')"
                class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                :aria-label="`${t('common.useNow')} ${t('nav.formatConverter')}`"
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
