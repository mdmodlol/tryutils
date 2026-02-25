<script setup lang="ts">
/**
 * JsonFormatter Component
 * JSON formatting, validation, minification with syntax highlighting
 * Pure client-side processing, no backend API needed
 */
const { t } = useI18n()

// === State ===
const inputText = ref('')
const outputHtml = ref('')
const outputRaw = ref('')
const indentType = ref<'2' | '4' | 'tab'>('2')
const validationState = ref<'idle' | 'valid' | 'invalid'>('idle')
const errorMessage = ref('')
const errorLine = ref<number | null>(null)
const copySuccess = ref(false)
const isDragging = ref(false)

// === Computed ===
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

// === JSON Syntax Highlighting ===
function syntaxHighlight(json: string): string {
  // Escape HTML entities
  const escaped = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Apply syntax highlighting with CSS classes
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'json-number' // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key' // key
        } else {
          cls = 'json-string' // string value
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (/null/.test(match)) {
        cls = 'json-null'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

// === Parse Error Location ===
function getErrorLocation(error: SyntaxError, text: string): { line: number; message: string } {
  const msg = error.message
  // Try to extract position from error message
  const posMatch = msg.match(/position\s+(\d+)/i) || msg.match(/at\s+(\d+)/i)
  
  if (posMatch) {
    const pos = parseInt(posMatch[1])
    const beforeError = text.substring(0, pos)
    const line = beforeError.split('\n').length
    return { line, message: msg }
  }

  // Try column-based match
  const colMatch = msg.match(/column\s+(\d+)/i)
  const lineMatch = msg.match(/line\s+(\d+)/i)
  if (lineMatch) {
    return { line: parseInt(lineMatch[1]), message: msg }
  }

  // Fallback: try to find the approximate error position
  return { line: 1, message: msg }
}

// === Validation (real-time) ===
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
      errorMessage.value = t('jsonFormatter.validation.errorAtLine', { line: loc.line }) + ': ' + loc.message
    } else {
      errorMessage.value = String(e)
    }
  }
}

// Watch input for real-time validation
watch(inputText, (val) => {
  validateJson(val)
})

// === Actions ===
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
      errorMessage.value = t('jsonFormatter.validation.errorAtLine', { line: loc.line }) + ': ' + loc.message
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
      errorMessage.value = t('jsonFormatter.validation.errorAtLine', { line: loc.line }) + ': ' + loc.message
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
    // Fallback
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

// === Drag & Drop ===
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
  if (!files || files.length === 0) return

  const file = files[0]
  if (!file.name.endsWith('.json') && file.type !== 'application/json') return

  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result as string
    if (content) {
      inputText.value = content
      // Auto-format on file drop
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
    <!-- Drag overlay -->
    <Transition name="fade">
      <div 
        v-if="isDragging"
        class="fixed inset-0 z-50 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 border-2 border-dashed border-blue-400 dark:border-blue-500">
          <Icon name="heroicons:document-arrow-down" class="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <p class="text-xl font-semibold text-gray-700 dark:text-gray-200">{{ $t('jsonFormatter.dropHint') }}</p>
        </div>
      </div>
    </Transition>

    <!-- Toolbar -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Action Buttons -->
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          @click="formatJson"
        >
          <Icon name="heroicons:code-bracket" class="w-4 h-4" aria-hidden="true" />
          {{ $t('jsonFormatter.actions.format') }}
        </button>

        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          @click="minifyJson"
        >
          <Icon name="heroicons:arrows-pointing-in" class="w-4 h-4" aria-hidden="true" />
          {{ $t('jsonFormatter.actions.minify') }}
        </button>

        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          :class="copySuccess 
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
            : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'"
          :disabled="!outputRaw"
          @click="copyOutput"
        >
          <Icon :name="copySuccess ? 'heroicons:check' : 'heroicons:clipboard-document'" class="w-4 h-4" aria-hidden="true" />
          {{ copySuccess ? $t('jsonFormatter.actions.copySuccess') : $t('jsonFormatter.actions.copy') }}
        </button>

        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          @click="clearAll"
        >
          <Icon name="heroicons:trash" class="w-4 h-4" aria-hidden="true" />
          {{ $t('jsonFormatter.actions.clear') }}
        </button>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Indent Options -->
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('jsonFormatter.indent.label') }}:</span>
          <div class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              v-for="opt in [
                { value: '2', label: $t('jsonFormatter.indent.spaces2') },
                { value: '4', label: $t('jsonFormatter.indent.spaces4') },
                { value: 'tab', label: $t('jsonFormatter.indent.tab') }
              ]"
              :key="opt.value"
              class="px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              :class="indentType === opt.value 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
              @click="indentType = opt.value as '2' | '4' | 'tab'"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Validation Status -->
      <div v-if="validationState !== 'idle'" class="mt-3 flex items-center gap-2">
        <div 
          v-if="validationState === 'valid'"
          class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
        >
          <Icon name="heroicons:check-circle" class="w-5 h-5" aria-hidden="true" />
          {{ $t('jsonFormatter.validation.valid') }}
        </div>
        <div 
          v-else-if="validationState === 'invalid'"
          class="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
        >
          <Icon name="heroicons:exclamation-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>

    <!-- Editor Panels -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Input Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <!-- Input Header -->
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:pencil-square" class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Input</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ inputStats.chars }} {{ $t('jsonFormatter.info.characters') }}</span>
            <span>{{ inputStats.lines }} {{ $t('jsonFormatter.info.lines') }}</span>
            <span>{{ inputStats.size }}</span>
          </div>
        </div>
        <!-- Input Textarea -->
        <textarea
          v-model="inputText"
          :placeholder="$t('jsonFormatter.inputPlaceholder')"
          class="flex-1 w-full min-h-[400px] lg:min-h-[500px] p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
          :class="{ 'border-l-4 border-l-red-400': validationState === 'invalid' }"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
        />
      </div>

      <!-- Output Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <!-- Output Header -->
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:eye" class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Output</span>
          </div>
          <div v-if="outputRaw" class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ outputStats.chars }} {{ $t('jsonFormatter.info.characters') }}</span>
            <span>{{ outputStats.lines }} {{ $t('jsonFormatter.info.lines') }}</span>
            <span>{{ outputStats.size }}</span>
          </div>
        </div>
        <!-- Output Display -->
        <div class="flex-1 min-h-[400px] lg:min-h-[500px] overflow-auto">
          <pre
            v-if="outputHtml"
            class="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words json-output"
            v-html="outputHtml"
          />
          <div 
            v-else 
            class="flex items-center justify-center h-full min-h-[400px] lg:min-h-[500px] text-gray-400 dark:text-gray-500"
          >
            <div class="text-center">
              <Icon name="heroicons:code-bracket-square" class="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
              <p class="text-sm">{{ $t('jsonFormatter.outputPlaceholder') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* JSON Syntax Highlighting - Light Mode */
.json-output :deep(.json-key) {
  color: #881391;
}
.json-output :deep(.json-string) {
  color: #0b7285;
}
.json-output :deep(.json-number) {
  color: #c92a2a;
}
.json-output :deep(.json-boolean) {
  color: #5c7cfa;
}
.json-output :deep(.json-null) {
  color: #868e96;
}

/* JSON Syntax Highlighting - Dark Mode */
:root.dark .json-output :deep(.json-key),
.dark .json-output :deep(.json-key) {
  color: #c792ea;
}
:root.dark .json-output :deep(.json-string),
.dark .json-output :deep(.json-string) {
  color: #c3e88d;
}
:root.dark .json-output :deep(.json-number),
.dark .json-output :deep(.json-number) {
  color: #f78c6c;
}
:root.dark .json-output :deep(.json-boolean),
.dark .json-output :deep(.json-boolean) {
  color: #89ddff;
}
:root.dark .json-output :deep(.json-null),
.dark .json-output :deep(.json-null) {
  color: #676e95;
}

/* Fade transition for drag overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dark mode bg helper */
.dark .bg-gray-750 {
  background-color: rgb(38, 42, 51);
}
</style>
