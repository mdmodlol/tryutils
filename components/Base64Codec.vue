<script setup lang="ts">
/**
 * Base64Codec Component
 * Base64 encoding/decoding for text and images
 * Pure client-side processing, no backend API needed
 */
const { t } = useI18n()

// === State ===
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

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// === Computed ===
const inputStats = computed(() => {
  const text = inputText.value
  const chars = text.length
  const bytes = new Blob([text]).size
  const size = formatSize(bytes)
  return { chars, size }
})

const outputStats = computed(() => {
  const text = outputText.value
  const chars = text.length
  const bytes = new Blob([text]).size
  const size = formatSize(bytes)
  return { chars, size }
})

const inputPlaceholder = computed(() =>
  mode.value === 'encode'
    ? t('base64Codec.inputPlaceholder.encode')
    : t('base64Codec.inputPlaceholder.decode')
)

// === Helpers ===
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// UTF-8 safe Base64 encode
function utf8ToBase64(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

// UTF-8 safe Base64 decode
function base64ToUtf8(base64: string): string {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

// === Actions ===
function processText(): void {
  errorMessage.value = ''
  const text = inputText.value

  if (!text.trim()) {
    errorMessage.value = t('base64Codec.validation.emptyInput')
    outputText.value = ''
    return
  }

  try {
    if (mode.value === 'encode') {
      outputText.value = utf8ToBase64(text)
    } else {
      // Clean up whitespace/newlines in base64 input
      const cleaned = text.replace(/\s/g, '')
      outputText.value = base64ToUtf8(cleaned)
    }
  } catch {
    errorMessage.value = mode.value === 'decode'
      ? t('base64Codec.validation.invalidBase64')
      : t('base64Codec.validation.invalidBase64')
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
  // Toggle mode
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

// === Image Handling ===
function handleFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  processImageFile(input.files[0])
}

function processImageFile(file: File): void {
  errorMessage.value = ''

  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = t('base64Codec.validation.fileTooLarge', { size: '5MB' })
    return
  }

  if (!file.type.startsWith('image/')) {
    return
  }

  imageFileName.value = file.name

  if (mode.value === 'encode') {
    // Image -> Base64
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
    // Check if it's a data URL or raw base64
    if (text.startsWith('data:image/')) {
      imagePreviewUrl.value = text
    } else {
      // Try to create a data URL from raw base64
      imagePreviewUrl.value = `data:image/png;base64,${text}`
    }
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
    <!-- Drag overlay -->
    <Transition name="fade">
      <div
        v-if="isDragging"
        class="fixed inset-0 z-50 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center pointer-events-none"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 border-2 border-dashed border-blue-400 dark:border-blue-500">
          <Icon name="heroicons:photo" class="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <p class="text-xl font-semibold text-gray-700 dark:text-gray-200">{{ $t('base64Codec.imageUpload.dragText') }}</p>
        </div>
      </div>
    </Transition>

    <!-- Toolbar -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <div class="flex flex-wrap items-center gap-3">
        <!-- Mode Toggle (Encode / Decode) -->
        <div class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            class="px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            :class="mode === 'encode'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
            @click="mode = 'encode'"
          >
            <Icon name="heroicons:lock-closed" class="w-4 h-4 inline-block mr-1" aria-hidden="true" />
            {{ $t('base64Codec.mode.encode') }}
          </button>
          <button
            class="px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            :class="mode === 'decode'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
            @click="mode = 'decode'"
          >
            <Icon name="heroicons:lock-open" class="w-4 h-4 inline-block mr-1" aria-hidden="true" />
            {{ $t('base64Codec.mode.decode') }}
          </button>
        </div>

        <!-- Content Type Toggle (Text / Image) -->
        <div class="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
          <button
            class="px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
            :class="contentType === 'text'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
            @click="contentType = 'text'"
          >
            <Icon name="heroicons:document-text" class="w-4 h-4 inline-block mr-1" aria-hidden="true" />
            {{ $t('base64Codec.textMode') }}
          </button>
          <button
            class="px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
            :class="contentType === 'image'
              ? 'bg-purple-600 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'"
            @click="contentType = 'image'"
          >
            <Icon name="heroicons:photo" class="w-4 h-4 inline-block mr-1" aria-hidden="true" />
            {{ $t('base64Codec.imageMode') }}
          </button>
        </div>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Action Buttons -->
        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          @click="contentType === 'text' ? processText() : (mode === 'decode' ? decodeImageFromBase64() : triggerFileInput())"
        >
          <Icon :name="mode === 'encode' ? 'heroicons:lock-closed' : 'heroicons:lock-open'" class="w-4 h-4" aria-hidden="true" />
          {{ mode === 'encode' ? $t('base64Codec.actions.encode') : $t('base64Codec.actions.decode') }}
        </button>

        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          :class="copySuccess
            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'"
          :disabled="!outputText && !imagePreviewUrl"
          @click="copyOutput"
        >
          <Icon :name="copySuccess ? 'heroicons:check' : 'heroicons:clipboard-document'" class="w-4 h-4" aria-hidden="true" />
          {{ copySuccess ? $t('base64Codec.actions.copySuccess') : $t('base64Codec.actions.copy') }}
        </button>

        <button
          v-if="contentType === 'text'"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          :disabled="!outputText"
          @click="swapInputOutput"
        >
          <Icon name="heroicons:arrows-right-left" class="w-4 h-4" aria-hidden="true" />
          {{ $t('base64Codec.actions.swap') }}
        </button>

        <button
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          @click="clearAll"
        >
          <Icon name="heroicons:trash" class="w-4 h-4" aria-hidden="true" />
          {{ $t('base64Codec.actions.clear') }}
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mt-3 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
        <Icon name="heroicons:exclamation-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <span>{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Text Mode Panels -->
    <div v-if="contentType === 'text'" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Input Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:pencil-square" class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Input</span>
          </div>
          <div class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ inputStats.chars }} {{ $t('base64Codec.info.characters') }}</span>
            <span>{{ inputStats.size }}</span>
          </div>
        </div>
        <textarea
          v-model="inputText"
          :placeholder="inputPlaceholder"
          class="flex-1 w-full min-h-[400px] lg:min-h-[500px] p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
          spellcheck="false"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
        />
      </div>

      <!-- Output Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:eye" class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Output</span>
          </div>
          <div v-if="outputText" class="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>{{ outputStats.chars }} {{ $t('base64Codec.info.characters') }}</span>
            <span>{{ outputStats.size }}</span>
          </div>
        </div>
        <div class="flex-1 min-h-[400px] lg:min-h-[500px] overflow-auto">
          <pre
            v-if="outputText"
            class="p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100"
          >{{ outputText }}</pre>
          <div
            v-else
            class="flex items-center justify-center h-full min-h-[400px] lg:min-h-[500px] text-gray-400 dark:text-gray-500"
          >
            <div class="text-center">
              <Icon name="heroicons:code-bracket-square" class="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
              <p class="text-sm">{{ $t('base64Codec.outputPlaceholder') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Mode -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- Image Input Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:photo" class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'encode' ? $t('base64Codec.imageUpload.selectFile') : 'Base64 Input' }}
            </span>
          </div>
        </div>

        <div v-if="mode === 'encode'" class="flex-1 min-h-[400px] lg:min-h-[500px] flex items-center justify-center p-8">
          <!-- File Upload Area -->
          <div
            class="w-full h-full min-h-[300px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
            @click="triggerFileInput"
          >
            <Icon name="heroicons:cloud-arrow-up" class="w-16 h-16 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <div class="text-center">
              <p class="text-gray-600 dark:text-gray-400">
                {{ $t('base64Codec.imageUpload.dragText') }}
              </p>
              <button
                class="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                @click.stop="triggerFileInput"
              >
                <Icon name="heroicons:folder-open" class="w-4 h-4" aria-hidden="true" />
                {{ $t('base64Codec.imageUpload.selectFile') }}
              </button>
            </div>
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />
          </div>
        </div>

        <div v-else class="flex-1 min-h-[400px] lg:min-h-[500px]">
          <!-- Base64 Input for Decode -->
          <textarea
            v-model="inputText"
            :placeholder="$t('base64Codec.inputPlaceholder.decode')"
            class="w-full h-full min-h-[400px] lg:min-h-[500px] p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
            spellcheck="false"
            autocomplete="off"
          />
        </div>
      </div>

      <!-- Image Output Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <div class="flex items-center gap-2">
            <Icon name="heroicons:eye" class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ mode === 'encode' ? 'Base64 Output' : $t('base64Codec.imageUpload.preview') }}
            </span>
          </div>
          <div v-if="mode === 'decode' && imagePreviewUrl" class="flex items-center gap-2">
            <button
              class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
              @click="downloadImage"
            >
              <Icon name="heroicons:arrow-down-tray" class="w-3.5 h-3.5" aria-hidden="true" />
              {{ $t('base64Codec.imageUpload.downloadImage') }}
            </button>
          </div>
        </div>

        <div class="flex-1 min-h-[400px] lg:min-h-[500px] overflow-auto">
          <!-- Encode mode: show base64 output -->
          <template v-if="mode === 'encode'">
            <pre
              v-if="outputText"
              class="p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all text-gray-900 dark:text-gray-100"
            >{{ outputText }}</pre>
            <div
              v-else
              class="flex items-center justify-center h-full min-h-[400px] lg:min-h-[500px] text-gray-400 dark:text-gray-500"
            >
              <div class="text-center">
                <Icon name="heroicons:photo" class="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p class="text-sm">{{ $t('base64Codec.outputPlaceholder') }}</p>
              </div>
            </div>
          </template>

          <!-- Decode mode: show image preview -->
          <template v-else>
            <div
              v-if="imagePreviewUrl"
              class="p-4 flex items-center justify-center h-full"
            >
              <img
                :src="imagePreviewUrl"
                alt="Decoded image preview"
                class="max-w-full max-h-[460px] object-contain rounded-lg shadow-md"
                @error="handleImageError"
              />
            </div>
            <div
              v-else
              class="flex items-center justify-center h-full min-h-[400px] lg:min-h-[500px] text-gray-400 dark:text-gray-500"
            >
              <div class="text-center">
                <Icon name="heroicons:photo" class="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p class="text-sm">{{ $t('base64Codec.outputPlaceholder') }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
