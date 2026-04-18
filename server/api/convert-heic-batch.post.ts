import sharp from 'sharp'
import JSZip from 'jszip'
import heicConvert from 'heic-convert'
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

    // 过滤 HEIC 文件
    const heicFiles = files.filter(file =>
      file.filename?.toLowerCase().match(/\.(heic|heif)$/)
    )

    if (heicFiles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No HEIC/HEIF files found'
      })
    }

    // 批量处理
    const zip = new JSZip()
    const processedFiles: ProcessedFileInfo[] = []

    for (const file of heicFiles) {
      try {
        // 用 heic-convert 将 HEIC 解码为 JPEG 中间格式（sharp 不支持直接处理 HEIC）
        const decodedBuffer = await heicConvert({
          buffer: file.data,
          format: 'JPEG',
          quality: Math.round(quality)
        })

        // 再用 sharp 转换为目标格式
        const sharpInstance = sharp(decodedBuffer)
        const result = await convertToFormat(sharpInstance, format, { quality: Math.round(quality) })

        const originalName = file.filename?.replace(/\.(heic|heif)$/i, '') || 'converted'
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
      zipFilename: 'converted_heic_files.zip',
      zipSize: zipBuffer.length,
      processedFiles,
      format
    })
    setHeader(event, 'X-Processing-Summary', JSON.stringify(processedFiles))

    return zipBuffer
  } catch (error: unknown) {
    handleApiError(error, 'Batch HEIC conversion')
  }
})
