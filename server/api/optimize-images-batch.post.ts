import sharp from 'sharp'
import JSZip from 'jszip'
import {
  parseBatchFormData,
  validateFormat,
  convertToFormat,
  setBatchZipResponseHeaders,
  handleApiError,
  makeOutputFilename,
  type ProcessedFileInfo
} from '../utils/image-api'

export default defineEventHandler(async (event) => {
  try {
    const { files } = await parseBatchFormData(event)

    // 获取查询参数
    const query = getQuery(event)
    const format = ((query.format as string) || 'jpeg').toLowerCase()
    const quality = parseInt(query.quality as string) || 80

    validateFormat(format, 'basic')

    // 过滤图片文件
    const imageFiles = files.filter(file =>
      file.filename?.toLowerCase().match(/\.(png|jpg|jpeg|webp|bmp|tiff)$/)
    )

    if (imageFiles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No supported image files found'
      })
    }

    // 批量处理
    const zip = new JSZip()
    const processedFiles: ProcessedFileInfo[] = []

    for (const file of imageFiles) {
      try {
        const sharpInstance = sharp(file.data)
        const result = await convertToFormat(sharpInstance, format, { quality: Math.round(quality) })

        const originalName = file.filename?.replace(/_decoded\.(png|jpg|jpeg|webp)$/i, '') || 'optimized'
        const newFilename = makeOutputFilename(originalName, format)

        zip.file(newFilename, result.data)
        processedFiles.push({
          filename: newFilename,
          originalSize: file.data.length,
          processedSize: result.data.length,
          width: result.info.width,
          height: result.info.height
        })
      } catch (fileError) {
        console.error(`处理文件 ${file.filename} 时出错:`, fileError)
      }
    }

    if (processedFiles.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'No files were successfully processed'
      })
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    setBatchZipResponseHeaders(event, {
      zipFilename: 'optimized_images.zip',
      zipSize: zipBuffer.length,
      processedFiles,
      format
    })

    return zipBuffer
  } catch (error: unknown) {
    handleApiError(error, 'Batch image optimization')
  }
})
