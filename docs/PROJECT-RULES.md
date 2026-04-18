# TryUtils 项目规则（Harness Phase 1）

## 项目摘要

TryUtils 当前是一套基于 `Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS` 的双语图片处理站，产品重点不是“什么工具都做”，而是围绕以下主线稳定迭代：

- `image compression`
- `HEIC / HEIF workflow`

一期 harness 改造的核心不是扩品类，而是降低维护成本、保护 SEO / 路由修复成果，并让 AI 可以稳定维护现有主线。

## 当前主线与软约束

- 主线工具：
  - `image-compressor`
  - `heic-converter`
  - `image-format-converter`
- 主线内容域：
  - `imagecompression`
  - `heicconverter`
- 软约束规则：
  - 允许维护其他老工具
  - 但新增需求、SEO 优化、内容建设、首页露出、性能投入默认优先主线
  - 非主线改动必须在计划里说明理由

## 目录与责任边界

- `pages/`：页面路由与页面级 SEO 入口
- `components/`：工具 UI、博客 UI、共享壳层
- `composables/`：共享逻辑、SEO、结构化数据、图片处理状态
- `server/api/`：图片处理 API 入口
- `server/utils/image-api.ts`：图片 API 公共层，优先复用
- `server/middleware/01-blog-canonical-redirects.ts`：历史博客路径到规范路径的 301
- `data/toolConfig.ts`：工具注册表
- `data/blog-route-manifest.ts`：博客规范路径与历史别名的单一事实源
- `utils/blog-paths.ts`：公共路径、内容路径、canonical 路径映射
- `plans/`：任务计划与执行前上下文工件
- `docs/session-state.md`：当前会话状态与关键决策

## 任务流程

### 1. 开始任务前

- 先阅读：
  - `CLAUDE.md`
  - `docs/session-state.md`
  - 本文件
- 在 `plans/` 下创建或更新任务计划文档
- 默认使用 `plans/TASK-PLAN-TEMPLATE.md`

### 2. 实现任务时

- 优先复用现有 composables、共享 SEO 工具和图片 API 公共层
- 不重复创建第二套路由规范、第二套 canonical 逻辑、第二套图片校验逻辑
- 保持“浏览器本地优先”承诺，服务端仅用于受控兜底
- 所有驱动 UI 行为的配置型文件（尤其 `types/`、`data/`）必须进入 lint 覆盖
- 关键交互配置至少要有一组回归测试，避免配置改动绕过 harness

### 3. 收尾时

- 固定验收链：
  - `pnpm test`
  - `pnpm exec eslint .`
  - `pnpm build`
- 完成后更新 `docs/session-state.md`
- 做一次简短 self-review，说明：
  - 改动内容
  - 风险点
  - 测试覆盖

## 任务计划模板要求

每个计划至少包含这些字段：

- 任务名称
- 目标与成功标准
- 是否影响主线业务
- 范围内 / 范围外
- 风险等级（R0 / R1 / R2 / R3）
- 是否涉及：
  - SEO / canonical / og:url / hreflang
  - 博客路由 / manifest / redirect
  - 图片 API / 上传限制 / 隐私承诺
  - 首页 / 导航 / About / Privacy 定位文案
- 实施步骤
- 验证命令
- 风险与回退点

## 风险分级与人工介入

### R0

- 纯文案、注释、低风险文档整理

### R1

- 普通页面或组件维护
- 不涉及路径、SEO 核心逻辑、API、隐私承诺

### R2

- SEO / canonical / og:url / hreflang / i18n
- `data/blog-route-manifest.ts`
- `utils/blog-paths.ts`
- 博客 301 redirect
- 图片 API 与上传限制
- 首页、导航、About、Privacy 的站点定位文案

要求：

- 必须在计划里显式标记
- 必须执行完整验收链
- 必须补或更新回归测试

### R3

- 部署、生产配置、安全边界、破坏性迁移
- 任何可能改变隐私承诺或用户数据处理方式的改动

要求：

- 必须先人工确认
- 未确认前不继续执行

## 路由、SEO 与内容规则

- `data/blog-route-manifest.ts` 是博客规范路径和别名的事实源
- `utils/blog-paths.ts` 负责：
  - canonical path
  - public path 与 content path 映射
  - 历史路径兼容
- 不重新设计博客路径体系
- 必须继续兼容这些历史 URL 形态：
  - `.en`
  - `-en`
  - 大小写混用分类
  - `/en/...` 与非 `/en/...` 历史别名
- 页面层 canonical 与 `og:url` 必须对齐 `getCanonicalUrl`
- 修改上述逻辑时必须同步更新测试

## 工具与内容联动的二期接口

一期只定义，二期再自动化：

- 主线工具清单：
  - `image-compressor`
  - `heic-converter`
  - `image-format-converter`
- 主线内容域：
  - `imagecompression`
  - `heicconverter`
- 二期内容联动检查点：
  - related tool
  - CTA
  - FAQ
  - canonical

## 主线博客最小联动结构

从二期开始，`imagecompression` 与 `heicconverter` 下的博客默认纳入内容与工具联动 harness。

- 页面层必须能拿到标准化后的联动对象，至少包含：
  - `primaryTool`
  - `relatedTools`
  - `ctaVariant`
  - `faqCategory`
  - `canonicalPath`
- 新文章应优先显式提供这些字段
- 老文章允许由标准化解析层补默认值，但不能绕开统一解析层直接在页面里写分支
- 主线博客默认最小结构为：
  - 正文后主 CTA
  - related tool 区块
  - FAQ 区块
  - canonical 检查
- 新增主线文章时，如果缺少 CTA / related tool / FAQ / canonical 基线，测试必须能发现

## 修改清单

### 修改主线工具页时

- `pages/<tool>.vue`
- `components/<Tool>.vue`
- 相关 composable
- `data/toolConfig.ts`
- 双语文案
- 页面级 SEO / 结构化数据

### 修改博客路由或 canonical 逻辑时

- `data/blog-route-manifest.ts`
- `utils/blog-paths.ts`
- `server/middleware/01-blog-canonical-redirects.ts`
- 对应测试

### 修改图片 API 时

- `server/api/*.post.ts`
- `server/utils/image-api.ts`
- `server/middleware/security.ts`
- 对应工具页上传、错误、下载逻辑

## 命令约定

```bash
pnpm dev
pnpm test
pnpm exec eslint .
pnpm build
pnpm verify
```

说明：

- `pnpm verify` 是一期固定验收链的快捷入口
- 如果只跑了部分检查，不能当作任务完成

## 当前测试基线

- `utils/blog-paths.test.ts`：博客路径规范与历史别名回归
- `composables/useSEO.test.ts`：canonical 与 `og:url` 对齐

后续凡是触碰 SEO / 路由核心逻辑，必须优先扩这两类测试。

## 注意事项

- 不要修改 `.nuxt/`、`.output/`、`dist/`、`node_modules/`
- 不要把一期 harness 改造扩大成整站产品重构
- 不要为了加快速度跳过计划模板和 session-state
- 不要把站点重新扩展为“泛工具站”叙事
