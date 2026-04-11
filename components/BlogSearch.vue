<template>
  <div class="space-y-5" role="search" :aria-label="$t('accessibility.blogSearchAndFilter')">
    <div class="relative">
      <label for="blog-search" class="sr-only">{{ $t('accessibility.searchBlogArticles') }}</label>
      <input
        id="blog-search"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text"
        :placeholder="$t('blog.search.placeholder')"
        class="w-full rounded-[24px] border border-slate-200 bg-white px-5 py-4 pl-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-teal-400"
        :aria-describedby="searchQuery || selectedTag ? 'search-results-info' : undefined"
        autocomplete="off"
        role="searchbox"
      >
      <Icon name="heroicons:magnifying-glass" class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" aria-hidden="true" />

      <button
        v-if="searchQuery"
        @click="$emit('update:searchQuery', '')"
        class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
        :aria-label="$t('blog.search.clearSearch')"
        type="button"
      >
        <Icon name="heroicons:x-mark" class="h-4 w-4" aria-hidden="true" />
      </button>
    </div>

    <div class="flex flex-wrap gap-2" role="group" :aria-label="$t('accessibility.filterByTags')">
      <button
        @click="$emit('update:selectedTag', '')"
        :class="[
          'rounded-full border px-4 py-2 text-sm font-medium transition',
          !selectedTag
            ? 'border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950'
            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-50'
        ]"
        type="button"
        :aria-pressed="!selectedTag"
      >
        {{ $t('blog.search.all') }}
      </button>

      <button
        v-for="tag in tags"
        :key="tag"
        @click="$emit('update:selectedTag', selectedTag === tag ? '' : tag)"
        :class="[
          'rounded-full border px-4 py-2 text-sm font-medium transition',
          selectedTag === tag
            ? 'border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950'
            : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-50'
        ]"
        type="button"
        :aria-pressed="selectedTag === tag"
      >
        {{ tag }}
      </button>
    </div>

    <div
      v-if="searchQuery || selectedTag"
      id="search-results-info"
      class="text-sm text-slate-500 dark:text-slate-400"
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
