<script setup lang="ts">
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()

const toolId = 'json-formatter'

const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.devTools'), path: '/dev-tools' },
  { name: t('jsonFormatter.title'), path: '/json-formatter' }
])

const heroBullets = computed(() => [
  { icon: 'heroicons:shield-check', label: t('home.features.privacy.description') },
  { icon: 'heroicons:bolt', label: t('home.features.fast.description') },
  { icon: 'heroicons:command-line', label: t('devTools.description') }
])

const faqItems = computed(() => getToolFAQs(toolId, locale.value))

const howToSteps = computed<HowToStep[]>(() => [
  { name: t('jsonFormatter.howTo.step1.name'), text: t('jsonFormatter.howTo.step1.text') },
  { name: t('jsonFormatter.howTo.step2.name'), text: t('jsonFormatter.howTo.step2.text') },
  { name: t('jsonFormatter.howTo.step3.name'), text: t('jsonFormatter.howTo.step3.text') },
  { name: t('jsonFormatter.howTo.step4.name'), text: t('jsonFormatter.howTo.step4.text') }
])

const comparisons = computed(() => [
  { feature: t('jsonFormatter.comparison.validation'), ourTool: true, competitor1: true, competitor2: false },
  { feature: t('jsonFormatter.comparison.errorLocation'), ourTool: true, competitor1: false, competitor2: false },
  { feature: t('jsonFormatter.comparison.localProcessing'), ourTool: true, competitor1: false, competitor2: false },
  { feature: t('jsonFormatter.comparison.minify'), ourTool: true, competitor1: true, competitor2: true },
  { feature: t('jsonFormatter.comparison.noRegistration'), ourTool: true, competitor1: true, competitor2: true }
])

const competitorNames = ['JSONLint', 'Code Beautify']

const stats = {
  totalUsers: '25,000+',
  filesProcessed: '400,000+',
  avgRating: '4.8/5'
}

const seoConfig = computed(() => ({
  title: t('jsonFormatter.meta.title'),
  description: t('jsonFormatter.meta.description'),
  keywords: t('jsonFormatter.meta.keywords'),
  ogTitle: t('jsonFormatter.meta.title'),
  ogDescription: t('jsonFormatter.meta.description'),
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
    name: t('jsonFormatter.meta.title'),
    description: t('jsonFormatter.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('jsonFormatter.meta.title'),
    description: t('jsonFormatter.meta.description'),
    category: 'DeveloperApplication'
  })
])
</script>

<template>
  <ToolPageShell
    :breadcrumb-items="breadcrumbItems"
    :section-label="t('home.categories.devTools.title')"
    :title="t('jsonFormatter.title')"
    :description="t('jsonFormatter.subtitle')"
    :bullets="heroBullets"
    :workspace-label="t('jsonFormatter.title')"
    workspace-width="wide"
  >
    <ClientOnly>
      <JsonFormatter />
      <template #fallback>
        <div class="flex min-h-[280px] items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
          <div class="text-center">
            <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" role="status" aria-label="Loading"></div>
            <p class="text-slate-600 dark:text-slate-300">{{ t('common.loading') || 'Loading...' }}</p>
          </div>
        </div>
      </template>
    </ClientOnly>

    <template #after-main>
      <ToolPageContent
        :tool-name="t('jsonFormatter.title')"
        :steps="howToSteps"
        :comparisons="comparisons"
        :competitor-names="competitorNames"
        :stats="stats"
      />

      <FAQ :items="faqItems" />

      <div class="mx-auto max-w-6xl px-6 py-10 lg:py-12">
        <RelatedContent type="tools" :tool-id="toolId" :limit="3" />
        <RelatedContent type="articles" :tool-id="toolId" :limit="5" />
      </div>
    </template>
  </ToolPageShell>
</template>
