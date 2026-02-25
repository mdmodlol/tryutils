---
title: "JSON Formatting Basics: Syntax Rules and Common Errors"
description: "A comprehensive guide to JSON data format syntax rules, data types, formatting methods, and the most common JSON syntax errors with solutions. Master JSON formatting quickly."
date: '2025-02-20'
tags: ["JSON", "Formatting", "Syntax", "Developer Tools", "Web Development"]
author: "TryUtils Team"
keywords: ["JSON format", "JSON syntax", "JSON errors", "JSON formatting", "JSON data types", "JSON tutorial", "JSON guide", "JSON specification", "JSON parsing", "online JSON tool"]
relatedTools:
  - json-formatter
  - base64-codec
embedTool: json-formatter
ogTitle: "JSON Formatting Basics: Syntax Rules and Common Errors"
ogDescription: "Complete guide to JSON syntax rules, data types, and common errors to help developers master JSON formatting."
canonical: "https://www.tryutils.com/en/blog/JsonFormatter/json-formatting-basics"
schema:
  type: "Article"
  category: "Technical Tutorial"
  readingTime: "12 min"
  difficulty: "Beginner"
  topics: ["JSON", "Formatting", "Syntax Rules"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-02-20"
---

# JSON Formatting Basics: Syntax Rules and Common Errors

JSON (JavaScript Object Notation) is one of the most popular data interchange formats today. Whether you're a frontend developer, backend engineer, or data analyst, mastering JSON syntax rules and formatting techniques is an essential skill.

---

## What is JSON?

JSON is a lightweight data interchange format proposed by Douglas Crockford in 2001. It's based on a subset of JavaScript object syntax but is independent of any programming language — virtually all modern programming languages support JSON parsing and generation.

### Key Features of JSON

- **Human-readable**: Easy to read and write
- **Machine-friendly**: Fast to parse and generate
- **Language-independent**: Not tied to any specific programming language
- **Clear structure**: Supports nested hierarchical structures

## JSON Syntax Rules Explained

### Basic Data Types

JSON supports six data types:

```json
{
  "string": "This is a string",
  "number": 42,
  "float": 3.14,
  "boolean": true,
  "null_value": null,
  "negative": -100
}
```

#### 1. String

Strings must be wrapped in **double quotes** — this is one of JSON's strictest rules:

```json
{
  "correct": "Using double quotes",
  "also_correct": "Special characters \n \t \\"
}
```

Common escape sequences:

| Escape | Meaning |
|--------|---------|
| `\"` | Double quote |
| `\\` | Backslash |
| `\/` | Forward slash |
| `\n` | Newline |
| `\t` | Tab |
| `\r` | Carriage return |
| `\uXXXX` | Unicode character |

#### 2. Number

Numbers in JSON can be integers or floating-point, with scientific notation support:

```json
{
  "integer": 42,
  "negative": -17,
  "float": 3.14159,
  "scientific": 1.5e10,
  "small": 2.5e-3
}
```

Note: JSON does not support `NaN`, `Infinity`, or hexadecimal numbers.

#### 3. Boolean

Only two values — `true` and `false` — must be lowercase:

```json
{
  "is_active": true,
  "is_deleted": false
}
```

#### 4. Null

Use `null` to represent empty values, must be lowercase:

```json
{
  "middle_name": null
}
```

### Composite Data Types

#### Object

Objects use curly braces `{}` and contain key-value pairs:

```json
{
  "name": "John",
  "age": 28,
  "address": {
    "city": "New York",
    "state": "NY"
  }
}
```

Object rules:
- Keys must be double-quoted strings
- Key-value pairs are separated by commas
- No trailing comma after the last pair

#### Array

Arrays use square brackets `[]` with comma-separated elements:

```json
{
  "fruits": ["apple", "banana", "orange"],
  "mixed": [1, "hello", true, null],
  "nested": [[1, 2], [3, 4]]
}
```

## Common JSON Syntax Errors

### Error 1: Using Single Quotes

```json
// ❌ Wrong
{'name': 'value'}

// ✅ Correct
{"name": "value"}
```

This is the most common mistake, especially for developers coming from Python or JavaScript.

### Error 2: Trailing Comma

```json
// ❌ Wrong
{
  "name": "John",
  "age": 28,
}

// ✅ Correct
{
  "name": "John",
  "age": 28
}
```

### Error 3: Unquoted Keys

```json
// ❌ Wrong
{name: "value"}

// ✅ Correct
{"name": "value"}
```

### Error 4: Using Comments

```json
// ❌ Wrong - JSON doesn't support comments
{
  "name": "value" // this is a comment
}

// ✅ Correct
{
  "name": "value"
}
```

### Error 5: Using Undefined Values

```json
// ❌ Wrong
{
  "value": undefined,
  "count": NaN,
  "max": Infinity
}

// ✅ Correct
{
  "value": null,
  "count": 0,
  "max": 999999
}
```

## Why JSON Formatting Matters

### Why Format?

In practice, JSON data returned by APIs is usually minified — no indentation or line breaks:

```
{"users":[{"id":1,"name":"John","email":"john@example.com","roles":["admin","user"]},{"id":2,"name":"Jane","email":"jane@example.com","roles":["user"]}]}
```

The formatted version is much easier to read and debug:

```json
{
  "users": [
    {
      "id": 1,
      "name": "John",
      "email": "john@example.com",
      "roles": ["admin", "user"]
    },
    {
      "id": 2,
      "name": "Jane",
      "email": "jane@example.com",
      "roles": ["user"]
    }
  ]
}
```

### Formatting Use Cases

1. **API debugging**: Inspect response data structures
2. **Config file editing**: Edit package.json, tsconfig.json, etc.
3. **Data analysis**: Understand complex nested data
4. **Code review**: Compare JSON data differences
5. **Documentation**: Show data examples in docs

## Using TryUtils JSON Formatter

TryUtils provides a free online JSON formatting tool with:

- **One-click formatting**: Auto indentation and line breaks
- **Syntax validation**: Real-time error detection with location
- **JSON minification**: Remove whitespace to reduce size
- **Syntax highlighting**: Different colors for different data types
- **Fully local processing**: Data never leaves your browser

::BlogToolEmbed{tool="json-formatter"}
::

## JSON Formatting Best Practices

### 1. Consistent Indentation

Use 2-space indentation — the standard for most projects:

```json
{
  "name": "project",
  "version": "1.0.0",
  "dependencies": {
    "vue": "^3.0.0"
  }
}
```

### 2. Consistent Key Naming

Pick one naming convention and stick with it:

```json
{
  "userName": "Recommended: camelCase for JSON",
  "user_name": "Alternative: snake_case"
}
```

### 3. Reasonable Nesting

Avoid deeply nested structures — generally no more than 4-5 levels:

```json
{
  "user": {
    "profile": {
      "address": {
        "city": "New York"
      }
    }
  }
}
```

## Summary

Mastering JSON syntax rules is fundamental for every developer. Key takeaways:

- Strings must use double quotes
- No comments or trailing commas
- Keys must be strings
- Only six data types
- Use formatting tools to boost productivity

Use the [TryUtils JSON Formatter](/json-formatter) to quickly format, validate, and minify JSON data.
