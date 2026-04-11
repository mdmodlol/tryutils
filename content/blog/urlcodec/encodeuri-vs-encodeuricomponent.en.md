---
title: "encodeURI vs encodeURIComponent: A Detailed Comparison"
description: "In-depth comparison of JavaScript's encodeURI and encodeURIComponent functions, with practical examples showing when to use each one and how to avoid common encoding mistakes."
date: '2025-02-25'
tags: ["JavaScript", "URL Encoding", "encodeURI", "encodeURIComponent", "Frontend"]
author: "TryUtils Team"
keywords: ["encodeURI", "encodeURIComponent", "difference", "JavaScript URL encoding", "decodeURI", "decodeURIComponent", "URL encoding functions", "JS encoding", "URI encoding", "URL escape functions"]
relatedTools:
  - url-codec
  - base64-codec
embedTool: url-codec
ogTitle: "encodeURI vs encodeURIComponent: A Detailed Comparison"
ogDescription: "In-depth comparison of encodeURI and encodeURIComponent with practical examples for correct usage."
canonical: "https://www.tryutils.com/en/blog/urlcodec/encodeuri-vs-encodeuricomponent"
schema:
  type: "Article"
  category: "Technical Tutorial"
  readingTime: "10 minutes"
  difficulty: "Intermediate"
  topics: ["JavaScript", "URL Encoding", "Encoding Functions"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-02-25"
---

# encodeURI vs encodeURIComponent: A Detailed Comparison

JavaScript provides two pairs of URL encoding/decoding functions: `encodeURI`/`decodeURI` and `encodeURIComponent`/`decodeURIComponent`. Many developers confuse them, leading to encoding bugs. This article provides a thorough comparison with examples.

## The One-Line Summary

- **encodeURI**: Encodes a complete URL, preserving URL structure characters
- **encodeURIComponent**: Encodes a URL component (like a parameter value), encoding nearly all special characters

## Detailed Comparison

### Characters NOT Encoded

Characters that neither function encodes (shared preserved set):

```
A-Z a-z 0-9 - _ . ! ~ * ' ( )
```

Additional characters preserved by `encodeURI` (URL structure characters):

```
; , / ? : @ & = + $ #
```

This means `encodeURIComponent` encodes these characters, while `encodeURI` does not.

### Encoding Results Compared

```javascript
const testString = 'https://example.com/path?name=John Doe&age=25#section'

// encodeURI - preserves URL structure
encodeURI(testString)
// "https://example.com/path?name=John%20Doe&age=25#section"
// Note: :// / ? & = # are NOT encoded

// encodeURIComponent - encodes all special characters
encodeURIComponent(testString)
// "https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn%20Doe%26age%3D25%23section"
// Note: ALL special characters are encoded
```

### Character-by-Character Comparison

| Character | encodeURI | encodeURIComponent | Purpose in URL |
|-----------|-----------|-------------------|----------------|
| `:` | `:` (kept) | `%3A` | Protocol separator |
| `/` | `/` (kept) | `%2F` | Path separator |
| `?` | `?` (kept) | `%3F` | Query identifier |
| `#` | `#` (kept) | `%23` | Fragment identifier |
| `&` | `&` (kept) | `%26` | Parameter separator |
| `=` | `=` (kept) | `%3D` | Key-value separator |
| `+` | `+` (kept) | `%2B` | Plus sign |
| `@` | `@` (kept) | `%40` | At sign |
| space | `%20` | `%20` | Both encode |

## Use Case Examples

### Scenario 1: Encoding a Complete URL → Use encodeURI

When you have a complete URL with non-ASCII characters:

```javascript
const url = 'https://example.com/docs/getting started?title=beginner guide'

// ✅ Correct: preserves URL structure
const encoded = encodeURI(url)
// "https://example.com/docs/getting%20started?title=beginner%20guide"

// ❌ Wrong: breaks URL structure
const broken = encodeURIComponent(url)
// "https%3A%2F%2Fexample.com%2Fdocs%2Fgetting%20started..."
```

### Scenario 2: Encoding Query Parameter Values → Use encodeURIComponent

When encoding user input as a URL parameter value:

```javascript
const userInput = 'price>100 & category=electronics'

// ✅ Correct: & and = in the value are encoded
const url = `/search?q=${encodeURIComponent(userInput)}`
// "/search?q=price%3E100%20%26%20category%3Delectronics"

// ❌ Wrong: & and = are NOT encoded, breaking parameter structure
const broken = `/search?q=${encodeURI(userInput)}`
// "/search?q=price%3E100%20&%20category=electronics"
```

### Scenario 3: Encoding Path Segments → Use encodeURIComponent

```javascript
const fileName = 'my file (1).pdf'
const url = `/download/${encodeURIComponent(fileName)}`
// "/download/my%20file%20(1).pdf"
```

### Scenario 4: Encoding Cookie Values → Use encodeURIComponent

```javascript
document.cookie = `username=${encodeURIComponent('John; admin')}`
// Semicolon is encoded, won't be mistaken for cookie separator
```

### Scenario 5: Building mailto Links → Use encodeURIComponent

```javascript
const subject = 'Product Inquiry & Quote'
const body = 'Hello,\nI would like to learn more.'

const mailtoUrl = `mailto:sales@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
```

## The Deprecated escape/unescape

JavaScript also has deprecated `escape`/`unescape` functions — do not use them:

```javascript
// ❌ Deprecated
escape('hello world')  // "hello%20world" (works for ASCII)
escape('你好')          // "%u4F60%u597D" (non-standard format!)

// ✅ Use standard functions
encodeURIComponent('你好')  // "%E4%BD%A0%E5%A5%BD" (standard UTF-8)
```

## Matching Encode/Decode Pairs

Always use matching pairs:

```javascript
// ✅ Correct pairs
decodeURI(encodeURI(url))
decodeURIComponent(encodeURIComponent(param))

// ❌ Mismatched pairs may cause issues
decodeURIComponent(encodeURI(url))
decodeURI(encodeURIComponent(param))
```

### Safe Decoding with Error Handling

```javascript
function safeDecode(str) {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    try {
      return decodeURI(str)
    } catch (e2) {
      return str  // Return original string
    }
  }
}
```

## Decision Flowchart

```
Need to encode URL-related content?
│
├── Encoding a complete URL?
│   └── Use encodeURI()
│
├── Encoding a URL parameter value?
│   └── Use encodeURIComponent()
│
├── Encoding a URL path segment?
│   └── Use encodeURIComponent()
│
├── Building a query string?
│   └── Use URLSearchParams (recommended)
│
└── Encoding Cookie/Header values?
    └── Use encodeURIComponent()
```

## Modern Alternative: URLSearchParams

For query parameter handling, prefer `URLSearchParams` which handles encoding automatically:

```javascript
const params = new URLSearchParams({
  q: 'search keywords',
  category: 'tech & tutorials',
  page: '1'
})

const url = `https://api.example.com/search?${params.toString()}`
// All parameter values are correctly encoded
```

## Try It Online

Not sure which function to use? Try the [TryUtils URL Codec tool](/url-codec) to test both `encodeURIComponent` and `encodeURI` modes side by side.

::BlogToolEmbed{tool="url-codec"}
::

## Quick Reference

| Scenario | Recommended Function |
|----------|---------------------|
| Encode complete URL | `encodeURI` |
| Encode parameter value | `encodeURIComponent` |
| Encode path segment | `encodeURIComponent` |
| Build query string | `URLSearchParams` |
| Encode cookie value | `encodeURIComponent` |

Simple rule: **When in doubt, use `encodeURIComponent`**. It encodes more characters and is safer. Only use `encodeURI` when you need to preserve URL structure.
