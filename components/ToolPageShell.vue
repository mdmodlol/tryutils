<script setup lang="ts">
interface BreadcrumbItem {
  name: string
  path: string
}

interface HeroBullet {
  icon: string
  label: string
}

interface Props {
  breadcrumbItems: BreadcrumbItem[]
  sectionLabel: string
  title: string
  description: string
  bullets?: HeroBullet[]
  workspaceLabel?: string
  workspaceWidth?: 'standard' | 'wide'
}

withDefaults(defineProps<Props>(), {
  bullets: () => [],
  workspaceLabel: '',
  workspaceWidth: 'standard'
})

const { t } = useI18n()
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50"
    itemscope
    itemtype="https://schema.org/WebPage"
  >
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-slate-100 dark:text-slate-950"
    >
      {{ t('accessibility.skipToMain') }}
    </a>

    <main id="main-content" role="main">
      <div class="mx-auto max-w-6xl px-6 pt-6">
        <BreadcrumbNav :items="breadcrumbItems" />
      </div>

      <section class="border-b border-slate-200/80 dark:border-slate-800/80" aria-labelledby="hero-title">
        <div class="mx-auto max-w-6xl px-6 py-10 lg:py-14">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)] lg:items-start">
            <div class="space-y-5">
              <p class="text-sm font-semibold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-300">
                {{ sectionLabel }}
              </p>
              <h1
                id="hero-title"
                class="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 md:text-5xl"
                itemprop="headline"
              >
                {{ title }}
              </h1>
              <p
                class="max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300"
                itemprop="description"
              >
                {{ description }}
              </p>
            </div>

            <div
              v-if="bullets.length"
              class="rounded-[28px] border border-slate-200/80 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/88 dark:shadow-none"
            >
              <ul class="space-y-4" role="list">
                <li
                  v-for="bullet in bullets"
                  :key="`${bullet.icon}-${bullet.label}`"
                  class="flex items-start gap-3"
                  role="listitem"
                >
                  <div class="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <Icon :name="bullet.icon" class="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {{ bullet.label }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        class="mx-auto px-6 py-10 lg:py-14"
        :class="workspaceWidth === 'wide' ? 'max-w-7xl' : 'max-w-6xl'"
        :aria-label="workspaceLabel || title"
      >
        <div class="rounded-[30px] border border-slate-200/80 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none md:p-6 lg:p-8">
          <slot />
        </div>
      </section>

      <slot name="after-main" />
    </main>
  </div>
</template>
