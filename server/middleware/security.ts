/**
 * 安全中间件：CORS 限制 + 请求体大小限制
 * 
 * - CORS：仅允许自己的域名访问 API
 * - 文件大小：限制上传文件最大 10MB
 */

const ALLOWED_ORIGINS = [
  'https://www.tryutils.com',
  'https://tryutils.com',
]

// 开发环境额外允许 localhost
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://127.0.0.1:3000')
}

const MAX_BODY_SIZE = 10 * 1024 * 1024 // 10MB

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // 仅对 /api/ 路径生效
  if (!path.startsWith('/api/')) {
    return
  }

  // --- CORS 处理 ---
  const origin = getHeader(event, 'origin') || ''
  const isAllowed = ALLOWED_ORIGINS.includes(origin)

  if (isAllowed) {
    setHeader(event, 'Access-Control-Allow-Origin', origin)
  }

  setHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS')
  setHeader(event, 'Access-Control-Allow-Headers', 'Content-Type')
  setHeader(event, 'Vary', 'Origin')

  // 处理 OPTIONS 预检请求
  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }

  // 非允许来源的跨域请求直接拒绝
  if (origin && !isAllowed) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Origin not allowed'
    })
  }

  // --- 请求体大小限制 ---
  const contentLength = getHeader(event, 'content-length')
  if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
    throw createError({
      statusCode: 413,
      statusMessage: `Payload too large. Maximum allowed size is ${MAX_BODY_SIZE / 1024 / 1024}MB`
    })
  }
})
