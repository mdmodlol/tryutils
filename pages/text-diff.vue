<script setup lang="ts">
/**
 * Text Diff Tool Page
 * Compare two texts and highlight differences
 */
const { t } = useI18n()
const localePath = useLocalePath()

// Breadcrumb items
const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.devTools'), path: '/dev-tools' },
  { name: t('textDiff.title'), path: '/text-diff' }
])

// SEO Meta
useHead({
  title: () => t('textDiff.meta.title'),
  meta: [
    { name: 'description', content: () => t('textDiff.meta.description') },
    { name: 'keywords', content: () => t('textDiff.meta.keywords') }
  ]
})

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
    name: t('textDiff.meta.title'),
    description: t('textDiff.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('textDiff.meta.title'),
    description: t('textDiff.meta.description'),
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
              {{ t('textDiff.title') }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed" itemprop="description">
              {{ t('textDiff.subtitle') }}
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
        <h2 id="tool-section-title" class="sr-only">{{ t('textDiff.title') }}</h2>
        <div class="max-w-7xl mx-auto px-6">
          <div class="slide-up">
            <ClientOnly>
              <TextDiff />
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
    </main>
  </div>
</template>
