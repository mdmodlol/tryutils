import sharp from 'sharp'
import { readMultipartFormData } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // 设置CORS头
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
    setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')

    // 处理OPTIONS请求
    if (getMethod(event) === 'OPTIONS') {
      return ''
    }

    // 解析multipart/form-data
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    // 查找图片文件
    const imageFile = formData.find(item => item.name === 'image')
    
    if (!imageFile || !imageFile.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image file not found'
      })
    }

    // 获取压缩选项
    const qualityParam = formData.find(item => item.name === 'quality')
    const formatParam = formData.find(item => item.name === 'format')
    const maxWidthParam = formData.find(item => item.name === 'maxWidth')
    const maxHeightParam = formData.find(item => item.name === 'maxHeight')
    const maxSizeMBParam = formData.find(item => item.name === 'maxSizeMB')
    const originalFilenameParam = formData.find(item => item.name === 'originalFilename')

    // 解析参数
    const quality = qualityParam ? parseInt(qualityParam.data.toString()) : 80
    const format = formatParam ? formatParam.data.toString().toLowerCase() : 'jpeg'
    const maxWidth = maxWidthParam ? parseInt(maxWidthParam.data.toString()) : undefined
    const maxHeight = maxHeightParam ? parseInt(maxHeightParam.data.toString()) : undefined
    const maxSizeMB = maxSizeMBParam ? parseFloat(maxSizeMBParam.data.toString()) : undefined
    const originalFilename = originalFilenameParam ? originalFilenameParam.data.toString() : 'compressed'

    // 验证参数
    if (quality < 1 || quality > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Quality must be between 1 and 100'
      })
    }

    const supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'avif']
    if (!supportedFormats.includes(format)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`
      })
    }

    // 获取原始图片信息
    const originalSize = imageFile.data.length
    let sharpInstance = sharp(imageFile.data)
    const metadata = await sharpInstance.metadata()

    // 计算目标尺寸
    let targetWidth = maxWidth
    let targetHeight = maxHeight

    if (maxWidth || maxHeight) {
      const originalWidth = metadata.width || 0
      const originalHeight = metadata.height || 0
      
      if (maxWidth && maxHeight) {
        // 保持宽高比，不超过指定的最大尺寸
        const widthRatio = maxWidth / originalWidth
        const heightRatio = maxHeight / originalHeight
        const ratio = Math.min(widthRatio, heightRatio, 1) // 不放大
        
        targetWidth = Math.round(originalWidth * ratio)
        targetHeight = Math.round(originalHeight * ratio)
      } else if (maxWidth) {
        // 只指定宽度，按比例计算高度
        const ratio = Math.min(maxWidth / originalWidth, 1)
        targetWidth = Math.round(originalWidth * ratio)
        targetHeight = Math.round(originalHeight * ratio)
      } else if (maxHeight) {
        // 只指定高度，按比例计算宽度
        const ratio = Math.min(maxHeight / originalHeight, 1)
        targetWidth = Math.round(originalWidth * ratio)
        targetHeight = Math.round(originalHeight * ratio)
      }
    }

    // 应用尺寸调整
    if (targetWidth || targetHeight) {
      sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    // 根据目标格式和质量进行压缩
    let processedResult: { data: Buffer; info: sharp.OutputInfo }
    let actualQuality = quality

    // 如果指定了最大文件大小，进行迭代压缩
    if (maxSizeMB) {
      const targetSizeBytes = maxSizeMB * 1024 * 1024
      let attempts = 0
      const maxAttempts = 10
      
      while (attempts < maxAttempts) {
        let tempSharp = sharpInstance.clone()
        
        switch (format) {
          case 'jpeg':
          case 'jpg':
            processedResult = await tempSharp
              .jpeg({ 
                quality: actualQuality,
                progressive: true,
                mozjpeg: true
              })
              .toBuffer({ resolveWithObject: true })
            break
          case 'png':
            processedResult = await tempSharp
              .png({ 
                compressionLevel: Math.round((100 - actualQuality) / 10),
                adaptiveFiltering: true,
                palette: actualQuality < 90
              })
              .toBuffer({ resolveWithObject: true })
            break
          case 'webp':
            processedResult = await tempSharp
              .webp({ 
                quality: actualQuality,
                effort: 6
              })
              .toBuffer({ resolveWithObject: true })
            break
          case 'avif':
            processedResult = await tempSharp
              .avif({ 
                quality: actualQuality,
                effort: 4
              })
              .toBuffer({ resolveWithObject: true })
            break
          default:
            throw createError({
              statusCode: 400,
              statusMessage: `Unsupported format: ${format}`
            })
        }

        // 检查文件大小是否符合要求
        if (processedResult.data.length <= targetSizeBytes || actualQuality <= 10) {
          break
        }

        // 降低质量重试
        actualQuality = Math.max(10, actualQuality - 10)
        attempts++
      }
    } else {
      // 直接按指定质量压缩
      switch (format) {
        case 'jpeg':
        case 'jpg':
          processedResult = await sharpInstance
            .jpeg({ 
              quality: actualQuality,
              progressive: true,
              mozjpeg: true
            })
            .toBuffer({ resolveWithObject: true })
          break
        case 'png':
          processedResult = await sharpInstance
            .png({ 
              compressionLevel: Math.round((100 - actualQuality) / 10),
              adaptiveFiltering: true,
              palette: actualQuality < 90
            })
            .toBuffer({ resolveWithObject: true })
          break
        case 'webp':
          processedResult = await sharpInstance
            .webp({ 
              quality: actualQuality,
              effort: 6
            })
            .toBuffer({ resolveWithObject: true })
          break
        case 'avif':
          processedResult = await sharpInstance
            .avif({ 
              quality: actualQuality,
              effort: 4
            })
            .toBuffer({ resolveWithObject: true })
          break
        default:
          throw createError({
            statusCode: 400,
            statusMessage: `Unsupported format: ${format}`
          })
      }
    }

    const processedSize = processedResult.data.length
    const compressionRatio = ((originalSize - processedSize) / originalSize * 100).toFixed(2)

    // 设置响应头，包含压缩统计信息
    setHeader(event, 'Content-Type', `image/${format === 'jpg' ? 'jpeg' : format}`)
    setHeader(event, 'Content-Disposition', `attachment; filename="${originalFilename}_compressed.${format}"`)
    setHeader(event, 'X-Original-Size', originalSize.toString())
    setHeader(event, 'X-Processed-Size', processedSize.toString())
    setHeader(event, 'X-Compression-Ratio', compressionRatio)
    setHeader(event, 'X-Original-Width', (metadata.width || 0).toString())
    setHeader(event, 'X-Original-Height', (metadata.height || 0).toString())
    setHeader(event, 'X-Processed-Width', (processedResult.info.width || targetWidth || metadata.width || 0).toString())
    setHeader(event, 'X-Processed-Height', (processedResult.info.height || targetHeight || metadata.height || 0).toString())
    setHeader(event, 'X-Final-Quality', actualQuality.toString())
    setHeader(event, 'X-Format', format)

    return processedResult.data

  } catch (error: any) {
    console.error('Image compression error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error during image compression'
    })
  }
})