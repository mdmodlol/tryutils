import { ref, readonly } from 'vue'
import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker: boolean
  quality: number
  fileType?: string
}

export interface CompressionResult {
  originalFile: File
  compressedFile: File
  originalSize: number
  compressedSize: number
  compressionRatio: number
  originalUrl: string
  compressedUrl: string
  filename: string
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
      'image/tiff'
    ]
    
    const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']
    const fileName = file.name.toLowerCase()
    
    return supportedTypes.includes(file.type) || 
           supportedExtensions.some(ext => fileName.endsWith(ext))
  }

  /**
   * 压缩单个图片文件
   */
  const compressImage = async (
    file: File,
    options: CompressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: 0.8
    }
  ): Promise<CompressionResult> => {
    try {
      // 验证文件格式
      if (!isSupportedImageFile(file)) {
        throw new Error(`文件 ${file.name} 不是支持的图片格式`)
      }

      // 创建原始文件的预览URL
      const originalUrl = URL.createObjectURL(file)
      
      // 使用Canvas原生API进行精确压缩控制
      const targetSizeBytes = options.maxSizeMB * 1024 * 1024
      
      // 如果目标大小大于等于原文件大小，使用browser-image-compression进行基础压缩
      if (targetSizeBytes >= file.size) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: options.maxSizeMB,
          maxWidthOrHeight: options.maxWidthOrHeight,
          useWebWorker: options.useWebWorker,
          quality: options.quality,
          fileType: options.fileType || file.type
        })
        
        // 如果压缩后仍然符合要求，直接返回
        if (compressedFile.size <= targetSizeBytes) {
          return await createCompressionResult(file, compressedFile, originalUrl)
        }
      }
      
      // 使用Canvas进行精确大小控制
      const compressedFile = await compressToExactSize(file, targetSizeBytes, options)
      
      return await createCompressionResult(file, compressedFile, originalUrl)
    } catch (err: any) {
      console.error('图片压缩失败:', err)
      throw new Error(err.message || `压缩文件 ${file.name} 时发生错误`)
    }
  }

  /**
   * 使用Canvas进行精确大小压缩（双重优化策略）
   */
  const compressToExactSize = async (
    file: File, 
    targetSizeBytes: number, 
    options: CompressionOptions
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = async () => {
        try {
          // 首先尝试质量优化
          let result = await optimizeByQuality(img, targetSizeBytes, options, file)
          
          // 如果质量优化不够精确，尝试尺寸+质量双重优化
          if (Math.abs(result.size - targetSizeBytes) > targetSizeBytes * 0.02) {
            result = await optimizeBySizeAndQuality(img, targetSizeBytes, options, file)
          }
          
          resolve(result.file)
        } catch (error) {
          reject(error)
        }
      }
      
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = URL.createObjectURL(file)
    })
  }

  /**
   * 通过质量参数优化
   */
  const optimizeByQuality = async (
    img: HTMLImageElement, 
    targetSizeBytes: number, 
    options: CompressionOptions, 
    file: File
  ): Promise<{file: File, size: number}> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    
    // 计算缩放尺寸
    let { width, height } = calculateDimensions(img.width, img.height, options.maxWidthOrHeight)
    
    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)
    
    // 二分搜索找到最佳质量参数
    const optimalQuality = await binarySearchQuality(canvas, targetSizeBytes, options.fileType || file.type)
    
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const originalName = file.name.replace(/\.[^/.]+$/, '')
          const extension = (options.fileType || file.type).split('/')[1] || 'jpg'
          const filename = `${originalName}_compressed.${extension}`
          resolve({
            file: new File([blob], filename, { type: blob.type }),
            size: blob.size
          })
        } else {
          reject(new Error('Canvas压缩失败'))
        }
      }, options.fileType || file.type, optimalQuality)
    })
  }

  /**
   * 通过尺寸和质量双重优化
   */
  const optimizeBySizeAndQuality = async (
    img: HTMLImageElement, 
    targetSizeBytes: number, 
    options: CompressionOptions, 
    file: File
  ): Promise<{file: File, size: number}> => {
    const maxDimension = Math.max(img.width, img.height)
    let bestResult = { file: null as File | null, size: 0, diff: Infinity }
    
    // 尝试不同的尺寸缩放比例
    const scaleFactors = [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7]
    
    for (const scaleFactor of scaleFactors) {
      const targetDimension = Math.round(maxDimension * scaleFactor)
      const tempOptions = { ...options, maxWidthOrHeight: targetDimension }
      
      try {
        const result = await optimizeByQuality(img, targetSizeBytes, tempOptions, file)
        const diff = Math.abs(result.size - targetSizeBytes)
        
        if (diff < bestResult.diff) {
          bestResult = { ...result, diff }
        }
        
        // 如果已经很接近目标，提前退出
        if (diff <= targetSizeBytes * 0.01) {
          break
        }
      } catch (error) {
        continue // 跳过失败的尝试
      }
    }
    
    if (!bestResult.file) {
      throw new Error('无法找到合适的压缩参数')
    }
    
    return { file: bestResult.file, size: bestResult.size }
  }

  /**
   * 高精度二分搜索找到最佳质量参数
   */
  const binarySearchQuality = async (
    canvas: HTMLCanvasElement, 
    targetSizeBytes: number, 
    mimeType: string
  ): Promise<number> => {
    let minQuality = 0.05  // 降低最小质量以获得更大压缩范围
    let maxQuality = 1.0
    let bestQuality = 0.8
    let bestSize = 0
    const tolerance = targetSizeBytes * 0.02 // 减小容差到2%
    const maxIterations = 15 // 增加迭代次数
    
    for (let i = 0; i < maxIterations; i++) {
      const currentQuality = (minQuality + maxQuality) / 2
      const size = await getCanvasBlobSize(canvas, mimeType, currentQuality)
      
      // 记录最接近目标的质量参数
      if (Math.abs(size - targetSizeBytes) < Math.abs(bestSize - targetSizeBytes)) {
        bestQuality = currentQuality
        bestSize = size
      }
      
      // 如果在容差范围内，继续优化以找到更精确的值
      if (Math.abs(size - targetSizeBytes) <= tolerance) {
        // 进行额外的精细调整
        const fineQuality = await finetuneQuality(canvas, mimeType, currentQuality, targetSizeBytes, size)
        if (fineQuality !== null) {
          return fineQuality
        }
        return currentQuality
      }
      
      if (size > targetSizeBytes) {
        maxQuality = currentQuality
      } else {
        minQuality = currentQuality
      }
      
      // 如果搜索范围过小，提前退出
      if (maxQuality - minQuality < 0.01) {
        break
      }
    }
    
    return bestQuality
  }

  /**
   * 精细调整质量参数
   */
  const finetuneQuality = async (
    canvas: HTMLCanvasElement,
    mimeType: string,
    baseQuality: number,
    targetSize: number,
    currentSize: number
  ): Promise<number | null> => {
    const step = 0.005 // 0.5%的微调步长
    const maxSteps = 5
    
    let bestQuality = baseQuality
    let bestDiff = Math.abs(currentSize - targetSize)
    
    // 向上和向下微调
    for (let direction of [-1, 1]) {
      for (let i = 1; i <= maxSteps; i++) {
        const testQuality = Math.max(0.05, Math.min(1.0, baseQuality + direction * step * i))
        const testSize = await getCanvasBlobSize(canvas, mimeType, testQuality)
        const diff = Math.abs(testSize - targetSize)
        
        if (diff < bestDiff) {
          bestQuality = testQuality
          bestDiff = diff
        } else {
          break // 如果不再改善，停止这个方向的搜索
        }
      }
    }
    
    return bestDiff < Math.abs(currentSize - targetSize) ? bestQuality : null
  }

  /**
   * 获取Canvas生成的Blob大小
   */
  const getCanvasBlobSize = (canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<number> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob ? blob.size : 0)
      }, mimeType, quality)
    })
  }

  /**
   * 计算缩放后的尺寸
   */
  const calculateDimensions = (originalWidth: number, originalHeight: number, maxWidthOrHeight?: number) => {
    if (!maxWidthOrHeight || maxWidthOrHeight >= Math.max(originalWidth, originalHeight)) {
      return { width: originalWidth, height: originalHeight }
    }
    
    const ratio = Math.min(maxWidthOrHeight / originalWidth, maxWidthOrHeight / originalHeight)
    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    }
  }

  /**
   * 创建压缩结果对象
   */
  const createCompressionResult = async (originalFile: File, compressedFile: File, originalUrl: string): Promise<CompressionResult> => {
    try {
      // 创建压缩后文件的预览URL
      const compressedUrl = URL.createObjectURL(compressedFile)
      
      // 计算压缩比例
      const compressionRatio = ((originalFile.size - compressedFile.size) / originalFile.size) * 100
      
      // 生成新文件名
      const originalName = originalFile.name.replace(/\.[^/.]+$/, '')
      const extension = originalFile.name.split('.').pop() || 'jpg'
      const filename = `${originalName}_compressed.${extension}`

      return {
        originalFile,
        compressedFile: new File([compressedFile], filename, { type: compressedFile.type }),
        originalSize: originalFile.size,
        compressedSize: compressedFile.size,
        compressionRatio: Math.max(0, compressionRatio),
        originalUrl,
        compressedUrl,
        filename
      }
    } catch (err: any) {
      console.error('图片压缩失败:', err)
      throw new Error(err.message || `压缩文件 ${originalFile.name} 时发生错误`)
    }
  }

  /**
   * 批量压缩图片
   */
  const compressMultiple = async (
    files: File[],
    options: CompressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: 0.8
    }
  ): Promise<CompressionResult[]> => {
    const results: CompressionResult[] = []
    const imageFiles = files.filter(isSupportedImageFile)

    if (imageFiles.length === 0) {
      throw new Error('没有找到支持的图片文件')
    }

    isCompressing.value = true
    error.value = null
    
    // 初始化进度
    progress.value = {
      current: 0,
      total: imageFiles.length,
      percentage: 0,
      currentFileName: ''
    }

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]!
        
        // 更新当前处理的文件信息
        progress.value.current = i + 1
        progress.value.currentFileName = file.name
        progress.value.percentage = Math.round(((i + 1) / imageFiles.length) * 100)
        
        const result = await compressImage(file, options)
        results.push(result)
      }

      return results
    } catch (err: any) {
      error.value = err.message || '批量压缩过程中发生错误'
      throw err
    } finally {
      isCompressing.value = false
    }
  }

  /**
   * 下载压缩后的文件
   */
  const downloadCompressedFile = (result: CompressionResult) => {
    if (process.server) return
    
    const link = document.createElement('a')
    link.href = result.compressedUrl
    link.download = result.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * 批量下载压缩后的文件
   */
  const downloadMultiple = (results: CompressionResult[]) => {
    if (process.server) return
    
    results.forEach((result, index) => {
      setTimeout(() => downloadCompressedFile(result), index * 100)
    })
  }

  /**
   * 清理资源
   */
  const cleanup = (results: CompressionResult[]) => {
    results.forEach(result => {
      URL.revokeObjectURL(result.originalUrl)
      URL.revokeObjectURL(result.compressedUrl)
    })
  }

  /**
   * 格式化文件大小
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  /**
   * 计算压缩节省的空间
   */
  const calculateSavings = (results: CompressionResult[]): {
    originalTotalSize: number
    compressedTotalSize: number
    totalSavings: number
    averageCompressionRatio: number
  } => {
    const originalTotalSize = results.reduce((sum, result) => sum + result.originalSize, 0)
    const compressedTotalSize = results.reduce((sum, result) => sum + result.compressedSize, 0)
    const totalSavings = originalTotalSize - compressedTotalSize
    const averageCompressionRatio = results.length > 0 
      ? results.reduce((sum, result) => sum + result.compressionRatio, 0) / results.length
      : 0

    return {
      originalTotalSize,
      compressedTotalSize,
      totalSavings,
      averageCompressionRatio
    }
  }

  return {
    // 状态
    isCompressing: readonly(isCompressing),
    progress: readonly(progress),
    error: readonly(error),

    // 方法
    compressImage,
    compressMultiple,
    downloadCompressedFile,
    downloadMultiple,
    cleanup,
    formatFileSize,
    calculateSavings,
    isSupportedImageFile
  }
}