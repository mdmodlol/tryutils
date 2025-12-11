<template>
  <section 
    class="py-12 px-6 bg-white dark:bg-gray-800 transition-colors duration-300"
    aria-labelledby="tool-content-title"
  >
    <div class="max-w-4xl mx-auto">
      <!-- How To Use Section -->
      <div class="mb-12">
        <h2 
          id="tool-content-title"
          class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
        >
          {{ t('toolPageContent.howToUse') }}
        </h2>
        
        <ol 
          class="space-y-6"
          role="list"
          :aria-label="t('accessibility.usageStepsAriaLabel')"
        >
          <li
            v-for="(step, index) in steps"
            :key="index"
            class="flex gap-4 items-start"
          >
            <div 
              class="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg"
              aria-hidden="true"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1 pt-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {{ step.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ step.text }}
              </p>
            </div>
          </li>
        </ol>
      </div>

      <!-- Comparison Table Section -->
      <div v-if="comparisons && comparisons.length > 0" class="mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {{ t('toolPageContent.comparison') }}
        </h2>
        
        <div class="overflow-x-auto">
          <table 
            class="w-full border-collapse bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden"
            role="table"
          >
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-700">
                <th 
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                  scope="col"
                >
                  {{ t('toolPageContent.feature') }}
                </th>
                <th 
                  class="px-4 py-3 text-center text-sm font-semibold text-blue-600 dark:text-blue-400"
                  scope="col"
                >
                  TryUtils
                </th>
                <th 
                  v-for="(competitorName, idx) in competitorNames"
                  :key="idx"
                  class="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
                  scope="col"
                >
                  {{ competitorName }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(item, index) in comparisons"
                :key="index"
                class="border-t border-gray-200 dark:border-gray-700"
                :class="index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'"
              >
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {{ item.feature }}
                </td>
                <td class="px-4 py-3 text-center">
                  <span :class="getValueClass(item.ourTool, true)">
                    {{ formatValue(item.ourTool) }}
                  </span>
                </td>
                <td 
                  v-for="(_, idx) in competitorNames"
                  :key="idx"
                  class="px-4 py-3 text-center"
                >
                  <span :class="getValueClass(getCompetitorValue(item, idx), false)">
                    {{ formatValue(getCompetitorValue(item, idx)) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Usage Statistics Section -->
      <div v-if="stats" class="mb-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {{ t('toolPageContent.stats') }}
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-if="stats.totalUsers"
            class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 text-center"
          >
            <div class="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {{ stats.totalUsers }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('toolPageContent.totalUsers') }}
            </div>
          </div>
          
          <div 
            v-if="stats.filesProcessed"
            class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 text-center"
          >
            <div class="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              {{ stats.filesProcessed }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('toolPageContent.filesProcessed') }}
            </div>
          </div>
          
          <div 
            v-if="stats.avgRating"
            class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 text-center"
          >
            <div class="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {{ stats.avgRating }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              {{ t('toolPageContent.avgRating') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHowToSchema, type HowToStep } from '~/composables/useHowToSchema'

/**
 * ToolPageContent Component
 * Displays HowTo steps, comparison table, and usage statistics for tool pages
 * Integrates useHowToSchema for structured data generation
 * 
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */

interface ComparisonItem {
  feature: string
  ourTool: string | boolean
  competitor1?: string | boolean
  competitor2?: string | boolean
  competitor3?: string | boolean
}

interface UsageStats {
  totalUsers?: string
  filesProcessed?: string
  avgRating?: string
}

interface Props {
  /** Name of the tool for HowTo schema */
  toolName: string
  /** Array of HowTo steps */
  steps: HowToStep[]
  /** Comparison table items */
  comparisons?: ComparisonItem[]
  /** Names of competitors for comparison table headers */
  competitorNames?: string[]
  /** Usage statistics */
  stats?: UsageStats
  /** Whether to generate HowTo structured data (default: true) */
  generateSchema?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  comparisons: () => [],
  competitorNames: () => ['Competitor A', 'Competitor B'],
  stats: undefined,
  generateSchema: true
})

const { t } = useI18n()

// Generate HowTo structured data
if (props.generateSchema && props.steps.length > 0) {
  useHowToSchema(props.toolName, props.steps)
}

/**
 * Get competitor value from comparison item by index
 */
function getCompetitorValue(item: ComparisonItem, index: number): string | boolean {
  const key = `competitor${index + 1}` as keyof ComparisonItem
  return item[key] as string | boolean ?? '-'
}

/**
 * Format value for display in comparison table
 */
function formatValue(value: string | boolean): string {
  if (typeof value === 'boolean') {
    return value ? '✓' : '✗'
  }
  return String(value)
}

/**
 * Get CSS class for comparison value
 */
function getValueClass(value: string | boolean, highlight: boolean): string {
  if (typeof value === 'boolean') {
    if (value === true) {
      return highlight 
        ? 'text-green-600 dark:text-green-400 font-semibold' 
        : 'text-green-500 dark:text-green-500'
    }
    return 'text-red-500 dark:text-red-400'
  }
  return highlight 
    ? 'text-sm text-blue-600 dark:text-blue-400 font-medium' 
    : 'text-sm text-gray-600 dark:text-gray-400'
}
</script>
