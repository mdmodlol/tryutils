import { ref, readonly } from 'vue'
import { useQRCodeGenerator } from './useQRCodeGenerator'
import type { QRCodeOptions, QRCodeResult } from './useQRCodeGenerator'

export interface BatchGenerationProgress {
  current: number
  total: number
  percentage: number
  currentItem: string
}

export interface BatchGenerationResult {
  results: QRCodeResult[]
  errors: Array<{ index: number; item: string; error: string }>
}

export const useQRCodeBatch = () => {
  const isGenerating = ref(false)
  const progress = ref<BatchGenerationProgress | null>(null)
  const error = ref<string | null>(null)

  const { generateQRCode } = useQRCodeGenerator()

  /**
   * 批量生成二维码
   * 使用异步处理避免阻塞 UI
   */
  const generateBatch = async (
    items: string[],
    options: Partial<QRCodeOptions> = {}
  ): Promise<BatchGenerationResult> => {
    try {
      isGenerating.value = true
      error.value = null

      const results: QRCodeResult[] = []
      const errors: Array<{ index: number; item: string; error: string }> = []

      // 初始化进度
      progress.value = {
        current: 0,
        total: items.length,
        percentage: 0,
        currentItem: ''
      }

      // 使用异步处理，每个项目之间添加微任务延迟
      for (let i = 0; i < items.length; i++) {
        const item = items[i]

        // 更新进度
        progress.value = {
          current: i + 1,
          total: items.length,
          percentage: Math.round(((i + 1) / items.length) * 100),
          currentItem: item
        }

        try {
          // 生成二维码
          const result = await generateQRCode(item, options)
          results.push(result)
        } catch (err: any) {
          // 记录错误但继续处理其他项目
          errors.push({
            index: i,
            item,
            error: err.message || '生成失败'
          })
          console.error(`Failed to generate QR code for item ${i}:`, err)
        }

        // 添加微任务延迟，避免阻塞 UI
        // 使用 Promise.resolve() 让出控制权给浏览器
        await Promise.resolve()
      }

      return {
        results,
        errors
      }
    } catch (err: any) {
      error.value = err.message || '批量生成失败'
      throw err
    } finally {
      isGenerating.value = false
      progress.value = null
    }
  }

  /**
   * 使用 Web Worker 批量生成（可选实现）
   * 注意：由于 qrcode 库和 Canvas API 的限制，
   * 实际上很难在 Web Worker 中使用，所以这里提供异步版本
   */
  const generateBatchAsync = async (
    items: string[],
    options: Partial<QRCodeOptions> = {}
  ): Promise<BatchGenerationResult> => {
    // 使用 requestIdleCallback 或 setTimeout 来分批处理
    return new Promise((resolve, reject) => {
      const results: QRCodeResult[] = []
      const errors: Array<{ index: number; item: string; error: string }> = []
      let currentIndex = 0

      isGenerating.value = true
      error.value = null

      // 初始化进度
      progress.value = {
        current: 0,
        total: items.length,
        percentage: 0,
        currentItem: ''
      }

      const processNextBatch = async () => {
        // 每批处理 5 个项目
        const batchSize = 5
        const endIndex = Math.min(currentIndex + batchSize, items.length)

        for (let i = currentIndex; i < endIndex; i++) {
          const item = items[i]

          // 更新进度
          progress.value = {
            current: i + 1,
            total: items.length,
            percentage: Math.round(((i + 1) / items.length) * 100),
            currentItem: item
          }

          try {
            const result = await generateQRCode(item, options)
            results.push(result)
          } catch (err: any) {
            errors.push({
              index: i,
              item,
              error: err.message || '生成失败'
            })
            console.error(`Failed to generate QR code for item ${i}:`, err)
          }
        }

        currentIndex = endIndex

        if (currentIndex < items.length) {
          // 继续处理下一批
          // 使用 setTimeout 让出控制权
          setTimeout(processNextBatch, 0)
        } else {
          // 完成
          isGenerating.value = false
          progress.value = null
          resolve({ results, errors })
        }
      }

      // 开始处理
      processNextBatch().catch((err) => {
        isGenerating.value = false
        progress.value = null
        error.value = err.message || '批量生成失败'
        reject(err)
      })
    })
  }

  /**
   * 重置状态
   */
  const reset = () => {
    isGenerating.value = false
    progress.value = null
    error.value = null
  }

  return {
    // 状态
    isGenerating: readonly(isGenerating),
    progress: readonly(progress),
    error: readonly(error),

    // 方法
    generateBatch,
    generateBatchAsync,
    reset
  }
}
