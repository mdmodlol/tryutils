# GSC 快照目录规范

## 目标

把 Google Search Console 手动导出的 CSV 放到仓库内固定位置，避免 Claude 每次猜下载目录。

## 标准目录结构

每次快照都放到：

```text
data/gsc-snapshots/YYYY-MM-DD/
```

例如：

```text
data/gsc-snapshots/2026-04-18/
```

## 标准文件名

每个快照目录默认包含以下 7 个文件，文件名保持 GSC 导出时的中文名：

- `查询数.csv`
- `国家_地区.csv`
- `过滤器.csv`
- `设备.csv`
- `搜索结果呈现.csv`
- `图表.csv`
- `网页.csv`

## 使用规则

- 新快照目录默认必须完整包含这 7 个文件
- 如果缺任一文件，`scripts/gsc-summary.mjs` 会报缺失并停止
- 标准分析入口始终优先读取 repo 内快照目录

## 临时兼容规则

- 允许先从系统下载目录临时读取 CSV
- 但后续应尽量复制到本目录后再分析
- 业务型 weekly review 默认只认本目录的快照

## 推荐操作

1. 从 GSC 导出最新 CSV
2. 新建 `data/gsc-snapshots/YYYY-MM-DD/`
3. 把 7 个 CSV 复制进去
4. 运行：

```bash
pnpm gsc:summary --date YYYY-MM-DD
```

5. 再让 Claude 基于生成的 summary 做 weekly review
