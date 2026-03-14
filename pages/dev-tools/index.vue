<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300" itemscope itemtype="https://schema.org/WebPage">
    <!-- Skip to main content link for accessibility -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      tabindex="0"
    >
      {{ $t('accessibility.skipToMain') }}
    </a>

    <!-- SEO Head -->
    <Head>
      <Title>{{ t('devTools.seo.title') }}</Title>
      <Meta name="description" :content="t('devTools.seo.description')" />
      <Meta name="keywords" :content="t('devTools.seo.keywords')" />
    </Head>

    <main id="main-content" role="main">
      <!-- Header Section -->
      <header class="container mx-auto px-4 py-12" role="banner">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" itemprop="name">
            {{ t('devTools.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" itemprop="description">
            {{ t('devTools.description') }}
          </p>
        </div>
      </header>

      <!-- Tools Grid -->
      <section class="container mx-auto px-4" role="region" aria-labelledby="tools-section-title">
        <h2 id="tools-section-title" class="sr-only">{{ t('devTools.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto" role="list" :aria-label="t('devTools.title')">
          <!-- JSON Formatter -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:code-bracket" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.jsonFormatter') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('home.categories.devTools.jsonFormatter.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/json-formatter')"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`${t('common.startUsing')} ${t('nav.jsonFormatter')}`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- Base64 Codec -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:lock-closed" class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.base64Codec') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('home.categories.devTools.base64Codec.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/base64-codec')"
              class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`${t('common.startUsing')} ${t('nav.base64Codec')}`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- Color Converter -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:swatch" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.colorConverter') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('home.categories.devTools.colorConverter.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/color-converter')"
              class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`${t('common.startUsing')} ${t('nav.colorConverter')}`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- Text Diff -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:document-duplicate" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.textDiff') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('home.categories.devTools.textDiff.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/text-diff')"
              class="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`${t('common.startUsing')} ${t('nav.textDiff')}`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- URL Codec -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:link" class="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.urlCodec') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('home.categories.devTools.urlCodec.description') }}
            </p>
            <NuxtLink
              :to="localePath('/url-codec')"
              class="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`${t('common.startUsing')} ${t('nav.urlCodec')}`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- Markdown Preview -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:document-text" class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.markdownPreview') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('home.categories.devTools.markdownPreview.description') }}
            </p>
            <NuxtLink
              :to="localePath('/markdown-preview')"
              class="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`${t('common.startUsing')} ${t('nav.markdownPreview')}`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>
        </div>
      </section>

      <!-- Features Section -->
      <section class="container mx-auto px-4 mt-20 pb-16" role="region" aria-labelledby="features-title">
        <h2 id="features-title" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          {{ t('devTools.features.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
          <article class="text-center" role="listitem">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Icon name="heroicons:shield-check" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('home.features.privacy.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.privacy.description') }}
            </p>
          </article>
          <article class="text-center" role="listitem">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Icon name="heroicons:bolt" class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('home.features.fast.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.fast.description') }}
            </p>
          </article>
          <article class="text-center" role="listitem">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Icon name="heroicons:globe-alt" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('home.features.online.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.online.description') }}
            </p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// SEO
useHead({
  title: () => t('devTools.seo.title'),
  meta: [
    { name: 'description', content: () => t('devTools.seo.description') },
    { name: 'keywords', content: () => t('devTools.seo.keywords') }
  ]
})
</script>
