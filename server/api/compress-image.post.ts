import sharp from 'sharp'
import {
  parseImageFormData,
  getFormField,
  getFormFieldInt,
  getFormFieldFloat,
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
    const quality = getFormFieldInt(formData, 'quality', 80)!
    const format = (getFormField(formData, 'format') || 'jpeg').toLowerCase()
    const maxWidth = getFormFieldInt(formData, 'maxWidth')
    const maxHeight = getFormFieldInt(formData, 'maxHeight')
    const maxSizeMB = getFormFieldFloat(formData, 'maxSizeMB')
    const originalFilename = getFormField(formData, 'originalFilename') || 'compressed'

    // 验证
    validateQuality(quality)
    validateFormat(format, 'extended')

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
        const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight, 1)
        targetWidth = Math.round(originalWidth * ratio)
        targetHeight = Math.round(originalHeight * ratio)
      } else if (maxWidth) {
        const ratio = Math.min(maxWidth / originalWidth, 1)
        targetWidth = Math.round(originalWidth * ratio)
        targetHeight = Math.round(originalHeight * ratio)
      } else if (maxHeight) {
        const ratio = Math.min(maxHeight / originalHeight, 1)
        targetWidth = Math.round(originalWidth * ratio)
        targetHeight = Math.round(originalHeight * ratio)
      }
    }

    if (targetWidth || targetHeight) {
      sharpInstance = sharpInstance.resize(targetWidth, targetHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    // 压缩处理
    let processedResult: { data: Buffer; info: sharp.OutputInfo }
    let actualQuality = quality

    if (maxSizeMB) {
      // 迭代压缩直到满足文件大小要求
      const targetSizeBytes = maxSizeMB * 1024 * 1024
      let attempts = 0
      const maxAttempts = 10

      do {
        processedResult = await convertToFormat(sharpInstance.clone(), format, { quality: actualQuality })
        if (processedResult.data.length <= targetSizeBytes || actualQuality <= 10) break
        actualQuality = Math.max(10, actualQuality - 10)
        attempts++
      } while (attempts < maxAttempts)
    } else {
      processedResult = await convertToFormat(sharpInstance, format, { quality: actualQuality })
    }

    const processedSize = processedResult.data.length
    const compressionRatio = ((originalSize - processedSize) / originalSize * 100).toFixed(2)

    // 设置响应头
    const contentType = format === 'jpg' ? 'jpeg' : format
    setHeader(event, 'Content-Type', `image/${contentType}`)
    setHeader(event, 'Content-Disposition', `attachment; filename="${makeOutputFilename(originalFilename, format, '_compressed')}"`)
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
  } catch (error: unknown) {
    handleApiError(error, 'Image compression')
  }
})
