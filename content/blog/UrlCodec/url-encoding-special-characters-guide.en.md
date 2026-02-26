---
title: "URL Encoding Special Characters: A Complete Reference Guide"
description: "Complete guide to encoding special characters in URLs, including spaces, reserved characters, Unicode, and emoji. Includes a comprehensive encoding reference table."
date: '2025-02-25'
tags: ["URL Encoding", "Special Characters", "Percent-Encoding", "UTF-8", "Web Standards"]
author: "TryUtils Team"
keywords: ["URL special characters", "URL encoding table", "percent encoding", "URL space encoding", "URL Unicode encoding", "URL symbol encoding", "URL reserved characters", "URL encoding reference", "special character escape", "URL safe characters"]
relatedTools:
  - url-codec
  - base64-codec
embedTool: url-codec
ogTitle: "URL Encoding Special Characters: Complete Reference Guide"
ogDescription: "Complete guide to encoding special characters in URLs with a comprehensive encoding reference table."
canonical: "https://www.tryutils.com/blog/UrlCodec/url-encoding-special-characters-guide"
schema:
  type: "Article"
  category: "Technical Tutorial"
  readingTime: "10 minutes"
  difficulty: "Beginner"
  topics: ["URL Encoding", "Special Characters", "Reference Table"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-02-25"
---

# URL Encoding Special Characters: A Complete Reference Guide

When working with URLs, encoding special characters is where most mistakes happen. An unencoded `&` can break parameter parsing, and an unencoded space can invalidate an entire URL. This guide provides a complete special character encoding reference.

## Character Categories in URLs

According to RFC 3986, URL characters fall into three categories:

### 1. Unreserved Characters (No Encoding Needed)

These characters can appear directly in URLs:

```
Uppercase: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
Lowercase: a b c d e f g h i j k l m n o p q r s t u v w x y z
Digits:    0 1 2 3 4 5 6 7 8 9
Special:   - _ . ~
```

### 2. Reserved Characters (Have Special Meaning)

These characters have special meaning in URLs. They don't need encoding when used as delimiters, but must be encoded when used as data:

```
Generic delimiters: : / ? # [ ] @
Sub-delimiters:     ! $ & ' ( ) * + , ; =
```

### 3. All Other Characters

All other characters (including Unicode, spaces, control characters) must be percent-encoded.

## Common Special Character Encoding Table

### ASCII Special Characters

| Character | Name | URL Encoding | Role in URL |
|-----------|------|-------------|-------------|
| ` ` | Space | `%20` | None (must encode) |
| `!` | Exclamation | `%21` | Sub-delimiter |
| `"` | Double quote | `%22` | None (must encode) |
| `#` | Hash | `%23` | Fragment identifier |
| `$` | Dollar | `%24` | Sub-delimiter |
| `%` | Percent | `%25` | Encoding prefix |
| `&` | Ampersand | `%26` | Parameter separator |
| `'` | Single quote | `%27` | Sub-delimiter |
| `(` | Left paren | `%28` | Sub-delimiter |
| `)` | Right paren | `%29` | Sub-delimiter |
| `*` | Asterisk | `%2A` | Sub-delimiter |
| `+` | Plus | `%2B` | Sub-delimiter |
| `,` | Comma | `%2C` | Sub-delimiter |
| `/` | Slash | `%2F` | Path separator |
| `:` | Colon | `%3A` | Protocol/port separator |
| `;` | Semicolon | `%3B` | Parameter separator |
| `=` | Equals | `%3D` | Key-value separator |
| `?` | Question mark | `%3F` | Query identifier |
| `@` | At sign | `%40` | User info separator |
| `[` | Left bracket | `%5B` | IPv6 address |
| `]` | Right bracket | `%5D` | IPv6 address |
| `{` | Left brace | `%7B` | None (must encode) |
| `}` | Right brace | `%7D` | None (must encode) |
| `\|` | Pipe | `%7C` | None (must encode) |
| `\` | Backslash | `%5C` | None (must encode) |
| `^` | Caret | `%5E` | None (must encode) |

### Whitespace Characters

| Character | Name | URL Encoding |
|-----------|------|-------------|
| Space | Space | `%20` |
| Tab | Tab | `%09` |
| Line Feed | LF | `%0A` |
| Carriage Return | CR | `%0D` |

## Unicode Character Encoding

Unicode characters are first converted to UTF-8 bytes, then each byte is percent-encoded:

```javascript
encodeURIComponent('café')
// "caf%C3%A9"
// é → UTF-8: C3 A9 → %C3%A9

encodeURIComponent('naïve')
// "na%C3%AFve"
// ï → UTF-8: C3 AF → %C3%AF
```

## Emoji Encoding

Emoji typically use 4 UTF-8 bytes:

```javascript
encodeURIComponent('😀')  // "%F0%9F%98%80"
encodeURIComponent('🎉')  // "%F0%9F%8E%89"
encodeURIComponent('❤️')  // "%E2%9D%A4%EF%B8%8F"
```

## Space Encoding: %20 vs +

Spaces have two encoding representations:

### %20 (Standard URL Encoding)

```javascript
encodeURIComponent('hello world')
// "hello%20world"
```

### + (Form Encoding)

In `application/x-www-form-urlencoded` format, spaces become `+`:

```javascript
const params = new URLSearchParams({ q: 'hello world' })
params.toString()
// "q=hello+world"
```

### When to Use Which?

| Context | Space Encoding | Example |
|---------|---------------|---------|
| URL path | `%20` | `/path/hello%20world` |
| URL query | `%20` or `+` | `?q=hello%20world` |
| Form submission | `+` | Default HTML form behavior |
| JavaScript | `%20` | `encodeURIComponent` result |

## Solving Real Problems

### Problem 1: Hash (#) Truncates URL

```javascript
// ❌ Problem: everything after # treated as fragment
const color = '#FF5733'
const url = `/search?color=${color}`
// Browser only sends /search?color=

// ✅ Solution: encode the # character
const url = `/search?color=${encodeURIComponent(color)}`
// /search?color=%23FF5733
```

### Problem 2: Ampersand (&) in Parameter Values

```javascript
// ❌ Problem: & treated as parameter separator
const company = 'AT&T'
const url = `/search?q=${company}&page=1`
// Parsed as: q=AT, T=(empty), page=1

// ✅ Solution: encode parameter values
const url = `/search?q=${encodeURIComponent(company)}&page=1`
// /search?q=AT%26T&page=1
```

### Problem 3: Spaces in File Paths

```javascript
// ❌ Problem: space makes URL invalid
const file = 'my document.pdf'
const url = `/files/${file}`

// ✅ Solution: encode the filename
const url = `/files/${encodeURIComponent(file)}`
// /files/my%20document.pdf
```

### Problem 4: Percent Sign Needs Encoding

```javascript
const discount = '50% off'
encodeURIComponent(discount)
// "50%25%20off"  → % encoded as %25
```

### Problem 5: Avoid Double Encoding

```javascript
const encoded = '%E4%BD%A0%E5%A5%BD'

// ❌ Double encoding
encodeURIComponent(encoded)
// "%25E4%25BD%25A0%25E5%25A5%25BD"

// ✅ Check if already encoded first
function isEncoded(str) {
  try {
    return str !== decodeURIComponent(str)
  } catch {
    return false
  }
}
```

## URL Encoding in Other Languages

### Python

```python
from urllib.parse import quote, unquote

# Similar to encodeURIComponent
quote('hello world', safe='')  # 'hello%20world'

# Similar to encodeURI
quote('https://example.com/hello world', safe=':/?#[]@!$&\'()*+,;=')
```

### Java

```java
import java.net.URLEncoder;
String encoded = URLEncoder.encode("hello world", "UTF-8");
// "hello+world" (note: spaces become +)
```

### PHP

```php
rawurlencode('hello world');  // "hello%20world"
urlencode('hello world');     // "hello+world"
```

## Online Tool

Use the [TryUtils URL Codec tool](/url-codec) to quickly check the URL encoding of any character, with real-time conversion and two encoding mode options.

::BlogToolEmbed{tool="url-codec"}
::

## Summary

Key principles for handling URL special characters:
1. Always use `encodeURIComponent` for parameter values
2. Use `encodeURI` for complete URLs
3. Be aware of the two space encodings (`%20` vs `+`)
4. Avoid double encoding
5. Use `URLSearchParams` for automatic query parameter encoding
