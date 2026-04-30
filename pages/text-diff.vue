<script setup lang="ts">
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()

const toolId = 'text-diff'

const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.devTools'), path: '/dev-tools' },
  { name: t('textDiff.title'), path: '/text-diff' }
])

const heroBullets = computed(() => [
  { icon: 'heroicons:shield-check', label: t('home.features.privacy.description') },
  { icon: 'heroicons:bolt', label: t('home.features.fast.description') },
  { icon: 'heroicons:document-duplicate', label: t('devTools.description') }
])

const faqItems = computed(() => getToolFAQs(toolId, locale.value))

const howToSteps = computed<HowToStep[]>(() => [
  { name: t('textDiff.howTo.step1.name'), text: t('textDiff.howTo.step1.text') },
  { name: t('textDiff.howTo.step2.name'), text: t('textDiff.howTo.step2.text') },
  { name: t('textDiff.howTo.step3.name'), text: t('textDiff.howTo.step3.text') },
  { name: t('textDiff.howTo.step4.name'), text: t('textDiff.howTo.step4.text') }
])

const seoConfig = computed(() => ({
  title: t('textDiff.meta.title'),
  description: t('textDiff.meta.description'),
  keywords: t('textDiff.meta.keywords'),
  ogTitle: t('textDiff.meta.title'),
  ogDescription: t('textDiff.meta.description'),
  ogType: 'website'
}))

const { useSEO } = await import('~/composables/useSEO')
useSEO(seoConfig)

const { useStructuredData } = await import('~/composables/useStructuredData')
const {
  getOrganizationSchema,
  getWebPageSchema,
  getSoftwareApplicationSchema,
  setStructuredData
} = useStructuredData()

setStructuredData([
  getOrganizationSchema(),
  getWebPageSchema({
    name: t('textDiff.meta.title'),
    description: t('textDiff.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('textDiff.meta.title'),
    description: t('textDiff.meta.description'),
    category: 'DeveloperApplication'
  })
])
</script>

<template>
  <ToolPageShell
    :breadcrumb-items="breadcrumbItems"
    :section-label="t('home.categories.devTools.title')"
    :title="t('textDiff.title')"
    :description="t('textDiff.subtitle')"
    :bullets="heroBullets"
    :workspace-label="t('textDiff.title')"
    workspace-width="wide"
  >
    <ClientOnly>
      <TextDiff />
      <template #fallback>
        <div class="flex min-h-[280px] items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" role="status" aria-label="Loading"/>
            <p class="text-slate-600 dark:text-slate-300">{{ t('common.loading') || 'Loading...' }}</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <template #after-main>
      <ToolPageContent
        :tool-name="t('textDiff.title')"
        :steps="howToSteps"
      />

      <FAQ :items="faqItems" />

      <div class="mx-auto max-w-6xl px-6 py-10 lg:py-12">
        <RelatedContent type="tools" :tool-id="toolId" :limit="3" />
        <RelatedContent type="articles" :tool-id="toolId" :limit="5" />
      </div>
    </template>
  </ToolPageShell>
</template>
