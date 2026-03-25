<div align="center">

# 🛠️ TryUtils

**Free Online Utility Toolkit — Privacy-First, Browser-Based**

[![Nuxt 3](https://img.shields.io/badge/Nuxt-3.18-00DC82?style=flat-square&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.x-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

🌐 [www.tryutils.com](https://www.tryutils.com)

</div>

---

## 📖 Introduction

**TryUtils** is a full-featured online utility toolkit built with **Nuxt 3** and deployed on **Vercel**. It provides a rich collection of image processing, developer, and encoding/decoding tools — all processing happens **entirely in the browser**, ensuring user data never leaves the client. No registration required, no file uploads to remote servers.

The project features **i18n support** (Chinese & English), **dark mode**, **SEO optimization** with structured data, and a **technical blog system** powered by Nuxt Content.

---

## ✨ Tools & Features

### 🖼️ Image Tools

| Tool | Description |
|------|-------------|
| **Image Compressor** | Smart image compression that significantly reduces file size while maintaining visual quality. Supports JPEG, PNG, WebP formats with adjustable quality controls. |
| **HEIC Converter** | Convert Apple HEIC/HEIF images (from iPhone/iPad) to widely-compatible JPG, PNG formats. Supports single and batch conversion. |
| **Image Format Converter** | Universal image format converter supporting JPEG, PNG, WebP, GIF, AVIF, TIFF and more. Batch processing enabled. |

### 💻 Developer Tools

| Tool | Description |
|------|-------------|
| **JSON Formatter** | Format, validate, and minify JSON data with syntax highlighting, error location pinpointing, and tree view. |
| **Base64 Codec** | Encode/decode text and images to/from Base64. Supports file drag & drop and real-time preview. |
| **URL Codec** | URL encoding/decoding with support for both `encodeURIComponent` and `encodeURI` modes. |
| **Color Converter** | Convert between HEX, RGB, and HSL color formats with a visual color picker and palette. |
| **Text Diff** | Compare two blocks of text side-by-side, highlighting additions, deletions, and modifications with a diff algorithm. |
| **Markdown Preview** | Real-time Markdown to HTML preview supporting GFM syntax, code highlighting, and export to HTML. |

### 📱 Generator Tools

| Tool | Description |
|------|-------------|
| **QR Code Generator** | Generate customizable QR codes with configurable colors, sizes, logo embedding, and batch generation. Export as PNG/SVG. |

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Nuxt 3](https://nuxt.com/) + [Vue 3](https://vuejs.org/) (Composition API) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **Image Processing** | [Sharp](https://sharp.pixelplumbing.com/) (server-side) + Canvas API (client-side) |
| **HEIC Conversion** | [heic-convert](https://www.npmjs.com/package/heic-convert) |
| **QR Code** | [qrcode](https://www.npmjs.com/package/qrcode) |
| **File Archiving** | [JSZip](https://stuk.github.io/jszip/) (batch download) |
| **Content / Blog** | [@nuxt/content](https://content.nuxt.com/) (Markdown-based) |
| **Internationalization** | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) (zh-CN / en-US) |
| **Dark Mode** | [@nuxtjs/color-mode](https://color-mode.nuxtjs.org/) |
| **SEO** | [@nuxtjs/sitemap](https://sitemap.nuxtjs.org/) + [@nuxtjs/robots](https://github.com/nuxt-modules/robots) + JSON-LD Structured Data |
| **Icons** | [nuxt-icon](https://github.com/nuxt-modules/icon) + [@iconify-json/heroicons](https://heroicons.com/) |
| **Image Optimization** | [@nuxt/image](https://image.nuxt.com/) |
| **Analytics** | [nuxt-gtag](https://github.com/johannschopplich/nuxt-gtag) (Google Analytics) |
| **Testing** | [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/) + [axe-core](https://github.com/dequelabs/axe-core) (Accessibility) |
| **Package Manager** | [pnpm](https://pnpm.io/) 10.x |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
tryutils/
├── pages/                  # Page routes (each tool has its own page)
│   ├── index.vue           # Homepage
│   ├── image-compressor.vue
│   ├── heic-converter.vue
│   ├── image-format-converter.vue
│   ├── qr-code-generator.vue
│   ├── json-formatter.vue
│   ├── base64-codec.vue
│   ├── url-codec.vue
│   ├── color-converter.vue
│   ├── text-diff.vue
│   ├── markdown-preview.vue
│   ├── blog/               # Blog listing & article pages
│   ├── dev-tools/           # Dev tools category page
│   └── image-tools/         # Image tools category page
├── components/             # Vue components
│   ├── ImageCompressor.vue
│   ├── HeicConverter.vue
│   ├── ImageFormatConverter.vue
│   ├── QRCodeGenerator.vue
│   ├── JsonFormatter.vue
│   ├── Base64Codec.vue
│   ├── UrlCodec.vue
│   ├── ColorConverter.vue
│   ├── TextDiff.vue
│   ├── MarkdownPreview.vue
│   └── ...                 # Shared UI components
├── composables/            # Composable functions
│   ├── useImageCompression.ts
│   ├── useImageConverter.ts
│   ├── useQRCodeGenerator.ts
│   ├── useSEO.ts
│   ├── useMultiLanguageSEO.ts
│   ├── useStructuredData.ts
│   └── ...
├── server/api/             # Server-side API endpoints
│   ├── compress-image.post.ts
│   ├── convert-format.post.ts
│   ├── convert-heic.post.ts
│   ├── convert-heic-batch.post.ts
│   └── ...
├── content/blog/           # Markdown blog articles (zh & en)
│   ├── ImageCompression/
│   ├── HeicConverter/
│   ├── FormatConverter/
│   ├── JsonFormatter/
│   ├── Base64Codec/
│   ├── ColorConverter/
│   ├── TextDiff/
│   ├── UrlCodec/
│   └── MarkdownPreview/
├── data/                   # Static data & configuration
│   ├── toolConfig.ts       # Tool registry & metadata
│   └── faqData.ts          # FAQ structured data
├── i18n/locales/           # i18n translation files
│   ├── zh.json             # Chinese translations
│   └── en.json             # English translations
├── assets/css/             # Global stylesheets
├── public/                 # Static assets (favicon, PWA icons)
├── types/                  # TypeScript type definitions
├── nuxt.config.ts          # Nuxt configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/tryutils.git
cd tryutils

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server at http://localhost:3000
pnpm dev
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Linting

```bash
# Run ESLint
pnpm dlx eslint .
```

---

## 🌐 Internationalization (i18n)

The project supports **Chinese** (default) and **English**, powered by `@nuxtjs/i18n`.

Translation files are located in [`i18n/locales/`](i18n/locales/).

| Language | URL Pattern | Example |
|----------|-------------|---------|
| 🇨🇳 Chinese (default) | `/<tool-name>` | `/image-compressor` |
| 🇺🇸 English | `/en/<tool-name>` | `/en/image-compressor` |

URL strategy: `prefix_except_default` — the default locale (Chinese) has no prefix, while other locales are prefixed with their language code.

---

## 🌙 Dark Mode

Full dark mode support with three options:
- **System** — automatically follows OS preference
- **Light** — manual light theme
- **Dark** — manual dark theme

Implemented via `@nuxtjs/color-mode` with seamless theme transitions.

---

## 📝 Blog System

A built-in technical blog powered by **Nuxt Content**, featuring:

- 📄 Markdown-based articles with frontmatter metadata
- 🌍 Bilingual support (`.md` for Chinese, `.en.md` for English)
- 🏷️ Tag-based filtering and search
- 🔗 Related content recommendations
- 📊 SEO-optimized with structured data (FAQ schema, HowTo schema)

Blog articles are organized by tool category under [`content/blog/`](content/blog/):

```
content/blog/
├── ImageCompression/     # 5 articles (zh + en)
├── HeicConverter/        # 5 articles (zh + en)
├── FormatConverter/      # 5 articles (zh + en)
├── JsonFormatter/        # 5 articles (zh + en)
├── Base64Codec/          # 5 articles (zh + en)
├── ColorConverter/       # 5 articles (zh + en)
├── TextDiff/             # 5 articles (zh + en)
├── UrlCodec/             # 5 articles (zh + en)
└── MarkdownPreview/      # 5 articles (zh + en)
```

---

## 🔒 Privacy & Security

- **Client-side processing**: All image compression, format conversion, encoding/decoding, and text operations are performed entirely in the browser
- **No file uploads**: User files never leave the client machine (except for server-side Sharp processing when needed for advanced operations)
- **No registration**: All tools are freely accessible without creating an account
- **Security headers**: Server middleware enforces security best practices (XSS protection, content type sniffing prevention, etc.)

---

## 🔍 SEO Features

- Server-side rendering (SSR) via Nuxt 3
- Auto-generated `sitemap.xml` and `robots.txt`
- JSON-LD structured data (FAQ, HowTo, BreadcrumbList)
- OpenGraph and Twitter Card meta tags
- Multi-language `hreflang` alternate links
- Semantic HTML with accessibility considerations

---

## 📄 License

All rights reserved. This is a private project.
