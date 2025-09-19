import { readMultipartFormData } from 'h3'
import sharp from 'sharp'
import JSZip from 'jszip'

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
        statusMessage: 'No files uploaded'
      })
    }

    // 提取文件数据
    const files = formData.filter(item => item.filename && item.data)

    if (!files || files.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      })
    }

    // 获取查询参数
    const query = getQuery(event)
    const format = (query.format as string) || 'jpeg'
    const quality = parseInt(query.quality as string) || 80

    // 验证格式
    const supportedFormats = ['jpeg', 'png', 'webp']
    if (!supportedFormats.includes(format.toLowerCase())) {
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported format: ${format}. Supported formats: ${supportedFormats.join(', ')}`
      })
    }

    // 过滤HEIC文件
    const heicFiles = files.filter(file => {
      const isHEIC = file.filename?.toLowerCase().match(/\.(heic|heif)$/)
      return isHEIC
    })

    if (heicFiles.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No HEIC/HEIF files found'
      })
    }

    // 创建ZIP文件
    const zip = new JSZip()
    const processedFiles: Array<{
      filename: string
      originalSize: number
      processedSize: number
      width: number
      height: number
    }> = []

    // 处理每个文件
    for (const file of heicFiles) {
      try {
        // 获取文件数据 - formData中的data已经是Buffer
        const fileBuffer = file.data

        // 使用Sharp处理图片
        let sharpInstance = sharp(fileBuffer)

        // 获取原始图片信息
        const metadata = await sharpInstance.metadata()

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
            continue // 跳过不支持的格式
        }

        const processedBuffer = processedResult.data
        const processedInfo = processedResult.info

        // 生成新文件名
        const originalName = file.filename?.replace(/\.(heic|heif)$/i, '') || 'converted'
        const extension = format.toLowerCase() === 'jpeg' ? 'jpg' : format.toLowerCase()
        const newFilename = `${originalName}.${extension}`

        // 添加到ZIP
        zip.file(newFilename, processedBuffer)

        // 记录处理信息
        processedFiles.push({
          filename: newFilename,
          originalSize: fileBuffer.length,
          processedSize: processedBuffer.length,
          width: processedInfo.width,
          height: processedInfo.height
        })

      } catch (fileError) {
        console.error(`处理文件 ${file.filename} 时出错:`, fileError)
        // 继续处理其他文件，不中断整个流程
      }
    }

    if (processedFiles.length === 0) {
      throw createError({
        statusCode: 500,
        statusMessage: 'No files were successfully processed'
      })
    }

    // 生成ZIP文件
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // 计算统计信息
    const totalOriginalSize = processedFiles.reduce((sum, file) => sum + file.originalSize, 0)
    const totalProcessedSize = processedFiles.reduce((sum, file) => sum + file.processedSize, 0)
    const compressionRatio = ((totalOriginalSize - totalProcessedSize) / totalOriginalSize * 100).toFixed(1)

    // 设置响应头
    setHeader(event, 'Content-Type', 'application/zip')
    setHeader(event, 'Content-Disposition', `attachment; filename="converted_heic_files.zip"`)
    setHeader(event, 'Content-Length', zipBuffer.length.toString())
    
    // 添加批量处理信息到响应头
    setHeader(event, 'X-Total-Files', processedFiles.length.toString())
    setHeader(event, 'X-Total-Original-Size', totalOriginalSize.toString())
    setHeader(event, 'X-Total-Processed-Size', totalProcessedSize.toString())
    setHeader(event, 'X-Compression-Ratio', compressionRatio)
    setHeader(event, 'X-Processed-Format', format.toLowerCase())
    setHeader(event, 'X-Processing-Summary', JSON.stringify(processedFiles))

    // 返回ZIP文件
    return zipBuffer

  } catch (error) {
    console.error('Batch HEIC conversion error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Internal server error during batch HEIC conversion'
    })
  }
})