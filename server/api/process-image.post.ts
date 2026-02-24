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
    const width = getFormFieldInt(formData, 'width')
    const height = getFormFieldInt(formData, 'height')
    const originalFilename = getFormField(formData, 'originalFilename') || 'processed'

    // 验证
    validateQuality(quality)
    validateFormat(format, 'basic')

    // Sharp 处理
    let sharpInstance = sharp(imageFile.data)
    const metadata = await sharpInstance.metadata()

    if (width || height) {
      sharpInstance = sharpInstance.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    const result = await convertToFormat(sharpInstance, format, { quality })
    const filename = makeOutputFilename(originalFilename, format)

    // 响应
    setImageResponseHeaders(event, {
      format,
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
    handleApiError(error, 'Image processing')
  }
})
