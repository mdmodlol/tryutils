<script setup lang="ts">
/**
 * UrlCodec Component
 * URL encoding/decoding tool
 * Pure client-side processing, no backend API needed
 */
const { t } = useI18n()

const mode = ref<'encode' | 'decode'>('encode')
const encodeType = ref<'component' | 'full'>('component')
const inputText = ref('')
const outputText = ref('')
const copySuccess = ref(false)
const errorMessage = ref('')

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

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

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
      outputText.value = encodeType.value === 'component' ? encodeURIComponent(text) : encodeURI(text)
    } else {
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
    inputText.value = 'https://www.example.com/search?q=hello world&lang=en&page=1#results'
  } else {
    inputText.value = 'https%3A%2F%2Fwww.example.com%2Fsearch%3Fq%3Dhello%2520world%26lang%3Den%26page%3D1%23results'
  }
  processText()
}

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
    <div class="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div class="flex overflow-hidden rounded-full border border-slate-300 dark:border-slate-700" role="radiogroup" :aria-label="t('urlCodec.modeLabel')">
          <button
            :class="[
              'px-5 py-2.5 text-sm font-medium transition-colors',
              mode === 'encode'
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
                : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            ]"
            role="radio"
            :aria-checked="mode === 'encode'"
            @click="mode = 'encode'"
          >
            {{ t('urlCodec.encode') }}
          </button>
          <button
            :class="[
              'px-5 py-2.5 text-sm font-medium transition-colors',
              mode === 'decode'
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
                : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            ]"
            role="radio"
            :aria-checked="mode === 'decode'"
            @click="mode = 'decode'"
          >
            {{ t('urlCodec.decode') }}
          </button>
        </div>

        <div v-if="mode === 'encode'" class="flex items-center gap-3">
          <label class="text-sm text-slate-600 dark:text-slate-400">{{ t('urlCodec.encodeType') }}:</label>
          <select
            v-model="encodeType"
            class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="component">encodeURIComponent</option>
            <option value="full">encodeURI</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
            @click="loadExample"
          >
            <Icon name="heroicons:beaker" class="mr-1 h-4 w-4" aria-hidden="true" />
            {{ t('urlCodec.example') }}
          </button>
          <button
            class="inline-flex items-center rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50 dark:border-rose-900/70 dark:text-rose-300 dark:hover:bg-rose-950/50"
            @click="clearAll"
          >
            <Icon name="heroicons:trash" class="mr-1 h-4 w-4" aria-hidden="true" />
            {{ t('urlCodec.clear') }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div class="overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">
            {{ t('urlCodec.input') }}
          </h3>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {{ inputStats.chars }} {{ t('urlCodec.chars') }} · {{ inputStats.size }}
          </span>
        </div>
        <textarea
          v-model="inputText"
          :placeholder="inputPlaceholder"
          class="h-64 w-full resize-none bg-transparent p-4 font-mono text-sm text-slate-800 placeholder-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder-slate-500"
          spellcheck="false"
          :aria-label="t('urlCodec.input')"
        />
      </div>

      <div class="flex justify-center lg:hidden -my-3">
        <button
          class="rounded-full border border-slate-300 bg-white p-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          :aria-label="t('urlCodec.swap')"
          @click="swapInputOutput"
        >
          <Icon name="heroicons:arrows-up-down" class="h-5 w-5 text-slate-600 dark:text-slate-400" aria-hidden="true" />
        </button>
      </div>

      <div class="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-medium text-slate-700 dark:text-slate-300">
              {{ t('urlCodec.output') }}
            </h3>
            <button
              class="hidden rounded-full p-1 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 lg:inline-flex"
              :aria-label="t('urlCodec.swap')"
              @click="swapInputOutput"
            >
              <Icon name="heroicons:arrows-right-left" class="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-500 dark:text-slate-400">
              {{ outputStats.chars }} {{ t('urlCodec.chars') }} · {{ outputStats.size }}
            </span>
            <button
              v-if="outputText"
              class="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors"
              :class="copySuccess
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
              @click="copyOutput"
            >
              <Icon
                :name="copySuccess ? 'heroicons:check' : 'heroicons:clipboard-document'"
                class="h-3.5 w-3.5"
                aria-hidden="true"
              />
              {{ copySuccess ? t('urlCodec.copied') : t('urlCodec.copy') }}
            </button>
          </div>
        </div>
        <textarea
          :value="outputText"
          readonly
          class="h-64 w-full resize-none bg-transparent p-4 font-mono text-sm text-slate-800 placeholder-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder-slate-500"
          :placeholder="t('urlCodec.outputPlaceholder')"
          :aria-label="t('urlCodec.output')"
        />
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="flex items-center gap-2 rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-300"
      role="alert"
    >
      <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <span class="text-sm">{{ errorMessage }}</span>
    </div>

    <div class="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <h3 class="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
        {{ t('urlCodec.encodeTypeExplain.title') }}
      </h3>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <h4 class="mb-2 font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">encodeURIComponent</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ t('urlCodec.encodeTypeExplain.component') }}
          </p>
          <p class="mt-2 font-mono text-xs text-slate-500 dark:text-slate-500">
            {{ t('urlCodec.encodeTypeExplain.componentKeeps') }}
          </p>
        </div>
        <div class="rounded-[22px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <h4 class="mb-2 font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">encodeURI</h4>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ t('urlCodec.encodeTypeExplain.full') }}
          </p>
          <p class="mt-2 font-mono text-xs text-slate-500 dark:text-slate-500">
            {{ t('urlCodec.encodeTypeExplain.fullKeeps') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
