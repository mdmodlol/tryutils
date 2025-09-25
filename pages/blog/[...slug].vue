<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const nuxtApp = useNuxtApp()

// 获取文章数据，根据当前语言获取对应的文章
const { data, pending, error } = await useAsyncData('blog-article', () => {
  const slug = route.params.slug
  const articlePath = Array.isArray(slug) ? slug.join('/') : slug
  
  // 根据当前语言构建文章路径
  const langSuffix = locale.value === 'en' ? '.en' : ''
  const fullPath = `/blog/${articlePath}${langSuffix}`
  
  return queryContent(fullPath).findOne().catch(() => {
    // 如果找不到对应语言的文章，尝试获取默认语言版本
    const fallbackPath = locale.value === 'en' ? `/blog/${articlePath}` : `/blog/${articlePath}.en`
    return queryContent(fallbackPath).findOne()
  })
}, {
  // 当语言或路由参数变化时重新获取数据
  watch: [locale, () => route.params.slug],
  // 添加缓存和优化选项
  server: false, // 在客户端获取数据，避免服务端渲染延迟
  default: () => null, // 设置默认值避免闪现
  transform: (data) => data, // 保持数据原样
  getCachedData(key) {
    return nuxtApp.ssrContext?.cache?.[key] ?? nuxtApp.static.data[key]
  }
})

// 日期格式化函数
const formatDate = (date) => {
  if (!date) return ''
  const localeCode = locale.value === 'en' ? 'en-US' : 'zh-CN'
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  try {
    return new Date(date).toLocaleDateString(localeCode, options)
  } catch (error) {
    // Fallback to English if there's an error
    return new Date(date).toLocaleDateString('en-US', options)
  }
}

// 分享文章
const shareArticle = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    // 这里可以添加一个提示消息
    alert(t('blog.article.linkCopied'))
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 动态设置页面的 SEO 信息
watchEffect(() => {
  if (data.value) {
    useHead({
      title: `${data.value.title} - TryUtils`,
      meta: [
        { name: 'description', content: data.value.description },
        { name: 'keywords', content: data.value.tags?.join(', ') || '' },
        { property: 'og:title', content: `${data.value.title} - TryUtils` },
        { property: 'og:description', content: data.value.description },
        { property: 'og:type', content: 'article' },
        { property: 'article:published_time', content: data.value.date },
        { property: 'article:tag', content: data.value.tags?.join(', ') || '' }
      ]
    })
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 跳转到主要内容的链接 -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50">
      跳转到主要内容
    </a>

    <!-- 导航面包屑 -->
    <nav class="bg-white border-b border-gray-200" role="navigation" aria-label="面包屑导航">
      <div class="max-w-4xl mx-auto px-6 py-4">
        <ol class="flex items-center space-x-2 text-sm text-gray-600" role="list">
          <li role="listitem">
            <NuxtLink 
              :to="localePath('/')" 
              class="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
              :aria-label="`导航到${$t('nav.home')}`"
            >
              {{ $t('nav.home') }}
            </NuxtLink>
          </li>
          <li role="listitem" aria-hidden="true">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </li>
          <li role="listitem">
            <NuxtLink 
              :to="localePath('/blog')" 
              class="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
              :aria-label="`导航到${$t('nav.blog')}`"
            >
              {{ $t('nav.blog') }}
            </NuxtLink>
          </li>
          <li role="listitem" aria-hidden="true">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </li>
          <li role="listitem">
            <span class="text-gray-900" aria-current="page">{{ data?.title || $t('blog.article.detail') }}</span>
          </li>
        </ol>
      </div>
    </nav>

    <!-- 文章内容 -->
    <main class="py-8" id="main-content" role="main">
      <div class="max-w-4xl mx-auto px-6">
        <Transition name="fade" mode="out-in">
          <div v-if="pending" key="loading" class="text-center py-12" role="status" aria-live="polite">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" aria-hidden="true"></div>
            <p class="mt-4 text-gray-600">{{ $t('blog.loading') }}</p>
          </div>

          <div v-else-if="error" key="error" class="text-center py-12" role="alert">
            <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
              <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('blog.article.notFound.title') }}</h1>
            <p class="text-gray-600 mb-6">{{ $t('blog.article.notFound.description') }}</p>
            <NuxtLink 
              :to="localePath('/blog')" 
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :aria-label="`返回到${$t('nav.blog')}`"
            >
              {{ $t('blog.article.backToBlog') }}
            </NuxtLink>
          </div>

          <article v-else key="content" class="bg-white rounded-lg shadow-sm overflow-hidden" itemscope itemtype="https://schema.org/Article">
          <!-- 文章头部 -->
          <header class="px-8 py-8 border-b border-gray-100">
            <div class="text-center">
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight" itemprop="headline">
                {{ data?.title }}
              </h1>
              <p class="text-lg text-gray-600 mb-6 leading-relaxed" itemprop="description">
                {{ data?.description }}
              </p>
              
              <!-- 文章元信息 -->
              <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500" role="group" aria-label="文章信息">
                <time class="flex items-center" :datetime="data?.date" itemprop="datePublished">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span class="sr-only">发布日期：</span>
                  {{ formatDate(data?.date) }}
                </time>
                
                <!-- 标签 -->
                <div v-if="data?.tags && data.tags.length > 0" class="flex items-center flex-wrap gap-2" role="group" aria-label="文章标签">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  <span class="sr-only">标签：</span>
                  <span
                    v-for="tag in data.tags"
                    :key="tag"
                    class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    itemprop="keywords"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <!-- 文章正文 -->
          <div class="prose prose-lg max-w-none px-8 py-8" itemprop="articleBody" role="region" aria-labelledby="article-content">
            <h2 id="article-content" class="sr-only">文章内容</h2>
            <ContentRenderer :value="data" />
          </div>

          <!-- 文章底部 -->
          <footer class="px-8 py-6 bg-gray-50 border-t border-gray-100" role="contentinfo">
            <div class="flex items-center justify-between">
              <NuxtLink 
                :to="localePath('/blog')" 
                class="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
                :aria-label="`返回到${$t('nav.blog')}`"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                {{ $t('blog.article.backToBlog') }}
              </NuxtLink>
              
              <!-- 分享按钮 -->
              <div class="flex items-center space-x-3" role="group" aria-label="分享选项">
                <span class="text-sm text-gray-600">{{ $t('blog.article.share') }}:</span>
                <button 
                  @click="shareArticle"
                  class="p-2 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
                  :title="$t('blog.article.copyLink')"
                  :aria-label="$t('blog.article.copyLink')"
                  type="button"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </article>
        </Transition>
      </div>
    </main>
  </div>
</template>



<style>
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Prose 样式优化 */
.prose {
  @apply text-gray-800 leading-relaxed;
}

.prose h1 {
  @apply text-3xl font-bold text-gray-900 mt-8 mb-4;
}

.prose h2 {
  @apply text-2xl font-bold text-gray-900 mt-8 mb-4;
}

.prose h3 {
  @apply text-xl font-semibold text-gray-900 mt-6 mb-3;
}

.prose p {
  @apply mb-4 leading-relaxed;
}

.prose ul, .prose ol {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-2;
}

.prose blockquote {
  @apply border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6;
}

.prose code {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono;
}

.prose pre {
  @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6;
}

.prose pre code {
  @apply bg-transparent p-0;
}

.prose a {
  @apply text-blue-600 hover:text-blue-700 underline;
}

.prose img {
  @apply rounded-lg shadow-sm my-6;
}

.prose table {
  @apply w-full border-collapse border border-gray-300 my-6;
}

.prose th, .prose td {
  @apply border border-gray-300 px-4 py-2;
}

.prose th {
  @apply bg-gray-50 font-semibold;
}
</style>