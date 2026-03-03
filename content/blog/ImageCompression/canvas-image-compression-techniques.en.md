---
title: "Canvas API Image Compression: Complete Guide 2025 - Free Code Examples"
description: "Master Canvas API image compression! Complete guide with free code examples. Learn compression algorithms, quality control, and optimization techniques for your projects."
date: '2025-01-09'
tags: ["Canvas API", "image compression", "JavaScript", "frontend technology", "image processing", "performance optimization"]
author: "TryUtils Team"
keywords: "Canvas API image compression,JavaScript image processing,frontend image optimization,Canvas compression algorithms,image quality control,Web Worker image processing,memory optimization,image scaling algorithms,frontend performance optimization,client-side image compression"
relatedTools:
  - image-compressor
  - image-format-converter
embedTool: image-compressor
ogTitle: "Canvas API Image Compression - Free Complete Guide 2025"
ogDescription: "Learn Canvas API image compression with free code examples! Master compression algorithms, quality control, and optimization. Start now!"
ogImage: "/images/blog/canvas-image-compression-techniques-og.jpg"
twitterTitle: "Canvas API Image Compression - Free Guide 2025"
twitterDescription: "Complete Canvas API image compression guide with free code examples. Learn optimization techniques for your projects today!"
twitterImage: "/images/blog/canvas-image-compression-techniques-twitter.jpg"
canonical: "https://www.tryutils.com/en/blog/ImageCompression/canvas-image-compression-techniques"
schema:
  type: "Article"
  category: "Technical Tutorial"
  readingTime: "20 minutes"
  difficulty: "Advanced"
  topics: ["Canvas API", "Image Compression", "Frontend Technology"]
seo:
  priority: 0.8
  changefreq: "monthly"
  lastmod: "2025-01-09"
---

# Canvas API Image Compression Techniques: Deep Dive and Implementation

Canvas API provides powerful image processing capabilities for frontend developers, especially in image compression. This article explores comprehensive techniques for implementing efficient image compression using Canvas API.

---

## Canvas Image Compression Fundamentals

### Canvas Compression Workflow

```
Canvas Image Compression Process
├── 1. Image Loading → Image object or File object
├── 2. Canvas Drawing → drawImage() method
├── 3. Size Adjustment → Scaling algorithm processing
├── 4. Quality Control → toBlob() or toDataURL()
└── 5. Output Result → Compressed image data
```

### Core API Introduction

#### 1. Canvas Drawing Methods

```javascript
// Multiple overloads of drawImage method
context.drawImage(image, dx, dy);
context.drawImage(image, dx, dy, dWidth, dHeight);
context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```

#### 2. Image Export Methods

```javascript
// Asynchronous Blob export (recommended)
canvas.toBlob(callback, mimeType, quality);

// Synchronous DataURL export
const dataURL = canvas.toDataURL(mimeType, quality);
```

---

## Basic Compression Implementation

### Simple Compression Function

```javascript
class BasicImageCompressor {
  /**
   * Basic image compression
   * @param {File|HTMLImageElement} source - Source image
   * @param {Object} options - Compression options
   * @returns {Promise<Blob>} Compressed image
   */
  static async compress(source, options = {}) {
    const {
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
      mimeType = 'image/jpeg'
    } = options;
    
    // Create image object
    const img = await this.loadImage(source);
    
    // Calculate target dimensions
    const { width, height } = this.calculateDimensions(
      img.width, 
      img.height, 
      maxWidth, 
      maxHeight
    );
    
    // Create Canvas and draw
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw image
    ctx.drawImage(img, 0, 0, width, height);
    
    // Export compression result
    return new Promise((resolve) => {
      canvas.toBlob(resolve, mimeType, quality);
    });
  }
  
  /**
   * Load image
   */
  static loadImage(source) {
    return new Promise((resolve, reject) => {
      if (source instanceof HTMLImageElement) {
        resolve(source);
        return;
      }
      
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      
      if (source instanceof File) {
        img.src = URL.createObjectURL(source);
      } else {
        img.src = source;
      }
    });
  }
  
  /**
   * Calculate target dimensions
   */
  static calculateDimensions(srcWidth, srcHeight, maxWidth, maxHeight) {
    let { width, height } = { width: srcWidth, height: srcHeight };
    
    // Scale proportionally
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  }
}

// Usage example
const compressedBlob = await BasicImageCompressor.compress(file, {
  quality: 0.8,
  maxWidth: 1200,
  maxHeight: 800,
  mimeType: 'image/webp'
});
```

---

## Advanced Compression Algorithm Implementation

### Precise Size Compression

```javascript
class PrecisionImageCompressor {
  /**
   * Compress to specified file size
   * @param {File} file - Source file
   * @param {number} targetSize - Target size (bytes)
   * @param {Object} options - Compression options
   */
  static async compressToSize(file, targetSize, options = {}) {
    const {
      tolerance = 0.02,        // Tolerance range 2%
      maxIterations = 15,      // Maximum iterations
      minQuality = 0.1,        // Minimum quality
      maxQuality = 0.95,       // Maximum quality
      mimeType = 'image/jpeg'
    } = options;
    
    const img = await this.loadImage(file);
    let bestResult = null;
    let bestQuality = 0;
    
    // Binary search for optimal quality parameter
    let low = minQuality;
    let high = maxQuality;
    
    for (let i = 0; i < maxIterations; i++) {
      const quality = (low + high) / 2;
      const compressed = await this.compressWithQuality(img, quality, mimeType);
      const ratio = compressed.size / targetSize;
      
      // Record best result
      if (Math.abs(ratio - 1) < Math.abs(bestResult?.size / targetSize - 1) || !bestResult) {
        bestResult = compressed;
        bestQuality = quality;
      }
      
      // Check if target precision is reached
      if (Math.abs(ratio - 1) <= tolerance) {
        break;
      }
      
      // Adjust search range
      if (ratio > 1) {
        high = quality - 0.01;
      } else {
        low = quality + 0.01;
      }
      
      // Prevent search range from becoming too small
      if (high - low < 0.01) {
        break;
      }
    }
    
    // Fine-tuning
    const finetuned = await this.finetuneQuality(
      img, 
      bestQuality, 
      targetSize, 
      mimeType
    );
    
    return finetuned || bestResult;
  }
  
  /**
   * Compress with specified quality
   */
  static async compressWithQuality(img, quality, mimeType) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.width;
    canvas.height = img.height;
    
    ctx.drawImage(img, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob(resolve, mimeType, quality);
    });
  }
  
  /**
   * Fine quality adjustment
   */
  static async finetuneQuality(img, baseQuality, targetSize, mimeType) {
    const step = 0.005; // 0.5% step
    let bestResult = null;
    let bestDiff = Infinity;
    
    // Fine-tune around base quality
    for (let offset = -0.02; offset <= 0.02; offset += step) {
      const quality = Math.max(0.1, Math.min(0.95, baseQuality + offset));
      const compressed = await this.compressWithQuality(img, quality, mimeType);
      const diff = Math.abs(compressed.size - targetSize);
      
      if (diff < bestDiff) {
        bestDiff = diff;
        bestResult = compressed;
      }
    }
    
    return bestResult;
  }
}
```

### Multi-Dimensional Joint Optimization

```javascript
class MultiDimensionCompressor {
  /**
   * Joint optimization of size and quality
   */
  static async optimizeWithDimensions(file, targetSize, options = {}) {
    const img = await this.loadImage(file);
    const originalArea = img.width * img.height;
    
    // Test different scaling factors
    const scaleFactors = [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7];
    let bestResult = null;
    let bestScore = Infinity;
    
    for (const scale of scaleFactors) {
      const scaledWidth = Math.round(img.width * scale);
      const scaledHeight = Math.round(img.height * scale);
      
      // Find optimal quality for current size
      const result = await this.optimizeQualityForSize(
        img, 
        scaledWidth, 
        scaledHeight, 
        targetSize, 
        options
      );
      
      if (result) {
        const sizeDiff = Math.abs(result.size - targetSize);
        const qualityPenalty = (1 - scale) * 0.1; // Quality penalty for size reduction
        const score = sizeDiff + qualityPenalty * targetSize;
        
        if (score < bestScore) {
          bestScore = score;
          bestResult = {
            ...result,
            scale,
            dimensions: { width: scaledWidth, height: scaledHeight }
          };
        }
      }
    }
    
    return bestResult;
  }
  
  /**
   * Optimize quality parameters for specified dimensions
   */
  static async optimizeQualityForSize(img, width, height, targetSize, options) {
    const { mimeType = 'image/jpeg', maxIterations = 10 } = options;
    
    let low = 0.1;
    let high = 0.95;
    let bestResult = null;
    
    for (let i = 0; i < maxIterations; i++) {
      const quality = (low + high) / 2;
      const compressed = await this.compressWithDimensions(
        img, width, height, quality, mimeType
      );
      
      if (!bestResult || Math.abs(compressed.size - targetSize) < 
          Math.abs(bestResult.size - targetSize)) {
        bestResult = compressed;
      }
      
      if (compressed.size > targetSize) {
        high = quality - 0.01;
      } else {
        low = quality + 0.01;
      }
      
      if (high - low < 0.01) break;
    }
    
    return bestResult;
  }
  
  /**
   * Compress with specified dimensions and quality
   */
  static async compressWithDimensions(img, width, height, quality, mimeType) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // High-quality scaling settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(img, 0, 0, width, height);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve({
          blob,
          size: blob.size,
          quality,
          width,
          height
        });
      }, mimeType, quality);
    });
  }
}
```

---

## Image Quality Enhancement Techniques

### Sharpening Filter Implementation

```javascript
class ImageEnhancer {
  /**
   * Apply sharpening filter
   */
  static applySharpenFilter(canvas, strength = 0.5) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Sharpening convolution kernel
    const kernel = [
      0, -1 * strength, 0,
      -1 * strength, 1 + 4 * strength, -1 * strength,
      0, -1 * strength, 0
    ];
    
    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels
          let sum = 0;
          
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              sum += data[idx] * kernel[kernelIdx];
            }
          }
          
          const outputIdx = (y * width + x) * 4 + c;
          output[outputIdx] = Math.max(0, Math.min(255, sum));
        }
        
        // Keep alpha channel unchanged
        const alphaIdx = (y * width + x) * 4 + 3;
        output[alphaIdx] = data[alphaIdx];
      }
    }
    
    const outputImageData = new ImageData(output, width, height);
    ctx.putImageData(outputImageData, 0, 0);
  }
  
  /**
   * Contrast and brightness adjustment
   */
  static adjustContrastBrightness(canvas, contrast = 1.0, brightness = 0) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Adjust RGB channels
      for (let c = 0; c < 3; c++) {
        let value = data[i + c];
        value = (value - 128) * contrast + 128 + brightness;
        data[i + c] = Math.max(0, Math.min(255, value));
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
}
```

### High-Quality Scaling Algorithm

```javascript
class HighQualityScaler {
  /**
   * Bicubic interpolation scaling
   */
  static bicubicScale(sourceCanvas, targetWidth, targetHeight) {
    const sourceCtx = sourceCanvas.getContext('2d');
    const sourceData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
    
    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = targetWidth;
    targetCanvas.height = targetHeight;
    const targetCtx = targetCanvas.getContext('2d');
    
    const targetData = targetCtx.createImageData(targetWidth, targetHeight);
    
    const scaleX = sourceCanvas.width / targetWidth;
    const scaleY = sourceCanvas.height / targetHeight;
    
    for (let y = 0; y < targetHeight; y++) {
      for (let x = 0; x < targetWidth; x++) {
        const srcX = x * scaleX;
        const srcY = y * scaleY;
        
        const pixel = this.bicubicInterpolation(
          sourceData, 
          sourceCanvas.width, 
          sourceCanvas.height, 
          srcX, 
          srcY
        );
        
        const targetIdx = (y * targetWidth + x) * 4;
        targetData.data[targetIdx] = pixel.r;
        targetData.data[targetIdx + 1] = pixel.g;
        targetData.data[targetIdx + 2] = pixel.b;
        targetData.data[targetIdx + 3] = pixel.a;
      }
    }
    
    targetCtx.putImageData(targetData, 0, 0);
    return targetCanvas;
  }
  
  /**
   * Bicubic interpolation calculation
   */
  static bicubicInterpolation(imageData, width, height, x, y) {
    const data = imageData.data;
    
    const x1 = Math.floor(x);
    const y1 = Math.floor(y);
    const dx = x - x1;
    const dy = y - y1;
    
    let r = 0, g = 0, b = 0, a = 0;
    
    // 4x4 sampling window
    for (let j = -1; j <= 2; j++) {
      for (let i = -1; i <= 2; i++) {
        const px = Math.max(0, Math.min(width - 1, x1 + i));
        const py = Math.max(0, Math.min(height - 1, y1 + j));
        const idx = (py * width + px) * 4;
        
        const weight = this.cubicWeight(i - dx) * this.cubicWeight(j - dy);
        
        r += data[idx] * weight;
        g += data[idx + 1] * weight;
        b += data[idx + 2] * weight;
        a += data[idx + 3] * weight;
      }
    }
    
    return {
      r: Math.max(0, Math.min(255, Math.round(r))),
      g: Math.max(0, Math.min(255, Math.round(g))),
      b: Math.max(0, Math.min(255, Math.round(b))),
      a: Math.max(0, Math.min(255, Math.round(a)))
    };
  }
  
  /**
   * Cubic weight function
   */
  static cubicWeight(t) {
    const absT = Math.abs(t);
    if (absT <= 1) {
      return 1.5 * absT * absT * absT - 2.5 * absT * absT + 1;
    } else if (absT <= 2) {
      return -0.5 * absT * absT * absT + 2.5 * absT * absT - 4 * absT + 2;
    }
    return 0;
  }
}
```

---

## Performance Optimization Techniques

### Web Worker Parallel Processing

```javascript
// Main thread code
class WorkerImageCompressor {
  constructor() {
    this.workers = [];
    this.workerCount = navigator.hardwareConcurrency || 4;
    this.initWorkers();
  }
  
  initWorkers() {
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker('/js/image-compression-worker.js');
      this.workers.push(worker);
    }
  }
  
  async compressBatch(files, options = {}) {
    const chunks = this.chunkArray(files, this.workerCount);
    const promises = chunks.map((chunk, index) => 
      this.compressChunk(chunk, options, index)
    );
    
    const results = await Promise.all(promises);
    return results.flat();
  }
  
  compressChunk(files, options, workerIndex) {
    return new Promise((resolve, reject) => {
      const worker = this.workers[workerIndex];
      
      worker.onmessage = (e) => {
        if (e.data.type === 'batch_complete') {
          resolve(e.data.results);
        } else if (e.data.type === 'error') {
          reject(new Error(e.data.message));
        }
      };
      
      worker.postMessage({
        type: 'compress_batch',
        files: files.map(file => ({
          data: file,
          options
        }))
      });
    });
  }
  
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
```

```javascript
// Worker thread code (image-compression-worker.js)
self.onmessage = async function(e) {
  if (e.data.type === 'compress_batch') {
    try {
      const results = [];
      
      for (const item of e.data.files) {
        const compressed = await compressImage(item.data, item.options);
        results.push(compressed);
        
        // Send progress update
        self.postMessage({
          type: 'progress',
          completed: results.length,
          total: e.data.files.length
        });
      }
      
      self.postMessage({
        type: 'batch_complete',
        results
      });
      
    } catch (error) {
      self.postMessage({
        type: 'error',
        message: error.message
      });
    }
  }
};

async function compressImage(file, options) {
  // Implement image compression logic in Worker
  // Note: DOM APIs are not directly available in Worker, use OffscreenCanvas
  const canvas = new OffscreenCanvas(options.width, options.height);
  const ctx = canvas.getContext('2d');
  
  // Compression logic implementation...
  
  return canvas.convertToBlob({
    type: options.mimeType,
    quality: options.quality
  });
}
```

### Memory Management Optimization

```javascript
class MemoryOptimizedCompressor {
  constructor() {
    this.canvasPool = [];
    this.maxPoolSize = 5;
  }
  
  /**
   * Get Canvas object (object pool pattern)
   */
  getCanvas(width, height) {
    let canvas = this.canvasPool.pop();
    
    if (!canvas) {
      canvas = document.createElement('canvas');
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Clear previous content
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    
    return canvas;
  }
  
  /**
   * Return Canvas object to pool
   */
  releaseCanvas(canvas) {
    if (this.canvasPool.length < this.maxPoolSize) {
      this.canvasPool.push(canvas);
    }
  }
  
  /**
   * Process large images in chunks
   */
  async compressLargeImage(file, options = {}) {
    const { chunkSize = 2048 } = options;
    const img = await this.loadImage(file);
    
    if (img.width <= chunkSize && img.height <= chunkSize) {
      return this.compressNormal(img, options);
    }
    
    // Calculate chunk count
    const chunksX = Math.ceil(img.width / chunkSize);
    const chunksY = Math.ceil(img.height / chunkSize);
    
    const resultCanvas = this.getCanvas(img.width, img.height);
    const resultCtx = resultCanvas.getContext('2d');
    
    // Process chunks
    for (let y = 0; y < chunksY; y++) {
      for (let x = 0; x < chunksX; x++) {
        const chunkX = x * chunkSize;
        const chunkY = y * chunkSize;
        const chunkW = Math.min(chunkSize, img.width - chunkX);
        const chunkH = Math.min(chunkSize, img.height - chunkY);
        
        // Process current chunk
        const chunkCanvas = this.getCanvas(chunkW, chunkH);
        const chunkCtx = chunkCanvas.getContext('2d');
        
        chunkCtx.drawImage(
          img, 
          chunkX, chunkY, chunkW, chunkH,
          0, 0, chunkW, chunkH
        );
        
        // Draw processed chunk to result Canvas
        resultCtx.drawImage(chunkCanvas, chunkX, chunkY);
        
        // Release chunk Canvas
        this.releaseCanvas(chunkCanvas);
        
        // Force garbage collection (if available)
        if (window.gc) {
          window.gc();
        }
      }
    }
    
    // Export final result
    const result = await new Promise((resolve) => {
      resultCanvas.toBlob(resolve, options.mimeType, options.quality);
    });
    
    this.releaseCanvas(resultCanvas);
    return result;
  }
}
```

---

## Real-world Application Cases

### Complete Image Compression Component

```javascript
class AdvancedImageCompressor {
  constructor(options = {}) {
    this.options = {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8,
      mimeType: 'image/jpeg',
      enableWorker: true,
      enableEnhancement: false,
      ...options
    };
    
    this.memoryOptimizer = new MemoryOptimizedCompressor();
    this.workerCompressor = this.options.enableWorker ? 
      new WorkerImageCompressor() : null;
  }
  
  /**
   * Smart compression - select optimal strategy based on image characteristics
   */
  async smartCompress(file, targetSize = null) {
    const img = await this.loadImage(file);
    const imageInfo = this.analyzeImage(img);
    
    // Select compression strategy based on image characteristics
    let strategy;
    if (targetSize) {
      strategy = 'precision';
    } else if (imageInfo.complexity > 0.8) {
      strategy = 'quality_first';
    } else {
      strategy = 'size_first';
    }
    
    switch (strategy) {
      case 'precision':
        return this.compressToExactSize(file, targetSize);
      case 'quality_first':
        return this.compressWithQualityPriority(file);
      case 'size_first':
        return this.compressWithSizePriority(file);
      default:
        return this.compressBasic(file);
    }
  }
  
  /**
   * Analyze image characteristics
   */
  analyzeImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Scale down to small size for analysis
    const analyzeSize = 100;
    canvas.width = analyzeSize;
    canvas.height = analyzeSize;
    
    ctx.drawImage(img, 0, 0, analyzeSize, analyzeSize);
    const imageData = ctx.getImageData(0, 0, analyzeSize, analyzeSize);
    const data = imageData.data;
    
    // Calculate image complexity (based on pixel variation)
    let totalVariation = 0;
    for (let i = 0; i < data.length - 4; i += 4) {
      const r1 = data[i], g1 = data[i + 1], b1 = data[i + 2];
      const r2 = data[i + 4], g2 = data[i + 5], b2 = data[i + 6];
      
      totalVariation += Math.abs(r2 - r1) + Math.abs(g2 - g1) + Math.abs(b2 - b1);
    }
    
    const complexity = totalVariation / (analyzeSize * analyzeSize * 3 * 255);
    
    return {
      complexity,
      width: img.width,
      height: img.height,
      aspectRatio: img.width / img.height
    };
  }
  
  /**
   * Compress to exact size
   */
  async compressToExactSize(file, targetSize) {
    const tolerance = 0.02; // 2% tolerance
    
    // First try quality optimization
    let result = await this.optimizeByQuality(file, targetSize);
    
    // If error is still large, try size + quality dual optimization
    if (Math.abs(result.size - targetSize) / targetSize > tolerance) {
      const multiResult = await this.optimizeBySizeAndQuality(file, targetSize);
      if (Math.abs(multiResult.size - targetSize) < Math.abs(result.size - targetSize)) {
        result = multiResult;
      }
    }
    
    return result;
  }
  
  /**
   * Quality-first compression
   */
  async optimizeByQuality(file, targetSize) {
    const img = await this.loadImage(file);
    const canvas = this.memoryOptimizer.getCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    
    // Apply image enhancement (if enabled)
    if (this.options.enableEnhancement) {
      ImageEnhancer.applySharpenFilter(canvas, 0.3);
      ImageEnhancer.adjustContrastBrightness(canvas, 1.1, 5);
    }
    
    ctx.drawImage(img, 0, 0);
    
    // High-precision binary search
    const result = await this.binarySearchQuality(
      canvas, targetSize, 0.1, 0.95, 15, 0.02
    );
    
    this.memoryOptimizer.releaseCanvas(canvas);
    return result;
  }
  
  /**
   * High-precision binary search for quality parameters
   */
  async binarySearchQuality(canvas, targetSize, minQ, maxQ, maxIter, tolerance) {
    let low = minQ;
    let high = maxQ;
    let bestResult = null;
    let bestQuality = 0;
    
    for (let i = 0; i < maxIter; i++) {
      const quality = (low + high) / 2;
      const compressed = await this.getCanvasBlob(canvas, quality);
      const ratio = compressed.size / targetSize;
      
      // Record best result
      if (!bestResult || Math.abs(ratio - 1) < Math.abs(bestResult.size / targetSize - 1)) {
        bestResult = compressed;
        bestQuality = quality;
      }
      
      // Check convergence condition
      if (Math.abs(ratio - 1) <= tolerance) {
        break;
      }
      
      // Adjust search range
      if (ratio > 1) {
        high = quality - 0.005;
      } else {
        low = quality + 0.005;
      }
      
      // Prevent range from becoming too small
      if (high - low < 0.005) {
        break;
      }
    }
    
    // Fine-tuning
    const finetuned = await this.finetuneQuality(canvas, bestQuality, targetSize);
    return finetuned || bestResult;
  }
  
  /**
   * Fine quality adjustment
   */
  async finetuneQuality(canvas, baseQuality, targetSize) {
    const step = 0.005;
    let bestResult = null;
    let bestDiff = Infinity;
    
    for (let offset = -0.02; offset <= 0.02; offset += step) {
      const quality = Math.max(0.1, Math.min(0.95, baseQuality + offset));
      const compressed = await this.getCanvasBlob(canvas, quality);
      const diff = Math.abs(compressed.size - targetSize);
      
      if (diff < bestDiff) {
        bestDiff = diff;
        bestResult = compressed;
      }
    }
    
    return bestResult;
  }
  
  /**
   * Get Canvas Blob
   */
  getCanvasBlob(canvas, quality) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, this.options.mimeType, quality);
    });
  }
}

// Usage example
const compressor = new AdvancedImageCompressor({
  maxWidth: 1920,
  maxHeight: 1080,
  enableEnhancement: true,
  enableWorker: true
});

// Smart compression
const result = await compressor.smartCompress(file, 500 * 1024); // Compress to 500KB
console.log(`Compression complete: ${result.size} bytes`);
```

---

## Summary and Best Practices

### Canvas Compression Optimization Points

1. **Memory Management**: Use object pools to avoid frequent Canvas creation
2. **Chunk Processing**: Process large images in chunks to avoid memory overflow
3. **Algorithm Selection**: Choose appropriate compression strategies based on image characteristics
4. **Quality Control**: Implement precise quality parameter control
5. **Performance Optimization**: Utilize Web Workers for parallel processing

### Practical Application Recommendations

- **Mobile**: Reduce processing precision, prioritize performance
- **Desktop**: Use more complex algorithms for better results
- **Batch Processing**: Use Workers for parallel processing to improve efficiency
- **Real-time Preview**: Implement progressive compression and preview functionality

Canvas API provides powerful and flexible solutions for frontend image compression. Through proper algorithm design and performance optimization, high-quality image compression functionality can be achieved.

---

**Related Reading:**
- [Fundamentals of Image Compression: Principles and Algorithms](/blog/ImageCompression/image-compression-fundamentals)
- [Web Image Compression Best Practices and Performance Optimization](/blog/ImageCompression/web-image-compression-best-practices)
- [Modern Browser Image Compression Libraries Comparison](/blog/ImageCompression/browser-image-compression-libraries)