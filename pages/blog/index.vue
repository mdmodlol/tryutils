<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <div class="fade-in">
          <h1 class="text-5xl md:text-6xl font-bold text-gradient mb-6">
            {{ $t('blog.hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ $t('blog.hero.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- 博客文章列表 -->
    <main class="pb-16">
      <div class="max-w-4xl mx-auto px-6">
        <div class="slide-up">
          <!-- 搜索和筛选 -->
          <BlogSearch
            v-model:search-query="searchQuery"
            v-model:selected-tag="selectedTag"
            :tags="allTags"
            :result-count="filteredArticles.length"
          />
          
          <!-- 文章网格 -->
          <div v-if="pending" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-600">{{ $t('blog.loading') }}</p>
          </div>

          <div v-else-if="filteredArticles && filteredArticles.length > 0" class="space-y-8">
            <BlogCard
              v-for="article in filteredArticles"
              :key="article._path"
              :article="article"
              @tag-click="handleTagClick"
            />
          </div>

          <!-- 暂无文章 -->
          <div v-else class="text-center py-16">
            <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('blog.noArticles.title') }}</h3>
            <p class="text-gray-600">{{ $t('blog.noArticles.description') }}</p>
          </div>

          <!-- 分类导航 -->
          <div class="mt-16">
            <h3 class="text-2xl font-bold text-gray-900 mb-8 text-center">{{ $t('blog.categories.title') }}</h3>
            <div class="grid md:grid-cols-3 gap-6">
              <NuxtLink to="/blog/HeicConverter/what-is-heic-format" class="card p-6 text-center hover:scale-105 transition-transform duration-300">
                <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('blog.categories.heic.title') }}</h4>
                <p class="text-gray-600 text-sm">{{ $t('blog.categories.heic.description') }}</p>
              </NuxtLink>

              <div class="card p-6 text-center opacity-50">
                <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-700 mb-2">{{ $t('blog.categories.document.title') }}</h4>
                <p class="text-gray-500 text-sm">{{ $t('blog.categories.comingSoon') }}</p>
              </div>

              <div class="card p-6 text-center opacity-50">
                <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-700 mb-2">{{ $t('blog.categories.tips.title') }}</h4>
                <p class="text-gray-500 text-sm">{{ $t('blog.categories.comingSoon') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const localePath = useLocalePath()

// 获取博客文章数据，根据当前语言过滤
const { data: articles, pending, error } = await useAsyncData('blog-articles', () => {
  return queryContent('blog').find().then(allArticles => {
    // 根据当前语言过滤文章
    return allArticles.filter(article => {
      const articleLang = article._path.endsWith('.en') ? 'en' : 'zh'
      return articleLang === locale.value
    })
  })
}, {
  // 当语言切换时重新获取数据
  watch: [locale]
})

// 获取所有标签
const allTags = computed(() => {
  if (!articles.value) return []
  const tags = new Set()
  articles.value.forEach(article => {
    if (article.tags) {
      article.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags)
})

// 搜索和筛选状态
const searchQuery = ref('')
const selectedTag = ref('')

// 筛选后的文章
const filteredArticles = computed(() => {
  if (!articles.value) return []
  
  return articles.value.filter(article => {
    const matchesSearch = !searchQuery.value || 
      article.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesTag = !selectedTag.value || 
      (article.tags && article.tags.includes(selectedTag.value))
    
    return matchesSearch && matchesTag
 })
})

// 处理标签点击
const handleTagClick = (tag) => {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}

// 日期格式化函数
const formatDate = (date) => {
  if (!date) return ''
  const localeCode = locale.value === 'en' ? 'en-US' : 'zh-CN'
  return new Date(date).toLocaleDateString(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 设置页面SEO
useHead({
  title: t('blog.meta.title'),
  meta: [
    { name: 'description', content: t('blog.meta.description') },
    { name: 'keywords', content: t('blog.meta.keywords') }
  ]
})
</script>