import { ref, readonly } from 'vue'

export interface ConvertOptions {
  format: 'JPEG' | 'PNG' | 'WEBP'
  quality: number
}

export interface ConvertResult {
  blob: Blob
  url: string
  filename: string
}

export const useImageConverter = () => {
  const isConverting = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  /**
   * 动态导入 heic2any（仅在客户端）
   */
  const loadHeic2any = async () => {
    if (process.server) {
      throw new Error('heic2any 只能在客户端使用')
    }
    
    try {
      // heic2any 是一个特殊的 UMD 库，需要特殊处理
      const heic2anyModule = await import('heic2any')
      
      console.log('heic2any 导入成功:', heic2anyModule)
      
      // 尝试不同的导出方式
      let heic2any
      
      if (typeof heic2anyModule.default === 'function') {
        heic2any = heic2anyModule.default
      } else if (typeof heic2anyModule === 'function') {
        heic2any = heic2anyModule
      } else if (typeof (heic2anyModule as any).heic2any === 'function') {
        heic2any = (heic2anyModule as any).heic2any
      } else if (typeof window !== 'undefined' && typeof (window as any).heic2any === 'function') {
        // 如果库作为全局变量被定义
        heic2any = (window as any).heic2any
      } else {
        // 最后的尝试：直接使用模块本身
        heic2any = heic2anyModule
      }
      
      if (typeof heic2any !== 'function') {
        console.error('heic2any 导入失败，没有找到有效的函数:', {
          heic2anyModule,
          typeofModule: typeof heic2anyModule,
          typeofDefault: typeof heic2anyModule.default,
          keys: Object.keys(heic2anyModule || {}),
          windowHeic2any: typeof window !== 'undefined' ? typeof (window as any).heic2any : 'undefined'
        })
        throw new Error('heic2any 库导入失败，请检查库的安装')
      }
      
      console.log('heic2any 函数加载成功:', typeof heic2any)
      return heic2any
    } catch (error) {
      console.error('heic2any 动态导入错误:', error)
      throw new Error('无法加载 heic2any 库，请刷新页面重试')
    }
  }

  /**
   * 检查文件是否为 HEIC 格式
   */
  const isHEICFile = (file: File): boolean => {
    const heicExtensions = ['.heic', '.heif']
    const fileName = file.name.toLowerCase()
    return heicExtensions.some(ext => fileName.endsWith(ext)) || 
           file.type === 'image/heic' || 
           file.type === 'image/heif'
  }

  /**
   * 转换 HEIC 文件
   */
  const convertHEIC = async (
    file: File, 
    options: ConvertOptions = { format: 'JPEG', quality: 0.8 }
  ): Promise<ConvertResult> => {
    try {
      isConverting.value = true
      progress.value = 0
      error.value = null

      // 验证文件格式
      if (!isHEICFile(file)) {
        throw new Error('请选择 HEIC 或 HEIF 格式的图片文件')
      }

      // 动态加载 heic2any
      progress.value = 10
      const heic2any = await loadHeic2any()

      // 开始转换
      progress.value = 30

      const convertedBlob = await heic2any({
        blob: file,
        toType: `image/${options.format.toLowerCase()}`,
        quality: options.quality
      }) as Blob

      progress.value = 80

      // 生成下载 URL
      const url = URL.createObjectURL(convertedBlob)
      
      // 生成新文件名
      const originalName = file.name.replace(/\.(heic|heif)$/i, '')
      const extension = options.format.toLowerCase() === 'jpeg' ? 'jpg' : options.format.toLowerCase()
      const filename = `${originalName}.${extension}`

      progress.value = 100

      return {
        blob: convertedBlob,
        url,
        filename
      }
    } catch (err: any) {
      error.value = err.message || '转换失败，请重试'
      throw err
    } finally {
      isConverting.value = false
    }
  }

  /**
   * 批量转换文件
   */
  const convertMultiple = async (
    files: File[],
    options: ConvertOptions = { format: 'JPEG', quality: 0.8 }
  ): Promise<ConvertResult[]> => {
    const results: ConvertResult[] = []
    const heicFiles = files.filter(isHEICFile) as File[]

    if (heicFiles.length === 0) {
      throw new Error('没有找到 HEIC 格式的图片文件')
    }

    for (let i = 0; i < heicFiles.length; i++) {
      const file = heicFiles[i]!
      const result = await convertHEIC(file, options)
      results.push(result)
      
      // 更新总体进度
      progress.value = Math.round(((i + 1) / heicFiles.length) * 100)
    }

    return results
  }

  /**
   * 下载转换后的文件
   */
  const downloadFile = (result: ConvertResult) => {
    if (process.server) return
    
    const link = document.createElement('a')
    link.href = result.url
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * 批量下载文件
   */
  const downloadMultiple = (results: ConvertResult[]) => {
    if (process.server) return
    
    results.forEach(result => {
      setTimeout(() => downloadFile(result), 100) // 稍微延迟避免浏览器阻止
    })
  }

  /**
   * 清理资源
   */
  const cleanup = (results: ConvertResult[]) => {
    results.forEach(result => {
      URL.revokeObjectURL(result.url)
    })
  }

  return {
    // 状态
    isConverting: readonly(isConverting),
    progress: readonly(progress),
    error: readonly(error),
    
    // 方法
    isHEICFile,
    convertHEIC,
    convertMultiple,
    downloadFile,
    downloadMultiple,
    cleanup
  }
}