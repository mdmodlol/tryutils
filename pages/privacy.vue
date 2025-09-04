<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <div class="fade-in">
          <h1 class="text-5xl md:text-6xl font-bold text-gradient mb-6">
            {{ $t('privacy.hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            {{ $t('privacy.hero.description') }}
          </p>
          <p class="text-gray-500">{{ $t('privacy.hero.lastUpdated') }}</p>
        </div>
      </div>
    </section>

    <!-- 主要内容 -->
    <main class="pb-16">
      <div class="max-w-4xl mx-auto px-6">
        <div class="space-y-12 slide-up">
          <!-- 简介 -->
          <section class="card p-8">
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('privacy.intro.title') }}</h2>
                <p class="text-lg text-gray-700 leading-relaxed">
                  {{ $t('privacy.intro.description') }}
                </p>
              </div>
            </div>
          </section>

          <!-- 我们收集的信息 -->
          <section class="card p-8">
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('privacy.collection.title') }}</h2>
                <ul class="text-lg text-gray-700 space-y-3 leading-relaxed">
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-green-500 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                    {{ $t('privacy.collection.point1') }}
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-green-500 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                    {{ $t('privacy.collection.point2') }}
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-green-500 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                    {{ $t('privacy.collection.point3') }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 信息的使用 -->
          <section class="card p-8">
            <div class="flex items-start space-x-6">
              <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ $t('privacy.usage.title') }}</h2>
                <ul class="text-lg text-gray-700 space-y-3 leading-relaxed">
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-purple-500 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                    {{ $t('privacy.usage.point1') }}
                  </li>
                  <li class="flex items-start">
                    <span class="w-2 h-2 bg-purple-500 rounded-full mt-3 mr-3 flex-shrink-0"></span>
                    {{ $t('privacy.usage.point2') }}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <!-- 其他重要政策 -->
          <div class="grid md:grid-cols-2 gap-8">
            <!-- Cookies -->
            <div class="card p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('privacy.cookies.title') }}</h3>
              <p class="text-gray-700 leading-relaxed">
                {{ $t('privacy.cookies.description') }}
              </p>
            </div>

            <!-- 第三方广告 -->
            <div class="card p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('privacy.ads.title') }}</h3>
              <p class="text-gray-700 leading-relaxed">
                {{ $t('privacy.ads.description') }}
              </p>
            </div>

            <!-- 数据安全 -->
            <div class="card p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('privacy.security.title') }}</h3>
              <p class="text-gray-700 leading-relaxed">
                {{ $t('privacy.security.description') }}
              </p>
            </div>

            <!-- 用户权利 -->
            <div class="card p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('privacy.rights.title') }}</h3>
              <p class="text-gray-700 leading-relaxed">
                {{ $t('privacy.rights.description') }}
              </p>
            </div>
          </div>

          <!-- 政策更新和联系 -->
          <div class="grid md:grid-cols-2 gap-8">
            <div class="card p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('privacy.updates.title') }}</h2>
              <p class="text-gray-700 leading-relaxed">
                {{ $t('privacy.updates.description') }}
              </p>
            </div>
            
            <div class="card p-8 bg-gradient-to-r from-green-50 to-teal-50 border-0">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('privacy.contact.title') }}</h2>
              <p class="text-gray-700 mb-4">
                {{ $t('privacy.contact.description') }}
              </p>
              <a href="mailto:contact@tryutils.com" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                contact@tryutils.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// 设置页面标题和描述
useHead({
  title: t('privacy.meta.title'),
  meta: [
    { name: 'description', content: t('privacy.meta.description') },
    { name: 'keywords', content: t('privacy.meta.keywords') }
  ]
})
</script>