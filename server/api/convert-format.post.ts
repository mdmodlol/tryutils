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

    // 获取转换参数
    const targetFormatParam = formData.find(item => item.name === 'targetFormat')
    const qualityParam = formData.find(item => item.name === 'quality')
    const compressionLevelParam = formData.find(item => item.name === 'compressionLevel')
    const speedParam = formData.find(item => item.name === 'speed')
    const originalFilenameParam = formData.find(item => item.name === 'originalFilename')

    // 解析参数
    const targetFormat = targetFormatParam ? targetFormatParam.data.toString().toLowerCase() : 'jpeg'
    const quality = qualityParam ? parseInt(qualityParam.data.toString()) : 80
    const compressionLevel = compressionLevelParam ? parseInt(compressionLevelParam.data.toString()) : 6
    const speed = speedParam ? parseInt(speedParam.data.toString()) : 4
    const originalFilename = originalFilenameParam ? originalFilenameParam.data.toString() : 'converted'

    // 验证目标格式
    const supportedFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'avif', 'tiff']
    if (!supportedFormats.includes(targetFormat)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported target format: ${targetFormat}. Supported formats: ${supportedFormats.join(', ')}`
      })
    }

    // 验证质量参数
    if (quality < 1 || quality > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Quality must be between 1 and 100'
      })
    }

    // 验证压缩级别参数
    if (compressionLevel < 0 || compressionLevel > 9) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Compression level must be between 0 and 9'
      })
    }

    // 验证速度参数
    if (speed < 0 || speed > 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Speed must be between 0 and 8'
      })
    }

    // 获取原始图片信息
    const originalSize = imageFile.data.length
    let sharpInstance = sharp(imageFile.data)
    const metadata = await sharpInstance.metadata()
    const originalFormat = metadata.format || 'unknown'

    // 检查是否为动画格式
    const isAnimated = metadata.pages && metadata.pages > 1

    // 根据目标格式进行转换
    let processedResult: { data: Buffer; info: sharp.OutputInfo }
    let actualFormat = targetFormat

    switch (targetFormat) {
      case 'jpeg':
      case 'jpg':
        processedResult = await sharpInstance
          .jpeg({ 
            quality: quality,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer({ resolveWithObject: true })
        actualFormat = 'jpeg'
        break

      case 'png':
        processedResult = await sharpInstance
          .png({ 
            compressionLevel: compressionLevel,
            adaptiveFiltering: true,
            palette: quality < 90
          })
          .toBuffer({ resolveWithObject: true })
        break

      case 'webp':
        const webpOptions: any = { 
          quality: quality,
          effort: 6
        }
        // 如果原图是动画且WebP支持动画，保留动画
        if (isAnimated) {
          webpOptions.animated = true
        }
        processedResult = await sharpInstance
          .webp(webpOptions)
          .toBuffer({ resolveWithObject: true })
        break

      case 'gif':
        const gifOptions: any = {}
        // 如果原图是动画，尝试保留动画
        if (isAnimated) {
          gifOptions.animated = true
        }
        processedResult = await sharpInstance
          .gif(gifOptions)
          .toBuffer({ resolveWithObject: true })
        break

      case 'avif':
        processedResult = await sharpInstance
          .avif({ 
            quality: quality,
            speed: speed,
            effort: 4
          })
          .toBuffer({ resolveWithObject: true })
        break

      case 'tiff':
        processedResult = await sharpInstance
          .tiff({ 
            quality: quality,
            compression: 'lzw'
          })
          .toBuffer({ resolveWithObject: true })
        break

      default:
        throw createError({
          statusCode: 400,
          statusMessage: `Unsupported target format: ${targetFormat}`
        })
    }

    const processedSize = processedResult.data.length
    const sizeReduction = originalSize > processedSize ? 
      ((originalSize - processedSize) / originalSize * 100).toFixed(2) : 
      '0.00'
    const sizeIncrease = processedSize > originalSize ? 
      ((processedSize - originalSize) / originalSize * 100).toFixed(2) : 
      '0.00'

    // 设置响应头，包含转换统计信息
    setHeader(event, 'Content-Type', `image/${actualFormat}`)
    setHeader(event, 'Content-Disposition', `attachment; filename="${originalFilename}_converted.${actualFormat}"`)
    setHeader(event, 'X-Original-Format', originalFormat)
    setHeader(event, 'X-Processed-Format', actualFormat)
    setHeader(event, 'X-Original-Size', originalSize.toString())
    setHeader(event, 'X-Processed-Size', processedSize.toString())
    setHeader(event, 'X-Size-Reduction', sizeReduction)
    setHeader(event, 'X-Size-Increase', sizeIncrease)
    setHeader(event, 'X-Original-Width', (metadata.width || 0).toString())
    setHeader(event, 'X-Original-Height', (metadata.height || 0).toString())
    setHeader(event, 'X-Processed-Width', (processedResult.info.width || metadata.width || 0).toString())
    setHeader(event, 'X-Processed-Height', (processedResult.info.height || metadata.height || 0).toString())
    setHeader(event, 'X-Quality', quality.toString())
    setHeader(event, 'X-Compression-Level', compressionLevel.toString())
    setHeader(event, 'X-Speed', speed.toString())
    setHeader(event, 'X-Is-Animated', isAnimated ? 'true' : 'false')

    return processedResult.data

  } catch (error: any) {
    console.error('Image format conversion error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error during image format conversion'
    })
  }
})