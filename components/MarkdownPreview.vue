<script setup lang="ts">
/**
 * MarkdownPreview Component
 * Real-time Markdown to HTML preview with syntax highlighting
 * Pure client-side processing using simple markdown parser
 */
const { t } = useI18n()

const inputText = ref('')
const outputHtml = ref('')
const previewMode = ref<'split' | 'preview' | 'code'>('split')
const copySuccess = ref(false)
const isDragging = ref(false)
let renderTimeout: NodeJS.Timeout | null = null

const inputStats = computed(() => {
  const text = inputText.value
  const chars = text.length
  const lines = text ? text.split('\n').length : 0
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const bytes = new Blob([text]).size
  const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
  return { chars, lines, words, size }
})

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

function parseMarkdown(markdown: string): string {
  let html = markdown
  const tableDividerCharacterClass = ['-', ':', '\\s', '\\|'].join('')
  const tablePattern = new RegExp(`\\| (.*?) \\|\\n\\| [${tableDividerCharacterClass}]+ \\|\\n((?:\\| .*? \\|\\n?)*)`, 'g')

  html = escapeHtml(html)
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>')
  html = html.replace(/^---$/gm, '<hr />')
  html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/____(.*?)____/g, '<strong><em>$1</em></strong>')
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
  html = html.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>')
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>')
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>')
  html = html.replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
  html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
  html = html.replace(/<\/ul>\n<ul>/g, '')

  const lines = html.split('\n')
  let inBlock = false
  html = lines.map((line) => {
    if (line.match(/^<[h|u|o|b|p|d|t]/)) {
      inBlock = true
      return line
    }
    if (line.trim() === '') {
      inBlock = false
      return ''
    }
    if (!inBlock && line.trim()) {
      return `<p>${line}</p>`
    }
    return line
  }).join('\n')

  html = html.replace(tablePattern, (match, header, rows) => {
    const headerCells = header.split('|').filter((c: string) => c.trim())
    const headerHtml = headerCells.map((c: string) => `<th>${c.trim()}</th>`).join('')
    const rowsHtml = rows.split('\n').filter((r: string) => r.trim()).map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim())
      return `<tr>${cells.map((c: string) => `<td>${c.trim()}</td>`).join('')}</tr>`
    }).join('')
    return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`
  })

  return html
}

function renderMarkdown(markdown: string): void {
  try {
    outputHtml.value = parseMarkdown(markdown)
  } catch (error) {
    console.error('Markdown rendering error:', error)
    outputHtml.value = `<div class="text-red-600 dark:text-red-400"><p>${t('markdownPreview.errors.render')}</p></div>`
  }
}

watch(inputText, (newVal) => {
  if (renderTimeout) clearTimeout(renderTimeout)
  renderTimeout = setTimeout(() => renderMarkdown(newVal), 300)
})

function handleFileUpload(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    inputText.value = e.target?.result as string
  }
  reader.readAsText(file)
}

function handleDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(): void {
  isDragging.value = false
}

function handleDrop(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (!files) return

  const file = files[0]
  if (file.type === 'text/markdown' || file.type === 'text/plain' || file.name.endsWith('.md')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      inputText.value = e.target?.result as string
    }
    reader.readAsText(file)
  }
}

async function copyToClipboard(): Promise<void> {
  try {
    await navigator.clipboard.writeText(outputHtml.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('Copy failed:', error)
  }
}

function downloadAsHtml(): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Preview</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; }
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    a { color: #0366d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  ${outputHtml.value}
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'markdown-preview.html'
  a.click()
  URL.revokeObjectURL(url)
}

function downloadAsMarkdown(): void {
  const blob = new Blob([inputText.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.md'
  a.click()
  URL.revokeObjectURL(url)
}

function clearAll(): void {
  if (confirm(t('markdownPreview.confirmClear'))) {
    inputText.value = ''
    outputHtml.value = ''
  }
}

function loadSample(): void {
  inputText.value = `# Markdown Preview Demo

## Features

- **Real-time preview** with syntax highlighting
- Support for **GFM** (GitHub Flavored Markdown)
- **Code blocks** with language support

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### Lists

1. First item
2. Second item
3. Third item

> This is a blockquote

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

[Visit TryUtils](https://www.tryutils.com)`
}

onMounted(() => {
  renderMarkdown('')
})
</script>

<template>
  <div class="w-full overflow-hidden rounded-[30px] border border-slate-200 bg-white/95 shadow-[0_24px_72px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none">
    <div class="border-b border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/80">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex gap-2">
          <button
            v-for="mode in ['split', 'preview', 'code']"
            :key="mode"
            :class="[
              'rounded-full px-3 py-2 text-sm font-medium transition-colors',
              previewMode === mode
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            ]"
            :aria-label="`${t('markdownPreview.panels.preview')} ${mode}`"
            @click="previewMode = mode as any"
          >
            <Icon
              :name="mode === 'split' ? 'heroicons:window' : mode === 'preview' ? 'heroicons:eye' : 'heroicons:code-bracket'"
              class="mr-1 inline h-4 w-4"
            />
            {{ mode === 'split' ? t('markdownPreview.modes.split') : mode === 'preview' ? t('markdownPreview.modes.preview') : t('markdownPreview.modes.code') }}
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            class="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            :title="t('markdownPreview.actions.sample')"
            @click="loadSample"
          >
            <Icon name="heroicons:sparkles" class="mr-1 inline h-4 w-4" />
            {{ t('markdownPreview.actions.sample') }}
          </button>
          <button
            :class="[
              'rounded-full px-3 py-2 text-sm font-medium transition-colors',
              copySuccess
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            ]"
            :title="t('markdownPreview.actions.copy')"
            @click="copyToClipboard"
          >
            <Icon :name="copySuccess ? 'heroicons:check' : 'heroicons:document-duplicate'" class="mr-1 inline h-4 w-4" />
            {{ copySuccess ? t('markdownPreview.actions.copied') : t('markdownPreview.actions.copy') }}
          </button>
          <button
            class="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            :title="t('markdownPreview.actions.downloadHtml')"
            @click="downloadAsHtml"
          >
            <Icon name="heroicons:arrow-down-tray" class="mr-1 inline h-4 w-4" />
            {{ t('markdownPreview.actions.downloadHtml') }}
          </button>
          <button
            class="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            :title="t('markdownPreview.actions.downloadMarkdown')"
            @click="downloadAsMarkdown"
          >
            <Icon name="heroicons:arrow-down-tray" class="mr-1 inline h-4 w-4" />
            {{ t('markdownPreview.actions.downloadMarkdown') }}
          </button>
          <button
            class="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-900/70 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
            :title="t('markdownPreview.actions.clear')"
            @click="clearAll"
          >
            <Icon name="heroicons:trash" class="mr-1 inline h-4 w-4" />
            {{ t('markdownPreview.actions.clear') }}
          </button>
        </div>
      </div>
    </div>

    <div class="flex h-[600px] flex-col lg:flex-row">
      <div v-if="previewMode !== 'preview'" class="flex flex-1 flex-col border-r border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <h3 class="font-semibold text-slate-700 dark:text-slate-300">{{ t('markdownPreview.panels.input') }}</h3>
          <label class="cursor-pointer">
            <input
              type="file"
              accept=".md,.txt"
              class="hidden"
              :aria-label="t('markdownPreview.actions.upload')"
              @change="handleFileUpload"
            />
            <span class="flex items-center gap-1 text-sm text-teal-700 hover:underline dark:text-teal-300">
              <Icon name="heroicons:arrow-up-tray" class="h-4 w-4" />
              {{ t('markdownPreview.actions.upload') }}
            </span>
          </label>
        </div>

        <div
          :class="[
            'relative flex-1',
            isDragging ? 'bg-slate-100 dark:bg-slate-900/80' : ''
          ]"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
        >
          <textarea
            v-model="inputText"
            :placeholder="t('markdownPreview.inputPlaceholder')"
            class="h-full w-full resize-none border-0 bg-white p-4 font-mono text-sm text-slate-900 focus:outline-none dark:bg-slate-950 dark:text-slate-100"
            spellcheck="false"
            :aria-label="t('markdownPreview.inputLabel')"
          />
          <div v-if="isDragging" class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[24px] border border-dashed border-teal-500 bg-slate-950/5">
            <div class="text-center">
              <Icon name="heroicons:arrow-down-tray" class="mx-auto mb-2 h-8 w-8 text-teal-600 dark:text-teal-300" />
              <p class="font-medium text-teal-700 dark:text-teal-300">{{ t('markdownPreview.dragDrop.dropHere') }}</p>
            </div>
          </div>
        </div>

        <div class="flex gap-4 border-t border-slate-200 bg-slate-50/80 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
          <span>{{ inputStats.chars }} {{ t('markdownPreview.stats.chars') }}</span>
          <span>{{ inputStats.lines }} {{ t('markdownPreview.stats.lines') }}</span>
          <span>{{ inputStats.words }} {{ t('markdownPreview.stats.words') }}</span>
          <span>{{ inputStats.size }}</span>
        </div>
      </div>

      <div v-if="previewMode !== 'code'" class="flex flex-1 flex-col border-l border-slate-200 dark:border-slate-800">
        <div class="border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/80">
          <h3 class="font-semibold text-slate-700 dark:text-slate-300">{{ t('markdownPreview.panels.preview') }}</h3>
        </div>

        <div class="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-auto p-4">
          <div
            v-html="outputHtml"
            class="text-slate-900 dark:text-slate-100"
            :aria-label="t('markdownPreview.previewLabel')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  @apply text-slate-900 dark:text-slate-100;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply mt-6 mb-4 font-bold text-slate-900 dark:text-slate-100;
}

.prose h1 {
  @apply text-2xl;
}

.prose h2 {
  @apply text-xl;
}

.prose h3 {
  @apply text-lg;
}

.prose p {
  @apply my-4;
}

.prose code {
  @apply rounded bg-slate-100 px-2 py-1 font-mono text-sm text-rose-600 dark:bg-slate-800 dark:text-rose-300;
}

.prose pre {
  @apply my-4 overflow-x-auto rounded-2xl bg-slate-100 p-4 dark:bg-slate-800;
}

.prose pre code {
  @apply bg-transparent p-0 text-slate-900 dark:text-slate-100;
}

.prose ul,
.prose ol {
  @apply my-4 ml-6;
}

.prose li {
  @apply my-2;
}

.prose blockquote {
  @apply my-4 border-l-4 border-slate-300 pl-4 italic text-slate-600 dark:border-slate-600 dark:text-slate-400;
}

.prose a {
  @apply text-teal-700 hover:underline dark:text-teal-300;
}

.prose table {
  @apply my-4 w-full border-collapse;
}

.prose th,
.prose td {
  @apply border border-slate-300 px-4 py-2 text-left dark:border-slate-600;
}

.prose th {
  @apply bg-slate-100 font-semibold dark:bg-slate-800;
}

.prose hr {
  @apply my-6 border-slate-300 dark:border-slate-600;
}
</style>
