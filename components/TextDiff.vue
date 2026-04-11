<script setup lang="ts">
/**
 * TextDiff Component
 * Compare two texts and highlight differences
 * Uses custom LCS-based diff algorithm (no external libraries)
 */
const { t } = useI18n()

// === Types ===
type DiffType = 'equal' | 'add' | 'delete'
interface DiffLine {
  type: DiffType
  oldLine: number | null
  newLine: number | null
  text: string
  inlineChanges?: { type: DiffType; text: string }[]
}
interface DiffStats {
  additions: number
  deletions: number
  modifications: number
  unchanged: number
}

// === State ===
const originalText = ref('')
const modifiedText = ref('')
const diffResult = ref<DiffLine[]>([])
const stats = ref<DiffStats>({ additions: 0, deletions: 0, modifications: 0, unchanged: 0 })
const viewMode = ref<'sideBySide' | 'unified'>('sideBySide')
const hasCompared = ref(false)
const copySuccess = ref(false)
const isDraggingLeft = ref(false)
const isDraggingRight = ref(false)

// === LCS-based Diff Algorithm ===
function lcs(a: string[], b: string[]): number[][] {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  return dp
}

function backtrackDiff(dp: number[][], a: string[], b: string[]): DiffLine[] {
  let i = a.length
  let j = b.length

  // Backtrack to build diff
  const stack: DiffLine[] = []
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      stack.push({ type: 'equal', oldLine: i, newLine: j, text: a[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'add', oldLine: null, newLine: j, text: b[j - 1] })
      j--
    } else if (i > 0) {
      stack.push({ type: 'delete', oldLine: i, newLine: null, text: a[i - 1] })
      i--
    }
  }

  // Reverse to get correct order
  stack.reverse()
  return stack
}

// Character-level diff for modified lines
function charDiff(oldStr: string, newStr: string): { type: DiffType; text: string }[] {
  const oldChars = [...oldStr]
  const newChars = [...newStr]
  const m = oldChars.length
  const n = newChars.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldChars[i - 1] === newChars[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  const changes: { type: DiffType; text: string }[] = []
  let i = m, j = n
  const stack: { type: DiffType; text: string }[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldChars[i - 1] === newChars[j - 1]) {
      stack.push({ type: 'equal', text: oldChars[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ type: 'add', text: newChars[j - 1] })
      j--
    } else if (i > 0) {
      stack.push({ type: 'delete', text: oldChars[i - 1] })
      i--
    }
  }

  stack.reverse()

  // Merge consecutive same-type segments
  for (const item of stack) {
    if (changes.length > 0 && changes[changes.length - 1].type === item.type) {
      changes[changes.length - 1].text += item.text
    } else {
      changes.push({ ...item })
    }
  }

  return changes
}

// Detect modification pairs (adjacent delete + add) and compute inline diff
function enhanceDiff(lines: DiffLine[]): DiffLine[] {
  const enhanced: DiffLine[] = []
  let i = 0

  while (i < lines.length) {
    // Look for delete+add pairs (modifications)
    if (lines[i].type === 'delete') {
      // Collect consecutive deletes
      const deletes: DiffLine[] = []
      while (i < lines.length && lines[i].type === 'delete') {
        deletes.push(lines[i])
        i++
      }
      // Collect consecutive adds
      const adds: DiffLine[] = []
      while (i < lines.length && lines[i].type === 'add') {
        adds.push(lines[i])
        i++
      }

      // Pair them up for inline diff
      const pairCount = Math.min(deletes.length, adds.length)
      for (let p = 0; p < pairCount; p++) {
        const inlineChanges = charDiff(deletes[p].text, adds[p].text)
        deletes[p].inlineChanges = inlineChanges.filter(c => c.type !== 'add')
        adds[p].inlineChanges = inlineChanges.filter(c => c.type !== 'delete')
      }

      enhanced.push(...deletes, ...adds)
    } else {
      enhanced.push(lines[i])
      i++
    }
  }

  return enhanced
}

// === Actions ===
function compare() {
  const oldLines = originalText.value.split('\n')
  const newLines = modifiedText.value.split('\n')

  const dp = lcs(oldLines, newLines)
  const rawDiff = backtrackDiff(dp, oldLines, newLines)
  diffResult.value = enhanceDiff(rawDiff)
  hasCompared.value = true

  // Calculate stats
  let additions = 0, deletions = 0, modifications = 0, unchanged = 0

  // Count modification pairs
  let i = 0
  const lines = diffResult.value
  while (i < lines.length) {
    if (lines[i].type === 'delete') {
      const delStart = i
      while (i < lines.length && lines[i].type === 'delete') i++
      const delCount = i - delStart
      const addStart = i
      while (i < lines.length && lines[i].type === 'add') i++
      const addCount = i - addStart

      const paired = Math.min(delCount, addCount)
      modifications += paired
      deletions += delCount - paired
      additions += addCount - paired
    } else if (lines[i].type === 'add') {
      additions++
      i++
    } else {
      unchanged++
      i++
    }
  }

  stats.value = { additions, deletions, modifications, unchanged }
}

function clear() {
  originalText.value = ''
  modifiedText.value = ''
  diffResult.value = []
  hasCompared.value = false
  stats.value = { additions: 0, deletions: 0, modifications: 0, unchanged: 0 }
}

function swap() {
  const temp = originalText.value
  originalText.value = modifiedText.value
  modifiedText.value = temp
  if (hasCompared.value) compare()
}

async function copyDiff() {
  const text = diffResult.value.map(line => {
    const prefix = line.type === 'add' ? '+ ' : line.type === 'delete' ? '- ' : '  '
    return prefix + line.text
  }).join('\n')

  try {
    await navigator.clipboard.writeText(text)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch {}
}

// === Drag & Drop ===
function handleDragOver(e: DragEvent, side: 'left' | 'right') {
  e.preventDefault()
  if (side === 'left') isDraggingLeft.value = true
  else isDraggingRight.value = true
}

function handleDragLeave(side: 'left' | 'right') {
  if (side === 'left') isDraggingLeft.value = false
  else isDraggingRight.value = false
}

function handleDrop(e: DragEvent, side: 'left' | 'right') {
  e.preventDefault()
  if (side === 'left') isDraggingLeft.value = false
  else isDraggingRight.value = false

  const file = e.dataTransfer?.files?.[0]
  if (!file || !file.name.endsWith('.txt')) return

  const reader = new FileReader()
  reader.onload = (ev) => {
    const content = ev.target?.result as string
    if (side === 'left') originalText.value = content
    else modifiedText.value = content
  }
  reader.readAsText(file)
}

// === Computed for side-by-side view ===
const sideBySideLines = computed(() => {
  const left: { line: number | null; text: string; type: DiffType; inlineChanges?: { type: DiffType; text: string }[] }[] = []
  const right: { line: number | null; text: string; type: DiffType; inlineChanges?: { type: DiffType; text: string }[] }[] = []

  for (const d of diffResult.value) {
    if (d.type === 'equal') {
      left.push({ line: d.oldLine, text: d.text, type: 'equal' })
      right.push({ line: d.newLine, text: d.text, type: 'equal' })
    } else if (d.type === 'delete') {
      left.push({ line: d.oldLine, text: d.text, type: 'delete', inlineChanges: d.inlineChanges })
      right.push({ line: null, text: '', type: 'equal' })
    } else if (d.type === 'add') {
      left.push({ line: null, text: '', type: 'equal' })
      right.push({ line: d.newLine, text: d.text, type: 'add', inlineChanges: d.inlineChanges })
    }
  }

  return { left, right }
})
</script>

<template>
  <div class="space-y-4">
    <!-- Action Bar -->
    <div class="rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Compare Button -->
        <button
          class="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          @click="compare"
        >
          <Icon name="heroicons:magnifying-glass" class="w-4 h-4" />
          {{ t('textDiff.actions.compare') }}
        </button>

        <!-- Swap Button -->
        <button
          class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="swap"
        >
          <Icon name="heroicons:arrows-right-left" class="w-4 h-4" />
          {{ t('textDiff.actions.swap') }}
        </button>

        <!-- Clear Button -->
        <button
          class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="clear"
        >
          <Icon name="heroicons:trash" class="w-4 h-4" />
          {{ t('textDiff.actions.clear') }}
        </button>

        <!-- Copy Diff Button -->
        <button
          v-if="hasCompared && diffResult.length > 0"
          class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="copyDiff"
        >
          <Icon :name="copySuccess ? 'heroicons:check' : 'heroicons:clipboard-document'" class="w-4 h-4" />
          {{ copySuccess ? t('textDiff.actions.copySuccess') : t('textDiff.actions.copy') }}
        </button>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- View Mode Toggle -->
        <div class="inline-flex overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
          <button
            class="px-3 py-1.5 text-sm font-medium transition-colors"
            :class="viewMode === 'sideBySide'
              ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
              : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="viewMode = 'sideBySide'"
          >
            <Icon name="heroicons:view-columns" class="w-4 h-4 inline mr-1" />
            {{ t('textDiff.viewMode.sideBySide') }}
          </button>
          <button
            class="px-3 py-1.5 text-sm font-medium transition-colors"
            :class="viewMode === 'unified'
              ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
              : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="viewMode = 'unified'"
          >
            <Icon name="heroicons:bars-3" class="w-4 h-4 inline mr-1" />
            {{ t('textDiff.viewMode.unified') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Input Areas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Original Text -->
      <div
        class="overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] transition-colors dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none"
        :class="{ 'ring-2 ring-teal-400': isDraggingLeft }"
        @dragover="handleDragOver($event, 'left')"
        @dragleave="handleDragLeave('left')"
        @drop="handleDrop($event, 'left')"
      >
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            <Icon name="heroicons:document-text" class="w-4 h-4 inline mr-1" />
            {{ t('textDiff.original') }}
          </span>
          <span class="text-xs text-gray-400">{{ t('textDiff.dropHint') }}</span>
        </div>
        <textarea
          v-model="originalText"
          :placeholder="t('textDiff.originalPlaceholder')"
          class="h-64 w-full resize-y bg-transparent p-4 font-mono text-sm text-slate-800 focus:outline-none dark:text-slate-200"
          spellcheck="false"
        />
      </div>

      <!-- Modified Text -->
      <div
        class="overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] transition-colors dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none"
        :class="{ 'ring-2 ring-teal-400': isDraggingRight }"
        @dragover="handleDragOver($event, 'right')"
        @dragleave="handleDragLeave('right')"
        @drop="handleDrop($event, 'right')"
      >
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            <Icon name="heroicons:document-text" class="w-4 h-4 inline mr-1" />
            {{ t('textDiff.modified') }}
          </span>
          <span class="text-xs text-gray-400">{{ t('textDiff.dropHint') }}</span>
        </div>
        <textarea
          v-model="modifiedText"
          :placeholder="t('textDiff.modifiedPlaceholder')"
          class="h-64 w-full resize-y bg-transparent p-4 font-mono text-sm text-slate-800 focus:outline-none dark:text-slate-200"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Stats Bar -->
    <div v-if="hasCompared" class="rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500" />
          <span class="text-gray-600 dark:text-gray-300">{{ t('textDiff.stats.additions') }}:</span>
          <span class="font-semibold text-green-600 dark:text-green-400">{{ stats.additions }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500" />
          <span class="text-gray-600 dark:text-gray-300">{{ t('textDiff.stats.deletions') }}:</span>
          <span class="font-semibold text-red-600 dark:text-red-400">{{ stats.deletions }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-yellow-500/20 border border-yellow-500" />
          <span class="text-gray-600 dark:text-gray-300">{{ t('textDiff.stats.modifications') }}:</span>
          <span class="font-semibold text-yellow-600 dark:text-yellow-400">{{ stats.modifications }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded-sm bg-gray-500/20 border border-gray-400" />
          <span class="text-gray-600 dark:text-gray-300">{{ t('textDiff.stats.unchanged') }}:</span>
          <span class="font-semibold text-gray-600 dark:text-gray-400">{{ stats.unchanged }}</span>
        </div>
      </div>
    </div>

    <!-- Diff Result -->
    <div v-if="hasCompared" class="overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <!-- No changes -->
      <div v-if="diffResult.length > 0 && stats.additions === 0 && stats.deletions === 0 && stats.modifications === 0" class="p-8 text-center">
        <Icon name="heroicons:check-circle" class="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-300">{{ t('textDiff.empty.noChanges') }}</p>
      </div>

      <!-- Side by Side View -->
      <div v-else-if="viewMode === 'sideBySide'" class="overflow-x-auto">
        <div class="grid grid-cols-2 min-w-[640px]">
          <!-- Left Header -->
          <div class="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-r border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">
            {{ t('textDiff.original') }}
          </div>
          <!-- Right Header -->
          <div class="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">
            {{ t('textDiff.modified') }}
          </div>

          <!-- Lines -->
          <template v-for="(_, idx) in sideBySideLines.left" :key="'sbs-' + idx">
            <!-- Left line -->
            <div
              class="flex border-b border-r border-gray-100 dark:border-gray-700/50 font-mono text-sm leading-6"
              :class="{
                'bg-red-50 dark:bg-red-900/20': sideBySideLines.left[idx].type === 'delete',
                'bg-yellow-50 dark:bg-yellow-900/10': sideBySideLines.left[idx].type === 'delete' && sideBySideLines.left[idx].inlineChanges,
              }"
            >
              <span class="w-12 shrink-0 text-right pr-2 py-0.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 select-none border-r border-gray-100 dark:border-gray-700/50">
                {{ sideBySideLines.left[idx].line ?? '' }}
              </span>
              <span class="px-2 py-0.5 whitespace-pre-wrap break-all flex-1 min-w-0">
                <template v-if="sideBySideLines.left[idx].inlineChanges">
                  <template v-for="(seg, si) in sideBySideLines.left[idx].inlineChanges" :key="si">
                    <span
                      :class="{
                        'bg-red-200 dark:bg-red-700/50 rounded-sm': seg.type === 'delete',
                      }"
                    >{{ seg.text }}</span>
                  </template>
                </template>
                <template v-else>{{ sideBySideLines.left[idx].text }}</template>
              </span>
            </div>
            <!-- Right line -->
            <div
              class="flex border-b border-gray-100 dark:border-gray-700/50 font-mono text-sm leading-6"
              :class="{
                'bg-green-50 dark:bg-green-900/20': sideBySideLines.right[idx].type === 'add',
                'bg-yellow-50 dark:bg-yellow-900/10': sideBySideLines.right[idx].type === 'add' && sideBySideLines.right[idx].inlineChanges,
              }"
            >
              <span class="w-12 shrink-0 text-right pr-2 py-0.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 select-none border-r border-gray-100 dark:border-gray-700/50">
                {{ sideBySideLines.right[idx].line ?? '' }}
              </span>
              <span class="px-2 py-0.5 whitespace-pre-wrap break-all flex-1 min-w-0">
                <template v-if="sideBySideLines.right[idx].inlineChanges">
                  <template v-for="(seg, si) in sideBySideLines.right[idx].inlineChanges" :key="si">
                    <span
                      :class="{
                        'bg-green-200 dark:bg-green-700/50 rounded-sm': seg.type === 'add',
                      }"
                    >{{ seg.text }}</span>
                  </template>
                </template>
                <template v-else>{{ sideBySideLines.right[idx].text }}</template>
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- Unified View -->
      <div v-else class="overflow-x-auto">
        <div class="min-w-[480px]">
          <!-- Header -->
          <div class="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">
            {{ t('textDiff.title') }}
          </div>
          <!-- Lines -->
          <div
            v-for="(line, idx) in diffResult"
            :key="'unified-' + idx"
            class="flex border-b border-gray-100 dark:border-gray-700/50 font-mono text-sm leading-6"
            :class="{
              'bg-green-50 dark:bg-green-900/20': line.type === 'add',
              'bg-red-50 dark:bg-red-900/20': line.type === 'delete',
              'bg-yellow-50 dark:bg-yellow-900/10': (line.type === 'add' || line.type === 'delete') && line.inlineChanges,
            }"
          >
            <!-- Old line number -->
            <span class="w-12 shrink-0 text-right pr-2 py-0.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 select-none border-r border-gray-100 dark:border-gray-700/50">
              {{ line.oldLine ?? '' }}
            </span>
            <!-- New line number -->
            <span class="w-12 shrink-0 text-right pr-2 py-0.5 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 select-none border-r border-gray-100 dark:border-gray-700/50">
              {{ line.newLine ?? '' }}
            </span>
            <!-- Prefix -->
            <span class="w-6 shrink-0 text-center py-0.5 select-none" :class="{
              'text-green-600 dark:text-green-400': line.type === 'add',
              'text-red-600 dark:text-red-400': line.type === 'delete',
              'text-gray-400': line.type === 'equal',
            }">
              {{ line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' ' }}
            </span>
            <!-- Content -->
            <span class="px-2 py-0.5 whitespace-pre-wrap break-all flex-1 min-w-0">
              <template v-if="line.inlineChanges">
                <template v-for="(seg, si) in line.inlineChanges" :key="si">
                  <span
                    :class="{
                      'bg-green-200 dark:bg-green-700/50 rounded-sm': seg.type === 'add',
                      'bg-red-200 dark:bg-red-700/50 rounded-sm': seg.type === 'delete',
                    }"
                  >{{ seg.text }}</span>
                </template>
              </template>
              <template v-else>{{ line.text }}</template>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!hasCompared" class="rounded-[28px] border border-slate-200 bg-white/95 p-12 text-center shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <Icon name="heroicons:document-magnifying-glass" class="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">{{ t('textDiff.empty.enterText') }}</p>
    </div>
  </div>
</template>
