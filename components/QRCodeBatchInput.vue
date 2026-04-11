<template>
  <div class="qr-code-batch-input space-y-4" role="region" aria-labelledby="batch-input-heading">
    <header class="batch-input-header">
      <h3 id="batch-input-heading" class="text-lg font-semibold dark:text-white">
        {{ $t('qrCodeGenerator.batch.title') }}
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {{ $t('qrCodeGenerator.batch.placeholder') }}
      </p>
    </header>

    <!-- 多行文本输入 -->
    <div class="textarea-wrapper">
      <textarea
        :id="`batch-input-${componentId}`"
        v-model="inputText"
        class="w-full resize-y rounded-[24px] border border-slate-300 bg-white px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        :placeholder="$t('qrCodeGenerator.batch.placeholder')"
        rows="10"
        :aria-label="$t('qrCodeGenerator.batch.input')"
        :aria-describedby="`batch-count-${componentId} ${itemCount > maxItems ? `batch-error-${componentId}` : ''}`"
        :aria-invalid="itemCount > maxItems"
        @input="handleInputChange"
      />
      <div class="flex items-center justify-between mt-2 text-sm">
        <span :id="`batch-count-${componentId}`" class="text-gray-600 dark:text-gray-400" aria-live="polite">
          {{ itemCount }} / {{ maxItems }} {{ $t('common.items') }}
        </span>
        <span
          v-if="itemCount > maxItems"
          :id="`batch-error-${componentId}`"
          class="text-red-600 dark:text-red-400"
          role="alert"
          aria-live="assertive"
        >
          {{ $t('qrCodeGenerator.errors.batchLimitExceeded') }}
        </span>
      </div>
    </div>

    <!-- CSV 文件导入 -->
    <div class="csv-import">
      <label
        :for="`csv-upload-${componentId}`"
        class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        tabindex="0"
        @keydown="handleCsvLabelKeydown"
      >
        <svg
          class="w-5 h-5 text-gray-600 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
          {{ $t('qrCodeGenerator.batch.csvImport') }}
        </span>
      </label>
      <input
        :id="`csv-upload-${componentId}`"
        type="file"
        accept=".csv,.txt"
        class="hidden"
        :aria-label="$t('qrCodeGenerator.batch.csvImport')"
        @change="handleCsvUpload"
      />
    </div>

    <!-- CSV 导入错误 -->
    <aside
      v-if="csvError"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-900/70 dark:bg-rose-950/30"
      role="alert"
      aria-live="assertive"
    >
      <p class="text-sm text-red-800 dark:text-red-200">
        {{ csvError }}
      </p>
    </aside>

    <!-- 清空按钮 -->
    <div v-if="itemCount > 0" class="flex justify-end">
      <button
        type="button"
        class="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        :aria-label="$t('common.clearAll')"
        @click="clearAll"
      >
        {{ $t('common.clearAll') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const { t } = useI18n()

interface Props {
  modelValue: string[]
  maxItems?: number
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 50
})

const emit = defineEmits<Emits>()

// 生成唯一组件 ID
const componentId = ref(`batch-input-${Math.random().toString(36).substr(2, 9)}`)

// 输入文本
const inputText = ref('')

// CSV 错误
const csvError = ref<string | null>(null)

// 计算项目数量
const itemCount = computed(() => {
  const lines = inputText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  return lines.length
})

/**
 * 处理输入变化
 */
const handleInputChange = () => {
  csvError.value = null
  
  const lines = inputText.value
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  emit('update:modelValue', lines)
}

/**
 * 处理 CSV 文件上传
 */
const handleCsvUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  csvError.value = null

  try {
    // 验证文件大小（最大 1MB）
    const maxSize = 1 * 1024 * 1024 // 1MB
    if (file.size > maxSize) {
      throw new Error(t('qrCodeGenerator.batch.csvTooLarge'))
    }

    // 读取文件内容
    const text = await readFileAsText(file)
    
    // 解析 CSV（简单实现，每行一个项目）
    const lines = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    // 检查项目数量
    if (lines.length > props.maxItems) {
      throw new Error(t('qrCodeGenerator.batch.csvLimitExceeded', { count: lines.length, max: props.maxItems }))
    }

    // 更新输入文本
    inputText.value = lines.join('\n')
    handleInputChange()
  } catch (err: any) {
    csvError.value = err.message || t('qrCodeGenerator.batch.csvImportFailed')
    console.error('CSV upload error:', err)
  }

  // 重置 input
  input.value = ''
}

/**
 * 读取文件为文本
 */
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error(t('common.fileReadFailed')))
    reader.readAsText(file)
  })
}

/**
 * 清空所有输入
 */
const clearAll = () => {
  inputText.value = ''
  csvError.value = null
  emit('update:modelValue', [])
}

/**
 * 处理 CSV 标签键盘事件
 */
const handleCsvLabelKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const input = document.getElementById(`csv-upload-${componentId.value}`) as HTMLInputElement
    if (input) {
      input.click()
    }
  }
}

// 监听 props 变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue.length === 0 && inputText.value !== '') {
      inputText.value = ''
    } else if (newValue.length > 0) {
      const currentLines = inputText.value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
      
      // 只在内容不同时更新
      if (JSON.stringify(currentLines) !== JSON.stringify(newValue)) {
        inputText.value = newValue.join('\n')
      }
    }
  }
)

// 初始化
if (props.modelValue.length > 0) {
  inputText.value = props.modelValue.join('\n')
}
</script>

<style scoped>
.qr-code-batch-input {
  @apply w-full;
}

textarea {
  @apply font-mono text-sm;
}

/* Focus styles for keyboard navigation */
button:focus-visible,
textarea:focus-visible,
input:focus-visible,
label:focus-visible {
  @apply outline-none ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}

input[type="file"]:focus-visible + label {
  @apply ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}
</style>
