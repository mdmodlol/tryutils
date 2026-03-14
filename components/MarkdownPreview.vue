<script setup lang="ts">
/**
 * MarkdownPreview Component
 * Real-time Markdown to HTML preview with syntax highlighting
 * Pure client-side processing using simple markdown parser
 */

const { t } = useI18n()

// === State ===
const inputText = ref('')
const outputHtml = ref('')
const previewMode = ref<'split' | 'preview' | 'code'>('split')
const copySuccess = ref(false)
const isDragging = ref(false)
let renderTimeout: NodeJS.Timeout | null = null

// === Computed ===
const inputStats = computed(() => {
  const text = inputText.value
  const chars = text.length
  const lines = text ? text.split('\n').length : 0
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const bytes = new Blob([text]).size
  const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
  return { chars, lines, words, size }
})

// === Simple Markdown Parser ===
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

  // Escape HTML first
  html = escapeHtml(html)

  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>')

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr />')

  // Code blocks
  html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/____(.*?)____/g, '<strong><em>$1</em></strong>')
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')

  // Blockquotes
  html = html.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>')

  // Lists
  html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>')
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>')
  html = html.replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
  html = html.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
  html = html.replace(/<\/ul>\n<ul>/g, '')

  // Paragraphs
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

  // Tables (simple support)
  html = html.replace(/\| (.*?) \|\n\| [-:\s|]+ \|\n((?:\| .*? \|\n?)*)/g, (match, header, rows) => {
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

// === Markdown Processing ===
function renderMarkdown(markdown: string): void {
  try {
    const html = parseMarkdown(markdown)
    outputHtml.value = html
  } catch (error) {
    console.error('Markdown rendering error:', error)
    outputHtml.value = '<div class="text-red-600 dark:text-red-400"><p>Error rendering markdown</p></div>'
  }
}

// === Watch for input changes with debounce ===
watch(inputText, (newVal) => {
  if (renderTimeout) clearTimeout(renderTimeout)
  renderTimeout = setTimeout(() => {
    renderMarkdown(newVal)
  }, 300)
})

// === File Upload ===
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

// === Drag & Drop ===
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

// === Copy to Clipboard ===
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

// === Download ===
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

// === Clear ===
function clearAll(): void {
  if (confirm('Clear all content?')) {
    inputText.value = ''
    outputHtml.value = ''
  }
}

// === Load sample ===
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

// Initialize with empty state
onMounted(() => {
  renderMarkdown('')
})
</script>

<template>
  <div class="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <!-- Toolbar -->
    <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
      <div class="flex flex-wrap gap-2 items-center justify-between">
        <!-- Mode Selector -->
        <div class="flex gap-2">
          <button
            v-for="mode in ['split', 'preview', 'code']"
            :key="mode"
            @click="previewMode = mode as any"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              previewMode === mode
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
            :aria-label="`Switch to ${mode} mode`"
          >
            <Icon 
              :name="mode === 'split' ? 'heroicons:window' : mode === 'preview' ? 'heroicons:eye' : 'heroicons:code-bracket'"
              class="w-4 h-4 inline mr-1"
            />
            {{ mode === 'split' ? 'Split' : mode === 'preview' ? 'Preview' : 'Code' }}
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 flex-wrap">
          <button
            @click="loadSample"
            class="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Load sample"
          >
            <Icon name="heroicons:sparkles" class="w-4 h-4 inline mr-1" />
            Sample
          </button>
          <button
            @click="copyToClipboard"
            :class="[
              'px-3 py-2 rounded-md text-sm font-medium transition-colors',
              copySuccess
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            ]"
            title="Copy HTML"
          >
            <Icon :name="copySuccess ? 'heroicons:check' : 'heroicons:document-duplicate'" class="w-4 h-4 inline mr-1" />
            {{ copySuccess ? 'Copied!' : 'Copy' }}
          </button>
          <button
            @click="downloadAsHtml"
            class="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Download as HTML"
          >
            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 inline mr-1" />
            HTML
          </button>
          <button
            @click="downloadAsMarkdown"
            class="px-3 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Download as Markdown"
          >
            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 inline mr-1" />
            MD
          </button>
          <button
            @click="clearAll"
            class="px-3 py-2 rounded-md text-sm font-medium bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            title="Clear all"
          >
            <Icon name="heroicons:trash" class="w-4 h-4 inline mr-1" />
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row h-[600px]">
      <!-- Input Section -->
      <div v-if="previewMode !== 'preview'" class="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
        <!-- Input Header -->
        <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 flex justify-between items-center">
          <h3 class="font-semibold text-gray-700 dark:text-gray-300">Markdown Input</h3>
          <label class="cursor-pointer">
            <input
              type="file"
              accept=".md,.txt"
              @change="handleFileUpload"
              class="hidden"
              aria-label="Upload file"
            />
            <span class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <Icon name="heroicons:arrow-up-tray" class="w-4 h-4" />
              Upload
            </span>
          </label>
        </div>

        <!-- Input Area -->
        <div
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
          @drop="handleDrop"
          :class="[
            'flex-1 relative',
            isDragging ? 'bg-blue-50 dark:bg-blue-900/20' : ''
          ]"
        >
          <textarea
            v-model="inputText"
            placeholder="Enter Markdown here..."
            class="w-full h-full p-4 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0 focus:outline-none resize-none"
            spellcheck="false"
            aria-label="Markdown input"
          />
          <div v-if="isDragging" class="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center pointer-events-none">
            <div class="text-center">
              <Icon name="heroicons:arrow-down-tray" class="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p class="text-blue-600 dark:text-blue-400 font-medium">Drop Markdown file here</p>
            </div>
          </div>
        </div>

        <!-- Input Stats -->
        <div class="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2 text-xs text-gray-600 dark:text-gray-400 flex gap-4">
          <span>{{ inputStats.chars }} chars</span>
          <span>{{ inputStats.lines }} lines</span>
          <span>{{ inputStats.words }} words</span>
          <span>{{ inputStats.size }}</span>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="previewMode !== 'code'" class="flex-1 flex flex-col border-l border-gray-200 dark:border-gray-700">
        <!-- Preview Header -->
        <div class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3">
          <h3 class="font-semibold text-gray-700 dark:text-gray-300">Preview</h3>
        </div>

        <!-- Preview Area -->
        <div class="flex-1 overflow-auto p-4 prose prose-sm dark:prose-invert max-w-none">
          <div
            v-html="outputHtml"
            class="text-gray-900 dark:text-gray-100"
            aria-label="Markdown preview"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  @apply text-gray-900 dark:text-gray-100;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  @apply font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4;
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
  @apply bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400;
}

.prose pre {
  @apply bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto my-4;
}

.prose pre code {
  @apply bg-transparent p-0 text-gray-900 dark:text-gray-100;
}

.prose ul,
.prose ol {
  @apply my-4 ml-6;
}

.prose li {
  @apply my-2;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4;
}

.prose a {
  @apply text-blue-600 dark:text-blue-400 hover:underline;
}

.prose table {
  @apply w-full border-collapse my-4;
}

.prose th,
.prose td {
  @apply border border-gray-300 dark:border-gray-600 px-4 py-2 text-left;
}

.prose th {
  @apply bg-gray-100 dark:bg-gray-700 font-semibold;
}

.prose hr {
  @apply my-6 border-gray-300 dark:border-gray-600;
}
</style>
