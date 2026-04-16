# TryUtils 项目 Harness 规范（Claude Code 专用）

## 项目核心定位

- Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS 的浏览器优先、隐私优先在线工具站
- 所有图像工具优先在浏览器本地完成；必须使用服务端时，严格限制输入大小并说明原因
- 双语（默认中文，英文走 /en/ 前缀），SEO、性能、可访问性为第一优先级

## 技术与架构约束

- 优先复用 composables、data/toolConfig.ts、utils/、server/utils/image-api.ts
- 新增工具必须同步：data/toolConfig.ts、i18n 双语、SEO composable、FAQ
- 博客路径必须小写规范，旧链接通过 data/blog-route-manifest.ts + middleware 兼容，禁止直接删除映射
- 图像 API 改动必须走 server/utils/image-api.ts 公共层

## Harness 工作流规则

- 任何改动必须先创建/更新 Plans.md（包含验收标准）
- 改动后必须执行：pnpm test && pnpm exec eslint . && pnpm build
- 失败时只返回错误摘要 + 修复建议，不要输出完整日志
- 大型重构、路由变更、API 修改、博客路径调整必须等待人工批准
- 禁止修改：.nuxt、dist、node_modules、.env、生产配置、git 目录

## 人类介入检查点

- 涉及 SEO、canonical、i18n、隐私文案的变更
- 新增/修改服务端图像 API
- 博客路由或 manifest 变更
- 任何可能影响现有工具隐私承诺的改动

## 验证要求

- 改动后必须通过 pnpm test（尤其是 blog-paths.test.ts）
- 生产相关改动必须通过 build 检查
- 完成后执行 self-review：列出变更、风险、测试覆盖

## Session State 管理规则

- 每次 session 开始时，必须先执行：阅读 docs/session-state.md 并总结当前状态
- 每次重大变更、任务完成、或 session 结束前，必须执行：更新 docs/session-state.md
- 更新时只修改「最后更新」「当前整体进度」「正在进行的任务」「遗留问题」「关键决策记录」这几节
- 更新完成后输出一句：「session-state.md 已更新」

## Response Language

除非有特殊说明，否则请总是用简体中文进行回复。(Always respond in Simplified Chinese)

本文件为 Harness 核心规范，所有详细架构、目录、修改清单见 docs/PROJECT-RULES.md
