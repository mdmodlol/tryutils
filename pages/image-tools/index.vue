<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300" itemscope itemtype="https://schema.org/WebPage">
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
      <Title>{{ t('imageTools.seo.title') }}</Title>
      <Meta name="description" :content="t('imageTools.seo.description')" />
      <Meta name="keywords" :content="t('imageTools.seo.keywords')" />
    </Head>

    <main id="main-content" role="main">
      <!-- Header Section -->
      <header class="container mx-auto px-4 py-12" role="banner">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" itemprop="name">
            {{ t('imageTools.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" itemprop="description">
            {{ t('imageTools.description') }}
          </p>
        </div>
      </header>

      <!-- Tools Grid -->
      <section class="container mx-auto px-4" role="region" aria-labelledby="tools-section-title">
        <h2 id="tools-section-title" class="sr-only">图片处理工具列表</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto" role="list" aria-label="可用的图片处理工具">
          <!-- Image Compressor -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:photo" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.imageCompressor') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('home.categories.imageTools.compressor.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/image-compressor')"
              class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`使用 ${t('nav.imageCompressor')} 工具`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- Format Converter -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:arrow-path" class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.formatConverter') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('home.categories.imageTools.converter.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/image-format-converter')"
              class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`使用 ${t('nav.formatConverter')} 工具`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- HEIC Converter -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:device-phone-mobile" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.heicConverter') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('heicConverter.hero.subtitle') }}
            </p>
            <NuxtLink 
              :to="localePath('/heic-converter')"
              class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`使用 ${t('nav.heicConverter')} 工具`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>

          <!-- QR Code Generator -->
          <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700" role="listitem" itemscope itemtype="https://schema.org/SoftwareApplication">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-4" aria-hidden="true">
                <Icon name="heroicons:qr-code" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white" itemprop="name">
                {{ t('nav.qrCodeGenerator') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6" itemprop="description">
              {{ t('qrCodeGenerator.hero.subtitle') }}
            </p>
            <NuxtLink 
              :to="localePath('/qr-code-generator')"
              class="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              :aria-label="`使用 ${t('nav.qrCodeGenerator')} 工具`"
            >
              {{ t('common.startUsing') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" aria-hidden="true" />
            </NuxtLink>
          </article>
        </div>
      </section>

      <!-- Features Section -->
      <section class="container mx-auto px-4 mt-20" role="region" aria-labelledby="features-title">
        <h2 id="features-title" class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          {{ t('imageTools.features.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8" role="list" aria-label="产品特性列表">
          <article class="text-center" role="listitem" itemscope itemtype="https://schema.org/Thing">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <Icon name="heroicons:shield-check" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
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
              <Icon name="heroicons:bolt" class="w-8 h-8 text-green-600 dark:text-green-400" />
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
              <Icon name="heroicons:globe-alt" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
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
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// SEO
useHead({
  title: () => t('imageTools.seo.title'),
  meta: [
    { name: 'description', content: () => t('imageTools.seo.description') },
    { name: 'keywords', content: () => t('imageTools.seo.keywords') }
  ]
})
</script>