<script setup lang="ts">
/**
 * JsonFormatter Component
 * JSON formatting, validation, minification with syntax highlighting
 * Pure client-side processing, no backend API needed
 */
const { t } = useI18n()

const inputText = ref('')
const outputHtml = ref('')
const outputRaw = ref('')
const indentType = ref<'2' | '4' | 'tab'>('2')
const validationState = ref<'idle' | 'valid' | 'invalid'>('idle')
const errorMessage = ref('')
const errorLine = ref<number | null>(null)
const copySuccess = ref(false)
const isDragging = ref(false)

const inputStats = computed(() => {
  const text = inputText.value
  const chars = text.length
  const lines = text ? text.split('\n').length : 0
  const bytes = new Blob([text]).size
  const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
  return { chars, lines, size }
})

const outputStats = computed(() => {
  const text = outputRaw.value
  const chars = text.length
  const lines = text ? text.split('\n').length : 0
  const bytes = new Blob([text]).size
  const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
  return { chars, lines, size }
})

const indentValue = computed(() => {
  if (indentType.value === 'tab') return '\t'
  return indentType.value === '4' ? 4 : 2
})

function syntaxHighlight(json: string): string {
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number'
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-string'
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (/null/.test(match)) {
        cls = 'json-null'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

function getErrorLocation(error: SyntaxError, text: string): { line: number; message: string } {
  const msg = error.message
  const posMatch = msg.match(/position\s+(\d+)/i) || msg.match(/at\s+(\d+)/i)

  if (posMatch) {
    const pos = parseInt(posMatch[1])
    const beforeError = text.substring(0, pos)
    return { line: beforeError.split('\n').length, message: msg }
  }

  const lineMatch = msg.match(/line\s+(\d+)/i)
  if (lineMatch) {
    return { line: parseInt(lineMatch[1]), message: msg }
  }

  return { line: 1, message: msg }
}

function validateJson(text: string): void {
  if (!text.trim()) {
    validationState.value = 'idle'
    errorMessage.value = ''
    errorLine.value = null
    return
  }

  try {
    JSON.parse(text)
    validationState.value = 'valid'
    errorMessage.value = ''
    errorLine.value = null
  } catch (e) {
    validationState.value = 'invalid'
    if (e instanceof SyntaxError) {
      const loc = getErrorLocation(e, text)
      errorLine.value = loc.line
      errorMessage.value = `${t('jsonFormatter.validation.errorAtLine', { line: loc.line })}: ${loc.message}`
    } else {
      errorMessage.value = String(e)
    }
  }
}

watch(inputText, (val) => {
  validateJson(val)
})

function formatJson(): void {
  const text = inputText.value.trim()
  if (!text) {
    validationState.value = 'idle'
    outputHtml.value = ''
    outputRaw.value = ''
    return
  }

  try {
    const parsed = JSON.parse(text)
    const formatted = JSON.stringify(parsed, null, indentValue.value)
    outputRaw.value = formatted
    outputHtml.value = syntaxHighlight(formatted)
    validationState.value = 'valid'
    errorMessage.value = ''
    errorLine.value = null
  } catch (e) {
    if (e instanceof SyntaxError) {
      const loc = getErrorLocation(e, text)
      validationState.value = 'invalid'
      errorLine.value = loc.line
      errorMessage.value = `${t('jsonFormatter.validation.errorAtLine', { line: loc.line })}: ${loc.message}`
    }
  }
}

function minifyJson(): void {
  const text = inputText.value.trim()
  if (!text) return

  try {
    const parsed = JSON.parse(text)
    const minified = JSON.stringify(parsed)
    outputRaw.value = minified
    outputHtml.value = syntaxHighlight(minified)
    validationState.value = 'valid'
    errorMessage.value = ''
    errorLine.value = null
  } catch (e) {
    if (e instanceof SyntaxError) {
      const loc = getErrorLocation(e, text)
      validationState.value = 'invalid'
      errorLine.value = loc.line
      errorMessage.value = `${t('jsonFormatter.validation.errorAtLine', { line: loc.line })}: ${loc.message}`
    }
  }
}

async function copyOutput(): Promise<void> {
  if (!outputRaw.value) return
  try {
    await navigator.clipboard.writeText(outputRaw.value)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = outputRaw.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  }
}

function clearAll(): void {
  inputText.value = ''
  outputHtml.value = ''
  outputRaw.value = ''
  validationState.value = 'idle'
  errorMessage.value = ''
  errorLine.value = null
}

function handleDragEnter(e: DragEvent): void {
  e.preventDefault()
  isDragging.value = true
}

function handleDragOver(e: DragEvent): void {
  e.preventDefault()
}

function handleDragLeave(e: DragEvent): void {
  e.preventDefault()
  isDragging.value = false
}

function handleDrop(e: DragEvent): void {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (!files?.length) return

  const file = files[0]
  if (!file.name.endsWith('.json') && file.type !== 'application/json') return

  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result as string
    if (content) {
      inputText.value = content
      nextTick(() => formatJson())
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div
    class="json-formatter"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <Transition name="fade">
      <div
        v-if="isDragging"
        class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-slate-950/10 backdrop-blur-[2px]"
      >
        <div class="rounded-[28px] border border-dashed border-slate-300 bg-white/95 p-12 shadow-[0_28px_80px_rgba(15,23,42,0.16)] dark:border-slate-700 dark:bg-slate-900/95">
          <Icon name="heroicons:document-arrow-down" class="mx-auto mb-4 h-16 w-16 text-teal-600 dark:text-teal-300" />
          <p class="text-xl font-semibold text-slate-700 dark:text-slate-200">{{ t('jsonFormatter.dropHint') }}</p>
        </div>
      </div>
    </Transition>

    <div class="mb-4 rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <div class="flex flex-wrap items-center gap-3">
        <button
          class="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-offset-slate-950"
          @click="formatJson"
        >
          <Icon name="heroicons:code-bracket" class="h-4 w-4" aria-hidden="true" />
          {{ t('jsonFormatter.actions.format') }}
        </button>

        <button
          class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
          @click="minifyJson"
        >
          <Icon name="heroicons:arrows-pointing-in" class="h-4 w-4" aria-hidden="true" />
          {{ t('jsonFormatter.actions.minify') }}
        </button>

        <button
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          :class="copySuccess
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500'
            : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800'"
          :disabled="!outputRaw"
          @click="copyOutput"
        >
          <Icon :name="copySuccess ? 'heroicons:check' : 'heroicons:clipboard-document'" class="h-4 w-4" aria-hidden="true" />
          {{ copySuccess ? t('jsonFormatter.actions.copySuccess') : t('jsonFormatter.actions.copy') }}
        </button>

        <button
          class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60 dark:focus:ring-offset-slate-950"
          @click="clearAll"
        >
          <Icon name="heroicons:trash" class="h-4 w-4" aria-hidden="true" />
          {{ t('jsonFormatter.actions.clear') }}
        </button>

        <div class="flex-1" />

        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-600 dark:text-slate-400">{{ t('jsonFormatter.indent.label') }}:</span>
          <div class="flex overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
            <button
              v-for="opt in [
                { value: '2', label: t('jsonFormatter.indent.spaces2') },
                { value: '4', label: t('jsonFormatter.indent.spaces4') },
                { value: 'tab', label: t('jsonFormatter.indent.tab') }
              ]"
              :key="opt.value"
              class="px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              :class="indentType === opt.value
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
                : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
              @click="indentType = opt.value as '2' | '4' | 'tab'"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="validationState !== 'idle'" class="mt-4 flex items-center gap-2">
        <div
          v-if="validationState === 'valid'"
          class="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
        >
          <Icon name="heroicons:check-circle" class="h-5 w-5" aria-hidden="true" />
          {{ t('jsonFormatter.validation.valid') }}
        </div>
        <div
          v-else-if="validationState === 'invalid'"
          class="flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400"
        >
          <Icon name="heroicons:exclamation-circle" class="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:pencil-square" class="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ t('jsonFormatter.panels.input') }}</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{{ inputStats.chars }} {{ t('jsonFormatter.info.characters') }}</span>
            <span>{{ inputStats.lines }} {{ t('jsonFormatter.info.lines') }}</span>
            <span>{{ inputStats.size }}</span>
          </div>
        </div>
        <textarea
          v-model="inputText"
          :placeholder="t('jsonFormatter.inputPlaceholder')"
          class="flex-1 min-h-[400px] w-full resize-none bg-white p-4 font-mono text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 lg:min-h-[500px]"
          :class="{ 'border-l-4 border-l-rose-400': validationState === 'invalid' }"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
        />
      </div>

      <div class="flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:eye" class="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ t('jsonFormatter.panels.output') }}</span>
          </div>
          <div v-if="outputRaw" class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{{ outputStats.chars }} {{ t('jsonFormatter.info.characters') }}</span>
            <span>{{ outputStats.lines }} {{ t('jsonFormatter.info.lines') }}</span>
            <span>{{ outputStats.size }}</span>
          </div>
        </div>
        <div class="flex-1 min-h-[400px] overflow-auto lg:min-h-[500px]">
          <pre
            v-if="outputHtml"
            class="json-output p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
            v-html="outputHtml"
          />
          <div
            v-else
            class="flex h-full min-h-[400px] items-center justify-center text-slate-400 dark:text-slate-500 lg:min-h-[500px]"
          >
            <div class="text-center">
              <Icon name="heroicons:code-bracket-square" class="mx-auto mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
              <p class="text-sm">{{ t('jsonFormatter.outputPlaceholder') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.json-output :deep(.json-key) {
  color: #0f766e;
}

.json-output :deep(.json-string) {
  color: #0369a1;
}

.json-output :deep(.json-number) {
  color: #c2410c;
}

.json-output :deep(.json-boolean) {
  color: #7c3aed;
}

.json-output :deep(.json-null) {
  color: #64748b;
}

:root.dark .json-output :deep(.json-key),
.dark .json-output :deep(.json-key) {
  color: #5eead4;
}

:root.dark .json-output :deep(.json-string),
.dark .json-output :deep(.json-string) {
  color: #7dd3fc;
}

:root.dark .json-output :deep(.json-number),
.dark .json-output :deep(.json-number) {
  color: #fdba74;
}

:root.dark .json-output :deep(.json-boolean),
.dark .json-output :deep(.json-boolean) {
  color: #c4b5fd;
}

:root.dark .json-output :deep(.json-null),
.dark .json-output :deep(.json-null) {
  color: #94a3b8;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
