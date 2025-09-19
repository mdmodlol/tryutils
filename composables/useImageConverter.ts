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
   * 使用客户端heic2any解码HEIC文件为通用格式
   */
  const decodeHEICWithClient = async (
    file: File,
    options: ConvertOptions = { format: 'JPEG', quality: 0.8 }
  ): Promise<{ blob: Blob; filename: string }> => {
    // 动态加载 heic2any
    const heic2any = await loadHeic2any()

    // 使用heic2any将HEIC解码为通用格式（PNG，避免质量损失）
    const decodedBlob = await heic2any({
      blob: file,
      toType: 'image/png', // 使用PNG作为中间格式，保持最高质量
      quality: 1.0 // 解码阶段使用最高质量
    }) as Blob

    // 生成临时文件名
    const originalName = file.name.replace(/\.(heic|heif)$/i, '')
    const filename = `${originalName}_decoded.png`

    return {
      blob: decodedBlob,
      filename
    }
  }

  /**
   * 使用服务端Sharp优化通用格式图片
   */
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
   * 客户端直接转换（当服务端不可用时的完整备用方案）
   */
  const convertHEICWithClientOnly = async (
    file: File,
    options: ConvertOptions = { format: 'JPEG', quality: 0.8 }
  ): Promise<ConvertResult> => {
    // 动态加载 heic2any
    const heic2any = await loadHeic2any()

    const convertedBlob = await heic2any({
      blob: file,
      toType: `image/${options.format.toLowerCase()}`,
      quality: options.quality
    }) as Blob

    // 生成下载 URL
    const url = URL.createObjectURL(convertedBlob)
    
    // 生成新文件名
    const originalName = file.name.replace(/\.(heic|heif)$/i, '')
    const extension = options.format.toLowerCase() === 'jpeg' ? 'jpg' : options.format.toLowerCase()
    const filename = `${originalName}.${extension}`

    return {
      blob: convertedBlob,
      url,
      filename
    }
  }

  /**
   * 转换 HEIC 文件（协同工作流程：heic2any解码 + Sharp优化）
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
        // 第一步：使用heic2any在客户端解码HEIC为通用格式
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