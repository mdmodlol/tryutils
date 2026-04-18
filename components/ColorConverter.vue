<script setup lang="ts">
/**
 * ColorConverter Component
 * HEX / RGB / HSL color conversion with palette and history
 * Pure client-side processing, no backend API needed
 */
const { t } = useI18n()

// === Types ===
interface RGB { r: number; g: number; b: number }
interface HSL { h: number; s: number; l: number }

// === State ===
const hex = ref('#FF5733')
const rgb = reactive<RGB>({ r: 255, g: 87, b: 51 })
const hsl = reactive<HSL>({ h: 11, s: 100, l: 60 })
const colorHistory = ref<string[]>([])
const copySuccess = ref('')
const HISTORY_KEY = 'tryutils-color-history'
const MAX_HISTORY = 12

// === Color Conversion Algorithms ===

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function hexToRgb(h: string): RGB | null {
  const cleaned = h.replace('#', '')
  let full = cleaned
  if (full.length === 3) {
    full = full[0] + full[0] + full[1] + full[1] + full[2] + full[2]
  }
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return {
    r: parseInt(full.substring(0, 2), 16),
    g: parseInt(full.substring(2, 4), 16),
    b: parseInt(full.substring(4, 6), 16)
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const sn = s / 100, ln = l / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ln - c / 2
  let rn = 0, gn = 0, bn = 0

  if (h < 60) { rn = c; gn = x; bn = 0 }
  else if (h < 120) { rn = x; gn = c; bn = 0 }
  else if (h < 180) { rn = 0; gn = c; bn = x }
  else if (h < 240) { rn = 0; gn = x; bn = c }
  else if (h < 300) { rn = x; gn = 0; bn = c }
  else { rn = c; gn = 0; bn = x }

  return {
    r: Math.round((rn + m) * 255),
    g: Math.round((gn + m) * 255),
    b: Math.round((bn + m) * 255)
  }
}

// === Formatted Strings ===
const hexString = computed(() => hex.value)
const rgbString = computed(() => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
const hslString = computed(() => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)

// === Sync Helpers (prevent infinite loops) ===
let updating = false

function syncFromHex(newHex: string) {
  if (updating) return
  updating = true
  const parsed = hexToRgb(newHex)
  if (parsed) {
    rgb.r = parsed.r; rgb.g = parsed.g; rgb.b = parsed.b
    const h = rgbToHsl(parsed.r, parsed.g, parsed.b)
    hsl.h = h.h; hsl.s = h.s; hsl.l = h.l
  }
  updating = false
}

function syncFromRgb() {
  if (updating) return
  updating = true
  hex.value = rgbToHex(rgb.r, rgb.g, rgb.b)
  const h = rgbToHsl(rgb.r, rgb.g, rgb.b)
  hsl.h = h.h; hsl.s = h.s; hsl.l = h.l
  updating = false
}

function syncFromHsl() {
  if (updating) return
  updating = true
  const c = hslToRgb(hsl.h, hsl.s, hsl.l)
  rgb.r = c.r; rgb.g = c.g; rgb.b = c.b
  hex.value = rgbToHex(c.r, c.g, c.b)
  updating = false
}

// === Event Handlers ===

function onHexInput(val: string) {
  let v = val.trim()
  if (!v.startsWith('#')) v = '#' + v
  hex.value = v
  syncFromHex(v)
  addToHistory(hex.value)
}

function onColorPicker(e: Event) {
  const val = (e.target as HTMLInputElement).value
  hex.value = val.toUpperCase()
  syncFromHex(hex.value)
  addToHistory(hex.value)
}

function onRgbInput(channel: 'r' | 'g' | 'b', val: string) {
  const num = clamp(parseInt(val) || 0, 0, 255)
  rgb[channel] = num
  syncFromRgb()
  addToHistory(hex.value)
}

function onHslInput(channel: 'h' | 's' | 'l', val: string) {
  const max = channel === 'h' ? 360 : 100
  const num = clamp(parseInt(val) || 0, 0, max)
  hsl[channel] = num
  syncFromHsl()
  addToHistory(hex.value)
}

// === Random Color ===
function randomColor() {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  hex.value = rgbToHex(r, g, b)
  syncFromHex(hex.value)
  addToHistory(hex.value)
}

// === Copy ===
async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    copySuccess.value = label
    setTimeout(() => { copySuccess.value = '' }, 1500)
  } catch { /* ignore */ }
}

// === History ===
function loadHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) colorHistory.value = JSON.parse(stored)
  } catch { /* ignore */ }
}

function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(colorHistory.value))
  } catch { /* ignore */ }
}

function addToHistory(color: string) {
  const upper = color.toUpperCase()
  if (!/^#[0-9A-F]{6}$/.test(upper)) return
  colorHistory.value = [upper, ...colorHistory.value.filter(c => c !== upper)].slice(0, MAX_HISTORY)
  saveHistory()
}

function clearHistory() {
  colorHistory.value = []
  saveHistory()
}

function selectHistory(color: string) {
  hex.value = color
  syncFromHex(color)
}

// === Palette ===
function getComplementary(): string {
  const h2 = (hsl.h + 180) % 360
  const c = hslToRgb(h2, hsl.s, hsl.l)
  return rgbToHex(c.r, c.g, c.b)
}

function getAnalogous(): string[] {
  return [-30, 30].map(offset => {
    const h2 = (hsl.h + offset + 360) % 360
    const c = hslToRgb(h2, hsl.s, hsl.l)
    return rgbToHex(c.r, c.g, c.b)
  })
}

function getTriadic(): string[] {
  return [120, 240].map(offset => {
    const h2 = (hsl.h + offset) % 360
    const c = hslToRgb(h2, hsl.s, hsl.l)
    return rgbToHex(c.r, c.g, c.b)
  })
}

function getShades(): string[] {
  return [80, 60, 40, 20, 10].map(l => {
    const c = hslToRgb(hsl.h, hsl.s, l)
    return rgbToHex(c.r, c.g, c.b)
  })
}

function getTints(): string[] {
  return [20, 40, 60, 80, 90].map(l => {
    const c = hslToRgb(hsl.h, hsl.s, l)
    return rgbToHex(c.r, c.g, c.b)
  })
}

const complementary = computed(() => getComplementary())
const analogous = computed(() => getAnalogous())
const triadic = computed(() => getTriadic())
const shades = computed(() => getShades())
const tints = computed(() => getTints())

// Text color for contrast
function contrastText(hexColor: string): string {
  const c = hexToRgb(hexColor)
  if (!c) return '#000'
  const lum = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255
  return lum > 0.5 ? '#000000' : '#FFFFFF'
}

// === Init ===
onMounted(() => {
  loadHistory()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Color Input & Preview Card -->
    <div class="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Color Preview -->
        <div class="flex flex-col items-center gap-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {{ t('colorConverter.preview.title') }}
          </h3>
          <div
            class="h-40 w-40 rounded-[28px] border border-slate-200 shadow-[0_22px_56px_rgba(15,23,42,0.12)] transition-colors duration-200 dark:border-slate-700 dark:shadow-none"
            :style="{ backgroundColor: hex }"
          />
          <!-- Native Color Picker -->
          <label class="relative cursor-pointer">
            <input
              type="color"
              :value="hex"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              :aria-label="t('colorConverter.preview.title')"
              @input="onColorPicker"
            >
            <span class="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
              <Icon name="heroicons:swatch" class="w-4 h-4" aria-hidden="true" />
              {{ t('colorConverter.preview.title') }}
            </span>
          </label>
          <!-- Random Button -->
          <button
            class="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            @click="randomColor"
          >
            <Icon name="heroicons:sparkles" class="w-4 h-4" aria-hidden="true" />
            {{ t('colorConverter.actions.random') }}
          </button>
        </div>

        <!-- Format Inputs -->
        <div class="lg:col-span-2 space-y-5">
          <!-- HEX -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('colorConverter.formats.hex') }}
              </label>
              <button
                class="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors"
                :class="copySuccess === 'hex'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
                @click="copyToClipboard(hexString, 'hex')"
              >
                <Icon :name="copySuccess === 'hex' ? 'heroicons:check' : 'heroicons:clipboard-document'" class="w-3.5 h-3.5" aria-hidden="true" />
                {{ copySuccess === 'hex' ? t('colorConverter.actions.copySuccess') : t('colorConverter.actions.copy') }}
              </button>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0"
                :style="{ backgroundColor: hex }"
              />
              <input
                type="text"
                :value="hex"
                class="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 font-mono text-sm text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="#FF5733"
                maxlength="7"
                @change="onHexInput(($event.target as HTMLInputElement).value)"
              >
            </div>
          </div>

          <!-- RGB -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('colorConverter.formats.rgb') }}
              </label>
              <button
                class="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors"
                :class="copySuccess === 'rgb'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
                @click="copyToClipboard(rgbString, 'rgb')"
              >
                <Icon :name="copySuccess === 'rgb' ? 'heroicons:check' : 'heroicons:clipboard-document'" class="w-3.5 h-3.5" aria-hidden="true" />
                {{ copySuccess === 'rgb' ? t('colorConverter.actions.copySuccess') : t('colorConverter.actions.copy') }}
              </button>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="ch in (['r', 'g', 'b'] as const)" :key="ch">
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase">{{ ch }}</label>
                <input
                  type="number"
                  :value="rgb[ch]"
                  min="0"
                  max="255"
                  class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  @change="onRgbInput(ch, ($event.target as HTMLInputElement).value)"
                >
              </div>
            </div>
          </div>

          <!-- HSL -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ t('colorConverter.formats.hsl') }}
              </label>
              <button
                class="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors"
                :class="copySuccess === 'hsl'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
                @click="copyToClipboard(hslString, 'hsl')"
              >
                <Icon :name="copySuccess === 'hsl' ? 'heroicons:check' : 'heroicons:clipboard-document'" class="w-3.5 h-3.5" aria-hidden="true" />
                {{ copySuccess === 'hsl' ? t('colorConverter.actions.copySuccess') : t('colorConverter.actions.copy') }}
              </button>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">H (0-360)</label>
                <input
                  type="number"
                  :value="hsl.h"
                  min="0"
                  max="360"
                  class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  @change="onHslInput('h', ($event.target as HTMLInputElement).value)"
                >
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">S (0-100%)</label>
                <input
                  type="number"
                  :value="hsl.s"
                  min="0"
                  max="100"
                  class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  @change="onHslInput('s', ($event.target as HTMLInputElement).value)"
                >
              </div>
              <div>
                <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">L (0-100%)</label>
                <input
                  type="number"
                  :value="hsl.l"
                  min="0"
                  max="100"
                  class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 font-mono text-sm text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  @change="onHslInput('l', ($event.target as HTMLInputElement).value)"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Palette Card -->
    <div class="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Icon name="heroicons:paint-brush" class="w-5 h-5 text-purple-500" aria-hidden="true" />
        {{ t('colorConverter.palette.title') }}
      </h3>

      <div class="space-y-5">
        <!-- Complementary -->
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ t('colorConverter.palette.complementary') }}</p>
          <div class="flex gap-2">
            <div
              class="group relative h-14 w-14 cursor-pointer rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-105 dark:border-slate-700"
              :style="{ backgroundColor: hex }"
              @click="copyToClipboard(hex, 'palette-current')"
            >
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold transition-opacity" :style="{ color: contrastText(hex) }">{{ hex }}</span>
            </div>
            <div
              class="group relative h-14 w-14 cursor-pointer rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-105 dark:border-slate-700"
              :style="{ backgroundColor: complementary }"
              @click="copyToClipboard(complementary, 'palette-comp')"
            >
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold transition-opacity" :style="{ color: contrastText(complementary) }">{{ complementary }}</span>
            </div>
          </div>
        </div>

        <!-- Analogous -->
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ t('colorConverter.palette.analogous') }}</p>
          <div class="flex gap-2">
            <div
              v-for="(color, i) in [analogous[0], hex, analogous[1]]"
              :key="'ana-' + i"
              class="group relative h-14 w-14 cursor-pointer rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-105 dark:border-slate-700"
              :style="{ backgroundColor: color }"
              @click="copyToClipboard(color, 'palette-ana-' + i)"
            >
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold transition-opacity" :style="{ color: contrastText(color) }">{{ color }}</span>
            </div>
          </div>
        </div>

        <!-- Triadic -->
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ t('colorConverter.palette.triadic') }}</p>
          <div class="flex gap-2">
            <div
              v-for="(color, i) in [hex, ...triadic]"
              :key="'tri-' + i"
              class="group relative h-14 w-14 cursor-pointer rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-105 dark:border-slate-700"
              :style="{ backgroundColor: color }"
              @click="copyToClipboard(color, 'palette-tri-' + i)"
            >
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold transition-opacity" :style="{ color: contrastText(color) }">{{ color }}</span>
            </div>
          </div>
        </div>

        <!-- Shades -->
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ t('colorConverter.palette.shades') }}</p>
          <div class="flex gap-2 flex-wrap">
            <div
              v-for="(color, i) in shades"
              :key="'shade-' + i"
              class="group relative h-14 w-14 cursor-pointer rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-105 dark:border-slate-700"
              :style="{ backgroundColor: color }"
              @click="copyToClipboard(color, 'palette-shade-' + i)"
            >
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold transition-opacity" :style="{ color: contrastText(color) }">{{ color }}</span>
            </div>
          </div>
        </div>

        <!-- Tints -->
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{{ t('colorConverter.palette.tints') }}</p>
          <div class="flex gap-2 flex-wrap">
            <div
              v-for="(color, i) in tints"
              :key="'tint-' + i"
              class="group relative w-14 h-14 rounded-lg shadow-sm cursor-pointer border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
              :style="{ backgroundColor: color }"
              @click="copyToClipboard(color, 'palette-tint-' + i)"
            >
              <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[10px] font-mono font-bold transition-opacity" :style="{ color: contrastText(color) }">{{ color }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- History Card -->
    <div v-if="colorHistory.length > 0" class="rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Icon name="heroicons:clock" class="w-5 h-5 text-teal-600 dark:text-teal-300" aria-hidden="true" />
          {{ t('colorConverter.history.title') }}
        </h3>
        <button
          class="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          @click="clearHistory"
        >
          <Icon name="heroicons:trash" class="w-3.5 h-3.5" aria-hidden="true" />
          {{ t('colorConverter.history.clear') }}
        </button>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="color in colorHistory"
          :key="color"
          class="group relative h-12 w-12 rounded-2xl border transition-all hover:scale-105"
          :class="color === hex ? 'border-teal-500 ring-2 ring-teal-300 dark:ring-teal-800' : 'border-slate-200 dark:border-slate-700'"
          :style="{ backgroundColor: color }"
          :aria-label="color"
          @click="selectHistory(color)"
        >
          <span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 text-[9px] font-mono font-bold transition-opacity" :style="{ color: contrastText(color) }">{{ color }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
