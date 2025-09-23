<template>
  <div id="app">
    <NuxtLayout>
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <!-- 顶部导航栏 -->
        <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100" role="banner">
          <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
              <!-- 品牌标志 -->
              <div class="flex-shrink-0">
                <NuxtLink :to="localePath('/')" class="group" :aria-label="$t('nav.home')">
                  <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                    TryUtils
                  </h1>
                  <p class="text-gray-600 text-xs mt-1 group-hover:text-gray-800 transition-colors">
                    {{ $t('brand.tagline') }}
                  </p>
                </NuxtLink>
              </div>
              
              <!-- 导航菜单 -->
              <nav class="hidden md:flex items-center space-x-8" role="navigation" relative aria-label="主导航">
                <NuxtLink 
                  :to="localePath('/')" 
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.home') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/image-compressor')" 
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.imageCompressor') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/image-format-converter')" 
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.imageFormatConverter') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/blog')" 
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.blog') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/about')" 
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.about') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/contact')" 
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.contact') }}
                </NuxtLink>
                
                <!-- 语言切换器 -->
                <LanguageSwitcher />
              </nav>
              
              <!-- 移动端菜单按钮 -->
              <button 
                @click="toggleMobileMenu"
                class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                :aria-expanded="isMobileMenuOpen"
                aria-controls="mobile-menu"
                :aria-label="$t('common.toggleMobileMenu')"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            
            <!-- 移动端菜单 -->
            <div v-show="isMobileMenuOpen" id="mobile-menu" class="md:hidden mt-4 pb-4 border-t border-gray-100">
              <nav class="flex flex-col space-y-3 pt-4" role="navigation" :aria-label="$t('common.mobileNavigation')">
                <NuxtLink 
                  :to="localePath('/')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.home') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/image-compressor')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.imageCompressor') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/image-format-converter')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.imageFormatConverter') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/blog')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.blog') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/about')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.about') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/contact')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 py-2"
                  active-class="text-blue-600"
                >
                  {{ $t('nav.contact') }}
                </NuxtLink>
                
                <!-- 移动端语言切换器 -->
                <div class="pt-2 border-t border-gray-200">
                  <LanguageSwitcher />
                </div>
              </nav>
            </div>
          </div>
        </header>

        <!-- 页面内容 -->
        <div class="flex-1">
          <NuxtPage />
        </div>

        <!-- 页脚 -->
        <footer class="bg-gray-900 text-white mt-20" role="contentinfo">
          <div class="max-w-6xl mx-auto px-6 py-12">
            <div class="grid md:grid-cols-4 gap-8">
              <!-- 品牌信息 -->
              <div class="md:col-span-2">
                <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TryUtils
                </h3>
                <p class="text-gray-300 mt-2 text-sm leading-relaxed">
                  {{ $t('footer.description') }}
                </p>
              </div>
              
              <!-- 工具链接 -->
              <nav aria-labelledby="tools-heading">
                <h4 id="tools-heading" class="font-semibold text-white mb-4">{{ $t('footer.tools.title') }}</h4>
                <ul class="space-y-2 text-sm">
                  <li>
                    <NuxtLink :to="localePath('/')" class="text-gray-300 hover:text-blue-400 transition-colors">
                      {{ $t('footer.tools.heicConverter') }}
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="localePath('/image-compressor')" class="text-gray-300 hover:text-blue-400 transition-colors">
                      {{ $t('footer.tools.imageCompressor') }}
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="localePath('/image-format-converter')" class="text-gray-300 hover:text-blue-400 transition-colors">
                      {{ $t('footer.tools.imageFormatConverter') }}
                    </NuxtLink>
                  </li>
                  <li class="text-gray-500">{{ $t('footer.tools.moreComingSoon') }}</li>
                </ul>
              </nav>
              
              <!-- 内容链接 -->
              <nav aria-labelledby="content-heading">
                <h4 id="content-heading" class="font-semibold text-white mb-4">{{ $t('footer.content.title') }}</h4>
                <ul class="space-y-2 text-sm">
                  <li>
                    <NuxtLink :to="localePath('/blog')" class="text-gray-300 hover:text-blue-400 transition-colors">
                      {{ $t('footer.content.blog') }}
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="localePath('/about')" class="text-gray-300 hover:text-blue-400 transition-colors">
                      {{ $t('footer.content.about') }}
                    </NuxtLink>
                  </li>
                </ul>
              </nav>
              
              <!-- 信息链接 -->
              <nav aria-labelledby="info-heading">
                <h4 id="info-heading" class="font-semibold text-white mb-4">{{ $t('footer.info.title') }}</h4>
                <ul class="space-y-2 text-sm">
                  <li>
                    <NuxtLink :to="localePath('/contact')" class="text-gray-300 hover:text-blue-400 transition-colors">
                      {{ $t('footer.info.contact') }}
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink :to="localePath('/privacy')" class="text-gray-300 hover:text-blue-400 transition-colors">
                      {{ $t('footer.info.privacy') }}
                    </NuxtLink>
                  </li>
                </ul>
              </nav>
            </div>
            
            <!-- 底部版权 -->
            <div class="border-t border-gray-800 mt-8 pt-8 text-center">
              <p class="text-gray-400 text-sm">
                {{ $t('footer.copyright') }}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// useI18n 只负责翻译和状态
const { t, locale, setLocale } = useI18n()

// 路由功能需要从独立的函数获取
const switchLocalePath = useSwitchLocalePath() // 用于语言切换器
const localePath = useLocalePath()             // 用于模板中的链接

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 获取当前路由信息
const route = useRoute()

// 设置全局页面配置
useHead({
  titleTemplate: '%s - TryUtils',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'utf-8' },
    // SEO 相关
    { name: 'description', content: () => t('app.seo.description') },
    { name: 'keywords', content: () => t('app.seo.keywords') },
    { name: 'author', content: 'TryUtils Team' },
    { name: 'robots', content: 'index, follow' },
    { name: 'language', content: () => locale.value },
    { 'http-equiv': 'Content-Language', content: () => locale.value },
    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'TryUtils' },
    { property: 'og:url', content: () => `https://www.tryutils.com${route.path}` },
    { property: 'og:title', content: () => t('app.seo.ogTitle') },
    { property: 'og:description', content: () => t('app.seo.ogDescription') },
    { property: 'og:image', content: 'https://www.tryutils.com/android-chrome-512x512.png' },
    { property: 'og:image:width', content: '512' },
    { property: 'og:image:height', content: '512' },
    { property: 'og:locale', content: () => locale.value === 'zh' ? 'zh_CN' : 'en_US' },
    // Twitter
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:site', content: '@TryUtils' },
    { property: 'twitter:url', content: () => `https://www.tryutils.com${route.path}` },
    { property: 'twitter:title', content: () => t('app.seo.twitterTitle') },
    { property: 'twitter:description', content: () => t('app.seo.twitterDescription') },
    { property: 'twitter:image', content: 'https://www.tryutils.com/android-chrome-512x512.png' }
  ],
  link: [
    // 语言切换链接
    { rel: 'alternate', hreflang: 'zh', href: () => `https://www.tryutils.com${switchLocalePath('zh')}` },
    { rel: 'alternate', hreflang: 'en', href: () => `https://www.tryutils.com${switchLocalePath('en')}` },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://www.tryutils.com/' },
    // 规范链接
    { rel: 'canonical', href: () => `https://www.tryutils.com${route.path}` }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: () => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'TryUtils',
        description: t('app.seo.description'),
        url: 'https://www.tryutils.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.tryutils.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        },
        inLanguage: [locale.value === 'zh' ? 'zh-CN' : 'en-US'],
        publisher: {
          '@type': 'Organization',
          name: 'TryUtils',
          url: 'https://www.tryutils.com'
        }
      })
    }
  ]
})
</script>

<style>
/* 页面特定样式 - 其他样式已移至 main.css */
</style>