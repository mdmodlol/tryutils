---
title: "JSON 在 API 开发中的最佳实践"
description: "深入探讨 JSON 在 RESTful API 设计中的最佳实践，包括数据结构设计、错误处理、分页、版本控制等关键话题。提升 API 的可维护性和开发体验。"
date: '2025-02-10'
tags: ["JSON", "API", "RESTful", "后端开发", "最佳实践"]
author: "TryUtils Team"
keywords: ["JSON API", "RESTful API", "API设计", "JSON规范", "API最佳实践", "JSON响应格式", "API错误处理", "API分页", "JSON数据结构", "接口设计"]
relatedTools:
  - json-formatter
  - base64-codec
embedTool: json-formatter
ogTitle: "JSON 在 API 开发中的最佳实践 - 完整指南"
ogDescription: "掌握 JSON 在 RESTful API 中的设计规范和最佳实践，提升接口质量。"
canonical: "https://www.tryutils.com/blog/JsonFormatter/json-api-best-practices"
schema:
  type: "Article"
  category: "技术教程"
  readingTime: "15分钟"
  difficulty: "高级"
  topics: ["JSON", "API", "RESTful"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-02-10"
---

# JSON 在 API 开发中的最佳实践

JSON 是现代 Web API 的标准数据格式。一个设计良好的 JSON API 不仅能提升开发效率，还能降低前后端沟通成本。本文总结了 API 开发中 JSON 使用的核心最佳实践。

---

## 统一的响应格式

### 成功响应

设计一个统一的响应包装结构：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "timestamp": "2025-02-10T08:30:00Z"
}
```

### 列表响应（带分页）

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {"id": 1, "name": "张三"},
      {"id": 2, "name": "李四"}
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### 错误响应

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    },
    {
      "field": "age",
      "message": "年龄必须大于 0"
    }
  ],
  "timestamp": "2025-02-10T08:30:00Z"
}
```

### 为什么需要统一格式？

- 前端可以用统一的拦截器处理响应
- 错误处理逻辑一致，减少 bug
- API 文档更清晰，降低沟通成本
- 方便做日志记录和监控

## 命名规范

### 推荐使用 camelCase

```json
{
  "userId": 1,
  "firstName": "三",
  "lastName": "张",
  "createdAt": "2025-02-10T08:30:00Z",
  "isActive": true
}
```

### 避免的命名方式

```json
// ❌ 不推荐：混合命名风格
{
  "user_id": 1,
  "firstName": "三",
  "LastName": "张",
  "CREATED_AT": "2025-02-10"
}

// ✅ 推荐：统一 camelCase
{
  "userId": 1,
  "firstName": "三",
  "lastName": "张",
  "createdAt": "2025-02-10"
}
```

### 常见命名约定

| 场景 | 推荐命名 | 示例 |
|------|---------|------|
| ID 字段 | `xxxId` | `userId`, `orderId` |
| 布尔字段 | `isXxx` / `hasXxx` | `isActive`, `hasPermission` |
| 时间字段 | `xxxAt` | `createdAt`, `updatedAt` |
| 数量字段 | `xxxCount` | `itemCount`, `totalCount` |
| 列表字段 | 复数形式 | `users`, `items`, `tags` |

## 数据类型最佳实践

### 日期时间

始终使用 ISO 8601 格式：

```json
{
  "createdAt": "2025-02-10T08:30:00Z",
  "updatedAt": "2025-02-10T16:45:30+08:00",
  "date": "2025-02-10"
}
```

不要使用时间戳或自定义格式：

```json
// ❌ 不推荐
{
  "createdAt": 1707552600,
  "date": "2025/02/10",
  "time": "08:30 AM"
}
```

### 金额和精度

使用字符串或整数（分）表示金额，避免浮点数精度问题：

```json
// ✅ 方案一：字符串
{
  "price": "99.99",
  "currency": "CNY"
}

// ✅ 方案二：最小单位整数（分）
{
  "priceInCents": 9999,
  "currency": "CNY"
}

// ❌ 不推荐：浮点数
{
  "price": 99.99
}
```

### 枚举值

使用有意义的字符串而非数字：

```json
// ✅ 推荐
{
  "status": "active",
  "role": "admin",
  "priority": "high"
}

// ❌ 不推荐
{
  "status": 1,
  "role": 0,
  "priority": 3
}
```

### 空值处理

```json
// ✅ 推荐：使用 null 表示缺失
{
  "name": "张三",
  "middleName": null,
  "bio": ""
}

// ❌ 不推荐：省略字段（前端需要额外判断）
{
  "name": "张三"
}
```

## 分页设计

### 偏移量分页（Offset Pagination）

适合传统的列表页面：

```
GET /api/users?page=2&pageSize=20
```

```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 2,
      "pageSize": 20,
      "total": 156,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": true
    }
  }
}
```

### 游标分页（Cursor Pagination）

适合无限滚动和实时数据：

```
GET /api/messages?cursor=eyJpZCI6MTAwfQ&limit=20
```

```json
{
  "data": {
    "items": [...],
    "pagination": {
      "nextCursor": "eyJpZCI6MTIwfQ",
      "prevCursor": "eyJpZCI6MTAxfQ",
      "hasMore": true,
      "limit": 20
    }
  }
}
```

### 如何选择？

| 特性 | 偏移量分页 | 游标分页 |
|------|-----------|---------|
| 跳转到指定页 | ✅ | ❌ |
| 显示总页数 | ✅ | ❌ |
| 大数据集性能 | ❌ 慢 | ✅ 快 |
| 实时数据一致性 | ❌ 可能重复 | ✅ 一致 |
| 实现复杂度 | 简单 | 中等 |

## 错误处理

### HTTP 状态码 + 业务错误码

```json
// HTTP 400 Bad Request
{
  "code": 40001,
  "message": "参数校验失败",
  "errors": [
    {
      "field": "email",
      "code": "INVALID_FORMAT",
      "message": "邮箱格式不正确"
    }
  ]
}

// HTTP 401 Unauthorized
{
  "code": 40101,
  "message": "登录已过期，请重新登录"
}

// HTTP 404 Not Found
{
  "code": 40401,
  "message": "用户不存在",
  "detail": "未找到 ID 为 999 的用户"
}

// HTTP 500 Internal Server Error
{
  "code": 50001,
  "message": "服务器内部错误",
  "requestId": "req-abc123"
}
```

### 错误码设计规范

```
错误码格式：XXYYYY
XX   = HTTP 状态码前缀
YYYY = 业务错误编号

示例：
40001 = 参数校验失败
40101 = Token 过期
40301 = 权限不足
40401 = 资源不存在
50001 = 服务器错误
```

## API 版本控制

### URL 路径版本

```
GET /api/v1/users
GET /api/v2/users
```

响应中包含版本信息：

```json
{
  "apiVersion": "v2",
  "data": {
    "users": [...]
  }
}
```

### 版本迁移提示

当旧版本即将废弃时，在响应头中提示：

```
Deprecation: true
Sunset: Sat, 01 Jun 2025 00:00:00 GMT
Link: </api/v2/users>; rel="successor-version"
```

## 安全最佳实践

### 敏感数据过滤

永远不要在 API 响应中返回敏感信息：

```json
// ❌ 危险
{
  "id": 1,
  "name": "张三",
  "password": "$2b$10$...",
  "creditCard": "6222..."
}

// ✅ 安全
{
  "id": 1,
  "name": "张三",
  "email": "zhang***@example.com"
}
```

### 防止 JSON 注入

```javascript
// ❌ 危险：直接拼接
const json = `{"name": "${userInput}"}`;

// ✅ 安全：使用 JSON.stringify
const json = JSON.stringify({ name: userInput });
```

### 限制响应大小

```javascript
// Express.js 限制请求体大小
app.use(express.json({ limit: '10mb' }));

// 限制数组返回数量
const MAX_PAGE_SIZE = 100;
const pageSize = Math.min(req.query.pageSize || 20, MAX_PAGE_SIZE);
```

## 性能优化

### 字段筛选

允许客户端指定需要的字段：

```
GET /api/users?fields=id,name,email
```

```json
{
  "data": [
    {"id": 1, "name": "张三", "email": "zhangsan@example.com"},
    {"id": 2, "name": "李四", "email": "lisi@example.com"}
  ]
}
```

### 关联数据展开

```
GET /api/orders?expand=user,items
```

```json
{
  "data": {
    "id": 1001,
    "user": {
      "id": 1,
      "name": "张三"
    },
    "items": [
      {"productId": 101, "quantity": 2}
    ]
  }
}
```

### 响应压缩

确保服务器启用 Gzip/Brotli 压缩：

```javascript
// Express.js
const compression = require('compression');
app.use(compression());
```

## 使用 TryUtils 调试 JSON API

在 API 开发过程中，使用 [TryUtils JSON 格式化工具](/json-formatter) 可以快速格式化和校验 API 响应数据：

::BlogToolEmbed{tool="json-formatter"}
::

配合 [Base64 编解码工具](/base64-codec) 可以方便地处理 JWT Token 和编码数据。

## 总结

- 统一响应格式，包含 code、message、data
- 使用 camelCase 命名，保持一致性
- 日期用 ISO 8601，金额用字符串或最小单位
- 合理设计分页和错误处理
- 注意安全性，过滤敏感数据
- 使用 [TryUtils](/json-formatter) 辅助 API 调试
