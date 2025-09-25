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
            <div class="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
              <div class="flex items-center justify-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m0-14h4m-4 0V1m4 2h4l2 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h4z"></path>
                  </svg>
                </div>
                <span class="text-lg font-semibold text-gray-800">{{ t('home.values.free') }}</span>
              </div>
              <div class="flex items-center justify-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <span class="text-lg font-semibold text-gray-800">{{ t('home.values.secure') }}</span>
              </div>
              <div class="flex items-center justify-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section class="py-16 px-6" aria-label="工具分类">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">{{ t('home.categories.title') }}</h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">{{ t('home.categories.subtitle') }}</p>
          </div>
          
          <div class="grid lg:grid-cols-1 gap-12">
            <div v-for="category in toolCategories" :key="category.id" class="slide-up">
              <!-- 分类卡片 -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div class="p-8">
                  <div class="flex items-center mb-6">
                    <div :class="`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mr-6`">
                      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ category.title }}</h3>
                      <p class="text-gray-600">{{ category.description }}</p>
                    </div>
                  </div>
                  
                  <!-- 工具列表 -->
                  <div class="grid md:grid-cols-2 gap-6">
                    <NuxtLink 
                      v-for="tool in category.tools" 
                      :key="tool.path"
                      :to="localePath(tool.path)"
                      class="group p-6 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-transparent hover:border-gray-200"
                    >
                      <div class="flex items-start space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h4 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {{ tool.name }}
                          </h4>
                          <p class="text-gray-600 text-sm leading-relaxed">{{ tool.description }}</p>
                        </div>
                        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </div>
                      </div>
                    </NuxtLink>
                  </div>
                  
                  <!-- 查看全部按钮 -->
                  <div class="mt-8 text-center">
                    <NuxtLink 
                      :to="localePath('/image-tools')"
                      class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {{ t('home.categories.viewAll') }}
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 统计数据展示 -->
      <section class="py-16 bg-gradient-to-r from-blue-50 to-purple-50" role="region" aria-labelledby="stats-title">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <h2 id="stats-title" class="text-3xl font-bold text-gray-900 mb-12">{{ t('home.stats.title') }}</h2>
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