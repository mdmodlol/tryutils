---
title: "Understanding URL Encoding: How Percent-Encoding Works"
description: "A comprehensive guide to URL encoding (percent-encoding), explaining how it works, why it's needed, and the differences between encodeURI and encodeURIComponent in JavaScript."
date: '2025-02-25'
tags: ["URL Encoding", "Percent-Encoding", "Web Development", "HTTP", "Frontend"]
author: "TryUtils Team"
keywords: ["URL encoding", "percent encoding", "URL encode", "encodeURIComponent", "encodeURI", "URL escape", "special character encoding", "RFC 3986", "UTF-8 encoding", "URL specification"]
relatedTools:
  - url-codec
  - base64-codec
embedTool: url-codec
ogTitle: "Understanding URL Encoding: How Percent-Encoding Works"
ogDescription: "A comprehensive guide to URL encoding, explaining the mechanics of percent-encoding and character conversion."
canonical: "https://www.tryutils.com/blog/UrlCodec/url-encoding-explained"
schema:
  type: "Article"
  category: "Technical Tutorial"
  readingTime: "10 minutes"
  difficulty: "Intermediate"
  topics: ["URL Encoding", "Percent-Encoding", "Web Standards"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-02-25"
---

# Understanding URL Encoding: How Percent-Encoding Works

URL encoding (also known as percent-encoding) is one of the most fundamental concepts in web development. Every time you type non-ASCII characters in a browser's address bar or search for content with special characters, URL encoding is working behind the scenes.

## What Is URL Encoding?

URL encoding is a mechanism that converts characters into a format that can be safely transmitted within a URL. It replaces unsafe characters with a `%` followed by two hexadecimal digits.

For example:
- Space → `%20`
- `&` → `%26`
- `©` → `%C2%A9`

## Why Is URL Encoding Needed?

The URL specification [RFC 3986](https://tools.ietf.org/html/rfc3986) states that URLs can only contain the following characters:

### Unreserved Characters (No Encoding Needed)

```
A-Z a-z 0-9 - _ . ~
```

### Reserved Characters (Have Special Meaning)

```
: / ? # [ ] @ ! $ & ' ( ) * + , ; =
```

Any character outside these ranges (such as spaces, Chinese characters, emoji) must be encoded before being used in a URL.

## How URL Encoding Works

The encoding process involves two steps:

### Step 1: UTF-8 Encoding

First, the character is converted to its UTF-8 byte sequence. For example, the copyright symbol `©` has the UTF-8 encoding `C2 A9` (two bytes).

### Step 2: Percent Conversion

Each byte is converted to `%XX` format, where XX is the hexadecimal representation of that byte.

```
"©" → UTF-8: C2 A9 → URL encoded: %C2%A9
"hello world" → "hello%20world"
```

### Complete Example

```
Original: https://example.com/search?q=hello world&lang=en
Encoded:  https://example.com/search?q=hello%20world&lang=en
```

## JavaScript URL Encoding Functions

JavaScript provides four URL encoding/decoding functions:

### encodeURI / decodeURI

`encodeURI` is designed for encoding complete URLs. It preserves URL structure characters:

```javascript
const url = 'https://example.com/path name?key=value&foo=bar'
console.log(encodeURI(url))
// https://example.com/path%20name?key=value&foo=bar
```

Notice that `://`, `/`, `?`, `=`, and `&` are not encoded.

### encodeURIComponent / decodeURIComponent

`encodeURIComponent` is designed for encoding URL components (like parameter values). It encodes almost all special characters:

```javascript
const param = 'hello&world=test'
console.log(encodeURIComponent(param))
// hello%26world%3Dtest
```

Notice that `&` and `=` are encoded, which is correct behavior for parameter values.

### Key Differences

| Feature | encodeURI | encodeURIComponent |
|---------|-----------|-------------------|
| Purpose | Encode complete URL | Encode URL parameter values |
| Preserves | `: / ? # [ ] @ ! $ & ' ( ) * + , ; =` | Only `- _ . ! ~ * ' ( )` |
| Encodes `/` | ❌ No | ✅ Yes → `%2F` |
| Encodes `?` | ❌ No | ✅ Yes → `%3F` |
| Encodes `&` | ❌ No | ✅ Yes → `%26` |
| Encodes `=` | ❌ No | ✅ Yes → `%3D` |

## Common Encoding Reference Table

| Character | URL Encoding | Description |
|-----------|-------------|-------------|
| Space | `%20` or `+` | `+` used in form encoding |
| `!` | `%21` | Exclamation mark |
| `#` | `%23` | Hash (fragment identifier) |
| `$` | `%24` | Dollar sign |
| `%` | `%25` | Percent sign itself |
| `&` | `%26` | Ampersand (parameter separator) |
| `+` | `%2B` | Plus sign |
| `/` | `%2F` | Slash (path separator) |
| `=` | `%3D` | Equals (key-value separator) |
| `?` | `%3F` | Question mark (query identifier) |
| `@` | `%40` | At sign |

## Practical Use Cases

### 1. Building Query Parameters

```javascript
const searchTerm = 'JavaScript & TypeScript'
const url = `https://api.example.com/search?q=${encodeURIComponent(searchTerm)}`
// https://api.example.com/search?q=JavaScript%20%26%20TypeScript
```

### 2. Using URLSearchParams

```javascript
const params = new URLSearchParams({
  name: 'John Doe',
  query: 'price > 100'
})
console.log(params.toString())
// name=John+Doe&query=price+%3E+100
```

### 3. Handling File Downloads

```javascript
const fileName = 'Annual Report (2024).pdf'
const url = `/api/download?file=${encodeURIComponent(fileName)}`
```

## Common Mistakes to Avoid

### 1. Don't Use encodeURIComponent on Entire URLs

```javascript
// ❌ Wrong: breaks URL structure
encodeURIComponent('https://example.com/path?key=value')
// https%3A%2F%2Fexample.com%2Fpath%3Fkey%3Dvalue

// ✅ Correct: only encode parameter values
'https://example.com/path?key=' + encodeURIComponent('value to encode')
```

### 2. Don't Double-Encode

```javascript
// ❌ Wrong: encoding an already-encoded string
const encoded = encodeURIComponent('hello')  // hello
encodeURIComponent(encoded)  // hello (no change here, but with special chars it matters)
```

### 3. Space Encoding: %20 vs +

- `%20`: Standard URL encoding
- `+`: `application/x-www-form-urlencoded` format (form submissions)

## Try It Online

Want to quickly encode or decode URLs? Try our [URL Codec tool](/url-codec), supporting both `encodeURIComponent` and `encodeURI` modes with real-time conversion, all processed in your browser.

::BlogToolEmbed{tool="url-codec"}
::

## Summary

URL encoding is foundational web knowledge. Understanding how it works helps you:
- Correctly build URLs and query parameters
- Avoid bugs caused by special characters
- Choose the right encoding function (`encodeURI` vs `encodeURIComponent`)
- Handle internationalized URLs with multi-language characters
