/**
 * 服务端 API 公共工具函数
 * 
 * 提取自 7 个 API 端点的重复逻辑：
 * - formData 解析与验证
 * - 参数提取
 * - Sharp 格式转换
 * - 错误处理
 * - 响应头设置
 */

import sharp from 'sharp'
import type { H3Event, MultiPartData } from 'h3'
import { readMultipartFormData } from 'h3'

// ============ 类型定义 ============

export type ImageFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'gif' | 'tiff'

export interface ParsedFormData {
  formData: MultiPartData[]
  imageFile: MultiPartData
}

export interface ParsedBatchFiles {
  formData: MultiPartData[]
  files: MultiPartData[]
}

export interface SharpConvertOptions {
  quality: number
  compressionLevel?: number
  speed?: number
  animated?: boolean
}

export interface ProcessedFileInfo {
  filename: string
  originalSize: number
  processedSize: number
  width: number
  height: number
}

// ============ FormData 解析 ============

/**
 * 解析 multipart formData 并提取单个图片文件
 * 适用于单文件上传的 API（compress, convert-format, process, optimize, convert-heic）
 */
export async function parseImageFormData(
  event: H3Event,
  fieldName: string = 'image'
): Promise<ParsedFormData> {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded'
    })
  }

  const imageFile = formData.find(item => 
    item.name === fieldName || (item.filename && item.data)
  )

  if (!imageFile || !imageFile.data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image file not found'
    })
  }

  return { formData, imageFile }
}

/**
 * 解析 multipart formData 并提取多个文件
 * 适用于批量上传的 API（convert-heic-batch, optimize-images-batch）
 */
export async function parseBatchFormData(event: H3Event): Promise<ParsedBatchFiles> {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files uploaded'
    })
  }

  const files = formData.filter(item => item.filename && item.data)

  if (files.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No files uploaded'
    })
  }

  return { formData, files }
}

// ============ 参数提取 ============

/**
 * 从 formData 中提取指定字段的字符串值
 */
export function getFormField(formData: MultiPartData[], name: string): string | undefined {
  const field = formData.find(item => item.name === name)
  return field ? field.data.toString() : undefined
}

/**
 * 从 formData 中提取指定字段的整数值
 */
export function getFormFieldInt(formData: MultiPartData[], name: string, defaultValue?: number): number | undefined {
  const value = getFormField(formData, name)
  if (value === undefined) return defaultValue
  const parsed = parseInt(value)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * 从 formData 中提取指定字段的浮点数值
 */
export function getFormFieldFloat(formData: MultiPartData[], name: string, defaultValue?: number): number | undefined {
  const value = getFormField(formData, name)
  if (value === undefined) return defaultValue
  const parsed = parseFloat(value)
  return isNaN(parsed) ? defaultValue : parsed
}

// ============ 参数验证 ============

const BASIC_FORMATS: ImageFormat[] = ['jpeg', 'jpg', 'png', 'webp']
const EXTENDED_FORMATS: ImageFormat[] = ['jpeg', 'jpg', 'png', 'webp', 'avif']
const ALL_FORMATS: ImageFormat[] = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'avif', 'tiff']

/**
 * 验证图片格式是否受支持
 */
export function validateFormat(format: string, level: 'basic' | 'extended' | 'all' = 'basic'): void {
  const supported = level === 'all' ? ALL_FORMATS : level === 'extended' ? EXTENDED_FORMATS : BASIC_FORMATS
  if (!supported.includes(format as ImageFormat)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Unsupported format: ${format}. Supported formats: ${supported.join(', ')}`
    })
  }
}

/**
 * 验证质量参数（1-100）
 */
export function validateQuality(quality: number): void {
  if (quality < 1 || quality > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Quality must be between 1 and 100'
    })
  }
}

// ============ Sharp 格式转换 ============

/**
 * 将 Sharp 实例按指定格式输出为 Buffer
 * 统一了所有 API 中重复的 switch-case 格式转换逻辑
 */
export async function convertToFormat(
  sharpInstance: sharp.Sharp,
  format: string,
  options: SharpConvertOptions = { quality: 80 }
): Promise<{ data: Buffer; info: sharp.OutputInfo }> {
  const { quality, compressionLevel = 6, animated = false } = options

  switch (format.toLowerCase()) {
    case 'jpeg':
    case 'jpg':
      return sharpInstance
        .jpeg({
          quality,
          progressive: true,
          mozjpeg: true
        })
        .toBuffer({ resolveWithObject: true })

    case 'png':
      return sharpInstance
        .png({
          compressionLevel,
          adaptiveFiltering: true,
          palette: quality < 90
        })
        .toBuffer({ resolveWithObject: true })

    case 'webp': {
      const webpOpts: sharp.WebpOptions = {
        quality,
        effort: 6
      }
      if (animated) {
        (webpOpts as any).animated = true
      }
      return sharpInstance
        .webp(webpOpts)
        .toBuffer({ resolveWithObject: true })
    }

    case 'avif':
      return sharpInstance
        .avif({
          quality,
          effort: 4
        })
        .toBuffer({ resolveWithObject: true })

    case 'gif': {
      const gifOpts: sharp.GifOptions = {}
      if (animated) {
        (gifOpts as any).animated = true
      }
      return sharpInstance
        .gif(gifOpts)
        .toBuffer({ resolveWithObject: true })
    }

    case 'tiff':
      return sharpInstance
        .tiff({
          quality,
          compression: 'lzw'
        })
        .toBuffer({ resolveWithObject: true })

    default:
      throw createError({
        statusCode: 400,
        statusMessage: `Unsupported format: ${format}`
      })
  }
}

// ============ 响应头设置 ============

/**
 * 设置单文件图片处理的通用响应头
 */
export function setImageResponseHeaders(
  event: H3Event,
  opts: {
    format: string
    filename: string
    originalSize: number
    processedSize: number
    metadata: sharp.Metadata
    processedInfo: sharp.OutputInfo
  }
): void {
  const { format, filename, originalSize, processedSize, metadata, processedInfo } = opts
  const contentType = format === 'jpg' ? 'jpeg' : format

  setHeader(event, 'Content-Type', `image/${contentType}`)
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
  setHeader(event, 'X-Original-Size', originalSize.toString())
  setHeader(event, 'X-Processed-Size', processedSize.toString())
  setHeader(event, 'X-Original-Width', (metadata.width || 0).toString())
  setHeader(event, 'X-Original-Height', (metadata.height || 0).toString())
  setHeader(event, 'X-Processed-Width', processedInfo.width.toString())
  setHeader(event, 'X-Processed-Height', processedInfo.height.toString())
  setHeader(event, 'X-Processed-Format', format)
}

/**
 * 设置批量处理 ZIP 文件的响应头
 */
export function setBatchZipResponseHeaders(
  event: H3Event,
  opts: {
    zipFilename: string
    zipSize: number
    processedFiles: ProcessedFileInfo[]
    format: string
  }
): void {
  const { zipFilename, processedFiles, format } = opts
  const totalOriginalSize = processedFiles.reduce((sum, f) => sum + f.originalSize, 0)
  const totalProcessedSize = processedFiles.reduce((sum, f) => sum + f.processedSize, 0)
  const compressionRatio = totalOriginalSize > 0
    ? ((totalOriginalSize - totalProcessedSize) / totalOriginalSize * 100).toFixed(1)
    : '0.0'

  setHeader(event, 'Content-Type', 'application/zip')
  setHeader(event, 'Content-Disposition', `attachment; filename="${zipFilename}"`)
  setHeader(event, 'X-Files-Processed', processedFiles.length.toString())
  setHeader(event, 'X-Total-Original-Size', totalOriginalSize.toString())
  setHeader(event, 'X-Total-Processed-Size', totalProcessedSize.toString())
  setHeader(event, 'X-Compression-Ratio', compressionRatio)
  setHeader(event, 'X-Output-Format', format.toLowerCase())
}

// ============ 错误处理 ============

/**
 * 统一的 API 错误处理
 * 修复了原代码中 error 类型不安全的问题
 */
export function handleApiError(error: unknown, context: string): never {
  console.error(`${context}:`, error)

  // 如果已经是 H3Error，直接抛出
  if (error && typeof error === 'object' && 'statusCode' in error) {
    throw error
  }

  throw createError({
    statusCode: 500,
    statusMessage: error instanceof Error
      ? error.message
      : `Internal server error during ${context}`
  })
}

// ============ 工具函数 ============

/**
 * 生成输出文件名
 */
export function makeOutputFilename(
  originalFilename: string,
  format: string,
  suffix: string = ''
): string {
  const baseName = originalFilename.replace(/\.(heic|heif|jpg|jpeg|png|webp|bmp|tiff|tif|avif|gif)$/i, '')
  const extension = format.toLowerCase() === 'jpeg' ? 'jpg' : format.toLowerCase()
  return suffix ? `${baseName}${suffix}.${extension}` : `${baseName}.${extension}`
}
