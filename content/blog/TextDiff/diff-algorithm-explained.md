---
title: "Diff 算法原理与实现详解：从 LCS 到 Myers 算法"
description: "深入解析文本对比背后的核心算法原理，包括最长公共子序列（LCS）、Myers 差分算法、patience diff 等。通过代码示例和图解，帮助你理解 diff 工具的工作机制。"
date: '2025-02-12'
tags: ["Diff算法", "LCS", "Myers算法", "算法原理", "文本对比"]
author: "TryUtils Team"
keywords: ["diff算法", "LCS算法", "Myers算法", "最长公共子序列", "文本差异算法", "diff原理", "编辑距离", "动态规划", "patience diff", "文本对比算法"]
relatedTools:
  - text-diff
  - json-formatter
embedTool: text-diff
ogTitle: "Diff 算法原理与实现详解：从 LCS 到 Myers 算法"
ogDescription: "深入理解文本对比工具背后的算法原理，从 LCS 到 Myers 算法的完整解析。"
canonical: "https://www.tryutils.com/blog/TextDiff/diff-algorithm-explained"
schema:
  type: "Article"
  category: "技术深度"
  readingTime: "15分钟"
  difficulty: "进阶"
  topics: ["Diff算法", "LCS", "Myers算法"]
seo:
  priority: 0.9
  changefreq: "monthly"
  lastmod: "2025-02-12"
---

# Diff 算法原理与实现详解：从 LCS 到 Myers 算法

每当你使用 `git diff` 查看代码变更，或者在代码审查工具中查看差异时，背后都有一套精妙的算法在工作。本文将深入解析文本对比的核心算法原理，带你理解 diff 工具是如何高效地找出两段文本之间的差异的。

---

## 问题定义：什么是 Diff 问题？

Diff 问题的本质是：给定两个序列 A 和 B，找出将 A 转换为 B 所需的最小编辑操作集合。这些操作通常包括：

- **插入（Insert）**：在序列中插入一个元素
- **删除（Delete）**：从序列中删除一个元素
- **保留（Keep）**：元素不变，保持原样

```
序列 A: A B C D F
序列 B: A C D E F

编辑脚本:
  保留 A
  删除 B
  保留 C
  保留 D
  插入 E
  保留 F
```

这个问题与**编辑距离（Edit Distance）**密切相关——将一个序列转换为另一个序列所需的最少操作次数。

## 基础：最长公共子序列（LCS）

### LCS 的定义

最长公共子序列（Longest Common Subsequence，LCS）是 diff 算法的理论基础。子序列不要求连续，但要求保持原有顺序。

```
序列 A: A B C B D A B
序列 B: B D C A B A

LCS: B C B A（长度为 4）
```

找到 LCS 后，不在 LCS 中的元素就是需要删除或插入的部分。

### LCS 的动态规划实现

经典的 LCS 算法使用动态规划，时间和空间复杂度均为 O(mn)：

```javascript
function lcs(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  
  // 创建 DP 表格
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));
  
  // 填充表格
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // 回溯找出 LCS
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

// 示例
const a = ['A', 'B', 'C', 'D', 'F'];
const b = ['A', 'C', 'D', 'E', 'F'];
console.log(lcs(a, b)); // ['A', 'C', 'D', 'F']
```

### 从 LCS 到 Diff

有了 LCS，我们就可以生成 diff 结果：

```javascript
function generateDiff(original, modified) {
  const common = lcs(original, modified);
  const diff = [];
  let oi = 0, mi = 0, ci = 0;
  
  while (ci < common.length) {
    // 处理原文本中不在 LCS 中的行（删除）
    while (oi < original.length && original[oi] !== common[ci]) {
      diff.push({ type: 'delete', value: original[oi] });
      oi++;
    }
    // 处理新文本中不在 LCS 中的行（插入）
    while (mi < modified.length && modified[mi] !== common[ci]) {
      diff.push({ type: 'insert', value: modified[mi] });
      mi++;
    }
    // 公共元素（保留）
    diff.push({ type: 'keep', value: common[ci] });
    oi++;
    mi++;
    ci++;
  }
  
  // 处理剩余元素
  while (oi < original.length) {
    diff.push({ type: 'delete', value: original[oi++] });
  }
  while (mi < modified.length) {
    diff.push({ type: 'insert', value: modified[mi++] });
  }
  
  return diff;
}
```

## 核心：Myers 差分算法

### 为什么需要 Myers 算法？

经典 LCS 的 O(mn) 复杂度在处理大文件时效率不够。1986 年，Eugene W. Myers 提出了一种更高效的算法，时间复杂度为 O(ND)，其中 N 是两个序列的总长度，D 是编辑距离。当两个文件差异较小时（这是最常见的情况），Myers 算法的性能远优于经典 LCS。

Git 的 diff 功能默认使用的就是 Myers 算法。

### Myers 算法的核心思想

Myers 算法将 diff 问题转化为图搜索问题。想象一个二维网格：

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

- 向右移动 = 插入 B 中的元素
- 向下移动 = 删除 A 中的元素
- 对角线移动 = 元素相同，保留

目标是找到从左上角到右下角的最短路径（最少编辑操作）。

### Myers 算法的简化实现

```javascript
function myersDiff(a, b) {
  const n = a.length;
  const m = b.length;
  const max = n + m;
  
  // V 数组记录每条对角线上能到达的最远 x 坐标
  const v = new Array(2 * max + 1).fill(0);
  const trace = []; // 记录每一步的状态
  
  // 逐步增加编辑距离 d
  for (let d = 0; d <= max; d++) {
    trace.push([...v]);
    
    for (let k = -d; k <= d; k += 2) {
      // 决定是向下还是向右移动
      let x;
      if (k === -d || (k !== d && v[k - 1 + max] < v[k + 1 + max])) {
        x = v[k + 1 + max]; // 向下移动（删除）
      } else {
        x = v[k - 1 + max] + 1; // 向右移动（插入）
      }
      
      let y = x - k;
      
      // 沿对角线尽可能远地移动（匹配的元素）
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      
      v[k + max] = x;
      
      // 到达终点
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
    
    // 对角线移动（相同元素）
    while (x > prevX && y > prevY) {
      x--;
      y--;
      diff.unshift({ type: 'keep', value: a[x] });
    }
    
    if (d > 0) {
      if (x === prevX) {
        // 插入
        y--;
        diff.unshift({ type: 'insert', value: b[y] });
      } else {
        // 删除
        x--;
        diff.unshift({ type: 'delete', value: a[x] });
      }
    }
  }
  
  return diff;
}
```

### 算法复杂度分析

| 算法 | 时间复杂度 | 空间复杂度 | 适用场景 |
|------|-----------|-----------|---------|
| 经典 LCS | O(mn) | O(mn) | 短文本对比 |
| Myers | O(ND) | O(N) | 差异较小的文本（最常用） |
| Patience | O(N log N) | O(N) | 代码对比 |
| Histogram | O(N) 平均 | O(N) | 大文件对比 |

## 进阶：Patience Diff 算法

### 为什么 Myers 不够完美？

Myers 算法虽然高效，但有时会产生不够直观的结果。例如：

```python
# 原始代码
def hello():
    print("hello")

def goodbye():
    print("goodbye")

# 修改后
def hello():
    print("hello")

def greeting(name):
    print(f"hello, {name}")

def goodbye():
    print("goodbye")
```

Myers 可能会将 `def goodbye():` 匹配到错误的位置，导致 diff 结果难以阅读。

### Patience Diff 的核心思想

Patience Diff 算法（由 Bram Cohen 提出）的灵感来自纸牌游戏"耐心排序"：

1. 找出两个文件中唯一出现的公共行
2. 对这些唯一行求 LCS
3. 以 LCS 为锚点，递归处理锚点之间的区域

```javascript
function patienceDiff(a, b) {
  // 第一步：找出两个序列中都只出现一次的行
  const uniqueA = findUniqueLines(a);
  const uniqueB = findUniqueLines(b);
  
  // 第二步：找出公共的唯一行
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
  
  // 第三步：对公共唯一行求 LIS（最长递增子序列）
  const anchors = longestIncreasingSubsequence(
    commonUnique,
    (a, b) => a.indexB - b.indexB
  );
  
  // 第四步：以锚点为分界，递归处理每个区间
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

Patience Diff 在代码对比中通常能产生更符合人类直觉的结果，因为函数签名、类定义等通常是唯一行，可以作为很好的锚点。

## 实际应用：行级 Diff 与字级 Diff

### 行级 Diff

大多数 diff 工具默认以行为单位进行对比：

```javascript
function lineDiff(text1, text2) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  return myersDiff(lines1, lines2);
}
```

### 字级 Diff（Word-level Diff）

对于同一行内的细微变化，字级 diff 更加精确：

```javascript
function wordDiff(line1, line2) {
  const words1 = tokenize(line1);
  const words2 = tokenize(line2);
  return myersDiff(words1, words2);
}

function tokenize(text) {
  // 将文本分割为单词和空白符
  return text.match(/\S+|\s+/g) || [];
}

// 组合使用：先行级，再字级
function hybridDiff(text1, text2) {
  const lineDiffs = lineDiff(text1, text2);
  
  return lineDiffs.map(diff => {
    if (diff.type === 'modify') {
      // 对修改的行进行字级对比
      return {
        ...diff,
        wordChanges: wordDiff(diff.oldValue, diff.newValue)
      };
    }
    return diff;
  });
}
```

## 在线体验 Diff 算法

理论学习之后，不妨用实际工具来验证你的理解：

::BlogToolEmbed{tool="text-diff"}

试试将本文中的代码示例粘贴到工具中，观察 diff 算法如何识别出变化的部分。你也可以用 [JSON 格式化工具](/json-formatter) 先格式化结构化数据，再进行对比。

## 性能优化策略

在实际实现中，还有一些重要的优化策略：

### 1. 前缀/后缀裁剪

```javascript
function trimCommon(a, b) {
  let prefixLen = 0;
  let suffixLen = 0;
  
  // 跳过相同的前缀
  while (prefixLen < a.length && prefixLen < b.length 
         && a[prefixLen] === b[prefixLen]) {
    prefixLen++;
  }
  
  // 跳过相同的后缀
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

### 2. 哈希加速

对行内容进行哈希，将字符串比较转化为整数比较：

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

## 总结

Diff 算法是计算机科学中一个优雅而实用的领域。从基础的 LCS 动态规划，到高效的 Myers 算法，再到更智能的 Patience Diff，每种算法都有其适用场景。

理解这些算法的原理，不仅能帮助你更好地使用 diff 工具，还能在需要时实现自定义的对比逻辑。想要了解 diff 在实际工作中的应用，可以阅读[代码审查中的文本对比技巧](/blog/TextDiff/text-diff-for-code-review)和[文本对比的实际应用场景](/blog/TextDiff/text-diff-practical-use-cases)。

使用 [TryUtils 文本对比工具](/text-diff) 来实践你学到的知识吧！
