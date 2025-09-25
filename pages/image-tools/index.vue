<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- SEO Head -->
    <Head>
      <Title>{{ t('imageTools.seo.title') }}</Title>
      <Meta name="description" :content="t('imageTools.seo.description')" />
      <Meta name="keywords" :content="t('imageTools.seo.keywords')" />
    </Head>



    <!-- Header Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('imageTools.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {{ t('imageTools.description') }}
        </p>
      </div>

      <!-- Tools Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Image Compressor -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
              <Icon name="heroicons:photo" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('nav.imageCompressor') }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ t('home.categories.imageTools.compressor.description') }}
          </p>
          <NuxtLink 
            :to="localePath('/image-compressor')"
            class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {{ t('common.startUsing') }}
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </NuxtLink>
        </div>

        <!-- Format Converter -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
              <Icon name="heroicons:arrow-path" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('nav.formatConverter') }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ t('home.categories.imageTools.converter.description') }}
          </p>
          <NuxtLink 
            :to="localePath('/image-format-converter')"
            class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {{ t('common.startUsing') }}
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </NuxtLink>
        </div>

        <!-- HEIC Converter -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-4">
              <Icon name="heroicons:device-phone-mobile" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ t('nav.heicConverter') }}
            </h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ t('heicConverter.hero.subtitle') }}
          </p>
          <NuxtLink 
            :to="localePath('/heic-converter')"
            class="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {{ t('common.startUsing') }}
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </NuxtLink>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-20">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          {{ t('imageTools.features.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:shield-check" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('home.features.privacy.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.privacy.description') }}
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:bolt" class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('home.features.fast.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.fast.description') }}
            </p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:globe-alt" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {{ t('home.features.online.title') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ t('home.features.online.description') }}
            </p>
          </div>
        </div>
      </div>
    </div>
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