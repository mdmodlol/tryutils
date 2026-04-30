<script setup lang="ts">
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()

const toolId = 'image-compressor'

const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.imageTools'), path: '/image-tools' },
  { name: t('nav.imageCompressor'), path: '/image-compressor' }
])

const heroBullets = computed(() => [
  { icon: 'heroicons:shield-check', label: t('imageCompressor.instructions.privacy') },
  { icon: 'heroicons:queue-list', label: t('imageCompressor.instructions.batch') },
  { icon: 'heroicons:bolt', label: t('imageCompressor.instructions.compression') }
])

const faqItems = computed(() => getToolFAQs(toolId, locale.value))

const howToSteps = computed<HowToStep[]>(() => [
  { name: t('imageCompressor.howTo.step1.name'), text: t('imageCompressor.howTo.step1.text') },
  { name: t('imageCompressor.howTo.step2.name'), text: t('imageCompressor.howTo.step2.text') },
  { name: t('imageCompressor.howTo.step3.name'), text: t('imageCompressor.howTo.step3.text') },
  { name: t('imageCompressor.howTo.step4.name'), text: t('imageCompressor.howTo.step4.text') }
])

const { useToolPageMeta } = await import('~/composables/useToolPageMeta')
useToolPageMeta({
  toolName: t('imageCompressor.title'),
  toolDescription: t('imageCompressor.description'),
  locale: locale.value as 'zh' | 'en'
})

const { useStructuredData } = await import('~/composables/useStructuredData')
const { useEnhancedStructuredData } = await import('~/composables/useEnhancedStructuredData')
const {
  getOrganizationSchema,
  getWebsiteSchema,
  getWebPageSchema,
  getSoftwareApplicationSchema,
  setStructuredData
} = useStructuredData()

const { getServiceSchema, setEnhancedStructuredData } = useEnhancedStructuredData()

setStructuredData([
  getOrganizationSchema(),
  getWebsiteSchema(),
  getWebPageSchema({
    name: t('imageCompressor.meta.title'),
    description: t('imageCompressor.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('imageCompressor.title'),
    description: t('imageCompressor.description'),
    category: 'Image Compressor'
  })
])

setEnhancedStructuredData([
  getServiceSchema({
    name: t('imageCompressor.meta.title'),
    description: t('imageCompressor.meta.description')
  })
])
</script>

<template>
  <ToolPageShell
    :breadcrumb-items="breadcrumbItems"
    :section-label="t('home.categories.imageTools.title')"
    :title="t('imageCompressor.title')"
    :description="t('imageCompressor.subtitle')"
    :bullets="heroBullets"
    :workspace-label="t('imageCompressor.sections.toolTitle')"
  >
    <ImageCompressor />

    <template #after-main>
      <ToolPageContent
        :tool-name="t('imageCompressor.title')"
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
