<template>
  <section class="bg-slate-100/80 py-16 transition-colors duration-300 dark:bg-slate-900/70" aria-labelledby="tool-content-title">
    <div class="mx-auto max-w-6xl px-6">
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
          <div class="mb-8 space-y-3">
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              {{ t('toolPageContent.labels.workflow') }}
            </p>
            <h2 id="tool-content-title" class="text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {{ t('toolPageContent.howToUse') }}
            </h2>
          </div>

          <ol class="space-y-6" role="list" :aria-label="t('accessibility.usageStepsAriaLabel')">
            <li v-for="(step, index) in steps" :key="index" class="flex gap-4 items-start">
              <div class="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-950">
                {{ index + 1 }}
              </div>
              <div class="space-y-1.5 pt-1">
                <h3 class="text-lg font-semibold text-slate-950 dark:text-slate-50">
                  {{ step.name }}
                </h3>
                <p class="text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {{ step.text }}
                </p>
              </div>
            </li>
          </ol>
        </div>

        <div class="space-y-8">
          <div
            v-if="stats"
            class="rounded-[30px] border border-slate-200/80 bg-white/95 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none"
          >
            <div class="mb-6 space-y-2">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {{ t('toolPageContent.labels.trust') }}
              </p>
              <h2 class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {{ t('toolPageContent.stats') }}
              </h2>
            </div>

            <div class="grid gap-4 sm:grid-cols-3">
              <div
                v-if="stats.totalUsers"
                class="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70"
              >
                <p class="text-2xl font-semibold text-slate-950 dark:text-slate-50">{{ stats.totalUsers }}</p>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ t('toolPageContent.totalUsers') }}</p>
              </div>

              <div
                v-if="stats.filesProcessed"
                class="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70"
              >
                <p class="text-2xl font-semibold text-slate-950 dark:text-slate-50">{{ stats.filesProcessed }}</p>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ t('toolPageContent.filesProcessed') }}</p>
              </div>

              <div
                v-if="stats.avgRating"
                class="rounded-[22px] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/70"
              >
                <p class="text-2xl font-semibold text-slate-950 dark:text-slate-50">{{ stats.avgRating }}</p>
                <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{{ t('toolPageContent.avgRating') }}</p>
              </div>
            </div>
          </div>

          <div
            v-if="comparisons && comparisons.length > 0"
            class="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none"
          >
            <div class="border-b border-slate-200/80 px-8 py-6 dark:border-slate-800">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                {{ t('toolPageContent.labels.comparison') }}
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {{ t('toolPageContent.comparison') }}
              </h2>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800" role="table">
                <thead class="bg-slate-50/80 dark:bg-slate-950/80">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400" scope="col">
                      {{ t('toolPageContent.feature') }}
                    </th>
                    <th class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300" scope="col">
                      TryUtils
                    </th>
                    <th
                      v-for="(competitorName, idx) in competitorNames"
                      :key="idx"
                      class="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400"
                      scope="col"
                    >
                      {{ competitorName }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200/80 dark:divide-slate-800">
                  <tr v-for="(item, index) in comparisons" :key="index">
                    <td class="px-6 py-4 text-sm font-medium text-slate-950 dark:text-slate-50">
                      {{ item.feature }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex justify-center">
                        <template v-if="typeof item.ourTool === 'boolean'">
                          <Icon
                            :name="item.ourTool ? 'heroicons:check-circle' : 'heroicons:x-circle'"
                            class="h-5 w-5"
                            :class="item.ourTool ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'"
                            aria-hidden="true"
                          />
                        </template>
                        <span v-else class="text-sm font-medium text-teal-700 dark:text-teal-300">{{ item.ourTool }}</span>
                      </div>
                    </td>
                    <td v-for="(_, idx) in competitorNames" :key="idx" class="px-6 py-4 text-center">
                      <div class="flex justify-center">
                        <template v-if="typeof getCompetitorValue(item, idx) === 'boolean'">
                          <Icon
                            :name="getCompetitorValue(item, idx) ? 'heroicons:check-circle' : 'heroicons:x-circle'"
                            class="h-5 w-5"
                            :class="getCompetitorValue(item, idx) ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'"
                            aria-hidden="true"
                          />
                        </template>
                        <span v-else class="text-sm text-slate-600 dark:text-slate-300">
                          {{ getCompetitorValue(item, idx) }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHowToSchema, type HowToStep } from '~/composables/useHowToSchema'

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
  toolName: string
  steps: HowToStep[]
  comparisons?: ComparisonItem[]
  competitorNames?: string[]
  stats?: UsageStats
  generateSchema?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  comparisons: () => [],
  competitorNames: () => ['Competitor A', 'Competitor B'],
  stats: undefined,
  generateSchema: true
})

const { t } = useI18n()

if (props.generateSchema && props.steps.length > 0) {
  useHowToSchema(props.toolName, props.steps)
}

function getCompetitorValue(item: ComparisonItem, index: number): string | boolean {
  const key = `competitor${index + 1}` as keyof ComparisonItem
  return (item[key] as string | boolean | undefined) ?? '-'
}
</script>
