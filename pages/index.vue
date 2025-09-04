<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-16 px-6" role="banner" aria-labelledby="hero-title">
      <div class="max-w-4xl mx-auto text-center">
        <div class="fade-in">
          <h1 id="hero-title" class="text-5xl md:text-6xl font-bold text-gradient mb-6">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ $t('home.hero.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- 主要内容 -->
    <main class="pb-16" role="main" aria-label="HEIC转换工具">
      <div class="max-w-4xl mx-auto px-6">
        <div class="slide-up">
          <HeicConverter />
        </div>
      </div>
    </main>

    <!-- 特性介绍 -->
    <section class="py-16 bg-white/50 backdrop-blur-sm" role="region" aria-labelledby="features-title">
      <div class="max-w-6xl mx-auto px-6">
        <h2 id="features-title" class="text-3xl font-bold text-center text-gray-900 mb-12">
          {{ $t('home.features.title') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8" role="list">
          <article class="card p-8 text-center" role="listitem">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m0-14h4m-4 0V1m4 2h4l2 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h4z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.features.online.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.features.online.description') }}</p>
          </article>
          <article class="card p-8 text-center" role="listitem">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.features.privacy.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.features.privacy.description') }}</p>
          </article>
          <article class="card p-8 text-center" role="listitem">
            <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ $t('home.features.fast.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.features.fast.description') }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// 设置页面标题和描述
useHead({
  title: t('home.meta.title'),
  meta: [
    { name: 'description', content: t('home.meta.description') },
    { name: 'keywords', content: t('home.meta.keywords') }
  ]
})
</script>