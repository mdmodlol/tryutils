---
title: "encodeURI 与 encodeURIComponent 的区别详解"
description: "深入对比 JavaScript 中 encodeURI 和 encodeURIComponent 的区别，通过实例讲解何时使用哪个函数，避免常见的编码错误。"
date: '2025-02-25'
tags: ["JavaScript", "URL编码", "encodeURI", "encodeURIComponent", "前端"]
author: "TryUtils Team"
keywords: ["encodeURI", "encodeURIComponent", "区别", "JavaScript URL编码", "decodeURI", "decodeURIComponent", "URL编码函数", "JS编码", "URI编码", "URL转义函数"]
relatedTools:
  - url-codec
  - base64-codec
embedTool: url-codec
ogTitle: "encodeURI 与 encodeURIComponent 的区别详解"
ogDescription: "深入对比 encodeURI 和 encodeURIComponent，通过实例讲解正确的使用场景。"
canonical: "https://www.tryutils.com/blog/urlcodec/encodeuri-vs-encodeuricomponent"
schema:
  type: "Article"
  category: "技术教程"
  readingTime: "10分钟"
  difficulty: "中级"
  topics: ["JavaScript", "URL编码", "编码函数"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-02-25"
---

# encodeURI 与 encodeURIComponent 的区别详解

JavaScript 提供了两对 URL 编码/解码函数：`encodeURI`/`decodeURI` 和 `encodeURIComponent`/`decodeURIComponent`。很多开发者分不清它们的区别，导致编码错误。本文通过详细对比和实例，帮你彻底搞清楚。

## 核心区别一句话总结

- **encodeURI**：编码完整 URL，保留 URL 结构字符
- **encodeURIComponent**：编码 URL 的某个部分（如参数值），编码几乎所有特殊字符

## 详细对比

### 不编码的字符

两个函数都不会编码的字符（共同保留）：

```
A-Z a-z 0-9 - _ . ! ~ * ' ( )
```

`encodeURI` 额外保留的字符（URL 结构字符）：

```
; , / ? : @ & = + $ #
```

这意味着 `encodeURIComponent` 会编码上述字符，而 `encodeURI` 不会。

### 编码结果对比

```javascript
const testString = 'https://example.com/path?name=张三&age=25#section'

// encodeURI - 保留 URL 结构
encodeURI(testString)
// "https://example.com/path?name=%E5%BC%A0%E4%B8%89&age=25#section"
// 注意：:// / ? & = # 都没有被编码

// encodeURIComponent - 编码所有特殊字符
encodeURIComponent(testString)
// "https%3A%2F%2Fexample.com%2Fpath%3Fname%3D%E5%BC%A0%E4%B8%89%26age%3D25%23section"
// 注意：所有特殊字符都被编码了
```

### 逐字符对比表

| 字符 | encodeURI | encodeURIComponent | 说明 |
|------|-----------|-------------------|------|
| `:` | `:` (不编码) | `%3A` | 协议分隔符 |
| `/` | `/` (不编码) | `%2F` | 路径分隔符 |
| `?` | `?` (不编码) | `%3F` | 查询标识符 |
| `#` | `#` (不编码) | `%23` | 锚点标识符 |
| `&` | `&` (不编码) | `%26` | 参数分隔符 |
| `=` | `=` (不编码) | `%3D` | 键值分隔符 |
| `+` | `+` (不编码) | `%2B` | 加号 |
| `@` | `@` (不编码) | `%40` | at 符号 |
| `空格` | `%20` | `%20` | 两者都编码 |
| `中` | `%E4%B8%AD` | `%E4%B8%AD` | 两者都编码 |

## 使用场景详解

### 场景 1：编码完整 URL → 用 encodeURI

当你有一个包含非 ASCII 字符的完整 URL，需要编码后使用：

```javascript
const url = 'https://example.com/文档/教程?标题=入门指南'

// ✅ 正确：保留 URL 结构
const encoded = encodeURI(url)
// "https://example.com/%E6%96%87%E6%A1%A3/%E6%95%99%E7%A8%8B?%E6%A0%87%E9%A2%98=%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97"

// ❌ 错误：破坏了 URL 结构
const broken = encodeURIComponent(url)
// "https%3A%2F%2Fexample.com%2F%E6%96%87%E6%A1%A3%2F..."
```

### 场景 2：编码查询参数值 → 用 encodeURIComponent

当你需要将用户输入作为 URL 参数值时：

```javascript
const userInput = '价格>100 & 类别=电子产品'

// ✅ 正确：参数值中的 & 和 = 被编码
const url = `/search?q=${encodeURIComponent(userInput)}`
// "/search?q=%E4%BB%B7%E6%A0%BC%3E100%20%26%20%E7%B1%BB%E5%88%AB%3D%E7%94%B5%E5%AD%90%E4%BA%A7%E5%93%81"

// ❌ 错误：& 和 = 没有被编码，会破坏参数结构
const broken = `/search?q=${encodeURI(userInput)}`
// "/search?q=%E4%BB%B7%E6%A0%BC%3E100%20&%20%E7%B1%BB%E5%88%AB=%E7%94%B5%E5%AD%90%E4%BA%A7%E5%93%81"
// 浏览器会把 & 后面的内容当作新参数！
```

### 场景 3：编码路径段 → 用 encodeURIComponent

```javascript
const fileName = 'my file (1).pdf'

// ✅ 正确
const url = `/download/${encodeURIComponent(fileName)}`
// "/download/my%20file%20(1).pdf"
// 注意：括号实际上不需要编码，但编码了也没问题
```

### 场景 4：编码 Cookie 值 → 用 encodeURIComponent

```javascript
// 设置 Cookie
document.cookie = `username=${encodeURIComponent('张三; admin')}`
// "username=%E5%BC%A0%E4%B8%89%3B%20admin"
// 分号被编码，不会被误认为 Cookie 分隔符
```

### 场景 5：构建 mailto 链接 → 用 encodeURIComponent

```javascript
const subject = '关于产品咨询 & 报价'
const body = '你好，\n我想了解产品详情。'

const mailtoUrl = `mailto:sales@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
```

## 已废弃的 escape/unescape

JavaScript 还有一对已废弃的函数 `escape`/`unescape`，不要使用它们：

```javascript
// ❌ 已废弃，不要使用
escape('你好')     // "%u4F60%u597D" - 非标准格式
unescape('%u4F60%u597D')

// ✅ 使用标准函数
encodeURIComponent('你好')  // "%E4%BD%A0%E5%A5%BD" - 标准 UTF-8 编码
```

`escape` 的问题：
- 使用非标准的 `%uXXXX` 格式编码 Unicode 字符
- 不编码 `@`、`*`、`/`、`+` 等字符
- 已从 Web 标准中移除

## 解码函数对应关系

编码和解码函数必须配对使用：

```javascript
// ✅ 正确配对
decodeURI(encodeURI(url))
decodeURIComponent(encodeURIComponent(param))

// ❌ 错误配对可能导致异常
decodeURIComponent(encodeURI(url))  // 可能正常，但语义不对
decodeURI(encodeURIComponent(param))  // 可能无法正确解码
```

### 解码错误处理

```javascript
function safeDecode(str) {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    // 如果 decodeURIComponent 失败，尝试 decodeURI
    try {
      return decodeURI(str)
    } catch (e2) {
      return str  // 返回原始字符串
    }
  }
}
```

## 实际开发中的决策流程

```
需要编码 URL 相关内容？
│
├── 编码完整的 URL？
│   └── 使用 encodeURI()
│
├── 编码 URL 参数的值？
│   └── 使用 encodeURIComponent()
│
├── 编码 URL 路径段？
│   └── 使用 encodeURIComponent()
│
├── 构建查询字符串？
│   └── 使用 URLSearchParams（推荐）
│
└── 编码 Cookie/Header 值？
    └── 使用 encodeURIComponent()
```

## 使用 URLSearchParams 替代手动编码

现代开发中，推荐使用 `URLSearchParams` 来处理查询参数，它会自动处理编码：

```javascript
// 推荐方式
const params = new URLSearchParams({
  q: '搜索关键词',
  category: '技术&教程',
  page: '1'
})

const url = `https://api.example.com/search?${params.toString()}`
// 自动正确编码所有参数值
```

## 在线验证工具

不确定该用哪个函数？使用 [TryUtils URL 编解码工具](/url-codec) 在线测试，工具支持 `encodeURIComponent` 和 `encodeURI` 两种模式切换，可以直观对比编码结果。

::BlogToolEmbed{tool="url-codec"}
::

## 总结

| 场景 | 推荐函数 |
|------|---------|
| 编码完整 URL | `encodeURI` |
| 编码参数值 | `encodeURIComponent` |
| 编码路径段 | `encodeURIComponent` |
| 构建查询字符串 | `URLSearchParams` |
| 编码 Cookie 值 | `encodeURIComponent` |

记住一个简单的规则：**如果不确定，用 `encodeURIComponent`**。它编码的范围更广，更安全。只有在需要保留 URL 结构时，才使用 `encodeURI`。
