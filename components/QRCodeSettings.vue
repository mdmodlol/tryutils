<template>
  <div class="qr-code-settings space-y-6" role="region" :aria-label="t('qrCodeGenerator.settings.aria.region')">
    <!-- 颜色设置 -->
    <section class="color-settings" aria-labelledby="color-settings-heading">
      <h3 id="color-settings-heading" class="text-lg font-semibold mb-4 dark:text-white">
        {{ $t('qrCodeGenerator.settings.colors') }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 前景色选择器 -->
        <div class="color-picker-group">
          <label 
            :for="`foreground-color-${componentId}`"
            class="block text-sm font-medium mb-2 dark:text-gray-300"
          >
            {{ $t('qrCodeGenerator.settings.foreground') }}
          </label>
          <div class="flex items-center gap-3">
            <input
              :id="`foreground-color-${componentId}`"
              v-model="localOptions.foregroundColor"
              type="color"
              class="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              @input="handleColorChange"
            />
            <input
              v-model="localOptions.foregroundColor"
              type="text"
            class="flex-1 rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              pattern="^#[0-9A-Fa-f]{6}$"
              @input="handleColorChange"
            />
          </div>
        </div>

        <!-- 背景色选择器 -->
        <div class="color-picker-group">
          <label 
            :for="`background-color-${componentId}`"
            class="block text-sm font-medium mb-2 dark:text-gray-300"
          >
            {{ $t('qrCodeGenerator.settings.background') }}
          </label>
          <div class="flex items-center gap-3">
            <input
              :id="`background-color-${componentId}`"
              v-model="localOptions.backgroundColor"
              type="color"
              class="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              @input="handleColorChange"
            />
            <input
              v-model="localOptions.backgroundColor"
              type="text"
            class="flex-1 rounded-xl border border-slate-300 px-3 py-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              pattern="^#[0-9A-Fa-f]{6}$"
              @input="handleColorChange"
            />
          </div>
        </div>
      </div>

      <!-- 颜色预设 -->
      <div class="color-presets mt-4">
        <p class="text-sm font-medium mb-2 dark:text-gray-300" id="color-presets-label">
          {{ $t('qrCodeGenerator.settings.colorPresets') }}
        </p>
        <div class="flex flex-wrap gap-2" role="group" aria-labelledby="color-presets-label">
          <button
            v-for="preset in colorPresets"
            :key="preset.name"
            type="button"
            class="rounded-full border border-slate-300 px-4 py-2 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            :class="{
              'ring-2 ring-teal-500': isPresetActive(preset)
            }"
            :aria-pressed="isPresetActive(preset)"
            :aria-label="t('qrCodeGenerator.settings.aria.applyPreset', { preset: t(`qrCodeGenerator.settings.${preset.name}`) })"
            @click="applyColorPreset(preset)"
          >
            <span class="flex items-center gap-2">
              <span 
                class="w-4 h-4 rounded border border-gray-300"
                :style="{ backgroundColor: preset.foreground }"
                aria-hidden="true"
              />
              <span 
                class="w-4 h-4 rounded border border-gray-300"
                :style="{ backgroundColor: preset.background }"
                aria-hidden="true"
              />
              <span class="text-sm dark:text-white">{{ $t(`qrCodeGenerator.settings.${preset.name}`) }}</span>
            </span>
          </button>
        </div>
      </div>

      <!-- 颜色对比度警告 -->
      <aside
        v-if="contrastWarning"
        class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/60 dark:bg-amber-950/30"
        role="alert"
        aria-live="polite"
      >
        <p class="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ {{ contrastWarning }}
        </p>
      </aside>
    </section>

    <!-- 尺寸控制 -->
    <section class="size-settings" aria-labelledby="size-settings-heading">
      <h3 id="size-settings-heading" class="text-lg font-semibold mb-4 dark:text-white">
        {{ $t('qrCodeGenerator.settings.size') }}
      </h3>

      <!-- 尺寸滑块 -->
      <div class="size-slider mb-4">
        <div class="flex items-center justify-between mb-2">
          <label 
            :for="`size-slider-${componentId}`"
            class="text-sm font-medium dark:text-gray-300"
          >
            {{ $t('qrCodeGenerator.settings.size') }}
          </label>
          <span class="text-sm font-semibold dark:text-white" aria-live="polite">
            {{ localOptions.size }}px
          </span>
        </div>
        <input
          :id="`size-slider-${componentId}`"
          v-model.number="localOptions.size"
          type="range"
          min="128"
          max="1024"
          step="8"
          class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800"
          :aria-label="t('qrCodeGenerator.settings.aria.sizeSlider', { size: localOptions.size })"
          :aria-valuemin="128"
          :aria-valuemax="1024"
          :aria-valuenow="localOptions.size"
          @input="handleSizeChange"
        />
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1" aria-hidden="true">
          <span>128px</span>
          <span>1024px</span>
        </div>
      </div>

      <!-- 尺寸预设 -->
      <div class="size-presets">
        <p class="text-sm font-medium mb-2 dark:text-gray-300" id="size-presets-label">
          {{ $t('qrCodeGenerator.settings.size') }}
        </p>
        <div class="grid grid-cols-3 gap-2" role="group" aria-labelledby="size-presets-label">
          <button
            v-for="preset in sizePresets"
            :key="preset.name"
            type="button"
            class="rounded-full border border-slate-300 px-4 py-2 text-sm transition-colors dark:border-slate-700 dark:text-white dark:hover:bg-slate-800"
            :class="{
              'ring-2 ring-teal-500 bg-slate-100 dark:bg-slate-900/80': localOptions.size === preset.size
            }"
            :aria-pressed="localOptions.size === preset.size"
            :aria-label="t('qrCodeGenerator.settings.aria.sizePreset', { size: preset.size, preset: t(`qrCodeGenerator.settings.${preset.name}`) })"
            @click="applySizePreset(preset)"
          >
            {{ $t(`qrCodeGenerator.settings.${preset.name}`) }}
          </button>
        </div>
      </div>
    </section>

    <!-- Logo 设置 -->
    <section class="logo-settings" aria-labelledby="logo-settings-heading">
      <h3 id="logo-settings-heading" class="text-lg font-semibold mb-4 dark:text-white">
        {{ $t('qrCodeGenerator.settings.logo') }}
      </h3>

      <!-- Logo 上传 -->
      <div class="logo-upload mb-4">
        <div v-if="!localOptions.logo" class="upload-area">
          <label
            :for="`logo-upload-${componentId}`"
            class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
            tabindex="0"
            @keydown="handleLogoLabelKeydown"
          >
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                class="w-10 h-10 mb-3 text-gray-400"
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
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">{{ $t('qrCodeGenerator.settings.uploadLogo') }}</span>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, SVG ({{ $t('common.maxSize') }}: 2MB)
              </p>
            </div>
            <input
              :id="`logo-upload-${componentId}`"
              type="file"
              class="hidden"
              accept="image/png,image/jpeg,image/svg+xml"
              :aria-label="$t('qrCodeGenerator.settings.uploadLogo')"
              @change="handleLogoUpload"
            />
          </label>
        </div>

        <!-- Logo 预览 -->
        <div v-else class="logo-preview">
          <figure class="relative inline-block">
            <img
              :src="localOptions.logo.dataUrl"
              :alt="t('qrCodeGenerator.settings.aria.logoPreview')"
              class="w-32 h-32 object-contain border border-gray-300 dark:border-gray-600 rounded-lg"
            />
            <button
              type="button"
              class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white transition-colors hover:bg-rose-600"
              :aria-label="$t('qrCodeGenerator.settings.removeLogo')"
              @click="removeLogo"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </figure>

          <!-- Logo 大小调节 -->
          <div class="logo-size-control mt-4">
            <div class="flex items-center justify-between mb-2">
              <label 
                :for="`logo-size-${componentId}`"
                class="text-sm font-medium dark:text-gray-300"
              >
                {{ $t('qrCodeGenerator.settings.logoSize') }}
              </label>
              <span class="text-sm font-semibold dark:text-white" aria-live="polite">
                {{ Math.round((localOptions.logo.size || 0.2) * 100) }}%
              </span>
            </div>
            <input
              :id="`logo-size-${componentId}`"
              v-model.number="logoSizePercent"
              type="range"
              min="10"
              max="30"
              step="1"
              class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-800"
              :aria-label="t('qrCodeGenerator.settings.aria.logoSizeSlider', { size: Math.round((localOptions.logo.size || 0.2) * 100) })"
              :aria-valuemin="10"
              :aria-valuemax="30"
              :aria-valuenow="logoSizePercent"
              @input="handleLogoSizeChange"
            />
            <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1" aria-hidden="true">
              <span>10%</span>
              <span>30%</span>
            </div>
          </div>
        </div>

        <!-- Logo 上传错误 -->
        <aside
          v-if="logoError"
          class="mt-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 dark:border-rose-900/70 dark:bg-rose-950/30"
          role="alert"
          aria-live="assertive"
        >
          <p class="text-sm text-red-800 dark:text-red-200">
            {{ logoError }}
          </p>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { QRCodeOptions, LogoOptions } from '~/composables/useQRCodeGenerator'
const { t } = useI18n()

interface ColorPreset {
  name: string
  foreground: string
  background: string
}

interface SizePreset {
  name: string
  size: number
}

interface Props {
  modelValue: Partial<QRCodeOptions>
}

interface Emits {
  (e: 'update:modelValue', value: Partial<QRCodeOptions>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 生成唯一组件 ID
const componentId = ref(`qr-settings-${Math.random().toString(36).substr(2, 9)}`)

// Logo 错误状态
const logoError = ref<string | null>(null)

// Logo 大小百分比（用于滑块）
const logoSizePercent = ref(20)

// 本地选项状态
const localOptions = ref<Partial<QRCodeOptions>>({
  foregroundColor: props.modelValue.foregroundColor || '#000000',
  backgroundColor: props.modelValue.backgroundColor || '#ffffff',
  size: props.modelValue.size || 512,
  errorCorrectionLevel: props.modelValue.errorCorrectionLevel || 'M',
  logo: props.modelValue.logo || null,
  exportFormat: props.modelValue.exportFormat || 'png'
})

// 初始化 Logo 大小百分比
if (localOptions.value.logo) {
  logoSizePercent.value = Math.round((localOptions.value.logo.size || 0.2) * 100)
}

// 颜色预设
const colorPresets: ColorPreset[] = [
  { name: 'blackWhite', foreground: '#000000', background: '#ffffff' },
  { name: 'blueWhite', foreground: '#1e40af', background: '#ffffff' },
  { name: 'redWhite', foreground: '#dc2626', background: '#ffffff' }
]

// 尺寸预设
const sizePresets: SizePreset[] = [
  { name: 'sizeSmall', size: 256 },
  { name: 'sizeMedium', size: 512 },
  { name: 'sizeLarge', size: 1024 }
]

/**
 * 计算颜色对比度
 */
const calculateContrast = (color1: string, color2: string): number => {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = ((rgb >> 16) & 0xff) / 255
    const g = ((rgb >> 8) & 0xff) / 255
    const b = (rgb & 0xff) / 255

    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * 对比度警告
 */
const contrastWarning = computed(() => {
  const contrast = calculateContrast(
    localOptions.value.foregroundColor || '#000000',
    localOptions.value.backgroundColor || '#ffffff'
  )

  if (contrast < 3) {
    return t('qrCodeGenerator.settings.contrastWarning')
  }

  return null
})

/**
 * 检查预设是否激活
 */
const isPresetActive = (preset: ColorPreset): boolean => {
  return (
    localOptions.value.foregroundColor === preset.foreground &&
    localOptions.value.backgroundColor === preset.background
  )
}

/**
 * 应用颜色预设
 */
const applyColorPreset = (preset: ColorPreset) => {
  localOptions.value.foregroundColor = preset.foreground
  localOptions.value.backgroundColor = preset.background
  emitUpdate()
}

/**
 * 处理颜色预设键盘事件
 */
const handleColorPresetKeydown = (event: KeyboardEvent, preset: ColorPreset) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    applyColorPreset(preset)
  }
}

/**
 * 应用尺寸预设
 */
const applySizePreset = (preset: SizePreset) => {
  localOptions.value.size = preset.size
  emitUpdate()
}

/**
 * 处理尺寸预设键盘事件
 */
const handleSizePresetKeydown = (event: KeyboardEvent, preset: SizePreset) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    applySizePreset(preset)
  }
}

/**
 * 处理颜色变化
 */
const handleColorChange = () => {
  emitUpdate()
}

/**
 * 处理尺寸变化
 */
const handleSizeChange = () => {
  emitUpdate()
}

/**
 * 处理 Logo 上传
 */
const handleLogoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) return

  logoError.value = null

  try {
    // 验证文件格式
    const validFormats = ['image/png', 'image/jpeg', 'image/svg+xml']
    if (!validFormats.includes(file.type)) {
      throw new Error(t('qrCodeGenerator.errors.logoFormatInvalid'))
    }

    // 验证文件大小（2MB）
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      throw new Error(t('qrCodeGenerator.errors.logoTooLarge'))
    }

    // 读取文件为 data URL
    const dataUrl = await readFileAsDataURL(file)

    // 创建 Logo 选项
    const logoOptions: LogoOptions = {
      file,
      dataUrl,
      size: logoSizePercent.value / 100, // 转换为 0.1-0.3 的比例
      margin: 5
    }

    localOptions.value.logo = logoOptions
    emitUpdate()
  } catch (err: any) {
    logoError.value = err.message || t('common.uploadFailed')
    console.error('Logo upload error:', err)
  }

  // 重置 input
  input.value = ''
}

/**
 * 读取文件为 data URL
 */
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 移除 Logo
 */
const removeLogo = () => {
  localOptions.value.logo = null
  logoError.value = null
  logoSizePercent.value = 20
  emitUpdate()
}

/**
 * 处理 Logo 标签键盘事件
 */
const handleLogoLabelKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    const input = document.getElementById(`logo-upload-${componentId.value}`) as HTMLInputElement
    if (input) {
      input.click()
    }
  }
}

/**
 * 处理 Logo 大小变化
 */
const handleLogoSizeChange = () => {
  if (localOptions.value.logo) {
    localOptions.value.logo = {
      ...localOptions.value.logo,
      size: logoSizePercent.value / 100
    }
    emitUpdate()
  }
}

/**
 * 发送更新事件
 */
const emitUpdate = () => {
  emit('update:modelValue', { ...localOptions.value })
}

// 监听 props 变化
watch(
  () => props.modelValue,
  (newValue) => {
    localOptions.value = {
      ...localOptions.value,
      ...newValue
    }
  },
  { deep: true }
)
</script>

<style scoped>
.qr-code-settings {
  @apply w-full;
}

.color-picker-group input[type="color"] {
  @apply cursor-pointer;
}

.color-picker-group input[type="color"]::-webkit-color-swatch-wrapper {
  @apply p-0;
}

.color-picker-group input[type="color"]::-webkit-color-swatch {
  @apply border-0 rounded;
}

/* Focus styles for keyboard navigation */
button:focus-visible,
input:focus-visible,
label:focus-visible {
  @apply outline-none ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}

input[type="color"]:focus-visible {
  @apply outline-none ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}

input[type="range"]:focus-visible {
  @apply outline-none ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}

input[type="file"]:focus-visible + label {
  @apply ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900;
}
</style>
