<script setup lang="ts">
// SEO 配置
const { t } = useI18n()
const localePath = useLocalePath()

const seoConfig = computed(() => ({
  title: t('app.seo.ogTitle'),
  description: t('app.seo.description'),
  keywords: t('app.seo.keywords'),
  ogTitle: t('app.seo.ogTitle'),
  ogDescription: t('app.seo.ogDescription'),
  twitterTitle: t('app.seo.twitterTitle'),
  twitterDescription: t('app.seo.twitterDescription'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

// 结构化数据
const { useStructuredData } = await import('~/composables/useStructuredData')
const {
  getOrganizationSchema,
  getWebsiteSchema,
  getWebPageSchema,
  setStructuredData
} = useStructuredData()

// 设置首页结构化数据
const schemas = [
  getOrganizationSchema(),
  getWebsiteSchema(),
  getWebPageSchema({
    name: t('app.seo.ogTitle'),
    description: t('app.seo.description')
  })
]

setStructuredData(schemas)

// 工具分类数据
const toolCategories = computed(() => [
  {
    id: 'image-tools',
    title: t('home.categories.imageTools.title'),
    description: t('home.categories.imageTools.description'),
    icon: 'image',
    color: 'from-blue-500 to-purple-600',
    tools: [
      {
        name: t('nav.imageCompressor'),
        description: t('home.categories.imageTools.compressor.description'),
        path: '/image-compressor',
        icon: 'compress'
      },
      {
        name: t('nav.imageFormatConverter'),
        description: t('home.categories.imageTools.converter.description'),
        path: '/image-format-converter',
        icon: 'convert'
      }
    ]
  }
])
</script>

<template>
  <div class="min-h-screen" itemscope itemtype="https://schema.org/WebPage">
    <main role="main">
      <!-- Hero Section -->
      <section class="py-20 px-6" aria-labelledby="hero-title">
        <div class="max-w-6xl mx-auto text-center">
          <div class="fade-in">
            <h1 id="hero-title" class="text-5xl md:text-7xl font-bold text-gradient mb-8" itemprop="headline">
              {{ t('home.hero.title') }}
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed" itemprop="description">
              {{ t('home.hero.description') }}
            </p>
            
            <!-- 核心价值主张 -->
            <div class="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto" role="list" aria-label="{{ t('home.values.title') }}">
              <div class="flex items-center justify-center space-x-3" role="listitem">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center" aria-hidden="true">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m0-14h4m-4 0V1m4 2h4l2 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h4z"></path>
                  </svg>
                </div>
                <span class="text-lg font-semibold text-gray-800">{{ t('home.values.free') }}</span>
              </div>
              <div class="flex items-center justify-center space-x-3" role="listitem">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center" aria-hidden="true">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <span class="text-lg font-semibold text-gray-800">{{ t('home.values.secure') }}</span>
              </div>
              <div class="flex items-center justify-center space-x-3" role="listitem">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center" aria-hidden="true">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span class="text-lg font-semibold text-gray-800">{{ t('home.values.fast') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 工具分类展示 -->
      <section class="py-12 px-6" aria-labelledby="tools-section-title">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 id="tools-section-title" class="text-4xl font-bold text-gray-900 mb-4">{{ t('home.categories.title') }}</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">{{ t('home.categories.subtitle') }}</p>
          </div>
          
          <div class="grid lg:grid-cols-1 gap-12">
            <article 
              v-for="category in toolCategories" 
              :key="category.id" 
              class="slide-up"
              :aria-labelledby="`category-${category.id}-title`"
            >
              <!-- 分类卡片 -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                <div class="p-8">
                  <header class="flex items-center mb-6">
                    <div 
                      :class="`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mr-6`"
                      aria-hidden="true"
                    >
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 :id="`category-${category.id}-title`" class="text-2xl font-bold text-gray-900 mb-2">{{ category.title }}</h3>
                      <p class="text-gray-600">{{ category.description }}</p>
                    </div>
                  </header>
                  
                  <!-- 工具列表 -->
                  <nav 
                    class="grid md:grid-cols-2 gap-6" 
                    :aria-label="`${category.title} 工具列表`"
                    role="navigation"
                  >
                    <NuxtLink 
                      v-for="tool in category.tools" 
                      :key="tool.path"
                      :to="localePath(tool.path)"
                      class="group p-6 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :aria-label="`${tool.name} - ${tool.description}`"
                    >
                      <div class="flex items-start space-x-4">
                        <div 
                          class="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300"
                          aria-hidden="true"
                        >
                          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h4 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {{ tool.name }}
                          </h4>
                          <p class="text-gray-600 text-sm leading-relaxed">
                            {{ tool.description }}
                          </p>
                        </div>
                        <div class="flex-shrink-0">
                          <svg 
                            class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </NuxtLink>
                  </nav>
                  
                  <!-- 查看全部链接 -->
                  <div class="mt-8 text-center">
                    <NuxtLink 
                      :to="localePath('/image-tools')" 
                      class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :aria-label="`查看所有 ${category.title} 工具`"
                    >
                      <span>{{ t('home.categories.viewAll') }}</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- 特色功能介绍 -->
      <section class="py-16 px-6 bg-gradient-to-r from-blue-50 to-purple-50" aria-labelledby="features-title">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 id="features-title" class="text-4xl font-bold text-gray-900 mb-4">{{ t('home.features.title') }}</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">{{ t('home.features.subtitle') }}</p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center p-6" role="article" aria-labelledby="feature-1-title">
              <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m0-14h4m-4 0V1m4 2h4l2 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h4z"></path>
                </svg>
              </div>
              <h3 id="feature-1-title" class="text-xl font-semibold text-gray-900 mb-3">{{ t('home.features.privacy.title') }}</h3>
              <p class="text-gray-600">{{ t('home.features.privacy.description') }}</p>
            </div>
            
            <div class="text-center p-6" role="article" aria-labelledby="feature-2-title">
              <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 id="feature-2-title" class="text-xl font-semibold text-gray-900 mb-3">{{ t('home.features.speed.title') }}</h3>
              <p class="text-gray-600">{{ t('home.features.speed.description') }}</p>
            </div>
            
            <div class="text-center p-6" role="article" aria-labelledby="feature-3-title">
              <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.40A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 id="feature-3-title" class="text-xl font-semibold text-gray-900 mb-3">{{ t('home.features.quality.title') }}</h3>
              <p class="text-gray-600">{{ t('home.features.quality.description') }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 px-6" aria-labelledby="cta-title">
        <div class="max-w-4xl mx-auto text-center">
          <h2 id="cta-title" class="text-4xl font-bold text-gray-900 mb-6">{{ t('home.cta.title') }}</h2>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{{ t('home.cta.description') }}</p>
          <NuxtLink 
            :to="localePath('/image-tools')" 
            class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :aria-label="t('home.cta.buttonAriaLabel')"
          >
            <span>{{ t('home.cta.button') }}</span>
            <svg class="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
        </div>
      </section>

      <!-- 统计数据展示 -->
      <section class="py-12 bg-gradient-to-r from-blue-50 to-purple-50" role="region" aria-labelledby="stats-title">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <h2 id="stats-title" class="text-3xl font-bold text-gray-900 mb-8">{{ t('home.stats.title') }}</h2>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <div class="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div class="text-gray-600">{{ t('home.stats.users') }}</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <div class="text-4xl font-bold text-purple-600 mb-2">50,000+</div>
              <div class="text-gray-600">{{ t('home.stats.files') }}</div>
            </div>
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <div class="text-4xl font-bold text-green-600 mb-2">99.9%</div>
              <div class="text-gray-600">{{ t('home.stats.uptime') }}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>