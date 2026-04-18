<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()

const seoConfig = computed(() => ({
  title: t('blog.seo.title'),
  description: t('blog.seo.description'),
  keywords: t('blog.seo.keywords'),
  ogTitle: t('blog.seo.title'),
  ogDescription: t('blog.seo.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

const { data: articles, pending } = await useAsyncData('blog-articles', () => {
  const currentLocale = locale.value
  if (currentLocale === 'en') {
    return queryContent('/blog').where({ _path: { $regex: /\.en$/ } }).sort({ date: -1 }).find()
  }
  return queryContent('/blog').where({ _path: { $not: { $regex: /\.en$/ } } }).sort({ date: -1 }).find()
}, {
  watch: [locale]
})

const searchQuery = ref('')
const selectedTag = ref('')

const allTags = computed(() => {
  if (!articles.value) return []
  const tags = new Set<string>()
  articles.value.forEach(article => {
    if (article.tags) {
      article.tags.forEach((tag: string) => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
})

const filteredArticles = computed(() => {
  if (!articles.value) return []

  return articles.value.filter(article => {
    const matchesSearch = !searchQuery.value
      || article.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
      || article.description?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesTag = !selectedTag.value || (article.tags && article.tags.includes(selectedTag.value))
    return matchesSearch && matchesTag
  })
})

const handleTagClick = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}

const { getOrganizationSchema, getWebPageSchema, setStructuredData } = useStructuredData()

setStructuredData([
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('blog.seo.title'),
    description: t('blog.seo.description')
  })
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-950"
    >
      {{ t('accessibility.skipToMain') }}
    </a>

    <main id="main-content" class="pb-16" role="main">
      <section class="border-b border-slate-200/80 dark:border-slate-800/80">
        <div class="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:py-16">
          <div class="space-y-5">
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
              {{ t('blog.sectionLabels.editorial') }}
            </p>
            <h1 class="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl">
              {{ t('blog.hero.title') }}
            </h1>
            <p class="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {{ t('blog.hero.description') }}
            </p>
          </div>

          <aside class="rounded-[28px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/88 dark:shadow-none">
            <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {{ t('blog.sectionLabels.readingFocus') }}
            </p>
            <ul class="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>{{ t('blog.seo.description') }}</li>
              <li>{{ t('home.features.privacy.description') }}</li>
              <li>{{ t('home.categories.imageTools.description') }}</li>
            </ul>
          </aside>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 py-10 lg:py-14">
        <div class="rounded-[30px] border border-slate-200/80 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <BlogSearch
            v-model:search-query="searchQuery"
            v-model:selected-tag="selectedTag"
            :tags="allTags"
            :result-count="filteredArticles.length"
          />

          <div v-if="pending" class="flex min-h-[240px] items-center justify-center" role="status" aria-live="polite">
            <div class="text-center">
              <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600"/>
              <p class="text-slate-600 dark:text-slate-300">{{ $t('blog.loading') }}</p>
            </div>
          </div>

          <div
            v-else-if="filteredArticles && filteredArticles.length > 0"
            class="mt-6 overflow-hidden rounded-[24px] border border-slate-200/80 dark:border-slate-800"
            role="list"
          >
            <div class="divide-y divide-slate-200/80 dark:divide-slate-800">
              <BlogCard
                v-for="article in filteredArticles"
                :key="article._path"
                :article="article"
                role="listitem"
                @tag-click="handleTagClick"
              />
            </div>
          </div>

          <div v-else class="py-16 text-center" role="status" aria-live="polite">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              <Icon name="heroicons:document-text" class="h-8 w-8" aria-hidden="true" />
            </div>
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">{{ $t('blog.noArticles.title') }}</h2>
            <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('blog.noArticles.description') }}</p>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6">
        <div class="grid gap-6 md:grid-cols-3">
          <NuxtLink
            :to="localePath('/blog/heicconverter/what-is-heic-format')"
            class="rounded-[28px] border border-slate-200/80 bg-white/95 p-6 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 dark:hover:bg-slate-900"
          >
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              {{ $t('blog.categories.heic.title') }}
            </p>
            <h2 class="mt-4 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {{ $t('blog.categories.heic.description') }}
            </h2>
          </NuxtLink>

          <div class="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-slate-900/70">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {{ $t('blog.categories.document.title') }}
            </p>
            <h2 class="mt-4 text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              {{ $t('blog.categories.comingSoon') }}
            </h2>
          </div>

          <div class="rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-slate-900/70">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {{ $t('blog.categories.tips.title') }}
            </p>
            <h2 class="mt-4 text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              {{ $t('blog.categories.comingSoon') }}
            </h2>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
