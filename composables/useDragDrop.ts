import { ref, readonly } from 'vue'

export interface DragDropOptions {
  accept?: string[]
  maxFiles?: number
  maxSize?: number // bytes
}

export const useDragDrop = (options: DragDropOptions = {}) => {
  const isDragging = ref(false)
  const dragCounter = ref(0)
  const files = ref<File[]>([])
  const error = ref<string | null>(null)

  const {
    accept = ['.heic', '.heif'],
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024 // 50MB
  } = options

  /**
   * 验证文件
   */
  const validateFile = (file: File): boolean => {
    // 检查文件大小
    if (file.size > maxSize) {
      error.value = `文件 ${file.name} 超过最大大小限制 (${Math.round(maxSize / 1024 / 1024)}MB)`
      return false
    }

    // 检查文件格式
    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()
    
    const isAccepted = accept.some(acceptType => {
      if (acceptType.startsWith('.')) {
        // 文件扩展名检查
        return fileName.endsWith(acceptType.toLowerCase())
      } else if (acceptType.includes('/*')) {
        // MIME类型通配符检查 (如 image/*)
        const baseType = acceptType.split('/')[0]
        return fileType.startsWith(baseType + '/')
      } else {
        // 完整MIME类型检查 (如 image/jpeg)
        return fileType === acceptType.toLowerCase()
      }
    })
    
    if (!isAccepted) {
      error.value = `文件 ${file.name} 不是支持的格式。支持格式: ${accept.join(', ')}`
      return false
    }

    return true
  }

  /**
   * 处理文件列表
   */
  const processFiles = (fileList: FileList | File[]): File[] => {
    error.value = null
    const validFiles: File[] = []
    const fileArray = Array.from(fileList)

    // 检查文件数量
    if (fileArray.length > maxFiles) {
      error.value = `最多只能选择 ${maxFiles} 个文件`
      return []
    }

    // 验证每个文件
    for (const file of fileArray) {
      if (validateFile(file)) {
        validFiles.push(file)
      } else {
        return [] // 如果有任何文件验证失败，返回空数组
      }
    }

    return validFiles
  }

  /**
   * 拖拽进入
   */
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.value++
    isDragging.value = true
  }

  /**
   * 拖拽离开
   */
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.value--
    if (dragCounter.value === 0) {
      isDragging.value = false
    }
  }

  /**
   * 拖拽悬停
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  /**
   * 文件放置
   */
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    isDragging.value = false
    dragCounter.value = 0

    const droppedFiles = e.dataTransfer?.files
    if (droppedFiles) {
      const validFiles = processFiles(droppedFiles)
      if (validFiles.length > 0) {
        files.value = validFiles
      }
    }
  }

  /**
   * 文件选择器选择
   */
  const handleFileSelect = (e: Event) => {
    const target = e.target as HTMLInputElement
    const selectedFiles = target.files
    
    if (selectedFiles) {
      const validFiles = processFiles(selectedFiles)
      if (validFiles.length > 0) {
        files.value = validFiles
      }
    }
  }

  /**
   * 移除文件
   */
  const removeFile = (index: number) => {
    files.value.splice(index, 1)
  }

  /**
   * 清空文件列表
   */
  const clearFiles = () => {
    files.value = []
    error.value = null
  }

  /**
   * 格式化文件大小
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    // 状态
    isDragging: readonly(isDragging),
    files: readonly(files),
    error: readonly(error),

    // 方法
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileSelect,
    removeFile,
    clearFiles,
    formatFileSize
  }
}