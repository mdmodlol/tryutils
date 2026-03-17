<script setup lang="ts">
/**
 * Markdown Preview Tool Page
 * Real-time Markdown to HTML preview with syntax highlighting
 */
const { t, locale } = useI18n()
const localePath = useLocalePath()

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.devTools'), path: '/dev-tools' },
  { name: t('markdownPreview.title'), path: '/markdown-preview' }
])

// SEO Meta
const seoConfig = computed(() => ({
  title: t('markdownPreview.meta.title'),
  description: t('markdownPreview.meta.description'),
  keywords: t('markdownPreview.meta.keywords'),
  ogTitle: t('markdownPreview.meta.title'),
  ogDescription: t('markdownPreview.meta.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

// Structured data
const { useStructuredData } = await import('~/composables/useStructuredData')
const {
  getOrganizationSchema,
  getWebPageSchema,
  getSoftwareApplicationSchema,
  setStructuredData
} = useStructuredData()

setStructuredData([
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('markdownPreview.meta.title'),
    description: t('markdownPreview.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('markdownPreview.meta.title'),
    description: t('markdownPreview.meta.description'),
    category: 'DeveloperApplication'
  })
])
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
      <div class="max-w-7xl mx-auto px-6 pt-6">
        <BreadcrumbNav :items="breadcrumbItems" />
      </div>

      <!-- Hero Section -->
      <section class="py-8 px-6" aria-labelledby="hero-title">
        <div class="max-w-7xl mx-auto text-center">
          <div class="fade-in">
            <h1 id="hero-title" class="text-4xl md:text-5xl font-bold text-gradient mb-4" itemprop="headline">
              {{ t('markdownPreview.title') }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed" itemprop="description">
              {{ t('markdownPreview.subtitle') }}
            </p>
            <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500" aria-hidden="true" />
                <span>{{ t('home.features.privacy.title') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:bolt" class="w-5 h-5 text-green-500" aria-hidden="true" />
                <span>{{ t('home.features.fast.title') }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-500" aria-hidden="true" />
                <span>{{ t('home.features.online.title') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Tool Section -->
      <section class="pb-12" aria-labelledby="tool-section-title">
        <h2 id="tool-section-title" class="sr-only">{{ t('markdownPreview.title') }}</h2>
        <div class="max-w-7xl mx-auto px-6">
          <div class="slide-up">
            <ClientOnly>
              <MarkdownPreview />
              <template #fallback>
                <div class="flex items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" role="status" aria-label="Loading"></div>
                    <p class="text-gray-600 dark:text-gray-300">{{ t('common.loading') || 'Loading...' }}</p>
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-12 px-6 bg-white dark:bg-gray-800" aria-labelledby="features-title">
        <div class="max-w-7xl mx-auto">
          <h2 id="features-title" class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {{ t('markdownPreview.features.title') }}
          </h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <Icon name="heroicons:eye" class="w-12 h-12 text-blue-500 mx-auto mb-4" aria-hidden="true" />
              <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ t('markdownPreview.features.realtime') }}</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ t('markdownPreview.features.realtimeDesc') }}</p>
            </div>
            <div class="text-center">
              <Icon name="heroicons:code-bracket" class="w-12 h-12 text-blue-500 mx-auto mb-4" aria-hidden="true" />
              <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ t('markdownPreview.features.syntax') }}</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ t('markdownPreview.features.syntaxDesc') }}</p>
            </div>
            <div class="text-center">
              <Icon name="heroicons:arrow-down-tray" class="w-12 h-12 text-blue-500 mx-auto mb-4" aria-hidden="true" />
              <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ t('markdownPreview.features.export') }}</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ t('markdownPreview.features.exportDesc') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-12 px-6" aria-labelledby="faq-title">
        <div class="max-w-3xl mx-auto">
          <h2 id="faq-title" class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {{ t('seo.faq') }}
          </h2>
          <FAQ toolId="markdown-preview" />
        </div>
      </section>

      <!-- Related Tools Section -->
      <section class="py-12 px-6 bg-white dark:bg-gray-800" aria-labelledby="related-title">
        <div class="max-w-7xl mx-auto">
          <h2 id="related-title" class="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            {{ t('seo.relatedTools') }}
          </h2>
          <RelatedContent toolId="markdown-preview" />
        </div>
      </section>
    </main>
  </div>
</template>
