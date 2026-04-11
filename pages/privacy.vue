<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('privacy.meta.title'),
  meta: [
    { name: 'description', content: t('privacy.meta.description') },
    { name: 'keywords', content: t('privacy.meta.keywords') }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <main class="pb-16" role="main">
      <section class="border-b border-slate-200/80 dark:border-slate-800/80">
        <div class="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
            {{ $t('privacy.sectionLabel') }}
          </p>
          <h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl">
            {{ $t('privacy.hero.title') }}
          </h1>
          <p class="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {{ $t('privacy.hero.description') }}
          </p>
          <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">{{ $t('privacy.hero.lastUpdated') }}</p>
        </div>
      </section>

      <section class="mx-auto max-w-5xl space-y-6 px-6 py-10 lg:py-14">
        <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('privacy.intro.title') }}</p>
          <p class="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">{{ $t('privacy.intro.description') }}</p>
        </article>

        <div class="grid gap-6 md:grid-cols-2">
          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('privacy.collection.title') }}</p>
            <ul class="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>{{ $t('privacy.collection.point1') }}</li>
              <li>{{ $t('privacy.collection.point2') }}</li>
              <li>{{ $t('privacy.collection.point3') }}</li>
            </ul>
          </article>

          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ $t('privacy.usage.title') }}</p>
            <ul class="mt-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <li>{{ $t('privacy.usage.point1') }}</li>
              <li>{{ $t('privacy.usage.point2') }}</li>
            </ul>
          </article>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">{{ $t('privacy.cookies.title') }}</h2>
            <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('privacy.cookies.description') }}</p>
          </article>

          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">{{ $t('privacy.ads.title') }}</h2>
            <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('privacy.ads.description') }}</p>
          </article>

          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">{{ $t('privacy.security.title') }}</h2>
            <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('privacy.security.description') }}</p>
          </article>

          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">{{ $t('privacy.rights.title') }}</h2>
            <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('privacy.rights.description') }}</p>
          </article>
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">{{ $t('privacy.updates.title') }}</h2>
            <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('privacy.updates.description') }}</p>
          </article>

          <article class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
            <h2 class="text-xl font-semibold text-slate-950 dark:text-slate-50">{{ $t('privacy.contact.title') }}</h2>
            <p class="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ $t('privacy.contact.description') }}</p>
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
