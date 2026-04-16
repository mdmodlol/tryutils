# TryUtils 项目说明（Claude Code 专用）

## 项目概览

TryUtils 是一个基于 `Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS` 的在线工具站，定位是“浏览器优先、隐私优先”的免费实用工具集合。

核心特点：

- 图像工具以 `HEIC 转换`、`图片压缩`、`图片格式转换` 为主。
- 开发者工具覆盖 `JSON`、`Base64`、`URL`、`颜色`、`文本 Diff`、`Markdown 预览`。
- 站点包含 `QR Code Generator`、`博客系统`、`关于/联系/隐私` 等内容页。
- 支持中文和英文双语，默认中文，英文使用 `/en` 前缀。
- 站点重视 SEO、结构化数据、可访问性和性能优化。
- 大多数工具都在浏览器本地完成处理；少量图像转换能力通过服务端 `Sharp` API 提供。

## 技术栈

- 框架：`Nuxt 3`
- 视图层：`Vue 3`
- 语言：`TypeScript`
- 样式：`Tailwind CSS`
- 内容系统：`@nuxt/content`
- 国际化：`@nuxtjs/i18n`
- 深色模式：`@nuxtjs/color-mode`
- SEO：`@nuxtjs/sitemap`、`@nuxtjs/robots`、JSON-LD
- 图片优化：`@nuxt/image`
- 图像处理：`sharp`、`heic-convert`
- 二维码：`qrcode`
- 压缩打包：`jszip`
- 测试：`Vitest`、`Vue Test Utils`、`axe-core`

## 目录地图

- `pages/`：路由页，每个工具通常对应一个页面。
- `components/`：工具 UI、布局组件、博客组件。
- `composables/`：通用逻辑、SEO、结构化数据、工具状态管理。
- `server/api/`：图像处理相关 API。
- `server/middleware/`：安全控制、博客旧链接重定向。
- `server/utils/`：服务端通用工具，主要是图像 API 的共用层。
- `content/blog/`：博客 Markdown 内容，按工具分类组织，中文和英文各有一套。
- `data/`：工具配置、FAQ、博客路由映射等静态数据。
- `i18n/locales/`：双语文案。
- `assets/css/`：全局样式。
- `utils/`：纯函数工具，尤其是博客路径标准化。
- `types/`：共享类型定义。
- `public/`：favicon、PWA 图标和站点静态资源。

## 现有功能

### 图像工具

- `image-compressor`
- `heic-converter`
- `image-format-converter`

### 开发者工具

- `json-formatter`
- `base64-codec`
- `url-codec`
- `color-converter`
- `text-diff`
- `markdown-preview`

### 其他页面

- `qr-code-generator`
- `about`
- `contact`
- `privacy`
- `blog`
- `image-tools`
- `dev-tools`

## 路由与内容规则

- 中文是默认语言，英文路由使用 `/en/...`。
- 博客路径有明确的标准化规则，旧的大小写路径、`.en` 后缀、`-en` slug 都需要兼容。
- 修改博客路由时，必须同步更新 `data/blog-route-manifest.ts` 和相关测试。
- 博客内容采用 `Nuxt Content`，主 schema 在 `content.config.ts` 中定义。
- 新增工具页时，通常要同时改页面、组件、文案、FAQ、SEO 和工具配置。

## 关键实现

- `data/toolConfig.ts`：工具注册表，负责名称、描述、图标、路径、分类和关键词。
- `utils/blog-paths.ts`：博客公共路径、内容路径、旧链接别名、canonical 逻辑。
- `server/middleware/01-blog-canonical-redirects.ts`：把旧博客路径重定向到规范路径。
- `server/middleware/security.ts`：只允许受控来源访问 `api`，并限制请求体大小。
- `server/utils/image-api.ts`：图像 API 的共用层，处理 multipart、参数校验、格式转换、响应头和错误封装。
- `server/api/*.post.ts`：各类图像处理接口入口，如压缩、格式转换、HEIC 转换、批量处理。
- `app.vue`：全局布局、导航、移动端菜单、SEO、canonical、语言切换。
- `pages/index.vue`：首页聚合各工具分类，并挂载首页 SEO / 结构化数据。

## 开发约定

- 优先复用已有的 `composables`、`data`、`utils` 和组件，不要重复造轮子。
- 新增或修改工具时，尽量保持浏览器本地处理的隐私承诺；如果必须走服务端，说明原因并限制输入规模。
- 双语内容要成对更新，避免中文有、英文缺，或者英文文案落后。
- 路由、SEO、结构化数据和内部链接要一起检查，不要只改页面主体。
- 博客相关变更要保持小写规范路径，旧链接靠重定向兼容，不要直接删除兼容映射。
- 图像 API 改动时，优先沿用 `server/utils/image-api.ts` 的共用函数，避免在各个接口里复制校验逻辑。
- 不要修改 `.nuxt/`、`dist/`、`node_modules/` 这类生成目录。
- 不要随意改动生产环境配置、密钥或部署相关环境变量。

## 修改清单

### 新增一个工具页时

至少检查并同步这些位置：

- `pages/<tool>.vue`
- `components/<Tool>.vue`
- `data/toolConfig.ts`
- `i18n/locales/zh.json`
- `i18n/locales/en.json`
- 相关 `FAQ` 或 `structured data` composable
- 相关博客文章或相关推荐

### 修改博客内容或路径时

至少检查并同步这些位置：

- `content/blog/**`
- `data/blog-route-manifest.ts`
- `utils/blog-paths.ts`
- `utils/blog-paths.test.ts`
- 相关组件或内部链接

### 修改图像 API 时

至少检查并同步这些位置：

- `server/api/*.post.ts`
- `server/utils/image-api.ts`
- `server/middleware/security.ts`
- 对应页面的上传、错误、下载逻辑

## 命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm test:watch
pnpm exec eslint .
```

说明：

- 仓库没有单独的 `lint` 脚本，所以直接用 `pnpm exec eslint .`。
- `pnpm install` 会触发 `nuxt prepare`。
- 生产相关改动优先跑 `test`、`lint`、`build`。

## 验证建议

- 改动博客路由或路径工具后，至少跑 `pnpm test`。
- 改动页面、组件或文案后，至少跑 `pnpm exec eslint .`。
- 改动 Nuxt 配置、布局、SEO、API 或共享逻辑后，建议再跑 `pnpm build`。
- 如果改动涉及无障碍或交互，优先补组件测试，必要时补 `axe` 相关检查。

## 已有测试重点

- `utils/blog-paths.test.ts` 覆盖博客规范路径、旧链接别名、内容路径与公共路径的互转。
- 新增博客别名或修改 canonical 规则时，要同步更新这些测试。

## 注意事项

- 站点强调“浏览器本地处理”和“隐私优先”，不要在文案、实现或 SEO 中把这一点写错。
- 图像工具页面和服务端 API 的文件大小限制不一定完全一致，改动时要同时看前端提示和后端限制。
- `app.vue` 中有全局 SEO、语言切换和 canonical 逻辑，改路由时不要只盯着单页。
- 如果要引入新依赖，优先确认它是否真的需要服务端能力，避免把本可本地完成的功能搬到后端。
