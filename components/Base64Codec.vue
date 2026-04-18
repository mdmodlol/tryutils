<script setup lang="ts">
/**
 * Base64Codec Component
 * Base64 encoding/decoding for text and images
 * Pure client-side processing, no backend API needed
 */
const { t } = useI18n()

const mode = ref<'encode' | 'decode'>('encode')
const contentType = ref<'text' | 'image'>('text')
const inputText = ref('')
const outputText = ref('')
const copySuccess = ref(false)
const errorMessage = ref('')
const isDragging = ref(false)
const imagePreviewUrl = ref('')
const imageFileName = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

const MAX_FILE_SIZE = 5 * 1024 * 1024

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
    ? t('base64Codec.inputPlaceholder.encode')
    : t('base64Codec.inputPlaceholder.decode')
)

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function utf8ToBase64(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64ToUtf8(base64: string): string {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

function processText(): void {
  errorMessage.value = ''
  const text = inputText.value

  if (!text.trim()) {
    errorMessage.value = t('base64Codec.validation.emptyInput')
    outputText.value = ''
    return
  }

  try {
    outputText.value = mode.value === 'encode'
      ? utf8ToBase64(text)
      : base64ToUtf8(text.replace(/\s/g, ''))
  } catch {
    errorMessage.value = t('base64Codec.validation.invalidBase64')
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
  imagePreviewUrl.value = ''
  imageFileName.value = ''
}

function swapInputOutput(): void {
  if (!outputText.value) return
  const temp = outputText.value
  outputText.value = ''
  inputText.value = temp
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

function handleFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  processImageFile(input.files[0])
}

function processImageFile(file: File): void {
  errorMessage.value = ''

  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = t('base64Codec.validation.fileTooLarge', { size: '5MB' })
    return
  }

  if (!file.type.startsWith('image/')) return

  imageFileName.value = file.name

  if (mode.value === 'encode') {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (result) {
        outputText.value = result
        inputText.value = ''
      }
    }
    reader.readAsDataURL(file)
  }
}

function decodeImageFromBase64(): void {
  errorMessage.value = ''
  const text = inputText.value.trim()

  if (!text) {
    errorMessage.value = t('base64Codec.validation.emptyInput')
    return
  }

  try {
    imagePreviewUrl.value = text.startsWith('data:image/')
      ? text
      : `data:image/png;base64,${text}`
  } catch {
    errorMessage.value = t('base64Codec.validation.invalidBase64')
    imagePreviewUrl.value = ''
  }
}

function downloadImage(): void {
  if (!imagePreviewUrl.value) return
  const link = document.createElement('a')
  link.href = imagePreviewUrl.value
  link.download = imageFileName.value || 'decoded-image.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function triggerFileInput(): void {
  fileInputRef.value?.click()
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
  if (file.type.startsWith('image/')) {
    contentType.value = 'image'
    mode.value = 'encode'
    processImageFile(file)
  }
}

function handleImageError(): void {
  errorMessage.value = t('base64Codec.validation.invalidBase64')
  imagePreviewUrl.value = ''
}
</script>

<template>
  <div
    class="base64-codec"
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
          <Icon name="heroicons:photo" class="mx-auto mb-4 h-16 w-16 text-teal-600 dark:text-teal-300" />
          <p class="text-xl font-semibold text-slate-700 dark:text-slate-200">{{ t('base64Codec.imageUpload.dragText') }}</p>
        </div>
      </div>
    </Transition>

    <div class="mb-4 rounded-[28px] border border-slate-200 bg-white/95 p-5 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <div class="flex flex-wrap items-center gap-3">
        <div class="flex overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
          <button
            class="px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            :class="mode === 'encode'
              ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
              : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="mode = 'encode'"
          >
            <Icon name="heroicons:lock-closed" class="mr-1 inline-block h-4 w-4" aria-hidden="true" />
            {{ t('base64Codec.mode.encode') }}
          </button>
          <button
            class="px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            :class="mode === 'decode'
              ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
              : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="mode = 'decode'"
          >
            <Icon name="heroicons:lock-open" class="mr-1 inline-block h-4 w-4" aria-hidden="true" />
            {{ t('base64Codec.mode.decode') }}
          </button>
        </div>

        <div class="flex overflow-hidden rounded-full border border-slate-300 dark:border-slate-700">
          <button
            class="px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            :class="contentType === 'text'
              ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
              : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="contentType = 'text'"
          >
            <Icon name="heroicons:document-text" class="mr-1 inline-block h-4 w-4" aria-hidden="true" />
            {{ t('base64Codec.textMode') }}
          </button>
          <button
            class="px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
            :class="contentType === 'image'
              ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
              : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
            @click="contentType = 'image'"
          >
            <Icon name="heroicons:photo" class="mr-1 inline-block h-4 w-4" aria-hidden="true" />
            {{ t('base64Codec.imageMode') }}
          </button>
        </div>

        <div class="flex-1" />

        <button
          class="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-offset-slate-950"
          @click="contentType === 'text' ? processText() : (mode === 'decode' ? decodeImageFromBase64() : triggerFileInput())"
        >
          <Icon :name="mode === 'encode' ? 'heroicons:lock-closed' : 'heroicons:lock-open'" class="h-4 w-4" aria-hidden="true" />
          {{ mode === 'encode' ? t('base64Codec.actions.encode') : t('base64Codec.actions.decode') }}
        </button>

        <button
          class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          :class="copySuccess
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500'
            : 'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800'"
          :disabled="!outputText && !imagePreviewUrl"
          @click="copyOutput"
        >
          <Icon :name="copySuccess ? 'heroicons:check' : 'heroicons:clipboard-document'" class="h-4 w-4" aria-hidden="true" />
          {{ copySuccess ? t('base64Codec.actions.copySuccess') : t('base64Codec.actions.copy') }}
        </button>

        <button
          v-if="contentType === 'text'"
          class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:focus:ring-offset-slate-950"
          :disabled="!outputText"
          @click="swapInputOutput"
        >
          <Icon name="heroicons:arrows-right-left" class="h-4 w-4" aria-hidden="true" />
          {{ t('base64Codec.actions.swap') }}
        </button>

        <button
          class="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/60 dark:focus:ring-offset-slate-950"
          @click="clearAll"
        >
          <Icon name="heroicons:trash" class="h-4 w-4" aria-hidden="true" />
          {{ t('base64Codec.actions.clear') }}
        </button>
      </div>

      <div v-if="errorMessage" class="mt-4 flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400">
        <Icon name="heroicons:exclamation-circle" class="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
        <span>{{ errorMessage }}</span>
      </div>
    </div>

    <div v-if="contentType === 'text'" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:pencil-square" class="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ t('base64Codec.panels.input') }}</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{{ inputStats.chars }} {{ t('base64Codec.info.characters') }}</span>
            <span>{{ inputStats.size }}</span>
          </div>
        </div>
        <textarea
          v-model="inputText"
          :placeholder="inputPlaceholder"
          class="flex-1 min-h-[400px] w-full resize-none bg-white p-4 font-mono text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 lg:min-h-[500px]"
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
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ t('base64Codec.panels.output') }}</span>
          </div>
          <div v-if="outputText" class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>{{ outputStats.chars }} {{ t('base64Codec.info.characters') }}</span>
            <span>{{ outputStats.size }}</span>
          </div>
        </div>
        <div class="flex-1 min-h-[400px] overflow-auto lg:min-h-[500px]">
          <pre
            v-if="outputText"
            class="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-slate-900 dark:text-slate-100"
          >{{ outputText }}</pre>
          <div
            v-else
            class="flex h-full min-h-[400px] items-center justify-center text-slate-400 dark:text-slate-500 lg:min-h-[500px]"
          >
            <div class="text-center">
              <Icon name="heroicons:code-bracket-square" class="mx-auto mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
              <p class="text-sm">{{ t('base64Codec.outputPlaceholder') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:photo" class="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
              {{ mode === 'encode' ? t('base64Codec.imageUpload.selectFile') : t('base64Codec.panels.base64Input') }}
            </span>
          </div>
        </div>

        <div v-if="mode === 'encode'" class="flex flex-1 items-center justify-center p-8 lg:min-h-[500px]">
          <div
            class="flex h-full min-h-[300px] w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 transition-colors hover:border-teal-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-teal-500 dark:hover:bg-slate-900"
            @click="triggerFileInput"
          >
            <Icon name="heroicons:cloud-arrow-up" class="h-16 w-16 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            <div class="text-center">
              <p class="text-slate-600 dark:text-slate-400">
                {{ t('base64Codec.imageUpload.dragText') }}
              </p>
              <button
                class="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
                @click.stop="triggerFileInput"
              >
                <Icon name="heroicons:folder-open" class="h-4 w-4" aria-hidden="true" />
                {{ t('base64Codec.imageUpload.selectFile') }}
              </button>
            </div>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            >
          </div>
        </div>

        <div v-else class="flex-1 min-h-[400px] lg:min-h-[500px]">
          <textarea
            v-model="inputText"
            :placeholder="t('base64Codec.inputPlaceholder.decode')"
            class="h-full min-h-[400px] w-full resize-none bg-white p-4 font-mono text-sm leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 lg:min-h-[500px]"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      </div>

      <div class="flex flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:eye" class="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
            <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
              {{ mode === 'encode' ? t('base64Codec.panels.base64Output') : t('base64Codec.imageUpload.preview') }}
            </span>
          </div>
          <div v-if="mode === 'decode' && imagePreviewUrl" class="flex items-center gap-2">
            <button
              class="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              @click="downloadImage"
            >
              <Icon name="heroicons:arrow-down-tray" class="h-3.5 w-3.5" aria-hidden="true" />
              {{ t('base64Codec.imageUpload.downloadImage') }}
            </button>
          </div>
        </div>

        <div class="flex-1 min-h-[400px] overflow-auto lg:min-h-[500px]">
          <template v-if="mode === 'encode'">
            <pre
              v-if="outputText"
              class="p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all text-slate-900 dark:text-slate-100"
            >{{ outputText }}</pre>
            <div
              v-else
              class="flex h-full min-h-[400px] items-center justify-center text-slate-400 dark:text-slate-500 lg:min-h-[500px]"
            >
              <div class="text-center">
                <Icon name="heroicons:photo" class="mx-auto mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
                <p class="text-sm">{{ t('base64Codec.outputPlaceholder') }}</p>
              </div>
            </div>
          </template>

          <template v-else>
            <div v-if="imagePreviewUrl" class="flex h-full items-center justify-center p-4">
              <img
                :src="imagePreviewUrl"
                alt="Decoded image preview"
                class="max-h-[460px] max-w-full rounded-2xl border border-slate-200 object-contain dark:border-slate-700"
                @error="handleImageError"
              >
            </div>
            <div
              v-else
              class="flex h-full min-h-[400px] items-center justify-center text-slate-400 dark:text-slate-500 lg:min-h-[500px]"
            >
              <div class="text-center">
                <Icon name="heroicons:photo" class="mx-auto mb-3 h-12 w-12 opacity-50" aria-hidden="true" />
                <p class="text-sm">{{ t('base64Codec.outputPlaceholder') }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
