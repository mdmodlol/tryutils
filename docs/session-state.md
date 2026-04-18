# TryUtils Session State（Harness 专用）

**最后更新**：2026-04-19

## 当前主线

- 站点定位：隐私优先的浏览器端图片处理站
- 主线工具：`image-compressor`、`heic-converter`、`image-format-converter`
- 主线内容域：`imagecompression`、`heicconverter`

## 当前整体进度

- 项目阶段：稳定维护阶段
- 当前重点：Harness 二期已落地，当前进入“主线博客联动 + 持续收敛 warning + 预设功能回归保护”阶段

## 正在进行的任务（Active Tasks）

- [已完成]：修复首页导航栏下拉菜单被遮挡问题（给 header 添加 `sticky top-0 z-50`）
- [已完成]：围绕 `image compression + HEIC` 实现二期”内容与工具联动 harness”
- [已完成]：ImageCompressor 新增场景预设功能（网站上传、博客配图、邮件附件、iPhone照片分享）和目标体积快捷按钮（200KB/500KB/1MB/2MB）
- [已完成]：修复 ImageCompressor 预设”立即显示已自定义”的误判逻辑，并为预设配置补回 lint 覆盖与纯逻辑测试
- [已完成]：清理 ESLint warning，从 226 条降至 17 条（主线组件 attributes-order 全清，no-unused-vars 清除 21 条，process.server 迁移 3 条）
- [已完成]：继续清理至 17 条 warning（为 Vue emit 类型系统参数、v-html XSS 警告、OptimizedImage/RelatedContent props）
- [已完成]：修复 HomepageRedesign.vue 深色模式（5处CSS选择器：.section-label/.primary-action/.workspace-eyebrow/.process-index/.future-bullet-dot）
- [已完成]：修复 HomepageRedesign.vue 深色模式不生效问题（原因：`:global(.dark)` 规则被放在 scoped 样式块内，导致选择器无法匹配。解决方案：创建独立的非 scoped `<style>` 块来放置全局 dark mode 样式）
- [已完成]：修复 HeicConverter.vue 滑块样式（::-webkit-slider-thumb 和 ::-moz-range-thumb 的 dark mode 覆盖）
- [下一步]：继续清理剩余 warning，或继续优化主线博客 CTA 文案与流量导向

## 已完成但待验证项（Pending Verification）

- [事项1]：2026-04-18 修复首页导航栏下拉菜单被遮挡问题，通过给 `app.vue` header 添加 `sticky top-0 z-50` 解决；其他页面（image-tools、dev-tools）无此问题
- [事项2]：2026-04-16 将 main 合并到 dev，dev 现与 main 同步（c30e4a4）
- [事项2]：博客历史 `.en` / `-en` / 大小写混用 URL 的 301 与 canonical 修复已由自动化测试固化
- [事项3]：固定验收链 `pnpm test && pnpm exec eslint . && pnpm build` 已可稳定运行；当前仍保留存量 warning，后续逐步清理
- [事项4]：主线博客的 CTA / related tool / FAQ / canonical 联动已接入统一解析层，并由自动化测试覆盖
- [事项5]：`types/` 配置型 TypeScript 文件已补入 lint 覆盖，ImageCompressor 预设逻辑已由纯函数测试保护
- [事项6]：2026-04-19 修复 HomepageRedesign.vue 深色模式（5处CSS选择器缺失 dark mode 覆盖 + 样式块作用域修复）和 HeicConverter.vue 滑块样式（2处伪元素样式缺失覆盖）；经验收链确认

## 遗留问题 / 待处理风险（Open Issues）

- [已知限制]：ESLint warning 已从 226 条降至 17 条（剩余为 Vue emit 类型参数、v-html XSS 警告、props 默认值）
- [待确认]：v-html XSS 警告需确认 FAQ/JSON/Markdown/QRCodePreview 内容是否可信
- [待跟进]：主线博客仍有较多历史 frontmatter 缺口，当前依赖标准化解析层补默认值
- [待跟进]：二期已完成结构联动，后续需要结合 GSC 数据继续优化 CTA 文案与 related tool 排序
- [待跟进]：ImageCompressor 仍缺少更高层的组件交互测试；当前先用纯逻辑测试兜底预设行为

## 关键决策记录（Decisions Log）

- 2026-04-15：决定所有新图像工具必须保持浏览器本地优先，服务端仅做兜底
- 2026-04-16：将 main 合并到 dev，dev 作为开发分支，main 作为稳定分支
- 2026-04-18：正式将项目主线收紧为 `image compression + HEIC`，一期 harness 采用”单 agent 优先 + 软约束主线优先”
- 2026-04-18：一期固定验收链确认为 `pnpm test && pnpm exec eslint . && pnpm build`
- 2026-04-18：为避免门禁继续失效，一期将历史性未清理问题降为 warning，优先确保 lint 可真实执行
- 2026-04-18：二期内容与工具联动采用”frontmatter 优先 + 标准化解析层补默认值”方案，不强制一次性回填所有历史文章
- 2026-04-18：二期主线博客已统一接入 `CTA + related tool + FAQ + canonical` 联动，并新增全量主线文章测试
- 2026-04-18：预设”已自定义”状态改为基于当前值与预设值的确定性比较，不再依赖 watcher 时序
- 2026-04-18：驱动 UI 行为的配置型 `types/` / `data/` 文件必须进入 lint 覆盖，关键交互配置至少补一组回归测试
- 2026-04-19：深色模式修复采用 `:global(.dark)` 选择器覆盖硬编码 CSS，但必须放在非 scoped `<style>` 块中才能正确工作（Vue scoped CSS 会给类选择器添加属性选择器，导致 `:global(.dark) .class` 无法匹配 `<html class="dark">` 下的元素）

## 下次 Session 启动指令

- 优先阅读：`CLAUDE.md`、`docs/PROJECT-RULES.md`、`docs/session-state.md`
- 开始任何改动前先在 `plans/` 下创建或更新任务计划
- 完成改动后先跑固定验收链，再更新本文件
