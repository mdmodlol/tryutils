<template>
  <div class="qr-code-generator" role="main" :aria-label="$t('qrCodeGenerator.aria.region')">
    <!-- 模式切换 -->
    <nav class="mode-toggle mb-6" :aria-label="$t('qrCodeGenerator.aria.modeSelection')">
      <div class="flex items-center gap-4" role="group" :aria-label="$t('qrCodeGenerator.aria.modeToggleGroup')">
        <button
          type="button"
          class="rounded-full px-6 py-3 text-sm font-medium transition-colors"
          :class="mode === 'single' 
            ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950' 
            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          :aria-pressed="mode === 'single'"
          :aria-label="$t('qrCodeGenerator.mode.single')"
          @click="switchMode('single')"
        >
          {{ $t('qrCodeGenerator.mode.single') }}
        </button>
        <button
          type="button"
          class="rounded-full px-6 py-3 text-sm font-medium transition-colors"
          :class="mode === 'batch' 
            ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950' 
            : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          :aria-pressed="mode === 'batch'"
          :aria-label="$t('qrCodeGenerator.mode.batch')"
          @click="switchMode('batch')"
        >
          {{ $t('qrCodeGenerator.mode.batch') }}
        </button>
      </div>
    </nav>

    <!-- 错误提示 -->
    <aside
      v-if="globalError"
      class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="flex items-start gap-3">
        <svg
          class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-medium text-red-800 dark:text-red-200">
            {{ globalError }}
          </p>
        </div>
        <button
          type="button"
          class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          :aria-label="$t('qrCodeGenerator.aria.closeError')"
          @click="clearError"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </aside>

    <!-- 单个模式 -->
    <section v-if="mode === 'single'" class="single-mode" aria-labelledby="single-mode-heading">
      <h2 id="single-mode-heading" class="sr-only">{{ $t('qrCodeGenerator.aria.singleHeading') }}</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：输入和设置 -->
        <article class="input-settings-panel space-y-6" :aria-label="$t('qrCodeGenerator.aria.inputSettings')">
          <!-- 文本输入 -->
          <div class="input-section rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
            <label
              for="qr-input"
              class="block text-lg font-semibold mb-3 dark:text-white"
            >
              {{ $t('qrCodeGenerator.input.label') }}
            </label>
            <textarea
              id="qr-input"
              v-model="singleInput"
              class="w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              :placeholder="$t('qrCodeGenerator.input.placeholder')"
              rows="4"
              :aria-label="$t('qrCodeGenerator.input.label')"
              :aria-describedby="singleInput.length > 0 ? 'char-count' : undefined"
              :aria-invalid="singleInput.length > 2000"
            />
            <p id="char-count" class="mt-2 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
              {{ singleInput.length }} / 2000 {{ $t('common.characters') }}
            </p>
          </div>

          <!-- 设置面板 -->
          <QRCodeSettings
            v-model="options"
            @update:model-value="handleSettingsChange"
          />

          <!-- 操作按钮 -->
          <div class="actions flex gap-4" role="group" :aria-label="$t('qrCodeGenerator.aria.actionGroup')">
            <button
              type="button"
              class="flex-1 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              :disabled="!canGenerate || isGenerating"
              :aria-busy="isGenerating"
              :aria-label="isGenerating ? $t('qrCodeGenerator.actions.generating') : $t('qrCodeGenerator.actions.generate')"
              @click="generateSingle"
            >
              {{ isGenerating ? $t('qrCodeGenerator.actions.generating') : $t('qrCodeGenerator.actions.generate') }}
            </button>
            <button
              type="button"
              class="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              :aria-label="$t('qrCodeGenerator.actions.reset')"
              @click="resetSingle"
            >
              {{ $t('qrCodeGenerator.actions.reset') }}
            </button>
          </div>

          <!-- 下载按钮 -->
          <div v-if="singleResult" class="download-actions flex gap-4" role="group" :aria-label="$t('qrCodeGenerator.aria.downloadGroup')">
            <button
              type="button"
              class="flex-1 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              :disabled="isExporting"
              :aria-busy="isExporting"
              :aria-label="isExporting ? $t('qrCodeGenerator.actions.downloading') : $t('qrCodeGenerator.actions.download')"
              @click="downloadSingle"
            >
              {{ isExporting ? $t('qrCodeGenerator.actions.downloading') : $t('qrCodeGenerator.actions.download') }}
            </button>
          </div>
        </article>

        <!-- 右侧：预览 -->
        <aside
          class="preview-panel"
          :aria-label="$t('qrCodeGenerator.aria.previewRegion')"
          @dragenter="handleDragEnter"
          @dragleave="handleDragLeave"
          @dragover="handleDragOver"
          @drop="handleDrop"
        >
          <div
            v-if="isDragging"
            class="drag-overlay absolute inset-0 z-10 flex items-center justify-center rounded-[28px] border border-dashed border-teal-500 bg-slate-950/5"
            role="status"
            aria-live="polite"
          >
            <p class="text-lg font-medium text-teal-700 dark:text-teal-300">
              {{ $t('qrCodeGenerator.dragDrop.dropHere') }}
            </p>
          </div>
          <QRCodePreview
            :qr-code="singleResult"
            :is-loading="isGenerating"
          />
        </aside>
      </div>
    </section>

    <!-- 批量模式 -->
    <section v-else class="batch-mode" aria-labelledby="batch-mode-heading">
      <h2 id="batch-mode-heading" class="sr-only">{{ $t('qrCodeGenerator.aria.batchHeading') }}</h2>
      <div class="space-y-6">
        <!-- 批量输入 -->
        <QRCodeBatchInput
          v-model="batchInput"
          :max-items="50"
        />

        <!-- 设置面板 -->
        <QRCodeSettings
          v-model="options"
          @update:model-value="handleSettingsChange"
        />

        <!-- 批量进度 -->
        <aside
          v-if="batchProgress"
          class="progress-section rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_72px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          :aria-label="$t('qrCodeGenerator.aria.progressStatus', { percentage: batchProgress.percentage })"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-slate-800 dark:text-slate-200">
              {{ $t('qrCodeGenerator.batch.progress') }}: {{ batchProgress.current }} / {{ batchProgress.total }}
            </span>
            <span class="text-sm font-semibold text-slate-800 dark:text-slate-200" :aria-label="$t('qrCodeGenerator.aria.progressPercentage', { percentage: batchProgress.percentage })">
              {{ batchProgress.percentage }}%
            </span>
          </div>
          <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800" role="progressbar" :aria-valuenow="batchProgress.percentage" aria-valuemin="0" aria-valuemax="100">
            <div
              class="h-2 rounded-full bg-teal-500 transition-all duration-300"
              :style="{ width: `${batchProgress.percentage}%` }"
            />
          </div>
          <p class="mt-2 truncate text-xs text-slate-600 dark:text-slate-400" aria-live="polite">
            {{ $t('qrCodeGenerator.batch.currentItem') }}: {{ batchProgress.currentItem }}
          </p>
        </aside>

        <!-- 操作按钮 -->
        <div class="actions flex gap-4" role="group" :aria-label="$t('qrCodeGenerator.aria.batchActionGroup')">
          <button
            type="button"
            class="flex-1 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            :disabled="!canGenerateBatch || isGenerating"
            :aria-busy="isGenerating"
            :aria-label="isGenerating ? $t('qrCodeGenerator.actions.generating') : $t('qrCodeGenerator.batch.generate')"
            @click="generateBatch"
          >
            {{ isGenerating ? $t('qrCodeGenerator.actions.generating') : $t('qrCodeGenerator.batch.generate') }}
          </button>
          <button
            v-if="batchResults.length > 0"
            type="button"
            class="flex-1 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            :disabled="isExporting"
            :aria-busy="isExporting"
            :aria-label="isExporting ? $t('qrCodeGenerator.actions.downloading') : $t('qrCodeGenerator.batch.downloadZip')"
            @click="downloadBatch"
          >
            {{ isExporting ? $t('qrCodeGenerator.actions.downloading') : $t('qrCodeGenerator.batch.downloadZip') }}
          </button>
        </div>

        <!-- 批量结果预览 -->
        <article v-if="batchResults.length > 0" class="batch-results" aria-labelledby="batch-results-heading">
          <h3 id="batch-results-heading" class="text-lg font-semibold mb-4 dark:text-white">
            {{ $t('qrCodeGenerator.batch.results') }} ({{ batchResults.length }})
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list" :aria-label="$t('qrCodeGenerator.aria.generatedList')">
            <figure
              v-for="(result, index) in batchResults.slice(0, 12)"
              :key="index"
              class="result-item rounded-[22px] border border-slate-200 bg-white/95 p-3 dark:border-slate-800 dark:bg-slate-900/85"
              role="listitem"
            >
              <img
                v-if="result.dataUrl"
                :src="result.dataUrl"
                :alt="$t('qrCodeGenerator.batch.resultAlt', { index: index + 1, content: batchInput[index] })"
                class="w-full h-auto rounded"
              >
              <figcaption class="mt-2 text-xs text-gray-600 dark:text-gray-400 truncate">
                {{ batchInput[index] }}
              </figcaption>
            </figure>
          </div>
          <p v-if="batchResults.length > 12" class="mt-4 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
            {{ $t('qrCodeGenerator.batch.moreResults', { count: batchResults.length - 12 }) }}
          </p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useQRCodeGenerator } from '~/composables/useQRCodeGenerator'
import { useQRCodeExport } from '~/composables/useQRCodeExport'
import { useQRCodeBatch } from '~/composables/useQRCodeBatch'
import { useDragDrop } from '~/composables/useDragDrop'
import { useDataCleanup } from '~/composables/useDataCleanup'
import type { QRCodeOptions, QRCodeResult } from '~/composables/useQRCodeGenerator'
import type { BatchGenerationProgress } from '~/composables/useQRCodeBatch'

const { t } = useI18n()

// 模式
const mode = ref<'single' | 'batch'>('single')

// 单个模式状态
const singleInput = ref('')
const singleResult = ref<QRCodeResult | null>(null)

// 批量模式状态
const batchInput = ref<string[]>([])
const batchResults = ref<QRCodeResult[]>([])
const batchProgress = ref<BatchGenerationProgress | null>(null)

// 选项
const options = ref<Partial<QRCodeOptions>>({
  size: 512,
  errorCorrectionLevel: 'M',
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  logo: null,
  exportFormat: 'png'
})

// 全局错误
const globalError = ref<string | null>(null)

// 防抖定时器
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Composables
const { generateQRCode, isGenerating, error: generatorError } = useQRCodeGenerator()
const { exportToPNG, exportToSVG, exportBatchToZip, isExporting, error: exportError } = useQRCodeExport()
const { generateBatchAsync, progress, error: batchError } = useQRCodeBatch()
const { registerBlobUrl, revokeBlobUrl } = useDataCleanup()

// 拖拽上传 (用于 Logo)
const {
  isDragging,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop: handleDropFiles,
  files: droppedFiles
} = useDragDrop({
  accept: ['image/png', 'image/jpeg', 'image/svg+xml'],
  maxFiles: 1,
  maxSize: 2 * 1024 * 1024 // 2MB
})

// 计算属性
const canGenerate = computed(() => {
  return singleInput.value.trim().length > 0 && singleInput.value.length <= 2000
})

const canGenerateBatch = computed(() => {
  return batchInput.value.length > 0 && batchInput.value.length <= 50
})

/**
 * 切换模式
 */
const switchMode = (newMode: 'single' | 'batch') => {
  mode.value = newMode
  clearError()
}

/**
 * 防抖函数 - 用于实时预览优化
 */
const debounce = (fn: Function, delay: number) => {
  return (...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

/**
 * 防抖的生成函数
 */
const debouncedGenerate = debounce(async () => {
  if (mode.value === 'single' && singleResult.value && singleInput.value && canGenerate.value) {
    await generateSingle()
  }
}, 300) // 300ms 防抖延迟

/**
 * 处理设置变化
 */
const handleSettingsChange = (newOptions: Partial<QRCodeOptions>) => {
  options.value = { ...options.value, ...newOptions }
  
  // 如果在单个模式且已有结果，使用防抖自动重新生成
  if (mode.value === 'single' && singleResult.value && singleInput.value) {
    debouncedGenerate()
  }
}

/**
 * 生成单个二维码
 */
const generateSingle = async () => {
  try {
    clearError()
    
    // Revoke previous Blob URL if exists
    if (singleResult.value?.dataUrl) {
      revokeBlobUrl(singleResult.value.dataUrl)
    }
    
    singleResult.value = await generateQRCode(singleInput.value, options.value)
    
    // Register new Blob URL for cleanup
    if (singleResult.value?.dataUrl) {
      registerBlobUrl(singleResult.value.dataUrl)
    }
  } catch (err: any) {
    handleError(err, 'generation')
  }
}

/**
 * 重置单个模式
 */
const resetSingle = () => {
  // Revoke Blob URL before clearing
  if (singleResult.value?.dataUrl) {
    revokeBlobUrl(singleResult.value.dataUrl)
  }
  
  singleInput.value = ''
  singleResult.value = null
  options.value = {
    size: 512,
    errorCorrectionLevel: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    logo: null,
    exportFormat: 'png'
  }
  clearError()
}

/**
 * 下载单个二维码
 */
const downloadSingle = async () => {
  if (!singleResult.value) return

  try {
    clearError()
    
    if (singleResult.value.format === 'png' && singleResult.value.canvas) {
      await exportToPNG(singleResult.value.canvas, {
        filename: `qrcode-${Date.now()}.png`
      })
    } else if (singleResult.value.format === 'svg' && singleResult.value.svg) {
      await exportToSVG(singleResult.value.svg, {
        filename: `qrcode-${Date.now()}.svg`
      })
    }
  } catch (err: any) {
    handleError(err, 'export')
  }
}

/**
 * 生成批量二维码 - 使用优化的异步版本
 */
const generateBatch = async () => {
  try {
    clearError()
    
    // Revoke previous Blob URLs
    batchResults.value.forEach(result => {
      if (result.dataUrl) {
        revokeBlobUrl(result.dataUrl)
      }
    })
    
    batchResults.value = []
    
    // 使用 generateBatchAsync 以获得更好的性能
    const result = await generateBatchAsync(batchInput.value, options.value)
    batchResults.value = result.results
    
    // Register new Blob URLs for cleanup
    batchResults.value.forEach(result => {
      if (result.dataUrl) {
        registerBlobUrl(result.dataUrl)
      }
    })
    
    // 显示错误（如果有）
    if (result.errors.length > 0) {
      console.error('Batch generation errors:', result.errors)
      globalError.value = t('qrCodeGenerator.errors.generationFailed')
    }
  } catch (err: any) {
    handleError(err, 'generation')
  }
}

/**
 * 下载批量二维码
 */
const downloadBatch = async () => {
  if (batchResults.value.length === 0) return

  try {
    clearError()
    await exportBatchToZip(batchResults.value, batchInput.value, {
      zipFilename: `qrcodes-${Date.now()}.zip`
    })
  } catch (err: any) {
    handleError(err, 'export')
  }
}

/**
 * 处理拖拽放置
 */
const handleDrop = async (e: DragEvent) => {
  handleDropFiles(e)
  
  // 检查是否有文件被放置
  if (droppedFiles.value.length > 0) {
    const file = droppedFiles.value[0]
    
    try {
      // 读取文件为 data URL
      const dataUrl = await readFileAsDataURL(file)
      
      // 更新 Logo 选项
      options.value.logo = {
        file,
        dataUrl,
        size: 0.2,
        margin: 5
      }
    } catch (err: any) {
      handleError(err, 'validation')
    }
  }
}

/**
 * 读取文件为 data URL
 */
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error(t('common.fileReadFailed')))
    reader.readAsDataURL(file)
  })
}

/**
 * 处理错误
 */
const handleError = (err: any, type: 'validation' | 'generation' | 'export') => {
  const message = err.message || (type === 'export'
    ? t('qrCodeGenerator.errors.exportFailed')
    : t('qrCodeGenerator.errors.generationFailed'))
  globalError.value = message
  
  // 记录错误到控制台
  console.error(`[QRCodeGenerator] ${type} error:`, err)
}

/**
 * 清除错误
 */
const clearError = () => {
  globalError.value = null
}

// 监听批量进度
watch(progress, (newProgress) => {
  batchProgress.value = newProgress
})

// 监听错误
watch([generatorError, exportError, batchError], ([genErr, expErr, batErr]) => {
  if (genErr) handleError({ message: genErr }, 'generation')
  if (expErr) handleError({ message: expErr }, 'export')
  if (batErr) handleError({ message: batErr }, 'generation')
})
</script>

<style scoped>
.qr-code-generator {
  @apply w-full;
}

.preview-panel {
  @apply relative;
}

.drag-overlay {
  @apply pointer-events-none;
}

/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus styles for keyboard navigation */
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  @apply outline-none ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}

input[type="color"]:focus-visible {
  @apply outline-none ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}

input[type="file"]:focus-visible + label {
  @apply ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}

input[type="range"]:focus-visible {
  @apply outline-none ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}
</style>
