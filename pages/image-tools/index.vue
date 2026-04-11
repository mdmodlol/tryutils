<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const seoConfig = computed(() => ({
  title: t('imageTools.seo.title'),
  description: t('imageTools.seo.description'),
  keywords: t('imageTools.seo.keywords'),
  ogTitle: t('imageTools.seo.title'),
  ogDescription: t('imageTools.seo.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

const tools = computed(() => [
  {
    name: t('nav.imageCompressor'),
    description: t('home.categories.imageTools.compressor.description'),
    path: '/image-compressor',
    icon: 'heroicons:arrows-pointing-in',
    tags: ['JPG', 'PNG', 'WebP']
  },
  {
    name: t('nav.formatConverter'),
    description: t('home.categories.imageTools.converter.description'),
    path: '/image-format-converter',
    icon: 'heroicons:arrow-path',
    tags: ['JPEG', 'AVIF', 'TIFF']
  },
  {
    name: t('nav.heicConverter'),
    description: t('heicConverter.hero.subtitle'),
    path: '/heic-converter',
    icon: 'heroicons:device-phone-mobile',
    tags: ['HEIC', 'JPG', 'PNG']
  },
  {
    name: t('nav.qrCodeGenerator'),
    description: t('qrCodeGenerator.hero.subtitle'),
    path: '/qr-code-generator',
    icon: 'heroicons:qr-code',
    tags: [t('imageTools.tags.batch'), t('imageTools.tags.logo'), t('imageTools.tags.download')]
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
    title: t('imageTools.title'),
    description: t('imageTools.description')
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
              {{ t('home.categories.imageTools.title') }}
            </p>
            <h1 class="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl" itemprop="name">
              {{ t('imageTools.title') }}
            </h1>
            <p class="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300" itemprop="description">
              {{ t('imageTools.description') }}
            </p>
          </div>

          <aside class="rounded-[28px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/88 dark:shadow-none">
            <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {{ t('imageTools.sectionLabels.workflow') }}
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
        <div class="mb-8 flex items-end justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {{ t('imageTools.sectionLabels.directory') }}
            </p>
            <h2 id="tool-directory-title" class="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {{ t('home.categories.subtitle') }}
            </h2>
          </div>
          <NuxtLink
            :to="localePath('/')"
            class="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-slate-50 md:inline-flex"
          >
            TryUtils
          </NuxtLink>
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
