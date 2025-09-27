<template>
  <article class="card p-8 hover:scale-[1.02] transition-all duration-300 group" itemscope itemtype="https://schema.org/BlogPosting">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors" itemprop="headline">
          <NuxtLink 
            :to="articlePath" 
            class="hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
            :aria-label="`阅读文章: ${article.title}`"
          >
            {{ article.title }}
          </NuxtLink>
        </h2>
        <p class="text-gray-600 mb-4 leading-relaxed line-clamp-3" itemprop="description">
          {{ article.description }}
        </p>
        
        <!-- 标签 -->
        <div class="flex flex-wrap gap-2 mb-4" role="list" aria-label="文章标签">
          <BlogTag
            v-for="tag in article.tags"
            :key="tag"
            :tag="tag"
            @click="$emit('tagClick', tag)"
            role="listitem"
          />
        </div>
      </div>
    </div>
    
    <!-- 文章元信息 -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <time 
        class="text-sm text-gray-500 flex items-center" 
        :datetime="article.date"
        itemprop="datePublished"
        :aria-label="`发布日期: ${formatDate(article.date)}`"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        {{ formatDate(article.date) }}
      </time>
      <NuxtLink 
        :to="articlePath"
        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        :aria-label="`阅读完整文章: ${article.title}`"
      >
        {{ $t('blog.card.readMore') }}
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </NuxtLink>
    </div>
    
    <!-- 隐藏的结构化数据 -->
    <meta itemprop="author" :content="article.author || 'TryUtils'">
    <meta itemprop="dateModified" :content="article.updatedAt || article.date">
    <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization" style="display: none;">
      <meta itemprop="name" content="TryUtils">
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

defineEmits(['tagClick'])

const { locale } = useI18n()
const localePath = useLocalePath()

// 计算正确的文章路径
const articlePath = computed(() => {
  if (!props.article?._path) return ''
  let path = props.article._path
  
  // 移除现有的语言后缀
  if (path.endsWith('.en')) {
    path = path.replace('.en', '')
  }
  
  // 根据当前语言添加正确的后缀
  if (locale.value === 'en') {
    path = path + '.en'
  }
  
  return localePath(path)
})

// 日期格式化函数
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>