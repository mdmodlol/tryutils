<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800" itemscope itemtype="https://schema.org/WebPage">
    <!-- Skip to main content link for accessibility -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      tabindex="0"
    >
      跳转到主要内容
    </a>

    <!-- SEO Head -->
    <Head>
      <Title>{{ t('heicConverter.meta.title') }}</Title>
      <Meta name="description" :content="t('heicConverter.meta.description')" />
      <Meta name="keywords" :content="t('heicConverter.meta.keywords')" />
    </Head>

    <main id="main-content" role="main">
      <!-- Header Section -->
      <section class="container mx-auto px-4 py-12" aria-labelledby="hero-title">
        <header class="text-center mb-12">
          <h1 id="hero-title" class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" itemprop="headline">
            {{ t('heicConverter.hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" itemprop="description">
            {{ t('heicConverter.hero.subtitle') }}
          </p>
        </header>

        <!-- HEIC Converter Component -->
        <section class="max-w-4xl mx-auto" aria-labelledby="converter-section-title">
          <h2 id="converter-section-title" class="sr-only">HEIC转换工具</h2>
          <HeicConverter />
        </section>

        <!-- Features Section -->
        <section class="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700" role="region" aria-labelledby="features-title">
          <h2 id="features-title" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {{ t('home.features.title') }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8" role="list" aria-label="产品特性列表">
            <article class="text-center" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Icon name="heroicons:shield-check" class="w-8 h-8 text-blue-600 dark:text-blue-400" aria-label="隐私保护图标" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2" itemprop="name">
                {{ t('home.features.privacy.title') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300" itemprop="description">
                {{ t('home.features.privacy.description') }}
              </p>
            </article>

            <article class="text-center" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Icon name="heroicons:bolt" class="w-8 h-8 text-green-600 dark:text-green-400" aria-label="快速处理图标" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2" itemprop="name">
                {{ t('home.features.fast.title') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300" itemprop="description">
                {{ t('home.features.fast.description') }}
              </p>
            </article>

            <article class="text-center" role="listitem" itemscope itemtype="https://schema.org/Thing">
              <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <Icon name="heroicons:globe-alt" class="w-8 h-8 text-purple-600 dark:text-purple-400" aria-label="在线处理图标" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2" itemprop="name">
                {{ t('home.features.online.title') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300" itemprop="description">
                {{ t('home.features.online.description') }}
              </p>
            </article>
          </div>
        </section>

        <!-- Related Tools -->
        <section class="mt-16" role="region" aria-labelledby="related-tools-title">
          <h2 id="related-tools-title" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            {{ t('home.relatedTools.title') }}
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto" role="list" aria-label="相关工具列表">
            <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                  <Icon name="heroicons:photo" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white" itemprop="name">
                  {{ t('nav.imageCompressor') }}
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-4" itemprop="description">
                {{ t('home.categories.imageTools.compressor.description') }}
              </p>
              <NuxtLink 
                :to="localePath('/image-compressor')"
                class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                :aria-label="`使用 ${t('nav.imageCompressor')} 工具`"
              >
                {{ t('common.useNow') }}
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" aria-hidden="true" />
              </NuxtLink>
            </article>

            <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                  <Icon name="heroicons:arrow-path" class="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white" itemprop="name">
                  {{ t('nav.formatConverter') }}
                </h3>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mb-4" itemprop="description">
                {{ t('home.categories.imageTools.converter.description') }}
              </p>
              <NuxtLink 
                :to="localePath('/format-converter')"
                class="inline-flex items-center text-green-600 hover:text-green-700 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
                :aria-label="`使用 ${t('nav.formatConverter')} 工具`"
              >
                {{ t('common.useNow') }}
                <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" aria-hidden="true" />
              </NuxtLink>
            </article>
          </div>
        </section>
      </section>
    </main>
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
</script>