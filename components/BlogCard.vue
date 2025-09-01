<template>
  <article class="card p-8 hover:scale-[1.02] transition-all duration-300 group">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          <NuxtLink :to="article._path" class="hover:underline">
            {{ article.title }}
          </NuxtLink>
        </h2>
        <p class="text-gray-600 mb-4 leading-relaxed line-clamp-3">
          {{ article.description }}
        </p>
        
        <!-- 标签 -->
        <div class="flex flex-wrap gap-2 mb-4">
          <BlogTag
            v-for="tag in article.tags"
            :key="tag"
            :tag="tag"
            @click="$emit('tagClick', tag)"
          />
        </div>
      </div>
    </div>
    
    <!-- 文章元信息 -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
      <time class="text-sm text-gray-500 flex items-center">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        {{ formatDate(article.date) }}
      </time>
      <NuxtLink 
        :to="article._path"
        class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        阅读更多
        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  }
})

defineEmits(['tagClick'])

// 日期格式化函数
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('zh-CN', {
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