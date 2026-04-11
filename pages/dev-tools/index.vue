<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const seoConfig = computed(() => ({
  title: t('devTools.seo.title'),
  description: t('devTools.seo.description'),
  keywords: t('devTools.seo.keywords'),
  ogTitle: t('devTools.seo.title'),
  ogDescription: t('devTools.seo.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

const tools = computed(() => [
  {
    name: t('nav.jsonFormatter'),
    description: t('home.categories.devTools.jsonFormatter.description'),
    path: '/json-formatter',
    icon: 'heroicons:code-bracket',
    tags: [t('devTools.tags.format'), t('devTools.tags.validate'), t('devTools.tags.minify')]
  },
  {
    name: t('nav.base64Codec'),
    description: t('home.categories.devTools.base64Codec.description'),
    path: '/base64-codec',
    icon: 'heroicons:lock-closed',
    tags: [t('devTools.tags.encode'), t('devTools.tags.decode'), t('devTools.tags.files')]
  },
  {
    name: t('nav.colorConverter'),
    description: t('home.categories.devTools.colorConverter.description'),
    path: '/color-converter',
    icon: 'heroicons:swatch',
    tags: ['HEX', 'RGB', 'HSL']
  },
  {
    name: t('nav.textDiff'),
    description: t('home.categories.devTools.textDiff.description'),
    path: '/text-diff',
    icon: 'heroicons:document-duplicate',
    tags: [t('devTools.tags.compare'), t('devTools.tags.review'), t('devTools.tags.changes')]
  },
  {
    name: t('nav.urlCodec'),
    description: t('home.categories.devTools.urlCodec.description'),
    path: '/url-codec',
    icon: 'heroicons:link',
    tags: ['URI', t('devTools.tags.encode'), t('devTools.tags.decode')]
  },
  {
    name: t('nav.markdownPreview'),
    description: t('home.categories.devTools.markdownPreview.description'),
    path: '/markdown-preview',
    icon: 'heroicons:document-text',
    tags: [t('devTools.tags.preview'), 'HTML', t('devTools.tags.export')]
  }
])

const focusPoints = computed(() => [
  {
    title: t('home.features.privacy.title'),
    description: t('home.features.privacy.description')
  },
  {
    title: t('home.features.fast.title'),
    description: t('home.features.fast.description')
  },
  {
    title: t('devTools.title'),
    description: t('devTools.description')
  }
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950" itemscope itemtype="https://schema.org/WebPage">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-950"
    >
      {{ t('accessibility.skipToMain') }}
    </a>

    <main id="main-content" role="main">
      <section class="border-b border-slate-200/80 dark:border-slate-800/80">
        <div class="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)] lg:py-16">
          <div class="space-y-5">
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
              {{ t('home.categories.devTools.title') }}
            </p>
            <h1 class="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl" itemprop="name">
              {{ t('devTools.title') }}
            </h1>
            <p class="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300" itemprop="description">
              {{ t('devTools.description') }}
            </p>
          </div>

          <aside class="rounded-[28px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/88 dark:shadow-none">
            <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {{ t('devTools.sectionLabels.utilityLayer') }}
            </p>
            <ul class="space-y-4">
              <li v-for="point in focusPoints" :key="point.title" class="border-t border-slate-200/80 pt-4 first:border-0 first:pt-0 dark:border-slate-800">
                <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ point.title }}</h2>
                <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{ point.description }}</p>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      <section class="mx-auto max-w-6xl px-6 py-10 lg:py-14" aria-labelledby="tool-directory-title">
        <div class="mb-8">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            {{ t('devTools.sectionLabels.browserUtilities') }}
          </p>
          <h2 id="tool-directory-title" class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {{ t('home.categories.devTools.description') }}
          </h2>
        </div>

        <div class="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <div class="divide-y divide-slate-200/80 dark:divide-slate-800">
            <article
              v-for="tool in tools"
              :key="tool.path"
              class="grid gap-6 px-6 py-6 transition hover:bg-slate-50/80 dark:hover:bg-slate-900/70 md:grid-cols-[72px_minmax(0,1fr)_auto] md:items-center"
              itemscope
              itemtype="https://schema.org/SoftwareApplication"
            >
              <div class="flex h-14 w-14 items-center justify-center rounded-[20px] bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Icon :name="tool.icon" class="h-7 w-7" aria-hidden="true" />
              </div>

              <div class="space-y-3">
                <div>
                  <h3 class="text-xl font-semibold text-slate-950 dark:text-slate-50" itemprop="name">
                    {{ tool.name }}
                  </h3>
                  <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300" itemprop="description">
                    {{ tool.description }}
                  </p>
                </div>

                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in tool.tags"
                    :key="tag"
                    class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <NuxtLink
                :to="localePath(tool.path)"
                class="inline-flex items-center gap-2 self-start rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white md:self-center"
                :aria-label="t('accessibility.useToolAriaLabel', { tool: tool.name })"
              >
                {{ t('common.startUsing') }}
                <Icon name="heroicons:arrow-right" class="h-4 w-4" aria-hidden="true" />
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
