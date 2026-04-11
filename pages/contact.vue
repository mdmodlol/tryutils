<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const seoConfig = computed(() => ({
  title: t('contact.meta.title'),
  description: t('contact.meta.description'),
  keywords: t('contact.meta.keywords'),
  ogTitle: t('contact.meta.title'),
  ogDescription: t('contact.meta.description'),
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
    name: t('contact.meta.title'),
    description: t('contact.meta.description')
  })
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300" itemscope itemtype="https://schema.org/ContactPage">
    <main class="pb-16" role="main">
      <section class="border-b border-slate-200/80 dark:border-slate-800/80">
        <div class="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
            {{ $t('contact.sectionLabel') }}
          </p>
          <h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl" itemprop="headline">
            {{ $t('contact.hero.title') }}
          </h1>
          <p class="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300" itemprop="description">
            {{ $t('contact.hero.description') }}
          </p>
        </div>
      </section>

      <section class="mx-auto max-w-5xl space-y-6 px-6 py-10 lg:py-14">
        <div class="grid gap-6 md:grid-cols-2">
          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('contact.email.title') }}</p>
            <h2 class="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{{ $t('contact.email.description') }}</h2>
            <a
              href="mailto:support@tryutils.com"
              class="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              support@tryutils.com
              <Icon name="heroicons:arrow-up-right" class="h-4 w-4" aria-hidden="true" />
            </a>
          </article>

          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('contact.social.title') }}</p>
            <h2 class="mt-3 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">{{ $t('contact.social.description') }}</h2>
            <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{{ $t('contact.social.comingSoon') }}</p>
            <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">Telegram / Twitter / GitHub</p>
          </article>
        </div>

        <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('contact.types.title') }}</p>
          <div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <h2 class="text-base font-semibold text-slate-950 dark:text-slate-50">{{ $t('contact.types.suggestion.title') }}</h2>
              <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('contact.types.suggestion.description') }}</p>
            </div>
            <div class="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <h2 class="text-base font-semibold text-slate-950 dark:text-slate-50">{{ $t('contact.types.feedback.title') }}</h2>
              <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('contact.types.feedback.description') }}</p>
            </div>
            <div class="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <h2 class="text-base font-semibold text-slate-950 dark:text-slate-50">{{ $t('contact.types.business.title') }}</h2>
              <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('contact.types.business.description') }}</p>
            </div>
            <div class="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70">
              <h2 class="text-base font-semibold text-slate-950 dark:text-slate-50">{{ $t('contact.types.help.title') }}</h2>
              <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('contact.types.help.description') }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('contact.beforeContact.title') }}</p>
          <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{{ $t('contact.beforeContact.description') }}</p>
          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink
              :to="localePath('/about')"
              class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-50"
            >
              {{ $t('nav.about') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/privacy')"
              class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-slate-50"
            >
              {{ $t('contact.beforeContact.privacy') }}
            </NuxtLink>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>
