<script setup lang="ts">
const { t } = useI18n()

const seoConfig = computed(() => ({
  title: t('about.seo.title'),
  description: t('about.seo.description'),
  keywords: t('about.seo.keywords'),
  ogTitle: t('about.seo.title'),
  ogDescription: t('about.seo.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

const { useStructuredData } = await import('~/composables/useStructuredData')
const {
  getOrganizationSchema,
  getWebPageSchema,
  setStructuredData
} = useStructuredData()

setStructuredData([
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('about.seo.title'),
    description: t('about.seo.description')
  })
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300" itemscope itemtype="https://schema.org/AboutPage">
    <main class="pb-16" role="main">
      <section class="border-b border-slate-200/80 dark:border-slate-800/80">
        <div class="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
            TryUtils
          </p>
          <h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl" itemprop="headline">
            {{ $t('about.hero.title') }}
          </h1>
          <p class="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300" itemprop="description">
            {{ $t('about.hero.description') }}
          </p>
        </div>
      </section>

      <section class="mx-auto max-w-5xl space-y-6 px-6 py-10 lg:py-14">
        <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('about.sectionLabels.mission') }}</p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{{ $t('about.mission.title') }}</h2>
          <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{{ $t('about.mission.description') }}</p>
        </article>

        <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('about.sectionLabels.story') }}</p>
          <h2 class="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{{ $t('about.story.title') }}</h2>
          <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{{ $t('about.story.paragraph1') }}</p>
          <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{{ $t('about.story.paragraph2') }}</p>
        </article>

        <div class="grid gap-6 md:grid-cols-2">
          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('about.sectionLabels.vision') }}</p>
            <h2 class="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{{ $t('about.vision.title') }}</h2>
            <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{{ $t('about.vision.description') }}</p>
          </article>

          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('about.sectionLabels.contact') }}</p>
            <h2 class="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{{ $t('about.contact.title') }}</h2>
            <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{{ $t('about.contact.description') }}</p>
            <a
              href="mailto:support@tryutils.com"
              class="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              support@tryutils.com
              <Icon name="heroicons:arrow-up-right" class="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
