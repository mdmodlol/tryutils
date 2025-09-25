import { ref, readonly } from 'vue'

export interface CompressionOptions {
  quality: number
  format: 'jpeg' | 'png' | 'webp' | 'avif'
  maxWidth?: number
  maxHeight?: number
  maxSizeMB?: number
}

export interface CompressionResult {
  originalFile: File
  compressedBlob: Blob
  compressedUrl: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
  filename: string
  originalWidth: number
  originalHeight: number
  compressedWidth: number
  compressedHeight: number
}

export interface CompressionProgress {
  current: number
  total: number
  percentage: number
  currentFileName: string
}

export const useImageCompression = () => {
  const isCompressing = ref(false)
  const progress = ref<CompressionProgress>({
    current: 0,
    total: 0,
    percentage: 0,
    currentFileName: ''
  })
  const error = ref<string | null>(null)

  /**
   * 检查文件是否为支持的图片格式
   */
  const isSupportedImageFile = (file: File): boolean => {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/bmp',
      'image/tiff',
      'image/avif',
      'image/heic',
      'image/heif'
    ]
    
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif', '.avif', '.heic', '.heif']
    const fileName = file.name.toLowerCase()
    
    return supportedTypes.includes(file.type) || 
           supportedExtensions.some(ext => fileName.endsWith(ext))
  }

  /**
   * 检查是否为HEIC文件
   */
  const isHeicFile = (file: File): boolean => {
    return /\.(heic|heif)$/i.test(file.name) || 
           file.type === 'image/heic' || 
           file.type === 'image/heif'
  }

  /**
   * 处理HEIC文件转换
   */
  const processHeicFile = async (file: File): Promise<File> => {
    try {
      // 动态导入heic-convert，处理CommonJS模块
      const heicConvertModule = await import('heic-convert/browser')
      const heicConvert = heicConvertModule.default || heicConvertModule
      
      if (typeof heicConvert !== 'function') {
        throw new Error('heic-convert library not loaded correctly')
      }

      // 读取文件为ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // 使用heic-convert转换HEIC为JPEG
      const jpegBuffer = await heicConvert({
        buffer: uint8Array,
        format: 'JPEG',
        quality: 0.9
      })

      // 创建新的File对象
      const jpegBlob = new Blob([jpegBuffer], { type: 'image/jpeg' })
      const jpegFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
        type: 'image/jpeg',
        lastModified: file.lastModified
      })

      return jpegFile
    } catch (error) {
      console.error('HEIC转换失败:', error)
      
      // 尝试备用导入方式
      try {
        const fallbackModule = await import('heic-convert')
        const heicConvert = fallbackModule.default || fallbackModule
        
        if (typeof heicConvert === 'function') {
          const arrayBuffer = await file.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)
          
          const jpegBuffer = await heicConvert({
            buffer: uint8Array,
            format: 'JPEG',
            quality: 0.9
          })
          
          const jpegBlob = new Blob([jpegBuffer], { type: 'image/jpeg' })
          const jpegFile = new File([jpegBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), {
            type: 'image/jpeg',
            lastModified: file.lastModified
          })
          
          return jpegFile
        }
      } catch (fallbackError) {
        console.error('HEIC备用转换也失败:', fallbackError)
      }
      
      throw new Error(`HEIC文件转换失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  /**
   * 使用服务端API压缩单个图片文件
   */
  const compressImage = async (
    file: File,
    options: CompressionOptions = {
      quality: 75,
      format: 'jpeg'
    }
  ): Promise<CompressionResult> => {
    try {
      // 验证文件格式
      if (!isSupportedImageFile(file)) {
        throw new Error(`文件 ${file.name} 不是支持的图片格式`)
      }

      // 如果是HEIC文件，先在客户端转换
      let processedFile = file
      if (isHeicFile(file)) {
        processedFile = await processHeicFile(file)
      }
      
      // 创建FormData
      const formData = new FormData()
      formData.append('image', processedFile)
      formData.append('quality', options.quality.toString())
      formData.append('format', options.format)
      
      if (options.maxWidth) {
        formData.append('maxWidth', options.maxWidth.toString())
      }
      if (options.maxHeight) {
        formData.append('maxHeight', options.maxHeight.toString())
      }
      if (options.maxSizeMB) {
        formData.append('maxSizeMB', options.maxSizeMB.toString())
      }
      
      // 调用服务端压缩API
      const response = await fetch('/api/compress-image', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
      }
      
      // 获取响应头信息
      const originalSize = parseInt(response.headers.get('X-Original-Size') || '0')
      const compressedSize = parseInt(response.headers.get('X-Processed-Size') || '0')
      const compressionRatio = parseFloat(response.headers.get('X-Compression-Ratio') || '0')
      const originalWidth = parseInt(response.headers.get('X-Original-Width') || '0')
      const originalHeight = parseInt(response.headers.get('X-Original-Height') || '0')
      const compressedWidth = parseInt(response.headers.get('X-Processed-Width') || '0')
      const compressedHeight = parseInt(response.headers.get('X-Processed-Height') || '0')
      
      // 获取压缩后的图片数据
      const compressedBlob = await response.blob()
      
      // 创建URL用于预览和下载
      const compressedUrl = URL.createObjectURL(compressedBlob)
      
      // 生成新的文件名
      const extension = options.format === 'jpeg' ? 'jpg' : options.format
      const filename = file.name.replace(/\.[^/.]+$/, '') + `_compressed.${extension}`
      
      return {
        originalFile: file,
        compressedBlob,
        compressedUrl,
        originalSize: originalSize || file.size,
        compressedSize: compressedSize || compressedBlob.size,
        compressionRatio: compressionRatio || ((file.size - compressedBlob.size) / file.size) * 100,
        filename,
        originalWidth,
        originalHeight,
        compressedWidth,
        compressedHeight
      }
    } catch (error) {
      console.error('图片压缩失败:', error)
      throw new Error(`压缩图片 ${file.name} 失败: ${error.message}`)
    }
  }

  /**
   * 批量压缩多个图片文件
   */
  const compressMultiple = async (
    files: File[],
    options: CompressionOptions = {
      quality: 75,
      format: 'jpeg'
    }
  ): Promise<CompressionResult[]> => {
    if (files.length === 0) {
      throw new Error('没有选择文件')
    }

    try {
      isCompressing.value = true
      error.value = null
      
      // 初始化进度
      progress.value = {
        current: 0,
        total: files.length,
        percentage: 0,
        currentFileName: ''
      }

      const results: CompressionResult[] = []
      
      // 逐个处理文件
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // 更新进度
        progress.value.current = i + 1
        progress.value.currentFileName = file.name
        progress.value.percentage = Math.round(((i + 1) / files.length) * 100)
        
        try {
          const result = await compressImage(file, options)
          results.push(result)
        } catch (fileError) {
          console.error(`处理文件 ${file.name} 失败:`, fileError)
          // 继续处理其他文件，但记录错误
          if (!error.value) {
            error.value = `部分文件处理失败: ${fileError.message}`
          }
        }
      }
      
      if (results.length === 0) {
        throw new Error('所有文件处理失败')
      } else if (results.length < files.length) {
        error.value = `成功处理 ${results.length}/${files.length} 个文件`
      }
      
      return results
    } catch (compressionError) {
      error.value = `批量压缩失败: ${compressionError.message}`
      throw compressionError
    } finally {
      isCompressing.value = false
    }
  }

  /**
   * 清理URL对象
   */
  const cleanupUrls = (results: CompressionResult[]) => {
    results.forEach(result => {
      if (result.compressedUrl) {
        URL.revokeObjectURL(result.compressedUrl)
      }
    })
  }

  /**
   * 重置状态
   */
  const reset = () => {
    isCompressing.value = false
    progress.value = {
      current: 0,
      total: 0,
      percentage: 0,
      currentFileName: ''
    }
    error.value = null
  }

  return {
    // 状态
    isCompressing: readonly(isCompressing),
    progress: readonly(progress),
    error: readonly(error),
    
    // 方法
    compressImage,
    compressMultiple,
    isSupportedImageFile,
    isHeicFile,
    processHeicFile,
    cleanupUrls,
    reset
  }
}