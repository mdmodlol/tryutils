<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
    <!-- SEO Head -->
    <Head>
      <Title>{{ t('heicConverter.meta.title') }}</Title>
      <Meta name="description" :content="t('heicConverter.meta.description')" />
      <Meta name="keywords" :content="t('heicConverter.meta.keywords')" />
    </Head>



    <!-- Header Section -->
    <div class="container mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ t('heicConverter.hero.title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {{ t('heicConverter.hero.subtitle') }}
        </p>
      </div>

      <!-- HEIC Converter Component -->
      <div class="max-w-4xl mx-auto">
        <HeicConverter />
      </div>

      <!-- Features Section -->
      <div class="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {{ t('home.features.title') }}
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

      <!-- Related Tools -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {{ t('home.relatedTools.title') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                <Icon name="heroicons:photo" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('nav.imageCompressor') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ t('home.categories.imageTools.compressor.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/image-compressor')"
              class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              {{ t('common.useNow') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                <Icon name="heroicons:arrow-path" class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('nav.formatConverter') }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ t('home.categories.imageTools.converter.description') }}
            </p>
            <NuxtLink 
              :to="localePath('/format-converter')"
              class="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              {{ t('common.useNow') }}
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1" />
            </NuxtLink>
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