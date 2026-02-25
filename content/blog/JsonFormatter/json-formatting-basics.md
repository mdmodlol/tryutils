---
title: "JSON 格式化入门：语法规则与常见错误"
description: "全面介绍 JSON 数据格式的语法规则、数据类型、格式化方法，以及开发中最常见的 JSON 语法错误和解决方案。帮助你快速掌握 JSON 格式化技巧。"
date: '2025-02-20'
tags: ["JSON", "格式化", "语法", "开发工具", "Web开发"]
author: "TryUtils Team"
keywords: ["JSON格式", "JSON语法", "JSON错误", "JSON格式化", "JSON数据类型", "JSON入门", "JSON教程", "JSON规范", "JSON解析", "在线JSON工具"]
relatedTools:
  - json-formatter
  - base64-codec
embedTool: json-formatter
ogTitle: "JSON 格式化入门：语法规则与常见错误 - 完整指南"
ogDescription: "全面介绍 JSON 语法规则、数据类型和常见错误，帮助开发者快速掌握 JSON 格式化技巧。"
canonical: "https://www.tryutils.com/blog/JsonFormatter/json-formatting-basics"
schema:
  type: "Article"
  category: "技术教程"
  readingTime: "12分钟"
  difficulty: "入门"
  topics: ["JSON", "格式化", "语法规则"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-02-20"
---

# JSON 格式化入门：语法规则与常见错误

JSON（JavaScript Object Notation）是当今最流行的数据交换格式之一。无论你是前端开发者、后端工程师还是数据分析师，掌握 JSON 的语法规则和格式化技巧都是必备技能。

---

## 什么是 JSON？

JSON 是一种轻量级的数据交换格式，由 Douglas Crockford 在 2001 年提出。它基于 JavaScript 对象语法的子集，但独立于任何编程语言，几乎所有现代编程语言都支持 JSON 的解析和生成。

### JSON 的核心特点

- **可读性强**：人类可以轻松阅读和编写
- **机器友好**：程序可以快速解析和生成
- **语言无关**：不依赖特定编程语言
- **结构清晰**：支持嵌套的层级结构

## JSON 语法规则详解

### 基本数据类型

JSON 支持以下六种数据类型：

```json
{
  "string": "这是一个字符串",
  "number": 42,
  "float": 3.14,
  "boolean": true,
  "null_value": null,
  "negative": -100
}
```

#### 1. 字符串（String）

字符串必须使用**双引号**包裹，这是 JSON 最严格的规则之一：

```json
{
  "correct": "使用双引号",
  "also_correct": "包含特殊字符 \n \t \\"
}
```

常见的转义字符：

| 转义序列 | 含义 |
|---------|------|
| `\"` | 双引号 |
| `\\` | 反斜杠 |
| `\/` | 正斜杠 |
| `\n` | 换行符 |
| `\t` | 制表符 |
| `\r` | 回车符 |
| `\uXXXX` | Unicode 字符 |

#### 2. 数字（Number）

JSON 中的数字可以是整数或浮点数，支持科学计数法：

```json
{
  "integer": 42,
  "negative": -17,
  "float": 3.14159,
  "scientific": 1.5e10,
  "small": 2.5e-3
}
```

注意：JSON 不支持 `NaN`、`Infinity` 和十六进制数字。

#### 3. 布尔值（Boolean）

只有 `true` 和 `false` 两个值，必须小写：

```json
{
  "is_active": true,
  "is_deleted": false
}
```

#### 4. 空值（Null）

使用 `null` 表示空值，必须小写：

```json
{
  "middle_name": null
}
```

### 复合数据类型

#### 对象（Object）

对象使用花括号 `{}` 包裹，包含键值对：

```json
{
  "name": "张三",
  "age": 28,
  "address": {
    "city": "北京",
    "district": "海淀区"
  }
}
```

对象的规则：
- 键必须是双引号包裹的字符串
- 键值对之间用逗号分隔
- 最后一个键值对后面**不能**有逗号

#### 数组（Array）

数组使用方括号 `[]` 包裹，元素之间用逗号分隔：

```json
{
  "fruits": ["苹果", "香蕉", "橙子"],
  "mixed": [1, "hello", true, null],
  "nested": [[1, 2], [3, 4]]
}
```

## 常见的 JSON 语法错误

### 错误 1：使用单引号

```json
// ❌ 错误
{'name': 'value'}

// ✅ 正确
{"name": "value"}
```

这是最常见的错误，尤其是从 Python 或 JavaScript 转过来的开发者。

### 错误 2：末尾多余逗号

```json
// ❌ 错误
{
  "name": "张三",
  "age": 28,
}

// ✅ 正确
{
  "name": "张三",
  "age": 28
}
```

### 错误 3：键名没有引号

```json
// ❌ 错误
{name: "value"}

// ✅ 正确
{"name": "value"}
```

### 错误 4：使用注释

```json
// ❌ 错误 - JSON 不支持注释
{
  "name": "value" // 这是注释
}

// ✅ 正确
{
  "name": "value"
}
```

### 错误 5：使用未定义的值

```json
// ❌ 错误
{
  "value": undefined,
  "count": NaN,
  "max": Infinity
}

// ✅ 正确
{
  "value": null,
  "count": 0,
  "max": 999999
}
```

## JSON 格式化的重要性

### 为什么需要格式化？

在实际开发中，API 返回的 JSON 数据通常是压缩的（minified），没有缩进和换行：

```
{"users":[{"id":1,"name":"张三","email":"zhangsan@example.com","roles":["admin","user"]},{"id":2,"name":"李四","email":"lisi@example.com","roles":["user"]}]}
```

格式化后的版本更易于阅读和调试：

```json
{
  "users": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@example.com",
      "roles": ["admin", "user"]
    },
    {
      "id": 2,
      "name": "李四",
      "email": "lisi@example.com",
      "roles": ["user"]
    }
  ]
}
```

### 格式化的应用场景

1. **API 调试**：查看接口返回的数据结构
2. **配置文件编辑**：编辑 package.json、tsconfig.json 等
3. **数据分析**：理解复杂的嵌套数据
4. **代码审查**：对比 JSON 数据的差异
5. **文档编写**：在文档中展示数据示例

## 使用 TryUtils JSON 格式化工具

TryUtils 提供了免费的在线 JSON 格式化工具，支持：

- **一键格式化**：自动缩进和换行
- **语法校验**：实时检测语法错误并定位
- **JSON 压缩**：去除空白字符减小体积
- **语法高亮**：不同数据类型用不同颜色显示
- **完全本地处理**：数据不会上传到服务器

::BlogToolEmbed{tool="json-formatter"}
::

## JSON 格式化最佳实践

### 1. 统一缩进风格

推荐使用 2 个空格缩进，这是大多数项目的标准：

```json
{
  "name": "project",
  "version": "1.0.0",
  "dependencies": {
    "vue": "^3.0.0"
  }
}
```

### 2. 保持键名一致性

选择一种命名风格并保持一致：

```json
{
  "user_name": "camelCase 或 snake_case 选一种",
  "userName": "推荐在 JSON 中使用 camelCase"
}
```

### 3. 合理使用嵌套

避免过深的嵌套层级，一般不超过 4-5 层：

```json
{
  "user": {
    "profile": {
      "address": {
        "city": "北京"
      }
    }
  }
}
```

## 总结

掌握 JSON 的语法规则是每个开发者的基本功。记住以下要点：

- 字符串必须用双引号
- 不支持注释和末尾逗号
- 键名必须是字符串
- 只有六种数据类型
- 使用格式化工具提高开发效率

使用 [TryUtils JSON 格式化工具](/json-formatter) 可以帮助你快速格式化、校验和压缩 JSON 数据，提升开发效率。
