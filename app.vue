<template>
  <div id="app">
    <NuxtLayout>
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
        <!-- Skip to main content link for accessibility -->
        <a 
          href="#main-content" 
          class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:z-50"
          :aria-label="$t('accessibility.skipToMain')"
        >
          {{ $t('accessibility.skipToMain') }}
        </a>

        <!-- 顶部导航栏 -->
        <header class="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm dark:shadow-gray-900/50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300" role="banner">
          <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
              <!-- 品牌标志 -->
              <div class="flex-shrink-0">
                <NuxtLink 
                  :to="localePath('/')" 
                  class="group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg" 
                  :aria-label="$t('nav.homePageLink')"
                >
                  <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-500 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 dark:hover:from-purple-400 dark:hover:to-blue-400 transition-all duration-300">
                    TryUtils
                  </h1>
                  <p class="text-gray-600 dark:text-gray-400 text-xs mt-1 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors">
                    {{ $t('brand.tagline') }}
                  </p>
                </NuxtLink>
              </div>
              
              <!-- 主导航菜单 -->
              <nav
                class="hidden md:flex items-center lg:space-x-6 md:space-x-4"
                role="navigation"
                :aria-label="$t('nav.mainNavigation')"
              >
                <NuxtLink
                  :to="localePath('/')"
                  class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1.5 py-1 whitespace-nowrap"
                  active-class="text-blue-600"
                  :aria-current="$route.path === localePath('/') ? 'page' : undefined"
                >
                  {{ $t('nav.home') }}
                </NuxtLink>
                
                <!-- Image Tools Dropdown -->
                <div class="relative group">
                  <button
                    class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1.5 py-1 whitespace-nowrap"
                    :aria-expanded="false"
                    :aria-haspopup="true"
                    :aria-label="$t('nav.imageToolsMenu')"
                    @keydown.enter="$event.target.focus()"
                    @keydown.space.prevent="$event.target.focus()"
                  >
                    {{ $t('nav.imageTools') }}
                    <Icon name="heroicons:chevron-down" class="w-4 h-4 ml-1" aria-hidden="true" />
                  </button>
                  <div 
                    class="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50"
                    role="menu"
                    :aria-label="$t('nav.imageToolsSubmenu')"
                  >
                    <div class="p-2">
                      <NuxtLink 
                        :to="localePath('/image-compressor')" 
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        {{ $t('nav.imageCompressor') }}
                      </NuxtLink>
                      <NuxtLink 
                        :to="localePath('/image-format-converter')" 
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        {{ $t('nav.imageFormatConverter') }}
                      </NuxtLink>
                      <NuxtLink 
                        :to="localePath('/heic-converter')" 
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        {{ $t('nav.heicConverter') }}
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <!-- Dev Tools Dropdown -->
                <div class="relative group">
                  <button
                    class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1.5 py-1 whitespace-nowrap"
                    :aria-expanded="false"
                    :aria-haspopup="true"
                    :aria-label="$t('nav.devToolsMenu')"
                    @keydown.enter="$event.target.focus()"
                    @keydown.space.prevent="$event.target.focus()"
                  >
                    {{ $t('nav.devTools') }}
                    <Icon name="heroicons:chevron-down" class="w-4 h-4 ml-1" aria-hidden="true" />
                  </button>
                  <div
                    class="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-50"
                    role="menu"
                    :aria-label="$t('nav.devToolsSubmenu')"
                  >
                    <div class="p-2">
                      <NuxtLink
                        :to="localePath('/json-formatter')"
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        {{ $t('nav.jsonFormatter') }}
                      </NuxtLink>
                      <NuxtLink
                        :to="localePath('/base64-codec')"
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        {{ $t('nav.base64Codec') }}
                      </NuxtLink>
                      <NuxtLink
                        :to="localePath('/color-converter')"
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        {{ $t('nav.colorConverter') }}
                      </NuxtLink>
                      <NuxtLink
                        :to="localePath('/text-diff')"
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        {{ $t('nav.textDiff') }}
                      </NuxtLink>
                      <NuxtLink
                        :to="localePath('/url-codec')"
                        class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                        role="menuitem"
                      >
                        {{ $t('nav.urlCodec') }}
                      </NuxtLink>
                    </div>
                  </div>
                </div>

                <NuxtLink
                  :to="localePath('/blog')"
                  class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1.5 py-1 whitespace-nowrap"
                  active-class="text-blue-600"
                  :aria-current="$route.path.startsWith(localePath('/blog')) ? 'page' : undefined"
                >
                  {{ $t('nav.blog') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/about')"
                  class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1.5 py-1 whitespace-nowrap"
                  active-class="text-blue-600"
                  :aria-current="$route.path === localePath('/about') ? 'page' : undefined"
                >
                  {{ $t('nav.about') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/contact')"
                  class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1.5 py-1 whitespace-nowrap"
                  active-class="text-blue-600"
                  :aria-current="$route.path === localePath('/contact') ? 'page' : undefined"
                >
                  {{ $t('nav.contact') }}
                </NuxtLink>
                
                <!-- 主题切换器 -->
                <ThemeToggle />
                
                <!-- 语言切换器 -->
                <LanguageSwitcher />
              </nav>
              
              <!-- 移动端菜单按钮 -->
              <button 
                @click="toggleMobileMenu"
                class="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                :aria-expanded="isMobileMenuOpen"
                aria-controls="mobile-menu"
                :aria-label="$t('nav.toggleMobileMenu')"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
            
            <!-- 移动端菜单 -->
            <div 
              v-show="isMobileMenuOpen" 
              id="mobile-menu" 
              class="md:hidden mt-4 pb-4 border-t border-gray-100 dark:border-gray-800"
              :aria-hidden="!isMobileMenuOpen"
            >
              <nav 
                class="flex flex-col space-y-3 pt-4" 
                role="navigation" 
                :aria-label="$t('nav.mobileNavigation')"
              >
                <NuxtLink 
                  :to="localePath('/')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  active-class="text-blue-600"
                  :aria-current="$route.path === localePath('/') ? 'page' : undefined"
                >
                  {{ $t('nav.home') }}
                </NuxtLink>
                
                <!-- Mobile Image Tools Section -->
                <div class="space-y-1">
                  <div class="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t('imageTools.title') }}
                  </div>
                  <NuxtLink 
                    :to="localePath('/image-compressor')" 
                    @click="closeMobileMenu"
                    class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    active-class="text-blue-600"
                  >
                    {{ $t('nav.imageCompressor') }}
                  </NuxtLink>
                  <NuxtLink 
                    :to="localePath('/image-format-converter')" 
                    @click="closeMobileMenu"
                    class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    active-class="text-blue-600"
                  >
                    {{ $t('nav.imageFormatConverter') }}
                  </NuxtLink>
                  <NuxtLink 
                    :to="localePath('/heic-converter')" 
                    @click="closeMobileMenu"
                    class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    active-class="text-blue-600"
                  >
                    {{ $t('nav.heicConverter') }}
                  </NuxtLink>
                </div>
                
                <!-- Mobile Dev Tools Section -->
                <div class="space-y-1">
                  <div class="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t('nav.devTools') }}
                  </div>
                  <NuxtLink
                    :to="localePath('/json-formatter')"
                    @click="closeMobileMenu"
                    class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    active-class="text-blue-600"
                  >
                    {{ $t('nav.jsonFormatter') }}
                  </NuxtLink>
                  <NuxtLink
                    :to="localePath('/base64-codec')"
                    @click="closeMobileMenu"
                    class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    active-class="text-blue-600"
                  >
                    {{ $t('nav.base64Codec') }}
                  </NuxtLink>
                  <NuxtLink
                    :to="localePath('/color-converter')"
                    @click="closeMobileMenu"
                    class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    active-class="text-blue-600"
                  >
                    {{ $t('nav.colorConverter') }}
                  </NuxtLink>
                  <NuxtLink
                    :to="localePath('/text-diff')"
                    @click="closeMobileMenu"
                    class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    active-class="text-blue-600"
                  >
                    {{ $t('nav.textDiff') }}
                  </NuxtLink>
                  <NuxtLink
                    :to="localePath('/url-codec')"
                    @click="closeMobileMenu"
                    class="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 pl-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                    active-class="text-blue-600"
                  >
                    {{ $t('nav.urlCodec') }}
                  </NuxtLink>
                </div>
                
                <NuxtLink
                  :to="localePath('/blog')"
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  active-class="text-blue-600"
                  :aria-current="$route.path.startsWith(localePath('/blog')) ? 'page' : undefined"
                >
                  {{ $t('nav.blog') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/about')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  active-class="text-blue-600"
                  :aria-current="$route.path === localePath('/about') ? 'page' : undefined"
                >
                  {{ $t('nav.about') }}
                </NuxtLink>
                <NuxtLink 
                  :to="localePath('/contact')" 
                  @click="closeMobileMenu"
                  class="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors duration-200 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  active-class="text-blue-600"
                  :aria-current="$route.path === localePath('/contact') ? 'page' : undefined"
                >
                  {{ $t('nav.contact') }}
                </NuxtLink>
                
                <!-- Mobile Theme and Language Switcher -->
                <div class="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <ThemeToggle />
                  <LanguageSwitcher />
                </div>
              </nav>
            </div>
          </div>
        </header>

        <!-- 主要内容区域 -->
        <main id="main-content" role="main" tabindex="-1">
          <NuxtPage />
        </main>

        <!-- 页脚 -->
        <footer class="bg-gray-900 dark:bg-gray-950 text-white transition-colors duration-300" role="contentinfo">
          <div class="max-w-6xl mx-auto px-6 py-12">
            <div class="grid md:grid-cols-4 gap-8">
              <!-- 品牌信息 -->
              <div class="md:col-span-2">
                <h2 class="text-2xl font-bold mb-4">TryUtils</h2>
                <p class="text-gray-300 mb-4 max-w-md">
                  {{ $t('footer.description') }}
                </p>
                <div class="flex space-x-4">
                  <!-- 社交媒体链接 -->
                  <a 
                    href="#" 
                    class="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md p-1"
                    :aria-label="$t('footer.socialMedia.github')"
                  >
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <!-- 快速链接 -->
              <div>
                <h3 class="text-lg font-semibold mb-4">{{ $t('footer.quickLinks') }}</h3>
                <nav class="space-y-2" :aria-label="$t('footer.quickLinksNav')">
                  <NuxtLink 
                    :to="localePath('/')" 
                    class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {{ $t('nav.home') }}
                  </NuxtLink>
                  <NuxtLink 
                    :to="localePath('/image-tools')" 
                    class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {{ $t('imageTools.title') }}
                  </NuxtLink>
                  <NuxtLink 
                    :to="localePath('/blog')" 
                    class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {{ $t('nav.blog') }}
                  </NuxtLink>
                  <NuxtLink 
                    :to="localePath('/about')" 
                    class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {{ $t('nav.about') }}
                  </NuxtLink>
                </nav>
              </div>
              
              <!-- 法律信息 -->
              <div>
                <h3 class="text-lg font-semibold mb-4">{{ $t('footer.legal') }}</h3>
                <nav class="space-y-2" :aria-label="$t('footer.legalNav')">
                  <NuxtLink 
                    :to="localePath('/privacy')" 
                    class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {{ $t('footer.privacy') }}
                  </NuxtLink>
                  <NuxtLink 
                    :to="localePath('/contact')" 
                    class="block text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                  >
                    {{ $t('nav.contact') }}
                  </NuxtLink>
                </nav>
              </div>
            </div>
            
            <!-- 版权信息 -->
            <div class="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {{ new Date().getFullYear() }} TryUtils. {{ $t('footer.copyright') }}</p>
            </div>
          </div>
        </footer>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// useI18n 只负责翻译和状态
const { t, locale } = useI18n()

// 路由功能需要从独立的函数获取
const switchLocalePath = useSwitchLocalePath() // 用于语言切换器
const localePath = useLocalePath()             // 用于模板中的链接
const route = useRoute()

// Performance optimization: Apply preload hints for critical resources
// Using useHead directly for preload hints (Nuxt's recommended approach)
useHead({
  link: [
    // Preload critical font stylesheet
    {
      rel: 'preload',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      as: 'style'
    },
    // Preconnect to font server for faster font loading
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous'
    }
  ]
})

// 检查是否为首页或需要显示面包屑的页面
const isHomePage = computed(() => {
  return route.path === '/' || route.path === '/en' || route.path === '/zh'
})

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
// const route = useRoute() // 已在上面声明，移除重复声明

// 设置全局页面配置
useHead({
  titleTemplate: '%s',
  htmlAttrs: {
    lang: () => locale.value === 'zh' ? 'zh-CN' : 'en-US'
  },
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
      innerHTML: () => JSON.stringify({
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