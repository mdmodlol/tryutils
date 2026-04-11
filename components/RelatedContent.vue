<script setup lang="ts">
import {
  generateToolAnchorText,
  generateArticleAnchorText,
  getRelatedTools,
  useRelatedArticles
} from '~/composables/useRelatedContent'
import { getToolById } from '~/data/toolConfig'

type RelatedToolItem = {
  id: string
  name: string
  description: string
  path: string
  icon: string
  keywords: string[]
}

type RelatedArticleItem = {
  title: string
  description: string
  path: string
  date: string
  keywords?: string[]
}

type Props = {
  type: 'tools' | 'articles'
  toolId?: string
  relatedToolIds?: string[]
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 5
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

const sectionId = computed(() => `related-${props.type}-section`)

const sectionTitle = computed(() => props.type === 'tools' ? t('seo.relatedTools') : t('seo.relatedArticles'))

const sectionLabel = computed(() => props.type === 'tools' ? t('relatedContent.toolsLabel') : t('relatedContent.articlesLabel'))

type DisplayItem = {
  path: string
  anchorText: string
  description: string
  icon?: string
  keywords?: string[]
}

const articlesResult = props.type === 'articles' && props.toolId
  ? useRelatedArticles(props.toolId, { limit: props.limit })
  : { articles: ref<RelatedArticleItem[]>([]), pending: ref(false) }

const articles = articlesResult.articles

const getItemPath = (item: DisplayItem) => props.type === 'articles' ? item.path : localePath(item.path)

function getRelatedToolsFromIds(toolIds: string[], currentLocale: 'zh' | 'en', limit: number): RelatedToolItem[] {
  return toolIds
    .map(id => {
      const tool = getToolById(id)
      if (!tool) return null

      return {
        id: tool.id,
        name: tool.name[currentLocale] || tool.name.zh,
        description: tool.description[currentLocale] || tool.description.zh,
        path: tool.path,
        icon: tool.icon,
        keywords: tool.keywords
      }
    })
    .filter((tool): tool is RelatedToolItem => tool !== null)
    .slice(0, limit)
}

const relatedTools = computed<RelatedToolItem[]>(() => {
  if (props.type !== 'tools') return []

  const currentLocale = locale.value as 'zh' | 'en'

  if (props.relatedToolIds?.length) {
    return getRelatedToolsFromIds(props.relatedToolIds, currentLocale, props.limit)
  }

  if (props.toolId) {
    return getRelatedTools(props.toolId, {
      locale: currentLocale,
      limit: props.limit
    })
  }

  return []
})

const displayItems = computed<DisplayItem[]>(() => {
  const currentLocale = locale.value as 'zh' | 'en'

  if (props.type === 'tools') {
    return relatedTools.value.map(tool => {
      const originalTool = getToolById(tool.id)
      if (!originalTool) {
        return {
          path: tool.path,
          anchorText: tool.name,
          description: tool.description,
          icon: tool.icon,
          keywords: tool.keywords || []
        }
      }

      const anchorResult = generateToolAnchorText(originalTool, currentLocale)

      return {
        path: tool.path,
        anchorText: anchorResult.text,
        description: tool.description,
        icon: tool.icon,
        keywords: tool.keywords || []
      }
    })
  }

  return articles.value.map(article => {
    const anchorResult = generateArticleAnchorText(article, currentLocale)

    return {
      path: article.path,
      anchorText: anchorResult.text,
      description: article.description,
      icon: 'heroicons:document-text',
      keywords: article.keywords
    }
  })
})
</script>

<template>
  <section
    v-if="displayItems.length > 0"
    class="mt-8 overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none"
    :aria-labelledby="sectionId"
  >
    <div class="border-b border-slate-200/80 px-6 py-5 dark:border-slate-800">
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
        {{ sectionLabel }}
      </p>
      <h2 :id="sectionId" class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
        {{ sectionTitle }}
      </h2>
    </div>

    <div class="divide-y divide-slate-200/80 dark:divide-slate-800">
      <NuxtLink
        v-for="item in displayItems"
        :key="item.path"
        :to="getItemPath(item)"
        class="grid gap-4 px-6 py-5 transition hover:bg-slate-50/80 dark:hover:bg-slate-900/70 md:grid-cols-[44px_minmax(0,1fr)]"
        :aria-label="item.anchorText"
      >
        <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Icon :name="item.icon || 'heroicons:wrench-screwdriver'" class="h-5 w-5" aria-hidden="true" />
        </div>

        <div class="space-y-2">
          <h3 class="text-base font-semibold text-slate-950 dark:text-slate-50">
            {{ item.anchorText }}
          </h3>
          <p v-if="item.description" class="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {{ item.description }}
          </p>
          <div v-if="item.keywords?.length" class="flex flex-wrap gap-2">
            <span
              v-for="keyword in item.keywords.slice(0, 3)"
              :key="keyword"
              class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
            >
              {{ keyword }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
