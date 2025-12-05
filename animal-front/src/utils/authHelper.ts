import { ElMessage } from 'element-plus'

export function openAuthDialog(tab: 'login' | 'register' = 'login') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('openAuthDialog', {
      detail: { tab }
    })
  )
}

export function handleAuthError(status: number, message?: string) {
  if (status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    const isExpired = message?.includes('过期') || message?.includes('已过期')
    const msg = isExpired ? '当前登录信息已过期，请重新登录' : '当前未登录，请先登录'

    openAuthDialog('login')

    ElMessage({
      message: msg,
      type: 'warning',
      duration: 3000
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
  openAuthDialog('login')
}
