# TryUtils Harness 规范（Phase 1）

## 项目定位

- TryUtils 当前不是泛在线工具站，而是“隐私优先的浏览器端图片处理站”。
- 当前主线业务固定为：`image compression + HEIC`。
- 一期只做软约束：允许维护其他老工具，但新增投入、SEO 修复、内容规划、工具体验优化默认先服务主线。
- 站点的核心承诺仍是：浏览器本地优先、双语可访问、SEO 可维护、服务端仅作受控兜底。

## 默认协作模式

- 默认采用 `单 agent 优先`。
- 只有在大型任务、跨子系统重构、或需要额外核查时，才追加 reviewer / 专项子任务。
- 一期不默认采用 planner / executor / reviewer 的强制分层编排。

## 一期 Harness 目标

- 把项目从“文档型 harness”升级为“可执行的稳维护 harness”。
- 固化现有 SEO / 路由修复成果，避免 canonical、i18n、博客旧路径回滚。
- 让 AI 在没有额外口头补充时，也能完成一次安全维护任务。
- 一期不做整站产品重构，不新增工具，不扩展自动内容生产系统。

## 任务入口规则

- 所有改动型任务必须先创建或更新 `plans/` 下的计划文档。
- 计划文档默认使用 `plans/TASK-PLAN-TEMPLATE.md`。
- 每个任务计划至少写清：
  - 目标与成功标准
  - 是否影响主线业务
  - 是否涉及 SEO / 路由 / API / 隐私 / 首页与导航定位
  - 要运行的验证命令
  - 风险等级与回退点

## 固定验收链

- 所有代码型任务收尾必须执行：
  - `pnpm test`
  - `pnpm exec eslint .`
  - `pnpm build`
- 允许额外补充专项检查，但不能替代上述固定验收链。
- 如果失败，只汇总失败摘要、影响范围和修复建议，不输出无意义的长日志。

## 高风险改动

以下改动默认视为高风险，必须在计划中显式标记并做完整验证：

- SEO / canonical / og:url / hreflang / i18n 相关改动
- 博客路由、`data/blog-route-manifest.ts`、`utils/blog-paths.ts`、redirect 逻辑
- 图片 API、`server/utils/image-api.ts`、上传限制、隐私承诺
- 首页、导航、About、Privacy、面向用户的定位文案
- 任何可能削弱“浏览器本地优先”承诺的实现

## 风险等级

- `R0`：纯文案、注释、低风险文档整理，不影响主线或用户行为
- `R1`：普通页面或组件维护，不改路径、不改 API、不改隐私承诺
- `R2`：涉及 SEO、canonical、i18n、博客路由、图片 API、首页/导航定位
- `R3`：涉及部署、生产配置、隐私承诺变更、安全边界、破坏性迁移

规则：

- `R0 / R1`：按固定验收链完成
- `R2`：必须显式列出风险与回归点，并执行完整验收链
- `R3`：必须先暂停并等待人工确认

## Session State 规则

- 每次 session 开始前先读 `docs/session-state.md`。
- 每次重大改动、任务完成、或 session 结束前更新 `docs/session-state.md`。
- 只维护固定字段：
  - 最后更新
  - 当前主线
  - 当前整体进度
  - 正在进行的任务
  - 已完成但待验证项
  - 遗留问题 / 待处理风险
  - 关键决策记录
- 更新完成后，明确说明：`session-state.md 已更新`。

## 路由与内容基线

- 现有 `blog-route-manifest + blog-paths + canonical redirect` 是一期基线，不重新设计路径体系。
- 所有博客规范路径必须保持小写。
- 历史 `.en`、`-en`、大小写混用路径必须继续兼容并 301 到规范地址。
- 新增或修改这类规则时，必须同步更新测试。

## 二期预留接口

一期只定义，不强制实现自动内容联动：

- 主线工具：`image-compressor`、`heic-converter`、`image-format-converter`
- 主线内容域：`imagecompression`、`heicconverter`
- 二期内容联动检查点：
  - related tool
  - CTA
  - FAQ
  - canonical

## 禁止事项

- 不要直接修改 `.nuxt/`、`.output/`、`dist/`、`node_modules/`
- 不要跳过固定验收链宣称“已完成”
- 不要在未说明风险的情况下改动 SEO / 路由 / 图片 API
- 不要把站点重新扩展回“泛工具站”定位

## 回复语言

- 除非用户另有说明，默认使用简体中文。
