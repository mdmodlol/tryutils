<script setup lang="ts">
import { getToolFAQs } from '~/data/faqData'
import type { HowToStep } from '~/composables/useHowToSchema'

const { t, locale } = useI18n()

const toolId = 'image-format-converter'

const breadcrumbItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.imageTools'), path: '/image-tools' },
  { name: t('nav.formatConverter'), path: '/image-format-converter' }
])

const heroBullets = computed(() => [
  { icon: 'heroicons:swatch', label: t('imageFormatConverter.features.multiFormat.description') },
  { icon: 'heroicons:shield-check', label: t('imageFormatConverter.features.privacy.description') },
  { icon: 'heroicons:queue-list', label: t('imageFormatConverter.features.batchProcessing.description') }
])

const faqItems = computed(() => getToolFAQs(toolId, locale.value))

const howToSteps = computed<HowToStep[]>(() => [
  { name: t('imageFormatConverter.howTo.step1.name'), text: t('imageFormatConverter.howTo.step1.text') },
  { name: t('imageFormatConverter.howTo.step2.name'), text: t('imageFormatConverter.howTo.step2.text') },
  { name: t('imageFormatConverter.howTo.step3.name'), text: t('imageFormatConverter.howTo.step3.text') },
  { name: t('imageFormatConverter.howTo.step4.name'), text: t('imageFormatConverter.howTo.step4.text') }
])

const { useToolPageMeta } = await import('~/composables/useToolPageMeta')
useToolPageMeta({
  toolName: t('imageFormatConverter.hero.title'),
  toolDescription: t('imageFormatConverter.hero.subtitle'),
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
    name: t('imageFormatConverter.meta.title'),
    description: t('imageFormatConverter.meta.description')
  }),
  getSoftwareApplicationSchema({
    name: t('imageFormatConverter.hero.title'),
    description: t('imageFormatConverter.hero.subtitle'),
    category: 'Image Format Converter'
  })
])

setEnhancedStructuredData([
  getServiceSchema({
    name: t('imageFormatConverter.meta.title'),
    description: t('imageFormatConverter.meta.description')
  })
])
</script>

<template>
  <ToolPageShell
    :breadcrumb-items="breadcrumbItems"
    :section-label="t('home.categories.imageTools.title')"
    :title="t('imageFormatConverter.hero.title')"
    :description="t('imageFormatConverter.hero.subtitle')"
    :bullets="heroBullets"
    :workspace-label="t('imageFormatConverter.sections.toolTitle')"
  >
    <ImageFormatConverter />

    <template #after-main>
      <ToolPageContent
        :tool-name="t('imageFormatConverter.hero.title')"
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
