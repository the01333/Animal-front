import { handleAuthError, isLoggedIn } from '@/utils/authHelper'

/**
 * 需要认证的 API 请求包装器
 * 自动处理 401 错误和登录检查
 */

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  credentials?: RequestCredentials
}

/**
 * 发送需要认证的请求
 * @param url 请求 URL
 * @param options 请求选项
 * @returns 响应数据
 */
export async function authRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  // 检查是否已登录
  if (!isLoggedIn()) {
    handleAuthError(401, '未登录')
    throw new Error('当前未登录，请先登录')
  }

  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = token
  }

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      credentials: 'include',
      body: options.body ? JSON.stringify(options.body) : undefined
    })

    // 处理 401 错误
    if (response.status === 401) {
      let errorMessage = '登录信息已过期，请重新登录'
      try {
        const errorData = await response.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch (e) {
        // 忽略 JSON 解析错误
      }

      handleAuthError(401, errorMessage)
      throw new Error(errorMessage)
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('认证请求失败:', error)
    throw error
  }
}

/**
 * 发送 POST 请求（需要认证）
 */
export async function authPost<T = any>(url: string, body?: any): Promise<T> {
  return authRequest<T>(url, {
    method: 'POST',
    body
  })
}

/**
 * 发送 PUT 请求（需要认证）
 */
export async function authPut<T = any>(url: string, body?: any): Promise<T> {
  return authRequest<T>(url, {
    method: 'PUT',
    body
  })
}

/**
 * 发送 DELETE 请求（需要认证）
 */
export async function authDelete<T = any>(url: string): Promise<T> {
  return authRequest<T>(url, {
    method: 'DELETE'
  })
}

/**
 * 发送 GET 请求（需要认证）
 */
export async function authGet<T = any>(url: string): Promise<T> {
  return authRequest<T>(url, {
    method: 'GET'
  })
}
