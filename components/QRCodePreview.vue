<template>
  <article class="qr-code-preview" role="region" aria-labelledby="preview-heading">
    <h2 id="preview-heading" class="sr-only">QR Code Preview</h2>
    
    <!-- 加载状态 -->
    <div
      v-if="isLoading"
      class="preview-loading flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
      role="status"
      aria-live="polite"
      :aria-label="$t('qrCodeGenerator.preview.generating')"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" aria-hidden="true" />
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('qrCodeGenerator.preview.generating') }}
      </p>
    </div>

    <!-- 预览显示 -->
    <div
      v-else-if="qrCode"
      class="preview-content"
    >
      <!-- 二维码显示区域 -->
      <figure class="qr-display bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
        <!-- Canvas 预览 -->
        <div
          v-if="qrCode.canvas"
          class="qr-canvas-container"
        >
          <canvas
            ref="canvasRef"
            :width="qrCode.size"
            :height="qrCode.size"
            class="max-w-full h-auto rounded"
            role="img"
            :aria-label="`QR code preview, ${qrCode.size} by ${qrCode.size} pixels`"
          />
        </div>

        <!-- SVG 预览 -->
        <div
          v-else-if="qrCode.svg"
          class="qr-svg-container"
          role="img"
          aria-label="QR code preview in SVG format"
          v-html="qrCode.svg"
        />

        <!-- Data URL 预览（备用） -->
        <img
          v-else-if="qrCode.dataUrl"
          :src="qrCode.dataUrl"
          alt="QR Code Preview"
          class="max-w-full h-auto rounded"
          :style="{ width: `${qrCode.size}px`, height: `${qrCode.size}px` }"
        />
      </figure>

      <!-- 二维码信息 -->
      <aside class="qr-info mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg" aria-labelledby="qr-info-heading">
        <h4 id="qr-info-heading" class="text-sm font-semibold mb-2 dark:text-white">
          {{ $t('qrCodeGenerator.preview.title') }}
        </h4>
        <dl class="grid grid-cols-2 gap-2 text-sm">
          <div class="info-item">
            <dt class="text-gray-600 dark:text-gray-400">
              {{ $t('qrCodeGenerator.preview.size') }}:
            </dt>
            <dd class="ml-2 font-medium dark:text-white">
              {{ qrCode.size }}px
            </dd>
          </div>
          <div class="info-item">
            <dt class="text-gray-600 dark:text-gray-400">
              {{ $t('qrCodeGenerator.preview.format') }}:
            </dt>
            <dd class="ml-2 font-medium dark:text-white uppercase">
              {{ qrCode.format }}
            </dd>
          </div>
        </dl>
      </aside>
    </div>

    <!-- 空状态 -->
    <div
      v-else
      class="preview-empty flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
      role="status"
    >
      <svg
        class="w-16 h-16 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
        />
      </svg>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ $t('qrCodeGenerator.input.empty') }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { QRCodeResult } from '~/composables/useQRCodeGenerator'

interface Props {
  qrCode: QRCodeResult | null
  isLoading: boolean
}

const props = defineProps<Props>()

// Canvas 引用
const canvasRef = ref<HTMLCanvasElement | null>(null)

/**
 * 更新 Canvas 显示
 */
const updateCanvas = () => {
  if (!props.qrCode?.canvas || !canvasRef.value) return

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  // 清空 canvas
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  // 绘制二维码
  ctx.drawImage(props.qrCode.canvas, 0, 0)
}

// 监听 qrCode 变化，更新 canvas
watch(
  () => props.qrCode,
  () => {
    if (props.qrCode?.canvas) {
      // 使用 nextTick 确保 DOM 已更新
      nextTick(() => {
        updateCanvas()
      })
    }
  },
  { deep: true }
)

// 组件挂载时更新 canvas
onMounted(() => {
  if (props.qrCode?.canvas) {
    updateCanvas()
  }
})
</script>

<style scoped>
.qr-code-preview {
  @apply w-full;
}

.qr-display {
  @apply min-h-[300px] flex items-center justify-center;
}

.qr-canvas-container,
.qr-svg-container {
  @apply flex items-center justify-center;
}

.qr-svg-container :deep(svg) {
  @apply max-w-full h-auto rounded;
}

.preview-loading,
.preview-empty {
  @apply min-h-[300px];
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
</style>
