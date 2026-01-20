import { ref, readonly } from 'vue'
import JSZip from 'jszip'
import type { QRCodeResult } from './useQRCodeGenerator'

export interface ExportOptions {
  filename?: string
  quality?: number // PNG 质量 (0.1-1.0)
}

export interface ExportResult {
  success: boolean
  error: string | null
}

export interface BatchExportOptions {
  zipFilename?: string
  filenamePrefix?: string
  quality?: number
}

export const useQRCodeExport = () => {
  const isExporting = ref(false)
  const error = ref<string | null>(null)

  /**
   * 导出为 PNG 格式
   */
  const exportToPNG = async (
    canvas: HTMLCanvasElement,
    options: ExportOptions = {}
  ): Promise<ExportResult> => {
    try {
      isExporting.value = true
      error.value = null

      const filename = options.filename || `qrcode-${Date.now()}.png`
      const quality = options.quality || 1.0

      // 使用 Canvas.toBlob() 生成 PNG
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              error.value = 'PNG 生成失败'
              resolve({
                success: false,
                error: error.value
              })
              return
            }

            // 触发文件下载
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // 清理 Blob URL
            setTimeout(() => URL.revokeObjectURL(url), 100)

            resolve({
              success: true,
              error: null
            })
          },
          'image/png',
          quality
        )
      })
    } catch (err: any) {
      error.value = err.message || 'PNG 导出失败'
      return {
        success: false,
        error: error.value
      }
    } finally {
      isExporting.value = false
    }
  }

  /**
   * 导出为 SVG 格式
   */
  const exportToSVG = async (
    svgString: string,
    options: ExportOptions = {}
  ): Promise<ExportResult> => {
    try {
      isExporting.value = true
      error.value = null

      const filename = options.filename || `qrcode-${Date.now()}.svg`

      // 创建 Blob 并触发下载
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 清理 Blob URL
      setTimeout(() => URL.revokeObjectURL(url), 100)

      return {
        success: true,
        error: null
      }
    } catch (err: any) {
      error.value = err.message || 'SVG 导出失败'
      return {
        success: false,
        error: error.value
      }
    } finally {
      isExporting.value = false
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    isExporting.value = false
    error.value = null
  }

  /**
   * 生成唯一文件名
   */
  const generateUniqueFilename = (content: string, index: number, format: 'png' | 'svg' = 'png'): string => {
    // Create a simple hash from the content
    let hash = 0
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    
    // Use absolute value and convert to base36 for shorter string
    const hashStr = Math.abs(hash).toString(36)
    
    // Combine with index and timestamp to ensure uniqueness
    const extension = format === 'svg' ? 'svg' : 'png'
    return `qrcode-${index + 1}-${hashStr}-${Date.now()}.${extension}`
  }

  /**
   * 批量导出为 ZIP
   */
  const exportBatchToZip = async (
    results: QRCodeResult[],
    contents: string[],
    options: BatchExportOptions = {}
  ): Promise<ExportResult> => {
    try {
      isExporting.value = true
      error.value = null

      const zipFilename = options.zipFilename || `qrcodes-${Date.now()}.zip`
      const quality = options.quality || 1.0

      // Create a new JSZip instance
      const zip = new JSZip()

      // Add each QR code to the ZIP
      for (let i = 0; i < results.length; i++) {
        const result = results[i]
        const content = contents[i] || `item-${i + 1}`
        
        // Generate unique filename
        const filename = generateUniqueFilename(content, i, result.format)

        if (result.format === 'png' && result.canvas) {
          // Convert canvas to blob
          const blob = await new Promise<Blob | null>((resolve) => {
            result.canvas!.toBlob(
              (blob) => resolve(blob),
              'image/png',
              quality
            )
          })

          if (blob) {
            zip.file(filename, blob)
          }
        } else if (result.format === 'svg' && result.svg) {
          // Add SVG string directly
          zip.file(filename, result.svg)
        }
      }

      // Generate ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' })

      // Trigger download
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = zipFilename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up Blob URL
      setTimeout(() => URL.revokeObjectURL(url), 100)

      return {
        success: true,
        error: null
      }
    } catch (err: any) {
      error.value = err.message || 'ZIP 导出失败'
      return {
        success: false,
        error: error.value
      }
    } finally {
      isExporting.value = false
    }
  }

  return {
    // 状态
    isExporting: readonly(isExporting),
    error: readonly(error),
    
    // 方法
    exportToPNG,
    exportToSVG,
    exportBatchToZip,
    generateUniqueFilename,
    reset
  }
}
