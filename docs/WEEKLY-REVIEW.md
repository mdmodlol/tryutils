# TryUtils 每周复盘流程（Business Harness）

## 目标

每周只做一次固定复盘，避免 Claude 在没有数据的情况下瞎忙。

复盘的目标不是产出漂亮报告，而是回答：

- 本周最该做哪 3 件事
- 哪些事明确不做
- 下周优先推进哪个主线任务

## 固定输入

默认输入为仓库里的最新 GSC 快照：

- `data/gsc-snapshots/YYYY-MM-DD/查询数.csv`
- `国家_地区.csv`
- `过滤器.csv`
- `设备.csv`
- `搜索结果呈现.csv`
- `图表.csv`
- `网页.csv`

以及当前规则文档：

- `CLAUDE.md`
- `docs/PROJECT-RULES.md`
- `docs/session-state.md`
- `docs/GROWTH-PRIORITIES.md`
- `docs/CONTENT-OPS.md`
- `docs/METRICS.md`

## 固定流程

### 1. 先生成 GSC summary

运行：

```bash
pnpm gsc:summary --date YYYY-MM-DD
```

读取：

- `docs/analytics/latest-gsc-summary.md`

### 2. 再做业务判断

Claude 必须先回答：

- 当前主线流量主要来自哪个主题
- 主要流量是博客页还是工具页
- 哪些页面高展示但 CTR 低
- 哪些页面已经接近前 10，值得优先优化

### 3. 输出固定结论

每周复盘的输出必须固定包含：

- 本周最重要的 3 个发现
- 最值得优化的 3 个页面
- 最值得新增的 3 个选题
- 最值得推进的 1 个工具体验优化
- 本周明确不做的事
- 下周优先任务建议

## 固定输出文件

- 标准 summary：`docs/analytics/latest-gsc-summary.md`
- 周复盘草稿：`docs/analytics/weekly/YYYY-MM-DD.md`

## “最值得优化的 3 个页面”怎么选

默认按这个顺序选：

1. 主线高展示低 CTR 页面
2. 主线排名 5-20 的页面
3. 已有点击但导流能力弱的主线文章

不要优先选：

- 非主线工具页
- 纯品牌词页面
- 没有展示的数据页面

## “最值得新增的 3 个选题”怎么选

默认只能从主线里选：

- compression 任务词
- heic 任务词
- 与图片主线强相关的开发者词

不要新增：

- 与主线无关的新工具主题
- 只会增加维护成本的泛教程

## “最值得推进的 1 个工具体验优化”怎么选

默认优先级：

1. `image-compressor`
2. `heic-converter`
3. `image-format-converter`

优化必须能回答：

- 它帮助用户更快完成什么任务
- 它是否能提升博客到工具的承接
- 它是否符合浏览器本地优先

## 本周明确不做的事

每周复盘里必须明确写出来，至少包含：

- 本周不做的新工具
- 本周不做的非主线内容扩张
- 本周不做的广告型变现动作

## 复盘完成后必须更新 session-state

至少更新：

- `当前整体进度`
- `正在进行的任务`
- `遗留问题 / 待处理风险`
- `关键决策记录`
- `下次 Session 启动指令`

## 如果复盘后要进入执行

不能直接开始改代码。

必须先：

1. 从复盘结果里选 1-2 个最高优先任务
2. 在 `plans/` 下创建或更新计划文档
3. 明确风险等级和验证命令
4. 再进入实现
