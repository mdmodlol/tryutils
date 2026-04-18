<script setup lang="ts">
import { useBlogArticleMeta } from '~/composables/useBlogArticleMeta'
import { normalizeBlogLinkage, resolveBlogFaqItems } from '~/composables/useBlogLinkage'
import type { BreadcrumbItem } from '~/composables/useBreadcrumbSchema'
import { getToolById } from '~/data/toolConfig'
import { getContentBlogPathFromPublicPath } from '~/utils/blog-paths'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const currentLocale = computed<'zh' | 'en'>(() => (locale.value === 'en' ? 'en' : 'zh'))

const createArticleError = (articleError?: Partial<Error & { statusCode?: number; statusMessage?: string }>) =>
  createError({
    statusCode: articleError?.statusCode || 404,
    statusMessage: articleError?.statusMessage || 'Article not found',
    fatal: true
  })

const articlePublicPath = computed(() => {
  const slug = route.params.slug
  const articlePath = Array.isArray(slug) ? slug.join('/') : slug || ''
  const basePath = `/blog/${articlePath}`
  return currentLocale.value === 'en' ? `/en${basePath}` : basePath
})

const { data, pending, error } = await useAsyncData('blog-article', async () => {
  const contentPath = getContentBlogPathFromPublicPath(articlePublicPath.value, currentLocale.value)
  const article = await queryContent(contentPath).findOne()

  if (!article) {
    throw createArticleError()
  }

  return article
}, {
  watch: [locale, () => route.fullPath]
})

if (error.value) {
  throw createArticleError(error.value)
}

const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = [
    { name: t('seo.breadcrumb.home'), path: '/' },
    { name: t('seo.breadcrumb.blog'), path: '/blog' }
  ]

  if (data.value?.title) {
    items.push({ name: data.value.title, path: route.path })
  }

  return items
})

const mainlineBlogLinkage = computed(() => {
  if (!data.value) {
    return null
  }

  return normalizeBlogLinkage(data.value, {
    locale: currentLocale.value,
    publicPath: articlePublicPath.value,
  })
})

const relatedToolIds = computed<string[]>(() => {
  if (mainlineBlogLinkage.value) {
    return mainlineBlogLinkage.value.relatedTools
  }

  return Array.isArray(data.value?.relatedTools) ? data.value.relatedTools : []
})

const primaryRelatedTool = computed(() => {
  const primaryToolId = relatedToolIds.value[0]
  return primaryToolId ? getToolById(primaryToolId) : undefined
})

const primaryToolPath = computed(() => primaryRelatedTool.value?.path || '/blog')

const articleCtaText = computed(() => {
  switch (primaryRelatedTool.value?.id) {
    case 'heic-converter':
      return currentLocale.value === 'en'
        ? 'Need to open or convert HEIC files right now? Use our free browser-based HEIC converter.'
        : '现在就要打开或转换 HEIC 文件？试试我们的免费浏览器版 HEIC 转换工具。'
    case 'image-format-converter':
      return currentLocale.value === 'en'
        ? 'Need a different output format? Convert images to JPG, PNG, WebP, GIF, AVIF, and more.'
        : '需要转换成其他格式？可以继续转成 JPG、PNG、WebP、GIF、AVIF 等常见格式。'
    case 'image-compressor':
      return currentLocale.value === 'en'
        ? 'Ready to compress your images after reading? Try the free image compressor in your browser.'
        : '看完后想直接压缩图片？可以马上体验浏览器里的免费图片压缩工具。'
    default:
      return currentLocale.value === 'en'
        ? 'Try the related free tool to put these steps into practice.'
        : '试试下面的免费相关工具，把这篇文章里的方法直接用起来。'
  }
})

const articleCtaButtonLabel = computed(() => {
  switch (primaryRelatedTool.value?.id) {
    case 'heic-converter':
      return currentLocale.value === 'en' ? 'Open HEIC Converter' : '打开 HEIC 转换器'
    case 'image-format-converter':
      return currentLocale.value === 'en' ? 'Open Format Converter' : '打开格式转换器'
    case 'image-compressor':
      return currentLocale.value === 'en' ? 'Open Image Compressor' : '打开图片压缩器'
    default:
      return currentLocale.value === 'en' ? 'Open Free Tool' : '打开免费工具'
  }
})

const formatDate = (date: string | Date | undefined) => {
  if (!date) return ''

  const localeCode = currentLocale.value === 'en' ? 'en-US' : 'zh-CN'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  try {
    return new Date(date).toLocaleDateString(localeCode, options)
  } catch {
    return new Date(date).toLocaleDateString('en-US', options)
  }
}

const shareArticle = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert(t('blog.article.linkCopied'))
  } catch (err) {
    console.error('Failed to copy article link:', err)
  }
}

const articleMeta = computed(() => ({
  title: data.value?.title || '',
  description: data.value?.description || '',
  date: data.value?.date || new Date().toISOString(),
  author: data.value?.author || 'TryUtils',
  keywords: data.value?.keywords || data.value?.tags || [],
  locale: currentLocale.value
}))

const articleFaqItems = computed(() => {
  if (!mainlineBlogLinkage.value) {
    return []
  }

  return resolveBlogFaqItems(mainlineBlogLinkage.value, currentLocale.value)
})

useBlogArticleMeta(articleMeta)
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-950"
    >
      {{ t('accessibility.skipToMain') }}
    </a>

    <main id="main-content" class="py-8" role="main">
      <div class="mx-auto max-w-4xl px-6">
        <BreadcrumbNav v-if="data && !pending" :items="breadcrumbItems" :generate-schema="true" />

        <Transition name="fade" mode="out-in">
          <div v-if="pending" key="loading" class="flex min-h-[280px] items-center justify-center" role="status" aria-live="polite">
            <div class="text-center">
              <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600"/>
              <p class="text-slate-600 dark:text-slate-300">{{ $t('blog.loading') }}</p>
            </div>
          </div>

          <div v-else-if="error" key="error" class="py-16 text-center" role="alert">
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400">
              <Icon name="heroicons:exclamation-triangle" class="h-8 w-8" aria-hidden="true" />
            </div>
            <h1 class="text-2xl font-semibold text-slate-950 dark:text-slate-50">{{ $t('blog.article.notFound.title') }}</h1>
            <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('blog.article.notFound.description') }}</p>
            <NuxtLink
              :to="localePath('/blog')"
              class="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              {{ $t('blog.article.backToBlog') }}
            </NuxtLink>
          </div>

          <article
            v-else-if="data"
            key="content"
            class="overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none"
            itemscope
            itemtype="https://schema.org/Article"
          >
            <header class="border-b border-slate-200/80 px-8 py-10 dark:border-slate-800">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                {{ $t('nav.blog') }}
              </p>
              <h1 class="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-4xl" itemprop="headline">
                {{ data?.title }}
              </h1>
              <p class="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300" itemprop="description">
                {{ data?.description }}
              </p>

              <div class="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <time :datetime="data?.date" itemprop="datePublished" class="inline-flex items-center">
                  <Icon name="heroicons:calendar-days" class="mr-2 h-4 w-4" aria-hidden="true" />
                  {{ formatDate(data?.date) }}
                </time>

                <div v-if="data?.tags?.length" class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in data.tags"
                    :key="tag"
                    class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
                    itemprop="keywords"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </header>

            <div class="prose prose-slate max-w-none px-8 py-10 dark:prose-invert" itemprop="articleBody">
              <ContentRenderer :value="data" />
            </div>

            <BlogCTA
              v-if="mainlineBlogLinkage"
              :variant="mainlineBlogLinkage.ctaVariant"
              :primary-tool="mainlineBlogLinkage.primaryTool"
            />

            <div
              v-else-if="relatedToolIds.length > 0"
              class="border-t border-slate-200/80 bg-slate-50/80 px-8 py-8 dark:border-slate-800 dark:bg-slate-950/70"
            >
              <p class="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{{ articleCtaText }}</p>
              <NuxtLink
                :to="localePath(primaryToolPath)"
                class="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              >
                {{ articleCtaButtonLabel }}
                <Icon name="heroicons:arrow-right" class="h-4 w-4" aria-hidden="true" />
              </NuxtLink>
            </div>
          </article>
        </Transition>

        <RelatedContent
          v-if="!pending && data && relatedToolIds.length > 0"
          type="tools"
          :related-tool-ids="relatedToolIds"
          :limit="3"
        />

        <FAQ
          v-if="!pending && data && articleFaqItems.length > 0"
          :items="articleFaqItems"
          :generate-schema="true"
        />

        <div
          v-if="!pending && data"
          class="mt-8 flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white/95 px-8 py-6 text-sm shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none md:flex-row md:items-center md:justify-between"
        >
          <NuxtLink
            :to="localePath('/blog')"
            class="inline-flex items-center gap-2 text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-50"
          >
            <Icon name="heroicons:arrow-left" class="h-4 w-4" aria-hidden="true" />
            {{ $t('blog.article.backToBlog') }}
          </NuxtLink>

          <button
            class="inline-flex items-center gap-2 text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-slate-50"
            type="button"
            @click="shareArticle"
          >
            <Icon name="heroicons:square-2-stack" class="h-4 w-4" aria-hidden="true" />
            {{ $t('blog.article.copyLink') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
