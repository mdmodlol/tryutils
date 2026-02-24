import sharp from 'sharp'
import {
  parseImageFormData,
  getFormField,
  getFormFieldInt,
  validateFormat,
  validateQuality,
  convertToFormat,
  setImageResponseHeaders,
  handleApiError,
  makeOutputFilename
} from '../utils/image-api'

export default defineEventHandler(async (event) => {
  try {
    const { formData, imageFile } = await parseImageFormData(event)

    // 解析参数
    const quality = getFormFieldInt(formData, 'quality', 80)!
    const format = (getFormField(formData, 'format') || 'jpeg').toLowerCase()
    const originalFilename = getFormField(formData, 'originalFilename') || 'optimized'

    // 也支持从 query 参数获取（兼容旧调用方式）
    const query = getQuery(event)
    const finalFormat = (query.format as string)?.toLowerCase() || format
    const finalQuality = parseInt(query.quality as string) || quality

    // 验证
    validateQuality(finalQuality)
    validateFormat(finalFormat, 'basic')

    // Sharp 处理
    const sharpInstance = sharp(imageFile.data)
    const metadata = await sharpInstance.metadata()

    const result = await convertToFormat(sharpInstance, finalFormat, { quality: finalQuality })
    const filename = makeOutputFilename(
      (query.originalFilename as string) || originalFilename,
      finalFormat
    )

    // 响应
    setImageResponseHeaders(event, {
      format: finalFormat,
      filename,
      originalSize: imageFile.data.length,
      processedSize: result.data.length,
      metadata,
      processedInfo: result.info
    })
    setHeader(event, 'X-Original-Filename', originalFilename)
    setHeader(event, 'X-Processed-Filename', filename)

    return result.data
  } catch (error: unknown) {
    handleApiError(error, 'Image optimization')
  }
})
