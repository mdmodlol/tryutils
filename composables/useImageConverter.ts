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
   * 动态导入 heic-convert（支持客户端和服务端）
   */
  const loadHeicConvert = async () => {
    try {
      // 根据环境选择合适的heic-convert版本
      const heicConvertModule = process.server 
        ? await import('heic-convert')
        : await import('heic-convert/browser')
      
      // 处理CommonJS模块的导入
      const heicConvert = heicConvertModule.default || heicConvertModule
      
      if (typeof heicConvert !== 'function') {
        console.error('heic-convert 导入失败，没有找到有效的函数:', heicConvertModule)
        throw new Error('heic-convert 库导入失败，请检查库的安装')
      }
      
      console.log('✅ heic-convert 函数加载成功:', typeof heicConvert)
      return heicConvert
    } catch (error) {
      console.error('❌ heic-convert 动态导入错误:', error)
      
      // 尝试备用导入方式
      try {
        const fallbackModule = await import('heic-convert')
        const heicConvert = fallbackModule.default || fallbackModule
        if (typeof heicConvert === 'function') {
          console.log('✅ heic-convert 备用加载成功:', typeof heicConvert)
          return heicConvert
        }
      } catch (fallbackError) {
        console.error('❌ heic-convert 备用导入也失败:', fallbackError)
      }
      
      throw new Error('无法加载 heic-convert 库，请刷新页面重试')
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
   * 使用客户端heic-convert解码HEIC文件为通用格式
   */
  const decodeHEICWithClient = async (
    file: File,
    options: ConvertOptions = { format: 'JPEG', quality: 0.8 }
  ): Promise<{ blob: Blob; filename: string }> => {
    // 动态加载 heic-convert
    const heicConvert = await loadHeicConvert()

    // 将文件读取为ArrayBuffer并转换为Uint8Array
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // 使用heic-convert将HEIC解码为通用格式
    const convertedBuffer = await heicConvert({
      buffer: uint8Array,
      format: options.format,
      quality: options.quality
    })

    // 创建Blob
    const mimeType = options.format === 'JPEG' ? 'image/jpeg' : 
                     options.format === 'PNG' ? 'image/png' : 'image/webp'
    const blob = new Blob([convertedBuffer], { type: mimeType })

    // 生成文件名
    const originalName = file.name.replace(/\.(heic|heif)$/i, '')
    const extension = options.format.toLowerCase() === 'jpeg' ? 'jpg' : options.format.toLowerCase()
    const filename = `${originalName}.${extension}`

    return { blob, filename }
  }

  /**
   * 仅使用客户端heic-convert转换HEIC文件（不经过服务端优化）
   */
  const convertHEICWithClientOnly = async (
    file: File,
    options: ConvertOptions = { format: 'JPEG', quality: 0.8 }
  ): Promise<ConvertResult> => {
    try {
      isConverting.value = true
      progress.value = 0
      error.value = null

      // 使用客户端heic-convert直接转换
      const { blob, filename } = await decodeHEICWithClient(file, options)
      
      progress.value = 100

      const url = URL.createObjectURL(blob)
      
      return {
        blob,
        url,
        filename
      }
    } catch (err: any) {
      error.value = err.message || 'HEIC转换失败'
      throw err
    } finally {
      isConverting.value = false
    }
  }
  const optimizeImageWithServer = async (
    blob: Blob,
    originalFilename: string,
    options: ConvertOptions = { format: 'JPEG', quality: 0.8 }
  ): Promise<ConvertResult> => {
    const formData = new FormData()
    
    // 创建File对象用于上传
    const file = new File([blob], originalFilename, { type: blob.type })
    formData.append('image', file)

    const response = await $fetch('/api/optimize-image', {
      method: 'POST',
      body: formData,
      query: {
        format: options.format.toLowerCase(),
        quality: Math.round(options.quality * 100),
        originalFilename: originalFilename
      },
      responseType: 'blob'
    })

    // 从响应获取优化后的图片
    const optimizedBlob = response as Blob
    const url = URL.createObjectURL(optimizedBlob)
    
    // 生成最终文件名
    const baseName = originalFilename.replace(/\.(heic|heif|png)$/i, '')
    const extension = options.format.toLowerCase() === 'jpeg' ? 'jpg' : options.format.toLowerCase()
    const filename = `${baseName}.${extension}`

    return {
      blob: optimizedBlob,
      url,
      filename
    }
  }

  /**
   * 转换 HEIC 文件（协同工作流程：heic-convert解码 + Sharp优化）
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

      progress.value = 10

      try {
        // 第一步：使用heic-convert在客户端解码HEIC为通用格式
        progress.value = 20
        const { blob: decodedBlob, filename: tempFilename } = await decodeHEICWithClient(file, options)
        
        progress.value = 50

        // 第二步：将解码后的通用格式图片发送到服务端用Sharp进行优化
        const result = await optimizeImageWithServer(decodedBlob, file.name, options)
        
        // 清理临时blob URL
        URL.revokeObjectURL(URL.createObjectURL(decodedBlob))
        
        progress.value = 100
        return result
      } catch (serverError) {
        console.warn('服务端优化失败，使用客户端完整转换:', serverError)
        
        // 服务端不可用时，使用客户端完整转换作为备用方案
        progress.value = 60
        const result = await convertHEICWithClientOnly(file, options)
        progress.value = 100
        return result
      }
    } catch (err: any) {
      error.value = err.message || '转换失败，请重试'
      throw err
    } finally {
      isConverting.value = false
    }
  }

  /**
   * 批量转换文件（协同工作流程：客户端解码 + 服务端批量优化）
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

    try {
      // 如果文件数量较多，使用批量协同处理
      if (heicFiles.length > 3) {
        try {
          // 第一步：在客户端批量解码所有HEIC文件
          const decodedFiles: { blob: Blob; originalName: string }[] = []
          
          for (let i = 0; i < heicFiles.length; i++) {
            const file = heicFiles[i]!
            progress.value = Math.round((i / heicFiles.length) * 30) // 0-30%用于解码
            
            const { blob } = await decodeHEICWithClient(file, options)
            decodedFiles.push({
              blob,
              originalName: file.name
            })
          }

          // 第二步：将所有解码后的文件发送到服务端进行批量优化
          const formData = new FormData()
          decodedFiles.forEach((decoded, index) => {
            const tempFile = new File([decoded.blob], `${decoded.originalName}_decoded.png`, { type: 'image/png' })
            formData.append('files', tempFile)
          })

          progress.value = 40 // 开始服务端处理

          const response = await $fetch('/api/optimize-images-batch', {
            method: 'POST',
            body: formData,
            query: {
              format: options.format.toLowerCase(),
              quality: Math.round(options.quality * 100)
            },
            responseType: 'blob'
          })

          // 清理临时解码的blob
          decodedFiles.forEach(decoded => {
            URL.revokeObjectURL(URL.createObjectURL(decoded.blob))
          })

          // 服务端返回ZIP文件，创建单个下载结果
          const blob = response as Blob
          const url = URL.createObjectURL(blob)
          const filename = `converted_heic_files.zip`

          progress.value = 100

          return [{
            blob,
            url,
            filename
          }]
        } catch (serverError) {
          console.warn('服务端批量优化失败，使用逐个协同转换:', serverError)
          // 继续使用逐个转换的方式
        }
      }

      // 逐个协同转换文件（客户端解码 + 服务端优化）
      for (let i = 0; i < heicFiles.length; i++) {
        const file = heicFiles[i]!
        const result = await convertHEIC(file, options)
        results.push(result)
        
        // 更新总体进度
        progress.value = Math.round(((i + 1) / heicFiles.length) * 100)
      }

      return results
    } catch (error) {
      console.error('批量转换失败:', error)
      throw error
    }
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