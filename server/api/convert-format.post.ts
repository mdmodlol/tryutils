import sharp from 'sharp'
import {
  parseImageFormData,
  getFormField,
  getFormFieldInt,
  validateFormat,
  validateQuality,
  convertToFormat,
  handleApiError,
  makeOutputFilename
} from '../utils/image-api'

export default defineEventHandler(async (event) => {
  try {
    const { formData, imageFile } = await parseImageFormData(event)

    // 解析参数
    const targetFormat = (getFormField(formData, 'targetFormat') || 'jpeg').toLowerCase()
    const quality = getFormFieldInt(formData, 'quality', 80)!
    const compressionLevel = getFormFieldInt(formData, 'compressionLevel', 6)!
    const speed = getFormFieldInt(formData, 'speed', 4)!
    const originalFilename = getFormField(formData, 'originalFilename') || 'converted'

    // 验证
    validateFormat(targetFormat, 'all')
    validateQuality(quality)

    if (compressionLevel < 0 || compressionLevel > 9) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Compression level must be between 0 and 9'
      })
    }
    if (speed < 0 || speed > 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Speed must be between 0 and 8'
      })
    }

    // Sharp 处理
    const originalSize = imageFile.data.length
    const sharpInstance = sharp(imageFile.data)
    const metadata = await sharpInstance.metadata()
    const originalFormat = metadata.format || 'unknown'
    const isAnimated = !!(metadata.pages && metadata.pages > 1)

    const result = await convertToFormat(sharpInstance, targetFormat, {
      quality,
      compressionLevel,
      speed,
      animated: isAnimated
    })

    const actualFormat = (targetFormat === 'jpg') ? 'jpeg' : targetFormat
    const processedSize = result.data.length
    const sizeReduction = originalSize > processedSize
      ? ((originalSize - processedSize) / originalSize * 100).toFixed(2)
      : '0.00'
    const sizeIncrease = processedSize > originalSize
      ? ((processedSize - originalSize) / originalSize * 100).toFixed(2)
      : '0.00'

    // 响应头
    setHeader(event, 'Content-Type', `image/${actualFormat}`)
    setHeader(event, 'Content-Disposition', `attachment; filename="${makeOutputFilename(originalFilename, actualFormat, '_converted')}"`)
    setHeader(event, 'X-Original-Format', originalFormat)
    setHeader(event, 'X-Processed-Format', actualFormat)
    setHeader(event, 'X-Original-Size', originalSize.toString())
    setHeader(event, 'X-Processed-Size', processedSize.toString())
    setHeader(event, 'X-Size-Reduction', sizeReduction)
    setHeader(event, 'X-Size-Increase', sizeIncrease)
    setHeader(event, 'X-Original-Width', (metadata.width || 0).toString())
    setHeader(event, 'X-Original-Height', (metadata.height || 0).toString())
    setHeader(event, 'X-Processed-Width', (result.info.width || metadata.width || 0).toString())
    setHeader(event, 'X-Processed-Height', (result.info.height || metadata.height || 0).toString())
    setHeader(event, 'X-Quality', quality.toString())
    setHeader(event, 'X-Compression-Level', compressionLevel.toString())
    setHeader(event, 'X-Speed', speed.toString())
    setHeader(event, 'X-Is-Animated', isAnimated ? 'true' : 'false')

    return result.data
  } catch (error: unknown) {
    handleApiError(error, 'Image format conversion')
  }
})
