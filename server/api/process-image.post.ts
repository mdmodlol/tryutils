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

    // 获取处理选项
    const qualityParam = formData.find(item => item.name === 'quality')
    const formatParam = formData.find(item => item.name === 'format')
    const widthParam = formData.find(item => item.name === 'width')
    const heightParam = formData.find(item => item.name === 'height')
    const originalFilenameParam = formData.find(item => item.name === 'originalFilename')

    // 解析参数
    const quality = qualityParam ? parseInt(qualityParam.data.toString()) : 80
    const format = formatParam ? formatParam.data.toString().toLowerCase() : 'jpeg'
    const width = widthParam ? parseInt(widthParam.data.toString()) : undefined
    const height = heightParam ? parseInt(heightParam.data.toString()) : undefined
    const originalFilename = originalFilenameParam ? originalFilenameParam.data.toString() : 'processed'

    // 验证参数
    if (quality < 1 || quality > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Quality must be between 1 and 100'
      })
    }

    const supportedFormats = ['jpeg', 'jpg', 'png', 'webp']
    if (!supportedFormats.includes(format)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`
      })
    }

    // 使用Sharp进行一步到位的处理
    let sharpInstance = sharp(imageFile.data)

    // 获取原始图片信息
    const metadata = await sharpInstance.metadata()

    // 应用尺寸调整（如果指定）
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    // 根据目标格式进行一步到位的转换
    let processedResult: { data: Buffer; info: sharp.OutputInfo }

    switch (format) {
      case 'jpeg':
      case 'jpg':
        processedResult = await sharpInstance
          .jpeg({ 
            quality,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer({ resolveWithObject: true })
        break
      case 'png':
        processedResult = await sharpInstance
          .png({ 
            compressionLevel: Math.round((100 - quality) / 10),
            adaptiveFiltering: true,
            palette: quality < 90
          })
          .toBuffer({ resolveWithObject: true })
        break
      case 'webp':
        processedResult = await sharpInstance
          .webp({ 
            quality,
            effort: 6,
            smartSubsample: true
          })
          .toBuffer({ resolveWithObject: true })
        break
      default:
        throw createError({
          statusCode: 400,
          statusMessage: `Unsupported format: ${format}`
        })
    }

    const processedBuffer = processedResult.data
    const processedInfo = processedResult.info

    // 生成最终文件名
    const baseName = originalFilename.replace(/\.(heic|heif|jpg|jpeg|png|webp)$/i, '')
    const extension = format === 'jpeg' ? 'jpg' : format
    const finalFilename = `${baseName}.${extension}`

    // 设置响应头
    setHeader(event, 'Content-Type', `image/${format}`)
    setHeader(event, 'Content-Disposition', `attachment; filename="${finalFilename}"`)
    setHeader(event, 'Content-Length', processedBuffer.length.toString())
    
    // 添加处理信息到响应头
    setHeader(event, 'X-Original-Width', metadata.width?.toString() || '0')
    setHeader(event, 'X-Original-Height', metadata.height?.toString() || '0')
    setHeader(event, 'X-Original-Size', imageFile.data.length.toString())
    setHeader(event, 'X-Processed-Width', processedInfo.width.toString())
    setHeader(event, 'X-Processed-Height', processedInfo.height.toString())
    setHeader(event, 'X-Processed-Size', processedBuffer.length.toString())
    setHeader(event, 'X-Processed-Format', format)
    setHeader(event, 'X-Original-Filename', originalFilename)
    setHeader(event, 'X-Processed-Filename', finalFilename)

    // 返回处理后的图片数据
    return processedBuffer

  } catch (error) {
    console.error('Image processing error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Internal server error during image processing'
    })
  }
})