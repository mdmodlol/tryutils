# TryUtils - 免费在线工具集合

[TryUtils](https://www.tryutils.com) 是一个基于 Nuxt 3 + vercel（免费版） 构建的在线工具网站，提供图片处理、格式转换、二维码生成等实用功能。所有处理均在浏览器端完成，无需上传文件到服务器，保护用户隐私。目的是为了后期接入谷歌AdSense广告赚钱！

## ✨ 功能

- **图片压缩** — 智能压缩图片大小，保持高质量的同时减少文件体积
- **HEIC 转换器** — 将 iPhone/iPad 的 HEIC 图片转换为 JPG、PNG 等常用格式
- **格式转换** — 支持 JPEG、PNG、WebP、GIF、AVIF、TIFF 等多种格式互转
- **二维码生成器** — 自定义颜色、尺寸、Logo 嵌入，支持批量生成
- **博客系统** — 基于 Nuxt Content 的技术博客，提供工具使用教程和技术文章

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Nuxt 3 + Vue 3 |
| 样式 | Tailwind CSS |
| 图片处理 | Sharp (服务端) + Canvas API (客户端) |
| HEIC 转换 | heic-convert |
| 二维码 | qrcode |
| 内容管理 | Nuxt Content |
| 国际化 | @nuxtjs/i18n (中文 / English) |
| 暗色模式 | @nuxtjs/color-mode |
| SEO | @nuxtjs/sitemap + @nuxtjs/robots + 结构化数据 |
| 测试 | Vitest + Vue Test Utils + axe-core (无障碍) |
| 包管理 | pnpm |

## 📁 项目结构

```
tryutils/
├── pages/              # 页面路由
├── components/         # Vue 组件
├── composables/        # 组合式函数（SEO、图片处理、二维码等）
├── server/api/         # 服务端 API（图片压缩、格式转换）
├── services/           # 服务层（图片处理、校验、错误处理）
├── content/blog/       # 博客 Markdown 文章
├── data/               # 工具配置、FAQ 数据
├── i18n/locales/       # 国际化翻译文件
├── assets/css/         # 全局样式
├── public/             # 静态资源（favicon、PWA 图标）
└── types/              # TypeScript 类型定义
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 10

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

### 运行测试

```bash
pnpm test
```

## 🌐 国际化

项目支持中文（默认）和英文两种语言，翻译文件位于 `i18n/locales/` 目录。

URL 策略为 `prefix_except_default`：
- 中文：`/image-compressor`
- 英文：`/en/image-compressor`

## 🌙 暗色模式

支持系统跟随、手动切换亮色/暗色主题，基于 `@nuxtjs/color-mode` 实现。

## 📝 博客

博客文章使用 Markdown 编写，存放在 `content/blog/` 目录下，按工具分类组织。支持中英双语文章（`.md` 为中文，`.en.md` 为英文）。

## 📄 License

私有项目，保留所有权利。
