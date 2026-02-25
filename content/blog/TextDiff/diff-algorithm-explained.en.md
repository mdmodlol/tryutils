---
title: "Understanding Diff Algorithms: From LCS to Myers Algorithm"
description: "A deep dive into the core algorithms behind text comparison tools, including Longest Common Subsequence (LCS), Myers diff algorithm, and patience diff. With code examples and visual explanations to help you understand how diff tools work."
date: '2025-02-12'
tags: ["Diff Algorithm", "LCS", "Myers Algorithm", "Algorithm Design", "Text Diff"]
author: "TryUtils Team"
keywords: ["diff algorithm", "LCS algorithm", "Myers algorithm", "longest common subsequence", "text diff algorithm", "diff explained", "edit distance", "dynamic programming", "patience diff", "text comparison algorithm"]
relatedTools:
  - text-diff
  - json-formatter
embedTool: text-diff
ogTitle: "Understanding Diff Algorithms: From LCS to Myers Algorithm"
ogDescription: "Deep dive into the algorithms powering text diff tools — from LCS to Myers algorithm, fully explained with code examples."
canonical: "https://www.tryutils.com/en/blog/TextDiff/diff-algorithm-explained"
schema:
  type: "Article"
  category: "Technical Deep Dive"
  readingTime: "15 min"
  difficulty: "Advanced"
  topics: ["Diff Algorithm", "LCS", "Myers Algorithm"]
seo:
  priority: 0.9
  changefreq: "monthly"
  lastmod: "2025-02-12"
---

# Understanding Diff Algorithms: From LCS to Myers Algorithm

Every time you run `git diff` to view code changes or review differences in a code review tool, a sophisticated algorithm is working behind the scenes. This article takes a deep dive into the core algorithms that power text comparison, helping you understand how diff tools efficiently find differences between two texts.

---

## Problem Definition: What Is the Diff Problem?

The diff problem is essentially: given two sequences A and B, find the minimum set of edit operations needed to transform A into B. These operations typically include:

- **Insert**: Add an element to the sequence
- **Delete**: Remove an element from the sequence
- **Keep**: Element remains unchanged

```
Sequence A: A B C D F
Sequence B: A C D E F

Edit script:
  Keep A
  Delete B
  Keep C
  Keep D
  Insert E
  Keep F
```

This problem is closely related to **Edit Distance** — the minimum number of operations needed to transform one sequence into another.

## Foundation: Longest Common Subsequence (LCS)

### What Is LCS?

The Longest Common Subsequence (LCS) is the theoretical foundation of diff algorithms. A subsequence doesn't need to be contiguous but must maintain the original order.

```
Sequence A: A B C B D A B
Sequence B: B D C A B A

LCS: B C B A (length 4)
```

Once the LCS is found, elements not in the LCS are the ones that need to be deleted or inserted.

### Dynamic Programming Implementation of LCS

The classic LCS algorithm uses dynamic programming with O(mn) time and space complexity:

```javascript
function lcs(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  
  // Create DP table
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // Fill the table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to find the LCS
  let i = m, j = n;
  const result = [];
  
  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      result.unshift(text1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return result;
}

// Example
const a = ['A', 'B', 'C', 'D', 'F'];
const b = ['A', 'C', 'D', 'E', 'F'];
console.log(lcs(a, b)); // ['A', 'C', 'D', 'F']
```

### From LCS to Diff

With the LCS computed, we can generate the diff output:

```javascript
function generateDiff(original, modified) {
  const common = lcs(original, modified);
  const diff = [];
  let oi = 0, mi = 0, ci = 0;
  
  while (ci < common.length) {
    // Handle lines in original not in LCS (deletions)
    while (oi < original.length && original[oi] !== common[ci]) {
      diff.push({ type: 'delete', value: original[oi] });
      oi++;
    }
    // Handle lines in modified not in LCS (insertions)
    while (mi < modified.length && modified[mi] !== common[ci]) {
      diff.push({ type: 'insert', value: modified[mi] });
      mi++;
    }
    // Common element (keep)
    diff.push({ type: 'keep', value: common[ci] });
    oi++;
    mi++;
    ci++;
  }
  
  // Handle remaining elements
  while (oi < original.length) {
    diff.push({ type: 'delete', value: original[oi++] });
  }
  while (mi < modified.length) {
    diff.push({ type: 'insert', value: modified[mi++] });
  }
  
  return diff;
}
```

## The Core: Myers Diff Algorithm

### Why Do We Need Myers?

The classic LCS algorithm's O(mn) complexity isn't efficient enough for large files. In 1986, Eugene W. Myers proposed a more efficient algorithm with O(ND) time complexity, where N is the total length of both sequences and D is the edit distance. When two files have few differences (the most common case), Myers significantly outperforms classic LCS.

Git's diff functionality uses the Myers algorithm by default.

### Core Idea of Myers Algorithm

Myers transforms the diff problem into a graph search problem. Imagine a 2D grid:

```
        B[0]  B[1]  B[2]  B[3]
         A     C     D     F
    ┌─────┬─────┬─────┬─────┐
A[0] A │  ╲  │     │     │     │
    ├─────┼─────┼─────┼─────┤
A[1] B │     │     │     │     │
    ├─────┼─────┼─────┼─────┤
A[2] C │     │  ╲  │     │     │
    ├─────┼─────┼─────┼─────┤
A[3] D │     │     │  ╲  │     │
    ├─────┼─────┼─────┼─────┤
A[4] F │     │     │     │  ╲  │
    └─────┴─────┴─────┴─────┘
```

- Moving right = Insert an element from B
- Moving down = Delete an element from A
- Diagonal move = Elements match, keep them

The goal is to find the shortest path from top-left to bottom-right (minimum edit operations).

### Simplified Myers Implementation

```javascript
function myersDiff(a, b) {
  const n = a.length;
  const m = b.length;
  const max = n + m;
  
  // V array tracks the furthest x coordinate reached on each diagonal
  const v = new Array(2 * max + 1).fill(0);
  const trace = []; // Record state at each step
  
  // Incrementally increase edit distance d
  for (let d = 0; d <= max; d++) {
    trace.push([...v]);
    
    for (let k = -d; k <= d; k += 2) {
      // Decide whether to move down or right
      let x;
      if (k === -d || (k !== d && v[k - 1 + max] < v[k + 1 + max])) {
        x = v[k + 1 + max]; // Move down (delete)
      } else {
        x = v[k - 1 + max] + 1; // Move right (insert)
      }
      
      let y = x - k;
      
      // Follow diagonal as far as possible (matching elements)
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      
      v[k + max] = x;
      
      // Reached the end
      if (x >= n && y >= m) {
        return backtrack(trace, a, b, max);
      }
    }
  }
}

function backtrack(trace, a, b, max) {
  const diff = [];
  let x = a.length;
  let y = b.length;
  
  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;
    
    let prevK;
    if (k === -d || (k !== d && v[k - 1 + max] < v[k + 1 + max])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    
    const prevX = v[prevK + max];
    const prevY = prevX - prevK;
    
    // Diagonal moves (matching elements)
    while (x > prevX && y > prevY) {
      x--;
      y--;
      diff.unshift({ type: 'keep', value: a[x] });
    }
    
    if (d > 0) {
      if (x === prevX) {
        // Insertion
        y--;
        diff.unshift({ type: 'insert', value: b[y] });
      } else {
        // Deletion
        x--;
        diff.unshift({ type: 'delete', value: a[x] });
      }
    }
  }
  
  return diff;
}
```

### Complexity Analysis

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|----------------|-----------------|----------|
| Classic LCS | O(mn) | O(mn) | Short text comparison |
| Myers | O(ND) | O(N) | Small differences (most common) |
| Patience | O(N log N) | O(N) | Code comparison |
| Histogram | O(N) average | O(N) | Large file comparison |

## Advanced: Patience Diff Algorithm

### Why Isn't Myers Perfect?

While Myers is efficient, it sometimes produces results that aren't intuitive. For example:

```python
# Original code
def hello():
    print("hello")

def goodbye():
    print("goodbye")

# Modified code
def hello():
    print("hello")

def greeting(name):
    print(f"hello, {name}")

def goodbye():
    print("goodbye")
```

Myers might match `def goodbye():` to the wrong position, making the diff output hard to read.

### Core Idea of Patience Diff

The Patience Diff algorithm (proposed by Bram Cohen) draws inspiration from the card game "Patience":

1. Find lines that appear exactly once in both files
2. Compute the LCS of these unique lines
3. Use the LCS as anchor points and recursively process regions between anchors

```javascript
function patienceDiff(a, b) {
  // Step 1: Find lines that appear exactly once in each sequence
  const uniqueA = findUniqueLines(a);
  const uniqueB = findUniqueLines(b);
  
  // Step 2: Find common unique lines
  const commonUnique = [];
  for (const [line, indexA] of uniqueA) {
    if (uniqueB.has(line)) {
      commonUnique.push({
        line,
        indexA,
        indexB: uniqueB.get(line)
      });
    }
  }
  
  // Step 3: Compute LIS (Longest Increasing Subsequence) on common unique lines
  const anchors = longestIncreasingSubsequence(
    commonUnique,
    (a, b) => a.indexB - b.indexB
  );
  
  // Step 4: Recursively diff each interval between anchors
  return recursiveDiff(a, b, anchors);
}

function findUniqueLines(lines) {
  const count = new Map();
  lines.forEach((line, index) => {
    if (count.has(line)) {
      count.set(line, { count: count.get(line).count + 1, index });
    } else {
      count.set(line, { count: 1, index });
    }
  });
  
  const unique = new Map();
  for (const [line, { count: c, index }] of count) {
    if (c === 1) {
      unique.set(line, index);
    }
  }
  return unique;
}
```

Patience Diff typically produces more human-intuitive results for code comparison because function signatures, class definitions, and similar constructs are usually unique lines that serve as excellent anchor points.

## Practical Application: Line-level vs Word-level Diff

### Line-level Diff

Most diff tools compare at the line level by default:

```javascript
function lineDiff(text1, text2) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  return myersDiff(lines1, lines2);
}
```

### Word-level Diff

For subtle changes within the same line, word-level diff provides greater precision:

```javascript
function wordDiff(line1, line2) {
  const words1 = tokenize(line1);
  const words2 = tokenize(line2);
  return myersDiff(words1, words2);
}

function tokenize(text) {
  // Split text into words and whitespace
  return text.match(/\S+|\s+/g) || [];
}

// Combined approach: line-level first, then word-level
function hybridDiff(text1, text2) {
  const lineDiffs = lineDiff(text1, text2);
  
  return lineDiffs.map(diff => {
    if (diff.type === 'modify') {
      // Apply word-level diff to modified lines
      return {
        ...diff,
        wordChanges: wordDiff(diff.oldValue, diff.newValue)
      };
    }
    return diff;
  });
}
```

## Try Diff Algorithms Online

After learning the theory, use a real tool to verify your understanding:

::BlogToolEmbed{tool="text-diff"}

Try pasting the code examples from this article into the tool and observe how the diff algorithm identifies the changes. You can also use the [JSON Formatter tool](/json-formatter) to format structured data before comparing.

## Performance Optimization Strategies

In real-world implementations, several important optimization strategies exist:

### 1. Common Prefix/Suffix Trimming

```javascript
function trimCommon(a, b) {
  let prefixLen = 0;
  let suffixLen = 0;
  
  // Skip identical prefix
  while (prefixLen < a.length && prefixLen < b.length 
         && a[prefixLen] === b[prefixLen]) {
    prefixLen++;
  }
  
  // Skip identical suffix
  while (suffixLen < a.length - prefixLen 
         && suffixLen < b.length - prefixLen
         && a[a.length - 1 - suffixLen] === b[b.length - 1 - suffixLen]) {
    suffixLen++;
  }
  
  return {
    prefix: a.slice(0, prefixLen),
    middleA: a.slice(prefixLen, a.length - suffixLen),
    middleB: b.slice(prefixLen, b.length - suffixLen),
    suffix: a.slice(a.length - suffixLen)
  };
}
```

### 2. Hash-based Acceleration

Hash line contents to convert string comparisons into integer comparisons:

```javascript
function hashLines(lines) {
  const hashMap = new Map();
  return lines.map(line => {
    if (!hashMap.has(line)) {
      hashMap.set(line, hashMap.size);
    }
    return hashMap.get(line);
  });
}
```

## Summary

Diff algorithms represent an elegant and practical area of computer science. From the foundational LCS dynamic programming approach to the efficient Myers algorithm and the more intelligent Patience Diff, each algorithm has its ideal use case.

Understanding these algorithms not only helps you use diff tools more effectively but also enables you to implement custom comparison logic when needed. To learn about practical applications of diff in real work, read [Text Diff Tips for Code Review](/blog/TextDiff/text-diff-for-code-review) and [Practical Use Cases for Text Comparison](/blog/TextDiff/text-diff-practical-use-cases).

Try the [TryUtils Text Diff tool](/text-diff) to put your knowledge into practice!
