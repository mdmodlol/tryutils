<script setup lang="ts">
/**
 * UrlCodec Component
 * URL encoding/decoding tool
 * Pure client-side processing, no backend API needed
 */
const { t } = useI18n()

// === State ===
const mode = ref<'encode' | 'decode'>('encode')
const encodeType = ref<'component' | 'full'>('component')
const inputText = ref('')
const outputText = ref('')
const copySuccess = ref(false)
const errorMessage = ref('')

// === Computed ===
const inputStats = computed(() => {
  const text = inputText.value
  const chars = text.length
  const bytes = new Blob([text]).size
  return { chars, size: formatSize(bytes) }
})

const outputStats = computed(() => {
  const text = outputText.value
  const chars = text.length
  const bytes = new Blob([text]).size
  return { chars, size: formatSize(bytes) }
})

const inputPlaceholder = computed(() =>
  mode.value === 'encode'
    ? t('urlCodec.inputPlaceholder.encode')
    : t('urlCodec.inputPlaceholder.decode')
)

// === Helpers ===
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// === Actions ===
function processText(): void {
  errorMessage.value = ''
  const text = inputText.value

  if (!text.trim()) {
    errorMessage.value = t('urlCodec.validation.emptyInput')
    outputText.value = ''
    return
  }

  try {
    if (mode.value === 'encode') {
      outputText.value = encodeType.value === 'component'
        ? encodeURIComponent(text)
        : encodeURI(text)
    } else {
      // Try decodeURIComponent first, fall back to decodeURI
      try {
        outputText.value = decodeURIComponent(text)
      } catch {
        outputText.value = decodeURI(text)
      }
    }
  } catch {
    errorMessage.value = mode.value === 'decode'
      ? t('urlCodec.validation.invalidUrl')
      : t('urlCodec.validation.encodeFailed')
    outputText.value = ''
  }
}

async function copyOutput(): Promise<void> {
  if (!outputText.value) return
  try {
    await navigator.clipboard.writeText(outputText.value)
    copySuccess.value = true
    setTimeout(() => { copySuccess.value = false }, 2000)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = outputText.value
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
  outputText.value = ''
  errorMessage.value = ''
}

function swapInputOutput(): void {
  if (!outputText.value) return
  const temp = outputText.value
  outputText.value = ''
  inputText.value = temp
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

function loadExample(): void {
  if (mode.value === 'encode') {
    inputText.value = 'https://www.example.com/search?q=你好世界&lang=zh-CN&page=1#results'
  } else {
    inputText.value = 'https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3D%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C%26lang%3Dzh-CN%26page%3D1%23results'
  }
  processText()
}

// Auto-process on input change
watch([inputText, mode, encodeType], () => {
  if (inputText.value.trim()) {
    processText()
  } else {
    outputText.value = ''
    errorMessage.value = ''
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Mode Toggle -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <!-- Encode/Decode Toggle -->
        <div class="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600" role="radiogroup" :aria-label="t('urlCodec.modeLabel')">
          <button
            :class="[
              'px-5 py-2.5 text-sm font-medium transition-all duration-200',
              mode === 'encode'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            ]"
            role="radio"
            :aria-checked="mode === 'encode'"
            @click="mode = 'encode'"
          >
            {{ t('urlCodec.encode') }}
          </button>
          <button
            :class="[
              'px-5 py-2.5 text-sm font-medium transition-all duration-200',
              mode === 'decode'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            ]"
            role="radio"
            :aria-checked="mode === 'decode'"
            @click="mode = 'decode'"
          >
            {{ t('urlCodec.decode') }}
          </button>
        </div>

        <!-- Encode Type (only show in encode mode) -->
        <div v-if="mode === 'encode'" class="flex items-center gap-3">
          <label class="text-sm text-gray-600 dark:text-gray-400">{{ t('urlCodec.encodeType') }}:</label>
          <select
            v-model="encodeType"
            class="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="component">encodeURIComponent</option>
            <option value="full">encodeURI</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
            @click="loadExample"
          >
            <Icon name="heroicons:beaker" class="w-4 h-4 mr-1" aria-hidden="true" />
            {{ t('urlCodec.example') }}
          </button>
          <button
            class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-red-300 dark:hover:border-red-500 transition-colors"
            @click="clearAll"
          >
            <Icon name="heroicons:trash" class="w-4 h-4 mr-1" aria-hidden="true" />
            {{ t('urlCodec.clear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Input/Output Area -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('urlCodec.input') }}
          </h3>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ inputStats.chars }} {{ t('urlCodec.chars') }} · {{ inputStats.size }}
          </span>
        </div>
        <textarea
          v-model="inputText"
          :placeholder="inputPlaceholder"
          class="w-full h-64 p-4 text-sm font-mono bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none"
          spellcheck="false"
          :aria-label="t('urlCodec.input')"
        />
      </div>

      <!-- Swap Button (between input and output on mobile) -->
      <div class="lg:hidden flex justify-center -my-3">
        <button
          class="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          :aria-label="t('urlCodec.swap')"
          @click="swapInputOutput"
        >
          <Icon name="heroicons:arrows-up-down" class="w-5 h-5 text-gray-600 dark:text-gray-400" aria-hidden="true" />
        </button>
      </div>

      <!-- Output -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative">
        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t('urlCodec.output') }}
            </h3>
            <!-- Swap button for desktop -->
            <button
              class="hidden lg:inline-flex p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              :aria-label="t('urlCodec.swap')"
              @click="swapInputOutput"
            >
              <Icon name="heroicons:arrows-right-left" class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ outputStats.chars }} {{ t('urlCodec.chars') }} · {{ outputStats.size }}
            </span>
            <button
              v-if="outputText"
              class="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors"
              :class="copySuccess
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'"
              @click="copyOutput"
            >
              <Icon
                :name="copySuccess ? 'heroicons:check' : 'heroicons:clipboard-document'"
                class="w-3.5 h-3.5"
                aria-hidden="true"
              />
              {{ copySuccess ? t('urlCodec.copied') : t('urlCodec.copy') }}
            </button>
          </div>
        </div>
        <textarea
          :value="outputText"
          readonly
          class="w-full h-64 p-4 text-sm font-mono bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none"
          :placeholder="t('urlCodec.outputPlaceholder')"
          :aria-label="t('urlCodec.output')"
        />
      </div>
    </div>

    <!-- Error Message -->
    <div
      v-if="errorMessage"
      class="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400"
      role="alert"
    >
      <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 flex-shrink-0" aria-hidden="true" />
      <span class="text-sm">{{ errorMessage }}</span>
    </div>

    <!-- Encode Type Explanation -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {{ t('urlCodec.encodeTypeExplain.title') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h4 class="font-mono text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">encodeURIComponent</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('urlCodec.encodeTypeExplain.component') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-2 font-mono">
            {{ t('urlCodec.encodeTypeExplain.componentKeeps') }}
          </p>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
          <h4 class="font-mono text-sm font-semibold text-green-700 dark:text-green-400 mb-2">encodeURI</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('urlCodec.encodeTypeExplain.full') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-2 font-mono">
            {{ t('urlCodec.encodeTypeExplain.fullKeeps') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
