# TryUtils 内容运营规则（Business Harness）

## 内容的唯一目标

- 帮主线拿到更多搜索点击
- 把主线博客流量导到主线工具页
- 让 Claude 后续能判断“哪篇该改、哪篇该写、哪篇别碰”

内容不是为了凑数量，也不是为了看起来像内容站。

## 只允许经营的主线内容域

- `imagecompression`
- `heicconverter`

默认不扩张的内容域：

- `jsonformatter`
- `base64codec`
- `colorconverter`
- `textdiff`
- `urlcodec`
- `markdownpreview`
- 其他非主线工具内容域

这些老内容可以维护，但不作为当前增长重点。

## 选题来源优先级

Claude 选题时，必须按这个顺序找：

1. `GSC 高展示 + CTR 低` 的主线页面
2. `GSC 排名 5-20` 且有明显展示的主线主题
3. `已有点击` 但 CTA 和结构偏弱的主线文章
4. `主线工具页` 当前缺少承接场景的主题

默认不要用下面这些方式直接开新题：

- 只凭直觉
- 只凭“AI 觉得可能有流量”
- 只看海外模板站在写什么

## 值得写或优化的内容

### A. 高意图任务型

这类内容优先级最高：

- how to convert heic to jpg
- how to open heic
- compress image for email
- compress image for website
- reduce image size without losing quality

### B. 对比型

- heic vs jpg
- heic vs png
- image format comparison
- jpg png webp usage choice

### C. 开发者型主线内容

只保留与图片主线强相关的开发者内容：

- browser image compression
- image compression library
- canvas image compression
- client-side image optimization

## 不值得写的内容

- 与主线无关的泛开发者教程
- 不能导到主线工具页的解释型文章
- 展示长期很低、又没有业务承接价值的主题
- 为了“每周发文”硬凑的重复内容

## 主线文章固定结构

每篇主线文章默认必须包含：

1. 标题
   - 直接对应搜索意图
   - 不写空泛品牌标题

2. meta description
   - 直接说明这篇文章解决什么问题
   - 尽量带到具体动作或场景

3. 首段
   - 前 100-150 字先回答用户问题
   - 不要开场铺背景铺太长

4. 正文主体
   - 只保留帮助用户完成任务的内容
   - 结构尽量清晰，避免长段废话

5. 中段 CTA
   - 指向最相关主线工具
   - CTA 文案必须具体

6. FAQ
   - 优先覆盖继续搜索时会问的问题

7. 结尾强 CTA
   - 明确告诉用户下一步操作

## CTA 写法规则

不要写：

- 试试我们的工具
- 点击这里了解更多
- 使用免费工具

优先写：

- 直接在浏览器里把 HEIC 转成 JPG
- 现在把图片压到更适合邮件发送的大小
- 继续把图片转成更适合网页发布的格式

CTA 必须满足：

- 能看出任务
- 能看出结果
- 能和文章主题直接对应

## Related Tool 写法规则

related tool 不是随便挂 3 个链接。

默认规则：

- 第一位必须是最直接解决当前任务的主线工具
- 第二位才考虑承接步骤的辅助主线工具
- 非主线工具默认不要进主线文章 related tool

## 中英文内容规则

- 默认先优化已有高价值页面
- 不要求所有主线文章一上来都同步扩双语
- 如果中文页或英文页已经有展示或点击，优先优化已有版本
- 如果主题已经被某个语言版本验证有效，再考虑补另一语言版本

## Claude 做内容任务时的固定流程

1. 先读 `docs/GROWTH-PRIORITIES.md`
2. 再读最新 `docs/analytics/latest-gsc-summary.md`
3. 确认本轮任务属于：
   - 改已有页面
   - 新增主线文章
   - 改 CTA / FAQ / related tool
4. 先做高展示页面，后做新内容

## 内容任务完成时必须回答的 4 个问题

1. 这篇内容服务哪个主线任务
2. 它准备把用户导到哪个工具
3. 它解决的是 CTR 问题、排名问题，还是导流问题
4. 为什么这篇比其他备选主题更值得现在做
