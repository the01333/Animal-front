const MINIO_LOCAL_BASE = 'http://localhost:9000'
const MINIO_OBJECT_BASE = `${MINIO_LOCAL_BASE}/animal-adopt`
const IP_PORT_PATTERN = /https?:\/\/\d+\.\d+\.\d+\.\d+:9000/g

/**
 * 统一处理图片 URL：
 * 1. 去掉 @ 前缀
 * 2. 将内网 IP 替换为 localhost:9000
 * 3. 相对路径补全 MinIO 前缀
 */
export function processImageUrl(url?: string | null): string {
  if (!url) return ''

  let normalized = url.trim()
  if (!normalized) return ''

  if (normalized.startsWith('@')) {
    normalized = normalized.substring(1)
  }

  normalized = normalized.replace(IP_PORT_PATTERN, MINIO_LOCAL_BASE)

  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `${MINIO_OBJECT_BASE}${normalized.startsWith('/') ? '' : '/'}${normalized}`
  }

  return normalized
}
