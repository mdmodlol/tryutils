import { ref, readonly } from 'vue'
import type QRCodeLib from 'qrcode'

export interface QRCodeOptions {
  // 核心选项
  data: string
  size: number // 128-1024
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  
  // 样式选项
  foregroundColor: string // 前景色
  backgroundColor: string // 背景色
  
  // Logo 选项
  logo: LogoOptions | null
  
  // 导出选项
  exportFormat: 'png' | 'svg'
}

export interface LogoOptions {
  file: File
  dataUrl: string
  size: number // 0.1-0.3 (占二维码面积比例)
  margin: number // Logo 周围的白色边距
}

export interface QRCodeResult {
  canvas: HTMLCanvasElement | null
  svg: string | null
  dataUrl: string
  size: number
  format: 'png' | 'svg'
}

export interface ValidationResult {
  isValid: boolean
  error: string | null
}

export const useQRCodeGenerator = () => {
  const isGenerating = ref(false)
  const error = ref<string | null>(null)
  const qrCodeLib = ref<typeof QRCodeLib | null>(null)

  /**
   * 动态加载 qrcode 库
   */
  const loadQRCodeLib = async (): Promise<typeof QRCodeLib> => {
    if (qrCodeLib.value) {
      return qrCodeLib.value
    }

    try {
      const module = await import('qrcode')
      qrCodeLib.value = module.default || module
      return qrCodeLib.value
    } catch (err) {
      console.error('Failed to load qrcode library:', err)
      throw new Error('无法加载二维码生成库，请刷新页面重试')
    }
  }

  /**
   * 验证输入数据
   */
  const validateInput = (data: string): ValidationResult => {
    // 验证空输入
    if (!data || data.trim().length === 0) {
      return {
        isValid: false,
        error: '输入不能为空'
      }
    }

    // 验证超长输入（>2000 字符）
    if (data.length > 2000) {
      return {
        isValid: false,
        error: '输入内容过长，最多支持 2000 个字符'
      }
    }

    return {
      isValid: true,
      error: null
    }
  }

  /**
   * 生成二维码
   */
  const generateQRCode = async (
    data: string,
    options: Partial<QRCodeOptions> = {}
  ): Promise<QRCodeResult> => {
    try {
      isGenerating.value = true
      error.value = null

      // 验证输入
      const validation = validateInput(data)
      if (!validation.isValid) {
        throw new Error(validation.error || '输入验证失败')
      }

      // 加载 qrcode 库
      const QRCode = await loadQRCodeLib()

      // 合并默认选项
      const qrOptions: QRCodeOptions = {
        data,
        size: options.size || 512,
        errorCorrectionLevel: options.errorCorrectionLevel || 'M',
        foregroundColor: options.foregroundColor || '#000000',
        backgroundColor: options.backgroundColor || '#ffffff',
        logo: options.logo || null,
        exportFormat: options.exportFormat || 'png'
      }

      // 优化大尺寸二维码生成
      // 对于大尺寸（>512px），使用更高的错误纠正级别以确保质量
      if (qrOptions.size > 512 && qrOptions.errorCorrectionLevel === 'L') {
        qrOptions.errorCorrectionLevel = 'M'
      }

      // 生成 Canvas 格式
      let canvas: HTMLCanvasElement | null = null
      let dataUrl = ''

      if (qrOptions.exportFormat === 'png' || qrOptions.logo) {
        // 创建 canvas 元素
        canvas = document.createElement('canvas')
        
        // 使用 qrcode 库生成到 canvas
        await QRCode.toCanvas(canvas, qrOptions.data, {
          width: qrOptions.size,
          margin: 2,
          errorCorrectionLevel: qrOptions.errorCorrectionLevel,
          color: {
            dark: qrOptions.foregroundColor,
            light: qrOptions.backgroundColor
          }
        })

        // 如果有 Logo，嵌入到二维码中心
        if (qrOptions.logo) {
          await embedLogo(canvas, qrOptions.logo, qrOptions.size)
        }

        // 生成 data URL
        // 对于大尺寸图片，使用较低的质量以减少内存使用
        const quality = qrOptions.size > 768 ? 0.85 : 0.95
        dataUrl = canvas.toDataURL('image/png', quality)
      }

      // 生成 SVG 格式
      let svg: string | null = null
      if (qrOptions.exportFormat === 'svg' && !qrOptions.logo) {
        svg = await QRCode.toString(qrOptions.data, {
          type: 'svg',
          width: qrOptions.size,
          margin: 2,
          errorCorrectionLevel: qrOptions.errorCorrectionLevel,
          color: {
            dark: qrOptions.foregroundColor,
            light: qrOptions.backgroundColor
          }
        })
        
        // 从 SVG 字符串创建 data URL
        const svgBlob = new Blob([svg], { type: 'image/svg+xml' })
        dataUrl = URL.createObjectURL(svgBlob)
      }

      return {
        canvas,
        svg,
        dataUrl,
        size: qrOptions.size,
        format: qrOptions.exportFormat
      }
    } catch (err: any) {
      error.value = err.message || '生成二维码失败'
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * 在二维码中心嵌入 Logo
   */
  const embedLogo = async (
    canvas: HTMLCanvasElement,
    logo: LogoOptions,
    qrSize: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法获取 Canvas 上下文'))
        return
      }

      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        try {
          // 计算 Logo 尺寸
          const logoSize = qrSize * logo.size
          const logoX = (qrSize - logoSize) / 2
          const logoY = (qrSize - logoSize) / 2

          // 绘制白色背景（确保可扫描性）
          const margin = logo.margin || 5
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(
            logoX - margin,
            logoY - margin,
            logoSize + margin * 2,
            logoSize + margin * 2
          )

          // 绘制 Logo
          ctx.drawImage(img, logoX, logoY, logoSize, logoSize)
          
          resolve()
        } catch (err) {
          reject(err)
        }
      }

      img.onerror = () => {
        reject(new Error('Logo 图片加载失败'))
      }

      img.src = logo.dataUrl
    })
  }

  /**
   * 重置状态
   */
  const reset = () => {
    isGenerating.value = false
    error.value = null
  }

  return {
    // 状态
    isGenerating: readonly(isGenerating),
    error: readonly(error),
    
    // 方法
    generateQRCode,
    validateInput,
    reset
  }
}
