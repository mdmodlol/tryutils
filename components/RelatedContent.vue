<script setup lang="ts">
/**
 * RelatedContent Component
 * Displays related tools or articles with keyword-based anchor text
 * 
 * @see Requirements 4.1, 4.2, 4.3
 */
import {
  generateToolAnchorText,
  generateArticleAnchorText,
  getRelatedTools,
  useRelatedArticles
} from '~/composables/useRelatedContent'
import { getToolById } from '~/data/toolConfig'

// Local type definitions
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
  /** Display mode: 'tools' for related tools, 'articles' for related articles */
  type: 'tools' | 'articles'
  /** Current tool ID (used for finding related articles on tool pages) */
  toolId?: string
  /** Tool IDs from article frontmatter (used for showing related tools on blog pages) */
  relatedToolIds?: string[]
  /** Maximum number of items to display */
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 5
})

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Generate unique section ID for accessibility
const sectionId = computed(() => `related-${props.type}-section`)

// Section configuration based on type
const sectionTitle = computed(() => {
  return props.type === 'tools'
    ? t('seo.relatedTools')
    : t('seo.relatedArticles')
})

const sectionIcon = computed(() => {
  return props.type === 'tools'
    ? 'heroicons:wrench-screwdriver'
    : 'heroicons:document-text'
})

const defaultIcon = computed(() => {
  return props.type === 'tools'
    ? 'heroicons:wrench'
    : 'heroicons:document'
})

// Type for display items with anchor text
type DisplayItem = {
  path: string
  anchorText: string
  description: string
  icon?: string
  keywords?: string[]
}

// Get related articles for tool pages
const articlesResult = props.type === 'articles' && props.toolId
  ? useRelatedArticles(props.toolId, { limit: props.limit })
  : { articles: ref<RelatedArticleItem[]>([]), pending: ref(false) }

const articles = articlesResult.articles

// Helper function to get tools from IDs
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

// Get related tools for blog pages
const relatedTools = computed<RelatedToolItem[]>(() => {
  if (props.type !== 'tools') return []
  
  const currentLocale = locale.value as 'zh' | 'en'
  
  if (props.relatedToolIds && props.relatedToolIds.length > 0) {
    // Use provided tool IDs from article frontmatter
    return getRelatedToolsFromIds(props.relatedToolIds, currentLocale, props.limit)
  } else if (props.toolId) {
    // Get related tools based on current tool
    return getRelatedTools(props.toolId, {
      locale: currentLocale,
      limit: props.limit
    })
  }
  
  return []
})

// Transform items to display format with anchor text
const displayItems = computed<DisplayItem[]>(() => {
  const currentLocale = locale.value as 'zh' | 'en'
  
  if (props.type === 'tools') {
    return relatedTools.value.map(tool => {
      // Get the original ToolConfig object for proper anchor text generation
      const originalTool = getToolById(tool.id)
      if (!originalTool) {
        // Fallback if tool not found
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
  } else {
    // Articles mode
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
  }
})
</script>

<template>
  <section
    v-if="displayItems.length > 0"
    class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8 transition-colors duration-300"
    :aria-labelledby="sectionId"
  >
    <h2
      :id="sectionId"
      class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center"
    >
      <Icon :name="sectionIcon" class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
      {{ sectionTitle }}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink
        v-for="item in displayItems"
        :key="item.path"
        :to="localePath(item.path)"
        class="group block p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        :aria-label="item.anchorText"
      >
        <div class="flex items-start space-x-3">
          <Icon
            :name="item.icon || defaultIcon"
            class="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors flex-shrink-0"
          />
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {{ item.anchorText }}
            </h3>
            <p
              v-if="item.description"
              class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2"
            >
              {{ item.description }}
            </p>
            <div
              v-if="item.keywords && item.keywords.length > 0"
              class="flex flex-wrap gap-1 mt-2"
            >
              <span
                v-for="keyword in item.keywords.slice(0, 3)"
                :key="keyword"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
