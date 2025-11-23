import { ElMessage } from 'element-plus'

/**
 * 认证错误处理工具
 * 用于处理 401 未授权错误
 */

/**
 * 处理认证错误
 * @param status HTTP 状态码
 * @param message 错误信息
 */
export function handleAuthError(status: number, message?: string) {
  if (status === 401) {
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // 判断是过期还是未登录
    const isExpired = message?.includes('过期') || message?.includes('已过期')
    const msg = isExpired ? '当前登录信息已过期，请重新登录' : '当前未登录，请先登录'

    // 显示 Toast 提示
    ElMessage({
      message: msg,
      type: 'warning',
      duration: 3000,
      onClose: () => {
        // 用户关闭提示后，跳转到登录页
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
      }
    })

    return true
  }
  return false
}

/**
 * 检查用户是否已登录
 */
export function isLoggedIn(): boolean {
  return !!localStorage.getItem('token')
}

/**
 * 获取当前用户 token
 */
export function getToken(): string | null {
  return localStorage.getItem('token')
}

/**
 * 清除登录信息
 */
export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/**
 * 跳转到登录页
 */
export function redirectToLogin() {
  window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)
}
