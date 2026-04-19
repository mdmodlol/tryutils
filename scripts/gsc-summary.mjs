import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const REQUIRED_FILES = [
  '查询数.csv',
  '国家_地区.csv',
  '过滤器.csv',
  '设备.csv',
  '搜索结果呈现.csv',
  '图表.csv',
  '网页.csv',
]

function getArgValue(name) {
  const flag = `--${name}`
  const index = process.argv.indexOf(flag)
  if (index === -1) {
    return undefined
  }
  return process.argv[index + 1]
}

function parseCsv(text) {
  const rows = []
  let current = ''
  let row = []
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(current)
      current = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1
      }
      row.push(current)
      const hasMeaning = row.some((cell) => cell.trim().length > 0)
      if (hasMeaning) {
        rows.push(row)
      }
      row = []
      current = ''
      continue
    }

    current += char
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current)
    const hasMeaning = row.some((cell) => cell.trim().length > 0)
    if (hasMeaning) {
      rows.push(row)
    }
  }

  if (rows.length === 0) {
    return []
  }

  const header = rows[0].map((cell) => cell.replace(/^\uFEFF/, '').trim())
  return rows.slice(1).map((cells) => {
    const record = {}
    for (let i = 0; i < header.length; i += 1) {
      record[header[i]] = (cells[i] ?? '').trim()
    }
    return record
  })
}

async function readCsv(filePath) {
  const raw = await readFile(filePath, 'utf8')
  return parseCsv(raw)
}

function toNumber(value) {
  if (value === undefined || value === null) {
    return 0
  }

  const normalized = String(value).replace(/,/g, '').replace(/%/g, '').trim()
  const parsed = Number.parseFloat(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

function formatPercent(numerator, denominator) {
  if (!denominator) {
    return '0.00%'
  }
  return `${((numerator / denominator) * 100).toFixed(2)}%`
}

function formatDecimal(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '-'
  }
  return value.toFixed(2)
}

function classifyTopic(input) {
  const value = String(input || '').toLowerCase()

  if (value.includes('heic') || value.includes('heif')) {
    return 'heic'
  }

  if (
    value.includes('compress')
    || value.includes('compression')
    || value.includes('optimize')
    || value.includes('imagecompression')
    || value.includes('image-compressor')
    || value.includes('browser-image-compression')
  ) {
    return 'compression'
  }

  return 'other'
}

function summarizeTopicBuckets(items, key) {
  const buckets = new Map()

  for (const item of items) {
    const topic = classifyTopic(item[key])
    const current = buckets.get(topic) || { clicks: 0, impressions: 0 }
    current.clicks += toNumber(item['点击次数'])
    current.impressions += toNumber(item['展示'])
    buckets.set(topic, current)
  }

  return [...buckets.entries()]
    .map(([topic, stats]) => ({
      topic,
      clicks: stats.clicks,
      impressions: stats.impressions,
      ctr: formatPercent(stats.clicks, stats.impressions),
    }))
    .sort((a, b) => b.impressions - a.impressions)
}

function summarizeTotals(items) {
  const totals = items.reduce((acc, item) => {
    acc.clicks += toNumber(item['点击次数'])
    acc.impressions += toNumber(item['展示'])
    acc.positionSum += toNumber(item['排名']) * (toNumber(item['展示']) || 1)
    acc.positionWeight += toNumber(item['展示']) || (toNumber(item['排名']) ? 1 : 0)
    return acc
  }, { clicks: 0, impressions: 0, positionSum: 0, positionWeight: 0 })

  const averagePosition = totals.positionWeight
    ? totals.positionSum / totals.positionWeight
    : 0

  return {
    clicks: totals.clicks,
    impressions: totals.impressions,
    ctr: formatPercent(totals.clicks, totals.impressions),
    averagePosition,
  }
}

function sortByClicks(items, key) {
  return [...items]
    .sort((a, b) => toNumber(b['点击次数']) - toNumber(a['点击次数']) || toNumber(b['展示']) - toNumber(a['展示']))
    .slice(0, 10)
    .map((item) => ({
      label: item[key],
      clicks: toNumber(item['点击次数']),
      impressions: toNumber(item['展示']),
      ctr: item['点击率'] || formatPercent(toNumber(item['点击次数']), toNumber(item['展示'])),
      position: item['排名'] || '-',
    }))
}

function buildOpportunityList(items, key, type) {
  const filtered = items
    .map((item) => ({
      label: item[key],
      clicks: toNumber(item['点击次数']),
      impressions: toNumber(item['展示']),
      ctr: toNumber(item['点击率']),
      rawCtr: item['点击率'] || formatPercent(toNumber(item['点击次数']), toNumber(item['展示'])),
      position: toNumber(item['排名']),
    }))
    .filter((item) => item.label)

  if (type === 'high-impression-low-ctr') {
    return filtered
      .filter((item) => item.impressions >= 200 && item.ctr <= 0.3)
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 10)
  }

  if (type === 'near-breakthrough') {
    return filtered
      .filter((item) => item.impressions >= 100 && item.position > 10 && item.position <= 35)
      .sort((a, b) => a.position - b.position || b.impressions - a.impressions)
      .slice(0, 10)
  }

  return []
}

function toMarkdownTable(rows, columns) {
  if (!rows.length) {
    return '_暂无数据_'
  }

  const header = `| ${columns.map((column) => column.label).join(' | ')} |`
  const separator = `| ${columns.map(() => '---').join(' | ')} |`
  const body = rows.map((row) => (
    `| ${columns.map((column) => String(row[column.key] ?? '-')).join(' | ')} |`
  ))

  return [header, separator, ...body].join('\n')
}

function buildSummaryMarkdown({ date, sourceDir, datasets }) {
  const queryTotals = summarizeTotals(datasets.queries)
  const pageTotals = summarizeTotals(datasets.pages)
  const topicSummary = summarizeTopicBuckets(datasets.queries, '热门查询')
  const topQueries = sortByClicks(datasets.queries, '热门查询')
  const topPages = sortByClicks(datasets.pages, '排名靠前的网页')
  const topCountries = sortByClicks(datasets.countries, '国家/地区')
  const topDevices = sortByClicks(datasets.devices, '设备')
  const lowCtrPages = buildOpportunityList(datasets.pages, '排名靠前的网页', 'high-impression-low-ctr')
  const nearBreakthroughPages = buildOpportunityList(datasets.pages, '排名靠前的网页', 'near-breakthrough')

  return `# GSC 汇总（${date}）

## 快照信息

- 快照日期：\`${date}\`
- 数据来源目录：\`${sourceDir}\`
- 标准产物：\`docs/analytics/latest-gsc-summary.md\`

## 总览

- 查询维度：点击 ${formatNumber(queryTotals.clicks)}，展示 ${formatNumber(queryTotals.impressions)}，CTR ${queryTotals.ctr}，平均排名 ${formatDecimal(queryTotals.averagePosition)}
- 页面维度：点击 ${formatNumber(pageTotals.clicks)}，展示 ${formatNumber(pageTotals.impressions)}，CTR ${pageTotals.ctr}，平均排名 ${formatDecimal(pageTotals.averagePosition)}

## 主题归类

${toMarkdownTable(topicSummary, [
  { key: 'topic', label: '主题' },
  { key: 'clicks', label: '点击' },
  { key: 'impressions', label: '展示' },
  { key: 'ctr', label: 'CTR' },
])}

## Top 查询

${toMarkdownTable(topQueries, [
  { key: 'label', label: '查询' },
  { key: 'clicks', label: '点击' },
  { key: 'impressions', label: '展示' },
  { key: 'ctr', label: 'CTR' },
  { key: 'position', label: '排名' },
])}

## Top 页面

${toMarkdownTable(topPages, [
  { key: 'label', label: '页面' },
  { key: 'clicks', label: '点击' },
  { key: 'impressions', label: '展示' },
  { key: 'ctr', label: 'CTR' },
  { key: 'position', label: '排名' },
])}

## 设备分布

${toMarkdownTable(topDevices, [
  { key: 'label', label: '设备' },
  { key: 'clicks', label: '点击' },
  { key: 'impressions', label: '展示' },
  { key: 'ctr', label: 'CTR' },
  { key: 'position', label: '排名' },
])}

## 国家/地区分布

${toMarkdownTable(topCountries, [
  { key: 'label', label: '国家/地区' },
  { key: 'clicks', label: '点击' },
  { key: 'impressions', label: '展示' },
  { key: 'ctr', label: 'CTR' },
  { key: 'position', label: '排名' },
])}

## 高展示低 CTR 页面

${toMarkdownTable(lowCtrPages.map((item) => ({
  label: item.label,
  clicks: item.clicks,
  impressions: item.impressions,
  ctr: item.rawCtr || formatPercent(item.clicks, item.impressions),
  position: formatDecimal(item.position),
})), [
  { key: 'label', label: '页面' },
  { key: 'clicks', label: '点击' },
  { key: 'impressions', label: '展示' },
  { key: 'ctr', label: 'CTR' },
  { key: 'position', label: '排名' },
])}

## 低排名但开始起量的页面

${toMarkdownTable(nearBreakthroughPages.map((item) => ({
  label: item.label,
  clicks: item.clicks,
  impressions: item.impressions,
  ctr: item.rawCtr || formatPercent(item.clicks, item.impressions),
  position: formatDecimal(item.position),
})), [
  { key: 'label', label: '页面' },
  { key: 'clicks', label: '点击' },
  { key: 'impressions', label: '展示' },
  { key: 'ctr', label: 'CTR' },
  { key: 'position', label: '排名' },
])}

## 使用说明

- Claude 做 weekly review 时，先读本文件，再读 \`docs/GROWTH-PRIORITIES.md\`、\`docs/CONTENT-OPS.md\`、\`docs/METRICS.md\`、\`docs/WEEKLY-REVIEW.md\`
- 本文件只负责汇总，不替业务做最终判断
`
}

function buildWeeklyDraft({ date, topicSummary, topPages, lowCtrPages, nearBreakthroughPages }) {
  const topTopic = topicSummary[0]?.topic || 'other'
  const pageCandidates = topPages.slice(0, 3).map((item) => `- ${item.label}`)
  const lowCtrCandidates = lowCtrPages.slice(0, 3).map((item) => `- ${item.label}`)
  const nextTopics = nearBreakthroughPages.slice(0, 3).map((item) => `- 围绕 ${classifyTopic(item.label)} 主题继续优化：${item.label}`)

  return `# 每周 GSC 复盘草稿（${date}）

## 本周最重要的 3 个发现

1. 当前展示最集中的主题是 \`${topTopic}\`，说明主线判断仍然应围绕 compression / HEIC 继续收口。
2. 当前主要流量入口仍然更偏博客页，说明后续应优先优化博客到工具页的承接，而不是急着扩新工具。
3. 高展示低 CTR 页面仍有明显优化空间，优先做标题、描述、首段和 CTA 改写。

## 最值得优化的 3 个页面

${lowCtrCandidates.length ? lowCtrCandidates.join('\n') : '- 暂无满足阈值的页面'}

## 最值得新增的 3 个选题

${nextTopics.length ? nextTopics.join('\n') : '- 继续围绕现有主线页面做改稿，暂不新增主题'}

## 最值得推进的 1 个工具体验优化

- 优先检查 image-compressor 的场景预设、目标体积和博客承接文案，因为它最容易承接主线博客流量。

## 本周明确不做的事

- 不新增非主线工具
- 不扩张非主线内容域
- 不以广告为优先事项

## 下周优先任务建议

1. 先改 1-2 个高展示低 CTR 的主线页面
2. 再看主线博客 CTA / related tool 是否需要按意图细分
3. 如果仍有余力，再做主线工具页的小幅体验优化

## 候选页面参考

${pageCandidates.length ? pageCandidates.join('\n') : '- 暂无候选页面'}
`
}

async function main() {
  const date = getArgValue('date')
  const explicitSource = getArgValue('source')

  if (!date) {
    console.error('缺少参数：请使用 pnpm gsc:summary --date YYYY-MM-DD')
    process.exit(1)
  }

  const sourceDir = explicitSource
    ? path.resolve(explicitSource)
    : path.join(repoRoot, 'data', 'gsc-snapshots', date)

  const missingFiles = []
  for (const file of REQUIRED_FILES) {
    try {
      await readFile(path.join(sourceDir, file), 'utf8')
    } catch {
      missingFiles.push(file)
    }
  }

  if (missingFiles.length > 0) {
    console.error(`GSC 快照不完整：${sourceDir}`)
    console.error(`缺失文件：${missingFiles.join(', ')}`)
    process.exit(1)
  }

  const datasets = {
    queries: await readCsv(path.join(sourceDir, '查询数.csv')),
    countries: await readCsv(path.join(sourceDir, '国家_地区.csv')),
    filters: await readCsv(path.join(sourceDir, '过滤器.csv')),
    devices: await readCsv(path.join(sourceDir, '设备.csv')),
    searchAppearance: await readCsv(path.join(sourceDir, '搜索结果呈现.csv')),
    chart: await readCsv(path.join(sourceDir, '图表.csv')),
    pages: await readCsv(path.join(sourceDir, '网页.csv')),
  }

  const topicSummary = summarizeTopicBuckets(datasets.queries, '热门查询')
  const topPages = sortByClicks(datasets.pages, '排名靠前的网页')
  const lowCtrPages = buildOpportunityList(datasets.pages, '排名靠前的网页', 'high-impression-low-ctr')
  const nearBreakthroughPages = buildOpportunityList(datasets.pages, '排名靠前的网页', 'near-breakthrough')

  const summaryMarkdown = buildSummaryMarkdown({ date, sourceDir, datasets })
  const weeklyMarkdown = buildWeeklyDraft({ date, topicSummary, topPages, lowCtrPages, nearBreakthroughPages })

  const analyticsDir = path.join(repoRoot, 'docs', 'analytics')
  const weeklyDir = path.join(analyticsDir, 'weekly')

  await mkdir(weeklyDir, { recursive: true })
  await writeFile(path.join(analyticsDir, 'latest-gsc-summary.md'), summaryMarkdown, 'utf8')
  await writeFile(path.join(weeklyDir, `${date}.md`), weeklyMarkdown, 'utf8')

  console.log(`已生成 summary：docs/analytics/latest-gsc-summary.md`)
  console.log(`已生成周复盘草稿：docs/analytics/weekly/${date}.md`)
}

main().catch((error) => {
  console.error('gsc-summary 执行失败：', error)
  process.exit(1)
})
