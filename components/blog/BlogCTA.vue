<script setup lang="ts">
import { getBlogCtaDefinition, type BlogCtaVariant, type MainlineToolId } from '~/data/blog-cta'

interface Props {
  variant: BlogCtaVariant
  primaryTool: MainlineToolId
}

const props = defineProps<Props>()

const { locale } = useI18n()
const localePath = useLocalePath()

const currentLocale = computed<'zh' | 'en'>(() => (locale.value === 'en' ? 'en' : 'zh'))

const ctaContent = computed(() => {
  const definition = getBlogCtaDefinition(props.variant, currentLocale.value)

  if (definition.toolId !== props.primaryTool) {
    return getBlogCtaDefinition(
      props.primaryTool === 'heic-converter'
        ? 'convert-heic-now'
        : props.primaryTool === 'image-format-converter'
          ? 'convert-format-now'
          : 'compress-now',
      currentLocale.value,
    )
  }

  return definition
})
</script>

<template>
  <section class="border-t border-slate-200/80 bg-slate-50/80 px-8 py-8 dark:border-slate-800 dark:bg-slate-950/70">
    <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
      {{ ctaContent.eyebrow }}
    </p>
    <div class="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div class="max-w-2xl space-y-3">
        <h2 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
          {{ ctaContent.title }}
        </h2>
        <p class="text-sm leading-7 text-slate-600 dark:text-slate-300">
          {{ ctaContent.description }}
        </p>
      </div>

      <NuxtLink
        :to="localePath(ctaContent.toolPath)"
        class="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
      >
        {{ ctaContent.buttonLabel }}
        <Icon name="heroicons:arrow-right" class="h-4 w-4" aria-hidden="true" />
      </NuxtLink>
    </div>
  </section>
</template>
