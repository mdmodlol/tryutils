export type ScenePresetId = 'website' | 'blog' | 'email' | 'iphone'

export interface ScenePreset {
  id: ScenePresetId
  labelKey: string
  icon: string
  descriptionKey: string
  recommendedOptions: CompressionOptions
}

export interface CompressionOptions {
  quality: number
  format: 'jpeg' | 'png' | 'webp' | 'avif'
  maxWidth?: number
  maxHeight?: number
  maxSizeMB?: number
}

const PRESET_COMPARISON_KEYS = ['quality', 'format', 'maxWidth', 'maxHeight', 'maxSizeMB'] as const

export const scenePresets: ScenePreset[] = [
  {
    id: 'website',
    labelKey: 'imageCompressor.presets.cards.website.label',
    icon: 'heroicons:globe-alt',
    descriptionKey: 'imageCompressor.presets.cards.website.description',
    recommendedOptions: { quality: 80, format: 'webp', maxWidth: 1920 }
  },
  {
    id: 'blog',
    labelKey: 'imageCompressor.presets.cards.blog.label',
    icon: 'heroicons:document-text',
    descriptionKey: 'imageCompressor.presets.cards.blog.description',
    recommendedOptions: { quality: 85, format: 'jpeg', maxWidth: 1200 }
  },
  {
    id: 'email',
    labelKey: 'imageCompressor.presets.cards.email.label',
    icon: 'heroicons:envelope',
    descriptionKey: 'imageCompressor.presets.cards.email.description',
    recommendedOptions: { quality: 75, format: 'jpeg', maxWidth: 800, maxHeight: 800, maxSizeMB: 0.2 }
  },
  {
    id: 'iphone',
    labelKey: 'imageCompressor.presets.cards.iphone.label',
    icon: 'heroicons:device-phone-mobile',
    descriptionKey: 'imageCompressor.presets.cards.iphone.description',
    recommendedOptions: { quality: 90, format: 'jpeg', maxWidth: 2048, maxHeight: 2048 }
  }
]

export function getScenePresetById(presetId: ScenePresetId | null | undefined): ScenePreset | undefined {
  if (!presetId) return undefined

  return scenePresets.find(preset => preset.id === presetId)
}

export function normalizeCompressionOptions(options: CompressionOptions): CompressionOptions {
  return {
    quality: options.quality,
    format: options.format,
    maxWidth: options.maxWidth ?? undefined,
    maxHeight: options.maxHeight ?? undefined,
    maxSizeMB: options.maxSizeMB ?? undefined
  }
}

export function buildPresetOptions(presetId: ScenePresetId): CompressionOptions | undefined {
  const preset = getScenePresetById(presetId)

  if (!preset) return undefined

  return normalizeCompressionOptions(preset.recommendedOptions)
}

export function hasPresetOverrides(
  currentOptions: CompressionOptions,
  presetOptions: CompressionOptions
): boolean {
  const normalizedCurrent = normalizeCompressionOptions(currentOptions)
  const normalizedPreset = normalizeCompressionOptions(presetOptions)

  return PRESET_COMPARISON_KEYS.some(key => normalizedCurrent[key] !== normalizedPreset[key])
}

export const targetSizePresets = [
  { label: 'imageCompressor.presets.targetSize.200KB', value: 0.2 },
  { label: 'imageCompressor.presets.targetSize.500KB', value: 0.5 },
  { label: 'imageCompressor.presets.targetSize.1MB', value: 1 },
  { label: 'imageCompressor.presets.targetSize.2MB', value: 2 }
] as const
