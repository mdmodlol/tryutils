<template>
  <article class="grid gap-5 px-6 py-6 md:grid-cols-[minmax(0,1fr)_auto]" itemscope itemtype="https://schema.org/BlogPosting">
    <div class="space-y-4">
      <div class="space-y-3">
        <h2 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50" itemprop="headline">
          <NuxtLink
            :to="articlePath"
            class="transition hover:text-teal-700 dark:hover:text-teal-300"
            :aria-label="$t('accessibility.readFullArticle', { title: article.title })"
          >
            {{ article.title }}
          </NuxtLink>
        </h2>

        <p class="line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300" itemprop="description">
          {{ article.description }}
        </p>
      </div>

      <div class="flex flex-wrap gap-2" role="list" :aria-label="$t('accessibility.articleTags')">
        <BlogTag
          v-for="tag in article.tags"
          :key="tag"
          :tag="tag"
          role="listitem"
          @click="$emit('tagClick', tag)"
        />
      </div>

      <time
        class="inline-flex items-center text-sm text-slate-500 dark:text-slate-400"
        :datetime="article.date"
        itemprop="datePublished"
      >
        <Icon name="heroicons:calendar-days" class="mr-2 h-4 w-4" aria-hidden="true" />
        {{ formatDate(article.date) }}
      </time>
    </div>

    <div class="flex items-start md:items-center">
      <NuxtLink
        :to="articlePath"
        class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-50"
      >
        {{ $t('blog.card.readMore') }}
        <Icon name="heroicons:arrow-right" class="h-4 w-4" aria-hidden="true" />
      </NuxtLink>
    </div>

    <meta itemprop="author" :content="article.author || 'TryUtils'">
    <meta itemprop="dateModified" :content="article.updatedAt || article.date">
    <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization" class="hidden">
      <meta itemprop="name" content="TryUtils">
    </div>
  </article>
</template>

<script setup>
import { getPublicBlogPathFromContentPath } from '~/utils/blog-paths'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

defineEmits(['tagClick'])

const { locale } = useI18n()

const articlePath = computed(() => {
  if (!props.article?._path) return ''
  return getPublicBlogPathFromContentPath(props.article._path, locale.value === 'en' ? 'en' : 'zh')
})

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
