# TryUtils Session State（Harness 专用）

**最后更新**：2026-04-18

## 当前主线

- 站点定位：隐私优先的浏览器端图片处理站
- 主线工具：`image-compressor`、`heic-converter`、`image-format-converter`
- 主线内容域：`imagecompression`、`heicconverter`

## 当前整体进度

- 项目阶段：稳定维护阶段
- 当前重点：Harness 二期已落地，当前进入“主线博客联动 + 持续收敛 warning + 预设功能回归保护”阶段

## 正在进行的任务（Active Tasks）

- [已完成]：Harness 一期改造，已统一主线定位、修复 lint 门禁、补任务模板与 SEO / 路由回归测试
- [已完成]：围绕 `image compression + HEIC` 实现二期”内容与工具联动 harness”
- [已完成]：ImageCompressor 新增场景预设功能（网站上传、博客配图、邮件附件、iPhone照片分享）和目标体积快捷按钮（200KB/500KB/1MB/2MB）
- [已完成]：修复 ImageCompressor 预设“立即显示已自定义”的误判逻辑，并为预设配置补回 lint 覆盖与纯逻辑测试
- [下一步]：继续优化主线博客 CTA 文案与流量导向效果，逐步清理历史 warning

## 已完成但待验证项（Pending Verification）

- [事项1]：2026-04-16 将 main 合并到 dev，dev 现与 main 同步（c30e4a4）
- [事项2]：博客历史 `.en` / `-en` / 大小写混用 URL 的 301 与 canonical 修复已由自动化测试固化
- [事项3]：固定验收链 `pnpm test && pnpm exec eslint . && pnpm build` 已可稳定运行；当前仍保留存量 warning，后续逐步清理
- [事项4]：主线博客的 CTA / related tool / FAQ / canonical 联动已接入统一解析层，并由自动化测试覆盖
- [事项5]：`types/` 配置型 TypeScript 文件已补入 lint 覆盖，ImageCompressor 预设逻辑已由纯函数测试保护

## 遗留问题 / 待处理风险（Open Issues）

- [已知限制]：ESLint 门禁已恢复，但仓库仍有较多历史 warning，后续需要分批治理
- [待跟进]：主线博客仍有较多历史 frontmatter 缺口，当前依赖标准化解析层补默认值
- [待跟进]：二期已完成结构联动，后续需要结合 GSC 数据继续优化 CTA 文案与 related tool 排序
- [待跟进]：ImageCompressor 仍缺少更高层的组件交互测试；当前先用纯逻辑测试兜底预设行为

## 关键决策记录（Decisions Log）

- 2026-04-15：决定所有新图像工具必须保持浏览器本地优先，服务端仅做兜底
- 2026-04-16：将 main 合并到 dev，dev 作为开发分支，main 作为稳定分支
- 2026-04-18：正式将项目主线收紧为 `image compression + HEIC`，一期 harness 采用“单 agent 优先 + 软约束主线优先”
- 2026-04-18：一期固定验收链确认为 `pnpm test && pnpm exec eslint . && pnpm build`
- 2026-04-18：为避免门禁继续失效，一期将历史性未清理问题降为 warning，优先确保 lint 可真实执行
- 2026-04-18：二期内容与工具联动采用“frontmatter 优先 + 标准化解析层补默认值”方案，不强制一次性回填所有历史文章
- 2026-04-18：二期主线博客已统一接入 `CTA + related tool + FAQ + canonical` 联动，并新增全量主线文章测试
- 2026-04-18：预设“已自定义”状态改为基于当前值与预设值的确定性比较，不再依赖 watcher 时序
- 2026-04-18：驱动 UI 行为的配置型 `types/` / `data/` 文件必须进入 lint 覆盖，关键交互配置至少补一组回归测试

## 下次 Session 启动指令

- 优先阅读：`CLAUDE.md`、`docs/PROJECT-RULES.md`、`docs/session-state.md`
- 开始任何改动前先在 `plans/` 下创建或更新任务计划
- 完成改动后先跑固定验收链，再更新本文件
