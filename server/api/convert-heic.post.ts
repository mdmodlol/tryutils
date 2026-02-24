import sharp from 'sharp'
import heicConvert from 'heic-convert'
import {
  parseImageFormData,
  validateFormat,
  convertToFormat,
  setImageResponseHeaders,
  handleApiError,
  makeOutputFilename
} from '../utils/image-api'

export default defineEventHandler(async (event) => {
  try {
    const { imageFile } = await parseImageFormData(event)

    // 获取查询参数
    const query = getQuery(event)
    const format = ((query.format as string) || 'jpeg').toLowerCase()
    const quality = parseInt(query.quality as string) || 80
    const width = query.width ? parseInt(query.width as string) : undefined
    const height = query.height ? parseInt(query.height as string) : undefined

    // 验证
    validateFormat(format, 'basic')

    // 验证文件类型
    const isHEIC = imageFile.filename?.toLowerCase().match(/\.(heic|heif)$/)
    if (!isHEIC) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File must be HEIC or HEIF format'
      })
    }

    // 第一步：HEIC → JPEG
    const jpegBuffer = await heicConvert({
      buffer: imageFile.data,
      format: 'JPEG',
      quality: 1
    })

    // 第二步：Sharp 后续处理
    let sharpInstance = sharp(Buffer.from(jpegBuffer))
    const metadata = await sharpInstance.metadata()

    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    const result = await convertToFormat(sharpInstance, format, { quality: Math.round(quality) })
    const originalName = imageFile.filename?.replace(/\.(heic|heif)$/i, '') || 'converted'
    const filename = makeOutputFilename(originalName, format)

    // 响应
    setImageResponseHeaders(event, {
      format,
      filename,
      originalSize: imageFile.data.length,
      processedSize: result.data.length,
      metadata,
      processedInfo: result.info
    })
    setHeader(event, 'X-Original-Filename', imageFile.filename || 'unknown')
    setHeader(event, 'X-Processed-Filename', filename)

    return result.data
  } catch (error: unknown) {
    handleApiError(error, 'HEIC conversion')
  }
})
