---
title: "JSON Best Practices for API Development"
description: "Explore JSON best practices in RESTful API design, including data structure design, error handling, pagination, versioning, and security. Build maintainable and developer-friendly APIs."
date: '2025-02-10'
tags: ["JSON", "API", "RESTful", "Backend", "Best Practices"]
author: "TryUtils Team"
keywords: ["JSON API", "RESTful API", "API design", "JSON specification", "API best practices", "JSON response format", "API error handling", "API pagination", "JSON data structure", "interface design"]
relatedTools:
  - json-formatter
  - base64-codec
embedTool: json-formatter
ogTitle: "JSON Best Practices for API Development"
ogDescription: "Master JSON design patterns and best practices for RESTful APIs to build better interfaces."
canonical: "https://www.tryutils.com/en/blog/JsonFormatter/json-api-best-practices"
schema:
  type: "Article"
  category: "Technical Tutorial"
  readingTime: "15 min"
  difficulty: "Advanced"
  topics: ["JSON", "API", "RESTful"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-02-10"
---

# JSON Best Practices for API Development

JSON is the standard data format for modern Web APIs. A well-designed JSON API improves development efficiency and reduces communication overhead between frontend and backend teams. This article covers the core best practices.

---

## Consistent Response Format

### Success Response

Design a unified response wrapper:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "John",
    "email": "john@example.com"
  },
  "timestamp": "2025-02-10T08:30:00Z"
}
```

### List Response (with Pagination)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "items": [
      {"id": 1, "name": "John"},
      {"id": 2, "name": "Jane"}
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

### Error Response

```json
{
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "age",
      "message": "Age must be greater than 0"
    }
  ],
  "timestamp": "2025-02-10T08:30:00Z"
}
```

### Why Consistent Format?

- Frontend can use a unified interceptor for responses
- Consistent error handling reduces bugs
- Clearer API documentation, less communication overhead
- Easier logging and monitoring

## Naming Conventions

### Use camelCase

```json
{
  "userId": 1,
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2025-02-10T08:30:00Z",
  "isActive": true
}
```

### Common Naming Patterns

| Scenario | Convention | Example |
|----------|-----------|---------|
| ID fields | `xxxId` | `userId`, `orderId` |
| Boolean fields | `isXxx` / `hasXxx` | `isActive`, `hasPermission` |
| Timestamp fields | `xxxAt` | `createdAt`, `updatedAt` |
| Count fields | `xxxCount` | `itemCount`, `totalCount` |
| List fields | Plural form | `users`, `items`, `tags` |

## Data Type Best Practices

### Date and Time

Always use ISO 8601 format:

```json
{
  "createdAt": "2025-02-10T08:30:00Z",
  "updatedAt": "2025-02-10T16:45:30+08:00",
  "date": "2025-02-10"
}
```

Avoid timestamps or custom formats:

```json
// ❌ Not recommended
{
  "createdAt": 1707552600,
  "date": "02/10/2025",
  "time": "08:30 AM"
}
```

### Money and Precision

Use strings or integers (cents) for monetary values to avoid floating-point precision issues:

```json
// ✅ Option 1: String
{
  "price": "99.99",
  "currency": "USD"
}

// ✅ Option 2: Smallest unit integer (cents)
{
  "priceInCents": 9999,
  "currency": "USD"
}

// ❌ Not recommended: Float
{
  "price": 99.99
}
```

### Enum Values

Use meaningful strings instead of numbers:

```json
// ✅ Recommended
{
  "status": "active",
  "role": "admin",
  "priority": "high"
}

// ❌ Not recommended
{
  "status": 1,
  "role": 0,
  "priority": 3
}
```

### Null Handling

```json
// ✅ Recommended: Use null for missing values
{
  "name": "John",
  "middleName": null,
  "bio": ""
}

// ❌ Not recommended: Omitting fields
{
  "name": "John"
}
```

## Pagination Design

### Offset Pagination

Best for traditional list pages:

```
GET /api/users?page=2&pageSize=20
```

```json
{
  "data": {
    "items": [],
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

### Cursor Pagination

Best for infinite scroll and real-time data:

```
GET /api/messages?cursor=eyJpZCI6MTAwfQ&limit=20
```

```json
{
  "data": {
    "items": [],
    "pagination": {
      "nextCursor": "eyJpZCI6MTIwfQ",
      "prevCursor": "eyJpZCI6MTAxfQ",
      "hasMore": true,
      "limit": 20
    }
  }
}
```

### How to Choose?

| Feature | Offset | Cursor |
|---------|--------|--------|
| Jump to specific page | ✅ | ❌ |
| Show total pages | ✅ | ❌ |
| Large dataset performance | ❌ Slow | ✅ Fast |
| Real-time data consistency | ❌ May duplicate | ✅ Consistent |
| Implementation complexity | Simple | Medium |

## Error Handling

### HTTP Status Code + Business Error Code

```json
// HTTP 400 Bad Request
{
  "code": 40001,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "code": "INVALID_FORMAT",
      "message": "Invalid email format"
    }
  ]
}

// HTTP 401 Unauthorized
{
  "code": 40101,
  "message": "Session expired, please log in again"
}

// HTTP 404 Not Found
{
  "code": 40401,
  "message": "User not found",
  "detail": "No user found with ID 999"
}
```

## Security Best Practices

### Filter Sensitive Data

Never expose sensitive information in API responses:

```json
// ❌ Dangerous
{
  "id": 1,
  "name": "John",
  "password": "$2b$10$...",
  "creditCard": "4111..."
}

// ✅ Safe
{
  "id": 1,
  "name": "John",
  "email": "jo***@example.com"
}
```

### Prevent JSON Injection

```javascript
// ❌ Dangerous: String concatenation
const json = `{"name": "${userInput}"}`;

// ✅ Safe: Use JSON.stringify
const json = JSON.stringify({ name: userInput });
```

### Limit Response Size

```javascript
app.use(express.json({ limit: '10mb' }));

const MAX_PAGE_SIZE = 100;
const pageSize = Math.min(req.query.pageSize || 20, MAX_PAGE_SIZE);
```

## Performance Optimization

### Field Selection

Allow clients to specify needed fields:

```
GET /api/users?fields=id,name,email
```

### Response Compression

Enable Gzip/Brotli compression:

```javascript
const compression = require('compression');
app.use(compression());
```

## Debug JSON APIs with TryUtils

During API development, use the [TryUtils JSON Formatter](/json-formatter) to quickly format and validate API response data:

::BlogToolEmbed{tool="json-formatter"}
::

Combine with the [Base64 Codec tool](/base64-codec) to easily handle JWT tokens and encoded data.

## Summary

- Use consistent response format with code, message, and data
- Use camelCase naming consistently
- Use ISO 8601 for dates, strings or smallest units for money
- Design pagination and error handling thoughtfully
- Prioritize security — filter sensitive data
- Use [TryUtils](/json-formatter) to assist API debugging
