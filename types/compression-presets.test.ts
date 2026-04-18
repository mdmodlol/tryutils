import { describe, expect, it } from 'vitest'

import {
  buildPresetOptions,
  getScenePresetById,
  hasPresetOverrides,
  type CompressionOptions,
} from './compression-presets'

describe('compression presets', () => {
  it('does not mark a freshly applied preset as customized', () => {
    const presetOptions = buildPresetOptions('website')

    expect(presetOptions).toBeDefined()
    expect(hasPresetOverrides(presetOptions!, presetOptions!)).toBe(false)
  })

  it('marks manual quality changes as overrides', () => {
    const presetOptions = buildPresetOptions('blog')!
    const customizedOptions: CompressionOptions = {
      ...presetOptions,
      quality: presetOptions.quality - 10,
    }

    expect(hasPresetOverrides(customizedOptions, presetOptions)).toBe(true)
  })

  it('marks target size shortcut changes as overrides when they diverge from the preset', () => {
    const presetOptions = buildPresetOptions('website')!
    const customizedOptions: CompressionOptions = {
      ...presetOptions,
      maxSizeMB: 0.5,
    }

    expect(hasPresetOverrides(customizedOptions, presetOptions)).toBe(true)
  })

  it('resets customization state when switching to another preset', () => {
    const blogOptions = buildPresetOptions('blog')!
    const customizedBlogOptions: CompressionOptions = {
      ...blogOptions,
      format: 'webp',
    }
    const iphoneOptions = buildPresetOptions('iphone')!

    expect(hasPresetOverrides(customizedBlogOptions, blogOptions)).toBe(true)
    expect(hasPresetOverrides(iphoneOptions, iphoneOptions)).toBe(false)
  })

  it('treats missing preset fields and explicit undefined values as equal', () => {
    const websitePreset = getScenePresetById('website')!
    const currentOptions: CompressionOptions = {
      quality: 80,
      format: 'webp',
      maxWidth: 1920,
      maxHeight: undefined,
      maxSizeMB: undefined,
    }

    expect(hasPresetOverrides(currentOptions, websitePreset.recommendedOptions)).toBe(false)
  })
})
