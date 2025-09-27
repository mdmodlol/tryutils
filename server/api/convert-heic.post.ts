import { readMultipartFormData } from 'h3'
import sharp from 'sharp'
import heicConvert from 'heic-convert'

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

    // 读取上传的文件
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    // 获取查询参数
    const query = getQuery(event)
    const format = (query.format as string) || 'jpeg'
    const quality = parseInt(query.quality as string) || 80
    const width = query.width ? parseInt(query.width as string) : undefined
    const height = query.height ? parseInt(query.height as string) : undefined

    // 验证格式
    const supportedFormats = ['jpeg', 'png', 'webp']
    if (!supportedFormats.includes(format.toLowerCase())) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`
      })
    }

    // 获取第一个文件
    const fileItem = formData.find(item => item.filename && item.data)
    
    if (!fileItem) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No valid file found'
      })
    }

    // 验证文件类型
    const isHEIC = fileItem.filename?.toLowerCase().match(/\.(heic|heif)$/)

    if (!isHEIC) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File must be HEIC or HEIF format'
      })
    }

    // 获取文件数据 - formData中的data已经是Buffer
    const fileBuffer = fileItem.data

    // 第一步：使用 heic-convert 将 HEIC 转换为 JPEG
    console.log('Converting HEIC to JPEG using heic-convert...')
    const jpegBuffer = await heicConvert({
      buffer: fileBuffer, // 输入 HEIC 文件的 buffer
      format: 'JPEG',     // 输出格式
      quality: 1          // heic-convert 的质量参数 (0-1)
    })

    // 第二步：使用 Sharp 进行后续处理（调整尺寸、质量、格式转换等）
    console.log('Processing with Sharp...')
    let sharpInstance = sharp(Buffer.from(jpegBuffer))

    // 获取原始图片信息（从转换后的 JPEG）
    const metadata = await sharpInstance.metadata()

    // 应用尺寸调整（如果指定了）
    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    // 根据格式进行转换
    let processedResult: { data: Buffer; info: sharp.OutputInfo }

    switch (format.toLowerCase()) {
      case 'jpeg':
        processedResult = await sharpInstance
          .jpeg({ quality: Math.round(quality) })
          .toBuffer({ resolveWithObject: true })
        break
      case 'png':
        processedResult = await sharpInstance
          .png({ compressionLevel: 6 })
          .toBuffer({ resolveWithObject: true })
        break
      case 'webp':
        processedResult = await sharpInstance
          .webp({ quality: Math.round(quality) })
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

    // 生成新文件名
    const originalName = fileItem.filename?.replace(/\.(heic|heif)$/i, '') || 'converted'
    const extension = format.toLowerCase() === 'jpeg' ? 'jpg' : format.toLowerCase()
    const newFilename = `${originalName}.${extension}`

    // 设置响应头
    setHeader(event, 'Content-Type', `image/${format.toLowerCase()}`)
    setHeader(event, 'Content-Disposition', `attachment; filename="${newFilename}"`)
    setHeader(event, 'Content-Length', processedBuffer.length.toString())
    
    // 添加处理信息到响应头
    setHeader(event, 'X-Original-Width', metadata.width?.toString() || '0')
    setHeader(event, 'X-Original-Height', metadata.height?.toString() || '0')
    setHeader(event, 'X-Original-Size', fileBuffer.length.toString())
    setHeader(event, 'X-Processed-Width', processedInfo.width.toString())
    setHeader(event, 'X-Processed-Height', processedInfo.height.toString())
    setHeader(event, 'X-Processed-Size', processedBuffer.length.toString())
    setHeader(event, 'X-Processed-Format', format.toLowerCase())
    setHeader(event, 'X-Original-Filename', fileItem.filename || 'unknown')
    setHeader(event, 'X-Processed-Filename', newFilename)

    // 返回处理后的图片数据
    return processedBuffer

  } catch (error) {
    console.error('HEIC conversion error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Internal server error during HEIC conversion'
    })
  }
})