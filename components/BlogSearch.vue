<template>
  <div class="mb-8 space-y-4" role="search" aria-label="博客搜索和筛选">
    <!-- 搜索框 -->
    <div class="relative">
      <label for="blog-search" class="sr-only">搜索博客文章</label>
      <input
        id="blog-search"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text"
        :placeholder="$t('blog.search.placeholder')"
        class="w-full px-4 py-3 pl-12 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        :aria-describedby="searchQuery || selectedTag ? 'search-results-info' : undefined"
        autocomplete="off"
        role="searchbox"
        :aria-expanded="false"
      >
      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      
      <!-- 清除按钮 -->
      <button
        v-if="searchQuery"
        @click="$emit('update:searchQuery', '')"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded"
        :aria-label="$t('blog.search.clearSearch')"
        type="button"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <!-- 标签筛选 -->
    <div class="flex flex-wrap gap-2" role="group" aria-labelledby="tag-filter-label">
      <h3 id="tag-filter-label" class="sr-only">按标签筛选</h3>
      <button
        @click="$emit('update:selectedTag', '')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          !selectedTag ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        type="button"
        :aria-pressed="!selectedTag"
        :aria-label="$t('blog.search.showAllPosts')"
      >
        {{ $t('blog.search.all') }}
      </button>
      <button
        v-for="tag in tags"
        :key="tag"
        @click="$emit('update:selectedTag', selectedTag === tag ? '' : tag)"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          selectedTag === tag ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        type="button"
        :aria-pressed="selectedTag === tag"
        :aria-label="`${selectedTag === tag ? '取消筛选' : '筛选'} ${tag} 标签`"
      >
        {{ tag }}
      </button>
    </div>
    
    <!-- 搜索结果统计 -->
    <div 
      v-if="searchQuery || selectedTag" 
      id="search-results-info"
      class="text-sm text-gray-600 dark:text-gray-400"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span v-if="resultCount !== undefined">
        {{ $t('blog.search.found', { count: resultCount }) }}
        <span v-if="searchQuery">{{ $t('blog.search.containing', { query: searchQuery }) }}</span>
        <span v-if="searchQuery && selectedTag"> {{ $t('blog.search.and') }}</span>
        <span v-if="selectedTag">{{ $t('blog.search.withTag', { tag: selectedTag }) }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedTag: {
    type: String,
    default: ''
  },
  tags: {
    type: Array,
    default: () => []
  },
  resultCount: {
    type: Number,
    default: undefined
  }
})

defineEmits(['update:searchQuery', 'update:selectedTag'])
</script>